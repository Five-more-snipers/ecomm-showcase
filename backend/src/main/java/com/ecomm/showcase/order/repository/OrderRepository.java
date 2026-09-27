package com.ecomm.showcase.order.repository;

import com.ecomm.showcase.order.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, String> {

    Optional<Order> findByOrderNumber(String orderNumber);

    @Query("""
        SELECT o FROM Order o 
        LEFT JOIN FETCH o.items i 
        LEFT JOIN FETCH i.product 
        LEFT JOIN FETCH o.customer 
        WHERE o.orderNumber = :orderNumber
    """)
    Optional<Order> findByOrderNumberWithItems(@Param("orderNumber") String orderNumber);

    @Query("SELECT COUNT(o) FROM Order o")
    long countOrders();
}
