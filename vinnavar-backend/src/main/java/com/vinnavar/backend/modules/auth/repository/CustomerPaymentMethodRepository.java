package com.vinnavar.backend.modules.auth.repository;

import com.vinnavar.backend.modules.auth.entity.CustomerPaymentMethod;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CustomerPaymentMethodRepository extends JpaRepository<CustomerPaymentMethod, Long> {
    List<CustomerPaymentMethod> findByCustomerMobileOrderByIsDefaultDescCreatedAtDesc(String customerMobile);
    List<CustomerPaymentMethod> findByCustomerMobile(String customerMobile);
}
