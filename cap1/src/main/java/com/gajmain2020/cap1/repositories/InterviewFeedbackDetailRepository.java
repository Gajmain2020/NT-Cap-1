package com.gajmain2020.cap1.repositories;

import com.gajmain2020.cap1.models.InterviewFeedbackDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InterviewFeedbackDetailRepository extends JpaRepository<InterviewFeedbackDetail, Long> {
    @Query("""
            SELECT d FROM InterviewFeedbackDetail d
            WHERE d.feedback.id = :feedbackId
    """)
    List<InterviewFeedbackDetail> findByFeedbackId(Long feedbackId);
}