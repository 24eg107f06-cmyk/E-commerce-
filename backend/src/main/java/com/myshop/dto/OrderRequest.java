package com.myshop.dto;

import jakarta.validation.constraints.NotBlank;
import java.util.List;

public class OrderRequest {

    @NotBlank(message = "Shipping full name is required")
    private String shippingFullName;

    @NotBlank(message = "Shipping phone is required")
    private String shippingPhone;

    @NotBlank(message = "Shipping street address is required")
    private String shippingStreet;

    @NotBlank(message = "Shipping city is required")
    private String shippingCity;

    @NotBlank(message = "Shipping state is required")
    private String shippingState;

    @NotBlank(message = "Shipping pincode is required")
    private String shippingPincode;

    @NotBlank(message = "Payment method is required")
    private String paymentMethod; // "UPI", "CARD", "COD"

    private String couponCode;
    private Double deliveryAmount = 0.0;

    // Optional direct buy items; if empty, uses the user's cart
    private List<AddToCartRequest> directItems;

    public OrderRequest() {
    }

    public String getShippingFullName() {
        return shippingFullName;
    }

    public void setShippingFullName(String shippingFullName) {
        this.shippingFullName = shippingFullName;
    }

    public String getShippingPhone() {
        return shippingPhone;
    }

    public void setShippingPhone(String shippingPhone) {
        this.shippingPhone = shippingPhone;
    }

    public String getShippingStreet() {
        return shippingStreet;
    }

    public void setShippingStreet(String shippingStreet) {
        this.shippingStreet = shippingStreet;
    }

    public String getShippingCity() {
        return shippingCity;
    }

    public void setShippingCity(String shippingCity) {
        this.shippingCity = shippingCity;
    }

    public String getShippingState() {
        return shippingState;
    }

    public void setShippingState(String shippingState) {
        this.shippingState = shippingState;
    }

    public String getShippingPincode() {
        return shippingPincode;
    }

    public void setShippingPincode(String shippingPincode) {
        this.shippingPincode = shippingPincode;
    }

    public String getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    public String getCouponCode() {
        return couponCode;
    }

    public void setCouponCode(String couponCode) {
        this.couponCode = couponCode;
    }

    public Double getDeliveryAmount() {
        return deliveryAmount;
    }

    public void setDeliveryAmount(Double deliveryAmount) {
        this.deliveryAmount = deliveryAmount;
    }

    public List<AddToCartRequest> getDirectItems() {
        return directItems;
    }

    public void setDirectItems(List<AddToCartRequest> directItems) {
        this.directItems = directItems;
    }
}
