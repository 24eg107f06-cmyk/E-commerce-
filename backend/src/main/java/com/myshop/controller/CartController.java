package com.myshop.controller;

import com.myshop.dto.AddToCartRequest;
import com.myshop.dto.ApiResponse;
import com.myshop.dto.CartDto;
import com.myshop.dto.UpdateCartItemRequest;
import com.myshop.security.UserPrincipal;
import com.myshop.service.CartService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<CartDto>> getCart(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @RequestParam(required = false) String couponCode,
            @RequestParam(required = false) Integer couponDiscountPercent
    ) {
        CartDto cart = cartService.getCartDto(userPrincipal.getId(), couponCode, couponDiscountPercent);
        return ResponseEntity.ok(ApiResponse.success("Cart retrieved successfully", cart));
    }

    @PostMapping("/items")
    public ResponseEntity<ApiResponse<CartDto>> addToCart(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @Valid @RequestBody AddToCartRequest request
    ) {
        CartDto cart = cartService.addToCart(userPrincipal.getId(), request);
        return ResponseEntity.ok(ApiResponse.success("Item added to cart", cart));
    }

    @PutMapping("/items/{id}")
    public ResponseEntity<ApiResponse<CartDto>> updateCartItem(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable Long id,
            @Valid @RequestBody UpdateCartItemRequest request
    ) {
        CartDto cart = cartService.updateCartItem(userPrincipal.getId(), id, request);
        return ResponseEntity.ok(ApiResponse.success("Cart item updated", cart));
    }

    @DeleteMapping("/items/{id}")
    public ResponseEntity<ApiResponse<CartDto>> removeFromCart(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable Long id
    ) {
        CartDto cart = cartService.removeFromCart(userPrincipal.getId(), id);
        return ResponseEntity.ok(ApiResponse.success("Item removed from cart", cart));
    }

    @DeleteMapping
    public ResponseEntity<ApiResponse<Void>> clearCart(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        cartService.clearCart(userPrincipal.getId());
        return ResponseEntity.ok(ApiResponse.success("Cart cleared"));
    }
}
