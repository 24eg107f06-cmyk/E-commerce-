package com.myshop.dto;

import java.time.LocalDateTime;

public class ReviewDto {
    private Long id;
    private Long productId;
    private Long userId;
    private String userFullName;
    private Double rating;
    private String comment;
    private LocalDateTime createdAt;

    public ReviewDto() {
    }

    public ReviewDto(Long id, Long productId, Long userId, String userFullName, Double rating, String comment, LocalDateTime createdAt) {
        this.id = id;
        this.productId = productId;
        this.userId = userId;
        this.userFullName = userFullName;
        this.rating = rating;
        this.comment = comment;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getUserFullName() {
        return userFullName;
    }

    public void setUserFullName(String userFullName) {
        this.userFullName = userFullName;
    }

    public Double getRating() {
        return rating;
    }

    public void setRating(Double rating) {
        this.rating = rating;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
