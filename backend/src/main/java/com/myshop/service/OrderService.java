package com.myshop.service;

import com.myshop.dto.AddToCartRequest;
import com.myshop.dto.OrderItemDto;
import com.myshop.dto.OrderRequest;
import com.myshop.dto.OrderResponse;
import com.myshop.entity.*;
import com.myshop.exception.BadRequestException;
import com.myshop.exception.ResourceNotFoundException;
import com.myshop.repository.CartRepository;
import com.myshop.repository.CouponRepository;
import com.myshop.repository.OrderRepository;
import com.myshop.repository.ProductRepository;
import com.myshop.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import java.util.stream.Collectors;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final CartRepository cartRepository;
    private final CouponRepository couponRepository;

    public OrderService(OrderRepository orderRepository,
                        ProductRepository productRepository,
                        UserRepository userRepository,
                        CartRepository cartRepository,
                        CouponRepository couponRepository) {
        this.orderRepository = orderRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
        this.cartRepository = cartRepository;
        this.couponRepository = couponRepository;
    }

    @Transactional
    public OrderResponse createOrder(Long userId, OrderRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        Order order = new Order();
        order.setUser(user);
        order.setOrderNumber("MS-" + System.currentTimeMillis() % 10000000 + "-" + (100 + new Random().nextInt(900)));
        order.setPaymentMethod(request.getPaymentMethod() != null ? request.getPaymentMethod() : "COD");
        order.setPaymentStatus("COD".equalsIgnoreCase(request.getPaymentMethod()) ? "PENDING" : "PAID");
        order.setStatus(OrderStatus.PLACED);

        // Shipping address
        order.setShippingFullName(request.getShippingFullName());
        order.setShippingPhone(request.getShippingPhone());
        order.setShippingStreet(request.getShippingStreet());
        order.setShippingCity(request.getShippingCity());
        order.setShippingState(request.getShippingState());
        order.setShippingPincode(request.getShippingPincode());

        List<OrderItem> orderItems = new ArrayList<>();
        double subtotal = 0.0;

        if (request.getDirectItems() != null && !request.getDirectItems().isEmpty()) {
            for (AddToCartRequest itemReq : request.getDirectItems()) {
                Product product = productRepository.findById(itemReq.getProductId())
                        .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + itemReq.getProductId()));

                if (product.getStock() < itemReq.getQuantity()) {
                    throw new BadRequestException("Product " + product.getName() + " does not have enough stock");
                }

                // Deduct stock
                product.setStock(product.getStock() - itemReq.getQuantity());
                productRepository.save(product);

                double itemSubtotal = product.getPrice() * itemReq.getQuantity();
                subtotal += itemSubtotal;

                OrderItem orderItem = new OrderItem(
                        order,
                        product,
                        product.getName(),
                        product.getImageUrl(),
                        product.getPrice(),
                        itemReq.getQuantity(),
                        itemReq.getSelectedSize(),
                        itemReq.getSelectedColor(),
                        itemSubtotal
                );
                orderItems.add(orderItem);
            }
        } else {
            Cart cart = cartRepository.findByUserId(userId)
                    .orElseThrow(() -> new BadRequestException("Cart is empty"));

            if (cart.getItems() == null || cart.getItems().isEmpty()) {
                throw new BadRequestException("Cannot place order with an empty cart");
            }

            for (CartItem cartItem : cart.getItems()) {
                Product product = cartItem.getProduct();
                if (product.getStock() < cartItem.getQuantity()) {
                    throw new BadRequestException("Product " + product.getName() + " does not have enough stock");
                }

                // Deduct stock
                product.setStock(product.getStock() - cartItem.getQuantity());
                productRepository.save(product);

                double itemSubtotal = product.getPrice() * cartItem.getQuantity();
                subtotal += itemSubtotal;

                OrderItem orderItem = new OrderItem(
                        order,
                        product,
                        product.getName(),
                        product.getImageUrl(),
                        product.getPrice(),
                        cartItem.getQuantity(),
                        cartItem.getSelectedSize(),
                        cartItem.getSelectedColor(),
                        itemSubtotal
                );
                orderItems.add(orderItem);
            }

            // Clear the cart
            cart.getItems().clear();
            cartRepository.save(cart);
        }

        order.setItems(orderItems);
        subtotal = Math.round(subtotal * 100.0) / 100.0;
        order.setTotalAmount(subtotal);

        // Apply coupon discount if valid
        double discountAmount = 0.0;
        if (request.getCouponCode() != null && !request.getCouponCode().isBlank()) {
            Coupon coupon = couponRepository.findByCodeIgnoreCaseAndActiveTrue(request.getCouponCode().trim())
                    .orElse(null);
            if (coupon != null && subtotal >= coupon.getMinOrderAmount()) {
                discountAmount = (subtotal * coupon.getDiscountPercentage()) / 100.0;
                if (coupon.getMaxDiscountAmount() != null && discountAmount > coupon.getMaxDiscountAmount()) {
                    discountAmount = coupon.getMaxDiscountAmount();
                }
                order.setCouponCode(coupon.getCode());
            }
        }
        discountAmount = Math.round(discountAmount * 100.0) / 100.0;
        order.setDiscountAmount(discountAmount);

        // Delivery
        double deliveryAmount = (subtotal == 0 || subtotal >= 999.0) ? 0.0 : 99.0;
        if (request.getDeliveryAmount() != null) {
            deliveryAmount = request.getDeliveryAmount();
        }
        order.setDeliveryAmount(deliveryAmount);

        // Tax 5%
        double taxAmount = Math.round((subtotal * 0.05) * 100.0) / 100.0;
        order.setTaxAmount(taxAmount);

        // Final amount
        double finalAmount = (subtotal - discountAmount) + deliveryAmount + taxAmount;
        order.setFinalAmount(Math.max(0.0, Math.round(finalAmount * 100.0) / 100.0));

        Order savedOrder = orderRepository.save(order);
        return mapToDto(savedOrder);
    }

    public List<OrderResponse> getUserOrders(Long userId) {
        return orderRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public OrderResponse getOrderById(Long orderId, Long userId, boolean isAdmin) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + orderId));

        if (!isAdmin && !order.getUser().getId().equals(userId)) {
            throw new BadRequestException("Access denied: You do not own this order");
        }

        return mapToDto(order);
    }

    public OrderResponse getOrderByNumber(String orderNumber, Long userId, boolean isAdmin) {
        Order order = orderRepository.findByOrderNumber(orderNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with number: " + orderNumber));

        if (!isAdmin && !order.getUser().getId().equals(userId)) {
            throw new BadRequestException("Access denied: You do not own this order");
        }

        return mapToDto(order);
    }

    public List<OrderResponse> getAllOrders(OrderStatus status) {
        List<Order> orders = (status != null)
                ? orderRepository.findByStatusOrderByCreatedAtDesc(status)
                : orderRepository.findAllByOrderByCreatedAtDesc();

        return orders.stream().map(this::mapToDto).collect(Collectors.toList());
    }

    @Transactional
    public OrderResponse updateOrderStatus(Long orderId, OrderStatus status) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + orderId));

        order.setStatus(status);
        if (status == OrderStatus.DELIVERED) {
            order.setPaymentStatus("PAID");
        }
        return mapToDto(orderRepository.save(order));
    }

    public OrderResponse mapToDto(Order order) {
        OrderResponse dto = new OrderResponse();
        dto.setId(order.getId());
        dto.setOrderNumber(order.getOrderNumber());
        if (order.getUser() != null) {
            dto.setUserId(order.getUser().getId());
            dto.setUserEmail(order.getUser().getEmail());
            dto.setUserFullName(order.getUser().getFullName());
        }
        dto.setTotalAmount(order.getTotalAmount());
        dto.setDiscountAmount(order.getDiscountAmount());
        dto.setDeliveryAmount(order.getDeliveryAmount());
        dto.setTaxAmount(order.getTaxAmount());
        dto.setFinalAmount(order.getFinalAmount());
        dto.setCouponCode(order.getCouponCode());
        dto.setStatus(order.getStatus().name());
        dto.setPaymentMethod(order.getPaymentMethod());
        dto.setPaymentStatus(order.getPaymentStatus());

        dto.setShippingFullName(order.getShippingFullName());
        dto.setShippingPhone(order.getShippingPhone());
        dto.setShippingStreet(order.getShippingStreet());
        dto.setShippingCity(order.getShippingCity());
        dto.setShippingState(order.getShippingState());
        dto.setShippingPincode(order.getShippingPincode());

        dto.setCreatedAt(order.getCreatedAt());
        dto.setUpdatedAt(order.getUpdatedAt());

        List<OrderItemDto> itemDtos = order.getItems().stream().map(item -> new OrderItemDto(
                item.getId(),
                item.getProduct() != null ? item.getProduct().getId() : null,
                item.getProductName(),
                item.getProductImageUrl(),
                item.getPrice(),
                item.getQuantity(),
                item.getSelectedSize(),
                item.getSelectedColor(),
                item.getSubtotal()
        )).collect(Collectors.toList());

        dto.setItems(itemDtos);
        return dto;
    }
}
