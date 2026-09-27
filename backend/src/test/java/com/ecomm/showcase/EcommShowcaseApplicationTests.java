package com.ecomm.showcase;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest
@ActiveProfiles("local-h2")
class EcommShowcaseApplicationTests {

    @Test
    void contextLoads() {
        // Verifies Spring context, JPA mapping, and Flyway schema execution
    }
}
