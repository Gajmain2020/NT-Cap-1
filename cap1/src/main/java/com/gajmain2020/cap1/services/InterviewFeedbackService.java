package com.gajmain2020.cap1.services;


import com.gajmain2020.cap1.models.InterviewFeedback;
import com.gajmain2020.cap1.repositories.InterviewFeedbackRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class InterviewFeedbackService {

    private final InterviewFeedbackRepository repository;

    public InterviewFeedbackService(InterviewFeedbackRepository repository) {
        this.repository = repository;
    }

    public List<InterviewFeedback> getAllFeedbacks() {
        return repository.findAll();
    }

    public Optional<InterviewFeedback> getFeedbackById(Long id) {
        return repository.findById(id);
    }

    public InterviewFeedback createFeedback(InterviewFeedback feedback) {
        return repository.save(feedback);
    }

    public void deleteFeedback(Long id) {
        repository.deleteById(id);
    }
}
