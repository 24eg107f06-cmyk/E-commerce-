package com.myshop.controller;

import com.myshop.dto.ApiResponse;
import com.myshop.dto.ReviewDto;
import com.myshop.dto.ReviewRequest;
import com.myshop.security.UserPrincipal;
import com.myshop.service.ReviewService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    private final ReviewService reviewService;

    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    @GetMapping("/product/{productId}")
    public ResponseEntity<ApiResponse<List<ReviewDto>>> getProductReviews(@PathVariable Long productId) {
        List<ReviewDto> reviews = reviewService.getReviewsByProduct(productId);
        return ResponseEntity.ok(ApiResponse.success("Reviews retrieved successfully", reviews));
    }

    @PostMapping("/product/{productId}")
    public ResponseEntity<ApiResponse<ReviewDto>> addReview(
            @PathVariable Long productId,
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @Valid @RequestBody ReviewRequest request
    ) {
        ReviewDto review = reviewService.addReview(productId, userPrincipal.getId(), request);
        return new ResponseEntity<>(ApiResponse.success("Review posted successfully", review), HttpStatus.CREATED);
    }
}
