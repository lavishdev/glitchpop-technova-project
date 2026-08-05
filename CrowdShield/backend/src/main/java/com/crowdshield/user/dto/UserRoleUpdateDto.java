package com.crowdshield.user.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class UserRoleUpdateDto {
    @NotBlank(message = "Role is mandatory")
    private String role;
}
