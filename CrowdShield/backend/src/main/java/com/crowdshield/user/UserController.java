package com.crowdshield.user;

import com.crowdshield.common.ApiResponse;
import com.crowdshield.user.dto.UserDto;
import com.crowdshield.user.dto.UserRoleUpdateDto;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Page<UserDto>>> getAllUsers(Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.success(userService.getAllUsers(pageable)));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserDto>> getCurrentUser() {
        return ResponseEntity.ok(ApiResponse.success(userService.getCurrentUserDto(getCurrentUsername())));
    }

    @PutMapping("/me/password")
    public ResponseEntity<ApiResponse<Void>> updatePassword(@Valid @RequestBody com.crowdshield.user.dto.UpdatePasswordDto dto) {
        userService.updatePassword(getCurrentUsername(), dto);
        return ResponseEntity.ok(ApiResponse.success(null, "Password updated successfully"));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<UserDto>> createUser(@Valid @RequestBody com.crowdshield.user.dto.UserCreateDto dto) {
        return ResponseEntity.ok(ApiResponse.success(userService.createUser(dto), "User created successfully"));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<UserDto>> getUserById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(userService.getUserById(id)));
    }

    @PutMapping("/{id}/role")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<UserDto>> updateUserRole(@PathVariable Long id, @Valid @RequestBody UserRoleUpdateDto dto) {
        return ResponseEntity.ok(ApiResponse.success(userService.updateUserRole(id, dto)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.ok(ApiResponse.success(null, "User deleted successfully"));
    }

    private String getCurrentUsername() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return (auth != null && auth.getName() != null) ? auth.getName() : "system";
    }
}
