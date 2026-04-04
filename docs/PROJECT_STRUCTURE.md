# Project Structure Guide

**Last Updated**: April 3, 2026

---

## 📁 Folder Organization

```
habit-tracker-backend/
│
├── .github/
│   ├── copilot-instructions.md       # Development guidelines
│   └── workflows/                    # GitHub Actions (CI/CD)
│
├── config/
│   └── database.js                   # PostgreSQL connection pool
│
├── dashboards/                       # 📊 Frontend dashboards
│   └── dashboard-enhanced.html       # Main dashboard with charts
│
├── docs/                             # 📚 Documentation
│   ├── PROJECT_STRUCTURE.md          # This file
│   ├── API_REFERENCE.md              # API endpoints guide
│   ├── DATABASE_SCHEMA.md            # Database structure
│   └── SETUP_INSTRUCTIONS.md         # Setup & deployment
│
├── middleware/
│   ├── auth.js                       # JWT authentication
│   └── errorHandler.js               # Error response formatting
│
├── models/
│   ├── User.js                       # User data model
│   ├── Habit.js                      # Habit data model
│   └── SleepLog.js                   # Sleep tracking model
│
├── public/                           # Static files (CSS, JS, images)
│   ├── index.html                    # Landing page
│   └── assets/                       # Images, icons, etc.
│
├── routes/
│   ├── auth.js                       # Authentication endpoints
│   ├── habits.js                     # Habit CRUD endpoints
│   ├── users.js                      # User management endpoints
│   ├── analytics.js                  # Dashboard & analytics
│   └── ai.js                         # AI-powered features
│
├── scripts/
│   ├── migrate.js                    # Database migrations
│   ├── seed.js                       # Sample data seeding
│   └── migrate-ai.js                 # AI feature migrations
│
├── tests/                            # Unit & integration tests
│   ├── models/                       # Model tests
│   ├── routes/                       # Route tests
│   └── setup.js                      # Test configuration
│
├── ARCHITECTURE.md                   # System design overview
├── DASHBOARD_IMPROVEMENTS.md         # Dashboard features
├── SETUP_GUIDE.md                    # Environment setup
├── README.md                         # Project overview
├── package.json                      # Dependencies
├── server.js                         # Express app entry point
└── .gitignore                        # Git ignore rules

```

---

## 🎯 Folder Purposes

### `.github/`
- **copilot-instructions.md**: AI development guidelines
- **workflows/**: GitHub Actions for CI/CD automation

### `config/`
Database configuration and connection pooling

### `dashboards/`
Frontend HTML/CSS/JS files for data visualization

### `docs/`
Complete project documentation:
- API reference
- Database schema
- Setup instructions
- Deployment guides

### `middleware/`
Express middleware:
- Authentication (JWT)
- Error handling
- Request validation

### `models/`
Data access layer:
- User management
- Habit tracking
- Sleep logging

### `public/`
Static server files:
- Admin dashboards
- Landing pages
- Media assets

### `routes/`
API endpoint definitions:
- Authentication
- CRUD operations
- Analytics
- AI features

### `scripts/`
Utility scripts:
- Database setup
- Data seeding
- Migrations

### `tests/`
Unit and integration tests:
- Model tests
- Route tests
- Middleware tests

---

## 📋 File Organization Checklist

- [x] Models organized in `models/` directory
- [x] Routes organized in `routes/` directory  
- [x] Middleware in `middleware/` directory
- [x] Database config in `config/` directory
- [x] Dashboards in `dashboards/` directory
- [x] Documentation in `docs/` directory
- [x] Scripts in `scripts/` directory
- [x] Tests in `tests/` directory
- [x] Static files in `public/` directory
- [x] .gitignore configured
- [x] README at root

---

## 🚀 Key Files by Category

### **Configuration**
- `package.json` - Dependencies, scripts
- `.env` - Environment variables (NOT in git)
- `server.js` - Express app setup

### **Database**
- `config/database.js` - Connection pool
- `scripts/migrate.js` - Schema setup
- `scripts/seed.js` - Sample data

### **Authentication**
- `routes/auth.js` - Login/signup
- `middleware/auth.js` - JWT verification
- `models/User.js` - User data

### **Core Features**
- `routes/habits.js` - Habit management
- `routes/analytics.js` - Dashboard data
- `dashboards/dashboard-enhanced.html` - Frontend UI

### **Development**
- `.github/copilot-instructions.md` - Guidelines
- `docs/` - Complete documentation
- `tests/` - Test suite

---

## 📄 Documentation Files

### Inside `docs/` folder:
1. **PROJECT_STRUCTURE.md** (this file)
   - Folder organization
   - File purposes
   - Quick reference

2. **API_REFERENCE.md** (create next)
   - All endpoints
   - Request/response examples
   - Error codes

3. **DATABASE_SCHEMA.md** (create next)
   - Table structures
   - Relationships
   - SQL queries

4. **SETUP_INSTRUCTIONS.md** (create next)
   - Environment setup
   - Installation steps
   - Deployment guide

### At root:
1. **README.md** - Project overview
2. **ARCHITECTURE.md** - System design
3. **SETUP_GUIDE.md** - Quick start
4. **DASHBOARD_IMPROVEMENTS.md** - Dashboard features

---

## 🔄 Typical Workflow

```
Edit code
    ↓
Run tests: npm test
    ↓
Check linting: npm run lint
    ↓
Commit: git add . && git commit -m "message"
    ↓
Push: git push origin main
    ↓
Deploy to production (if CI/CD configured)
```

---

## ✅ Checklist for New Features

When adding new features:

- [ ] Create model in `models/` if needed
- [ ] Create route in `routes/` 
- [ ] Add middleware in `middleware/` if needed
- [ ] Write tests in `tests/`
- [ ] Update documentation in `docs/`
- [ ] Update `.github/copilot-instructions.md`
- [ ] Run `npm test` and `npm run lint`
- [ ] Commit and push to GitHub

---

## 📚 Related Files

- **Development Guidelines**: [.github/copilot-instructions.md](../.github/copilot-instructions.md)
- **System Architecture**: [ARCHITECTURE.md](../ARCHITECTURE.md)
- **Dashboard Guide**: [DASHBOARD_IMPROVEMENTS.md](../DASHBOARD_IMPROVEMENTS.md)
- **Setup Guide**: [SETUP_GUIDE.md](../SETUP_GUIDE.md)

---

**Status**: ✅ Active  
**Last Updated**: April 3, 2026  
**Maintainer**: Development Team
