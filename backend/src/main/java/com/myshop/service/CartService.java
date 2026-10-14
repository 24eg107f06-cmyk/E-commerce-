package com.myshop.service;

import com.myshop.dto.AddToCartRequest;
import com.myshop.dto.CartDto;
import com.myshop.dto.CartItemDto;
import com.myshop.dto.UpdateCartItemRequest;
import com.myshop.entity.*;
import com.myshop.exception.BadRequestException;
import com.myshop.exception.ResourceNotFoundException;
import com.myshop.repository.CartItemRepository;
import com.myshop.repository.CartRepository;
import com.myshop.repository.ProductRepository;
import com.myshop.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public CartService(CartRepository cartRepository,
                       CartItemRepository cartItemRepository,
                       ProductRepository productRepository,
                       UserRepository userRepository) {
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public Cart getOrCreateCart(Long userId) {
        return cartRepository.findByUserId(userId).orElseGet(() -> {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
            Cart newCart = new Cart(user);
            return cartRepository.save(newCart);
        });
    }

    @Transactional
    public CartDto getCartDto(Long userId, String couponCode, Integer couponDiscountPercent) {
        Cart cart = getOrCreateCart(userId);
        return mapToCartDto(cart, couponCode, couponDiscountPercent);
    }

    @Transactional
    public CartDto addToCart(Long userId, AddToCartRequest request) {
        Cart cart = getOrCreateCart(userId);

        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + request.getProductId()));

        if (product.getStock() <= 0) {
            throw new BadRequestException("Product is out of stock");
        }

        int requestedQty = request.getQuantity() != null && request.getQuantity() > 0 ? request.getQuantity() : 1;

        Optional<CartItem> existingItemOpt = cartItemRepository.findByCartIdAndProductIdAndSelectedSizeAndSelectedColor(
                cart.getId(), product.getId(), request.getSelectedSize(), request.getSelectedColor()
        );

        if (existingItemOpt.isPresent()) {
            CartItem item = existingItemOpt.get();
            int newQuantity = item.getQuantity() + requestedQty;
            if (newQuantity > product.getStock()) {
                throw new BadRequestException("Requested quantity exceeds available stock (" + product.getStock() + ")");
            }
            item.setQuantity(newQuantity);
            cartItemRepository.save(item);
        } else {
            if (requestedQty > product.getStock()) {
                throw new BadRequestException("Requested quantity exceeds available stock (" + product.getStock() + ")");
            }
            CartItem newItem = new CartItem(
                    cart,
                    product,
                    requestedQty,
                    request.getSelectedSize(),
                    request.getSelectedColor()
            );
            cartItemRepository.save(newItem);
        }

        return mapToCartDto(cart, null, null);
    }

    @Transactional
    public CartDto updateCartItem(Long userId, Long itemId, UpdateCartItemRequest request) {
        Cart cart = getOrCreateCart(userId);

        CartItem item = cartItemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found with id: " + itemId));

        if (!item.getCart().getId().equals(cart.getId())) {
            throw new BadRequestException("Cart item does not belong to the user's cart");
        }

        if (request.getQuantity() <= 0) {
            cartItemRepository.delete(item);
        } else {
            if (request.getQuantity() > item.getProduct().getStock()) {
                throw new BadRequestException("Requested quantity exceeds available stock (" + item.getProduct().getStock() + ")");
            }
            item.setQuantity(request.getQuantity());
            if (request.getSelectedSize() != null) item.setSelectedSize(request.getSelectedSize());
            if (request.getSelectedColor() != null) item.setSelectedColor(request.getSelectedColor());
            cartItemRepository.save(item);
        }

        return mapToCartDto(cart, null, null);
    }

    @Transactional
    public CartDto removeFromCart(Long userId, Long itemId) {
        Cart cart = getOrCreateCart(userId);

        CartItem item = cartItemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found with id: " + itemId));

        if (!item.getCart().getId().equals(cart.getId())) {
            throw new BadRequestException("Cart item does not belong to current user");
        }

        cartItemRepository.delete(item);
        return mapToCartDto(cart, null, null);
    }

    @Transactional
    public void clearCart(Long userId) {
        Cart cart = getOrCreateCart(userId);
        cart.getItems().clear();
        cartRepository.save(cart);
    }

    public CartDto mapToCartDto(Cart cart, String couponCode, Integer couponDiscountPercent) {
        CartDto dto = new CartDto();
        dto.setId(cart.getId());

        List<CartItemDto> itemDtos = new ArrayList<>();
        double subtotal = 0.0;
        int totalItems = 0;

        for (CartItem item : cart.getItems()) {
            CartItemDto itemDto = new CartItemDto();
            itemDto.setId(item.getId());
            itemDto.setProductId(item.getProduct().getId());
            itemDto.setProductName(item.getProduct().getName());
            itemDto.setProductImageUrl(item.getProduct().getImageUrl());
            itemDto.setPrice(item.getProduct().getPrice());
            itemDto.setOriginalPrice(item.getProduct().getOriginalPrice());
            itemDto.setDiscount(item.getProduct().getDiscount());
            itemDto.setQuantity(item.getQuantity());
            itemDto.setSelectedSize(item.getSelectedSize());
            itemDto.setSelectedColor(item.getSelectedColor());
            itemDto.setStock(item.getProduct().getStock());

            double itemSubtotal = item.getProduct().getPrice() * item.getQuantity();
            itemDto.setSubtotal(Math.round(itemSubtotal * 100.0) / 100.0);

            itemDtos.add(itemDto);
            subtotal += itemSubtotal;
            totalItems += item.getQuantity();
        }

        subtotal = Math.round(subtotal * 100.0) / 100.0;
        dto.setItems(itemDtos);
        dto.setTotalItems(totalItems);
        dto.setSubtotal(subtotal);

        // Calculate discount
        double discountAmount = 0.0;
        if (couponDiscountPercent != null && couponDiscountPercent > 0 && subtotal > 0) {
            discountAmount = Math.round((subtotal * (couponDiscountPercent / 100.0)) * 100.0) / 100.0;
            dto.setCouponCode(couponCode);
            dto.setCouponDiscountPercent(couponDiscountPercent);
        }
        dto.setDiscountAmount(discountAmount);

        // Delivery calculation: Free for orders >= 999
        double deliveryAmount = (subtotal == 0 || subtotal >= 999.0) ? 0.0 : 99.0;
        dto.setDeliveryAmount(deliveryAmount);

        // Tax calculation: 5% GST
        double taxAmount = Math.round((subtotal * 0.05) * 100.0) / 100.0;
        dto.setTaxAmount(taxAmount);

        // Final total
        double total = (subtotal - discountAmount) + deliveryAmount + taxAmount;
        dto.setTotalAmount(Math.max(0.0, Math.round(total * 100.0) / 100.0));

        return dto;
    }
}
