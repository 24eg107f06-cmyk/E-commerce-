package com.myshop.service;

import com.myshop.dto.ReviewDto;
import com.myshop.dto.ReviewRequest;
import com.myshop.entity.Product;
import com.myshop.entity.Review;
import com.myshop.entity.User;
import com.myshop.exception.ResourceNotFoundException;
import com.myshop.repository.ProductRepository;
import com.myshop.repository.ReviewRepository;
import com.myshop.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public ReviewService(ReviewRepository reviewRepository, ProductRepository productRepository, UserRepository userRepository) {
        this.reviewRepository = reviewRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
    }

    public List<ReviewDto> getReviewsByProduct(Long productId) {
        return reviewRepository.findByProductIdOrderByCreatedAtDesc(productId).stream()
                .map(r -> new ReviewDto(
                        r.getId(),
                        r.getProduct().getId(),
                        r.getUser().getId(),
                        r.getUser().getFullName(),
                        r.getRating(),
                        r.getComment(),
                        r.getCreatedAt()
                ))
                .collect(Collectors.toList());
    }

    @Transactional
    public ReviewDto addReview(Long productId, Long userId, ReviewRequest request) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + productId));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        Review review = new Review(product, user, request.getRating(), request.getComment());
        Review saved = reviewRepository.save(review);

        // Update product average rating and count
        List<Review> reviews = reviewRepository.findByProductIdOrderByCreatedAtDesc(productId);
        double avg = reviews.stream().mapToDouble(Review::getRating).average().orElse(product.getRating());
        avg = Math.round(avg * 10.0) / 10.0;

        product.setRating(avg);
        product.setReviewCount(reviews.size());
        product.setSmartScore(product.computeSmartScore());
        productRepository.save(product);

        return new ReviewDto(
                saved.getId(),
                product.getId(),
                user.getId(),
                user.getFullName(),
                saved.getRating(),
                saved.getComment(),
                saved.getCreatedAt()
        );
    }
}
