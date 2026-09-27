package com.ecomm.showcase.cart.service;

import com.ecomm.showcase.cart.dto.AddToCartRequest;
import com.ecomm.showcase.cart.dto.CartResponse;
import com.ecomm.showcase.cart.dto.UpdateCartItemRequest;
import com.ecomm.showcase.cart.entity.Cart;
import com.ecomm.showcase.cart.entity.CartItem;
import com.ecomm.showcase.cart.repository.CartItemRepository;
import com.ecomm.showcase.cart.repository.CartRepository;
import com.ecomm.showcase.common.exception.InsufficientInventoryException;
import com.ecomm.showcase.common.exception.ResourceNotFoundException;
import com.ecomm.showcase.inventory.entity.Inventory;
import com.ecomm.showcase.inventory.repository.InventoryRepository;
import com.ecomm.showcase.product.entity.Product;
import com.ecomm.showcase.product.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final InventoryRepository inventoryRepository;

    public CartResponse getOrCreateCart(String cartId) {
        Cart cart = resolveCart(cartId);
        return CartResponse.from(cart);
    }

    public CartResponse addItem(String cartId, AddToCartRequest request) {
        Cart cart = resolveCart(cartId);
        Product product = productRepository.findById(request.productId())
                .orElseThrow(() -> new ResourceNotFoundException("Product", request.productId()));

        Inventory inventory = inventoryRepository.findByProductId(product.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Inventory for product", product.getId()));

        Optional<CartItem> existingItem = cartItemRepository.findByCartIdAndProductId(cart.getId(), product.getId());

        int newTotalQuantity = request.quantity();
        if (existingItem.isPresent()) {
            newTotalQuantity += existingItem.get().getQuantity();
        }

        if (!inventory.hasStock(newTotalQuantity)) {
            throw new InsufficientInventoryException(product.getSku(), newTotalQuantity, inventory.getQuantityAvailable());
        }

        if (existingItem.isPresent()) {
            CartItem item = existingItem.get();
            item.setQuantity(newTotalQuantity);
        } else {
            CartItem newItem = CartItem.builder()
                    .cart(cart)
                    .product(product)
                    .quantity(request.quantity())
                    .build();
            cart.getItems().add(newItem);
        }

        cartRepository.save(cart);
        return CartResponse.from(resolveCart(cart.getId()));
    }

    public CartResponse updateItem(String cartId, Long itemId, UpdateCartItemRequest request) {
        Cart cart = resolveCart(cartId);
        CartItem item = cartItemRepository.findById(itemId)
                .filter(i -> i.getCart().getId().equals(cart.getId()))
                .orElseThrow(() -> new ResourceNotFoundException("CartItem", itemId));

        if (request.quantity() <= 0) {
            cart.getItems().remove(item);
            cartItemRepository.delete(item);
        } else {
            Inventory inventory = inventoryRepository.findByProductId(item.getProduct().getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Inventory", item.getProduct().getId()));

            if (!inventory.hasStock(request.quantity())) {
                throw new InsufficientInventoryException(item.getProduct().getSku(), request.quantity(), inventory.getQuantityAvailable());
            }
            item.setQuantity(request.quantity());
        }

        cartRepository.save(cart);
        return CartResponse.from(resolveCart(cart.getId()));
    }

    public CartResponse removeItem(String cartId, Long itemId) {
        Cart cart = resolveCart(cartId);
        CartItem item = cartItemRepository.findById(itemId)
                .filter(i -> i.getCart().getId().equals(cart.getId()))
                .orElseThrow(() -> new ResourceNotFoundException("CartItem", itemId));

        cart.getItems().remove(item);
        cartItemRepository.delete(item);
        cartRepository.save(cart);

        return CartResponse.from(resolveCart(cart.getId()));
    }

    public void clearCart(String cartId) {
        cartRepository.findById(cartId).ifPresent(cart -> {
            cart.getItems().clear();
            cartRepository.save(cart);
        });
    }

    private Cart resolveCart(String cartId) {
        if (cartId == null || cartId.trim().isEmpty()) {
            String newId = UUID.randomUUID().toString();
            return cartRepository.save(Cart.builder().id(newId).build());
        }

        return cartRepository.findByIdWithItems(cartId).orElseGet(() -> {
            log.info("Creating new cart for id: {}", cartId);
            return cartRepository.save(Cart.builder().id(cartId).build());
        });
    }
}
