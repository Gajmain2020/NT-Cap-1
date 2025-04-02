package com.gajmain2020.cap1.middleware;

import com.gajmain2020.cap1.enums.Role;
import com.gajmain2020.cap1.models.User;
import com.gajmain2020.cap1.repositories.UserRepository;
import com.gajmain2020.cap1.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class InterviewerMiddleware {

    @Autowired
    private JwtUtil jwtUtil;
    @Autowired
    private UserRepository userRepository;

    public boolean isValidInterviewerAuthToken(String authHeader) {
        // Extract token from Authorization header
        if (!authHeader.startsWith("Bearer ")) {
            return false;
        }

        // Get the email by the token
        String token = authHeader.substring(7);
        String email = jwtUtil.extractEmail(token); // Extract email from JWT token

        // Find the user using the email extracted
        Optional<User> userOptional = userRepository.findByEmail(email);
        if (userOptional.isEmpty()) {
            return false; //if user does not exist
        }

        // Check if the role of the user is HR or not
        if (userOptional.get().getRole() != Role.INTERVIEWER) {
            return false;
        }

        return true;
    }
}
