# Teacher Endpoints - Request/Response Schema

Base URL: `http://localhost:5000`

---

## 📚 **Courses Management**

### GET /courses
Get all courses

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
Create new course (Teacher only)

**Request:**
```json
{
  "title": "New Course",
  "description": "Course description",
  "category_id": 1,
  "teacher_id": 1,
  "teacher_email": "teacher@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "course_id": 10,
    "course_title": "New Course",
    "course_description": "Course description",
    "created_at": "2024-01-09",
    "teacher_id": 1,
    "category_id": 1
  },
  "message": "Course created"
}
```

**Note:** The `teacher_email` is required for authentication. The system verifies that the user is a teacher before allowing course creation.

### PUT /courses/:courseId
Update course (Teacher only - must own the course)

**Request:**
```json
{
  "title": "Updated Course Title",
  "description": "Updated description",
  "category_id": 2,
  "teacher_email": "teacher@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "course_id": 1,
    "course_title": "Updated Course Title",
    "course_description": "Updated description",
    "teacher_id": 1,
    "category_id": 2
  },
  "message": "Course updated"
}
```

**Note:** The `teacher_email` is required for authentication. The teacher can only update courses they own.

### DELETE /courses/:courseId
Delete course (Teacher only - must own the course)

**Request:**
Include `teacher_email` in the request body:
```json
{
  "teacher_email": "teacher@example.com"
}
```

**Response:** `204 No Content`

**Note:** The teacher can only delete courses they own.

---

## 📂 **Categories Management**

### GET /categories
Get all available categories

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
Get all categories created by specific teacher

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

### POST /categories
Create new category (Admin/Teacher only)

**Request:**
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
    "category_description": "Build websites",
    "creation_date": "2024-01-09",
    "teacher_id": 1
  },
  "message": "Category created"
}
```

### PUT /categories/:categoryId
Update category (Admin/Teacher only)

**Request:**
```json
{
  "category_name": "Updated Name",
  "category_description": "Updated description"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "category_id": 1,
    "category_name": "Updated Name",
    "category_description": "Updated description",
    "teacher_id": 1
  },
  "message": "Category updated"
}
```

### DELETE /categories/:categoryId
Delete category (Admin only)

**Response:** `204 No Content`

---

## 📖 **Lessons Management**

### GET /courses/:courseId/lessons
Get all lessons for a course

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
Create new lesson (Admin/Teacher only)

**Request:**
```json
{
  "lesson_title": "Lesson 1",
  "lesson_description": "Description",
  "video_url": "https://example.com/video.mp4",
  "attachment_url": "https://example.com/slides.pdf",
  "summary_sheet": "https://example.com/summary.pdf"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "course_id": 1,
    "lesson_title": "Lesson 1",
    "lesson_description": "Description",
    "video_url": "https://example.com/video.mp4",
    "attachment_url": "https://example.com/slides.pdf",
    "summary_sheet": "https://example.com/summary.pdf"
  },
  "message": "Lesson created"
}
```

### PUT /courses/:courseId/lessons/:lessonTitle
Update lesson (Admin/Teacher only)

**Request:**
```json
{
  "lesson_description": "Updated description",
  "video_url": "https://example.com/new-video.mp4"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "course_id": 1,
    "lesson_title": "Lesson 1",
    "lesson_description": "Updated description",
    "video_url": "https://example.com/new-video.mp4"
  },
  "message": "Lesson updated"
}
```

### DELETE /courses/:courseId/lessons/:lessonTitle
Delete lesson (Admin/Teacher only)

**Response:** `204 No Content`

---

## 📝 **Quizzes (Read Only - No CREATE/UPDATE/DELETE yet)**

### GET /courses/:courseId/quizzes
Get all quizzes for a course

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
Get quiz with all questions and answers (includes correct answers for teacher)

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
            "answer_text": "A programming language",
            "is_correct": true
          },
          {
            "answer_number": 2,
            "answer_text": "A snake",
            "is_correct": false
          },
          {
            "answer_number": 3,
            "answer_text": "A framework",
            "is_correct": false
          }
        ]
      }
    ]
  },
  "message": "Quiz retrieved"
}
```

**Note:** Currently there are NO endpoints for creating, updating, or deleting quizzes. These need to be implemented.

---

## ⭐ **Reviews (Read Only)**

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

### GET /courses/:courseId/reviews/average
Get average rating for a course

**Response:**
```json
{
  "success": true,
  "data": {
    "courseId": 1,
    "averageRating": 4.5,
    "totalReviews": 10
  },
  "message": "Average rating retrieved"
}
```

---

## 🔐 **Authentication**

All teacher operations (POST, PUT, DELETE) require authentication via `teacher_email` field in the request body.

### How Teacher Authentication Works:
1. Include `teacher_email` in your request body
2. System verifies the email belongs to a registered user
3. System checks if the user is a teacher
4. For UPDATE/DELETE operations, system verifies the teacher owns the resource

### POST /users/login
Login with email

**Request:**
```json
{
  "email": "teacher@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "userId": 1,
    "username": "teachername",
    "email": "teacher@example.com",
    "role": "teacher",
    "points": 0
  },
  "message": "Login successful"
}
```

**Note:** The `role` field will be either "student" or "teacher". Teachers always have points: 0.

---

## 🚫 **Error Response Format**

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
- `400` - Bad Request (missing required fields, invalid data)
- `401` - Unauthorized (authentication required)
- `403` - Forbidden (not allowed to perform this action)
- `404` - Not Found (resource doesn't exist)
- `500` - Internal Server Error

---

## 📋 **Summary of Teacher Actions**

### ✅ **Currently Available:**
- ✅ Create, read, update, delete courses (with teacher authentication)
- ✅ Teacher authentication via email
- ✅ Ownership verification for course updates/deletes
- ✅ Create, read, update categories
- ✅ Create, read, update, delete lessons
- ✅ Read quizzes (but cannot create/edit/delete)
- ✅ Read reviews and average ratings
- ✅ Login with email

### ❌ **Missing Endpoints:**
- ❌ POST/PUT/DELETE for quizzes
- ❌ POST/PUT/DELETE for questions
- ❌ POST/PUT/DELETE for answers
- ❌ Authentication for categories and lessons

---

## 🔗 **Quick Reference**

**Base URL:** `http://localhost:5000`

**Teacher Endpoints:**
- `GET/POST/PUT/DELETE /courses`
- `GET/POST/PUT /categories`
- `GET/POST/PUT/DELETE /courses/:courseId/lessons`
- `GET /courses/:courseId/quizzes` (read only)
- `GET /courses/:courseId/reviews` (read only)
- `POST /users/login`
