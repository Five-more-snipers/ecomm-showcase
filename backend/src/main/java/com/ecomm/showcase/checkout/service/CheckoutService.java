package com.ecomm.showcase.checkout.service;

import com.ecomm.showcase.cart.entity.Cart;
import com.ecomm.showcase.cart.entity.CartItem;
import com.ecomm.showcase.cart.repository.CartRepository;
import com.ecomm.showcase.checkout.dto.CheckoutRequest;
import com.ecomm.showcase.checkout.dto.CheckoutResponse;
import com.ecomm.showcase.common.exception.BusinessException;
import com.ecomm.showcase.common.exception.InsufficientInventoryException;
import com.ecomm.showcase.common.exception.PaymentFailedException;
import com.ecomm.showcase.customer.entity.Customer;
import com.ecomm.showcase.customer.repository.CustomerRepository;
import com.ecomm.showcase.inventory.entity.Inventory;
import com.ecomm.showcase.inventory.repository.InventoryRepository;
import com.ecomm.showcase.order.entity.Order;
import com.ecomm.showcase.order.entity.OrderItem;
import com.ecomm.showcase.order.entity.OrderStatus;
import com.ecomm.showcase.order.repository.OrderRepository;
import com.ecomm.showcase.payment.dto.PaymentResult;
import com.ecomm.showcase.payment.entity.Payment;
import com.ecomm.showcase.payment.entity.PaymentStatus;
import com.ecomm.showcase.payment.repository.PaymentRepository;
import com.ecomm.showcase.payment.service.PaymentSimulationService;
import com.ecomm.showcase.product.entity.Product;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Year;
import java.util.*;

@Slf4j
@Service
@RequiredArgsConstructor
public class CheckoutService {

    private final CartRepository cartRepository;
    private final CustomerRepository customerRepository;
    private final InventoryRepository inventoryRepository;
    private final OrderRepository orderRepository;
    private final PaymentRepository paymentRepository;
    private final PaymentSimulationService paymentSimulationService;

    @Transactional(isolation = Isolation.READ_COMMITTED)
    public CheckoutResponse processCheckout(CheckoutRequest request) {
        log.info("Processing checkout for cart: {}, customer: {}", request.cartId(), request.customerEmail());

        // 1. Fetch Cart with Items
        Cart cart = cartRepository.findByIdWithItems(request.cartId())
                .orElseThrow(() -> new BusinessException("Cart not found: " + request.cartId(), "CART_NOT_FOUND", HttpStatus.NOT_FOUND));

        if (cart.getItems() == null || cart.getItems().isEmpty()) {
            throw new BusinessException("Cannot checkout with an empty cart.", "EMPTY_CART", HttpStatus.BAD_REQUEST);
        }

        // 2. Resolve Customer
        Customer customer = customerRepository.findByEmail(request.customerEmail())
                .orElseGet(() -> customerRepository.save(Customer.builder()
                        .email(request.customerEmail())
                        .fullName(request.customerName())
                        .phone(request.phone())
                        .addressLine1(request.shippingAddress())
                        .city(request.shippingCity())
                        .postalCode(request.shippingPostalCode())
                        .isGuest(true)
                        .build()));

        // 3. Acquire Pessimistic Locks on Inventory for all ordered products
        List<Long> productIds = cart.getItems().stream()
                .map(item -> item.getProduct().getId())
                .toList();

        List<Inventory> lockedStock = inventoryRepository.findAllByProductIdInWithLock(productIds);
        Map<Long, Inventory> stockMap = new HashMap<>();
        for (Inventory inv : lockedStock) {
            stockMap.put(inv.getProduct().getId(), inv);
        }

        // 4. Validate stock availability
        for (CartItem item : cart.getItems()) {
            Product product = item.getProduct();
            Inventory inventory = stockMap.get(product.getId());

            if (inventory == null || !inventory.hasStock(item.getQuantity())) {
                int available = inventory != null ? inventory.getQuantityAvailable() : 0;
                log.warn("Checkout rejected: insufficient inventory for SKU: {}", product.getSku());
                throw new InsufficientInventoryException(product.getSku(), item.getQuantity(), available);
            }
        }

        // 5. Calculate Authoritative Totals (Backend Authority)
        BigDecimal subtotal = BigDecimal.ZERO;
        for (CartItem item : cart.getItems()) {
            BigDecimal itemTotal = item.getProduct().getPrice().multiply(BigDecimal.valueOf(item.getQuantity()));
            subtotal = subtotal.add(itemTotal);
        }

        BigDecimal tax = subtotal.multiply(BigDecimal.valueOf(0.08)).setScale(2, RoundingMode.HALF_UP);
        BigDecimal shipping = subtotal.compareTo(BigDecimal.valueOf(100.00)) >= 0 
                ? BigDecimal.ZERO 
                : BigDecimal.valueOf(10.00).setScale(2, RoundingMode.HALF_UP);
        BigDecimal total = subtotal.add(tax).add(shipping);

        // 6. Execute Mock Payment Simulation
        PaymentResult paymentResult = paymentSimulationService.simulatePayment(request.payment(), total);
        if (!paymentResult.isSuccessful()) {
            log.warn("Payment simulation failed: {}", paymentResult.reason());
            throw new PaymentFailedException(paymentResult.reason());
        }

        // 7. Decrement Inventory
        for (CartItem item : cart.getItems()) {
            Inventory inv = stockMap.get(item.getProduct().getId());
            inv.decrement(item.getQuantity());
            inventoryRepository.save(inv);
        }

        // 8. Generate Order
        String orderId = UUID.randomUUID().toString();
        long orderSeq = orderRepository.countOrders() + 1;
        String orderNumber = String.format("ORD-%d-%06d", Year.now().getValue(), orderSeq);

        Order order = Order.builder()
                .id(orderId)
                .orderNumber(orderNumber)
                .customer(customer)
                .status(OrderStatus.PAYMENT_CONFIRMED)
                .subtotal(subtotal)
                .tax(tax)
                .shipping(shipping)
                .total(total)
                .shippingName(request.customerName())
                .shippingAddress(request.shippingAddress())
                .shippingCity(request.shippingCity())
                .shippingPostalCode(request.shippingPostalCode())
                .build();

        List<OrderItem> orderItems = new ArrayList<>();
        for (CartItem item : cart.getItems()) {
            orderItems.add(OrderItem.builder()
                    .order(order)
                    .product(item.getProduct())
                    .quantity(item.getQuantity())
                    .unitPrice(item.getProduct().getPrice())
                    .totalPrice(item.getProduct().getPrice().multiply(BigDecimal.valueOf(item.getQuantity())))
                    .build());
        }
        order.setItems(orderItems);
        orderRepository.save(order);

        // 9. Persist Payment Record
        Payment payment = Payment.builder()
                .order(order)
                .paymentMethod(request.payment().paymentMethod())
                .status(PaymentStatus.SUCCESS)
                .transactionRef(paymentResult.transactionRef())
                .amount(total)
                .build();
        paymentRepository.save(payment);

        // 10. Clear Cart
        cart.getItems().clear();
        cartRepository.save(cart);

        log.info("Checkout successful! Created order: {} with total: {}", orderNumber, total);

        return new CheckoutResponse(
                order.getId(),
                order.getOrderNumber(),
                order.getStatus(),
                order.getTotal(),
                paymentResult.transactionRef(),
                "Order successfully created and confirmed."
        );
    }
}
