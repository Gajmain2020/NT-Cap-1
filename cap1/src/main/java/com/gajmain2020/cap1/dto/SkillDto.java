package com.gajmain2020.cap1.dto;

import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class SkillDto {

    @NotEmpty(message = "Skill is required and cannot be empty")
    private String skill;

    @NotEmpty(message = "Rating is required and cannot be empty")
    private String rating;

    private String topics;
    private String comments;
}
