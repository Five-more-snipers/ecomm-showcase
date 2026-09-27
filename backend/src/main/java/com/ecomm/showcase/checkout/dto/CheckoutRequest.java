package com.ecomm.showcase.checkout.dto;

import com.ecomm.showcase.payment.dto.PaymentRequest;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record CheckoutRequest(
        @NotBlank(message = "Cart ID is required")
        String cartId,

        @Email(message = "Valid email is required")
        @NotBlank(message = "Email is required")
        String customerEmail,

        @NotBlank(message = "Full name is required")
        String customerName,

        String phone,

        @NotBlank(message = "Shipping address is required")
        String shippingAddress,

        @NotBlank(message = "City is required")
        String shippingCity,

        @NotBlank(message = "Postal code is required")
        String shippingPostalCode,

        @NotNull(message = "Payment details are required")
        @Valid
        PaymentRequest payment
) {}
