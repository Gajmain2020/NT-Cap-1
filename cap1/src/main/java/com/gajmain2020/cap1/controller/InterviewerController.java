package com.gajmain2020.cap1.controller;

import com.gajmain2020.cap1.dto.InterviewFeedbackRequest;
import com.gajmain2020.cap1.middleware.InterviewerMiddleware;
import com.gajmain2020.cap1.repositories.InterviewFeedbackDetailRepository;
import com.gajmain2020.cap1.repositories.InterviewFeedbackRepository;
import com.gajmain2020.cap1.repositories.InterviewScheduleRepository;
import com.gajmain2020.cap1.repositories.UserRepository;
import com.gajmain2020.cap1.security.JwtUtil;
import com.gajmain2020.cap1.services.InterviewerServices;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v2/interviewer")
@CrossOrigin(origins = "http://localhost:5173")
public class InterviewerController {
    @Autowired
    private InterviewerServices interviewerServices;
    @Autowired
    private InterviewerMiddleware interviewerMiddleware;


    private ResponseEntity<Map<String, Object>> badRequestResponse(String message) {
        return ResponseEntity.badRequest().body(Map.of(
                "message", message,
                "success", false
        ));
    }

    private boolean isValidAuth(String authHeader) {
        return interviewerMiddleware.isValidInterviewerAuthToken(authHeader);
    }


    @GetMapping("/upcoming-interviews-interviewer")
    public ResponseEntity<Map<String, Object>> getUpcomingInterviewerInterviews(@RequestHeader("Authorization") String authHeader) {
        if(!isValidAuth(authHeader)){
            return badRequestResponse("Invalid headers/authentication token is passed.");
        }

        return interviewerServices.getUpcomingInterviewerInterviews(authHeader);
    }

    @GetMapping("/ongoing-interviews-interviewer")
    public ResponseEntity<Map<String, Object>> getOngoingInterviewerInterviews(@RequestHeader("Authorization") String authHeader) {
        if(!isValidAuth(authHeader)){
            return badRequestResponse("Invalid headers/authentication token is passed.");
        }

        return interviewerServices.getOngoingInterviewerInterviews(authHeader);
    }

    @GetMapping("/interviewee-details/{interviewId}")
    public ResponseEntity<Map<String, Object>> getIntervieweeDetails(@RequestHeader("Authorization") String authHeader, @PathVariable Long interviewId) {
        if(!isValidAuth(authHeader)){
            return badRequestResponse("Invalid headers/authentication token is passed.");
        }

        return interviewerServices.getIntervieweeDetails(interviewId);
    }

    @PostMapping("/submit-feedback/{interviewId}")
    public ResponseEntity<Map<String, Object>> submitFeedback(
            @RequestHeader("Authorization") String authHeader,
            @Valid @RequestBody InterviewFeedbackRequest feedbackRequest,
            @PathVariable Long interviewId) {
        if(!isValidAuth(authHeader)){
            return badRequestResponse("Invalid headers/authentication token is passed.");
        }

        return interviewerServices.submitFeedback(interviewId, feedbackRequest);
    }

    @GetMapping("/get-interviewer-interview")
    public ResponseEntity<Map<String, Object>> fetchInterviewerInterviews(@RequestHeader("Authorization") String authHeader) {
        if(!isValidAuth(authHeader)){
            return badRequestResponse("Invalid headers/authentication token is passed.");
        }

        return interviewerServices.fetchInterviewerInterviews(authHeader);
    }

    @GetMapping("/check-feedback-filled/{interviewId}")
    public ResponseEntity<Map<String, Object>> checkIsFeedbackFilled(@RequestHeader("Authorization") String authHeader,@PathVariable Long interviewId) {
        if(!isValidAuth(authHeader)){
            return badRequestResponse("Invalid headers/authentication token is passed.");
        }

        return interviewerServices.checkIsFeedbackFilled(interviewId);
    }

    @GetMapping("/interviewer-past-feedbacks")
    public ResponseEntity<Map<String, Object>> getPastFeedbacksByEmail(@RequestHeader("Authorization") String authHeader) {
        if(!isValidAuth(authHeader)){
            return badRequestResponse("Invalid headers/authentication token is passed.");
        }

        return interviewerServices.getPastFeedbacksByEmail(authHeader);
    }

    @GetMapping("/get-feedback-details-interviewer/{feedbackId}")
    public ResponseEntity<Map<String, Object>> getFeedbackDetailsInterviewer(@RequestHeader("Authorization") String authHeader,
                                                                             @PathVariable Long feedbackId) {
        if(!isValidAuth(authHeader)){
            return badRequestResponse("Invalid headers/authentication token is passed.");
        }

        return interviewerServices.getFeedbackDetails(authHeader, feedbackId);
    }

    @GetMapping("/get-feedback-details-interviewer-via-interviewId/{interviewId}")
    public ResponseEntity<Map<String, Object>> getFeedbackDetailsViaInterviewId(@RequestHeader("Authorization") String authHeader, @PathVariable Long interviewId) {
        if(!isValidAuth(authHeader)){
            return badRequestResponse("Invalid headers/authentication token is passed.");
        }

        return interviewerServices.getFeedbackDetailsViewInterviewIdService(interviewId);
    }
}
