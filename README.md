# EasyLearn Backend

RESTful API backend για educational platform με Node.js, Express και MariaDB.

## � Setup & Installation

### Προαπαιτούμενα
- Node.js (v18+)
- MariaDB Server
- npm

### Βήματα Εγκατάστασης

1. **Δημιουργία Database**
   - Άνοιξε το MySQL Workbench
   - Τρέξε το SQL script από το **2ο παραδοτέο** για να δημιουργηθεί η βάση δεδομένων και οι πίνακες

2. **Clone & Install Dependencies**
   ```bash
   git clone <repository-url>
   cd DB-Easy-Learn-Backend-
   npm install
   ```

3. **Configure Environment**
   - Αντίγραψε το `.env.example` σε `.env`
   - Συμπλήρωσε τα MariaDB credentials (DB_USER, DB_PASSWORD)
   - Δημιούργησε JWT_SECRET:
     ```bash
     node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
     ```
   - Αντέγραψε το output και βάλτο στο `JWT_SECRET` στο `.env`

4. **Run Server**
   ```bash
   npm start
   ```
   
   Το API θα τρέχει στο link `http://localhost:5000`

---

## �📚 Περιγραφή

Το EasyLearn είναι μια πλατφόρμα e-learning που επιτρέπει σε καθηγητές να δημιουργούν courses και σε μαθητές να εγγράφονται, να παρακολουθούν μαθήματα και να λύνουν quizzes.

### Κύρια Χαρακτηριστικά

- **Authentication με JWT** - Secure token-based authentication
- **Role-Based Access Control** - Διαχωρισμός student/teacher permissions
- **Course Management** - CRUD operations για courses, lessons, quizzes
- **Enrollment System** - Students εγγράφονται σε courses
- **Progress Tracking** - Παρακολούθηση προόδου μαθητών
- **Rating System** - Reviews και ratings για courses
- **MariaDB Database** - Persistent storage με Sequelize ORM

## �️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MariaDB
- **ORM**: Sequelize
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcrypt

## 📁 Project Structure

```
├── config/          # Database configuration
├── controllers/     # Route handlers
├── middleware/      # Authentication, validation, error handling
├── models/          # Sequelize models
├── routes/          # API routes
├── services/        # Business logic
├── utils/           # Helper functions
├── app.js           # Express app setup
└── server.js        # Server entry point
```

## 🔑 Authentication

Η εφαρμογή χρησιμοποιεί **JWT tokens** για authentication με role-based access control (student/teacher).

## 📝 License

MIT


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
