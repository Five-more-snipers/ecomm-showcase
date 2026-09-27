package com.ecomm.showcase.common.exception;

import org.springframework.http.HttpStatus;

public class InsufficientInventoryException extends BusinessException {

    public InsufficientInventoryException(String sku, int requested, int available) {
        super(String.format("Insufficient inventory for product SKU '%s'. Requested: %d, Available: %d.",
                sku, requested, available),
                "INSUFFICIENT_INVENTORY",
                HttpStatus.CONFLICT);
    }
}
