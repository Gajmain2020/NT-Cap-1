package com.gajmain2020.cap1.repositories;

import com.gajmain2020.cap1.models.InterviewSchedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

@Repository
public interface InterviewScheduleRepository extends JpaRepository<InterviewSchedule, Long> {

    // Optimized method with JOIN to fetch interview details including interviewer name
    // Joins the User table with the interview schedule
    @Query("""
        SELECT new map(
            i.id as id,
            i.stage as stage,
            i.intervieweeName as intervieweeName,
            i.intervieweeEmail as intervieweeEmail,
            i.position as position,
            i.date as date,
            i.startTime as startTime,
            i.endTime as endTime,
            i.duration as duration,
            i.meetLink as meetLink,
            i.resumeLink as resumeLink,
            i.interviewerEmail as interviewerEmail,
            u.name as interviewerName
        )
        FROM InterviewSchedule i
        JOIN User u ON i.interviewerEmail = u.email
        WHERE i.date >= :date
        ORDER BY i.date ASC, i.startTime ASC
    """)
    List<Map<String, Object>> findUpcomingInterviews(String date);

    @Query("""
        SELECT new map(
            i.id as id,
            i.stage as stage,
            i.intervieweeName as intervieweeName,
            i.intervieweeEmail as intervieweeEmail,
            i.position as position,
            i.date as date,
            i.startTime as startTime,
            i.endTime as endTime,
            i.duration as duration,
            i.meetLink as meetLink,
            i.resumeLink as resumeLink,
            i.interviewerEmail as interviewerEmail,
            u.name as interviewerName
        )
        FROM InterviewSchedule i
        JOIN User u ON i.interviewerEmail = u.email
        ORDER BY i.date ASC, i.startTime ASC
    """)
    List<Map<String,Object>> findAllInterviews();


}
