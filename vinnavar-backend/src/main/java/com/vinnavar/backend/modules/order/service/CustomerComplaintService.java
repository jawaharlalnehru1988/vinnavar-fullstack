package com.vinnavar.backend.modules.order.service;

import com.vinnavar.backend.modules.order.entity.CustomerComplaint;
import com.vinnavar.backend.modules.order.repository.CustomerComplaintRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CustomerComplaintService {

    private final CustomerComplaintRepository complaintRepository;

    @Transactional(readOnly = true)
    public List<CustomerComplaint> getComplaintsByCustomer(String mobile) {
        return complaintRepository.findByCustomerMobileOrderByCreatedAtDesc(mobile);
    }

    @Transactional(readOnly = true)
    public List<CustomerComplaint> getAllComplaints() {
        return complaintRepository.findAllByOrderByCreatedAtDesc();
    }

    @Transactional
    public CustomerComplaint createComplaint(CustomerComplaint complaint) {
        complaint.setRefundPolicyAccepted(true);
        if (complaint.getStatus() == null) {
            complaint.setStatus("PENDING");
        }
        return complaintRepository.save(complaint);
    }

    @Transactional
    public CustomerComplaint updateComplaintStatus(Long id, String status, String adminNotes) {
        CustomerComplaint complaint = complaintRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Complaint not found"));
        if (status != null) {
            complaint.setStatus(status);
        }
        if (adminNotes != null) {
            complaint.setAdminNotes(adminNotes);
        }
        return complaintRepository.save(complaint);
    }
}
