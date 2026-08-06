package com.vinnavar.backend.modules.auth.controller;

import com.vinnavar.backend.modules.auth.entity.CustomerAddress;
import com.vinnavar.backend.modules.auth.service.CustomerAddressService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/customer/addresses")
@RequiredArgsConstructor
public class CustomerAddressController {

    private final CustomerAddressService addressService;

    @GetMapping
    public ResponseEntity<List<CustomerAddress>> getAddressesByMobile(@RequestParam String mobile) {
        return ResponseEntity.ok(addressService.getAddressesByMobile(mobile));
    }

    @PostMapping
    public ResponseEntity<CustomerAddress> createAddress(@RequestBody CustomerAddress address) {
        return ResponseEntity.ok(addressService.saveAddress(address));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CustomerAddress> updateAddress(@PathVariable Long id, @RequestBody CustomerAddress address) {
        return ResponseEntity.ok(addressService.updateAddress(id, address));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAddress(@PathVariable Long id) {
        addressService.deleteAddress(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}/default")
    public ResponseEntity<CustomerAddress> setDefaultAddress(@PathVariable Long id) {
        return ResponseEntity.ok(addressService.setDefaultAddress(id));
    }
}
