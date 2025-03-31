package com.gajmain2020.cap1.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class RescheduleInterviewRequest {
    @Email(message = "Invalid interviewee email format.")
    @NotBlank(message = "Interviewee email cannot be empty.")
    private String interviewerEmail;

    private String interviewerName;

    @NotBlank(message = "Start time is required.")
    @Pattern(regexp = "\\d{2}:\\d{2}", message = "Start time must be in HH:mm format.")
    private String startTime;

    @NotBlank(message = "End time is required.")
    @Pattern(regexp = "\\d{2}:\\d{2}", message = "End time must be in HH:mm format.")
    private String endTime;

    @NotBlank(message = "Date is required.")
    @Pattern(regexp = "\\d{4}-\\d{2}-\\d{2}", message = "Date must be in YYYY-MM-DD format.")
    private String date;
}
