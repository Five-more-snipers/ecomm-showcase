package com.ecomm.showcase.checkout.dto;

import com.ecomm.showcase.order.entity.OrderStatus;

import java.math.BigDecimal;

public record CheckoutResponse(
        String orderId,
        String orderNumber,
        OrderStatus status,
        BigDecimal total,
        String paymentTransactionRef,
        String message
) {}
