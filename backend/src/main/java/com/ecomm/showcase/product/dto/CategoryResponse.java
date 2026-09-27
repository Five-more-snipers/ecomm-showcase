package com.ecomm.showcase.product.dto;

import com.ecomm.showcase.product.entity.Category;

public record CategoryResponse(
        Long id,
        String name,
        String slug,
        String description,
        String iconName
) {
    public static CategoryResponse from(Category category) {
        return new CategoryResponse(
                category.getId(),
                category.getName(),
                category.getSlug(),
                category.getDescription(),
                category.getIconName()
        );
    }
}
