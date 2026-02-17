# GitHub Deployment Guide - CoverKeep

## 🚨 IMMEDIATE ACTION REQUIRED

The code is ready and committed locally. You need to push to GitHub to make it available to the team.

---

## Method 1: GitHub Personal Access Token (Recommended)

### Step 1: Create Personal Access Token

1. Go to: https://github.com/settings/tokens
2. Click **"Generate new token"** → **"Generate new token (classic)"**
3. Give it a name: `coverkeep-deployment`
4. Set expiration: 90 days (or as needed)
5. Select scopes:
   - ✅ `repo` (Full control of private repositories)
6. Click **"Generate token"**
7. **⚠️ COPY THE TOKEN** (you won't see it again!)

### Step 2: Push to GitHub

```bash
cd /Volumes/AI_WORKSPACE/agents/clawdbot_workspace/CoverKeep

# Push using token as password
git push -u origin main
# When prompted:
# Username: kp3ventures
# Password: <paste your token here>
```

### Step 3: Save Token for Future Use (Optional)

```bash
# Store credentials (macOS Keychain)
git config --global credential.helper osxkeychain

# Next push won't ask for credentials
git push origin main
```

---

## Method 2: GitHub CLI (Easiest)

### Step 1: Install GitHub CLI

```bash
# If not installed
brew install gh
```

### Step 2: Authenticate

```bash
gh auth login
# Select: GitHub.com
# Select: HTTPS
# Authenticate with web browser: Y
# Complete authentication in browser
```

### Step 3: Push to GitHub

```bash
cd /Volumes/AI_WORKSPACE/agents/clawdbot_workspace/CoverKeep
git push -u origin main
```

---

## Method 3: SSH Key (Most Secure)

### Step 1: Generate SSH Key

```bash
ssh-keygen -t ed25519 -C "kp3ventures@gmail.com"
# Press Enter to accept default location
# Optional: Set passphrase for extra security
```

### Step 2: Add SSH Key to GitHub

```bash
# Copy public key to clipboard
cat ~/.ssh/id_ed25519.pub | pbcopy

# Or display it
cat ~/.ssh/id_ed25519.pub
```

1. Go to: https://github.com/settings/keys
2. Click **"New SSH key"**
3. Title: `KP3 Mac mini`
4. Paste key from clipboard
5. Click **"Add SSH key"**

### Step 3: Change Remote to SSH

```bash
cd /Volumes/AI_WORKSPACE/agents/clawdbot_workspace/CoverKeep
git remote set-url origin git@github.com:kp3ventures/coverkeep-frontend.git
git push -u origin main
```

---

## Verification

After successful push, verify:

1. **GitHub Repository**: https://github.com/kp3ventures/coverkeep-frontend
2. Check files are visible:
   - ✅ README.md
   - ✅ package.json
   - ✅ src/ folder with all screens
   - ✅ DEPLOYMENT_STATUS.md
   - ✅ TESTING.md

3. Verify commit history:
   ```bash
   # Should see 2 commits
   git log --oneline
   ```

---

## Post-Push Setup

### 1. Repository Settings

Go to: https://github.com/kp3ventures/coverkeep-frontend/settings

**General**
- Description: "CoverKeep - Warranty tracking mobile app (React Native + Expo)"
- Topics: `react-native`, `expo`, `firebase`, `warranty-tracker`, `mobile-app`

**Branches**
- Set `main` as default branch (should be automatic)
- Enable branch protection (optional for MVP):
  - Require pull request reviews before merging
  - Require status checks to pass

### 2. Add Secrets (for CI/CD - Week 2+)

Go to: Settings → Secrets and variables → Actions

Add these secrets:
- `FIREBASE_API_KEY`
- `FIREBASE_PROJECT_ID`
- `FIREBASE_AUTH_DOMAIN`
- (More as needed for production)

### 3. Clone on Other Machines

Team members can now clone:
```bash
git clone https://github.com/kp3ventures/coverkeep-frontend.git
cd coverkeep-frontend
npm install
cp .env.example .env
# Edit .env with credentials
npm start
```

---

## Troubleshooting

### Error: "fatal: could not read Username"
**Fix**: Use one of the authentication methods above (token, CLI, or SSH)

### Error: "remote: Repository not found"
**Fix**: 
1. Verify repository exists: https://github.com/kp3ventures/coverkeep-frontend
2. Check remote URL: `git remote -v`
3. Ensure you're authenticated with correct account

### Error: "remote: Permission denied"
**Fix**: Your token/SSH key doesn't have write access
1. Verify token has `repo` scope
2. Or use SSH key with write permissions

### Error: "Updates were rejected because the remote contains work"
**Fix**: Remote has changes you don't have locally
```bash
git pull origin main --rebase
git push origin main
```

---

## GitHub Actions (Future - Week 3+)

### Automated Testing Workflow

Create `.github/workflows/test.yml`:
```yaml
name: Test & Build

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npm test
      - run: npx expo export --platform web
```

### Expo EAS Build (Week 4+)

```bash
# Install EAS CLI
npm install -g eas-cli

# Login
eas login

# Configure
eas build:configure

# Build for iOS
eas build --platform ios

# Build for Android
eas build --platform android
```

---

## Team Collaboration

### Branch Strategy (Week 2+)

```bash
# Create feature branch
git checkout -b feature/barcode-api-integration

# Make changes, commit
git add .
git commit -m "feat: Integrate barcode lookup API"

# Push feature branch
git push origin feature/barcode-api-integration

# Create pull request on GitHub
# After review and approval, merge to main
```

### Commit Message Convention

```
type: subject

Types:
- feat: New feature
- fix: Bug fix
- docs: Documentation
- style: Formatting, missing semicolons, etc.
- refactor: Code restructuring
- test: Adding tests
- chore: Maintenance

Examples:
feat: Add barcode scanning functionality
fix: Resolve Firebase auth timeout issue
docs: Update README with setup instructions
```

---

## Quick Reference

```bash
# Status check
git status

# View commits
git log --oneline -5

# Push changes
git push origin main

# Pull latest
git pull origin main

# Create branch
git checkout -b feature-name

# Switch branch
git checkout main

# View remotes
git remote -v
```

---

## 🎯 Next Steps After Push

1. ✅ Verify repository is accessible
2. ✅ Share repository link with team
3. ✅ Notify backend developer to start API specs
4. ✅ Test clone on different machine
5. ✅ Setup Firebase Firestore rules
6. ✅ Begin Week 2 tasks (API integration)

---

**Current Status**: Waiting for manual GitHub push  
**Repository**: https://github.com/kp3ventures/coverkeep-frontend  
**Branch**: main  
**Commits Ready**: 2 commits, ~14,500 lines of code  

**⏰ PUSH NOW to unblock backend team!**
