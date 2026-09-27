package com.ecomm.showcase.inventory.entity;

import com.ecomm.showcase.product.entity.Product;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;

@Entity
@Table(name = "inventories")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Inventory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false, unique = true)
    private Product product;

    @Column(name = "quantity_available", nullable = false)
    private int quantityAvailable;

    @Column(name = "quantity_reserved", nullable = false)
    private int quantityReserved;

    @Version
    @Column(nullable = false)
    private Long version;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    public boolean hasStock(int requested) {
        return this.quantityAvailable >= requested;
    }

    public void decrement(int quantity) {
        if (this.quantityAvailable < quantity) {
            throw new IllegalStateException("Attempted to decrement below available inventory.");
        }
        this.quantityAvailable -= quantity;
    }

    public void replenish(int quantity) {
        this.quantityAvailable += quantity;
    }
}
