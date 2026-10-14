-- =========================================================
-- MYSHOP FULL-STACK E-COMMERCE DATABASE INITIALIZATION SCRIPT
-- MySQL 8.x / 9.x Compatible Schema & Seed Data
-- =========================================================

CREATE DATABASE IF NOT EXISTS `myshop_db` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `myshop_db`;

-- 1. USERS TABLE
CREATE TABLE IF NOT EXISTS `users` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `email` VARCHAR(100) NOT NULL UNIQUE,
    `password` VARCHAR(255) NOT NULL,
    `full_name` VARCHAR(100) NOT NULL,
    `phone` VARCHAR(20),
    `role` VARCHAR(20) NOT NULL DEFAULT 'ROLE_USER',
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS `categories` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(100) NOT NULL UNIQUE,
    `slug` VARCHAR(100) NOT NULL UNIQUE,
    `description` VARCHAR(500),
    `icon` VARCHAR(50),
    `image_url` VARCHAR(500)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS `products` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(200) NOT NULL,
    `description` TEXT,
    `price` DOUBLE NOT NULL,
    `original_price` DOUBLE,
    `discount` INT DEFAULT 0,
    `category_id` BIGINT NOT NULL,
    `image_url` VARCHAR(800) NOT NULL,
    `additional_images` TEXT,
    `rating` DOUBLE DEFAULT 4.5,
    `review_count` INT DEFAULT 0,
    `stock` INT NOT NULL DEFAULT 10,
    `tags` VARCHAR(200),
    `brand` VARCHAR(100),
    `sizes` VARCHAR(100),
    `colors` VARCHAR(100),
    `smart_score` INT DEFAULT 85,
    `is_deal_radar` BOOLEAN DEFAULT FALSE,
    `is_featured` BOOLEAN DEFAULT FALSE,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. ADDRESSES TABLE
CREATE TABLE IF NOT EXISTS `addresses` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `user_id` BIGINT NOT NULL,
    `full_name` VARCHAR(100) NOT NULL,
    `phone` VARCHAR(20) NOT NULL,
    `street` VARCHAR(255) NOT NULL,
    `city` VARCHAR(100) NOT NULL,
    `state` VARCHAR(100) NOT NULL,
    `pincode` VARCHAR(20) NOT NULL,
    `is_default` BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 5. CART TABLE
CREATE TABLE IF NOT EXISTS `cart` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `user_id` BIGINT NOT NULL UNIQUE,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 6. CART ITEMS TABLE
CREATE TABLE IF NOT EXISTS `cart_items` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `cart_id` BIGINT NOT NULL,
    `product_id` BIGINT NOT NULL,
    `quantity` INT NOT NULL DEFAULT 1,
    `selected_size` VARCHAR(50),
    `selected_color` VARCHAR(50),
    FOREIGN KEY (`cart_id`) REFERENCES `cart`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 7. WISHLIST TABLE
CREATE TABLE IF NOT EXISTS `wishlists` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `user_id` BIGINT NOT NULL UNIQUE,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 8. WISHLIST ITEMS TABLE
CREATE TABLE IF NOT EXISTS `wishlist_items` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `wishlist_id` BIGINT NOT NULL,
    `product_id` BIGINT NOT NULL,
    `added_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`wishlist_id`) REFERENCES `wishlists`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 9. ORDERS TABLE
CREATE TABLE IF NOT EXISTS `orders` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `order_number` VARCHAR(50) NOT NULL UNIQUE,
    `user_id` BIGINT NOT NULL,
    `total_amount` DOUBLE NOT NULL,
    `discount_amount` DOUBLE DEFAULT 0,
    `delivery_amount` DOUBLE DEFAULT 0,
    `tax_amount` DOUBLE DEFAULT 0,
    `final_amount` DOUBLE NOT NULL,
    `coupon_code` VARCHAR(50),
    `status` VARCHAR(30) NOT NULL DEFAULT 'PLACED',
    `payment_method` VARCHAR(50) NOT NULL,
    `payment_status` VARCHAR(50) NOT NULL DEFAULT 'PAID',
    `shipping_full_name` VARCHAR(100) NOT NULL,
    `shipping_phone` VARCHAR(20) NOT NULL,
    `shipping_street` VARCHAR(255) NOT NULL,
    `shipping_city` VARCHAR(100) NOT NULL,
    `shipping_state` VARCHAR(100) NOT NULL,
    `shipping_pincode` VARCHAR(20) NOT NULL,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 10. ORDER ITEMS TABLE
CREATE TABLE IF NOT EXISTS `order_items` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `order_id` BIGINT NOT NULL,
    `product_id` BIGINT,
    `product_name` VARCHAR(200) NOT NULL,
    `product_image_url` VARCHAR(800),
    `price` DOUBLE NOT NULL,
    `quantity` INT NOT NULL,
    `selected_size` VARCHAR(50),
    `selected_color` VARCHAR(50),
    `subtotal` DOUBLE NOT NULL,
    FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 11. COUPONS TABLE
CREATE TABLE IF NOT EXISTS `coupons` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `code` VARCHAR(50) NOT NULL UNIQUE,
    `discount_percentage` INT NOT NULL,
    `max_discount_amount` DOUBLE,
    `min_order_amount` DOUBLE DEFAULT 0,
    `active` BOOLEAN NOT NULL DEFAULT TRUE,
    `description` VARCHAR(200)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 12. REVIEWS TABLE
CREATE TABLE IF NOT EXISTS `reviews` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `product_id` BIGINT NOT NULL,
    `user_id` BIGINT NOT NULL,
    `rating` DOUBLE NOT NULL,
    `comment` TEXT,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =========================================================
-- INDEXES FOR MAXIMUM QUERY PERFORMANCE
-- =========================================================
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_price ON products(price);
CREATE INDEX idx_products_smart_score ON products(smart_score);
CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
