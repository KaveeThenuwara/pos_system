package lk.ijse.backend.controller;


import lk.ijse.backend.dto.CustomerDTO;
import lk.ijse.backend.dto.ResponseDTO;
import lk.ijse.backend.entity.Customer;
import lk.ijse.backend.service.CustomerService;
import lk.ijse.backend.util.VarList;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin  // important
@RequestMapping("/api/v1/customers")
public class CustomerController {

    private final CustomerService customerService;


    public CustomerController(CustomerService customerService) {
        this.customerService = customerService;
    }
//save Customer
    @PostMapping(value="/saveCustomer")
    public ResponseEntity<ResponseDTO> saveCustomer(@RequestBody CustomerDTO customerDto) {

        try {
            int res = customerService.saveCustomer(customerDto);
            switch (res) {
                case VarList.Created:
                    System.out.println("Customer created successfully");
                    return ResponseEntity.ok(new ResponseDTO(VarList.Created, "Customer Save Successfully", customerDto));


                case VarList.All_Ready_Added:
                    System.out.println("Customer added successfully");
                    return ResponseEntity.status(HttpStatus.CONFLICT).body(new ResponseDTO(VarList.All_Ready_Added, "Customer All Ready Added", null));

                default:
                    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ResponseDTO(VarList.Internal_Server_Error, "Customer Not Added Successfully", null));


            }
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    //update customer
    @PostMapping("/updateCustomer")
    public ResponseEntity<ResponseDTO> updateCustomer(@RequestBody CustomerDTO customerDto) {
        int res = customerService.updateCustomer(customerDto);

        if (res == VarList.OK) {
            return ResponseEntity.ok(new ResponseDTO(VarList.OK, "Customer Updated successfully", customerDto));

        } else if (res == VarList.Not_Found) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ResponseDTO(VarList.Not_Found, "Customer Not Found", null));
        }
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ResponseDTO(VarList.Internal_Server_Error, "Customer Not Updated", null));

    }
@PostMapping(value = "/deleteCustomer")
public ResponseEntity<ResponseDTO> deleteCustomer(@RequestBody CustomerDTO customerDto) {
        int res = customerService.deleteCustomer(customerDto.getEmail());
        if (res == VarList.OK) {
            return ResponseEntity.ok(new ResponseDTO(VarList.OK, "Customer Deleted successfully", customerDto.getEmail()));

        }else if (res == VarList.Not_Found) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ResponseDTO(VarList.Not_Found, "Customer Not Deleted", null));
        }
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ResponseDTO(VarList.Internal_Server_Error, "Customer Not Deleted", null));
}
    @GetMapping(value="/getAll")
    public List<CustomerDTO>  getAllCustomer(){
        List<CustomerDTO> customerList = customerService.getAllCustomer();
        return customerList;
    }
}

