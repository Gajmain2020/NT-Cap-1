package com.gajmain2020.cap1.repositories;

import com.gajmain2020.cap1.models.InterviewFeedback;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InterviewFeedbackRepository extends JpaRepository<InterviewFeedback, Long> {

    @Query(value = "SELECT COUNT(*) > 0 FROM interview_feedback WHERE interview_id = :interviewId", nativeQuery = true)
    boolean existsByInterviewId(Long interviewId);

    @Query(value = """
        SELECT COUNT(*) > 0 
        FROM interview_feedback f
        JOIN interview_schedule s ON f.interview_id = s.id
        JOIN users u ON s.interviewer_email = u.email
        WHERE f.id = :feedbackId AND u.email = :email
    """, nativeQuery = true)
    boolean validateFeedbackWithInterviewerEmail(String email, Long feedbackId);

    @Query(value = """
        SELECT f.id AS feedbackId, f.final_decision AS finalDecision, f.final_comment AS finalComment, 
               d.id AS id, d.skill AS skill, d.rating AS rating, d.topics_used AS topics, d.comments AS comments
        FROM interview_feedback f
        LEFT JOIN interview_feedback_details d ON f.id = d.feedback_id
        WHERE f.id = :feedbackId
    """, nativeQuery = true)
    List<Object[]> getFeedbackDetails(Long feedbackId);
}
