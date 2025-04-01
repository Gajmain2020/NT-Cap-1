package com.gajmain2020.cap1.services;

import com.gajmain2020.cap1.dto.InterviewRequest;
import com.gajmain2020.cap1.dto.RescheduleInterviewRequest;
import com.gajmain2020.cap1.enums.InterviewStage;
import com.gajmain2020.cap1.enums.Role;
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
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.RequestHeader;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class HrServices {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private InterviewScheduleRepository interviewScheduleRepository;
    @Autowired
    private JwtUtil jwtUtil;
    @Autowired
    private InterviewFeedbackRepository interviewFeedbackRepository;
    @Autowired
    private InterviewFeedbackDetailRepository interviewFeedbackDetailRepository;

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

    public ResponseEntity<Map<String, Object>> scheduleInterview(InterviewRequest interviewRequest) {
        Map<String, Object> response = new HashMap<>();

        // Check if interviewer exists
        Optional<User> optionalInterviewer = userRepository.findByEmail(interviewRequest.getInterviewerEmail());
        if (optionalInterviewer.isEmpty()) {
            return badRequestResponse("Interviewer email does not exist.");
        }

        User interviewer = optionalInterviewer.get();

        // Validate interviewer role
        if (interviewer.getRole() != Role.INTERVIEWER) {
            return forbiddenResponse("User is not an INTERVIEWER.");
        }

        // Parse and validate times
        LocalTime start = LocalTime.parse(interviewRequest.getStartTime());  // Convert string to LocalTime
        LocalTime end = LocalTime.parse(interviewRequest.getEndTime());      // Convert string to LocalTime
        if (start.isAfter(end)) {
            return badRequestResponse("Start time cannot be after end time.");
        }

        // Parse date string to LocalDate
        LocalDate interviewDate = LocalDate.parse(interviewRequest.getDate());  // Convert string to LocalDate

        int duration = (int) Duration.between(start, end).toMinutes();

        // Create and save interview
        InterviewSchedule interview = InterviewSchedule.builder()
                .intervieweeName(interviewRequest.getIntervieweeName())
                .intervieweeEmail(interviewRequest.getIntervieweeEmail())
                .position(interviewRequest.getPosition())
                .date(interviewDate)
                .startTime(start)
                .endTime(end)
                .meetLink(interviewRequest.getMeetLink())
                .resumeLink(interviewRequest.getResumeLink())
                .stage(InterviewStage.L1)
                .interviewer(interviewer)
                .duration(duration)
                .build();

        interviewScheduleRepository.save(interview);

        return successResponse("Interview scheduled successfully.");
    }


    public ResponseEntity<Map<String, Object>> getAllInterviews() {
        Map<String, Object> response = new HashMap<>();

        // Fetch all interviews
        List<Map<String, Object>> interviews = interviewScheduleRepository.findAllInterviews();

        if (interviews.isEmpty()) {
            return notFoundResponse("No interviews found.");
        }

        response.put("interviews", interviews);
        response.put("success", true);

        return ResponseEntity.ok(response);
    }

    public ResponseEntity<Map<String, Object>> getUpcomingHrInterviews() {
        Map<String, Object> response = new HashMap<>();

        LocalDate today = LocalDate.now();
        LocalTime currentTime = LocalTime.now();

        // Fetch upcoming interviews
        List<Map<String, Object>> interviews = interviewScheduleRepository.findUpcomingInterviews(today, currentTime);

        if (interviews.isEmpty()) {
            return notFoundResponse("No upcoming interviews found.");
        }

        response.put("interviews", interviews);
        response.put("success", true);

        return ResponseEntity.ok(response);
    }

    public ResponseEntity<Map<String, Object>> editInterview(Long id, InterviewRequest interviewRequest, BindingResult result) {
        Map<String, Object> response = new HashMap<>();

        // Check for validation errors
        if (result.hasErrors()) {
            return badRequestResponse(result.getFieldError().getDefaultMessage());
        }

        Optional<InterviewSchedule> optionalInterview = interviewScheduleRepository.findById(id);
        if (optionalInterview.isEmpty()) {
            return notFoundResponse("Interview not found.");
        }

        InterviewSchedule interview = optionalInterview.get();

        Optional<User> optionalInterviewer = userRepository.findByEmail(interviewRequest.getInterviewerEmail());
        if (optionalInterviewer.isEmpty()) {
            return badRequestResponse("Interviewer email does not exist.");
        }

        User interviewer = optionalInterviewer.get();
        if (interviewer.getRole() != Role.INTERVIEWER) {
            return forbiddenResponse("User is not an INTERVIEWER.");
        }

        // Parse start and end time
        LocalTime start = LocalTime.parse(interviewRequest.getStartTime());  // Convert start time string to LocalTime
        LocalTime end = LocalTime.parse(interviewRequest.getEndTime());      // Convert end time string to LocalTime

        // Calculate duration in minutes
        int duration = (int) Duration.between(start, end).toMinutes();

        // Validate duration
        if (duration < 0) {
            return badRequestResponse("Start time cannot be after end time.");
        }

        // Parse the interview date string to LocalDate
        LocalDate interviewDate = LocalDate.parse(interviewRequest.getDate());  // Convert date string to LocalDate

        // Update interview details
        interview.setIntervieweeName(interviewRequest.getIntervieweeName());
        interview.setIntervieweeEmail(interviewRequest.getIntervieweeEmail());
        interview.setPosition(interviewRequest.getPosition());
        interview.setDate(interviewDate);
        interview.setStartTime(start);
        interview.setEndTime(end);
        interview.setMeetLink(interviewRequest.getMeetLink());
        interview.setResumeLink(interviewRequest.getResumeLink());
        interview.setInterviewer(interviewer);
        interview.setDuration(duration);

        interviewScheduleRepository.save(interview);

        response.put("message", "Interview updated successfully.");
        response.put("success", true);
        return ResponseEntity.ok(response);
    }

    public ResponseEntity<Map<String, Object>> getPastInterviews(String authHeader) {
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
            response.put("message", "Auth token not valid.");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
        if (userOptional.get().getRole() != Role.HR) {
            response.put("success", false);
            response.put("message", "Access unauthorized.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }

        LocalDate today = LocalDate.now();
        LocalTime time = LocalTime.now();

        // Fetch past interviews
        List<Map<String, Object>> pastInterviews = interviewScheduleRepository.findPastInterviews(today, time);

        if (pastInterviews.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of(
                    "success", false,
                    "message", "No past interviews found"
            ));
        }

        response.put("status", "success");
        response.put("pastInterviews", pastInterviews);

        return ResponseEntity.ok(response);
    }

    public ResponseEntity<Map<String, Object>> getPastFeedback(Long interviewId, String authHeader) {
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
            response.put("message", "Auth token not valid.");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
        if (userOptional.get().getRole() != Role.HR) {
            response.put("success", false);
            response.put("message", "Access unauthorized.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }

        Optional<InterviewFeedback> feedbackOptional = interviewFeedbackRepository.findByInterviewId(interviewId);

        if (feedbackOptional.isPresent()) {
            InterviewFeedback feedback = feedbackOptional.get();

            Map<String, Object> interviewData = new HashMap<>();

            interviewData.put("intervieweeName", feedback.getInterview().getIntervieweeName());
            interviewData.put("stage", feedback.getInterview().getStage());
            interviewData.put("date", feedback.getInterview().getDate());
            interviewData.put("intervieweeEmail", feedback.getInterview().getIntervieweeEmail());
            interviewData.put("position", feedback.getInterview().getPosition());
            interviewData.put("interviewerName", feedback.getInterview().getInterviewer().getName());
            interviewData.put("interviewerEmail", feedback.getInterview().getInterviewer().getEmail());

            Map<String, Object> feedbackData = new HashMap<>();
            feedbackData.put("finalDecision", feedback.getFinalDecision());
            feedbackData.put("finalComment", feedback.getFinalComment());

            List<InterviewFeedbackDetail> feedbackDetails = interviewFeedbackDetailRepository.findByFeedbackId(feedback.getId());
            List<Map<String, Object>> feedbackDetailList = feedbackDetails.stream().map(detail -> {
                Map<String, Object> detailMap = new HashMap<>();
                detailMap.put("skill", detail.getSkill());
                detailMap.put("rating", detail.getRating());
                detailMap.put("topicsUsed", detail.getTopicsUsed());
                detailMap.put("comments", detail.getComments());
                return detailMap;
            }).collect(Collectors.toList());

            feedbackData.put("feedback", feedbackDetailList);

            response.put("success", true);
            response.put("interview", interviewData);
            response.put("feedbackDetails", feedbackData);
        } else {
            response.put("success", false);
            response.put("message", "Interview not found");
        }
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    public ResponseEntity<Map<String, Object>> deleteSingleInterview(Long interviewId, String authHeader) {
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
            response.put("message", "Auth token not valid.");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
        if (userOptional.get().getRole() != Role.HR) {
            response.put("success", false);
            response.put("message", "Access unauthorized.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }

        Optional<InterviewSchedule> interviewOptional = interviewScheduleRepository.findById(interviewId);

        if (interviewOptional.isEmpty()) {
            response.put("success", false);
            response.put("message", "Interview not found");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }

        InterviewSchedule interview = interviewOptional.get();

        // Delete related feedback details first
        Optional<InterviewFeedback> feedbackOptional = interviewFeedbackRepository.findByInterviewId(interviewId);
        if (feedbackOptional.isPresent()) {
            InterviewFeedback feedback = feedbackOptional.get();

            // Delete feedback details and check if they were deleted
            int deletedCount = interviewFeedbackDetailRepository.deleteByFeedbackId(feedback.getId());
            if (deletedCount == 0) {
                response.put("success", false);
                response.put("message", "Failed to delete feedback details");
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
            }

            // Delete feedback
            interviewFeedbackRepository.delete(feedback);
        }

        // Now delete the interview
        interviewScheduleRepository.delete(interview);

        response.put("success", true);
        response.put("message", "Interview and related data deleted successfully");
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    public ResponseEntity<Map<String, Object>> rescheduleInterviewService(Long interviewId, RescheduleInterviewRequest rescheduleData) {
        Map<String, Object> response = new HashMap<>();

        // Find the interview by ID
        Optional<InterviewSchedule> interviewOptional = interviewScheduleRepository.findById(interviewId);
        if (interviewOptional.isEmpty()) {
            response.put("success", false);
            response.put("message", "Interview not found");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }

        // Find the existing interview
        InterviewSchedule existingInterview = interviewOptional.get();

        // Find the new interviewer
        Optional<User> interviewerOpt = userRepository.findByEmail(rescheduleData.getInterviewerEmail());
        if (interviewerOpt.isEmpty()) {
            response.put("success", false);
            response.put("message", "Interviewer not found");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }

        // Parse the new interview date and times
        LocalDate newInterviewDate = LocalDate.parse(rescheduleData.getDate());  // Convert date string to LocalDate
        LocalTime newStartTime = LocalTime.parse(rescheduleData.getStartTime());  // Convert start time string to LocalTime
        LocalTime newEndTime = LocalTime.parse(rescheduleData.getEndTime());      // Convert end time string to LocalTime

        // Calculate the new duration based on the start and end times
        int newDuration = (int) Duration.between(newStartTime, newEndTime).toMinutes();

        // Validate duration
        if (newDuration < 0) {
            response.put("success", false);
            response.put("message", "Start time cannot be after end time.");
            return ResponseEntity.badRequest().body(response);
        }

        // Create a new interview entry (rescheduled interview)
        InterviewSchedule newInterview = InterviewSchedule.builder()
                .intervieweeName(existingInterview.getIntervieweeName())
                .intervieweeEmail(existingInterview.getIntervieweeEmail())
                .position(existingInterview.getPosition())
                .date(newInterviewDate)  // Store LocalDate
                .startTime(newStartTime)  // Store LocalTime
                .endTime(newEndTime)      // Store LocalTime
                .duration(newDuration)    // Updated duration
                .interviewer(interviewerOpt.get())  // New interviewer
                .meetLink(existingInterview.getMeetLink())
                .resumeLink(existingInterview.getResumeLink())
                .stage(InterviewStage.L2)  // Setting the stage as L2
                .previousInterview(existingInterview)  // Reference to the previous interview
                .build();

        // Save the new interview
        interviewScheduleRepository.save(newInterview);

        response.put("success", true);
        response.put("message", "Interview rescheduled successfully");
        response.put("newInterviewId", newInterview.getId());

        return ResponseEntity.ok(response);
    }


}
