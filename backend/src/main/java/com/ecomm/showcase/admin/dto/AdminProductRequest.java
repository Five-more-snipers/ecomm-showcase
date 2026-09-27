package com.ecomm.showcase.admin.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public record AdminProductRequest(
        String sku,
        @NotBlank String title,
        String description,
        @NotNull @DecimalMin("0.0") BigDecimal price,
        String imageUrl,
        Long categoryId,
        boolean isFeatured,
        boolean isActive,
        Integer stockQuantity
) {}
