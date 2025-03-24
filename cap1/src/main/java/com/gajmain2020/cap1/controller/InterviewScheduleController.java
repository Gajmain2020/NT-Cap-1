package com.gajmain2020.cap1.controller;


import com.gajmain2020.cap1.dto.InterviewRequest;
import com.gajmain2020.cap1.enums.InterviewStage;
import com.gajmain2020.cap1.enums.Role;
import com.gajmain2020.cap1.models.InterviewSchedule;
import com.gajmain2020.cap1.models.User;
import com.gajmain2020.cap1.repositories.InterviewScheduleRepository;
import com.gajmain2020.cap1.repositories.UserRepository;
import com.gajmain2020.cap1.security.JwtUtil;
import jakarta.validation.Valid;
import org.apache.coyote.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/schedules")
@CrossOrigin(origins = "http://localhost:5173")
public class InterviewScheduleController {

    @Autowired
    private JwtUtil jwtUtil;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private InterviewScheduleRepository interviewScheduleRepository;


    @GetMapping
    public boolean HealthCheck() {
        System.out.println("hello world");
        return true;
    }


    //API to schedule interview
    @PostMapping("/add-interview")
    public ResponseEntity<Map<String, Object>> addInterview(@Valid @RequestBody InterviewRequest interviewRequest, BindingResult result) {
        Map<String, Object> response = new HashMap<>();

        // Check for validation errors
        if (result.hasErrors()) {
            response.put("message", result.getFieldError().getDefaultMessage());
            response.put("success", false);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }

        Optional<User> optionalInterviewer = userRepository.findByEmail(interviewRequest.getInterviewerEmail());

        if (optionalInterviewer.isEmpty()) {
            response.put("message", "Interviewer email does not exist.");
            response.put("success", false);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }

        User interviewer = optionalInterviewer.get();

        if (interviewer.getRole() != Role.INTERVIEWER) {
            response.put("message", "User is not an INTERVIEWER.");
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(response);
        }

        // Parse start and end time
        LocalTime start = LocalTime.parse(interviewRequest.getStartTime());  // e.g., "14:45"
        LocalTime end = LocalTime.parse(interviewRequest.getEndTime());      // e.g., "13:45"

        // Calculate duration in minutes
        int duration = (int) Duration.between(start, end).toMinutes();

        // Validate duration
        if (duration < 0) {
            response.put("message", "Start time cannot be after end time.");
            response.put("success", false);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }

        // Create and save interview
        InterviewSchedule interview = InterviewSchedule.builder()
                .intervieweeName(interviewRequest.getIntervieweeName())
                .intervieweeEmail(interviewRequest.getIntervieweeEmail())
                .position(interviewRequest.getPosition())
                .date(interviewRequest.getDate())
                .startTime(interviewRequest.getStartTime())
                .endTime(interviewRequest.getEndTime())
                .meetLink(interviewRequest.getMeetLink())
                .resumeLink(interviewRequest.getResumeLink())
                .interviewerEmail(interviewRequest.getInterviewerEmail())
                .stage(InterviewStage.valueOf("L1"))
                .interviewer(interviewer)
                .duration(duration)  // Set calculated duration
                .build();

        interviewScheduleRepository.save(interview);

        response.put("message", "Interview scheduled successfully.");
        response.put("success", true);

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/interviews-hr")
    public ResponseEntity<Map<String, Object>> getAllInterviews() {
        Map<String, Object> response = new HashMap<>();

        LocalDate today = LocalDate.now();  // Get current date

        // Fetch upcoming interviews directly with optimized query
        List<Map<String, Object>> interviews = interviewScheduleRepository.findAllInterviews();

        if (interviews.isEmpty()) {
            response.put("message", "No interviews found.");
            response.put("success", false);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }

        response.put("interviews", interviews);
        response.put("success", true);

        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @GetMapping("/upcoming-interviews-interviewer")
    public ResponseEntity<Map<String, Object>> getUpcomingInterviewerInterviews(@RequestHeader("Authorization") String authHeader) {
        Map<String, Object> response = new HashMap<>();

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


        LocalTime currentTime = LocalTime.now();
        LocalDate currentDate = LocalDate.now();

        List<Map<String, Object>> interviews = interviewScheduleRepository.findUpcomingInterviewsViaEmail(email, currentDate.toString(), currentTime.toString());

        if (interviews.isEmpty()) {
            response.put("message", "No interviews found.");
            response.put("success", false);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }

        response.put("interviews", interviews);
        response.put("success", true);


        return ResponseEntity.status(HttpStatus.OK).body(response);


    }

    @GetMapping("/ongoing-interviews-interviewer")
    public ResponseEntity<Map<String, Object>> getOngoingInterviewerInterviews(@RequestHeader("Authorization") String authHeader) {
        Map<String, Object> response = new HashMap<>();

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

        LocalTime currentTime = LocalTime.now();
        LocalDate currentDate = LocalDate.now();

        List<Map<String, Object>> interviews = interviewScheduleRepository.findOngoingInterviewsViaEmail(email, currentDate.toString(), currentTime.toString());

        if (interviews.isEmpty()) {
            response.put("message", "No interviews found.");
            response.put("success", false);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }

        response.put("interviews", interviews);
        response.put("success", true);

        return ResponseEntity.status(HttpStatus.OK).body(response);
    }


    @GetMapping("/upcoming-interviews-hr")
    public ResponseEntity<Map<String, Object>> getUpcomingHrInterviews() {
        Map<String, Object> response = new HashMap<>();

        LocalDate today = LocalDate.now();  // Get current date
        LocalTime currentTime = LocalTime.now();

        // Fetch upcoming interviews directly with optimized query
        List<Map<String, Object>> interviews = interviewScheduleRepository.findUpcomingInterviews(today.toString(), currentTime.toString());

        if (interviews.isEmpty()) {
            response.put("message", "No upcoming interviews found.");
            response.put("success", false);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }

        response.put("interviews", interviews);
        response.put("success", true);

        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @PutMapping("/edit-scheduled-interview/{id}")
    public ResponseEntity<Map<String, Object>> editInterview(
            @PathVariable Long id,
            @Valid @RequestBody InterviewRequest interviewRequest,
            BindingResult result) {
        Map<String, Object> response = new HashMap<>();

        // Check for validation errors
        if (result.hasErrors()) {
            response.put("message", result.getFieldError().getDefaultMessage());
            response.put("success", false);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }

        Optional<InterviewSchedule> optionalInterview = interviewScheduleRepository.findById(id);

        if (optionalInterview.isEmpty()) {
            response.put("message", "Interview not found.");
            response.put("success", false);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }

        InterviewSchedule interview = optionalInterview.get();

        Optional<User> optionalInterviewer = userRepository.findByEmail(interviewRequest.getInterviewerEmail());

        if (optionalInterviewer.isEmpty()) {
            response.put("message", "Interviewer email does not exist.");
            response.put("success", false);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }

        User interviewer = optionalInterviewer.get();

        if (interviewer.getRole() != Role.INTERVIEWER) {
            response.put("message", "User is not an INTERVIEWER.");
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(response);
        }

        // Parse start and end time
        LocalTime start = LocalTime.parse(interviewRequest.getStartTime());
        LocalTime end = LocalTime.parse(interviewRequest.getEndTime());

        // Calculate duration in minutes
        int duration = (int) Duration.between(start, end).toMinutes();

        // Validate duration
        if (duration < 0) {
            response.put("message", "Start time cannot be after end time.");
            response.put("success", false);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }

        // Update interview details
        interview.setIntervieweeName(interviewRequest.getIntervieweeName());
        interview.setIntervieweeEmail(interviewRequest.getIntervieweeEmail());
        interview.setPosition(interviewRequest.getPosition());
        interview.setDate(interviewRequest.getDate());
        interview.setStartTime(interviewRequest.getStartTime());
        interview.setEndTime(interviewRequest.getEndTime());
        interview.setMeetLink(interviewRequest.getMeetLink());
        interview.setResumeLink(interviewRequest.getResumeLink());
        interview.setInterviewerEmail(interviewRequest.getInterviewerEmail());
        interview.setInterviewer(interviewer);
        interview.setDuration(duration);

        interviewScheduleRepository.save(interview);

        response.put("message", "Interview updated successfully.");
        response.put("success", true);

        return ResponseEntity.ok(response);
    }


}
