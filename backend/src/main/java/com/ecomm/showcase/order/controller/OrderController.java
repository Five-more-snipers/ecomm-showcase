package com.ecomm.showcase.order.controller;

import com.ecomm.showcase.order.dto.OrderResponse;
import com.ecomm.showcase.order.dto.OrderTrackingResponse;
import com.ecomm.showcase.order.entity.OrderStatus;
import com.ecomm.showcase.order.service.OrderService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/orders")
@RequiredArgsConstructor
@Tag(name = "Orders", description = "Order lookup, lifecycle tracking, and cancellation APIs")
public class OrderController {

    private final OrderService orderService;

    @GetMapping("/{orderNumber}")
    @Operation(summary = "Get order details by order number")
    public ResponseEntity<OrderResponse> getOrder(@PathVariable String orderNumber) {
        return ResponseEntity.ok(orderService.getOrderByNumber(orderNumber));
    }

    @GetMapping("/{orderNumber}/tracking")
    @Operation(summary = "Get visual tracking timeline for an order")
    public ResponseEntity<OrderTrackingResponse> getOrderTracking(@PathVariable String orderNumber) {
        return ResponseEntity.ok(orderService.getOrderTracking(orderNumber));
    }

    @PostMapping("/{orderNumber}/cancel")
    @Operation(summary = "Cancel an order and return reserved inventory")
    public ResponseEntity<OrderResponse> cancelOrder(@PathVariable String orderNumber) {
        return ResponseEntity.ok(orderService.cancelOrder(orderNumber));
    }

    @PatchMapping("/{orderNumber}/status")
    @Operation(summary = "Advance order lifecycle status (Simulation & Testing)")
    public ResponseEntity<OrderResponse> advanceStatus(
            @PathVariable String orderNumber,
            @RequestParam OrderStatus status
    ) {
        return ResponseEntity.ok(orderService.advanceStatus(orderNumber, status));
    }
}
