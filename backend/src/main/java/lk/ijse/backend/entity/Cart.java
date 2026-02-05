package lk.ijse.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Cart {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    @ManyToOne
    private Item item;
    @Column(nullable = false)
    private String email;
    @Column(nullable = false)
    private int qty;
    @Column(nullable = false)
    private int price;
    @Column(nullable = false)
    private int qtyPrice;
}
