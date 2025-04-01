package com.gajmain2020.cap1.controller;


import com.gajmain2020.cap1.dto.InterviewRequest;
import com.gajmain2020.cap1.dto.RescheduleInterviewRequest;
import com.gajmain2020.cap1.middleware.HrMiddleware;
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
    @Autowired
    private HrMiddleware hrMiddleware;

    private ResponseEntity<Map<String, Object>> badRequestResponse(String message) {
        return ResponseEntity.badRequest().body(Map.of(
                "message", message,
                "success", false
        ));
    }

    private boolean isValidAuth(String authHeader) {
        return hrMiddleware.isValidHrAuthToken(authHeader);
    }

    //API to schedule interview
    @PostMapping("/add-interview")
    public ResponseEntity<Map<String, Object>> addInterview(@RequestHeader("Authorization") String authHeader, @Valid @RequestBody InterviewRequest interviewRequest, BindingResult result) {
        if (result.hasErrors()) {
            return badRequestResponse(result.getFieldError().getDefaultMessage());
        }

        if (!isValidAuth(authHeader)) {
            return badRequestResponse("Invalid headers/authentication token is passed.");
        }

        return hrServices.scheduleInterview(interviewRequest);
    }

    @GetMapping("/interviews-hr")
    public ResponseEntity<Map<String, Object>> getAllInterviews(@RequestHeader("Authorization") String authHeader) {
        if (!isValidAuth(authHeader)) {
            return badRequestResponse("Invalid headers/authentication token is passed.");
        }

        return hrServices.getAllInterviews();
    }

    @GetMapping("/upcoming-interviews-hr")
    public ResponseEntity<Map<String, Object>> getUpcomingHrInterviews(@RequestHeader("Authorization") String authHeader) {
        if (!isValidAuth(authHeader)) {
            return badRequestResponse("Invalid headers/authentication token is passed.");
        }

        return hrServices.getUpcomingHrInterviews();
    }

    @PutMapping("/edit-scheduled-interview/{id}")
    public ResponseEntity<Map<String, Object>> editInterview(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable Long id,
            @Valid @RequestBody InterviewRequest interviewRequest,
            BindingResult result) {
        if (!isValidAuth(authHeader)) {
            return badRequestResponse("Invalid headers/authentication token is passed.");
        }
        return hrServices.editInterview(id, interviewRequest, result);
    }

    @GetMapping("/get-past-interviews")
    public ResponseEntity<Map<String, Object>> getAllPastInterviews(@RequestHeader("Authorization") String authHeader) {
        if (!isValidAuth(authHeader)) {
            return badRequestResponse("Invalid headers/authentication token is passed.");
        }

        return hrServices.getPastInterviews(authHeader);
    }

    @GetMapping("/get-feedback-details-hr/{interviewId}")
    public ResponseEntity<Map<String, Object>> getPastInterviewFeedback(@PathVariable Long interviewId, @RequestHeader("Authorization") String authHeader) {
        if (!isValidAuth(authHeader)) {
            return badRequestResponse("Invalid headers/authentication token is passed.");
        }

        return hrServices.getPastFeedback(interviewId, authHeader);
    }

    @DeleteMapping("/delete-interview/{interviewId}")
    public ResponseEntity<Map<String, Object>> deleteInterview(@PathVariable Long interviewId, @RequestHeader("Authorization") String authHeader) {
        if (!isValidAuth(authHeader)) {
            return badRequestResponse("Invalid headers/authentication token is passed.");
        }

        return hrServices.deleteSingleInterview(interviewId, authHeader);
    }

    @PostMapping("/reschedule-interview/{interviewId}")
    public ResponseEntity<Map<String, Object>> rescheduleInterview(@RequestHeader("Authorization") String authHeader, @PathVariable Long interviewId, @Valid @RequestBody RescheduleInterviewRequest rescheduleData, BindingResult result) {
        if (result.hasErrors()) {
            return badRequestResponse(result.getFieldError().getDefaultMessage());
        }

        if (!isValidAuth(authHeader)) {
            return badRequestResponse("Invalid headers/authentication token is passed.");
        }

        return hrServices.rescheduleInterviewService(interviewId, rescheduleData);
    }

}


