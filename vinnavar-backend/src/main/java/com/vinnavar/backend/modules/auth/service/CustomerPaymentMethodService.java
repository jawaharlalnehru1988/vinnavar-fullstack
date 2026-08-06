package com.vinnavar.backend.modules.auth.service;

import com.vinnavar.backend.modules.auth.entity.CustomerPaymentMethod;
import com.vinnavar.backend.modules.auth.repository.CustomerPaymentMethodRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CustomerPaymentMethodService {

    private final CustomerPaymentMethodRepository paymentMethodRepository;

    @Transactional(readOnly = true)
    public List<CustomerPaymentMethod> getPaymentMethodsByMobile(String mobile) {
        return paymentMethodRepository.findByCustomerMobileOrderByIsDefaultDescCreatedAtDesc(mobile);
    }

    @Transactional
    public CustomerPaymentMethod savePaymentMethod(CustomerPaymentMethod paymentMethod) {
        if (Boolean.TRUE.equals(paymentMethod.getIsDefault())) {
            unsetDefaultMethods(paymentMethod.getCustomerMobile());
        }
        return paymentMethodRepository.save(paymentMethod);
    }

    @Transactional
    public void deletePaymentMethod(Long id) {
        paymentMethodRepository.deleteById(id);
    }

    @Transactional
    public CustomerPaymentMethod setDefaultPaymentMethod(Long id) {
        CustomerPaymentMethod target = paymentMethodRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Payment method not found"));
        unsetDefaultMethods(target.getCustomerMobile());
        target.setIsDefault(true);
        return paymentMethodRepository.save(target);
    }

    private void unsetDefaultMethods(String mobile) {
        List<CustomerPaymentMethod> list = paymentMethodRepository.findByCustomerMobile(mobile);
        for (CustomerPaymentMethod pm : list) {
            if (Boolean.TRUE.equals(pm.getIsDefault())) {
                pm.setIsDefault(false);
                paymentMethodRepository.save(pm);
            }
        }
    }
}
