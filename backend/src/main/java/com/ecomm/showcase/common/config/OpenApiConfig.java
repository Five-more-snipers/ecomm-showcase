package com.ecomm.showcase.common.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI ecommOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Mock E-Commerce Showcase API")
                        .description("REST API for browsing products, managing guest carts, processing orders, and simulating checkout.")
                        .version("1.0.0")
                        .contact(new Contact().name("E-Commerce Showcase Team")));
    }
}
