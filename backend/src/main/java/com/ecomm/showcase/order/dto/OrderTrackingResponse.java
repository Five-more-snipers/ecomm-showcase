package com.ecomm.showcase.order.dto;

import com.ecomm.showcase.order.entity.OrderStatus;

import java.util.List;

public record OrderTrackingResponse(
        String orderNumber,
        OrderStatus currentStatus,
        int currentStepIndex,
        List<StatusStep> steps
) {
    public record StatusStep(
            OrderStatus status,
            String label,
            String description,
            boolean isCompleted,
            boolean isCurrent
    ) {}

    public static OrderTrackingResponse from(OrderStatus currentStatus, String orderNumber) {
        List<OrderStatus> flow = List.of(
                OrderStatus.PENDING,
                OrderStatus.PAYMENT_CONFIRMED,
                OrderStatus.PROCESSING,
                OrderStatus.SHIPPED,
                OrderStatus.DELIVERED
        );

        int currentIndex = flow.indexOf(currentStatus);
        if (currentIndex < 0) {
            currentIndex = 0;
        }

        int finalCurrentIndex = currentIndex;
        List<StatusStep> steps = flow.stream().map(step -> {
            int stepIndex = flow.indexOf(step);
            boolean isCompleted = stepIndex < finalCurrentIndex || currentStatus == OrderStatus.DELIVERED;
            boolean isCurrent = step == currentStatus;
            String label = switch (step) {
                case PENDING -> "Order Placed";
                case PAYMENT_CONFIRMED -> "Payment Verified";
                case PROCESSING -> "Preparing for Dispatch";
                case SHIPPED -> "Out for Delivery";
                case DELIVERED -> "Delivered";
                default -> step.name();
            };
            String description = switch (step) {
                case PENDING -> "Order received by store system.";
                case PAYMENT_CONFIRMED -> "Payment transaction successfully captured.";
                case PROCESSING -> "Items packaged and inspected at distribution center.";
                case SHIPPED -> "Package handed to courier.";
                case DELIVERED -> "Package arrived at recipient destination.";
                default -> "";
            };
            return new StatusStep(step, label, description, isCompleted, isCurrent);
        }).toList();

        return new OrderTrackingResponse(orderNumber, currentStatus, currentIndex, steps);
    }
}
