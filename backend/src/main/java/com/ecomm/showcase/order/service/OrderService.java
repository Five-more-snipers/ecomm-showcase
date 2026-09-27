package com.ecomm.showcase.order.service;

import com.ecomm.showcase.common.exception.BusinessException;
import com.ecomm.showcase.common.exception.ResourceNotFoundException;
import com.ecomm.showcase.inventory.entity.Inventory;
import com.ecomm.showcase.inventory.repository.InventoryRepository;
import com.ecomm.showcase.order.dto.OrderResponse;
import com.ecomm.showcase.order.dto.OrderTrackingResponse;
import com.ecomm.showcase.order.entity.Order;
import com.ecomm.showcase.order.entity.OrderItem;
import com.ecomm.showcase.order.entity.OrderStatus;
import com.ecomm.showcase.order.repository.OrderRepository;
import com.ecomm.showcase.payment.entity.Payment;
import com.ecomm.showcase.payment.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class OrderService {

    private final OrderRepository orderRepository;
    private final PaymentRepository paymentRepository;
    private final InventoryRepository inventoryRepository;

    public OrderResponse getOrderByNumber(String orderNumber) {
        Order order = orderRepository.findByOrderNumberWithItems(orderNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Order", orderNumber));
        Payment payment = paymentRepository.findByOrderId(order.getId()).orElse(null);
        return OrderResponse.from(order, payment);
    }

    public OrderTrackingResponse getOrderTracking(String orderNumber) {
        Order order = orderRepository.findByOrderNumber(orderNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Order", orderNumber));
        return OrderTrackingResponse.from(order.getStatus(), order.getOrderNumber());
    }

    @Transactional
    public OrderResponse cancelOrder(String orderNumber) {
        Order order = orderRepository.findByOrderNumberWithItems(orderNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Order", orderNumber));

        if (order.getStatus() == OrderStatus.SHIPPED || order.getStatus() == OrderStatus.DELIVERED) {
            throw new BusinessException("Cannot cancel an order that has already been shipped or delivered.",
                    "ORDER_NOT_CANCELLABLE", HttpStatus.CONFLICT);
        }

        if (order.getStatus() == OrderStatus.CANCELLED) {
            Payment payment = paymentRepository.findByOrderId(order.getId()).orElse(null);
            return OrderResponse.from(order, payment);
        }

        order.setStatus(OrderStatus.CANCELLED);
        orderRepository.save(order);

        // Replenish inventory
        for (OrderItem item : order.getItems()) {
            Inventory inv = inventoryRepository.findByProductIdWithLock(item.getProduct().getId())
                    .orElse(null);
            if (inv != null) {
                inv.replenish(item.getQuantity());
                inventoryRepository.save(inv);
                log.info("Replenished {} units for product SKU: {}", item.getQuantity(), item.getProduct().getSku());
            }
        }

        Payment payment = paymentRepository.findByOrderId(order.getId()).orElse(null);
        return OrderResponse.from(order, payment);
    }

    @Transactional
    public OrderResponse advanceStatus(String orderNumber, OrderStatus newStatus) {
        Order order = orderRepository.findByOrderNumberWithItems(orderNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Order", orderNumber));
        order.setStatus(newStatus);
        orderRepository.save(order);
        Payment payment = paymentRepository.findByOrderId(order.getId()).orElse(null);
        return OrderResponse.from(order, payment);
    }
}
