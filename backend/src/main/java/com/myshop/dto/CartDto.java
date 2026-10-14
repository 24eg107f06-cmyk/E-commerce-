package com.myshop.dto;

import java.util.ArrayList;
import java.util.List;

public class CartDto {
    private Long id;
    private List<CartItemDto> items = new ArrayList<>();
    private Integer totalItems = 0;
    private Double subtotal = 0.0;
    private Double discountAmount = 0.0;
    private Double deliveryAmount = 0.0;
    private Double taxAmount = 0.0;
    private Double totalAmount = 0.0;
    private String couponCode;
    private Integer couponDiscountPercent;

    public CartDto() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public List<CartItemDto> getItems() {
        return items;
    }

    public void setItems(List<CartItemDto> items) {
        this.items = items;
    }

    public Integer getTotalItems() {
        return totalItems;
    }

    public void setTotalItems(Integer totalItems) {
        this.totalItems = totalItems;
    }

    public Double getSubtotal() {
        return subtotal;
    }

    public void setSubtotal(Double subtotal) {
        this.subtotal = subtotal;
    }

    public Double getDiscountAmount() {
        return discountAmount;
    }

    public void setDiscountAmount(Double discountAmount) {
        this.discountAmount = discountAmount;
    }

    public Double getDeliveryAmount() {
        return deliveryAmount;
    }

    public void setDeliveryAmount(Double deliveryAmount) {
        this.deliveryAmount = deliveryAmount;
    }

    public Double getTaxAmount() {
        return taxAmount;
    }

    public void setTaxAmount(Double taxAmount) {
        this.taxAmount = taxAmount;
    }

    public Double getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(Double totalAmount) {
        this.totalAmount = totalAmount;
    }

    public String getCouponCode() {
        return couponCode;
    }

    public void setCouponCode(String couponCode) {
        this.couponCode = couponCode;
    }

    public Integer getCouponDiscountPercent() {
        return couponDiscountPercent;
    }

    public void setCouponDiscountPercent(Integer couponDiscountPercent) {
        this.couponDiscountPercent = couponDiscountPercent;
    }
}
