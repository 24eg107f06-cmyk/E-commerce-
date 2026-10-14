package com.myshop.service;

import com.myshop.dto.CouponRequest;
import com.myshop.dto.CouponResponse;
import com.myshop.entity.Coupon;
import com.myshop.exception.ResourceNotFoundException;
import com.myshop.repository.CouponRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CouponService {

    private final CouponRepository couponRepository;

    public CouponService(CouponRepository couponRepository) {
        this.couponRepository = couponRepository;
    }

    public List<Coupon> getAllCoupons() {
        return couponRepository.findAll();
    }

    public CouponResponse validateCoupon(CouponRequest request) {
        String code = request.getCode().trim();
        Coupon coupon = couponRepository.findByCodeIgnoreCaseAndActiveTrue(code)
                .orElse(null);

        if (coupon == null) {
            return new CouponResponse(false, code, 0, 0.0, "Invalid coupon code");
        }

        if (request.getCartAmount() == null || request.getCartAmount() < coupon.getMinOrderAmount()) {
            return new CouponResponse(
                    false,
                    code,
                    0,
                    0.0,
                    "Order amount must be at least ₹" + Math.round(coupon.getMinOrderAmount()) + " to use this coupon"
            );
        }

        double calculatedDiscount = (request.getCartAmount() * coupon.getDiscountPercentage()) / 100.0;
        if (coupon.getMaxDiscountAmount() != null && calculatedDiscount > coupon.getMaxDiscountAmount()) {
            calculatedDiscount = coupon.getMaxDiscountAmount();
        }

        calculatedDiscount = Math.round(calculatedDiscount * 100.0) / 100.0;

        return new CouponResponse(
                true,
                coupon.getCode(),
                coupon.getDiscountPercentage(),
                calculatedDiscount,
                "Coupon applied successfully! You saved ₹" + calculatedDiscount
        );
    }

    public Coupon createCoupon(Coupon coupon) {
        return couponRepository.save(coupon);
    }
}
