# EasyLearn Backend 

Production-ready Node.js + Express REST API for the EasyLearn educational platform.

## Features

- **ES Modules** with `async/await` throughout
- **MariaDB Integration**: Connects to MariaDB database when configured, automatically falls back to in-memory mock data otherwise
- **Auto-seeding**: Populates database with mock data on first connect (if tables are empty)
- **Dual-mode Services**: All CRUD operations work seamlessly with both MariaDB and mock data
- **21 API Endpoints**: Complete REST API with >10 routes covering Users, Courses, Quizzes, Ratings, Progress
- **Full CRUD Coverage**: GET/POST/PUT/DELETE for Users and Courses resources
- **Basic Authentication**: Admin endpoints protected with HTTP Basic Auth
- **Centralized Error Handling**: Consistent error responses with proper HTTP status codes
- **Request Validation**: Body field validation and business rule enforcement
- **Swagger/OpenAPI Spec**: Complete API documentation in `swagger.json`
- **Consistent Response Format**: `{success, data, message}` for all endpoints

## Quick Start

### 1. Install MariaDB Server
Download and install MariaDB from https://mariadb.org/download/

During installation:
- Set a root password
- Remember your port (default: 3306)
- Start the MariaDB service

### 2. Create Database
Open MariaDB client or your preferred SQL tool and run:
```sql
CREATE DATABASE easylearn CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Configure Environment
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Edit `.env` and set your MariaDB credentials:
```env
PORT=5000

# MariaDB Configuration
DB_HOST=localhost
DB_PORT=3306
DB_NAME=easylearn
DB_USER=root
DB_PASSWORD=your_password_here

# Admin Credentials
ADMIN_USERNAME=admin
ADMIN_PASSWORD=adminpass

NODE_ENV=development
```

**Important**: Update `DB_PASSWORD` with your MariaDB root password!

### 5. Start Server
```bash
# Production mode
npm start

# Development mode (with auto-reload)
npm run dev
```

The app will:
- Connect to your MariaDB database
- Automatically create tables based on your models
- Seed initial data if tables are empty
- Start the server on `http://localhost:5000`

**Note**: If `DB_NAME` is not provided, the app runs with mock data only.

## API Endpoints

All endpoints are mounted at root (no `/api` prefix).

### Health Check
- `GET /health` - Server health status

### Users (21 total endpoints)
- `GET /users` - List all users
- `POST /users` - Create user (requires: username, email, password)
- `GET /users/:userId` - Get user by ID
- `PUT /users/:userId` - Update user
- `DELETE /users/:userId` - Delete user
- `GET /users/:userId/courses` - Get user's enrolled courses
- `POST /users/:userId/courses` - Enroll in course (requires: courseId)
- `DELETE /users/:userId/courses/:courseId` - Withdraw from course
- `GET /users/:userId/recommendations` - Get course recommendations
- `GET /users/:userId/courses/:courseId/progress` - Get course progress

### Courses
- `GET /courses` - List/search courses (supports filters: category, difficulty, premium)
- `POST /courses` - Add course [Admin] (requires: title, description, category, difficulty, premium, totalPoints)
- `GET /courses/:courseId` - Get course details
- `PUT /courses/:courseId` - Edit course [Admin]
- `DELETE /courses/:courseId` - Remove course [Admin]

### Ratings
- `GET /courses/:courseId/ratings` - Get course ratings
- `POST /courses/:courseId/ratings` - Submit rating (requires: userId, stars 1-5, optional: comment)

### Quizzes
- `GET /courses/:courseId/quizzes/:quizId` - Get quiz questions
- `POST /courses/:courseId/quizzes/:quizId/submit` - Submit quiz answers (requires: userId, answers array)

## Authentication

Admin endpoints (POST/PUT/DELETE for courses) require HTTP Basic Authentication:
```bash
# PowerShell
$creds = [Convert]::ToBase64String([Text.Encoding]::ASCII.GetBytes("admin:adminpass"))
Invoke-RestMethod -Uri http://localhost:5000/courses -Method Post -Headers @{Authorization="Basic $creds"} -Body ($body | ConvertTo-Json) -ContentType 'application/json'

# curl
curl -u admin:adminpass -H "Content-Type: application/json" -X POST -d '{"title":"New Course",...}' http://localhost:5000/courses
```

Default credentials: `admin` / `adminpass` (configure in `.env`)

## Testing Endpoints

### PowerShell Examples
```powershell
# Health check
Invoke-RestMethod -Uri http://localhost:5000/health

# Get course details
Invoke-RestMethod -Uri http://localhost:5000/courses/1

# Get course ratings
Invoke-RestMethod -Uri http://localhost:5000/courses/1/ratings

# Submit a rating
$body = @{ userId = 1; stars = 5; comment = "Great course!" }
Invoke-RestMethod -Uri http://localhost:5000/courses/1/ratings -Method Post -Body ($body | ConvertTo-Json) -ContentType 'application/json'
```

### cURL Examples
```bash
# Get course
curl http://localhost:5000/courses/1

# Get ratings
curl http://localhost:5000/courses/1/ratings

# Submit rating
curl -H "Content-Type: application/json" -X POST -d '{"userId":1,"stars":5,"comment":"Great!"}' http://localhost:5000/courses/1/ratings
```

## Project Structure

```
├── app.js                 # Express app setup
├── server.js              # Server entry point
├── config/
│   ├── database.js        # MariaDB connection with auto-seeding
│   └── constants.js       # App constants
├── controllers/           # Request handlers
│   ├── courseController.js
│   ├── userController.js
│   ├── ratingController.js
│   └── quizController.js
├── services/              # Business logic (DB + mock support)
│   ├── courseService.js
│   ├── userService.js
│   ├── ratingService.js
│   ├── quizService.js
│   └── progressService.js
├── models/                # Sequelize models for MariaDB
│   ├── Course.js
│   ├── User.js
│   ├── Rating.js
│   ├── Quiz.js
│   └── Progress.js
├── routes/                # Route definitions
│   ├── index.js           # Main router
│   ├── courses.js
│   ├── users.js
│   ├── ratings.js
│   └── quizzes.js
├── middleware/            # Express middleware
│   ├── auth.js            # Basic authentication
│   ├── validation.js      # Request validation
│   ├── errorHandler.js    # Global error handler
│   └── logger.js          # HTTP logging
├── utils/
│   ├── responses.js       # Response helpers
│   ├── mockData.js        # Mock data exports
│   └── mocks/             # Mock data files
│       ├── courses.js
│       ├── users.js
│       ├── reviews.js
│       ├── quizzes.js
│       └── progress.js
└── swagger.json           # OpenAPI 3.0 specification
```

## Response Format

All successful responses follow this format:
```json
{
  "success": true,
  "data": { ... },
  "message": "Description of the result"
}
```

Error responses:
```json
{
  "success": false,
  "error": "Error type",
  "message": "Error description"
}
```

## Mock Data

When running without MariaDB, the app uses rich mock data including:
- 5+ sample courses across different categories
- Multiple users with different enrollment statuses
- 45+ ratings across courses
- Sample quizzes with questions
- Progress tracking data

Mock data automatically seeds MariaDB on first connection if tables are empty.

## Requirements Met

✅ **10+ Routes**: 21 endpoints available  
✅ **CRUD Coverage**: Full GET/POST/PUT/DELETE for Users and Courses  
✅ **3+ Entities**: Users, Courses, Ratings, Quizzes, Progress with relationships  
✅ **Mock Data Fallback**: Runs without database, uses in-memory data  
✅ **MariaDB Integration**: Connects to MariaDB, auto-creates tables, seeds data  
✅ **Code Quality**: ES6+, async/await, try-catch, JSDoc comments, consistent patterns

## Development

```bash
# Install dependencies
npm install

# Run in development mode (auto-reload)
npm run dev

# Run in production mode
npm start
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 5000 |
| `DB_HOST` | MariaDB host | localhost |
| `DB_PORT` | MariaDB port | 3306 |
| `DB_NAME` | Database name | easylearn |
| `DB_USER` | Database user | root |
| `DB_PASSWORD` | Database password | (empty) |
| `ADMIN_USERNAME` | Admin username for Basic Auth | admin |
| `ADMIN_PASSWORD` | Admin password for Basic Auth | adminpass |
| `NODE_ENV` | Environment mode | development |

## Notes

- Routes are mounted at root level (no `/api` prefix)
- Admin routes require Basic Auth credentials
- MariaDB connection includes automatic fallback to mocks on failure
- All services support both DB and mock modes transparently
- Response format is consistent across all endpoints
- Tables are automatically created on first connection
- Initial data is seeded automatically if tables are empty
