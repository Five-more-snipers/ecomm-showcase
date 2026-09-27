package com.ecomm.showcase.payment.dto;

import com.ecomm.showcase.payment.entity.PaymentStatus;

public record PaymentResult(
        PaymentStatus status,
        String transactionRef,
        String reason
) {
    public boolean isSuccessful() {
        return status == PaymentStatus.SUCCESS;
    }
}
