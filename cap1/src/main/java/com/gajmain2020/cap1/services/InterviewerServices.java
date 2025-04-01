package com.gajmain2020.cap1.services;

import com.gajmain2020.cap1.dto.InterviewFeedbackRequest;
import com.gajmain2020.cap1.enums.FinalDecision;
import com.gajmain2020.cap1.enums.Rating;
import com.gajmain2020.cap1.models.InterviewFeedback;
import com.gajmain2020.cap1.models.InterviewFeedbackDetail;
import com.gajmain2020.cap1.models.InterviewSchedule;
import com.gajmain2020.cap1.models.User;
import com.gajmain2020.cap1.repositories.InterviewFeedbackDetailRepository;
import com.gajmain2020.cap1.repositories.InterviewFeedbackRepository;
import com.gajmain2020.cap1.repositories.InterviewScheduleRepository;
import com.gajmain2020.cap1.repositories.UserRepository;
import com.gajmain2020.cap1.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class InterviewerServices {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private InterviewScheduleRepository interviewScheduleRepository;
    @Autowired
    private InterviewFeedbackRepository interviewFeedbackRepository;
    @Autowired
    private InterviewFeedbackDetailRepository interviewFeedbackDetailRepository;
    @Autowired
    private JwtUtil jwtUtil;

    // Reusable response methods
    private ResponseEntity<Map<String, Object>> badRequestResponse(String message) {
        return ResponseEntity.badRequest().body(Map.of("message", message, "success", false));
    }

    private ResponseEntity<Map<String, Object>> forbiddenResponse(String message) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("message", message, "success", false));
    }

    private ResponseEntity<Map<String, Object>> successResponse(String message) {
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("message", message, "success", true));
    }

    private ResponseEntity<Map<String, Object>> notFoundResponse(String message) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", message, "success", false));
    }
    private ResponseEntity<Map<String, Object>> unauthorizedResponse(String message) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("success", false, "message", message));
    }


    public ResponseEntity<Map<String, Object>> getUpcomingInterviewerInterviews(String authHeader) {
        Map<String, Object> response = new HashMap<>();

        // Validate Authorization Header
        if (!authHeader.startsWith("Bearer ")) {
            return unauthorizedResponse("Invalid authorization token.");
        }

        String token = authHeader.substring(7);
        String email = jwtUtil.extractEmail(token); // Extract email from JWT token

        Optional<User> userOptional = userRepository.findByEmail(email);
        if (userOptional.isEmpty()) {
            return notFoundResponse("User not found.");
        }

        LocalTime currentTime = LocalTime.now();
        LocalDate currentDate = LocalDate.now();

        List<Map<String, Object>> interviews = interviewScheduleRepository.findUpcomingInterviewsViaEmail(email, currentDate, currentTime);

        if (interviews.isEmpty()) {
            return notFoundResponse("No interviews found.");
        }

        response.put("interviews", interviews);
        response.put("success", true);
        return ResponseEntity.ok(response);
    }

    public ResponseEntity<Map<String, Object>> getOngoingInterviewerInterviews(String authHeader) {
        Map<String, Object> response = new HashMap<>();

        // Validate Authorization Header
        if (!authHeader.startsWith("Bearer ")) {
            return unauthorizedResponse("Invalid authorization token.");
        }

        String token = authHeader.substring(7);
        String email = jwtUtil.extractEmail(token); // Extract email from JWT token

        Optional<User> userOptional = userRepository.findByEmail(email);
        if (userOptional.isEmpty()) {
            return notFoundResponse("User not found.");
        }

        LocalTime currentTime = LocalTime.now();
        LocalDate currentDate = LocalDate.now();

        List<Map<String, Object>> interviews = interviewScheduleRepository.findOngoingInterviewsViaEmail(email, currentDate, currentTime);

        if (interviews.isEmpty()) {
            return notFoundResponse("No interviews found.");
        }

        response.put("interviews", interviews);
        response.put("success", true);
        return ResponseEntity.ok(response);
    }

    public ResponseEntity<Map<String, Object>> getIntervieweeDetails(Long interviewId) {
        Map<String, Object> response = new HashMap<>();

        Optional<Map<String, Object>> interview = interviewScheduleRepository.findIntervieweeByInterviewId(interviewId);

        if (interview.isEmpty()) {
            return notFoundResponse("No interviewee details found.");
        }

        response.put("interviewee", interview.get()); // Extract actual details from Optional
        response.put("success", true);
        return ResponseEntity.ok(response);
    }

    public ResponseEntity<Map<String, Object>> submitFeedback(Long interviewId, InterviewFeedbackRequest feedbackRequest) {
        Map<String, Object> response = new HashMap<>();

        // Fetch the interview or throw an exception
        InterviewSchedule interviewSchedule = interviewScheduleRepository.findById(interviewId)
                .orElseThrow(() -> new RuntimeException("Interview not found"));

        // Save feedback
        InterviewFeedback savedFeedback = interviewFeedbackRepository.save(
                InterviewFeedback.builder()
                        .interview(interviewSchedule)
                        .finalDecision(parseFinalDecision(feedbackRequest.getFinalResult()))
                        .finalComment(feedbackRequest.getFinalComment())
                        .build()
        );

        // Save feedback details
        saveFeedbackDetails(savedFeedback, feedbackRequest);

        response.put("message", "Feedback saved successfully");
        response.put("success", true);

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // Convert final decision safely
    private FinalDecision parseFinalDecision(String decision) {
        try {
            return FinalDecision.valueOf(decision.toUpperCase().replace(" ", "_"));
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid final decision: " + decision);
        }
    }

    // Save all feedback details
    private void saveFeedbackDetails(InterviewFeedback feedback, InterviewFeedbackRequest request) {
        List<InterviewFeedbackDetail> feedbackDetails = request.getFeedback().stream()
                .map(skillDto -> InterviewFeedbackDetail.builder()
                        .feedback(feedback)
                        .skill(skillDto.getSkill())
                        .rating(parseRating(skillDto.getRating()))
                        .topicsUsed(skillDto.getTopics())
                        .comments(Optional.ofNullable(skillDto.getComments()).orElse(""))
                        .build())
                .collect(Collectors.toList());

        interviewFeedbackDetailRepository.saveAll(feedbackDetails);
    }

    // Convert rating safely
    private Rating parseRating(String rating) {
        try {
            return Rating.valueOf(rating.toUpperCase().replace(" ", "_"));
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid rating: " + rating);
        }
    }

    public ResponseEntity<Map<String, Object>> fetchInterviewerInterviews(String authHeader) {
        Map<String, Object> response = new HashMap<>();

        // Extract token from Authorization header
        if (!authHeader.startsWith("Bearer ")) {
            response.put("success", false);
            response.put("message", "Invalid authorization token.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }

        String token = authHeader.substring(7);
        String email = jwtUtil.extractEmail(token); // Extract email from JWT token

        Optional<User> userOptional = userRepository.findByEmail(email);
        if (userOptional.isEmpty()) {
            response.put("success", false);
            response.put("message", "User not found.");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }

        List<Map<String, Object>> interviews = interviewScheduleRepository.findInterviewsByEmail(email);

        if (interviews.isEmpty()) {
            response.put("success", false);
            response.put("message", "No interviews found.");
            return ResponseEntity.status(HttpStatus.OK).body(response);
        }

        response.put("success", true);
        response.put("interviews", interviews);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    public ResponseEntity<Map<String, Object>> checkIsFeedbackFilled(Long interviewId) {
        // Check if an InterviewFeedback entry exists for the given interviewId
        boolean exists = interviewFeedbackRepository.existsByInterviewId(interviewId);

        // Prepare Response
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("status", exists);

        return ResponseEntity.ok(response);
    }

    public ResponseEntity<Map<String, Object>> getPastFeedbacksByEmail(String authHeader) {
        Map<String, Object> response = new HashMap<>();

        // Validate Authorization token
        if (!authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of(
                    "success", false,
                    "message", "Invalid authorization token."
            ));
        }

        String token = authHeader.substring(7);
        String email = jwtUtil.extractEmail(token);

        Optional<User> userOptional = userRepository.findByEmail(email);
        if (userOptional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of(
                    "success", false,
                    "message", "User not found."
            ));
        }

        List<Map<String, Object>> feedbacks = interviewScheduleRepository.findFeedbacksByInterviewerEmail(email);

        if (feedbacks.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of(
                    "success", false,
                    "message", "No feedbacks submitted."
            ));
        }

        return ResponseEntity.status(HttpStatus.OK).body(Map.of(
                "success", true,
                "feedback", feedbacks
        ));
    }

    public ResponseEntity<Map<String, Object>> getFeedbackDetails(String authHeader, Long feedbackId) {
        // Extract and validate user
        String email = extractEmailFromToken(authHeader);
        if (email == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of(
                    "success", false,
                    "message", "Invalid authorization token."
            ));
        }

        Optional<User> userOptional = userRepository.findByEmail(email);
        if (userOptional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of(
                    "success", false,
                    "message", "User not found."
            ));
        }

        // Validate if the feedback is linked to the interviewer
        boolean isFeedbackValid = interviewFeedbackRepository.validateFeedbackWithInterviewerEmail(email, feedbackId);
        if (!isFeedbackValid) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of(
                    "success", false,
                    "message", "Feedback ID is not associated with the logged-in user."
            ));
        }

        // Fetch feedback details
        List<Object[]> rawData = interviewFeedbackRepository.getFeedbackDetails(feedbackId);
        if (rawData.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("success", false, "message", "Feedback not found."));
        }

        // Transform raw data into structured response
        Map<String, Object> feedback = new HashMap<>();
        List<Map<String, Object>> feedbackEntries = new ArrayList<>();

        for (Object[] row : rawData) {
            if (!feedback.containsKey("feedbackId")) {
                feedback.put("feedbackId", row[0]);
                feedback.put("finalDecision", row[1]);
                feedback.put("finalComment", row[2]);

                feedback.put("interviewee", Map.of(
                        "name", row[3],
                        "email", row[4],
                        "stage", row[5],
                        "position", row[6]
                ));

                feedback.put("details", feedbackEntries);
            }

            if (row[7] != null) { // Check if feedback details exist
                Map<String, Object> feedbackEntry = new HashMap<>();
                feedbackEntry.put("id", row[7]);
                feedbackEntry.put("skill", row[8]);
                feedbackEntry.put("rating", row[9]);
                feedbackEntry.put("topics", row[10] != null ? Arrays.asList(row[10].toString().split(", ")) : List.of());
                feedbackEntry.put("comments", row[11]);
                feedbackEntries.add(feedbackEntry);
            }
        }

        return ResponseEntity.status(HttpStatus.OK).body(Map.of(
                "success", true,
                "feedback", feedback
        ));
    }

    private String extractEmailFromToken(String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return null;
        }
        String token = authHeader.substring(7);
        return jwtUtil.extractEmail(token);
    }

    public ResponseEntity<Map<String, Object>> getFeedbackDetailsViewInterviewIdService(Long interviewId){

        Optional<InterviewSchedule> interview = interviewScheduleRepository.findById(interviewId);

        if(interview.isEmpty()){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("success",false,
                    "message","Interview not found with given interview ID."));
        }

        // find the feedback id
        Optional<InterviewFeedback> feedbackInDB = interviewFeedbackRepository.findByInterviewId(interviewId);

        // Fetch feedback details using id from the feedback
        List<Object[]> rawData = interviewFeedbackRepository.getFeedbackDetails(feedbackInDB.get().getId());
        if (rawData.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("success", false, "message", "Feedback not found."));
        }

        // Transform raw data into structured response
        Map<String, Object> feedback = new HashMap<>();
        List<Map<String, Object>> feedbackEntries = new ArrayList<>();

        for (Object[] row : rawData) {
            if (!feedback.containsKey("feedbackId")) {
                feedback.put("feedbackId", row[0]);
                feedback.put("finalDecision", row[1]);
                feedback.put("finalComment", row[2]);

                feedback.put("details", feedbackEntries);
            }

            if (row[7] != null) { // Check if feedback details exist
                Map<String, Object> feedbackEntry = new HashMap<>();
                feedbackEntry.put("id", row[7]);
                feedbackEntry.put("skill", row[8]);
                feedbackEntry.put("rating", row[9]);
                feedbackEntry.put("topics", row[10] != null ? Arrays.asList(row[10].toString().split(", ")) : List.of());
                feedbackEntry.put("comments", row[11]);
                feedbackEntries.add(feedbackEntry);
            }
        }

        return ResponseEntity.status(HttpStatus.OK).body(Map.of(
                "success", true,
                "feedback", feedback
        ));
    }

}
