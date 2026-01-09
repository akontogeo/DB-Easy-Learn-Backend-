# 🚀 Quick Start Guide - Connect to Your MariaDB Database

Your Node.js backend is now ready to connect to your `easylearn_db` MariaDB database!

## ⚡ 3 Steps to Get Running

### 1️⃣ Add Your Database Password

Open the `.env` file and add your MariaDB root password:

```env
DB_PASSWORD=your_actual_password_here
```

### 2️⃣ Start the Server

```powershell
npm start
```

### 3️⃣ Verify Connection

You should see:
```
✅ Connected to MariaDB
✅ Using existing database schema
Server running on http://localhost:5000
```

## 📊 What's Included

Your application now has **13 Sequelize models** matching your database:

✅ User, Student, Teacher  
✅ Category, Course, Lesson  
✅ Quiz, Question, Answer  
✅ Enrollment, CourseReview  
✅ QuizAttempt, StudentQuestionAnswer  

## 📚 Documentation

- **[MARIADB_SETUP.md](MARIADB_SETUP.md)** - Complete MariaDB installation and setup guide
- **[DATABASE_MIGRATION.md](DATABASE_MIGRATION.md)** - Detailed migration info, model reference, and usage examples
- **[README.md](README.md)** - General application documentation

## 🧪 Test Your Connection

```powershell
# Check if server responds
Invoke-RestMethod -Uri http://localhost:5000/health

# Test database (if you have API endpoints set up)
Invoke-RestMethod -Uri http://localhost:5000/courses
Invoke-RestMethod -Uri http://localhost:5000/users
```

## ❓ Having Issues?

### MariaDB not running?
```powershell
Get-Service -Name MariaDB
# If stopped, start it
Start-Service -Name MariaDB
```

### Forgot your password?
Check [MARIADB_SETUP.md](MARIADB_SETUP.md) for password reset instructions.

### Connection errors?
1. Verify MariaDB is running
2. Check your `.env` file has correct credentials
3. Try connecting directly: `mysql -u root -p`

## 📋 Your Database Schema

```
user (10 records: 5 students + 5 teachers)
  ├── student
  └── teacher
      └── category (5 records)
          └── course (5 records)
              ├── lesson (5 records)
              ├── quiz (5 records)
              │   ├── question
              │   ├── answer
              │   └── quiz_attempt (5 records)
              ├── enrollment (5 records)
              └── course_review (5 records)
```

## 🎯 Next Steps

1. ✅ Connect to database (you're doing this now!)
2. 📝 Update your controllers to use the new model structure
3. 🧪 Test your API endpoints
4. 🚀 Start building features!

---

**Need more help?** Check out the detailed guides:
- For setup issues → [MARIADB_SETUP.md](MARIADB_SETUP.md)
- For model usage → [DATABASE_MIGRATION.md](DATABASE_MIGRATION.md)
