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

    @org.springframework.beans.factory.annotation.Value("${app.media.dir:/var/www/vinnavar-fullstack/vinnavar-backend/media}")
    private String mediaDir;

    @GetMapping("/customer/complaints")
    public ResponseEntity<List<CustomerComplaint>> getCustomerComplaints(@RequestParam String mobile) {
        return ResponseEntity.ok(complaintService.getComplaintsByCustomer(mobile));
    }

    @PostMapping("/customer/complaints")
    public ResponseEntity<CustomerComplaint> createComplaint(@RequestBody CustomerComplaint complaint) {
        return ResponseEntity.ok(complaintService.createComplaint(complaint));
    }

    @PostMapping("/customer/complaints/upload-image")
    public ResponseEntity<?> uploadComplaintImage(@RequestParam("file") org.springframework.web.multipart.MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body(java.util.Map.of("error", "Uploaded file is empty"));
        }
        if (file.getSize() > 5 * 1024 * 1024) {
            return ResponseEntity.badRequest().body(java.util.Map.of("error", "Image file size must not exceed 5 MB"));
        }

        try {
            java.io.File complaintsFolder = new java.io.File(mediaDir, "complaints");
            if (!complaintsFolder.exists()) {
                complaintsFolder.mkdirs();
            }

            String originalFilename = file.getOriginalFilename();
            String extension = "";
            if (originalFilename != null && originalFilename.contains(".")) {
                extension = originalFilename.substring(originalFilename.lastIndexOf("."));
            }

            String newFilename = "comp_" + java.util.UUID.randomUUID().toString().substring(0, 10) + extension;
            java.nio.file.Path targetPath = java.nio.file.Paths.get(complaintsFolder.getAbsolutePath(), newFilename);

            java.nio.file.Files.copy(file.getInputStream(), targetPath, java.nio.file.StandardCopyOption.REPLACE_EXISTING);

            String relativeUrl = "/media/complaints/" + newFilename;
            return ResponseEntity.ok(java.util.Map.of("imageUrl", relativeUrl));
        } catch (java.io.IOException e) {
            return ResponseEntity.internalServerError().body(java.util.Map.of("error", "Failed to save complaint image: " + e.getMessage()));
        }
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
