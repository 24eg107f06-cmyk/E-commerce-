package com.myshop.controller;

import com.myshop.dto.ApiResponse;
import com.myshop.dto.WishlistDto;
import com.myshop.security.UserPrincipal;
import com.myshop.service.WishlistService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/wishlist")
public class WishlistController {

    private final WishlistService wishlistService;

    public WishlistController(WishlistService wishlistService) {
        this.wishlistService = wishlistService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<WishlistDto>> getWishlist(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        WishlistDto wishlist = wishlistService.getWishlistDto(userPrincipal.getId());
        return ResponseEntity.ok(ApiResponse.success("Wishlist retrieved successfully", wishlist));
    }

    @PostMapping("/{productId}")
    public ResponseEntity<ApiResponse<WishlistDto>> addToWishlist(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable Long productId
    ) {
        WishlistDto wishlist = wishlistService.addToWishlist(userPrincipal.getId(), productId);
        return ResponseEntity.ok(ApiResponse.success("Product added to wishlist", wishlist));
    }

    @DeleteMapping("/{productId}")
    public ResponseEntity<ApiResponse<WishlistDto>> removeFromWishlist(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable Long productId
    ) {
        WishlistDto wishlist = wishlistService.removeFromWishlist(userPrincipal.getId(), productId);
        return ResponseEntity.ok(ApiResponse.success("Product removed from wishlist", wishlist));
    }

    @PostMapping("/{productId}/move-to-cart")
    public ResponseEntity<ApiResponse<WishlistDto>> moveToCart(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable Long productId
    ) {
        WishlistDto wishlist = wishlistService.moveToCart(userPrincipal.getId(), productId);
        return ResponseEntity.ok(ApiResponse.success("Product moved to cart", wishlist));
    }
}
