package com.ecomm.showcase.admin.service;

import com.ecomm.showcase.admin.dto.AdminInventoryRequest;
import com.ecomm.showcase.admin.dto.AdminProductRequest;
import com.ecomm.showcase.common.exception.ResourceNotFoundException;
import com.ecomm.showcase.inventory.entity.Inventory;
import com.ecomm.showcase.inventory.repository.InventoryRepository;
import com.ecomm.showcase.order.dto.OrderResponse;
import com.ecomm.showcase.order.entity.Order;
import com.ecomm.showcase.order.repository.OrderRepository;
import com.ecomm.showcase.payment.entity.Payment;
import com.ecomm.showcase.payment.repository.PaymentRepository;
import com.ecomm.showcase.product.dto.ProductResponse;
import com.ecomm.showcase.product.entity.Category;
import com.ecomm.showcase.product.entity.Product;
import com.ecomm.showcase.product.repository.CategoryRepository;
import com.ecomm.showcase.product.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class AdminService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final InventoryRepository inventoryRepository;
    private final OrderRepository orderRepository;
    private final PaymentRepository paymentRepository;

    @Transactional(readOnly = true)
    public List<OrderResponse> getAllOrders() {
        List<Order> orders = orderRepository.findAll(Sort.by(Sort.Direction.DESC, "createdAt"));
        return orders.stream()
                .map(order -> {
                    Payment payment = paymentRepository.findByOrderId(order.getId()).orElse(null);
                    return OrderResponse.from(order, payment);
                })
                .toList();
    }

    public ProductResponse createProduct(AdminProductRequest request) {
        Category category = categoryRepository.findById(request.categoryId() != null ? request.categoryId() : 1L)
                .orElseThrow(() -> new ResourceNotFoundException("Category", request.categoryId()));

        String sku = request.sku() != null && !request.sku().isBlank()
                ? request.sku().trim()
                : "PROD-" + System.currentTimeMillis();

        Product product = Product.builder()
                .sku(sku)
                .title(request.title())
                .description(request.description())
                .price(request.price())
                .imageUrl(request.imageUrl() != null && !request.imageUrl().isBlank() ? request.imageUrl() : "/images/image_1.webp")
                .category(category)
                .isFeatured(request.isFeatured())
                .isActive(request.isActive())
                .build();

        Product savedProduct = productRepository.save(product);

        int initialStock = request.stockQuantity() != null ? request.stockQuantity() : 10;
        Inventory inventory = Inventory.builder()
                .product(savedProduct)
                .quantityAvailable(initialStock)
                .quantityReserved(0)
                .build();
        inventoryRepository.save(inventory);

        return ProductResponse.from(savedProduct, initialStock);
    }

    public ProductResponse updateProduct(Long id, AdminProductRequest request) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product", id));

        if (request.title() != null) product.setTitle(request.title());
        if (request.description() != null) product.setDescription(request.description());
        if (request.price() != null) product.setPrice(request.price());
        if (request.sku() != null && !request.sku().isBlank()) product.setSku(request.sku());
        if (request.imageUrl() != null && !request.imageUrl().isBlank()) product.setImageUrl(request.imageUrl());
        product.setFeatured(request.isFeatured());
        product.setActive(request.isActive());

        if (request.categoryId() != null) {
            Category category = categoryRepository.findById(request.categoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Category", request.categoryId()));
            product.setCategory(category);
        }

        Product savedProduct = productRepository.save(product);

        int available = inventoryRepository.findByProductId(savedProduct.getId())
                .map(Inventory::getQuantityAvailable)
                .orElse(0);

        if (request.stockQuantity() != null) {
            updateInventory(savedProduct.getId(), new AdminInventoryRequest(request.stockQuantity()));
            available = request.stockQuantity();
        }

        return ProductResponse.from(savedProduct, available);
    }

    public void deleteProduct(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product", id));
        product.setActive(false);
        productRepository.save(product);
    }

    public int updateInventory(Long productId, AdminInventoryRequest request) {
        Inventory inventory = inventoryRepository.findByProductId(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Inventory for product", productId));

        inventory.setQuantityAvailable(request.quantityAvailable());
        inventoryRepository.save(inventory);
        return inventory.getQuantityAvailable();
    }
}
