package com.gajmain2020.cap1.controller;


import com.gajmain2020.cap1.dto.InterviewRequest;
import com.gajmain2020.cap1.enums.Role;
import com.gajmain2020.cap1.models.InterviewSchedule;
import com.gajmain2020.cap1.models.User;
import com.gajmain2020.cap1.repositories.InterviewScheduleRepository;
import com.gajmain2020.cap1.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
    public ResponseEntity<Map<String, Object>> addInterview(@RequestBody InterviewRequest interviewRequest) {
        Map<String, Object> response = new HashMap<>();


        Optional<User> optionalInterviewer = userRepository.findByEmail(interviewRequest.getInterviewerEmail());

        if (optionalInterviewer.isEmpty()) {
            response.put("message", "Interviewer email does not exist.");
            response.put("success",false);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }

        User interviewer = optionalInterviewer.get();

        if (interviewer.getRole() != Role.INTERVIEWER) {
            response.put("message", "User is not an INTERVIEWER.");
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(response);
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
                .build();

        interviewScheduleRepository.save(interview);

        response.put("message", "Interview scheduled successfully.");
        response.put("interviewId", interview.getId());
        response.put("success",true);

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}
