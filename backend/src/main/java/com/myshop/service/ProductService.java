package com.myshop.service;

import com.myshop.dto.ProductDto;
import com.myshop.entity.Category;
import com.myshop.entity.Product;
import com.myshop.exception.ResourceNotFoundException;
import com.myshop.repository.CategoryRepository;
import com.myshop.repository.ProductRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    public ProductService(ProductRepository productRepository, CategoryRepository categoryRepository) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
    }

    public Page<ProductDto> getProducts(
            Long categoryId,
            String categorySlug,
            Double minPrice,
            Double maxPrice,
            Double minRating,
            Boolean inStockOnly,
            String search,
            String sortBy,
            int page,
            int size
    ) {
        if (categorySlug != null && !categorySlug.isBlank()) {
            categoryRepository.findBySlug(categorySlug)
                    .ifPresent(cat -> {});
        }

        Sort sort = switch (sortBy != null ? sortBy.toLowerCase() : "featured") {
            case "price_asc", "price-low-to-high" -> Sort.by(Sort.Direction.ASC, "price");
            case "price_desc", "price-high-to-low" -> Sort.by(Sort.Direction.DESC, "price");
            case "rating", "highest-rated" -> Sort.by(Sort.Direction.DESC, "rating");
            case "newest" -> Sort.by(Sort.Direction.DESC, "createdAt");
            case "smart_score", "smart-score" -> Sort.by(Sort.Direction.DESC, "smartScore");
            case "popular", "popularity" -> Sort.by(Sort.Direction.DESC, "reviewCount");
            default -> Sort.by(Sort.Direction.DESC, "isFeatured").and(Sort.by(Sort.Direction.DESC, "smartScore"));
        };

        Pageable pageable = PageRequest.of(Math.max(0, page), size > 0 ? size : 12, sort);

        String trimmedSearch = (search != null && !search.trim().isEmpty()) ? search.trim() : null;

        return productRepository.filterProducts(
                categoryId,
                minPrice,
                maxPrice,
                minRating,
                inStockOnly,
                trimmedSearch,
                pageable
        ).map(this::mapToDto);
    }

    public ProductDto getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
        return mapToDto(product);
    }

    public List<ProductDto> getDealRadarProducts() {
        return productRepository.findByIsDealRadarTrue().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public List<ProductDto> getFeaturedProducts() {
        return productRepository.findByIsFeaturedTrue().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public List<ProductDto> getTopSmartScoreProducts() {
        return productRepository.findTop8ByOrderBySmartScoreDesc().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public List<ProductDto> getRelatedProducts(Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + productId));

        Pageable pageable = PageRequest.of(0, 4, Sort.by(Sort.Direction.DESC, "smartScore"));
        return productRepository.findRelatedProducts(product.getCategory().getId(), productId, pageable).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public ProductDto createProduct(ProductDto dto) {
        Category category = categoryRepository.findById(dto.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + dto.getCategoryId()));

        Product product = new Product(
                dto.getName(),
                dto.getDescription(),
                dto.getPrice(),
                dto.getOriginalPrice(),
                category,
                dto.getImageUrl(),
                dto.getAdditionalImages(),
                dto.getRating(),
                dto.getReviewCount(),
                dto.getStock(),
                dto.getTags(),
                dto.getBrand(),
                dto.getSizes(),
                dto.getColors(),
                dto.getIsDealRadar(),
                dto.getIsFeatured()
        );

        return mapToDto(productRepository.save(product));
    }

    @Transactional
    public ProductDto updateProduct(Long id, ProductDto dto) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));

        Category category = categoryRepository.findById(dto.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + dto.getCategoryId()));

        product.setName(dto.getName());
        product.setDescription(dto.getDescription());
        product.setPrice(dto.getPrice());
        product.setOriginalPrice(dto.getOriginalPrice());
        product.setCategory(category);
        product.setImageUrl(dto.getImageUrl());
        product.setAdditionalImages(dto.getAdditionalImages());
        if (dto.getRating() != null) product.setRating(dto.getRating());
        if (dto.getReviewCount() != null) product.setReviewCount(dto.getReviewCount());
        product.setStock(dto.getStock());
        product.setTags(dto.getTags());
        product.setBrand(dto.getBrand());
        product.setSizes(dto.getSizes());
        product.setColors(dto.getColors());
        product.setIsDealRadar(dto.getIsDealRadar() != null ? dto.getIsDealRadar() : false);
        product.setIsFeatured(dto.getIsFeatured() != null ? dto.getIsFeatured() : false);

        product.setSmartScore(product.computeSmartScore());

        return mapToDto(productRepository.save(product));
    }

    @Transactional
    public void deleteProduct(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
        productRepository.delete(product);
    }

    public ProductDto mapToDto(Product p) {
        ProductDto dto = new ProductDto();
        dto.setId(p.getId());
        dto.setName(p.getName());
        dto.setDescription(p.getDescription());
        dto.setPrice(p.getPrice());
        dto.setOriginalPrice(p.getOriginalPrice());
        dto.setDiscount(p.getDiscount());
        if (p.getCategory() != null) {
            dto.setCategoryId(p.getCategory().getId());
            dto.setCategoryName(p.getCategory().getName());
            dto.setCategorySlug(p.getCategory().getSlug());
        }
        dto.setImageUrl(p.getImageUrl());
        dto.setAdditionalImages(p.getAdditionalImages());
        dto.setRating(p.getRating());
        dto.setReviewCount(p.getReviewCount());
        dto.setStock(p.getStock());
        dto.setTags(p.getTags());
        dto.setBrand(p.getBrand());
        dto.setSizes(p.getSizes());
        dto.setColors(p.getColors());
        dto.setSmartScore(p.getSmartScore());
        dto.setIsDealRadar(p.getIsDealRadar());
        dto.setIsFeatured(p.getIsFeatured());
        dto.setCreatedAt(p.getCreatedAt());
        dto.setUpdatedAt(p.getUpdatedAt());
        return dto;
    }
}
