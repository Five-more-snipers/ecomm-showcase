package com.ecomm.showcase.product.repository;

import com.ecomm.showcase.product.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    Optional<Product> findBySku(String sku);

    @Query("SELECT p FROM Product p JOIN FETCH p.category WHERE p.isActive = true")
    List<Product> findAllActiveWithCategory();

    @Query("""
        SELECT p FROM Product p JOIN FETCH p.category 
        WHERE p.isActive = true 
        AND (:categorySlug IS NULL OR p.category.slug = :categorySlug)
        AND (:search IS NULL OR LOWER(p.title) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(p.description) LIKE LOWER(CONCAT('%', :search, '%')))
    """)
    Page<Product> searchProducts(
            @Param("categorySlug") String categorySlug,
            @Param("search") String search,
            Pageable pageable
    );

    @Query("SELECT p FROM Product p JOIN FETCH p.category WHERE p.isFeatured = true AND p.isActive = true")
    List<Product> findFeaturedProducts();
}
