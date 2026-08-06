package com.vinnavar.backend.modules.auth.repository;

import com.vinnavar.backend.modules.auth.entity.CustomerAddress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CustomerAddressRepository extends JpaRepository<CustomerAddress, Long> {
    List<CustomerAddress> findByCustomerMobileOrderByIsDefaultDescCreatedAtDesc(String customerMobile);
    List<CustomerAddress> findByCustomerMobileAndAddressType(String customerMobile, String addressType);
}
