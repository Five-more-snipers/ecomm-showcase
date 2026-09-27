package com.ecomm.showcase.payment.service;

import com.ecomm.showcase.payment.dto.PaymentRequest;
import com.ecomm.showcase.payment.dto.PaymentResult;
import com.ecomm.showcase.payment.entity.PaymentMethod;
import com.ecomm.showcase.payment.entity.PaymentStatus;
import com.ecomm.showcase.payment.entity.SimulationMode;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.UUID;

@Slf4j
@Service
public class PaymentSimulationService {

    public PaymentResult simulatePayment(PaymentRequest request, BigDecimal amount) {
        log.info("Simulating payment of {} using method: {}, simulationMode: {}",
                amount, request.paymentMethod(), request.getEffectiveSimulationMode());

        if (request.paymentMethod() == PaymentMethod.MOCK_CASH_ON_DELIVERY) {
            return new PaymentResult(
                    PaymentStatus.SUCCESS,
                    "MOCK-COD-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase(),
                    "Cash on delivery authorized."
            );
        }

        SimulationMode mode = request.getEffectiveSimulationMode();
        String cleanCard = request.cardNumber() != null ? request.cardNumber().replaceAll("\\s+", "") : "";

        // Deterministic trigger based on SimulationMode or card number pattern
        if (mode == SimulationMode.FORCE_DECLINE || cleanCard.endsWith("0002")) {
            log.warn("Simulated payment DECLINE triggered.");
            return new PaymentResult(
                    PaymentStatus.DECLINED,
                    "MOCK-DECLINED-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase(),
                    "Card declined by issuing bank (insufficient funds or simulated rejection)."
            );
        }

        if (mode == SimulationMode.FORCE_TIMEOUT || cleanCard.endsWith("0004")) {
            log.warn("Simulated payment TIMEOUT triggered.");
            return new PaymentResult(
                    PaymentStatus.TIMEOUT,
                    "MOCK-TIMEOUT-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase(),
                    "Gateway connection timed out after simulated processing window."
            );
        }

        // Default: Success
        String txnRef = "MOCK-TXN-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        log.info("Simulated payment SUCCESS with ref: {}", txnRef);
        return new PaymentResult(
                PaymentStatus.SUCCESS,
                txnRef,
                "Payment successfully authorized and captured."
        );
    }
}
