package com.myshop.controller;

import com.myshop.dto.ApiResponse;
import com.myshop.dto.ProductDto;
import com.myshop.service.ProductService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Page<ProductDto>>> getProducts(
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) String categorySlug,
            @RequestParam(required = false) Double minPrice,
            @RequestParam(required = false) Double maxPrice,
            @RequestParam(required = false) Double minRating,
            @RequestParam(required = false) Boolean inStockOnly,
            @RequestParam(required = false) String search,
            @RequestParam(required = false, defaultValue = "featured") String sortBy,
            @RequestParam(required = false, defaultValue = "0") int page,
            @RequestParam(required = false, defaultValue = "12") int size
    ) {
        Page<ProductDto> products = productService.getProducts(
                categoryId, categorySlug, minPrice, maxPrice, minRating, inStockOnly, search, sortBy, page, size
        );
        return ResponseEntity.ok(ApiResponse.success("Products retrieved successfully", products));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ProductDto>> getProductById(@PathVariable Long id) {
        ProductDto product = productService.getProductById(id);
        return ResponseEntity.ok(ApiResponse.success("Product retrieved successfully", product));
    }

    @GetMapping("/deal-radar")
    public ResponseEntity<ApiResponse<List<ProductDto>>> getDealRadarProducts() {
        List<ProductDto> deals = productService.getDealRadarProducts();
        return ResponseEntity.ok(ApiResponse.success("Deal Radar products retrieved", deals));
    }

    @GetMapping("/featured")
    public ResponseEntity<ApiResponse<List<ProductDto>>> getFeaturedProducts() {
        List<ProductDto> featured = productService.getFeaturedProducts();
        return ResponseEntity.ok(ApiResponse.success("Featured products retrieved", featured));
    }

    @GetMapping("/smart-score-top")
    public ResponseEntity<ApiResponse<List<ProductDto>>> getTopSmartScoreProducts() {
        List<ProductDto> topSmart = productService.getTopSmartScoreProducts();
        return ResponseEntity.ok(ApiResponse.success("Top Smart Score products retrieved", topSmart));
    }

    @GetMapping("/{id}/related")
    public ResponseEntity<ApiResponse<List<ProductDto>>> getRelatedProducts(@PathVariable Long id) {
        List<ProductDto> related = productService.getRelatedProducts(id);
        return ResponseEntity.ok(ApiResponse.success("Related products retrieved", related));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ProductDto>> createProduct(@Valid @RequestBody ProductDto dto) {
        ProductDto created = productService.createProduct(dto);
        return new ResponseEntity<>(ApiResponse.success("Product created successfully", created), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ProductDto>> updateProduct(@PathVariable Long id, @Valid @RequestBody ProductDto dto) {
        ProductDto updated = productService.updateProduct(id, dto);
        return ResponseEntity.ok(ApiResponse.success("Product updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.ok(ApiResponse.success("Product deleted successfully"));
    }
}
