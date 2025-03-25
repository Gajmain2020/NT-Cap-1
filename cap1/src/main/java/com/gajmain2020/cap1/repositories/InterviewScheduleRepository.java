package com.gajmain2020.cap1.repositories;

import com.gajmain2020.cap1.models.InterviewSchedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;
import java.util.Optional;

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
            u.name as interviewerName,
            i.interviewer.email as interviewerEmail
        )
        FROM InterviewSchedule i
        JOIN User u ON i.interviewer.email = u.email
        WHERE (i.date > :date OR (i.date = :date AND i.startTime > :time))
        ORDER BY i.date ASC, i.startTime ASC
    """)
    List<Map<String, Object>> findUpcomingInterviews(String date, String time);

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
            i.interviewer.email as interviewerEmail,
            u.name as interviewerName
        )
        FROM InterviewSchedule i
        JOIN User u ON i.interviewer.email = u.email
        ORDER BY i.date ASC, i.startTime ASC
    """)
    List<Map<String,Object>> findAllInterviews();


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
            i.interviewer.email as interviewerEmail
        )
        FROM InterviewSchedule i
        WHERE i.interviewer.email = :email
            """)
    List<Map<String,Object>> findInterviewsByEmail(String email);


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
            i.interviewer.email as interviewerEmail
        )
        FROM InterviewSchedule i
        WHERE i.interviewer.email = :email AND (i.date > :date OR (i.date = :date AND i.startTime > :time))
        ORDER BY i.date ASC, i.startTime ASC
    """)
    List<Map<String, Object>> findUpcomingInterviewsViaEmail(String email,String date, String time);

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
            i.interviewer.email as interviewerEmail
        )
        FROM InterviewSchedule i
        WHERE i.interviewer.email = :email AND (i.date = :date AND :time BETWEEN i.startTime AND i.endTime)
        ORDER BY i.date ASC, i.startTime ASC
            """)
    List<Map<String,Object>> findOngoingInterviewsViaEmail(String email,String date, String time);


    @Query("""
    SELECT new map(
        i.id as id,
        i.intervieweeName as intervieweeName,
        i.intervieweeEmail as intervieweeEmail,
        i.stage as stage,
        i.position as position,
        i.date as date,
        i.startTime as startTime,
        i.endTime as endTime,
        i.duration as duration,
        i.meetLink as meetLink,
        i.resumeLink as resumeLink
    )
    FROM InterviewSchedule i
    WHERE i.id = :interviewId
    """)
    Optional<Map<String, Object>> findIntervieweeByInterviewId(Long interviewId);

    @Query("""
        SELECT new map(
            i.intervieweeName as intervieweeName,
            i.intervieweeEmail as intervieweeEmail,
            i.startTime as startTime,
            i.endTime as endTime,
            i.id as interviewId,
            i.position as position,
            i.date as date,
            i.stage as stage,
            f.id as feedbackId,
            f.finalDecision as finalStatus
        ) 
        FROM InterviewSchedule i
        JOIN InterviewFeedback f ON f.interview.id = i.id
        WHERE i.interviewer.email = :email
    """)
    List<Map<String, Object>> findFeedbacksByInterviewerEmail( String email);

}
