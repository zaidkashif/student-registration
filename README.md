## 📌 Project Title
**Dynamic Course Registration and Scheduling System**

## 🎯 Objective
To design and implement a dynamic course registration system that streamlines the enrollment process for students and provides efficient course and seat management for administrators. The system addresses real-time schedule conflicts, prerequisite validation, and live seat tracking without requiring page refreshes.

---

## 🏗️ System Architecture
- **Frontend:** HTML, CSS, JavaScript
- **Backend:** Node.js + Express.js
- **Database:** MongoDB + Mongoose
- **View Engine:** EJS

---

## 🧠 Key Features

### 👩‍🎓 Student Features
- **Login**: Students log in using roll numbers (already in DB).
- **Dynamic Weekly Schedule**: Real-time calendar updates as courses are added/removed, highlighting conflicts.
- **Real-Time Seat Availability**: View seat status instantly.
- **Course Filtering**: Search based on department, level, time, day, and availability.
- **State Preservation**: Keeps selected schedule throughout the session.
- **Prerequisite Check**: Validates and shows course prerequisites before registration.

### 👨‍💼 Admin Features
- **Admin Login**: Username-password authentication.
- **Course Management**: Add, edit, delete courses; assign schedules and prerequisites.
- **Student Management**: View student registrations; override registration.
- **Seat Management**: Adjust course seat availability.
- **Reports**:
  - Students per course
  - Courses with available seats
  - Students who haven’t completed prerequisites

---

## 🧾 Functional Modules

### ✅ Authentication
- Admin and student login
- Role-based dashboard redirection

### ✅ Course Scheduling
- Schedule stored in structured format (day + time)
- Displayed in weekly grid with conflict detection

### ✅ Registration Flow
- Checks seat availability
- Checks for prerequisite completion
- Real-time feedback (no page reload)

### ✅ Admin Dashboard
- UI for managing courses and students
- Reports generated with readable UI lists

---

## 🗃️ Database Models

### 1. `Course`
```json
{
  code: "CS101",
  name: "Intro to CS",
  department: "Computer Science",
  seats: 30,
  prerequisites: [ObjectId],
  schedule: [{ day: "Monday", time: "9:00 AM" }]
}
```

### 2. `Student`
```json
{
  rollNumber: "22F-1001",
  name: "Ali Raza",
  registeredCourses: [ObjectId]
}
```

### 3. `Admin`
```json
{
  username: "admin",
  password: "admin123"
}
```

---

## 📂 Folder Structure
```
├── server.js
├── seedDatabase.js
├── models/
│   ├── courseModel.js
│   ├── studentModel.js
│   └── adminModel.js
├── routes/
│   ├── studentRoutes.js
│   └── adminRoutes.js
├── controllers/
│   ├── studentController.js
│   └── adminController.js
├── views/
│   ├── auth/
│   │   └── login.ejs
│   ├── student/
│   │   └── dashboard.ejs
│   └── admin/
│       └── dashboard.ejs
├── public/
│   ├── css/
│   │   └── styles.css
│   └── js/
│       ├── student/
│       │   ├── auth.js
│       │   └── dashboard.js
│       └── admin/
│           ├── auth.js
│           └── dashboard.js
```

---

## 🧪 Testing
- Verified registration conflicts visually via calendar grid.
- Validated prerequisite check and seat update logic.
- Confirmed report accuracy via admin dashboard.

---

## 🚀 How to Run
1. Install dependencies:
```bash
npm install
```

2. Set up `.env` file:
```
MONGO_URI=mongodb://localhost:27017/registration-system
PORT=5000
```

3. Seed the database:
```bash
node seedDatabase.js
```

4. Run the app:
```bash
nodemon server.js
```

5. Visit:
```
http://localhost:5000/login
```

---