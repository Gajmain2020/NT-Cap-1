package com.gajmain2020.cap1.controller;


import com.gajmain2020.cap1.dto.InterviewRequest;
import com.gajmain2020.cap1.repositories.InterviewFeedbackDetailRepository;
import com.gajmain2020.cap1.repositories.InterviewFeedbackRepository;
import com.gajmain2020.cap1.repositories.InterviewScheduleRepository;
import com.gajmain2020.cap1.repositories.UserRepository;
import com.gajmain2020.cap1.services.HrServices;
import jakarta.validation.Valid;
import org.apache.coyote.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/schedules")
@CrossOrigin(origins = "http://localhost:5173")
public class HrController {

    @Autowired
    private HrServices hrServices;

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

    @GetMapping("/get-past-interviews")
    public ResponseEntity<Map<String, Object>> getAllPastInterviews(@RequestHeader("Authorization") String authHeader){
        return hrServices.getPastInterviews(authHeader);
    }

}


