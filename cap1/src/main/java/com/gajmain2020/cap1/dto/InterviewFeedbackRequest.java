package com.gajmain2020.cap1.dto;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class InterviewFeedbackRequest {

    @NotEmpty(message = "Final result cannot be empty")
    private String finalResult;  // New field

    private String finalComment;

    private List<SkillDto> feedback;

}
