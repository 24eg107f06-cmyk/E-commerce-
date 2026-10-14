package com.myshop.controller;

import com.myshop.dto.ApiResponse;
import com.myshop.dto.DashboardStatsDto;
import com.myshop.dto.OrderResponse;
import com.myshop.dto.UpdateOrderStatusRequest;
import com.myshop.entity.OrderStatus;
import com.myshop.service.AdminService;
import com.myshop.service.OrderService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final AdminService adminService;
    private final OrderService orderService;

    public AdminController(AdminService adminService, OrderService orderService) {
        this.adminService = adminService;
        this.orderService = orderService;
    }

    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<DashboardStatsDto>> getDashboardStats() {
        DashboardStatsDto stats = adminService.getDashboardStats();
        return ResponseEntity.ok(ApiResponse.success("Dashboard metrics retrieved successfully", stats));
    }

    @GetMapping("/orders")
    public ResponseEntity<ApiResponse<List<OrderResponse>>> getAllOrders(
            @RequestParam(required = false) String status
    ) {
        OrderStatus orderStatus = null;
        if (status != null && !status.isBlank() && !"ALL".equalsIgnoreCase(status)) {
            try {
                orderStatus = OrderStatus.valueOf(status.toUpperCase());
            } catch (IllegalArgumentException ignored) {}
        }

        List<OrderResponse> orders = orderService.getAllOrders(orderStatus);
        return ResponseEntity.ok(ApiResponse.success("Orders retrieved successfully", orders));
    }

    @PutMapping("/orders/{id}/status")
    public ResponseEntity<ApiResponse<OrderResponse>> updateOrderStatus(
            @PathVariable Long id,
            @Valid @RequestBody UpdateOrderStatusRequest request
    ) {
        OrderStatus status = OrderStatus.valueOf(request.getStatus().toUpperCase());
        OrderResponse updated = orderService.updateOrderStatus(id, status);
        return ResponseEntity.ok(ApiResponse.success("Order status updated successfully", updated));
    }
}
