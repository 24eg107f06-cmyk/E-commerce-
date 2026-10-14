package com.myshop.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "products")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 200)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private Double price;

    @Column(name = "original_price")
    private Double originalPrice;

    private Integer discount = 0;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "category_id", nullable = false)
    @JsonIgnoreProperties({"products"})
    private Category category;

    @Column(name = "image_url", nullable = false, length = 800)
    private String imageUrl;

    @Column(name = "additional_images", columnDefinition = "TEXT")
    private String additionalImages;

    private Double rating = 4.5;

    @Column(name = "review_count")
    private Integer reviewCount = 0;

    @Column(nullable = false)
    private Integer stock = 10;

    @Column(length = 200)
    private String tags;

    @Column(length = 100)
    private String brand;

    @Column(length = 100)
    private String sizes;

    @Column(length = 100)
    private String colors;

    @Column(name = "smart_score")
    private Integer smartScore = 85;

    @Column(name = "is_deal_radar")
    private Boolean isDealRadar = false;

    @Column(name = "is_featured")
    private Boolean isFeatured = false;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Review> reviews = new ArrayList<>();

    public Product() {
    }

    public Product(String name, String description, Double price, Double originalPrice,
                   Category category, String imageUrl, String additionalImages,
                   Double rating, Integer reviewCount, Integer stock,
                   String tags, String brand, String sizes, String colors,
                   Boolean isDealRadar, Boolean isFeatured) {
        this.name = name;
        this.description = description;
        this.price = price;
        this.originalPrice = originalPrice != null ? originalPrice : price;
        if (this.originalPrice > this.price && this.originalPrice > 0) {
            this.discount = (int) Math.round(((this.originalPrice - this.price) / this.originalPrice) * 100);
        } else {
            this.discount = 0;
        }
        this.category = category;
        this.imageUrl = imageUrl;
        this.additionalImages = additionalImages;
        this.rating = rating != null ? rating : 4.5;
        this.reviewCount = reviewCount != null ? reviewCount : 0;
        this.stock = stock != null ? stock : 10;
        this.tags = tags;
        this.brand = brand;
        this.sizes = sizes;
        this.colors = colors;
        this.isDealRadar = isDealRadar != null ? isDealRadar : false;
        this.isFeatured = isFeatured != null ? isFeatured : false;
        this.smartScore = computeSmartScore();
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        if (this.originalPrice != null && this.originalPrice > this.price && this.originalPrice > 0) {
            this.discount = (int) Math.round(((this.originalPrice - this.price) / this.originalPrice) * 100);
        }
        this.smartScore = computeSmartScore();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
        if (this.originalPrice != null && this.originalPrice > this.price && this.originalPrice > 0) {
            this.discount = (int) Math.round(((this.originalPrice - this.price) / this.originalPrice) * 100);
        }
        this.smartScore = computeSmartScore();
    }

    public int computeSmartScore() {
        double r = this.rating != null ? this.rating : 4.0;
        int rc = this.reviewCount != null ? this.reviewCount : 10;
        int disc = this.discount != null ? this.discount : 0;
        int stk = this.stock != null ? this.stock : 10;

        // Rating: up to 40 points
        double ratingPts = (r / 5.0) * 40.0;
        // Review volume: up to 20 points
        double reviewPts = Math.min(rc / 50.0, 1.0) * 20.0;
        // Discount attractiveness: up to 20 points
        double discountPts = Math.min(disc / 50.0, 1.0) * 20.0;
        // Stock availability & demand factor: up to 20 points
        double stockPts = stk > 0 ? (stk <= 5 ? 15.0 : 20.0) : 0.0;

        int score = (int) Math.round(ratingPts + reviewPts + discountPts + stockPts);
        return Math.max(10, Math.min(99, score));
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    public Double getOriginalPrice() {
        return originalPrice;
    }

    public void setOriginalPrice(Double originalPrice) {
        this.originalPrice = originalPrice;
    }

    public Integer getDiscount() {
        return discount;
    }

    public void setDiscount(Integer discount) {
        this.discount = discount;
    }

    public Category getCategory() {
        return category;
    }

    public void setCategory(Category category) {
        this.category = category;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public String getAdditionalImages() {
        return additionalImages;
    }

    public void setAdditionalImages(String additionalImages) {
        this.additionalImages = additionalImages;
    }

    public Double getRating() {
        return rating;
    }

    public void setRating(Double rating) {
        this.rating = rating;
    }

    public Integer getReviewCount() {
        return reviewCount;
    }

    public void setReviewCount(Integer reviewCount) {
        this.reviewCount = reviewCount;
    }

    public Integer getStock() {
        return stock;
    }

    public void setStock(Integer stock) {
        this.stock = stock;
    }

    public String getTags() {
        return tags;
    }

    public void setTags(String tags) {
        this.tags = tags;
    }

    public String getBrand() {
        return brand;
    }

    public void setBrand(String brand) {
        this.brand = brand;
    }

    public String getSizes() {
        return sizes;
    }

    public void setSizes(String sizes) {
        this.sizes = sizes;
    }

    public String getColors() {
        return colors;
    }

    public void setColors(String colors) {
        this.colors = colors;
    }

    public Integer getSmartScore() {
        return smartScore;
    }

    public void setSmartScore(Integer smartScore) {
        this.smartScore = smartScore;
    }

    public Boolean getIsDealRadar() {
        return isDealRadar;
    }

    public void setIsDealRadar(Boolean dealRadar) {
        isDealRadar = dealRadar;
    }

    public Boolean getIsFeatured() {
        return isFeatured;
    }

    public void setIsFeatured(Boolean featured) {
        isFeatured = featured;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public List<Review> getReviews() {
        return reviews;
    }

    public void setReviews(List<Review> reviews) {
        this.reviews = reviews;
    }
}
