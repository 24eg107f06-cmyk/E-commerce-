package com.myshop.repository;

import com.myshop.entity.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    Optional<CartItem> findByCartIdAndProductIdAndSelectedSizeAndSelectedColor(
            Long cartId, Long productId, String selectedSize, String selectedColor
    );
}
