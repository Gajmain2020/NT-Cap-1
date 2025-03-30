package com.gajmain2020.cap1.repositories;

import com.gajmain2020.cap1.models.InterviewFeedbackDetail;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
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
    
    @Transactional
    @Modifying
    @Query("DELETE FROM InterviewFeedbackDetail d WHERE d.feedback.id = :feedbackId")
    int deleteByFeedbackId(@Param("feedbackId") Long feedbackId);
}