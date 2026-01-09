# API Documentation - EasyLearn Backend

Base URL: `http://localhost:5000`

All responses follow this structure:
```json
{
  "success": true,
  "data": {...},
  "message": "Description"
}
```

---

## 🏥 Health Check

### GET /health
Check if server is running

**Response:**
```json
{
  "success": true,
  "message": "EasyLearn API is running"
}
```

---

## 👥 Users

### GET /users
List all users

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "user_id": 1,
      "user_first_name": "John",
      "user_last_name": "Doe",
      "username": "johndoe",
      "user_email": "john@example.com",
      "registration_date": "2024-01-01"
    }
  ],
  "message": "Users retrieved"
}
```

### GET /users/:userId
Get specific user profile

**Response:**
```json
{
  "success": true,
  "data": {
    "username": "johndoe",
    "email": "john@example.com",
    "points": 150
  },
  "message": "User profile loaded"
}
```

**Note:** The `points` field is calculated dynamically as the sum of all `total_points` from the user's quiz attempts across all courses.

### POST /users/login
Login with email (no password required for now)

**Request Body:**
```json
{
  "email": "john@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "userId": 1,
    "username": "johndoe",
    "email": "john@example.com",
    "role": "student",
    "points": 150
  },
  "message": "Login successful"
}
```

**Note:** 
- This is a simplified login that only requires email
- The `role` field indicates whether the user is a "student" or "teacher"
- The `points` field is only calculated for students (sum of all quiz attempt points)
- Teachers will have `points: 0`

### POST /users
Create new user

**Request Body:**
```json
{
  "username": "newuser",
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user_id": 10,
    "username": "newuser",
    "user_email": "user@example.com",
    "registration_date": "2024-01-09"
  },
  "message": "User created"
}
```

### PUT /users/:userId
Update user

**Request Body:**
```json
{
  "username": "updatedname",
  "points": 200
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "username": "updatedname",
    "points": 200
  },
  "message": "User updated"
}
```

### DELETE /users/:userId
Delete user

**Response:**
```json
{
  "success": true,
  "data": {...},
  "message": "User deleted"
}
```

---

## 📚 Courses

### GET /courses
List all courses (with optional filters)

**Query Params:** `?category=1&difficulty=beginner&premium=true`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "course_id": 1,
      "course_title": "Introduction to Python",
      "course_description": "Learn Python basics",
      "created_at": "2024-01-01",
      "teacher_id": 1,
      "category_id": 1
    }
  ],
  "message": "Courses retrieved"
}
```

### GET /courses/:courseId
Get specific course

**Response:**
```json
{
  "success": true,
  "data": {
    "course_id": 1,
    "course_title": "Introduction to Python",
    "course_description": "Learn Python basics",
    "created_at": "2024-01-01",
    "teacher_id": 1,
    "category_id": 1
  },
  "message": "Course retrieved"
}
```

### POST /courses
Create new course (Admin only - requires basicAuth)

**Headers:** `Authorization: Basic base64(username:password)`

**Request Body:**
```json
{
  "title": "New Course",
  "description": "Course description",
  "category": "Programming",
  "difficulty": "beginner",
  "premium": false,
  "totalPoints": 100
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "course_id": 10,
    "course_title": "New Course",
    ...
  },
  "message": "Course created"
}
```

### PUT /courses/:courseId
Update course (Admin only)

**Response:**
```json
{
  "success": true,
  "data": {...},
  "message": "Course updated"
}
```

### DELETE /courses/:courseId
Delete course (Admin only)

**Response:** `204 No Content`

---

## 📖 Lessons

### GET /courses/:courseId/lessons
List all lessons for a course

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "course_id": 1,
      "lesson_title": "Introduction",
      "lesson_description": "Getting started with Python",
      "video_url": "https://example.com/video.mp4",
      "attachment_url": "https://example.com/slides.pdf",
      "summary_sheet": "https://example.com/summary.pdf"
    }
  ],
  "message": "Lessons retrieved"
}
```

### GET /courses/:courseId/lessons/:lessonTitle
Get specific lesson (URL encode lessonTitle)

**Example:** `/courses/1/lessons/Introduction%20to%20Python`

**Response:**
```json
{
  "success": true,
  "data": {
    "course_id": 1,
    "lesson_title": "Introduction",
    "lesson_description": "Getting started",
    "video_url": "https://example.com/video.mp4",
    "attachment_url": "https://example.com/slides.pdf",
    "summary_sheet": "https://example.com/summary.pdf"
  },
  "message": "Lesson retrieved"
}
```

### POST /courses/:courseId/lessons
Create new lesson (Admin only)

**Request Body:**
```json
{
  "lesson_title": "Lesson 1",
  "lesson_description": "Description",
  "video_url": "https://example.com/video.mp4"
}
```

**Response:**
```json
{
  "success": true,
  "data": {...},
  "message": "Lesson created"
}
```

### PUT /courses/:courseId/lessons/:lessonTitle
Update lesson (Admin only)

### DELETE /courses/:courseId/lessons/:lessonTitle
Delete lesson (Admin only)

**Response:** `204 No Content`

---

## 📝 Quizzes

### GET /courses/:courseId/quizzes
List all quizzes for a course

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "quiz_id": 1,
      "quiz_title": "Python Basics Quiz",
      "course_id": 1
    }
  ],
  "message": "Quizzes retrieved"
}
```

### GET /courses/:courseId/quizzes/:quizId
Get quiz with questions (correct answers are hidden)

**Response:**
```json
{
  "success": true,
  "data": {
    "quiz_id": 1,
    "quiz_title": "Python Basics Quiz",
    "course_id": 1,
    "questions": [
      {
        "question_number": 1,
        "question_text": "What is Python?",
        "question_points": 10,
        "answers": [
          {
            "answer_number": 1,
            "answer_text": "A programming language"
          },
          {
            "answer_number": 2,
            "answer_text": "A snake"
          },
          {
            "answer_number": 3,
            "answer_text": "A framework"
          }
        ]
      }
    ]
  },
  "message": "Quiz retrieved"
}
```

### POST /courses/:courseId/quizzes/:quizId/submit
Submit quiz answers

**Request Body:**
```json
{
  "userId": 1,
  "answers": [
    {
      "question_number": 1,
      "answer_number": 1
    },
    {
      "question_number": 2,
      "answer_number": 3
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "score": 15,
    "totalPoints": 20,
    "percentage": 75,
    "totalQuestions": 2
  },
  "message": "Quiz graded"
}
```

---

## ⭐ Ratings/Reviews

### GET /courses/:courseId/reviews
Get all reviews for a course

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "student_id": 1,
      "course_id": 1,
      "review_date": "2024-01-05",
      "rating": 4.5,
      "comment": "Great course!"
    }
  ],
  "message": "Ratings retrieved"
}
```

### POST /courses/:courseId/reviews
Submit a review for a course

**Request Body:**
```json
{
  "student_id": 1,
  "rating": 4.5,
  "comment": "Excellent course, very helpful!"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "student_id": 1,
    "course_id": 1,
    "review_date": "2024-01-09",
    "rating": 4.5,
    "comment": "Excellent course!"
  },
  "message": "Rating created"
}
```

---

## 📂 Categories

### GET /categories
List all categories

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "category_id": 1,
      "category_name": "Programming",
      "category_description": "Learn to code",
      "creation_date": "2024-01-01",
      "teacher_id": 1
    }
  ],
  "message": "Categories retrieved"
}
```

### GET /categories/:categoryId
Get specific category

**Response:**
```json
{
  "success": true,
  "data": {
    "category_id": 1,
    "category_name": "Programming",
    "category_description": "Learn to code",
    "creation_date": "2024-01-01",
    "teacher_id": 1
  },
  "message": "Category retrieved"
}
```

### GET /categories/teacher/:teacherId
Get all categories by a specific teacher

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "category_id": 1,
      "category_name": "Programming",
      "category_description": "Learn to code",
      "creation_date": "2024-01-01",
      "teacher_id": 1
    }
  ],
  "message": "Teacher categories retrieved"
}
```

### GET /categories/:categoryId/courses
Get all courses in a specific category

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "course_id": 1,
      "course_title": "Introduction to Python",
      "course_description": "Learn Python basics",
      "created_at": "2024-01-01",
      "teacher_id": 1,
      "category_id": 1
    },
    {
      "course_id": 3,
      "course_title": "Advanced Python",
      "course_description": "Deep dive into Python",
      "created_at": "2024-01-15",
      "teacher_id": 2,
      "category_id": 1
    }
  ],
  "message": "Category courses retrieved"
}
```

### POST /categories
Create new category (Admin/Teacher only)

**Request Body:**
```json
{
  "category_name": "Web Development",
  "category_description": "Build websites",
  "teacher_id": 1
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "category_id": 5,
    "category_name": "Web Development",
    "creation_date": "2024-01-09",
    "teacher_id": 1
  },
  "message": "Category created"
}
```

### PUT /categories/:categoryId
Update category (Admin/Teacher only)

### DELETE /categories/:categoryId
Delete category (Admin only)

**Response:** `204 No Content`

---

## 🎓 User Enrollments

### GET /users/:userId/courses
Get all courses a user is enrolled in

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "Python Basics",
      "shortDescription": "Learn Python",
      "category": 1,
      "difficulty": "beginner",
      "isPremium": false,
      "thumbnailUrl": "https://example.com/thumb.jpg"
    }
  ],
  "message": "User courses retrieved"
}
```

### GET /users/:userId/courses/:courseId
Get specific enrolled course

**Response:**
```json
{
  "success": true,
  "data": {
    "course_id": 1,
    "course_title": "Python Basics",
    "course_description": "Learn Python from scratch",
    "teacher_id": 1,
    "category_id": 1
  },
  "message": "Enrolled course retrieved"
}
```

### POST /users/:userId/courses
Enroll user in a course

**Request Body:**
```json
{
  "courseId": 5
}
```

**Response:**
```json
{
  "success": true,
  "data": {...},
  "message": "Enrolled successfully"
}
```

### DELETE /users/:userId/courses/:courseId
Withdraw from a course

**Response:** `204 No Content`

---

## 💡 Recommendations

### GET /users/:userId/recommendations
Get course recommendations for a user (courses not enrolled)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "course_id": 5,
      "course_title": "Advanced JavaScript",
      "course_description": "Deep dive into JS",
      ...
    }
  ],
  "message": "Recommendations"
}
```

---

## 📊 Progress

### GET /users/:userId/courses/:courseId/progress
Get user's progress in a course

**Response:**
```json
{
  "success": true,
  "data": {
    "progressId": 1,
    "userId": 1,
    "courseId": 1,
    "progressPercentage": 67
  },
  "message": "Progress retrieved"
}
```

**Note:** Progress currently uses mock data. Progress percentage is static.

---

## 🔐 Authentication

Endpoints marked as "Admin only" or "Teacher only" require Basic Authentication:

**Header:**
```
Authorization: Basic base64(username:password)
```

**Example (JavaScript):**
```javascript
const username = 'admin';
const password = 'password';
const auth = btoa(`${username}:${password}`);

fetch('http://localhost:5000/courses', {
  method: 'POST',
  headers: {
    'Authorization': `Basic ${auth}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({...})
});
```

---

## 🚫 Error Responses

All errors follow this structure:

```json
{
  "success": false,
  "error": "Error Type",
  "message": "Detailed error message"
}
```

**Common HTTP Status Codes:**
- `200` - Success
- `201` - Created
- `204` - No Content (successful deletion)
- `400` - Bad Request (missing required fields)
- `401` - Unauthorized (auth required)
- `404` - Not Found
- `500` - Internal Server Error

---

## 📝 Notes

1. All IDs in the database are integers
2. Dates are in format: `YYYY-MM-DD`
3. URL encode special characters in path parameters (e.g., lesson titles)
4. The API uses MariaDB for data persistence
5. Mock data is used as fallback when database is not connected
6. Progress tracking currently uses mock data only

---

## 🔗 Complete Endpoint List

**Users:** `/users`, `/users/:userId`
**Courses:** `/courses`, `/courses/:courseId`
**Lessons:** `/courses/:courseId/lessons`, `/courses/:courseId/lessons/:lessonTitle`
**Quizzes:** `/courses/:courseId/quizzes`, `/courses/:courseId/quizzes/:quizId`, `/courses/:courseId/quizzes/:quizId/submit`
**Reviews:** `/courses/:courseId/reviews`
**Categories:** `/categories`, `/categories/:categoryId`, `/categories/:categoryId/courses`, `/categories/teacher/:teacherId`
**Enrollments:** `/users/:userId/courses`, `/users/:userId/courses/:courseId`
**Recommendations:** `/users/:userId/recommendations`
**Progress:** `/users/:userId/courses/:courseId/progress`
