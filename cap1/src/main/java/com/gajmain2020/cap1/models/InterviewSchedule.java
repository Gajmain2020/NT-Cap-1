package com.gajmain2020.cap1.models;


import com.gajmain2020.cap1.enums.InterviewStage;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
@Table(name = "interview_schedule")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InterviewSchedule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String intervieweeName;

    @Column(nullable = false)
    private String intervieweeEmail;

    @Column(nullable = false)
    private String position;

    @Column(nullable = false)
    private String date;

    @Column(nullable = false)
    private String startTime;

    @Column(nullable = false)
    private String endTime;

    @Column(nullable = false)
    private  int duration;

    private String meetLink;  // Optional
    private String resumeLink; // Optional

    @ManyToOne
    @JoinColumn(name = "interviewerEmail", referencedColumnName = "email", insertable = false, updatable = false)
    private User interviewer;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, columnDefinition = "VARCHAR(10) DEFAULT 'L1'")
    private InterviewStage stage;
}
