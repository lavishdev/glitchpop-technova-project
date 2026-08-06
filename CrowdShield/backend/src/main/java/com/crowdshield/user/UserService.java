package com.crowdshield.user;

import com.crowdshield.user.dto.UserDto;
import com.crowdshield.user.dto.UserRoleUpdateDto;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final com.crowdshield.activity.ActivityLogService activityLogService;
    private final org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;

    public Page<UserDto> getAllUsers(Pageable pageable) {
        return userRepository.findAll(pageable).map(this::toDto);
    }

    public UserDto createUser(com.crowdshield.user.dto.UserCreateDto dto) {
        if (userRepository.findByUsername(dto.getUsername()).isPresent()) {
            throw new IllegalArgumentException("Username already exists");
        }
        
        String newRole = dto.getRole().toUpperCase();
        if (!newRole.startsWith("ROLE_")) {
            newRole = "ROLE_" + newRole;
        }

        User user = User.builder()
                .username(dto.getUsername())
                .password(passwordEncoder.encode(dto.getPassword()))
                .role(newRole)
                .build();
                
        User saved = userRepository.save(user);
        activityLogService.logActivity(getUsername(), com.crowdshield.activity.ActivityAction.REGISTER, "Created new user " + saved.getUsername() + " with role " + newRole);
        return toDto(saved);
    }

    public UserDto getUserById(Long id) {
        return userRepository.findById(id)
                .map(this::toDto)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
    }

    public UserDto updateUserRole(Long id, UserRoleUpdateDto dto) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        
        String newRole = dto.getRole().toUpperCase();
        if (!newRole.startsWith("ROLE_")) {
            newRole = "ROLE_" + newRole;
        }
        
        user.setRole(newRole);
        User saved = userRepository.save(user);
        
        activityLogService.logActivity(getUsername(), com.crowdshield.activity.ActivityAction.ROLE_CHANGED, "Changed role of user " + saved.getUsername() + " to " + newRole);
        
        return toDto(saved);
    }

    public void deleteUser(Long id) {
        if (!userRepository.existsById(id)) {
            throw new IllegalArgumentException("User not found");
        }
        userRepository.deleteById(id);
    }

    private UserDto toDto(User user) {
        return UserDto.builder()
                .id(user.getId())
                .username(user.getUsername())
                .role(user.getRole())
                .build();
    }
    
    private String getUsername() {
        org.springframework.security.core.Authentication auth = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();
        return (auth != null && auth.getName() != null) ? auth.getName() : "system";
    }
}
