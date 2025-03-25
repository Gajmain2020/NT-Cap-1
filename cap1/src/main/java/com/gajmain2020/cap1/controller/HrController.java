package com.gajmain2020.cap1.controller;


import com.gajmain2020.cap1.dto.InterviewRequest;
import com.gajmain2020.cap1.enums.InterviewStage;
import com.gajmain2020.cap1.enums.Role;
import com.gajmain2020.cap1.models.InterviewSchedule;
import com.gajmain2020.cap1.models.User;
import com.gajmain2020.cap1.repositories.InterviewFeedbackDetailRepository;
import com.gajmain2020.cap1.repositories.InterviewFeedbackRepository;
import com.gajmain2020.cap1.repositories.InterviewScheduleRepository;
import com.gajmain2020.cap1.repositories.UserRepository;
import com.gajmain2020.cap1.services.HrServices;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/schedules")
@CrossOrigin(origins = "http://localhost:5173")
public class HrController {

    @Autowired
    private HrServices hrServices;

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private InterviewScheduleRepository interviewScheduleRepository;
    @Autowired
    private InterviewFeedbackRepository interviewFeedbackRepository;
    @Autowired
    private InterviewFeedbackDetailRepository interviewFeedbackDetailRepository;

    @GetMapping
    public boolean HealthCheck() {
        System.out.println("hello world");
        return true;
    }

    //API to schedule interview
    @PostMapping("/add-interview")
    public ResponseEntity<Map<String, Object>> addInterview(@Valid @RequestBody InterviewRequest interviewRequest, BindingResult result) {
        if (result.hasErrors()) {
            return ResponseEntity.badRequest().body(Map.of(
                    "message", result.getFieldError().getDefaultMessage(),
                    "success", false
            ));
        }
        return hrServices.scheduleInterview(interviewRequest);
    }

    @GetMapping("/interviews-hr")
    public ResponseEntity<Map<String, Object>> getAllInterviews() {
        return hrServices.getAllInterviews();
    }

    @GetMapping("/upcoming-interviews-hr")
    public ResponseEntity<Map<String, Object>> getUpcomingHrInterviews() {
        return hrServices.getUpcomingHrInterviews();
    }

    @PutMapping("/edit-scheduled-interview/{id}")
    public ResponseEntity<Map<String, Object>> editInterview(
            @PathVariable Long id,
            @Valid @RequestBody InterviewRequest interviewRequest,
            BindingResult result) {
        return hrServices.editInterview(id, interviewRequest, result);
    }

}


