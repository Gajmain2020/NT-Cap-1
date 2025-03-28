package com.gajmain2020.cap1.services;

import com.gajmain2020.cap1.dto.InterviewRequest;
import com.gajmain2020.cap1.enums.InterviewStage;
import com.gajmain2020.cap1.enums.Role;
import com.gajmain2020.cap1.models.InterviewSchedule;
import com.gajmain2020.cap1.models.User;
import com.gajmain2020.cap1.repositories.InterviewScheduleRepository;
import com.gajmain2020.cap1.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.validation.BindingResult;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.Duration;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class HrServices {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private InterviewScheduleRepository interviewScheduleRepository;

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
        LocalTime start = LocalTime.parse(interviewRequest.getStartTime());
        LocalTime end = LocalTime.parse(interviewRequest.getEndTime());
        if (start.isAfter(end)) {
            return badRequestResponse("Start time cannot be after end time.");
        }

        int duration = (int) Duration.between(start, end).toMinutes();

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
        List<Map<String, Object>> interviews = interviewScheduleRepository.findUpcomingInterviews(today.toString(), currentTime.toString());

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
        LocalTime start = LocalTime.parse(interviewRequest.getStartTime());
        LocalTime end = LocalTime.parse(interviewRequest.getEndTime());

        // Calculate duration in minutes
        int duration = (int) Duration.between(start, end).toMinutes();

        // Validate duration
        if (duration < 0) {
            return badRequestResponse("Start time cannot be after end time.");
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
        interview.setInterviewer(interviewer);
        interview.setDuration(duration);

        interviewScheduleRepository.save(interview);

        response.put("message", "Interview updated successfully.");
        response.put("success", true);
        return ResponseEntity.ok(response);
    }

    public ResponseEntity<Map<String, Object>> getPastInterviews(){
        Map<String, Object> response = new HashMap<>();

        LocalDate today = LocalDate.now();
        LocalTime time = LocalTime.now();

        // Fetch past interviews
        List<Map<String, Object>> pastInterviews = interviewScheduleRepository.findPastInterviews(today.toString(), time.toString());

        if(pastInterviews.isEmpty()){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of(
                "success",false,
                    "message","No past interviews found"
            ));
        }

        response.put("status", "success");
        response.put("pastInterviews", pastInterviews);

        return ResponseEntity.ok(response);


    }



}
