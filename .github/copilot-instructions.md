# 🎯 Habit Tracker Backend - Complete Development Guidelines

**Version**: 2.0 | **Updated**: April 2026 | **Status**: Production Ready ✅

---

## 📋 Table of Contents
1. [Code Style & Standards](#code-style--standards)
2. [Architecture & Layers](#architecture--layers)
3. [Database Conventions](#database-conventions)
4. [API Design](#api-design)
5. [Authentication & Security](#authentication--security)
6. [Build & Deployment](#build--deployment)
7. [Dashboard Integration](#dashboard-integration)
8. [Testing & Quality](#testing--quality)
9. [Troubleshooting](#troubleshooting)

---

## Code Style & Standards

**Language**: JavaScript (Node.js 16+)  
**Format**: 2-space indentation, ES6 syntax preferred  
**Linter**: ESLint configured, run `npm run lint` before commits

### Key Principles
- Use `const` by default, `let` only when reassignment needed
- Arrow functions for callbacks, regular functions for methods
- Parameterized SQL queries **always** (use `$1, $2` placeholders with `pg` driver) to prevent SQL injection
- Quote identifiers in SQL: ``SELECT * FROM `users` WHERE id = $1``
- No console.log in production code - use structured logging

### Code Examples
**✅ Good**:
```javascript
const users = await db.query('SELECT * FROM users WHERE id = $1', [userId]);
const calculateMetrics = (data) => data.map(d => d.value * 2);
```

**❌ Bad**:
```javascript
const users = await db.query(`SELECT * FROM users WHERE id = ${userId}`);  // SQL Injection!
function processData(data) { return data.map(d => d.value * 2); }  // Use arrow function
```

### Style References
- Existing models: [User.js](../models/User.js), [Habit.js](../models/Habit.js) exemplify class structure
- Existing routes: [auth.js](../routes/auth.js) show middleware and validation patterns
- Enhanced dashboard: [dashboard-enhanced.html](../dashboard-enhanced.html) shows UI best practices

---

## Architecture & Layers

**Three-layer separation of concerns**:

### 1. **Models** (`models/`) - Data Access Layer
- ES6 classes with static factory methods: `create()`, `findById()`, `findByEmail()`, `update()`, `delete()`
- **All database queries parameterized** to prevent injection attacks
- Return model instances or null, never raw database rows
- Error handling with descriptive messages
- Example: [Habit.js](../models/Habit.js)

```javascript
class Habit {
  static async create(userId, name, description) {
    const result = await db.query(
      'INSERT INTO habits (user_id, name, description) VALUES ($1, $2, $3) RETURNING *',
      [userId, name, description]
    );
    return result.rows[0] ? new Habit(result.rows[0]) : null;
  }
}
```

### 2. **Routes** (`routes/`) - API Endpoints
- Mount at `/api/{resource}` (e.g., `/api/habits`, `/api/users`)
- Use `auth` or `optionalAuth` middleware from [middleware/auth.js](../middleware/auth.js)
- Validate all input with `express-validator` **before** database queries
- Return consistent JSON: `{ success: boolean, data?, message? }`
- Example: [auth.js](../routes/auth.js) shows authentication pattern

```javascript
router.post('/habits', auth, [
  body('name').isLength({ min: 3 }).withMessage('Habit name required'),
  body('description').optional().isString()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, message: 'Validation failed', errors: errors.array() });
  }
  const habit = await Habit.create(req.user.id, req.body.name, req.body.description);
  res.json({ success: true, data: habit });
});
```

### 3. **Middleware** (`middleware/`) - Cross-cutting Concerns
- **auth.js** - JWT verification from Bearer token in `Authorization` header
- **errorHandler.js** - Centralized error response formatting
- Mount in [server.js](../server.js) as the last middleware

```javascript
// Middleware stack order matters!
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(rateLimit);
app.use(compression());
// ... routes ...
app.use(errorHandler);  // MUST be last
```

### Entry Point: [server.js](../server.js)
- Express server on **port 3001**
- CORS, helmet, rate limiting, compression pre-configured
- Health check at `GET /health` (no auth required)
- Graceful shutdown handling

---

## Database Conventions

### Query Standards
- **Always parameterized**: `query(sql, [param1, param2])`
  - ❌ **Wrong**: `query(\`SELECT * FROM users WHERE id = ${id}\`)` - SQL Injection vulnerability!
  - ✅ **Right**: `query('SELECT * FROM users WHERE id = $1', [id])`

### Column Naming
- **Database**: `snake_case` (e.g., `user_id`, `created_at`, `habit_name`)
- **API Response**: `camelCase` (e.g., `userId`, `createdAt`, `habitName`)
- Transformation happens in models or serializers

### Query Patterns
```javascript
// SELECT
const result = await db.query('SELECT * FROM habits WHERE user_id = $1', [userId]);

// INSERT with RETURNING
const result = await db.query(
  'INSERT INTO habits (user_id, name) VALUES ($1, $2) RETURNING *',
  [userId, 'Morning Exercise']
);

// UPDATE
const result = await db.query(
  'UPDATE habits SET name = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
  ['Evening Yoga', habitId]
);

// DELETE
await db.query('DELETE FROM habits WHERE id = $1 AND user_id = $2', [habitId, userId]);
```

### Foreign Key Protection
- Always check user owns resource before modification
- Use parameterized queries to prevent tampering

```javascript
// ✅ Correct - verify user ownership
const habit = await db.query(
  'SELECT * FROM habits WHERE id = $1 AND user_id = $2',
  [habitId, req.user.id]
);
if (!habit.rows[0]) return res.status(404).json({ success: false, message: 'Not found' });
```

---

## API Design

### Response Format - Unified Structure
```javascript
// Success Response
POST /api/habits -> 200 OK
{ 
  success: true,
  data: { 
    id: 1,
    name: 'Morning Exercise',
    userId: 123,
    createdAt: '2026-04-03T10:30:00Z'
  }
}

// Error Response
POST /api/habits -> 400 Bad Request
{
  success: false,
  message: "Habit name is required"
}

// List Response
GET /api/habits -> 200 OK
{
  success: true,
  data: [
    { id: 1, name: 'Morning Exercise', ... },
    { id: 2, name: 'Reading', ... }
  ]
}
```

### Endpoint Patterns
| Method | Path | Auth | Purpose |
|--------|------|------|---------|
| POST | `/api/habits` | Required | Create new habit |
| GET | `/api/habits` | Required | List user's habits |
| GET | `/api/habits/:id` | Required | Get habit details |
| PUT | `/api/habits/:id` | Required | Update habit |
| DELETE | `/api/habits/:id` | Required | Delete habit |
| GET | `/api/analytics/dashboard` | Required | Dashboard data |
| GET | `/api/analytics/habits/trends?days=30` | Required | Trend analysis |

---

## Authentication & Security

### JWT Implementation
- Tokens stored in `Authorization: Bearer {token}` header
- Expires controlled by `JWT_SECRET` in `.env`
- Refresh tokens via re-login
- See [auth.js](../middleware/auth.js) for implementation

```javascript
// Protecting routes
router.get('/habits', auth, async (req, res) => {
  // User ID available as req.user.id
  const userId = req.user.id;
  // ... fetch user's habits ...
});

// Optional auth (some data public, some protected)
router.get('/users/:id/profile', optionalAuth, async (req, res) => {
  if (req.user) {
    // Authenticated - return full profile
  } else {
    // Guest - return public profile only
  }
});
```

### Password Security
- Hash passwords with `bcryptjs` (salt rounds: 10)
- Never log passwords
- Validate password strength on signup
- Example: [User.js](../models/User.js)

### Error Messages - Security Best Practices
- ❌ Don't expose internal details: "Database connection failed at 192.168.1.1"
- ✅ Generic message: "An error occurred. Please try again."
- ✅ Specific for user errors: "Email already registered" (no SQL internals)

---

## Build & Deployment

### Install & Run
```bash
npm install              # Install dependencies
npm run dev              # Start development server (nodemon, hot reload)
npm start                # Production: node server.js
npm run migrate          # Run database migrations
npm run seed             # Populate with sample data
npm test                 # Run Jest test suite
npm run lint             # Check code style
```

### Environment Setup
See [SETUP_GUIDE.md](../SETUP_GUIDE.md) for `.env` configuration:
```bash
DATABASE_URL=postgresql://user:pass@localhost:5432/habit_tracker
JWT_SECRET=your-secret-key-min-32-chars
NODE_ENV=development
PORT=3001
```

### Production Deployment
- Set `NODE_ENV=production`
- Use environment variables for all secrets (never hardcode)
- Enable CORS for frontend domain only
- Use HTTPS/TLS in production
- Enable rate limiting aggressively
- Set up monitoring and logging

---

## Dashboard Integration

### New Enhanced Dashboard
Location: [dashboard-enhanced.html](../dashboard-enhanced.html)

**Features**:
- ✅ Modern design with responsive layout
- ✅ Time-series charts (30-day trends)
- ✅ Comparison charts (bar, doughnut)
- ✅ Progress indicators (circular gauges, bars)
- ✅ Activity heatmap (28 days)
- ✅ Dark mode support
- ✅ Auto-refresh every 30 seconds

### API Integration
The dashboard fetches from `/api/analytics/dashboard`:

```javascript
// Dashboard expects this response
GET /api/analytics/dashboard
Authorization: Bearer {token}

Response: {
  success: true,
  data: {
    totalHabits: 6,
    avgCompletionRate: 85.3,
    currentStreak: 12,
    sleepStats: { avgHours: 6.8, ... },
    habitStats: [{ habit: 'Morning Exercise', completion_rate: 95 }, ...],
    dailyBreakdown: { completed: 4, total: 6, percentage: 67 },
    weeklySummary: [{ day: 'Monday', completed: 5, total: 6, ... }],
    consistencyScore: 85
  }
}
```

See [DASHBOARD_IMPROVEMENTS.md](../DASHBOARD_IMPROVEMENTS.md) for complete documentation.

---

## Testing & Quality

### Jest Test Suite
```bash
npm test                           # Run all tests
npm test -- --watch               # Watch mode
npm test -- --coverage            # Coverage report
npm test -- routes/habits.test.js  # Specific file
```

### Test Structure
```javascript
describe('Habit Model', () => {
  test('creates habit with valid data', async () => {
    const habit = await Habit.create(1, 'Morning Exercise', 'Daily 30 min');
    expect(habit.name).toBe('Morning Exercise');
    expect(habit.userId).toBe(1);
  });

  test('throws error if name missing', async () => {
    await expect(Habit.create(1, '', 'Description')).rejects.toThrow();
  });
});
```

### Linting
```bash
npm run lint              # Check code style
npx eslint src --fix     # Auto-fix issues
```

---

## File Organization

```
backend/
├── .github/
│   ├── copilot-instructions.md        # This file
│   └── ...
├── config/
│   └── database.js                    # PostgreSQL connection pool
├── middleware/
│   ├── auth.js                        # JWT verification
│   └── errorHandler.js                # Centralized error handling
├── models/
│   ├── User.js                        # User data access
│   ├── Habit.js                       # Habit data access
│   └── SleepLog.js                    # Sleep tracking
├── routes/
│   ├── auth.js                        # Authentication endpoints
│   ├── habits.js                      # Habit CRUD
│   ├── users.js                       # User profile
│   ├── analytics.js                   # Dashboard & analytics
│   └── ai.js                          # AI features
├── scripts/
│   ├── migrate.js                     # Database migrations
│   └── seed.js                        # Sample data
├── server.js                          # Express app entry
├── package.json                       # Dependencies
├── dashboard-enhanced.html            # Modern dashboard UI
├── DASHBOARD_IMPROVEMENTS.md          # Dashboard documentation
├── SETUP_GUIDE.md                     # Environment setup
├── ARCHITECTURE.md                    # System design
└── README.md                          # Project overview
```

---

## Troubleshooting

### Common Issues

**Q: "Column does not exist" error**
- Check SQL syntax: `snake_case` column names
- Verify migration ran: `npm run migrate`
- Check database: `psql -c "\\d habits"`

**Q: JWT authentication fails**
- Ensure `Authorization: Bearer {token}` format
- Check token not expired
- Verify `JWT_SECRET` matches in `.env`

**Q: Database won't connect**
- Check `DATABASE_URL` in `.env`
- Start PostgreSQL: `pg_ctl -D /path/to/data start`
- Test connection: `psql $DATABASE_URL`

**Q: Port 3001 already in use**
```bash
# Find and kill process
lsof -i :3001
kill -9 <PID>
```

### Debug Mode
```javascript
// Add to top of file for verbose logging
process.env.DEBUG = 'habit-tracker:*';
```

---

## Related Documentation

| Document | Purpose |
|----------|---------|
| [SETUP_GUIDE.md](../SETUP_GUIDE.md) | Environment and database setup |
| [ARCHITECTURE.md](../ARCHITECTURE.md) | System design and data flow |
| [DASHBOARD_IMPROVEMENTS.md](../DASHBOARD_IMPROVEMENTS.md) | Dashboard features and customization |
| [AI_IMPLEMENTATION_HELPER.js](../AI_IMPLEMENTATION_HELPER.js) | AI feature integration guide |

---

## Quick Command Reference

```bash
# Development
npm run dev              # Start with hot reload
npm run lint            # Check code style
npm test                # Run tests

# Database
npm run migrate         # Run migrations
npm run seed            # Add sample data

# Production
npm start               # Start server
NODE_ENV=production npm start
```

---

**Last Updated**: April 3, 2026  
**Maintained By**: Habit Tracker Development Team  
**Status**: ✅ Production Ready

## Build and Test

**Install and run**:
```bash
npm install                # Install dependencies
npm run dev              # Start with nodemon (hot reload)
npm start                # Production: node server.js
npm run migrate          # Run DB migrations
npm run seed             # Populate with sample data
npm test                 # Run Jest suite
npm run lint             # Check code style
```

**Environment Setup**:
See [SETUP_GUIDE.md](../SETUP_GUIDE.md) for .env configuration.

## Conventions

### Database Queries
- **Always parameterized**: `query(sql, [param1, param2])`
  - ❌ **Wrong**: `query(\`SELECT * FROM users WHERE id = ${id}\`)`
  - ✅ **Right**: `query('SELECT * FROM users WHERE id = $1', [id])`
- Column names snake_case in DB, converted to camelCase in responses
- Use `RETURNING *` for INSERT/UPDATE to get updated rows

### Authentication
- Routes requiring auth: `router.get('/', auth, handler)` 
- User ID available as `req.user.id` after passing `auth` middleware
- JWT stored in `Authorization: Bearer {token}` header
- Expires controlled by `JWT_SECRET` in `.env`

### Error Handling
- Throw errors from models; middleware catches and formats
- Include descriptive messages (e.g., "User with this email already exists")
- Response format: `{ success: false, message: "error description" }`

### Validation
- Use `express-validator` in routes (fluent API)
- Validate before touching the database
- Example pattern in [auth.js](../routes/auth.js)

### API Responses
All endpoints return JSON:
```javascript
// Success
{ success: true, data: { id: 1, name: "Alice" } }

// Error
{ success: false, message: "Bad request" }
```

## File Organization

```
backend/
├── config/            # Database connection
├── middleware/        # Auth, error handling
├── models/            # Data access classes
├── routes/            # API endpoints
├── scripts/           # Migrations, seeding
├── server.js          # Express app entry
└── package.json
```

## Related Documentation

- **Architecture Details**: See [ARCHITECTURE.md](../ARCHITECTURE.md) for system design overview
- **AI Features**: See [AI_IMPLEMENTATION_HELPER.js](../AI_IMPLEMENTATION_HELPER.js) for AI integration
- **Dashboard**: See [DASHBOARD_IMPROVEMENTS.md](../DASHBOARD_IMPROVEMENTS.md) for interactive charts and analytics

---

**Last Updated**: April 2026  
**Team**: Habit Tracker Development
