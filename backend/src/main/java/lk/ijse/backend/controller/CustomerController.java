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

    @PostMapping(value="/saveCustomer")
    public ResponseEntity<ResponseDTO> saveCustomer(@RequestBody CustomerDTO customerDto) {
        System.out.println("Come from frontend : "+customerDto);
        try{
            int res = customerService.saveCustomer(customerDto);
            switch(res){
                case VarList.Created:
                    System.out.println("Customer created successfully");
                    return ResponseEntity.ok(new ResponseDTO(VarList.Created,"Customer Save Successfully",customerDto));


                case VarList.All_Ready_Added:
                    System.out.println("Customer added successfully");
                    return ResponseEntity.status(HttpStatus.CONFLICT).body(new ResponseDTO(VarList.All_Ready_Added,"Customer All Ready Added",null));

                default:
                    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ResponseDTO(VarList.Internal_Server_Error,"Customer Not Added Successfully",null));



            }
        }catch(Exception e){
            throw new RuntimeException(e);
        }
    }

    @GetMapping(value="/getAll")
    public List<CustomerDTO>  getAllCustomer(){
        List<CustomerDTO> customerList = customerService.getAllCustomer();
        System.out.println("dsgagfdasgadsadasd "+customerList);
        return customerList;
    }
}
