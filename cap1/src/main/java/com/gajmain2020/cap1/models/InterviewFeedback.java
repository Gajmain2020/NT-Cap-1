package com.gajmain2020.cap1.models;

import com.gajmain2020.cap1.enums.FinalDecision;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

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
    @JoinColumn(name = "interview_id", nullable = false, referencedColumnName = "id")
    private InterviewSchedule interview;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private FinalDecision finalDecision; // Passed, Rejected, etc.

    @Column(columnDefinition = "TEXT")
    private String finalComment;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}
