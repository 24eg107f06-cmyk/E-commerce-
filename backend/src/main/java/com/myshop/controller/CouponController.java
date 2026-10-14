package com.myshop.controller;

import com.myshop.dto.ApiResponse;
import com.myshop.dto.CouponRequest;
import com.myshop.dto.CouponResponse;
import com.myshop.entity.Coupon;
import com.myshop.service.CouponService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/coupons")
public class CouponController {

    private final CouponService couponService;

    public CouponController(CouponService couponService) {
        this.couponService = couponService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Coupon>>> getAllCoupons() {
        List<Coupon> coupons = couponService.getAllCoupons();
        return ResponseEntity.ok(ApiResponse.success("Coupons retrieved successfully", coupons));
    }

    @PostMapping("/validate")
    public ResponseEntity<ApiResponse<CouponResponse>> validateCoupon(@Valid @RequestBody CouponRequest request) {
        CouponResponse response = couponService.validateCoupon(request);
        return ResponseEntity.ok(ApiResponse.success(response.getMessage(), response));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Coupon>> createCoupon(@Valid @RequestBody Coupon coupon) {
        Coupon created = couponService.createCoupon(coupon);
        return new ResponseEntity<>(ApiResponse.success("Coupon created successfully", created), HttpStatus.CREATED);
    }
}
