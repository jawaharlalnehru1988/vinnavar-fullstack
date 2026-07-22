package com.vinnavar.backend.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.io.File;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Value("${app.media.dir:/var/www/vinnavar-fullstack/vinnavar-backend/media}")
    private String mediaDir;

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOriginPatterns("*")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH")
                .allowedHeaders("*")
                .allowCredentials(true);
    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        File folder = new File(mediaDir);
        if (!folder.exists()) {
            folder.mkdirs();
        }
        String location = "file:" + folder.getAbsolutePath() + File.separator;
        registry.addResourceHandler("/media/**")
                .addResourceLocations(location);
    }
}
