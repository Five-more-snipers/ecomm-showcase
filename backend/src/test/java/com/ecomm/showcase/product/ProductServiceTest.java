package com.ecomm.showcase.product;

import com.ecomm.showcase.product.dto.ProductResponse;
import com.ecomm.showcase.product.service.ProductService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.test.context.ActiveProfiles;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("local-h2")
class ProductServiceTest {

    @Autowired
    private ProductService productService;

    @Test
    void testGetProductsPagination() {
        Page<ProductResponse> page = productService.getProducts(null, null, PageRequest.of(0, 10));
        assertNotNull(page);
        assertFalse(page.isEmpty());
        assertTrue(page.getTotalElements() > 0);
    }
}
