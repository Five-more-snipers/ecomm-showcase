package com.ecomm.showcase.cart.controller;

import com.ecomm.showcase.cart.dto.AddToCartRequest;
import com.ecomm.showcase.cart.dto.CartResponse;
import com.ecomm.showcase.cart.dto.UpdateCartItemRequest;
import com.ecomm.showcase.cart.service.CartService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/cart")
@RequiredArgsConstructor
@Tag(name = "Cart", description = "Shopping cart and item management APIs")
public class CartController {

    private final CartService cartService;

    @GetMapping("/{cartId}")
    @Operation(summary = "Get cart contents or initialize a new cart")
    public ResponseEntity<CartResponse> getCart(@PathVariable String cartId) {
        return ResponseEntity.ok(cartService.getOrCreateCart(cartId));
    }

    @PostMapping("/{cartId}/items")
    @Operation(summary = "Add an item to the cart")
    public ResponseEntity<CartResponse> addItem(
            @PathVariable String cartId,
            @Valid @RequestBody AddToCartRequest request
    ) {
        return ResponseEntity.ok(cartService.addItem(cartId, request));
    }

    @PutMapping("/{cartId}/items/{itemId}")
    @Operation(summary = "Update item quantity in the cart")
    public ResponseEntity<CartResponse> updateItem(
            @PathVariable String cartId,
            @PathVariable Long itemId,
            @Valid @RequestBody UpdateCartItemRequest request
    ) {
        return ResponseEntity.ok(cartService.updateItem(cartId, itemId, request));
    }

    @DeleteMapping("/{cartId}/items/{itemId}")
    @Operation(summary = "Remove an item from the cart")
    public ResponseEntity<CartResponse> removeItem(
            @PathVariable String cartId,
            @PathVariable Long itemId
    ) {
        return ResponseEntity.ok(cartService.removeItem(cartId, itemId));
    }

    @DeleteMapping("/{cartId}")
    @Operation(summary = "Clear all items in the cart")
    public ResponseEntity<Void> clearCart(@PathVariable String cartId) {
        cartService.clearCart(cartId);
        return ResponseEntity.noContent().build();
    }
}
