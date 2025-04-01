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
    private LocalDate date;

    @Column(nullable = false)
    private LocalTime startTime;

    @Column(nullable = false)
    private LocalTime endTime;

    @Column(nullable = false)
    private  int duration;

    @ManyToOne
    @JoinColumn(name = "interviewerEmail", referencedColumnName = "email", nullable = false)
    private User interviewer;

    private String meetLink;  // Optional
    private String resumeLink; // Optional

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, columnDefinition = "VARCHAR(10) DEFAULT 'L1'")
    private InterviewStage stage;

    @OneToOne
    @JoinColumn(name = "previousInterviewId", referencedColumnName = "id", nullable = true)
    private InterviewSchedule previousInterview;

}
