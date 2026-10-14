package com.myshop.service;

import com.myshop.dto.AuthRequest;
import com.myshop.dto.AuthResponse;
import com.myshop.dto.RegisterRequest;
import com.myshop.entity.Cart;
import com.myshop.entity.Role;
import com.myshop.entity.User;
import com.myshop.entity.Wishlist;
import com.myshop.exception.BadRequestException;
import com.myshop.repository.CartRepository;
import com.myshop.repository.UserRepository;
import com.myshop.repository.WishlistRepository;
import com.myshop.security.JwtTokenProvider;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final CartRepository cartRepository;
    private final WishlistRepository wishlistRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;

    public AuthService(AuthenticationManager authenticationManager,
                       UserRepository userRepository,
                       CartRepository cartRepository,
                       WishlistRepository wishlistRepository,
                       PasswordEncoder passwordEncoder,
                       JwtTokenProvider tokenProvider) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.cartRepository = cartRepository;
        this.wishlistRepository = wishlistRepository;
        this.passwordEncoder = passwordEncoder;
        this.tokenProvider = tokenProvider;
    }

    public AuthResponse login(AuthRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail().toLowerCase().trim(), request.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String token = tokenProvider.generateToken(authentication);

        User user = userRepository.findByEmail(request.getEmail().toLowerCase().trim())
                .orElseThrow(() -> new BadRequestException("User not found"));

        return new AuthResponse(
                token,
                user.getId(),
                user.getEmail(),
                user.getFullName(),
                user.getRole().name()
        );
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        String email = request.getEmail().toLowerCase().trim();

        if (userRepository.existsByEmail(email)) {
            throw new BadRequestException("This email is already registered.");
        }

        if (request.getConfirmPassword() != null && !request.getPassword().equals(request.getConfirmPassword())) {
            throw new BadRequestException("Passwords do not match");
        }

        User user = new User(
                email,
                passwordEncoder.encode(request.getPassword()),
                request.getFullName(),
                request.getPhone(),
                Role.ROLE_USER
        );

        User savedUser = userRepository.save(user);

        // Initialize empty cart & wishlist
        Cart cart = new Cart(savedUser);
        cartRepository.save(cart);

        Wishlist wishlist = new Wishlist(savedUser);
        wishlistRepository.save(wishlist);

        String token = tokenProvider.generateTokenFromUser(savedUser.getId(), savedUser.getEmail(), savedUser.getFullName());

        return new AuthResponse(
                token,
                savedUser.getId(),
                savedUser.getEmail(),
                savedUser.getFullName(),
                savedUser.getRole().name()
        );
    }
}
