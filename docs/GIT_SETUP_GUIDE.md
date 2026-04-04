# Git & GitHub Setup Guide

**Version**: 1.0 | **Date**: April 3, 2026

---

## 🚀 Quick Start - Push to GitHub

### Step 1: Initialize Git (if not already done)
```bash
cd "c:\Users\Ganesh\OneDrive\Desktop\backend"
git init
git config user.name "Your Name"
git config user.email "your.email@example.com"
```

### Step 2: Add Remote Repository
```bash
# Replace with your actual GitHub repository URL
git remote add origin https://github.com/YOUR_USERNAME/habit-tracker.git
# or if using SSH:
# git remote add origin git@github.com:YOUR_USERNAME/habit-tracker.git
```

### Step 3: Create .gitignore (already done)
```bash
# The .gitignore file is already created in the root folder
# It includes: node_modules, .env, .vscode, logs, etc.
```

### Step 4: Add All Files
```bash
git add .
```

### Step 5: Create Initial Commit
```bash
git commit -m "Initial commit: Habit Tracker Backend with enhanced dashboard"
```

### Step 6: Push to GitHub
```bash
# First time push
git branch -M main
git push -u origin main

# Subsequent pushes
git push origin main
```

---

## 📋 Pre-Push Verification Checklist

Before pushing, verify:

```bash
# 1. Check git status
git status

# 2. Verify file structure
ls -la

# 3. Run tests
npm test

# 4. Check linting
npm run lint

# 5. Verify no sensitive files
git ls-files | grep -E "(\.env|password|secret|key)"
```

---

## 📁 What Gets Pushed?

### ✅ Included in Git
```
✅ .github/copilot-instructions.md
✅ config/
✅ dashboards/
✅ docs/
✅ middleware/
✅ models/
✅ public/
✅ routes/
✅ scripts/
✅ tests/
✅ server.js
✅ package.json
✅ README.md
✅ ARCHITECTURE.md
✅ SETUP_GUIDE.md
✅ DASHBOARD_IMPROVEMENTS.md
```

### ❌ NOT Included (per .gitignore)
```
❌ node_modules/
❌ .env (contains secrets)
❌ .vscode/ (IDE config)
❌ logs/
❌ *.log
❌ dist/ build/
❌ .DS_Store (macOS)
❌ Thumbs.db (Windows)
```

---

## 🔧 Common Git Commands

### View Status
```bash
git status
```

### View Commit History
```bash
git log --oneline -10
```

### View Changes Before Committing
```bash
git diff
```

### Undo Last Commit (keep changes)
```bash
git reset --soft HEAD~1
```

### Revert File to Previous Version
```bash
git checkout HEAD -- filename.js
```

### Create New Branch
```bash
git checkout -b feature/new-feature
```

### Merge Branch to Main
```bash
git checkout main
git merge feature/new-feature
```

### Push Branch
```bash
git push origin feature/new-feature
```

---

## 📊 Current Repository Status

### Files Ready to Push
- ✅ All source code files
- ✅ Configuration files
- ✅ Documentation (README, guides, etc.)
- ✅ Dashboard HTML files
- ✅ GitHub instructions

### Folder Structure Created
```
backend/
├── dashboards/          (new)
├── docs/                (new)
├── public/              (new)
├── tests/               (new)
├── .gitignore           (configured)
└── ... (existing files)
```

### Documentation Created
- ✅ docs/PROJECT_STRUCTURE.md
- ✅ DASHBOARD_IMPROVEMENTS.md
- ✅ .github/copilot-instructions.md (updated)

---

## 🔐 Sensitive Files Handling

### Never Commit
```
.env                    # Database credentials, JWT secrets
.env.local              # Local overrides
.env.*.local            # Environment-specific secrets
config/secrets.js       # Any secrets file
```

### Create .env Locally
```bash
# Create .env file (not tracked by git)
echo "DATABASE_URL=postgresql://user:pass@localhost:5432/habit_tracker" > .env
echo "JWT_SECRET=your-secret-key-min-32-chars" >> .env
echo "NODE_ENV=development" >> .env
echo "PORT=3001" >> .env
```

### Share Configuration Template
```bash
# Create .env.example (tracked by git)
# Users copy this to .env for local setup
DATABASE_URL=postgresql://user:pass@localhost:5432/habit_tracker
JWT_SECRET=your-secret-key-here
NODE_ENV=development
PORT=3001
```

---

## 🚀 Deployment via GitHub

### Option 1: GitHub Actions (CI/CD)
Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy to Production
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '16'
      - run: npm install
      - run: npm test
      - run: npm run lint
      # Add your deployment steps here
```

### Option 2: Manual Deployment
```bash
# SSH into server
ssh user@server.com

# Clone repository
git clone https://github.com/YOUR_USERNAME/habit-tracker.git
cd habit-tracker

# Install dependencies
npm install

# Set environment variables
cp .env.example .env
# Edit .env with production values

# Run migrations
npm run migrate

# Start server
npm start
```

---

## 📝 Commit Message Guidelines

### Format
```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Code style (formatting)
- `refactor`: Code refactoring
- `test`: Tests
- `chore`: Build, dependencies

### Examples
```
feat(dashboard): add time-series chart visualization

fix(auth): resolve JWT token expiration issue

docs(setup): update installation instructions

refactor(models): simplify database queries

test(habits): add unit tests for habit model
```

### Good Commit Messages
```bash
git commit -m "feat(dashboard): add 30-day trend visualization

- Added Chart.js integration
- Created line chart component
- Implemented responsive design
- Added dark mode support"
```

---

## ✅ Final Checklist Before Push

- [ ] All files organized in proper folders
- [ ] .gitignore configured correctly
- [ ] .env file created locally (NOT committed)
- [ ] node_modules/ NOT in commit (gitignore working)
- [ ] Tests passing: `npm test`
- [ ] Linting clean: `npm run lint`
- [ ] README.md complete and accurate
- [ ] Documentation in docs/ folder
- [ ] No console.log() in production code
- [ ] No passwords/secrets in code
- [ ] Git initialized: `git init`
- [ ] Remote added: `git remote add origin [URL]`
- [ ] Files staged: `git add .`
- [ ] Committed: `git commit -m "message"`
- [ ] Ready to push: `git push origin main`

---

## 🆘 Troubleshooting

### "fatal: not a git repository"
```bash
git init
git remote add origin [your-repo-url]
```

### "Your branch is ahead of 'origin/main'"
```bash
git push origin main
```

### "Permission denied (publickey)"
```bash
# Use HTTPS instead of SSH
git remote set-url origin https://github.com/USERNAME/repo.git
```

### ".env accidentally committed"
```bash
# Remove from git history
git rm --cached .env
git commit -m "Remove .env from tracking"

# Add to .gitignore (already done)
# Commit again
git commit -m "Update .gitignore"
```

### Large files causing issues
```bash
# Check for large files
find . -type f -size +100M

# Remove if not needed
git rm --cached large-file
```

---

## 📞 Support

For Git-related issues:
1. Check [GitHub Docs](https://docs.github.com)
2. Run `git help <command>`
3. Check remote: `git remote -v`
4. Check status: `git status`

---

**Status**: ✅ Ready to Push  
**Last Updated**: April 3, 2026  
**Next Step**: Run the Quick Start section above
