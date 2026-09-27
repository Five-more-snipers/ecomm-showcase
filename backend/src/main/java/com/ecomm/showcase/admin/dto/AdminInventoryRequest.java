package com.ecomm.showcase.admin.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record AdminInventoryRequest(
        @NotNull @Min(0) Integer quantityAvailable
) {}
