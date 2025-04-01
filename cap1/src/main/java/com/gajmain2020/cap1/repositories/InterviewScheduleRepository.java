package com.gajmain2020.cap1.repositories;

import com.gajmain2020.cap1.models.InterviewSchedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalTime;
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
    List<Map<String, Object>> findUpcomingInterviews(LocalDate date, LocalTime time);

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
    List<Map<String, Object>> findAllInterviews();


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
    List<Map<String, Object>> findInterviewsByEmail(String email);


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
    List<Map<String, Object>> findUpcomingInterviewsViaEmail(String email, LocalDate date, LocalTime time);

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
    List<Map<String, Object>> findOngoingInterviewsViaEmail(String email, LocalDate date, LocalTime time);


    @Query("""
            SELECT new map(
                i.id as id,
                i.previousInterview.id as l1Id,
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
    List<Map<String, Object>> findFeedbacksByInterviewerEmail(String email);

    @Query("""
        SELECT new map(
            i.id as interviewId,
            i.intervieweeName as intervieweeName,
            i.intervieweeEmail as intervieweeEmail,
            u.name as interviewerName,
            u.email as interviewerEmail,
            i.date as date,
            i.startTime as startTime,
            i.endTime as endTime,
            i.position as position,
            f.finalDecision as finalDecision,
            CASE 
                WHEN i.stage = 'L1' AND f.finalDecision = 'L1_PASSED_WITH_COMMENT' 
                THEN EXISTS (
                    SELECT 1 FROM InterviewSchedule i2
                    WHERE i2.intervieweeEmail = i.intervieweeEmail
                    AND i2.stage = 'L2'
                    AND i2.previousInterview.id = i.id
                )
                ELSE false
            END as isRescheduled
        )
        FROM InterviewSchedule i
        JOIN i.interviewer u
        JOIN InterviewFeedback f ON i.id = f.interview.id
        WHERE (i.date < :today OR (i.date = :today AND i.endTime < :currentTime))
    """)
    List<Map<String, Object>> findPastInterviews(LocalDate today, LocalTime currentTime);


}
