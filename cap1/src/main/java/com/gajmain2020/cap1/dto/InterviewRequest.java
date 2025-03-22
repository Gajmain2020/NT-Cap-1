package com.gajmain2020.cap1.dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class InterviewRequest {

    @NotBlank(message = "Interviewee name cannot be empty.")
    private String intervieweeName;

    @Email(message = "Invalid interviewee email format.")
    @NotBlank(message = "Interviewee email cannot be empty.")
    private String intervieweeEmail;

    private String resumeLink;

    @NotBlank(message = "Position cannot be empty.")
    private String position;

    @NotBlank(message = "Date is required.")
    @Pattern(regexp = "\\d{4}-\\d{2}-\\d{2}", message = "Date must be in YYYY-MM-DD format.")
    private String date;

    @NotBlank(message = "Start time is required.")
    @Pattern(regexp = "\\d{2}:\\d{2}", message = "Start time must be in HH:mm format.")
    private String startTime;

    @NotBlank(message = "End time is required.")
    @Pattern(regexp = "\\d{2}:\\d{2}", message = "End time must be in HH:mm format.")
    private String endTime;

    private String meetLink;

    @NotBlank(message = "Interviewer name cannot be empty.")
    private String interviewerName;

    @Email(message = "Invalid interviewer email format.")
    @NotBlank(message = "Interviewer email cannot be empty.")
    private String interviewerEmail;

    // Getters and Setters
}
