package com.myshop.controller;

import com.myshop.dto.AddressDto;
import com.myshop.dto.ApiResponse;
import com.myshop.dto.UpdateProfileRequest;
import com.myshop.dto.UserProfileResponse;
import com.myshop.security.UserPrincipal;
import com.myshop.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<UserProfileResponse>> getProfile(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        UserProfileResponse profile = userService.getProfile(userPrincipal.getId());
        return ResponseEntity.ok(ApiResponse.success("Profile retrieved successfully", profile));
    }

    @PutMapping("/profile")
    public ResponseEntity<ApiResponse<UserProfileResponse>> updateProfile(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @RequestBody UpdateProfileRequest request
    ) {
        UserProfileResponse updated = userService.updateProfile(userPrincipal.getId(), request);
        return ResponseEntity.ok(ApiResponse.success("Profile updated successfully", updated));
    }

    @PostMapping("/addresses")
    public ResponseEntity<ApiResponse<AddressDto>> addAddress(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @Valid @RequestBody AddressDto dto
    ) {
        AddressDto saved = userService.addAddress(userPrincipal.getId(), dto);
        return ResponseEntity.ok(ApiResponse.success("Address added successfully", saved));
    }

    @DeleteMapping("/addresses/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteAddress(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable Long id
    ) {
        userService.deleteAddress(userPrincipal.getId(), id);
        return ResponseEntity.ok(ApiResponse.success("Address deleted successfully"));
    }
}
