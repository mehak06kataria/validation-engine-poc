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
- Java 17
- Spring Boot
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

![Success](./screenshots/Screenshot%202025-06-27%20at%204.17.23 AM.png)

### 🔴 Failure State

![Failure](./screenshots/Screenshot%202025-06-27%20at%204.15.16 AM.png)

### 🗃️ Database Entries in H2

![DB View](./screenshots/Screenshot%202025-06-27%20at%204.18.24 AM.png)

---

```
## 📦 Setup Instructions

### Prerequisites:
- Node.js
- Java 17+
- Maven
```
---

### 1️⃣ Clone Repository & Navigate

```
git clone <your_repo_url>
cd frontend
2️⃣ Frontend Setup
```
cd frontend
npm install
npm run dev
```
App runs at: http://localhost:5173

3️⃣ Backend Setup
```
cd backend
./mvnw spring-boot:run
```
Spring Boot backend runs at: http://localhost:8080


```
To view DB: open http://localhost:8080/h2-console

JDBC URL: jdbc:h2:mem:testdb
```

📄 Sample Validations
Field	    Rule	                        Example
First Name	Must be alphabetic	            John
Email	    Valid email format	            john@example.com
Phone	    Exactly 10 digits, no letters	9876543210
Age	        Must be > 18	                19
Resume	    Must be a PDF	                resume.pdf

```
✅ Clean Code & Review Notes
Structure: Code is logically split between frontend and backend folders.

Validation Layer: Hibernate Validator is used via annotation-based constraints – clean and scalable.

Frontend UX: Real-time feedback shown after form submission; visual hierarchy and spacing are decent with Tailwind.

Improvement Areas (Optional):

Add unit/integration tests (esp. for validation edge cases).

Show per-field validation live while typing (now it appears only post-submit).

Improve mobile responsiveness slightly.

Add dropdowns or datepickers for structured fields.
```

```
🧪 Future Enhancements
Add testing using JUnit (backend) and React Testing Library (frontend)

Add user authentication layer

Store resumes in cloud or file system

Resume parsing using an external AI/NLP parser
```


