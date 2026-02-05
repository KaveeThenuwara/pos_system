package lk.ijse.backend.repo;

import lk.ijse.backend.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface CustomerRepo extends JpaRepository<Customer, UUID> {

    Customer findByEmail(String email);

    boolean existsByEmail(String email);
}
