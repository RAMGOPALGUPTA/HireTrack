# Deploy HireTrack on Render

HireTrack uses three Render services:
1. **Static Site** for the React/Vite frontend.
2. **Web Service (Docker)** for the Spring Boot backend.
3. **PostgreSQL** for persistent application data.

## Important free-tier limitations

Render Free web services spin down after 15 minutes without inbound traffic and can take about a minute to wake. Free Render Postgres expires 30 days after creation. Use the free database for a demo only; export/backup and migrate to a durable database before the expiry date, or choose a paid database plan for persistent production use. Review Render's current free-tier terms before creating services.

## 1. Create the PostgreSQL database

- In the Render Dashboard, choose **New + → PostgreSQL**.
- Name it `hiretrack-db`.
- Choose a region and remember it.
- Select the Free plan for a short-lived demo, if available in your workspace.
- Create the database and wait until it is Available.
- Open its **Connect** page and note the **Internal Hostname**, database name, username and password. Keep the password private.

The Spring Boot `DB_URL` value must be a JDBC URL:
`jdbc:postgresql://INTERNAL_HOSTNAME:5432/DATABASE_NAME`

Use the internal hostname because the backend and database are both on Render in the same region. Store the database username and password separately in service environment variables.

## 2. Deploy the Spring Boot backend

- Choose **New + → Web Service** and connect `RAMGOPALGUPTA/HireTrack`.
- Select branch `main`.
- Set **Root Directory** to `backend`.
- Set **Runtime** to **Docker**. Render should use `backend/Dockerfile`.
- Choose the Free instance for a demo, if available.
- Use the same region as the PostgreSQL database.
- Do not set a health-check path unless a real public health endpoint has been added.
- Create the service.

In the backend service's **Environment** page, add:

| Key | Value |
|---|---|
| `DB_URL` | `jdbc:postgresql://INTERNAL_HOSTNAME:5432/DATABASE_NAME` |
| `DB_USERNAME` | Username shown on the database Connect page |
| `DB_PASSWORD` | Password shown on the database Connect page |
| `JWT_SECRET` | A newly generated random secret of at least 32 characters |
| `FRONTEND_URL` | Exact deployed frontend origin, e.g. `https://hiretrack-ui.onrender.com` |

Do not include a trailing slash in `FRONTEND_URL`. Do not use your local PostgreSQL password or a secret committed to Git. Save and redeploy.

Wait for the service deploy to succeed. Copy its public URL, for example `https://hiretrack-api.onrender.com`. The API base URL used by the frontend will be `https://hiretrack-api.onrender.com/api`.

## 3. Deploy the React frontend

- Choose **New + → Static Site** and connect `RAMGOPALGUPTA/HireTrack`.
- Select branch `main`.
- Set **Root Directory** to `frontend`.
- Set **Build Command** to `npm install && npm run build`.
- Set **Publish Directory** to `dist`.
- Under Environment, add:

| Key | Value |
|---|---|
| `VITE_API_URL` | `https://YOUR-BACKEND-SERVICE.onrender.com/api` |

Replace the example with the real backend URL from Step 2. Vite variables are embedded at build time, so a frontend redeploy is required after changing this value.
- Create the Static Site and wait for the deploy to succeed.
- Copy the frontend URL.

## 4. Set the final CORS origin

If the frontend URL was not known when the backend was created:
- Open the backend Web Service → **Environment**.
- Set `FRONTEND_URL` to the exact frontend origin (scheme + hostname only; no trailing slash or path).
- Save and redeploy the backend.

The backend also permits the localhost development origins.

## 5. Verify the deployment

1. Open the backend URL in a browser. The root path is not a public API landing page, so an authorization response there does not necessarily indicate a failed deploy. Use Render Logs to confirm Spring Boot started and is listening.
2. Open the frontend URL.
3. Register a new test account.
4. Log in and create a test application.
5. Refresh the page and verify the application remains.
6. Open Career Studio and test Resume Match, Readiness, Mock Interview, Job Safety and Placement Insights.
7. Open browser Developer Tools → Network if requests fail. Look for CORS errors, 401 responses or 5xx responses.
8. Check backend Render Logs for datasource, authentication or startup errors.

## 6. Common problems

- **Backend deploy fails:** inspect Render Logs. Check Dockerfile path/root directory, Java 17 build, and database environment variables.
- **Database connection refused:** confirm database status is Available, and use the internal hostname from the Connect page. Backend and database should be in the same region.
- **Frontend says network error:** confirm `VITE_API_URL` ends in `/api`, then redeploy the static site.
- **CORS error:** set `FRONTEND_URL` to the frontend's exact origin without a trailing slash; redeploy backend.
- **First API request is slow:** a free backend may be waking after idle time.
- **Login fails with 401:** confirm backend is reachable, the user registered on the deployed database, and the browser is not using an old local-development token. Clear `hiretrack_token` from browser localStorage and register/login again if needed.

## 7. Security and data notes

- Rotate any database password that was shared in chat or committed to source control.
- Never put database credentials or JWT secrets in the React frontend.
- Do not commit `.env` files.
- Career Studio profile data currently uses browser localStorage; mock interview answer history is session-only. These fields are not stored in PostgreSQL in the current version.
- Free Render Postgres is temporary and expires 30 days after creation. Export any demo data before expiry and verify the export before deleting or migrating the database.
