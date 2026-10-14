package com.myshop.service;

import com.myshop.dto.AddToCartRequest;
import com.myshop.dto.WishlistDto;
import com.myshop.dto.WishlistItemDto;
import com.myshop.entity.Product;
import com.myshop.entity.User;
import com.myshop.entity.Wishlist;
import com.myshop.entity.WishlistItem;
import com.myshop.exception.ResourceNotFoundException;
import com.myshop.repository.ProductRepository;
import com.myshop.repository.UserRepository;
import com.myshop.repository.WishlistItemRepository;
import com.myshop.repository.WishlistRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class WishlistService {

    private final WishlistRepository wishlistRepository;
    private final WishlistItemRepository wishlistItemRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final CartService cartService;

    public WishlistService(WishlistRepository wishlistRepository,
                           WishlistItemRepository wishlistItemRepository,
                           ProductRepository productRepository,
                           UserRepository userRepository,
                           CartService cartService) {
        this.wishlistRepository = wishlistRepository;
        this.wishlistItemRepository = wishlistItemRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
        this.cartService = cartService;
    }

    @Transactional
    public Wishlist getOrCreateWishlist(Long userId) {
        return wishlistRepository.findByUserId(userId).orElseGet(() -> {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
            Wishlist newWishlist = new Wishlist(user);
            return wishlistRepository.save(newWishlist);
        });
    }

    @Transactional
    public WishlistDto getWishlistDto(Long userId) {
        Wishlist wishlist = getOrCreateWishlist(userId);
        return mapToDto(wishlist);
    }

    @Transactional
    public WishlistDto addToWishlist(Long userId, Long productId) {
        Wishlist wishlist = getOrCreateWishlist(userId);

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + productId));

        if (!wishlistItemRepository.existsByWishlistIdAndProductId(wishlist.getId(), productId)) {
            WishlistItem item = new WishlistItem(wishlist, product);
            wishlistItemRepository.save(item);
        }

        return getWishlistDto(userId);
    }

    @Transactional
    public WishlistDto removeFromWishlist(Long userId, Long productId) {
        Wishlist wishlist = getOrCreateWishlist(userId);
        Optional<WishlistItem> itemOpt = wishlistItemRepository.findByWishlistIdAndProductId(wishlist.getId(), productId);
        itemOpt.ifPresent(wishlistItemRepository::delete);

        return getWishlistDto(userId);
    }

    @Transactional
    public WishlistDto moveToCart(Long userId, Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + productId));

        // Add to cart
        AddToCartRequest req = new AddToCartRequest(productId, 1, null, null);
        cartService.addToCart(userId, req);

        // Remove from wishlist
        return removeFromWishlist(userId, productId);
    }

    public WishlistDto mapToDto(Wishlist wishlist) {
        WishlistDto dto = new WishlistDto();
        dto.setId(wishlist.getId());

        List<WishlistItemDto> items = wishlist.getItems().stream().map(item -> {
            WishlistItemDto itemDto = new WishlistItemDto();
            itemDto.setId(item.getId());
            itemDto.setProductId(item.getProduct().getId());
            itemDto.setProductName(item.getProduct().getName());
            itemDto.setProductImageUrl(item.getProduct().getImageUrl());
            itemDto.setPrice(item.getProduct().getPrice());
            itemDto.setOriginalPrice(item.getProduct().getOriginalPrice());
            itemDto.setDiscount(item.getProduct().getDiscount());
            itemDto.setStock(item.getProduct().getStock());
            itemDto.setRating(item.getProduct().getRating());
            itemDto.setSmartScore(item.getProduct().getSmartScore());
            if (item.getProduct().getCategory() != null) {
                itemDto.setCategoryName(item.getProduct().getCategory().getName());
            }
            itemDto.setAddedAt(item.getAddedAt());
            return itemDto;
        }).collect(Collectors.toList());

        dto.setItems(items);
        return dto;
    }
}
