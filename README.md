# InterviewEase : Interview Feedback Management System

![Logo](https://res.cloudinary.com/djwqr0hgq/image/upload/v1743577163/kcbv3zg49lqwx8iuruko.png)

## Overview

The Interview Feedback Management System (IFMS) is a web-based platform designed to streamline the interview process within an organization. It facilitates interview assignments, scheduling, feedback collection, and decision-making. The system enables HR Managers to assign interviews, Interviewers to evaluate candidates based on predefined metrics, and ensures seamless management of interview workflows.

## Features

### 1. Authentication & User Management

- Login/Signup with company email.
- Role-based access control: HR Manager (Admin) and Interviewer.

### 2. Interview Assignment & Scheduling

- HR Managers assign interviews to interviewers.
- Interviewers can view assigned interviews on their dashboard.
- Calendar integration to display past, present, and future interviews.
- HR Managers can reschedule interviews.

### 3. Candidate Evaluation

- Interviewers fill out evaluation forms with the following fields:

  - Email Address, Name, Interview Date, Role, Start Time, End Time along with optional field as resume link and meeting link.
  - Decision: L1 Passed, L1 Passed with Comment, L2 Passed, Rejected.
  - Parameter-Based Evaluation with predefined skills and ratings.
  - Final Decision for L1 and L2 rounds.

- HR Managers can view the entire history of candidate evaluations.

### 5. Admin Features

- HR Managers can delete interview records.

## Technologies Used

**Frontend**: ReactJS, TailwindCSS, ShcadCN.

**Backend**: Java 17, SpringBoot.

**Database**: PostgreSQL.

**Version Control**: Git, GitHub.

## Installation Guide

### Prerequisites

- Java 17
- PostgreSQL
- PgAdmin4 (Optional for ui to interact with database)
- Git
- NodeJS

### Clone Instruction

1. Clone the following repository [`https://github.com/Gajmain2020/NT-Cap-1.git`](https://github.com/Gajmain2020/NT-Cap-1.git)
2. Open the cloned and install the dependencies.

### Setting up **Backend**

1.  Open the cloned repository and open `cap1` in desired code editor or `IntelliJ` preferably.
2.  Configure the database:

    - Create a PostgreSQL database.
      - Ensure PostgreSQL is running.
      - Create a database (e.g., `interview_ease_db`).
    - Update the `application.properties` file in `src/main/resources/` with your database credentials:

           spring.datasource.url=jdbc:postgresql://localhost:5432/interview_ease_db
           spring.datasource.username=<your-username>
           spring.datasource.password=<your-password>

3.  Hit the run button on the top right of the `IntelliJ`.
4.  Or run the following command to build and run the project.

        ./mvnw spring-boot:run
        or
        mvn sprint-boot:run    # if maven is installed in your machine

### Setting up **Frontend**

1.  Open the cloned repository and open `Frontend` in desired code editor or `VS Code` preferably.
2.  Run following command in the terminal for installing dependencies.
    pnpm install
3.  Run the following command to run the project in development server.

        pnpm run dev

4.  Open the given url in the terminal into your browser. (Mostly `http://localhost:5173`)

## API Guidelines

### Base URL

The backend API is hosted at `http://localhost:8080/api/`.

### Endpoints for **_User_**

| Method   | Endpoint                  | Description                           |
| -------- | ------------------------- | ------------------------------------- |
| **POST** | `v1/user/register`        | Register User with Company mail       |
| **POST** | `v1/user/login`           | Allows user to login with credentials |
| **PUT**  | `v1/user/change-password` | To change the password of user        |

### Endpoints for **_HR_**

| Method     | Endpoint | Description| Params|
| ---------- | ------------------- | -------------------------- |--------------------- | 
| **POST**   | `/api/v2/hr/add-interview`                         | Schedule an interview.               | None                  | `Authorization: Bearer <token>`, `Content-Type: application/json` |
| **GET**    | `/api/v2/hr/interviews-hr`                         | Get all scheduled interviews.        | None                  | None                                                              |
| **GET**    | `/api/v2/hr/upcoming-interviews-hr`                | Get upcoming interviews.             | None                  |
| **GET**    | `/api/v2/hr/get-past-interviews`                   | Fetch past interviews.               | None                  |
| **GET**    | `/api/v2/hr/get-feedback-details-hr/{interviewId}` | Get feedback for a past interview.   | `{interviewId}`       |
| **PUT**    | `/api/v2/hr/edit-scheduled-interview/{id}`         | Edit an existing interview schedule. | `{id}` (Interview ID) |
| **DELETE** | `/api/v2/hr/delete-interview/{interviewId}`        | Delete an interview record.          | `{interviewId}`       |
| **POST**   | `/api/v2/hr/reschedule-interview/{interviewId}`    | Reschedule an interview.             | `{interviewId}`       |

### Endpoints for **_INTERVIEWER_**

| Method   | Endpoint                                                          | Params           | Description                                           |
| -------- | ----------------------------------------------------------------- | -------------------- | ----------------------------------------------------- |
| **GET**  | `/upcoming-interviews-interviewer`                                | None                 | Fetch upcoming interviews for the interviewer.        |
| **GET**  | `/ongoing-interviews-interviewer`                                 | None                 | Fetch ongoing interviews for the interviewer.         |
| **GET**  | `/interviewee-details/{interviewId}`                              | `interviewId` (Path) | Get details of a specific interviewee.                |
| **POST** | `/submit-feedback/{interviewId}`                                  | `interviewId` (Path) | Submit feedback for an interview.                     |
| **GET**  | `/get-interviewer-interview`                                      | None                 | Fetch all interviews assigned to the interviewer.     |
| **GET**  | `/check-feedback-filled/{interviewId}`                            | `interviewId` (Path) | Check if feedback is already filled for an interview. |
| **GET**  | `/interviewer-past-feedbacks`                                     | None                 | Retrieve past feedback submitted by the interviewer.  |
| **GET**  | `/get-feedback-details-interviewer/{feedbackId}`                  | `feedbackId` (Path)  | Get feedback details using feedback ID.               |
| **GET**  | `/get-feedback-details-interviewer-via-interviewId/{interviewId}` | `interviewId` (Path) | Get feedback details using interview ID.              |

## Authentication

All endpoints for ***HR*** and ***INTERVIEWER*** require an `Authorization` header with a valid token.

## Project Structure

```
├── cap1
│   ├── mvnw
│   ├── mvnw.cmd
│   ├── pom.xml
│   ├── src
│      ├── main
│         ├── java/com/gajmain2020/cap1
│         │      ├── Cap1Application.java
│         │      ├── controller
│         │      │   ├── AuthController.java
│         │      │   ├── HrController.java
│         │      │   └── InterviewerController.java
│         │      ├── dto
│         │      │   ├── InterviewFeedbackRequest.java
│         │      │   ├── InterviewRequest.java
│         │      │   ├── RescheduleInterviewRequest.java
│         │      │   └── SkillDto.java
│         │      ├── enums
│         │      │   ├── FinalDecision.java
│         │      │   ├── InterviewStage.java
│         │      │   ├── Rating.java
│         │      │   └── Role.java
│         │      ├── exception
│         │      │   ├── DuplicateResourceException.java
│         │      │   ├── GlobalExceptionHandler.java
│         │      │   ├── InvalidCredentialsException.java
│         │      │   └── ResourceNotFoundException.java
│         │      ├── middleware
│         │      │   ├── HrMiddleware.java
│         │      │   └── InterviewerMiddleware.java
│         │      ├── models
│         │      │   ├── InterviewFeedbackDetail.java
│         │      │   ├── InterviewFeedback.java
│         │      │   ├── InterviewSchedule.java
│         │      │   └── User.java
│         │      ├── repositories
│         │      │   ├── InterviewFeedbackDetailRepository.java
│         │      │   ├── InterviewFeedbackRepository.java
│         │      │   ├── InterviewScheduleRepository.java
│         │      │   └── UserRepository.java
│         │      ├── security
│         │      │   ├── JwtUtil.java
│         │      │   └── SecurityConfig.java
│         │      └── services
│         │      ├── HrServices.java
│         │      ├── InterviewerServices.java
│         │      ├── InterviewFeedbackService.java
│         │      └── InterviewScheduleService.java
│         └── resources
│             ├── application.properties
│             ├── static
│             └── templates
│
│
├── Frontend
│   │   ├── index.html
│   │   ├── package.json
│   ├── public
│   │   ├── LogoIE2.png
│   │   ├── LogoIE.png
│   │   └── vite.svg
│   ├── src
│   │   ├── api
│   │   │   ├── hrApis.ts
│   │   │   ├── interviewerApis.ts
│   │   │   └── userApis.ts
│   │   ├── App.css
│   │   ├── App.tsx
│   │   ├── components
│   │   │   ├── HR
│   │   │   │   ├── EditScheduledInterview.tsx
│   │   │   │   ├── InterviewOnDateDialog.tsx
│   │   │   │   ├── InterviewTable.tsx
│   │   │   │   └── ScheduleInterview.tsx
│   │   │   ├── Interviewer
│   │   │   │   ├── IntervieweeDetails.tsx
│   │   │   │   ├── L1Report.tsx
│   │   │   │   ├── NewSkillForm.tsx
│   │   │   │   ├── OngoingInterview.tsx
│   │   │   │   └── UpcomingInterviews.tsx
│   │   │   ├── Layout
│   │   │   │   └── Layout.tsx
│   │   │   ├── LoginForm.tsx
│   │   │   └── Sidebar
│   │   │       ├── PasswordChangeDialog.tsx
│   │   │       ├── SidebarNavItem.tsx
│   │   │       └── Sidebar.tsx
│   │   ├── hooks
│   │   │   └── use-mobile.ts
│   │   ├── index.css
│   │   ├── lib
│   │   │   └── utils.ts
│   │   ├── main.tsx
│   │   ├── pages
│   │   │   ├── HR
│   │   │   │   ├── Calendar.tsx
│   │   │   │   ├── Homepage.tsx
│   │   │   │   ├── PastInterviews.tsx
│   │   │   │   ├── Report.tsx
│   │   │   │   └── UpcomingInterviews.tsx
│   │   │   ├── Interviewer
│   │   │   │   ├── Calendar.tsx
│   │   │   │   ├── FeedbackForm.tsx
│   │   │   │   ├── Homepage.tsx
│   │   │   │   ├── InterviewerPastInterviews.tsx
│   │   │   │   ├── InterviewerUpcomingInterviews.tsx
│   │   │       └── PastInterviewFeedback.tsx
│   │   ├── Landing.tsx
│   │   ├── Loading.tsx
│   │   ├── NotAuthorized.tsx
│   │   └── NotFound.tsx
│   ├── services
│   │   ├── hrServices.ts
│   │   ├── interviewService.ts
│   │   └── userService.ts
│   ├── store
│   │   └── userAuthStore.ts
│   └── utils
│        ├── ApiWrapper.ts
│        ├── authHeaders.ts
│        ├── constants.ts
│        ├── navItems.ts
│        ├── ProtectedRoutes.tsx
│        ├── types.ts
│        ├── UserTypeCheck.tsx
│        ├── utils.ts
│        └── validationSchema.ts
└── README.md
```

## Owner

This project is developed and maintained by [Gajendra Sahu](https://gajju2309.vercel.app/)
