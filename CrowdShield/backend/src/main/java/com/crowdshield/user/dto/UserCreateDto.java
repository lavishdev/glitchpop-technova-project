package com.crowdshield.user.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class UserCreateDto {
    @NotBlank(message = "Username cannot be empty")
    private String username;
    
    @NotBlank(message = "Password cannot be empty")
    private String password;
    
    @NotBlank(message = "Role cannot be empty")
    private String role;
}
