package com.myshop;

import com.myshop.dto.CouponRequest;
import com.myshop.dto.CouponResponse;
import com.myshop.entity.Product;
import com.myshop.entity.User;
import com.myshop.repository.CategoryRepository;
import com.myshop.repository.ProductRepository;
import com.myshop.repository.UserRepository;
import com.myshop.service.CouponService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("dev")
class MyshopApplicationTests {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private CouponService couponService;

    @Test
    @DisplayName("Context loads and DataInitializer seeds sample data")
    void contextLoadsAndSeedsData() {
        // Assert Admin user exists
        assertTrue(userRepository.existsByEmail("admin@myshop.com"), "Admin user should be seeded");
        assertTrue(userRepository.existsByEmail("user@myshop.com"), "Demo user should be seeded");

        // Assert 8 categories seeded
        assertTrue(categoryRepository.count() >= 8, "At least 8 categories should be seeded");

        // Assert 25+ products seeded
        assertTrue(productRepository.count() >= 20, "At least 20 products should be seeded");

        // Assert Deal Radar products exist
        assertFalse(productRepository.findByIsDealRadarTrue().isEmpty(), "Deal radar products should exist");
    }

    @Test
    @DisplayName("Smart Score calculation is within valid range [10, 99]")
    void testSmartScoreCalculation() {
        Product sample = productRepository.findAll().get(0);
        assertNotNull(sample.getSmartScore());
        assertTrue(sample.getSmartScore() >= 10 && sample.getSmartScore() <= 99,
                "Smart score should be between 10 and 99");
    }

    @Test
    @DisplayName("Coupon validation works correctly for SAVE20")
    void testCouponValidation() {
        CouponRequest req = new CouponRequest("SAVE20", 2000.0);
        CouponResponse res = couponService.validateCoupon(req);

        assertTrue(res.isValid(), "Coupon SAVE20 should be valid for cart amount 2000");
        assertEquals(20, res.getDiscountPercentage());
        assertEquals(400.0, res.getDiscountAmount());
    }
}
