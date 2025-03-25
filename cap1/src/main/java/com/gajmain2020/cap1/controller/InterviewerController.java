package com.gajmain2020.cap1.controller;

import com.gajmain2020.cap1.dto.InterviewFeedbackRequest;
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

import java.util.*;

@RestController
@RequestMapping("/api/v1/schedules")
@CrossOrigin(origins = "http://localhost:5173")
public class InterviewerController {
    @Autowired
    private InterviewerServices interviewerServices;
    @Autowired
    private JwtUtil jwtUtil;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private InterviewScheduleRepository interviewScheduleRepository;
    @Autowired
    private InterviewFeedbackRepository interviewFeedbackRepository;
    @Autowired
    private InterviewFeedbackDetailRepository interviewFeedbackDetailRepository;

    @GetMapping("/upcoming-interviews-interviewer")
    public ResponseEntity<Map<String, Object>> getUpcomingInterviewerInterviews(@RequestHeader("Authorization") String authHeader) {
        return interviewerServices.getUpcomingInterviewerInterviews(authHeader);
    }

    @GetMapping("/ongoing-interviews-interviewer")
    public ResponseEntity<Map<String, Object>> getOngoingInterviewerInterviews(@RequestHeader("Authorization") String authHeader) {
        return interviewerServices.getOngoingInterviewerInterviews(authHeader);
    }

    @GetMapping("/interviewee-details/{interviewId}")
    public ResponseEntity<Map<String, Object>> getIntervieweeDetails(@PathVariable Long interviewId) {
        return interviewerServices.getIntervieweeDetails(interviewId);
    }
    @PostMapping("/submit-feedback/{interviewId}")
    public ResponseEntity<Map<String, Object>> submitFeedback(
            @Valid @RequestBody InterviewFeedbackRequest feedbackRequest,
            @PathVariable Long interviewId) {
        return interviewerServices.submitFeedback(interviewId, feedbackRequest);
    }
    @GetMapping("/get-interviewer-interview")
    public ResponseEntity<Map<String, Object>> fetchInterviewerInterviews(@RequestHeader("Authorization") String authHeader) {
        return interviewerServices.fetchInterviewerInterviews(authHeader);
    }

    @GetMapping("/check-feedback-filled/{interviewId}")
    public ResponseEntity<Map<String, Object>> checkIsFeedbackFilled(@PathVariable Long interviewId) {
        return interviewerServices.checkIsFeedbackFilled(interviewId);
    }

    @GetMapping("/interviewer-past-feedbacks")
    public ResponseEntity<Map<String, Object>> getPastFeedbacksByEmail(@RequestHeader("Authorization") String authHeader) {
        return interviewerServices.getPastFeedbacksByEmail(authHeader);
    }

    @GetMapping("/get-feedback-details/{feedbackId}")
    public ResponseEntity<Map<String, Object>> getFeedbackDetails(@RequestHeader("Authorization") String authHeader,
                                                                  @PathVariable Long feedbackId) {
        return interviewerServices.getFeedbackDetails(authHeader, feedbackId);
    }
}
