package com.myshop.controller;

import com.myshop.dto.ApiResponse;
import com.myshop.dto.OrderRequest;
import com.myshop.dto.OrderResponse;
import com.myshop.security.UserPrincipal;
import com.myshop.service.OrderService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<OrderResponse>> createOrder(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @Valid @RequestBody OrderRequest request
    ) {
        OrderResponse order = orderService.createOrder(userPrincipal.getId(), request);
        return new ResponseEntity<>(ApiResponse.success("Order placed successfully", order), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<OrderResponse>>> getUserOrders(
            @AuthenticationPrincipal UserPrincipal userPrincipal
    ) {
        List<OrderResponse> orders = orderService.getUserOrders(userPrincipal.getId());
        return ResponseEntity.ok(ApiResponse.success("Orders retrieved successfully", orders));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<OrderResponse>> getOrderById(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable Long id
    ) {
        boolean isAdmin = userPrincipal.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        OrderResponse order = orderService.getOrderById(id, userPrincipal.getId(), isAdmin);
        return ResponseEntity.ok(ApiResponse.success("Order retrieved successfully", order));
    }

    @GetMapping("/number/{orderNumber}")
    public ResponseEntity<ApiResponse<OrderResponse>> getOrderByNumber(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable String orderNumber
    ) {
        boolean isAdmin = userPrincipal.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        OrderResponse order = orderService.getOrderByNumber(orderNumber, userPrincipal.getId(), isAdmin);
        return ResponseEntity.ok(ApiResponse.success("Order retrieved successfully", order));
    }
}
