package com.ecomm.showcase.admin.controller;

import com.ecomm.showcase.admin.dto.AdminInventoryRequest;
import com.ecomm.showcase.admin.dto.AdminProductRequest;
import com.ecomm.showcase.admin.service.AdminService;
import com.ecomm.showcase.order.dto.OrderResponse;
import com.ecomm.showcase.product.dto.ProductResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/admin")
@RequiredArgsConstructor
@Tag(name = "Admin / Back-Office", description = "Back-office APIs for configuring products, inventory, and orders")
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/orders")
    @Operation(summary = "Get all orders for back-office management")
    public ResponseEntity<List<OrderResponse>> getAllOrders() {
        return ResponseEntity.ok(adminService.getAllOrders());
    }

    @PostMapping("/products")
    @Operation(summary = "Create a new product with initial inventory")
    public ResponseEntity<ProductResponse> createProduct(@Valid @RequestBody AdminProductRequest request) {
        return ResponseEntity.ok(adminService.createProduct(request));
    }

    @PutMapping("/products/{id}")
    @Operation(summary = "Update an existing product and inventory")
    public ResponseEntity<ProductResponse> updateProduct(
            @PathVariable Long id,
            @Valid @RequestBody AdminProductRequest request
    ) {
        return ResponseEntity.ok(adminService.updateProduct(id, request));
    }

    @DeleteMapping("/products/{id}")
    @Operation(summary = "Deactivate/trash a product")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        adminService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/inventory/{productId}")
    @Operation(summary = "Directly adjust inventory stock level (for concurrency testing)")
    public ResponseEntity<Map<String, Object>> updateInventory(
            @PathVariable Long productId,
            @Valid @RequestBody AdminInventoryRequest request
    ) {
        int updated = adminService.updateInventory(productId, request);
        return ResponseEntity.ok(Map.of("productId", productId, "quantityAvailable", updated));
    }
}
