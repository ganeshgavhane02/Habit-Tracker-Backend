# Habit Tracker Backend API

A comprehensive backend API for a habit tracking application built with Node.js, Express, and PostgreSQL.

## Features

- 🔐 User authentication with JWT
- 📊 Habit tracking and logging
- 😴 Sleep tracking
- 📈 Analytics and insights
- 🛡️ Security with rate limiting and input validation
- 📚 Well-documented API endpoints

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: express-validator
- **Security**: Helmet, CORS, bcryptjs

## Quick Start

### Prerequisites

- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

### Installation

1. **Clone and navigate to the backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your database credentials and JWT secret.

4. **Set up PostgreSQL database**
   - Create a database named `habit_tracker`
   - Update database credentials in `.env`

5. **Run database migrations**
   ```bash
   npm run migrate
   ```

6. **Seed with sample data (optional)**
   ```bash
   npm run seed
   ```

7. **Start the development server**
   ```bash
   npm run dev
   ```

The API will be available at `http://localhost:3001`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Habits
- `GET /api/habits` - Get all user habits
- `POST /api/habits` - Create new habit
- `GET /api/habits/:id` - Get specific habit
- `PUT /api/habits/:id` - Update habit
- `DELETE /api/habits/:id` - Delete habit
- `POST /api/habits/:id/log` - Log habit completion
- `GET /api/habits/:id/logs` - Get habit logs
- `GET /api/habits/:id/stats` - Get habit statistics

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/stats` - Get user statistics

### Analytics
- `GET /api/analytics/dashboard` - Get dashboard analytics
- `GET /api/analytics/habits/trends` - Get habit trends
- `GET /api/analytics/sleep` - Get sleep analytics

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `3001` |
| `NODE_ENV` | Environment | `development` |
| `DB_HOST` | Database host | `localhost` |
| `DB_PORT` | Database port | `5432` |
| `DB_NAME` | Database name | `habit_tracker` |
| `DB_USER` | Database user | `postgres` |
| `DB_PASSWORD` | Database password | `` |
| `JWT_SECRET` | JWT secret key | Required |
| `JWT_EXPIRE` | JWT expiration | `7d` |
| `FRONTEND_URL` | Frontend URL for CORS | `http://localhost:3000` |

## Database Schema

### Users
- `id` (Primary Key)
- `email` (Unique)
- `password_hash`
- `name`
- `created_at`, `updated_at`

### Habits
- `id` (Primary Key)
- `user_id` (Foreign Key)
- `name`, `description`
- `frequency` (JSON array)
- `start_time`, `end_time`
- `category`, `goal`
- `created_at`, `updated_at`

### Habit Logs
- `id` (Primary Key)
- `habit_id` (Foreign Key)
- `date`, `status`, `notes`
- `created_at`

### Sleep Logs
- `id` (Primary Key)
- `user_id` (Foreign Key)
- `date`
- `bed_time`, `wake_time`, `duration`
- `quality`, `notes`

## Development

### Available Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm test` - Run tests
- `npm run migrate` - Run database migrations
- `npm run seed` - Seed database with sample data

### Project Structure

```
backend/
├── config/
│   └── database.js          # Database configuration
├── middleware/
│   ├── auth.js             # Authentication middleware
│   └── errorHandler.js     # Error handling middleware
├── models/
│   ├── User.js             # User model
│   ├── Habit.js            # Habit model
│   └── SleepLog.js         # Sleep log model
├── routes/
│   ├── auth.js             # Authentication routes
│   ├── habits.js           # Habit routes
│   ├── users.js            # User routes
│   └── analytics.js        # Analytics routes
├── scripts/
│   ├── migrate.js          # Database migration script
│   └── seed.js             # Database seeding script
├── server.js               # Main server file
├── package.json
├── .env.example            # Environment variables template
└── README.md
```

## Security Features

- **Password Hashing**: bcryptjs for secure password storage
- **JWT Authentication**: Stateless authentication with refresh tokens
- **Rate Limiting**: Prevents abuse with request limits
- **Input Validation**: Comprehensive validation using express-validator
- **CORS**: Configured for cross-origin requests
- **Helmet**: Security headers for production

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details