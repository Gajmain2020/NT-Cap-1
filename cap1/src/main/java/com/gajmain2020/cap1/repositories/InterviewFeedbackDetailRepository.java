package com.gajmain2020.cap1.repositories;

import com.gajmain2020.cap1.models.InterviewFeedbackDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface InterviewFeedbackDetailRepository extends JpaRepository<InterviewFeedbackDetail, Long> {
}