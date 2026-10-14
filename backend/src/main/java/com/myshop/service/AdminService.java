package com.myshop.service;

import com.myshop.dto.DashboardStatsDto;
import com.myshop.dto.OrderResponse;
import com.myshop.entity.Category;
import com.myshop.entity.Order;
import com.myshop.entity.OrderStatus;
import com.myshop.repository.CategoryRepository;
import com.myshop.repository.OrderRepository;
import com.myshop.repository.ProductRepository;
import com.myshop.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class AdminService {

    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;
    private final CategoryRepository categoryRepository;
    private final OrderService orderService;

    public AdminService(UserRepository userRepository,
                        ProductRepository productRepository,
                        OrderRepository orderRepository,
                        CategoryRepository categoryRepository,
                        OrderService orderService) {
        this.userRepository = userRepository;
        this.productRepository = productRepository;
        this.orderRepository = orderRepository;
        this.categoryRepository = categoryRepository;
        this.orderService = orderService;
    }

    public DashboardStatsDto getDashboardStats() {
        DashboardStatsDto stats = new DashboardStatsDto();

        stats.setTotalUsers(userRepository.count());
        stats.setTotalProducts(productRepository.count());
        stats.setTotalOrders(orderRepository.count());

        Double revenue = orderRepository.calculateTotalRevenue();
        stats.setTotalRevenue(revenue != null ? Math.round(revenue * 100.0) / 100.0 : 0.0);

        // Recent 5 orders
        List<OrderResponse> recent = orderRepository.findAllByOrderByCreatedAtDesc().stream()
                .limit(5)
                .map(orderService::mapToDto)
                .collect(Collectors.toList());
        stats.setRecentOrders(recent);

        // Category product counts
        Map<String, Long> categoryCounts = new HashMap<>();
        for (Category cat : categoryRepository.findAll()) {
            categoryCounts.put(cat.getName(), productRepository.countByCategoryId(cat.getId()));
        }
        stats.setCategoryProductCounts(categoryCounts);

        // Order status counts
        Map<String, Long> statusCounts = new HashMap<>();
        for (OrderStatus st : OrderStatus.values()) {
            statusCounts.put(st.name(), (long) orderRepository.findByStatusOrderByCreatedAtDesc(st).size());
        }
        stats.setOrderStatusCounts(statusCounts);

        return stats;
    }
}
