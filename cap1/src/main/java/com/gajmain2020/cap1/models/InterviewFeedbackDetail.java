package com.gajmain2020.cap1.models;

import com.gajmain2020.cap1.enums.Rating;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "interview_feedback_details")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InterviewFeedbackDetail {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "feedbackId",referencedColumnName = "id", nullable = false)
    private InterviewFeedback feedback;

    @Column(nullable = false)
    private String skill; // e.g., SQL, Algorithms

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Rating rating;

    @Column(columnDefinition = "TEXT")
    private String topicsUsed;

    @Column(columnDefinition = "TEXT")
    private String comments;
}

