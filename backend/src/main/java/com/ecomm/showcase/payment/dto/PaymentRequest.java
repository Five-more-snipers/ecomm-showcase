package com.ecomm.showcase.payment.dto;

import com.ecomm.showcase.payment.entity.PaymentMethod;
import com.ecomm.showcase.payment.entity.SimulationMode;
import jakarta.validation.constraints.NotNull;

public record PaymentRequest(
        @NotNull(message = "Payment method is required")
        PaymentMethod paymentMethod,

        String cardNumber,
        String cardExpiry,
        String cardCvv,
        SimulationMode simulationMode
) {
    public SimulationMode getEffectiveSimulationMode() {
        return simulationMode != null ? simulationMode : SimulationMode.AUTO;
    }
}
