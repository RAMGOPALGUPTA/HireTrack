# HireTrack — Your Career Journey, Organized

A full-stack job application tracker for students and early-career professionals.

## Stack
- React 18, Vite, React Router, Axios, Recharts, Lucide React
- Java 17, Spring Boot 3, Spring Security, JWT, BCrypt
- Spring Data JPA, Hibernate, PostgreSQL

## Current MVP
- Register/login with JWT authentication
- User-specific application CRUD and status changes
- Dashboard statistics and monthly application analytics
- Interview schedule listing and creation API
- Task listing, creation and completion API
- Responsive light-theme dashboard

## Requirements
Node.js 18+, Java 17+, Maven 3.8+, PostgreSQL 14+.

## Database setup
Create a database named `hiretrack` in PostgreSQL:
```sql
CREATE DATABASE hiretrack;
```

## Run backend
In `backend/src/main/resources/application.properties`, configure your local database credentials or set:
- `DB_URL=jdbc:postgresql://localhost:5432/hiretrack`
- `DB_USERNAME=postgres`
- `DB_PASSWORD=your_password`
- `JWT_SECRET=a-long-random-secret-at-least-32-characters`

Then:
```powershell
cd backend
mvn spring-boot:run
```
API runs at http://localhost:8080. Hibernate creates the MVP schema automatically.

## Run frontend
Open another terminal:
```powershell
cd frontend
npm install
npm run dev
```
Open http://localhost:5173.

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

Every private record is scoped to the authenticated user's account.

## Important
The committed database password and JWT secret are local-development defaults only. Change both before deployment. The MVP does not yet include resume file storage, email reminders, interview editing/deletion or schema migrations.
