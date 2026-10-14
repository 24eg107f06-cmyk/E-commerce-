package com.myshop.repository;

import com.myshop.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    List<Product> findByCategoryId(Long categoryId);

    List<Product> findByIsDealRadarTrue();

    List<Product> findByIsFeaturedTrue();

    List<Product> findTop8ByOrderBySmartScoreDesc();

    @Query("SELECT p FROM Product p WHERE " +
           "(:categoryId IS NULL OR p.category.id = :categoryId) AND " +
           "(:minPrice IS NULL OR p.price >= :minPrice) AND " +
           "(:maxPrice IS NULL OR p.price <= :maxPrice) AND " +
           "(:minRating IS NULL OR p.rating >= :minRating) AND " +
           "(:inStockOnly IS NULL OR :inStockOnly = false OR p.stock > 0) AND " +
           "(:search IS NULL OR LOWER(p.name) LIKE LOWER(CONCAT('%', :search, '%')) " +
           " OR LOWER(p.description) LIKE LOWER(CONCAT('%', :search, '%')) " +
           " OR LOWER(p.tags) LIKE LOWER(CONCAT('%', :search, '%')) " +
           " OR LOWER(p.brand) LIKE LOWER(CONCAT('%', :search, '%')) " +
           " OR LOWER(p.category.name) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<Product> filterProducts(
            @Param("categoryId") Long categoryId,
            @Param("minPrice") Double minPrice,
            @Param("maxPrice") Double maxPrice,
            @Param("minRating") Double minRating,
            @Param("inStockOnly") Boolean inStockOnly,
            @Param("search") String search,
            Pageable pageable
    );

    @Query("SELECT p FROM Product p WHERE p.category.id = :categoryId AND p.id != :productId")
    List<Product> findRelatedProducts(@Param("categoryId") Long categoryId, @Param("productId") Long productId, Pageable pageable);

    long countByCategoryId(Long categoryId);
}
