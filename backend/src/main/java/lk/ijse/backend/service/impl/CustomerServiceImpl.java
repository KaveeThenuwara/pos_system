package lk.ijse.backend.service.impl;

import lk.ijse.backend.dto.CustomerDTO;
import lk.ijse.backend.entity.Customer;
import lk.ijse.backend.repo.CustomerRepo;
import lk.ijse.backend.service.CustomerService;
import lk.ijse.backend.util.VarList;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeToken;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class CustomerServiceImpl implements CustomerService {

    @Autowired
    private CustomerRepo customerRepo;

    @Autowired
    private ModelMapper modelMapper;


    //customer save
    @Override
    public int saveCustomer(CustomerDTO customerDTO) {
        if(customerRepo.existsByEmail(customerDTO.getEmail())){
            return VarList.All_Ready_Added;
        }
        Customer customer = modelMapper.map(customerDTO, Customer.class);
        Customer savedCustomer = customerRepo.save(customer);
        System.out.println("saved customer : "+savedCustomer);
        return VarList.Created;
    }

    //customer update
    @Override
    public int updateCustomer(CustomerDTO customerDTO) {
        if(customerRepo.existsByEmail(customerDTO.getEmail())){
            Customer customer = modelMapper.map(customerDTO, Customer.class);
            Customer updateCustomer = customerRepo.save(customer);
            System.out.println("updateCustomer : "+updateCustomer);
            return VarList.OK;
        }
        return VarList.Not_Found;
    }

    //customer delete
    @Override
    public int deleteCustomer(String email) {
        if(customerRepo.existsByEmail(email)){
            Customer customer = customerRepo.findByEmail(email);
            customerRepo.delete(customer);
            return VarList.OK;
        }
        return VarList.Not_Found;
    }

    //get All Customer
    @Override
    public List<CustomerDTO> getAllCustomer() {
        List<Customer> customerList = customerRepo.findAll();
        return modelMapper.map(customerList,new TypeToken<List<CustomerDTO>>(){}.getType());
    }




    //get customer by email
    @Override
    public Customer getCustomerById(String email) {
        if(customerRepo.existsByEmail(email)){
            Customer customer = customerRepo.findByEmail(email);
            return customer;
        }
        return null;
    }

}
