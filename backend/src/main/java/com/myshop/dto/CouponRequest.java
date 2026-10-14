package com.myshop.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class CouponRequest {

    @NotBlank(message = "Coupon code is required")
    private String code;

    @NotNull(message = "Cart total amount is required")
    private Double cartAmount;

    public CouponRequest() {
    }

    public CouponRequest(String code, Double cartAmount) {
        this.code = code;
        this.cartAmount = cartAmount;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public Double getCartAmount() {
        return cartAmount;
    }

    public void setCartAmount(Double cartAmount) {
        this.cartAmount = cartAmount;
    }
}
