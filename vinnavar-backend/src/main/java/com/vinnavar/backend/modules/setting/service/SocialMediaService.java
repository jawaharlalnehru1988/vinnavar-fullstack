package com.vinnavar.backend.modules.setting.service;

import com.vinnavar.backend.modules.setting.entity.SocialMedia;
import com.vinnavar.backend.modules.setting.repository.SocialMediaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class SocialMediaService {

    private final SocialMediaRepository socialMediaRepository;

    public List<SocialMedia> getAllSocialMediaLinks() {
        return socialMediaRepository.findAll();
    }

    public SocialMedia createSocialMediaLink(SocialMedia socialMedia) {
        return socialMediaRepository.save(socialMedia);
    }

    public Optional<SocialMedia> updateSocialMediaLink(Long id, SocialMedia updatedData) {
        return socialMediaRepository.findById(id).map(existing -> {
            existing.setName(updatedData.getName());
            existing.setIconImageUrl(updatedData.getIconImageUrl());
            existing.setLink(updatedData.getLink());
            return socialMediaRepository.save(existing);
        });
    }

    public boolean deleteSocialMediaLink(Long id) {
        if (socialMediaRepository.existsById(id)) {
            socialMediaRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
