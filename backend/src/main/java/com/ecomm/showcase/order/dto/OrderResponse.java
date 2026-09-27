package com.ecomm.showcase.order.dto;

import com.ecomm.showcase.order.entity.Order;
import com.ecomm.showcase.order.entity.OrderStatus;
import com.ecomm.showcase.payment.entity.Payment;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

public record OrderResponse(
        String orderId,
        String orderNumber,
        OrderStatus status,
        BigDecimal subtotal,
        BigDecimal tax,
        BigDecimal shipping,
        BigDecimal total,
        String customerName,
        String customerEmail,
        String shippingAddress,
        String shippingCity,
        String shippingPostalCode,
        String paymentMethod,
        String paymentStatus,
        String transactionRef,
        Instant createdAt,
        List<OrderItemResponse> items
) {
    public static OrderResponse from(Order order, Payment payment) {
        List<OrderItemResponse> items = order.getItems().stream()
                .map(OrderItemResponse::from)
                .toList();

        return new OrderResponse(
                order.getId(),
                order.getOrderNumber(),
                order.getStatus(),
                order.getSubtotal(),
                order.getTax(),
                order.getShipping(),
                order.getTotal(),
                order.getCustomer().getFullName(),
                order.getCustomer().getEmail(),
                order.getShippingAddress(),
                order.getShippingCity(),
                order.getShippingPostalCode(),
                payment != null ? payment.getPaymentMethod().name() : null,
                payment != null ? payment.getStatus().name() : null,
                payment != null ? payment.getTransactionRef() : null,
                order.getCreatedAt(),
                items
        );
    }
}
