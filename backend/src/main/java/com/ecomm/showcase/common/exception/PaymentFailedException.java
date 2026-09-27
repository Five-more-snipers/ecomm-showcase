package com.ecomm.showcase.common.exception;

import org.springframework.http.HttpStatus;

public class PaymentFailedException extends BusinessException {

    public PaymentFailedException(String reason) {
        super(String.format("Payment simulation failed: %s", reason),
                "PAYMENT_FAILED",
                HttpStatus.PAYMENT_REQUIRED);
    }
}
