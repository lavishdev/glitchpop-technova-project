package com.crowdshield.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        // CORS is now entirely handled by Spring Security in SecurityConfig.java
        // registry.addMapping("/**")
        //         .allowedOrigins("http://localhost:3000", "http://localhost:5173")
        //         .allowedMethods("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS")
        //         .allowedHeaders("Authorization", "Content-Type", "Accept")
        //         .allowCredentials(true);
    }
}
