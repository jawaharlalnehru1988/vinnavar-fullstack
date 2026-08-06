package com.vinnavar.backend.modules.order.repository;

import com.vinnavar.backend.modules.order.entity.CustomerComplaint;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CustomerComplaintRepository extends JpaRepository<CustomerComplaint, Long> {
    List<CustomerComplaint> findByCustomerMobileOrderByCreatedAtDesc(String customerMobile);
    List<CustomerComplaint> findAllByOrderByCreatedAtDesc();
}
