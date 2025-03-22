package com.gajmain2020.cap1.controller;


import com.gajmain2020.cap1.dto.InterviewRequest;
import com.gajmain2020.cap1.enums.Role;
import com.gajmain2020.cap1.models.InterviewSchedule;
import com.gajmain2020.cap1.models.User;
import com.gajmain2020.cap1.repositories.InterviewScheduleRepository;
import com.gajmain2020.cap1.repositories.UserRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.time.Duration;
import java.time.LocalTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/schedules")
public class InterviewScheduleController {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private InterviewScheduleRepository interviewScheduleRepository;

    @GetMapping
    public boolean HealthCheck(){
        System.out.println("hello world");
        return true;
    }

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
                .interviewer(interviewer)
                .duration(duration)  // Set calculated duration
                .build();

        interviewScheduleRepository.save(interview);

        response.put("message", "Interview scheduled successfully.");
        response.put("success", true);

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}
