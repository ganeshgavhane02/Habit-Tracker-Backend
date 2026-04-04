# Habit Tracker - Architecture & Implementation

## System Design Overview

This document maps the **System Design** (overall planned architecture) to the **Implementation** (actual codebase).

### Design vs Implementation Status

```
SYSTEM DESIGN          →         IMPLEMENTATION
(High-level plan)      →         (Production code)
```

---

## 🏗️ Architecture Layers

### 1. Frontend Layer
**Design**: Web Client (HTML/JavaScript)  
**Implementation**: ✅ COMPLETE
- Location: `../tracker_new (1).html`
- Features:
  - Responsive UI with CSS Grid
  - Real-time data binding
  - Offline-first with localStorage
  - AI Assistant integration
  - JWT authentication UI

**API Client**: ✅ COMPLETE
- Location: `../api-client.js`
- Features:
  - Backend API communication
  - Token management
  - Data synchronization
  - Error handling

---

### 2. API Gateway Layer
**Design**: Node.js/Express Server  
**Implementation**: ✅ COMPLETE
- Location: `./server.js`
- Features:
  - Port 3001
  - CORS enabled
  - Rate limiting (100 req/15min)
  - Helmet security headers
  - Request logging
  - Error handling middleware
  - Compression for responses

**Configuration**:
- Location: `./config/database.js`
- Features:
  - PostgreSQL connection pooling
  - Connection timeout (2s)
  - Max 20 concurrent clients
  - Query logging in development

---

### 3. API Routes Layer
**Design**: RESTful endpoints for auth, habits, analytics  
**Implementation**: ✅ COMPLETE

#### Authentication Routes
- Location: `./routes/auth.js`
- ✅ `POST /api/auth/register` - Create user account
- ✅ `POST /api/auth/login` - User authentication
- ✅ `GET /api/auth/profile` - Get user profile
- ✅ `PUT /api/auth/profile` - Update profile
- Features:
  - Input validation with express-validator
  - Password hashing (bcryptjs)
  - JWT token generation
  - Error handling for duplicates

#### Habit Routes
- Location: `./routes/habits.js`
- ✅ `GET /api/habits` - List user's habits
- ✅ `POST /api/habits` - Create new habit
- ✅ `GET /api/habits/:id` - Get specific habit
- ✅ `PUT /api/habits/:id` - Update habit
- ✅ `DELETE /api/habits/:id` - Delete habit
- ✅ `POST /api/habits/:id/log` - Log completion
- ✅ `GET /api/habits/:id/logs` - Get logs
- ✅ `GET /api/habits/:id/stats` - Get statistics
- Features:
  - JWT authentication required
  - Owner-based access control
  - Input validation
  - Timezone-aware date handling

#### User Routes
- Location: `./routes/users.js`
- ✅ `GET /api/users/profile` - Get profile
- ✅ `PUT /api/users/profile` - Update profile
- ✅ `GET /api/users/stats` - Get account statistics
- Features:
  - JWT authentication
  - Account age calculation
  - User info management

#### Analytics Routes
- Location: `./routes/analytics.js`
- ✅ `GET /api/analytics/dashboard` - Overview stats
- ✅ `GET /api/analytics/habits/trends` - Weekly trends
- ✅ `GET /api/analytics/sleep` - Sleep analytics
- Features:
  - Configurable time periods
  - Weekly trend analysis
  - Sleep quality distribution
  - Streak calculations

---

### 4. Data Models Layer
**Design**: User, Habit, HabitLog, SleepLog entities  
**Implementation**: ✅ COMPLETE

#### User Model
- Location: `./models/User.js`
- Features:
  - Create user with validation
  - Find by email/ID
  - Password verification (bcrypt)
  - JWT token generation
  - Profile updates
  - JSON serialization (excludes password hash)

```javascript
fields: {
  id, email, password_hash, name, created_at, updated_at
}
methods: {
  create(), findById(), findByEmail(),
  update(), verifyPassword(), generateToken(), toJSON()
}
```

#### Habit Model
- Location: `./models/Habit.js`
- Features:
  - CRUD operations
  - Frequency-based scheduling
  - Log completion tracking
  - Streak calculations
  - Statistics generation
  - 30-day analytics

```javascript
fields: {
  id, user_id, name, description, frequency,
  start_time, end_time, category, goal,
  created_at, updated_at
}
methods: {
  create(), findByUserId(), findByIdAndUserId(),
  update(), delete(), logCompletion(),
  getLogs(), getStats()
}
```

#### SleepLog Model
- Location: `./models/SleepLog.js`
- Features:
  - Log sleep records
  - Track quality (1-5 scale)
  - Calculate duration
  - Sleep statistics (avg, min, max)
  - Quality distribution analysis

```javascript
fields: {
  id, user_id, date, bed_time, wake_time,
  duration, quality, notes
}
methods: {
  create(), findByUserIdAndDateRange(),
  findByDateAndUserId(), update(), delete(),
  getStats(), getQualityDistribution()
}
```

---

### 5. Database Layer
**Design**: PostgreSQL database with relational schema  
**Implementation**: ✅ COMPLETE

#### Database Schema
- Location: `./scripts/migrate.js`
- Tables:
  - ✅ `users` - User accounts
  - ✅ `habits` - Habit definitions
  - ✅ `habit_logs` - Daily completions
  - ✅ `sleep_logs` - Sleep records

#### Indexes for Performance
- ✅ idx_habits_user_id
- ✅ idx_habit_logs_habit_id
- ✅ idx_habit_logs_date
- ✅ idx_sleep_logs_user_id
- ✅ idx_sleep_logs_date

#### Relationships
- Users → Habits (1:N) with CASCADE delete
- Habits → HabitLogs (1:N) with CASCADE delete
- Users → SleepLogs (1:N) with CASCADE delete
- Unique constraints on (habit_id, date) and (user_id, date)

---

### 6. Security Layer
**Design**: JWT auth, password hashing, rate limiting  
**Implementation**: ✅ COMPLETE

#### Authentication Middleware
- Location: `./middleware/auth.js`
- Features:
  - JWT token validation
  - Bearer token extraction
  - Optional authentication
  - Error responses

```javascript
functions: {
  auth() - Required authentication
  optionalAuth() - Optional authentication
}
```

#### Error Handling
- Location: `./middleware/errorHandler.js`
- Features:
  - Global error catching
  - JWT error handling
  - Validation error formatting
  - Development stack traces
  - Production error messages

#### Security Implementations
- ✅ **Helmet** - Security headers
- ✅ **CORS** - Cross-origin protection
- ✅ **bcryptjs** - Password hashing (10 salt rounds)
- ✅ **JWT** - Token-based auth (7-day expiration)
- ✅ **Rate Limiting** - 100 req/15min per IP
- ✅ **Input Validation** - All endpoints validated
- ✅ **SQL Injection Prevention** - Parameterized queries
- ✅ **XSS Protection** - Helmet + output encoding

---

## 📊 Data Flow

### Authentication Flow
```
Frontend (Login)
    ↓
POST /api/auth/login
    ↓
User Model (verify password)
    ↓
Generate JWT Token
    ↓
Return token to frontend
    ↓
Frontend stores token in localStorage
    ↓
Frontend includes token in all API requests
```

### Habit Creation Flow
```
Frontend (Create Habit)
    ↓
POST /api/habits (with JWT)
    ↓
Auth middleware (verify token)
    ↓
Habit Model (validate & create)
    ↓
Database (insert into habits table)
    ↓
Return created habit to frontend
    ↓
Frontend displays in UI
    ↓
localStorage sync on change
```

### Analytics Flow
```
Frontend (Request stats)
    ↓
GET /api/analytics/dashboard (with JWT)
    ↓
Analytics route (gather data)
    ↓
Query Habit model
    ↓
Query SleepLog model
    ↓
Calculate aggregations
    ↓
Return formatted response
    ↓
Frontend displays charts/stats
```

---

## 🗄️ Database Schema (SQL)

### Users Table
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Habits Table
```sql
CREATE TABLE habits (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  frequency JSONB,
  start_time TIME,
  end_time TIME,
  category VARCHAR(50),
  goal INTEGER DEFAULT 30,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Habit Logs Table
```sql
CREATE TABLE habit_logs (
  id SERIAL PRIMARY KEY,
  habit_id INTEGER REFERENCES habits(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  status VARCHAR(20) CHECK (status IN ('completed', 'missed', 'skipped')),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(habit_id, date)
);
```

### Sleep Logs Table
```sql
CREATE TABLE sleep_logs (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  bed_time TIME,
  wake_time TIME,
  duration INTERVAL,
  quality INTEGER CHECK (quality >= 1 AND quality <= 5),
  notes TEXT,
  UNIQUE(user_id, date)
);
```

---

## 🚀 Deployment Architecture

### Development Environment
```
Local Machine
├── Node.js server (localhost:3001)
├── PostgreSQL (localhost:5432)
├── Frontend files (tracker_new.html)
└── API client (api-client.js)
```

### Production Recommendations
```
Cloud Provider (AWS/GCP/Azure)
├── Load Balancer
├── API Servers (Node.js cluster)
│   ├── Server 1
│   ├── Server 2
│   └── Server 3
├── RDS Database (PostgreSQL)
├── Redis Cache (optional)
├── CDN for static assets
├── CloudWatch Monitoring
└── Auto-scaling groups
```

---

## 🔄 Synchronization Between Layers

### Frontend → Backend
```
localStorage (offline)
    ↓ (when online)
api-client.js (HTTP requests)
    ↓
Express routes (validation)
    ↓
Models (business logic)
    ↓
PostgreSQL (persistence)
```

### Backend → Frontend
```
PostgreSQL (source of truth)
    ↓
Models (aggregate data)
    ↓
API responses (JSON)
    ↓
api-client.js (parse)
    ↓
Frontend (render UI)
```

---

## 📝 Testing Coverage

### Unit Tests (Recommended)
- [ ] User model CRUD
- [ ] Password hashing
- [ ] JWT validation
- [ ] Habit calculations
- [ ] Analytics aggregations

### Integration Tests (Recommended)
- [ ] Auth flow (register → login → profile)
- [ ] Habit CRUD with auth
- [ ] Habit logging
- [ ] Analytics endpoints

### E2E Tests (Recommended)
- [ ] User registration journey
- [ ] Create habit → log daily
- [ ] View analytics
- [ ] Data sync between devices

---

## 🔮 Future Enhancements

### Planned Features
- [ ] Mobile app (React Native)
- [ ] Push notifications
- [ ] Social features (friends, challenges)
- [ ] Advanced analytics (ML predictions)
- [ ] Data export (CSV, PDF)
- [ ] Team/organization support
- [ ] Webhook integrations

### Performance Optimizations
- [ ] Redis caching layer
- [ ] Database query optimization
- [ ] Pagination for large datasets
- [ ] GraphQL API wrapper
- [ ] WebSocket for real-time updates
- [ ] CDN for static content

### Security Enhancements
- [ ] Two-factor authentication
- [ ] API key management
- [ ] Audit logging
- [ ] Role-based access control
- [ ] Data encryption at rest
- [ ] GDPR compliance

---

## 📚 File Structure

```
backend/
├── config/
│   └── database.js           ✅ Database connection
├── middleware/
│   ├── auth.js               ✅ JWT authentication
│   └── errorHandler.js       ✅ Global error handling
├── models/
│   ├── User.js               ✅ User entity
│   ├── Habit.js              ✅ Habit entity
│   └── SleepLog.js           ✅ SleepLog entity
├── routes/
│   ├── auth.js               ✅ Auth endpoints
│   ├── habits.js             ✅ Habit endpoints
│   ├── users.js              ✅ User endpoints
│   └── analytics.js          ✅ Analytics endpoints
├── scripts/
│   ├── migrate.js            ✅ Database migration
│   └── seed.js               ✅ Sample data
├── server.js                 ✅ Express app
├── package.json              ✅ Dependencies
├── .env.example              ✅ Environment template
├── .gitignore                ✅ Git ignore rules
├── README.md                 ✅ Quick start guide
└── ARCHITECTURE.md           ← This file
```

---

## ✅ Implementation Checklist

### Backend Core
- ✅ Express server setup
- ✅ PostgreSQL configuration
- ✅ Database connection pooling
- ✅ Environment management

### Authentication
- ✅ User registration
- ✅ User login
- ✅ JWT token generation
- ✅ Password hashing
- ✅ Auth middleware

### Habit Management
- ✅ Create habits
- ✅ Read habits
- ✅ Update habits
- ✅ Delete habits
- ✅ Log completions

### Analytics
- ✅ Dashboard stats
- ✅ Habit trends
- ✅ Sleep analytics
- ✅ Completion rates
- ✅ Streak calculations

### Security
- ✅ CORS protection
- ✅ Rate limiting
- ✅ Input validation
- ✅ SQL injection prevention
- ✅ XSS protection
- ✅ Helmet security headers

### Frontend Integration
- ✅ API client (api-client.js)
- ✅ Auth UI (Modal)
- ✅ Data sync buttons
- ✅ Error handling
- ✅ Token management

---

## 🎯 How This Maps to System Design

| System Design Component | Implementation File | Status |
|---|---|---|
| API Gateway | `server.js` | ✅ Complete |
| Authentication Service | `routes/auth.js` + `models/User.js` | ✅ Complete |
| User Service | `routes/users.js` | ✅ Complete |
| Habit Service | `routes/habits.js` + `models/Habit.js` | ✅ Complete |
| Analytics Service | `routes/analytics.js` | ✅ Complete |
| Database Layer | `config/database.js` + `scripts/migrate.js` | ✅ Complete |
| Security Layer | `middleware/` | ✅ Complete |
| Frontend Client | `../tracker_new (1).html` | ✅ Complete |
| API Client | `../api-client.js` | ✅ Complete |

---

## 📖 References

- **System Design**: [system-design.md](../system-design.md)
- **Backend README**: [README.md](./README.md)
- **Frontend Integration**: [INTEGRATION_README.md](../INTEGRATION_README.md)
- **Setup Guide**: [SETUP_GUIDE.md](../SETUP_GUIDE.md)

---

**Last Updated**: March 23, 2026  
**Status**: ✅ System design fully implemented and integrated