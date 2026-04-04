# Deployment Guide

Complete guide for deploying Habit Tracker Backend to production.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Heroku Deployment](#heroku-deployment)
- [Docker Deployment](#docker-deployment)
- [AWS Deployment](#aws-deployment)
- [Environment Setup](#environment-setup)
- [Database Migration](#database-migration)
- [Monitoring](#monitoring)
- [Rollback](#rollback)

---

## Prerequisites

- Deployed database (PostgreSQL v12+)
- Node.js v16+ runtime
- SSL certificate (for HTTPS)
- Domain name (optional but recommended)
- Monitoring tools (Sentry, DataDog, etc.)

---

## Heroku Deployment

### 1. Install Heroku CLI

```bash
# Windows
choco install heroku-cli

# macOS
brew tap heroku/brew && brew install heroku

# Linux
curl https://cli-assets.heroku.com/install.sh | sh
```

### 2. Login to Heroku

```bash
heroku login
```

### 3. Create Heroku App

```bash
heroku create your-app-name
```

### 4. Add PostgreSQL Add-on

```bash
heroku addons:create heroku-postgresql:hobby-dev
```

### 5. Set Environment Variables

```bash
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=your-very-secure-secret
heroku config:set FRONTEND_URL=https://yourfrontend.com
```

### 6. Deploy

```bash
git push heroku main
```

### 7. Run Migrations

```bash
heroku run npm run migrate
heroku run npm run seed  # Optional: seed with data
```

### 8. Check Logs

```bash
heroku logs --tail
```

---

## Docker Deployment

### 1. Create Dockerfile

```dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application code
COPY . .

# Expose port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3001/health', r => {if (r.statusCode!==200) throw new Error(r.statusCode)})"

# Start server
CMD ["npm", "start"]
```

### 2. Build Image

```bash
docker build -t habit-tracker-backend:latest .
```

### 3. Run Container

```bash
docker run -p 3001:3001 \
  -e DATABASE_URL=postgresql://user:pass@host:5432/db \
  -e JWT_SECRET=your-secret \
  -e NODE_ENV=production \
  habit-tracker-backend:latest
```

### 4. Docker Compose (for full stack)

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:14-alpine
    environment:
      POSTGRES_DB: habit_tracker
      POSTGRES_PASSWORD: password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  backend:
    build: .
    ports:
      - "3001:3001"
    environment:
      DATABASE_URL: postgresql://postgres:password@postgres:5432/habit_tracker
      JWT_SECRET: your-secret
      NODE_ENV: production
    depends_on:
      - postgres

volumes:
  postgres_data:
```

---

## AWS Deployment

### Option 1: Elastic Beanstalk

```bash
# Install EB CLI
pip install awsebcli

# Initialize
eb init -p "Node.js 18 running on 64bit Amazon Linux 2" --region us-east-1

# Create environment
eb create production

# Deploy
eb deploy
```

### Option 2: EC2

```bash
# 1. Launch EC2 instance (Ubuntu 20.04)
# 2. SSH into instance
# 3. Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 4. Install PostgreSQL
sudo apt-get install -y postgresql postgresql-contrib

# 5. Clone repository
git clone https://github.com/yourusername/Habit-Tracker-Backend.git
cd Habit-Tracker-Backend

# 6. Install dependencies
npm install

# 7. Set environment variables
nano .env

# 8. Run migrations
npm run migrate

# 9. Install PM2
sudo npm install -g pm2

# 10. Start application
pm2 start server.js --name "habit-tracker"
pm2 startup
pm2 save
```

---

## Environment Setup

### Production .env

```bash
# Server
NODE_ENV=production
PORT=3001

# Database
DATABASE_URL=postgresql://user:password@host:5432/habit_tracker

# Security
JWT_SECRET=your-very-long-secret-key-min-50-chars
SESSION_SECRET=your-session-secret

# CORS
FRONTEND_URL=https://yourfrontend.com

# Email (optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Logging
LOG_LEVEL=info
SENTRY_DSN=your-sentry-dsn

# Analytics
ANALYTICS_ID=your-analytics-id
```

---

## Database Migration

### Before Deployment

```bash
# 1. Test migrations locally
npm run migrate

# 2. Verify all migrations run successfully
npm run migrate --status

# 3. Run in production
# Use environment-specific connection
DATABASE_URL=postgresql://prod-user:pass@prod-host:5432/db npm run migrate
```

---

## Monitoring

### Set Up Error Tracking (Sentry)

```bash
npm install @sentry/node
```

```javascript
// In server.js
const Sentry = require("@sentry/node");

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
});

app.use(Sentry.Handlers.errorHandler());
```

### Set Up Logging

```bash
npm install winston
```

### Health Check

```bash
curl https://your-deployed-app.com/health
```

---

## Rollback

### Heroku Rollback

```bash
heroku releases
heroku rollback v5  # Replace v5 with version number
```

### Docker Rollback

```bash
# Run previous image version
docker run -p 3001:3001 habit-tracker-backend:v1.0.0
```

---

## Performance Optimization

### Enable Caching

```bash
# Add Redis
docker run --name redis -d -p 6379:6379 redis
```

### Database Optimization

```sql
-- Create indexes
CREATE INDEX idx_user_id ON habits(user_id);
CREATE INDEX idx_habit_id ON habit_logs(habit_id);
CREATE INDEX idx_sleep_date ON sleep_logs(sleep_date);
```

### Enable Compression

Already enabled via Helmet in production.

---

## Security Checklist

- [ ] JWT_SECRET is strong (>32 chars)
- [ ] DATABASE_URL uses strong password
- [ ] HTTPS is enforced
- [ ] CORS whitelist is set
- [ ] Environment variables are not in `.env.example`
- [ ] Sensitive logs are excluded
- [ ] Rate limiting is configured
- [ ] Database backups are scheduled

---

## Support

For deployment issues:
- Check logs: `heroku logs --tail`
- Debug: `npm run dev` locally first
- Open an issue on GitHub

