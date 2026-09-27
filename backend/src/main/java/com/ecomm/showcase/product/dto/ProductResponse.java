package com.ecomm.showcase.product.dto;

import com.ecomm.showcase.product.entity.Product;

import java.math.BigDecimal;

public record ProductResponse(
        Long id,
        String sku,
        String title,
        String description,
        BigDecimal price,
        String imageUrl,
        boolean isFeatured,
        boolean isActive,
        CategoryResponse category,
        int stockAvailable
) {
    public static ProductResponse from(Product product, int stockAvailable) {
        return new ProductResponse(
                product.getId(),
                product.getSku(),
                product.getTitle(),
                product.getDescription(),
                product.getPrice(),
                product.getImageUrl(),
                product.isFeatured(),
                product.isActive(),
                CategoryResponse.from(product.getCategory()),
                stockAvailable
        );
    }
}
