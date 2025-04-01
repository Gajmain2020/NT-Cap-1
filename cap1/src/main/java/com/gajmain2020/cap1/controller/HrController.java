package com.gajmain2020.cap1.controller;


import com.gajmain2020.cap1.dto.InterviewRequest;
import com.gajmain2020.cap1.dto.RescheduleInterviewRequest;
import com.gajmain2020.cap1.services.HrServices;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v2/hr")
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
    public ResponseEntity<Map<String, Object>> getAllPastInterviews(@RequestHeader("Authorization") String authHeader) {
        return hrServices.getPastInterviews(authHeader);
    }

    @GetMapping("/get-feedback-details-hr/{interviewId}")
    public ResponseEntity<Map<String, Object>> getPastInterviewFeedback(@PathVariable Long interviewId, @RequestHeader("Authorization") String authHeader) {
        return hrServices.getPastFeedback(interviewId, authHeader);
    }

    @DeleteMapping("/delete-interview/{interviewId}")
    public ResponseEntity<Map<String,Object>> deleteInterview(@PathVariable Long interviewId, @RequestHeader("Authorization") String authHeader){
        return hrServices.deleteSingleInterview(interviewId, authHeader);
    }

    @PostMapping("/reschedule-interview/{interviewId}")
    public ResponseEntity<Map<String, Object>> rescheduleInterview(@PathVariable Long interviewId,@Valid @RequestBody RescheduleInterviewRequest rescheduleData,  BindingResult result){
        if (result.hasErrors()) {
            return ResponseEntity.badRequest().body(Map.of(
                    "message", result.getFieldError().getDefaultMessage(),
                    "success", false
            ));
        }

        return hrServices.rescheduleInterviewService(interviewId, rescheduleData);
    }

}


