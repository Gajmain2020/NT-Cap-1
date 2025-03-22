package com.gajmain2020.cap1.services;


import com.gajmain2020.cap1.models.InterviewSchedule;
import com.gajmain2020.cap1.repositories.InterviewScheduleRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class InterviewScheduleService {

    private final InterviewScheduleRepository repository;

    public InterviewScheduleService(InterviewScheduleRepository repository) {
        this.repository = repository;
    }

    public List<InterviewSchedule> getAllSchedules() {
        return repository.findAll();
    }

    public Optional<InterviewSchedule> getScheduleById(Long id) {
        return repository.findById(id);
    }

    public InterviewSchedule createSchedule(InterviewSchedule schedule) {
        return repository.save(schedule);
    }

    public void deleteSchedule(Long id) {
        repository.deleteById(id);
    }
}