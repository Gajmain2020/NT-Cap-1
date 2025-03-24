package com.gajmain2020.cap1.repositories;

import com.gajmain2020.cap1.models.InterviewFeedback;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface InterviewFeedbackRepository extends JpaRepository<InterviewFeedback, Long> {

    @Query(value = "SELECT COUNT(*) > 0 FROM interview_feedback WHERE interview_id = :interviewId", nativeQuery = true)
    boolean existsByInterviewId(Long interviewId);
}
