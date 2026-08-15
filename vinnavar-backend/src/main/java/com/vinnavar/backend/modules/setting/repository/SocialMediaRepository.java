package com.vinnavar.backend.modules.setting.repository;

import com.vinnavar.backend.modules.setting.entity.SocialMedia;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SocialMediaRepository extends JpaRepository<SocialMedia, Long> {
}
