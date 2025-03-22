package com.gajmain2020.cap1.dto;

import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class InterviewRequest {
    private String intervieweeName;
    private String intervieweeEmail;
    private String resumeLink;
    private String position;
    private String date;
    private String startTime;
    private String endTime;
    private String meetLink;
    private String interviewerName;
    private String interviewerEmail;
}
