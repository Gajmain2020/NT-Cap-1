package com.gajmain2020.cap1.models;


import com.gajmain2020.cap1.enums.FinalDecision;
import com.gajmain2020.cap1.enums.InterviewStage;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "interview_feedback")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InterviewFeedback {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "interview_id", nullable = false)
    private InterviewSchedule interview;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "interviewer_id", nullable = false)
    private User interviewer;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private InterviewStage interviewStage; // L1 or L2

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private FinalDecision finalDecision; // Passed, Rejected, etc.

    @Column(columnDefinition = "TEXT")
    private String comments;

    @OneToMany(mappedBy = "feedback", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<InterviewFeedbackDetail> feedbackDetails;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
}