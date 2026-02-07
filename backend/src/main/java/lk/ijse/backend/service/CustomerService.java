package lk.ijse.backend.service;

import lk.ijse.backend.dto.CustomerDTO;
import lk.ijse.backend.entity.Customer;

import java.util.List;

public interface CustomerService {
    //customer save
    int saveCustomer(CustomerDTO customerDTO);

    //customer update
    int updateCustomer(CustomerDTO customerDTO);

    //customer delete
    int deleteCustomer(String email);

    //get All Customer
    List<CustomerDTO> getAllCustomer();

    //get customer by email
    Customer getCustomerById(String email);
}
