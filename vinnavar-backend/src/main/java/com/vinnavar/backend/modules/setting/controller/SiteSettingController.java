package com.vinnavar.backend.modules.setting.controller;

import com.vinnavar.backend.modules.setting.entity.SiteSetting;
import com.vinnavar.backend.modules.setting.service.SiteSettingService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class SiteSettingController {

    private final SiteSettingService service;

    @Value("${app.media.dir:/var/www/vinnavar-fullstack/vinnavar-backend/media}")
    private String mediaDir;

    @GetMapping("/settings")
    public ResponseEntity<Map<String, String>> getSettingsMap() {
        return ResponseEntity.ok(service.getAllSettingsAsMap());
    }

    @GetMapping("/admin/settings")
    public ResponseEntity<List<SiteSetting>> getAllAdminSettings() {
        return ResponseEntity.ok(service.getAllSettings());
    }

    @PutMapping("/admin/settings/{key}")
    public ResponseEntity<SiteSetting> updateSetting(
            @PathVariable String key,
            @RequestBody Map<String, String> body
    ) {
        String value = body.get("value");
        String description = body.get("description");
        String group = body.get("group");
        return ResponseEntity.ok(service.updateSettingFull(key, value, description, group));
    }

    @PostMapping("/admin/settings/upload-asset")
    public ResponseEntity<Map<String, String>> uploadAssetImage(@RequestParam("file") MultipartFile file) throws IOException {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Uploaded file is empty"));
        }

        File imagesFolder = new File(mediaDir, "site");
        if (!imagesFolder.exists()) {
            imagesFolder.mkdirs();
        }

        String originalFilename = file.getOriginalFilename();
        String extension = "";
        if (originalFilename != null && originalFilename.contains(".")) {
            extension = originalFilename.substring(originalFilename.lastIndexOf("."));
        }

        String newFilename = "asset_" + UUID.randomUUID().toString().substring(0, 8) + extension;
        Path targetPath = Paths.get(imagesFolder.getAbsolutePath(), newFilename);

        Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);

        String imageUrl = "/media/site/" + newFilename;
        return ResponseEntity.ok(Map.of("imageUrl", imageUrl));
    }
}
