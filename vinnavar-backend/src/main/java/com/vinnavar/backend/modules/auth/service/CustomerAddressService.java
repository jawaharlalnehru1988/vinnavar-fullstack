package com.vinnavar.backend.modules.auth.service;

import com.vinnavar.backend.modules.auth.entity.CustomerAddress;
import com.vinnavar.backend.modules.auth.repository.CustomerAddressRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CustomerAddressService {

    private final CustomerAddressRepository addressRepository;

    @Transactional(readOnly = true)
    public List<CustomerAddress> getAddressesByMobile(String mobile) {
        return addressRepository.findByCustomerMobileOrderByIsDefaultDescCreatedAtDesc(mobile);
    }

    @Transactional
    public CustomerAddress saveAddress(CustomerAddress address) {
        if (Boolean.TRUE.equals(address.getIsDefault())) {
            unsetDefaultsForCustomer(address.getCustomerMobile(), address.getAddressType());
        }
        return addressRepository.save(address);
    }

    @Transactional
    public CustomerAddress updateAddress(Long id, CustomerAddress updated) {
        CustomerAddress existing = addressRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Address not found"));

        if (Boolean.TRUE.equals(updated.getIsDefault()) && !Boolean.TRUE.equals(existing.getIsDefault())) {
            unsetDefaultsForCustomer(existing.getCustomerMobile(), existing.getAddressType());
        }

        existing.setAddressType(updated.getAddressType() != null ? updated.getAddressType() : existing.getAddressType());
        existing.setTitle(updated.getTitle() != null ? updated.getTitle() : existing.getTitle());
        existing.setFullName(updated.getFullName() != null ? updated.getFullName() : existing.getFullName());
        existing.setPhone(updated.getPhone() != null ? updated.getPhone() : existing.getPhone());
        existing.setStreetAddress(updated.getStreetAddress() != null ? updated.getStreetAddress() : existing.getStreetAddress());
        existing.setCity(updated.getCity() != null ? updated.getCity() : existing.getCity());
        existing.setState(updated.getState() != null ? updated.getState() : existing.getState());
        existing.setPincode(updated.getPincode() != null ? updated.getPincode() : existing.getPincode());
        if (updated.getIsDefault() != null) {
            existing.setIsDefault(updated.getIsDefault());
        }

        return addressRepository.save(existing);
    }

    @Transactional
    public void deleteAddress(Long id) {
        addressRepository.deleteById(id);
    }

    @Transactional
    public CustomerAddress setDefaultAddress(Long id) {
        CustomerAddress target = addressRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Address not found"));
        unsetDefaultsForCustomer(target.getCustomerMobile(), target.getAddressType());
        target.setIsDefault(true);
        return addressRepository.save(target);
    }

    private void unsetDefaultsForCustomer(String mobile, String addressType) {
        List<CustomerAddress> list = addressRepository.findByCustomerMobileAndAddressType(mobile, addressType);
        for (CustomerAddress addr : list) {
            if (Boolean.TRUE.equals(addr.getIsDefault())) {
                addr.setIsDefault(false);
                addressRepository.save(addr);
            }
        }
    }
}
