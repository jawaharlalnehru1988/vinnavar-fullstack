# Vinnavar Fullstack - Local Development & CI/CD Workflow Guide

Welcome! This guide outlines how to work locally on your machine and automatically deploy your changes to the live VPS when you push code to GitHub.

---

## 1. Local Prerequisites

Make sure your local computer has the following installed:
- **Node.js**: v18+ or v20+ (`node -v`)
- **Java JDK**: Version 17 or 21 (`java -version`)
- **Maven**: Version 3.8+ (`mvn -v`)
- **Git**: (`git --version`)
- **PostgreSQL**: Running locally (or configured to connect to your development database)

---

## 2. Clone the Repository Locally

On your local machine terminal, run:

```bash
git clone https://github.com/jawaharlalnehru1988/vinnavar-fullstack.git
cd vinnavar-fullstack
```

---

## 3. Running the Backend Locally

1. Navigate to the backend directory:
   ```bash
   cd vinnavar-backend
   ```
2. Configure database credentials in `src/main/resources/application.properties` (or set environment variables for local PostgreSQL).
3. Start the backend application:
   ```bash
   mvn spring-boot:run
   ```
   The backend server will start on: **`http://localhost:8087`**

---

## 4. Running the Frontend Locally

1. Open a new terminal tab and navigate to the frontend directory:
   ```bash
   cd vinnavar-frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the React development server:
   ```bash
   npm start
   ```
   The frontend application will open on: **`http://localhost:3000`**

> **Note on API Connections:** The frontend automatically detects local environment (`localhost` / `127.0.0.1`) in `src/services/api.js` and targets `http://localhost:8087/api/v1`. On live VPS production, it automatically targets `https://vinnavar.com/api/v1`.

---

## 5. Automated CI/CD Deployment Workflow

When you are ready to publish your changes:

1. **Commit and Push Changes** from your local machine:
   ```bash
   git add .
   git commit -m "feat: your new feature"
   git push origin master
   ```

2. **Automated Pipeline Execution**:
   - The GitHub Actions workflow (`.github/workflows/deploy.yml`) is triggered.
   - It connects via SSH to your VPS and executes `scripts/deploy.sh`.
   - The script pulls the latest code, re-compiles the Java backend, restarts the `vinnavar-backend` service, builds the React frontend, and reloads Nginx.

3. **Verify Deployment**:
   Visit **`https://vinnavar.com`** to see your live changes!
