package com.ecomm.showcase.product.service;

import com.ecomm.showcase.common.exception.ResourceNotFoundException;
import com.ecomm.showcase.inventory.entity.Inventory;
import com.ecomm.showcase.inventory.repository.InventoryRepository;
import com.ecomm.showcase.product.dto.CategoryResponse;
import com.ecomm.showcase.product.dto.ProductResponse;
import com.ecomm.showcase.product.entity.Product;
import com.ecomm.showcase.product.repository.CategoryRepository;
import com.ecomm.showcase.product.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final InventoryRepository inventoryRepository;

    public List<CategoryResponse> getAllCategories() {
        return categoryRepository.findAll().stream()
                .map(CategoryResponse::from)
                .toList();
    }

    public Page<ProductResponse> getProducts(String categorySlug, String search, Pageable pageable) {
        String querySearch = (search != null && !search.trim().isEmpty()) ? search.trim() : null;
        String queryCategory = (categorySlug != null && !categorySlug.trim().isEmpty()) ? categorySlug.trim() : null;

        return productRepository.searchProducts(queryCategory, querySearch, pageable)
                .map(p -> ProductResponse.from(p, getAvailableStock(p.getId())));
    }

    public ProductResponse getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product", id));
        return ProductResponse.from(product, getAvailableStock(product.getId()));
    }

    public List<ProductResponse> getFeaturedProducts() {
        return productRepository.findFeaturedProducts().stream()
                .map(p -> ProductResponse.from(p, getAvailableStock(p.getId())))
                .toList();
    }

    private int getAvailableStock(Long productId) {
        return inventoryRepository.findByProductId(productId)
                .map(Inventory::getQuantityAvailable)
                .orElse(0);
    }
}
