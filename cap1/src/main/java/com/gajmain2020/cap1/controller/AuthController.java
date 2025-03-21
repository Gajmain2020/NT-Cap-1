package com.gajmain2020.cap1.controller;

import com.gajmain2020.cap1.exception.DuplicateResourceException;
import com.gajmain2020.cap1.exception.InvalidCredentialsException;
import com.gajmain2020.cap1.models.User;
import com.gajmain2020.cap1.repositories.UserRepository;
import com.gajmain2020.cap1.security.JwtUtil;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/user")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;
    private final BCryptPasswordEncoder passwordEncoder;

    public AuthController(UserRepository userRepository, JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
        this.passwordEncoder = new BCryptPasswordEncoder();
    }

    @GetMapping
    public boolean HealthCheck(){
        System.out.println("Server Testing");
        return true;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        Optional<User> existingUser = userRepository.findByEmail(user.getEmail());

        if (existingUser.isPresent()) {
            System.out.println("hello world fuck off");
            throw new DuplicateResourceException("Email already exists: " + user.getEmail());
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userRepository.save(user);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "User registered successfully.");
        response.put("data", Map.of("id", user.getId(),
                "email", user.getEmail()));

        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestParam String email, @RequestParam String password) {
//        System.out.println(email);
        Optional<User> userOptional = userRepository.findByEmail(email);

        if (userOptional.isEmpty() || !passwordEncoder.matches(password, userOptional.get().getPassword())) {
            throw new InvalidCredentialsException("Invalid email or password.");
        }

        User user = userOptional.get();  // Get the user object
        String token = jwtUtil.generateToken(email);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Login successful.");

        // Include the user ID, name, and token in the response
        Map<String, Object> userData = new HashMap<>();
        userData.put("id", user.getId());
        userData.put("name", user.getName());
        userData.put("email", user.getEmail());
        userData.put("role", user.getRole());
        userData.put("token", token);

        response.put("data", userData);

        return ResponseEntity.ok(response);
    }

    @PutMapping("/change-password")
    public ResponseEntity<Map<String, Object>> changePassword(
            @RequestParam String oldPassword,
            @RequestParam String newPassword,
            @RequestParam String confirmPassword,
            @RequestHeader("Authorization") String authHeader) {

        // Extract token from Authorization header
        if (!authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of(
                    "success", false,
                    "message", "Invalid authorization token."
            ));
        }

        String token = authHeader.substring(7);
        String email = jwtUtil.extractEmail(token); // Extract email from JWT token

        Optional<User> userOptional = userRepository.findByEmail(email);
        if (userOptional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of(
                    "success", false,
                    "message", "User not found."
            ));
        }

        User user = userOptional.get();

        // Verify old password
        if (!passwordEncoder.matches(oldPassword, user.getPassword())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of(
                    "success", false,
                    "message", "Old password is incorrect."
            ));
        }

        // Check if new password matches confirmation
        if (!newPassword.equals(confirmPassword)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of(
                    "success", false,
                    "message", "New password and confirm password must match."
            ));
        }

        // Hash the new password and update the user
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Password Changed successfully.");

        return ResponseEntity.ok(response);
    }

}
