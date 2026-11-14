# HireTrack manual test plan

Run the backend and frontend using the README instructions, then sign in with a dedicated test account.

## Core workflow
1. Create an account and sign in.
2. Add at least eight applications across APPLIED, ASSESSMENT, INTERVIEW, OFFER and REJECTED.
3. Edit an application, change its status, search by company and delete a test record.
4. Refresh the page and confirm backend-managed applications persist.
5. Open Analytics and Career Studio → Placement insights. Confirm the totals and conversion percentages respond to status changes.
6. Open Interviews and Tasks to verify records returned by their APIs. Task completion should toggle after refresh.

## Resume match test
Paste this sample resume:
```text
B.Tech Computer Science student. Built a job tracking web application using React, JavaScript, HTML, CSS and REST APIs. Developed backend services with Java and Spring Boot, stored data in PostgreSQL, used Git for version control, and containerized a demo using Docker. Strong foundation in data structures, algorithms and object-oriented programming.
```

Paste this sample job description:
```text
Software Engineer Intern. Requirements: Java, Spring Boot, REST API development, PostgreSQL, Git, Docker, Data Structures, Algorithms, testing and AWS cloud fundamentals. Candidate should communicate clearly and collaborate with a product team.
```

Expected: the match report should list skills found in both texts and identify the remaining dictionary skills as gaps. The percentage is a keyword-coverage calculation, not a model-generated hiring score.

## Readiness test
- Add Java, Spring Boot, React, SQL, Git, Docker, DSA and REST API as demonstrable skills.
- Add a project description with your contribution and outcomes.
- Add a resume summary.
- Record at least one mock interview practice answer.
- Confirm the readiness index and breakdown update.

## Mock interview test
Select Software Engineer, Frontend Developer, Backend Developer or Data Analyst. Save a response of at least 20 characters. The answer should appear in the current session's practice history and the practice count should increase.

## Job safety test
Paste:
```text
Congratulations! You are selected immediately. Pay a registration fee and security deposit today to confirm your remote job. Send your OTP and bank details on WhatsApp. Limited seats, act now.
```

Expected: multiple warning indicators should be reported. This is a text heuristic only; a clean result does not prove a company or recruiter is legitimate.

## Limitations to disclose during evaluation
- Resume matching uses a built-in skill dictionary and text overlap; it is not semantic AI.
- Career readiness is a transparent self-assessment index, not a probability of getting hired.
- Mock interview questions are curated question banks. Answers are not automatically graded by an LLM.
- The job safety checker flags text patterns and cannot verify a company's identity.
- Career Studio profile fields are stored in browser localStorage; interview answers stay in the active session. They are not synced to PostgreSQL.
