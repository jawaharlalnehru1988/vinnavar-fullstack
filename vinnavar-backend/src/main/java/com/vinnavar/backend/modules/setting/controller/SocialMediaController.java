package com.vinnavar.backend.modules.setting.controller;

import com.vinnavar.backend.modules.setting.entity.SocialMedia;
import com.vinnavar.backend.modules.setting.service.SocialMediaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/social-media")
@RequiredArgsConstructor
public class SocialMediaController {

    private final SocialMediaService socialMediaService;

    @GetMapping
    public ResponseEntity<List<SocialMedia>> getAllSocialMediaLinks() {
        return ResponseEntity.ok(socialMediaService.getAllSocialMediaLinks());
    }

    @PostMapping("/admin")
    public ResponseEntity<SocialMedia> createSocialMediaLink(@RequestBody SocialMedia socialMedia) {
        return ResponseEntity.ok(socialMediaService.createSocialMediaLink(socialMedia));
    }

    @PutMapping("/admin/{id}")
    public ResponseEntity<SocialMedia> updateSocialMediaLink(@PathVariable Long id, @RequestBody SocialMedia socialMedia) {
        return socialMediaService.updateSocialMediaLink(id, socialMedia)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/admin/{id}")
    public ResponseEntity<Void> deleteSocialMediaLink(@PathVariable Long id) {
        if (socialMediaService.deleteSocialMediaLink(id)) {
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}
