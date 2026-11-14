# HireTrack — Career Intelligence Workspace

HireTrack is a full-stack career management platform for students and early-career professionals. It combines job-application tracking with a practical Career Intelligence Studio.

## Product modules

### Core workspace
- JWT registration and login
- User-specific job application CRUD and recruitment pipeline
- Dashboard metrics and monthly application analytics
- Interview schedule and preparation task APIs
- Search, status filtering and responsive light-theme UI

### Career Intelligence Studio
- **Resume–job match:** paste resume text and a job description to compare detected skills, show matched/missing skills and produce a transparent keyword-coverage score.
- **Career readiness index:** self-assessment across demonstrable skills, project evidence, resume detail and interview practice.
- **Mock interview studio:** role-specific question sets for software engineering, frontend, backend and data analyst tracks; save practice answers during a session.
- **Skill roadmap:** turns missing skills into a simple weekly learning sequence.
- **Job safety review:** flags common suspicious patterns such as advance-fee requests, requests for OTP/PIN/passwords, pressure tactics and vague job details.
- **Placement intelligence:** calculates application-to-interview and application-to-offer rates from the signed-in user's application records.

The Career Intelligence Studio uses deterministic, explainable browser-side logic and does not require an AI API key. Its readiness index and matching score are guidance metrics, not hiring predictions or guarantees. The safety checker is a preliminary text screen, not a fraud-verification service.

## Technology stack
- Frontend: React 18, Vite, React Router, Axios, Recharts, Lucide React
- Backend: Java 17, Spring Boot 3, Spring Security, JWT, BCrypt, Spring Data JPA
- Database: PostgreSQL

## Requirements
- Node.js 18+
- Java 17+
- Maven 3.8+
- PostgreSQL 14+

## Database setup
Create a PostgreSQL database:
```sql
CREATE DATABASE hiretrack;
```

## Run the backend
Configure credentials in `backend/src/main/resources/application.properties` or set environment variables:
- `DB_URL=jdbc:postgresql://localhost:5432/hiretrack`
- `DB_USERNAME=postgres`
- `DB_PASSWORD=your_local_password`
- `JWT_SECRET=use-a-random-secret-at-least-32-characters-long`

Then:
```powershell
cd backend
mvn spring-boot:run
```
API base URL: `http://localhost:8080/api`.

## Run the frontend
In a second terminal:
```powershell
cd frontend
npm install
npm run dev
```
Open `http://localhost:5173`.

## Main API endpoints
| Method | Endpoint | Purpose |
|---|---|---|
| POST | /api/auth/register | Register |
| POST | /api/auth/login | Login |
| GET | /api/users/me | Current profile |
| GET / POST | /api/applications | List / create |
| GET / PUT / DELETE | /api/applications/{id} | Read / update / delete |
| PATCH | /api/applications/{id}/status | Change status |
| GET / POST | /api/interviews | List / schedule |
| GET / POST | /api/tasks | List / create |
| PATCH | /api/tasks/{id}/complete | Toggle task completion |
| GET | /api/dashboard/stats | Dashboard metrics |
| GET | /api/analytics/monthly | Monthly chart data |

Every private backend record is scoped to the authenticated user.

## Career Studio data and privacy
Career Studio's resume text, readiness profile and readiness checklist are stored in the browser's localStorage under the signed-in email. Mock-interview answers are currently kept in the active browser session. Do not use a shared/public computer for sensitive resume content. These browser-side modules are not yet synchronized to PostgreSQL or available across devices.

## Suggested evaluation workflow
1. Register a test account and create several job applications with different statuses.
2. Open Career Studio → Resume match; paste a resume and job description with overlapping and missing skills.
3. Open Readiness; add skills, a project description and a resume summary.
4. Practice at least one role-specific mock interview question.
5. Paste a sample suspicious recruiter message into Job safety review.
6. Open Placement insights and change application statuses to observe conversion metrics.

## Security and deployment notes
- Never commit real database passwords, JWT secrets, API keys or personal resume data.
- Replace development secrets before deployment and use environment variables or a secret manager.
- The MVP uses Hibernate schema auto-update; production deployments should use versioned database migrations.
- Resume parsing from uploaded PDF/DOCX files, external LLM evaluation, email reminders and persistent interview-answer storage are not included in this release.

## Current scope
This is an educational MVP. The UI and deterministic Career Studio workflows are implemented, but a production release still needs end-to-end testing, database migration management, stronger operational logging, rate limiting and deployment configuration.
