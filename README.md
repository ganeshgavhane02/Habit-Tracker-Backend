# 🎯 Habit Tracker Backend

> A production-ready **REST API** for habit tracking with AI-powered insights, sleep analytics, and comprehensive dashboards.

[![Node.js](https://img.shields.io/badge/Node.js-18%2B-green?style=flat-square&logo=node.js)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-4.18%2B-black?style=flat-square&logo=express)](https://expressjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14%2B-blue?style=flat-square&logo=postgresql)](https://www.postgresql.org/)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](LICENSE)

---

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Quick Start](#quick-start)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Environment Setup](#environment-setup)
- [Database](#database)
- [Testing](#testing)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

---

## ✨ Features

- 🔐 **JWT Authentication** - Secure token-based authentication
- 📊 **Habit Tracking** - Create, log, and manage daily habits
- 😴 **Sleep Analytics** - Track and analyze sleep patterns
- 📈 **Advanced Analytics** - Dashboard with charts, trends, and insights
- 🤖 **AI Features** - Intelligent recommendations and insights
- 🔔 **Real-time Notifications** - Streak tracking and achievements
- 🛡️ **Security** - Rate limiting, input validation, helmet protection
- 📱 **RESTful Design** - Clean, standard API endpoints
- ✅ **Well-Tested** - Jest test suite with coverage
- 📚 **Comprehensive Docs** - Full API reference and guides

---

## 🛠️ Tech Stack

| Component | Technology | Version |
|-----------|-----------|---------|
| Runtime | Node.js | 16+ |
| Framework | Express.js | 4.18+ |
| Database | PostgreSQL | 12+ |
| Auth | JWT | - |
| Validation | express-validator | Latest |
| Security | Helmet, bcryptjs | Latest |
| Testing | Jest | Latest |
| Code Format | ESLint + Prettier | - |

---

## 🚀 Quick Start

### Prerequisites

```bash
# Required
- Node.js v16 or higher
- npm v7 or higher
- PostgreSQL v12 or higher

# Check installations
node --version
npm --version
psql --version
```

### Installation

**1. Clone the repository**
```bash
git clone https://github.com/ganeshgavhane02/Habit-Tracker-Backend.git
cd Habit-Tracker-Backend
```

**2. Install dependencies**
```bash
npm install
```

**3. Configure environment**
```bash
cp .env.example .env
# Edit .env with your settings
```

**4. Set up database**
```bash
npm run migrate
npm run seed
```

**5. Start development server**
```bash
npm run dev
```

**6. Verify**
```bash
curl http://localhost:3001/health
# Expected: { "status": "ok" }
```

---

## 📂 Project Structure

```
backend/
├── config/                 # Database configuration
│   └── database.js        # PostgreSQL connection pool
├── middleware/             # Express middleware
│   ├── auth.js            # JWT verification
│   └── errorHandler.js    # Centralized error handling
├── models/                 # Data access layer
│   ├── User.js            # User model
│   ├── Habit.js           # Habit model
│   └── SleepLog.js        # Sleep tracking model
├── routes/                 # API endpoints
│   ├── auth.js            # Authentication (login, register)
│   ├── habits.js          # Habit CRUD operations
│   ├── users.js           # User profile management
│   ├── analytics.js       # Dashboard & analytics
│   └── ai.js              # AI-powered features
├── scripts/                # Database management
│   ├── migrate.js         # Run migrations
│   ├── migrate-ai.js      # AI migrations
│   └── seed.js            # Populate sample data
├── tests/                  # Test suite
│   ├── models/
│   ├── routes/
│   └── middleware/
├── public/                 # Static assets
├── dashboards/             # Dashboard HTML files
├── docs/                   # Documentation
│   ├── API_REFERENCE.md   # Complete API guide
│   ├── ARCHITECTURE.md    # System design
│   └── SETUP_GUIDE.md     # Detailed setup
├── .env.example            # Environment template
├── .gitignore             # Git ignore rules
├── package.json           # Dependencies
├── server.js              # Express app entry point
└── README.md              # This file
```

---

## 🔌 API Documentation

### Base URL
```
http://localhost:3001/api
```

### Authentication
All protected endpoints require JWT token in header:
```
Authorization: Bearer {your_jwt_token}
```

### Core Endpoints

#### 🔐 Auth
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/auth/register` | ❌ | Register new user |
| POST | `/auth/login` | ❌ | Login user |
| GET | `/auth/profile` | ✅ | Get current user |
| PUT | `/auth/profile` | ✅ | Update profile |

#### 📊 Habits
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/habits` | ✅ | List all habits |
| POST | `/habits` | ✅ | Create habit |
| GET | `/habits/:id` | ✅ | Get habit details |
| PUT | `/habits/:id` | ✅ | Update habit |
| DELETE | `/habits/:id` | ✅ | Delete habit |
| POST | `/habits/:id/log` | ✅ | Log completion |
| GET | `/habits/:id/stats` | ✅ | Get statistics |

#### 📈 Analytics
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/analytics/dashboard` | ✅ | Dashboard data |
| GET | `/analytics/habits/trends` | ✅ | 30-day trends |
| GET | `/analytics/sleep` | ✅ | Sleep analytics |

#### 😴 Sleep
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/sleep` | ✅ | Get sleep logs |
| POST | `/sleep` | ✅ | Log sleep |
| PUT | `/sleep/:id` | ✅ | Update log |
| DELETE | `/sleep/:id` | ✅ | Delete log |

**Full API Reference**: See [docs/API_REFERENCE.md](docs/API_REFERENCE.md)

---

## 🔧 Environment Setup

Create `.env` file in project root:

```bash
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/habit_tracker

# JWT
JWT_SECRET=your-secret-key-min-32-characters-long

# Server
NODE_ENV=development
PORT=3001

# Session (optional)
SESSION_SECRET=your-session-secret

# CORS (optional)
FRONTEND_URL=http://localhost:3000
```

See [.env.example](.env.example) for all options.

---

## 💾 Database

### Schema Overview
```sql
-- Users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Habits table
CREATE TABLE habits (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  frequency VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Habit logs
CREATE TABLE habit_logs (
  id SERIAL PRIMARY KEY,
  habit_id INTEGER REFERENCES habits(id),
  completed_date DATE NOT NULL,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Sleep logs
CREATE TABLE sleep_logs (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  sleep_date DATE NOT NULL,
  hours_slept DECIMAL(4, 2),
  quality INT,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Migrations
```bash
npm run migrate      # Run all pending migrations
npm run migrate:ai   # Run AI-related migrations
```

### Seeding
```bash
npm run seed         # Populate with sample data
```

---

## ✅ Testing

```bash
# Run all tests
npm test

# Watch mode
npm test -- --watch

# Coverage report
npm test -- --coverage

# Run specific test file
npm test -- routes/habits.test.js
```

---

## 📦 Build & Deployment

### Development
```bash
npm run dev          # Hot reload with nodemon
```

### Production
```bash
npm run build        # Optimize for production
npm start            # Start production server
NODE_ENV=production npm start
```

### Docker (Optional)
```bash
docker build -t habit-tracker-backend .
docker run -p 3001:3001 habit-tracker-backend
```

---

## 🔒 Security

- ✅ JWT token-based authentication
- ✅ Password hashing with bcryptjs (10 salt rounds)
- ✅ SQL injection prevention (parameterized queries)
- ✅ XSS protection (Helmet middleware)
- ✅ CORS enabled with whitelist
- ✅ Rate limiting (100 requests per 15 minutes)
- ✅ Input validation (express-validator)
- ✅ HTTPS enforced in production

---

## 📖 Additional Documentation

| Document | Purpose |
|----------|---------|
| [ARCHITECTURE.md](docs/ARCHITECTURE.md) | System design & data flow |
| [API_REFERENCE.md](docs/API_REFERENCE.md) | Complete endpoint documentation |
| [SETUP_GUIDE.md](docs/SETUP_GUIDE.md) | Detailed installation guide |
| [CONTRIBUTING.md](CONTRIBUTING.md) | How to contribute |
| [DASHBOARD_IMPROVEMENTS.md](DASHBOARD_IMPROVEMENTS.md) | Dashboard features |

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines.

---

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Kill process on port 3001
lsof -i :3001
kill -9 <PID>
```

### Database Connection Error
```bash
# Check PostgreSQL is running
psql -U postgres

# Verify DATABASE_URL in .env
echo $DATABASE_URL
```

### JWT Authentication Fails
- Ensure `Authorization: Bearer {token}` format
- Check token not expired
- Verify `JWT_SECRET` matches in `.env`

---

## 📄 License

This project is licensed under the **MIT License** - see [LICENSE](LICENSE) file for details.

---

## 👤 Author

**Ganesh Gawhane**
- GitHub: [@ganeshgavhane02](https://github.com/ganeshgavhane02)
- Email: ganesh.dev@example.com

---

## 🙏 Acknowledgments

- Built with [Express.js](https://expressjs.com/)
- Database: [PostgreSQL](https://www.postgresql.org/)
- Testing: [Jest](https://jestjs.io/)
- Authentication: [JWT](https://jwt.io/)

---

## 📞 Support

For issues, questions, or suggestions:
- 🐛 [Open an Issue](https://github.com/ganeshgavhane02/Habit-Tracker-Backend/issues)
- 💬 [Start a Discussion](https://github.com/ganeshgavhane02/Habit-Tracker-Backend/discussions)

---

<div align="center">

**⭐ If you found this helpful, please star the repository!**

</div>
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