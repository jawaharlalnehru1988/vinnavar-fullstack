package com.vinnavar.backend.modules.order.controller;

import com.vinnavar.backend.modules.order.entity.CustomerComplaint;
import com.vinnavar.backend.modules.order.service.CustomerComplaintService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class CustomerComplaintController {

    private final CustomerComplaintService complaintService;

    @GetMapping("/customer/complaints")
    public ResponseEntity<List<CustomerComplaint>> getCustomerComplaints(@RequestParam String mobile) {
        return ResponseEntity.ok(complaintService.getComplaintsByCustomer(mobile));
    }

    @PostMapping("/customer/complaints")
    public ResponseEntity<CustomerComplaint> createComplaint(@RequestBody CustomerComplaint complaint) {
        return ResponseEntity.ok(complaintService.createComplaint(complaint));
    }

    @GetMapping("/admin/complaints")
    public ResponseEntity<List<CustomerComplaint>> getAllComplaints() {
        return ResponseEntity.ok(complaintService.getAllComplaints());
    }

    @PutMapping("/admin/complaints/{id}/status")
    public ResponseEntity<CustomerComplaint> updateComplaintStatus(
            @PathVariable Long id,
            @RequestParam String status,
            @RequestParam(required = false) String adminNotes
    ) {
        return ResponseEntity.ok(complaintService.updateComplaintStatus(id, status, adminNotes));
    }
}
