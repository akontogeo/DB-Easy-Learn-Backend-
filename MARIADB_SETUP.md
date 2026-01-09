# MariaDB Setup Guide for EasyLearn Backend

This guide will help you connect your EasyLearn backend application to a MariaDB database.

## What Changed?

Your application has been migrated from MongoDB to MariaDB:
- ✅ Installed `mysql2` and `sequelize` packages
- ✅ Removed `mongoose` dependency
- ✅ Converted all models from Mongoose schemas to Sequelize models
- ✅ Updated database connection to use MariaDB
- ✅ Updated environment configuration

## Step-by-Step Setup

### 1. Install MariaDB Server

#### Option A: Download from Official Site
1. Go to https://mariadb.org/download/
2. Select your operating system (Windows)
3. Download and run the installer
4. During installation:
   - Set a root password (remember this!)
   - Keep the default port (3306)
   - Ensure the MariaDB service starts automatically

#### Option B: Using Package Manager
```powershell
# Using Chocolatey (Windows)
choco install mariadb

# Or using winget
winget install MariaDB.Server
```

### 2. Verify MariaDB is Running

Open a terminal and check if MariaDB service is running:
```powershell
# Check service status
Get-Service -Name MariaDB

# Or try connecting to MariaDB
mysql -u root -p
# Enter your password when prompted
```

### 3. Create the Database

Once connected to MariaDB, create your database:
```sql
CREATE DATABASE easylearn_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Verify it was created
SHOW DATABASES;

-- Exit MySQL client
EXIT;
```

**Note:** If you already have the database with your schema and data, you can skip this step!

### 4. Configure Your Application

1. **Copy the example environment file:**
   ```powershell
   Copy-Item .env.example .env
   ```

2. **Edit the `.env` file** and update these values:
   ```env
   # MariaDB Configuration
   DB_HOST=localhost          # Usually localhost
   DB_PORT=3306              # Default MariaDB port
   DB_NAME=easylearn_db      # The database you created
   DB_USER=root              # Your MariaDB username
   DB_PASSWORD=your_password # Your MariaDB root password
   ```

3. **Important:** Replace `your_password` with the actual password you set during MariaDB installation!

### 5. Start Your Application

```powershell
# Install dependencies (if not already done)
npm install

# Start in development mode
npm run dev

# Or in production mode
npm start
```

### 6. Verify Connection

When you start the application, you should see:
```
✅ Connected to MariaDB
✅ Using existing database schema
Server running on http://localhost:5000
```

## Database Structure

The application automatically creates these tables:

1. **users** - User accounts and profiles
2. **courses** - Course information
3. **ratings** - Course ratings and reviews
4. **quizzes** - Quiz questions and answers
5. **progress** - User progress tracking

## Troubleshooting

### Problem: "Failed to connect to MariaDB"

**Solutions:**
1. Verify MariaDB service is running:
   ```powershell
   Get-Service -Name MariaDB
   ```

2. Check your credentials in `.env` file
3. Try connecting manually:
   ```powershell
   mysql -u root -p -h localhost
   ```

### Problem: "Access denied for user"

**Solution:** Your password in `.env` file doesn't match MariaDB:
1. Reset your MariaDB root password if needed
2. Update the `DB_PASSWORD` in your `.env` file

### Problem: "Unknown database 'easylearn'"

**Solution:** The database hasn't been created yet:
```sql
mysql -u root -p
CREATE DATABASE easylearn;
```_db'"

**Solution:** The database hasn't been created yet:
```sql
mysql -u root -p
CREATE DATABASE easylearn_dbjs`
2. Find this line:
   ```javascript
   await sequelize.sync({ alter: false });
   ```
3. Change to:
   ```javascript
   await sequelize.sync({ alter: true });
   ```
4. Restart your application

### Problem: Want to start fresh

**Solution:** Drop and recreate the database:
```sql
mysql -u root -p
DROP DATABASE easylearn_db;
CREATE DATABASE easylearn_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

**Note:** This will delete all your data! Make sure to backup first if needed.

## Testing the Connection

Once your app is running, test it:

```powershell
# Health check
Invoke-RestMethod -Uri http://localhost:5000/health

# Get all courses
Invoke-RestMethod -Uri http://localhost:5000/courses

# Get all users
Invoke-RestMethod -Uri http://localhost:5000/users
```

## Advanced Configuration

### Using a Different User (Not Root)

It's better practice to create a dedicated database user:

```sql
mysql -u root -p

-- Create a new user
CREATE USER 'easylearn_user'@'localhost' IDENTIFIED BY 'secure_password';
_db
-- Grant privileges
GRANT ALL PRIVILEGES ON easylearn.* TO 'easylearn_user'@'localhost';
FLUSH PRIVILEGES;

EXIT;
```

Then update your `.env`:
```env
DB_USER=easylearn_user
DB_PASSWORD=secure_password
```

### Remote Database Connection

If your MariaDB is on a different server:

```env
DB_HOST=192.168.1.100  # or domain name
DB_PORT=3306
DB_NAME=easylearn_db
DB_USER=your_user
DB_PASSWORD=your_password
```

## Fallback Mode

If the database connection fails, the application automatically falls back to in-memory mock data. You'll see:
```
⚠️  Failed to connect to MariaDB: [error message]
⚠️  Falling back to in-memory mock data.
```

This allows development to continue even without a database connection.

## Next Steps

1. ✅ Install MariaDB
2. ✅ Create database
3. ✅ Configure `.env` file
4. ✅ Start application
5. ✅ Verify connection
6. 🚀 Start developing!

## Need Help?

Common resources:
- MariaDB Documentation: https://mariadb.com/kb/en/documentation/
- Sequelize Documentation: https://sequelize.org/docs/v6/
- Check your app logs for detailed error messages
