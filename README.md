```
# 🛠️ Validation Rules Engine – Profile Submission System

A lightweight full-stack POC built using **React + TailwindCSS + Spring Boot + Hibernate Validator** to validate user profile data, show per-field feedback with ✅ / ❌ badges, and persist valid profiles to a database.
```
---
```
## 🚀 Tech Stack

### Frontend:
- React.js (Vite)
- TailwindCSS
- Fetch API

### Backend:
- **Java 17 + Spring Boot** (`backend-java`) — Profile validation + database storage
- **Python (Flask)** (`backend-py`) — Resume parsing
- Hibernate Validator
- H2 Database (in-memory)
- Spring Data JPA
```
---
```
## ✨ Features

- User profile form with fields like Name, Email, Phone, Age, Resume, etc.
- Resume parsing and auto-filling using PDF uploads.
- Backend-side validation using Hibernate annotations.
- Real-time feedback (✅/❌) after submission for each field.
- Profiles are only saved when valid.
- H2 DB view enabled at `/h2-console`.
```
---
```
## 🖥️ Screenshots
```
### 🟢 Success State

![Success](./frontend/assets/success.png)

### 🔴 Failure State

![Failure](./frontend/assets/failure.png)

### 🗃️ Database Entries in H2

![H2 Database](./frontend/assets/database.png)

---

```
## 📦 Setup Instructions

### ✅ Prerequisites:
- Node.js (for frontend)
- Java 17+ (for validation & DB backend)
- Python 3.10+ (for resume parsing)
- Maven
- pip / virtualenv (for Python dependencies)

```
---

```
## 🧩 Folder Structure

.
├── frontend # React + Tailwind profile form
├── backend-java # Spring Boot backend with Hibernate Validator
├── backend-py # Python Flask API for resume parsing
```

---

### 1️⃣ Clone Repository & Navigate

```
git clone <your_repo_url>
cd frontend
```
2️⃣ Frontend Setup

```
cd frontend
npm install
npm run dev
```
App runs at: http://localhost:5173

3️⃣ Java Backend Setup

```
cd backend-java
./mvnw spring-boot:run
```
Spring Boot backend runs at: http://localhost:8080

3️⃣ Python Backend Setup

```
cd backend-py
python3 -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt
python app.py

```

```
To view DB: open http://localhost:8080/h2-console

JDBC URL: jdbc:h2:mem:testdb
```

```
📄 Sample Validations
Field	    Rule	                        Example
First Name	Must be alphabetic	            John
Email	    Valid email format	            john@example.com
Phone	    Exactly 10 digits, no letters	9876543210
Age	        Must be > 18	                19
Resume	    Must be a PDF	                resume.pdf
```

```
✅ Tests
Unit and integration tests are implemented for both the frontend and backend to ensure correctness and validation coverage.
```

```🔬 Frontend Tests
Framework: Vitest + React Testing Library

Test File: frontend/src/App.test.jsx
```
Run Command:

```
cd frontend
npm test
```

```
✅ Covered Scenarios
Renders all input fields using accessible labels

Shows error when a non-PDF resume file is uploaded
```

📸 Screenshot:
[![Frontend Test Screenshot](./frontend/assets/fe-test.png)](./frontend/assets/fe-test.png)

```
```
🧪 Backend Tests
Framework: JUnit + Spring Boot MockMvc

Test File: SaveProfileControllerTest.java
```
Run Command:

```
cd backend
./mvnw test
```

```
✅ Covered Scenarios
✅ Accepts and saves a valid user profile

❌ Rejects invalid email format with 400 Bad Request
```
📸 Screenshot:
[![Backend Test Screenshot](./frontend/assets/be-test.png)](./frontend/assets/be-test.png)

```

```
✅ Clean Code & Review Notes
-Structure: Code is logically split between frontend and backend folders.

-Validation Layer: Hibernate Validator is used via annotation-based constraints – clean and scalable.

-Frontend UX: Real-time feedback shown after form submission; visual hierarchy and spacing are decent with Tailwind.

-Improvement Areas (Optional):

-Add unit/integration tests (esp. for validation edge cases).

-Show per-field validation live while typing (now it appears only post-submit).

-Improve mobile responsiveness slightly.

-Add dropdowns or datepickers for structured fields.
```

```
🧪 Future Enhancements
-Add testing using JUnit (backend) and React Testing Library (frontend)

-Add user authentication layer

-Store resumes in cloud or file system

-Resume parsing using an external AI/NLP parser
```

Built with ❤️ by Mehak Kataria for the Uniper Tech Assessment.
