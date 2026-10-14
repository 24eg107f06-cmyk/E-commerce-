package com.myshop.dto;

import java.util.List;
import java.util.Map;

public class DashboardStatsDto {
    private long totalUsers;
    private long totalProducts;
    private long totalOrders;
    private double totalRevenue;
    private List<OrderResponse> recentOrders;
    private Map<String, Long> categoryProductCounts;
    private Map<String, Long> orderStatusCounts;

    public DashboardStatsDto() {
    }

    public long getTotalUsers() {
        return totalUsers;
    }

    public void setTotalUsers(long totalUsers) {
        this.totalUsers = totalUsers;
    }

    public long getTotalProducts() {
        return totalProducts;
    }

    public void setTotalProducts(long totalProducts) {
        this.totalProducts = totalProducts;
    }

    public long getTotalOrders() {
        return totalOrders;
    }

    public void setTotalOrders(long totalOrders) {
        this.totalOrders = totalOrders;
    }

    public double getTotalRevenue() {
        return totalRevenue;
    }

    public void setTotalRevenue(double totalRevenue) {
        this.totalRevenue = totalRevenue;
    }

    public List<OrderResponse> getRecentOrders() {
        return recentOrders;
    }

    public void setRecentOrders(List<OrderResponse> recentOrders) {
        this.recentOrders = recentOrders;
    }

    public Map<String, Long> getCategoryProductCounts() {
        return categoryProductCounts;
    }

    public void setCategoryProductCounts(Map<String, Long> categoryProductCounts) {
        this.categoryProductCounts = categoryProductCounts;
    }

    public Map<String, Long> getOrderStatusCounts() {
        return orderStatusCounts;
    }

    public void setOrderStatusCounts(Map<String, Long> orderStatusCounts) {
        this.orderStatusCounts = orderStatusCounts;
    }
}
