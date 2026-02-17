# ⚠️ ACTION REQUIRED: Update Your .env.local File

**IMPORTANT:** The `.env.local` file is gitignored (for security), so you must **manually update it** on your machine.

---

## 🚨 Why This Matters

The bug fix changed environment variable names from `REACT_APP_*` to `EXPO_PUBLIC_*`. 

**Your current `.env.local`** has:
```bash
REACT_APP_API_URL=...           # ❌ WRONG - Expo can't see this
REACT_APP_FIREBASE_API_KEY=...  # ❌ WRONG - Expo can't see this
```

**Must change to:**
```bash
EXPO_PUBLIC_API_URL=...           # ✅ CORRECT - Expo can see this
EXPO_PUBLIC_FIREBASE_API_KEY=...  # ✅ CORRECT - Expo can see this
```

---

## ✅ How to Update

### Option 1: Quick Find & Replace

**Open:** `CoverKeep/.env.local`

**Find & Replace:**
```
Find:    REACT_APP_
Replace: EXPO_PUBLIC_
```

Save the file.

---

### Option 2: Manual Edit

**Open:** `CoverKeep/.env.local`

**Change these lines:**

```bash
# Before (OLD - doesn't work)
REACT_APP_FIREBASE_API_KEY=...
REACT_APP_FIREBASE_AUTH_DOMAIN=...
REACT_APP_FIREBASE_PROJECT_ID=...
REACT_APP_FIREBASE_STORAGE_BUCKET=...
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=...
REACT_APP_FIREBASE_APP_ID=...
REACT_APP_FIREBASE_MEASUREMENT_ID=...
REACT_APP_API_URL=...
REACT_APP_ENVIRONMENT=development
REACT_APP_STRIPE_PUBLISHABLE_KEY=your-stripe-key...
REACT_APP_OPENAI_API_KEY=your-openai-key...

# After (NEW - works with Expo)
EXPO_PUBLIC_FIREBASE_API_KEY=...
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=...
EXPO_PUBLIC_FIREBASE_PROJECT_ID=...
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=...
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
EXPO_PUBLIC_FIREBASE_APP_ID=...
EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID=...
EXPO_PUBLIC_API_URL=http://localhost:5001/coverkeep-af231/us-central1/api/api/v1
EXPO_PUBLIC_ENVIRONMENT=development
EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY=your-stripe-key...
EXPO_PUBLIC_OPENAI_API_KEY=your-openai-key...
```

**Keep the values the same**, just change the prefix!

---

## 🔍 Why Two Prefixes?

| Prefix | Used By | Works With |
|--------|---------|------------|
| `REACT_APP_*` | Create React App | ❌ Web only |
| `EXPO_PUBLIC_*` | Expo | ✅ Mobile + Web |

CoverKeep is an **Expo app** (React Native), so it needs `EXPO_PUBLIC_*`.

---

## ✅ Verify It Worked

After updating `.env.local`:

1. **Restart Expo**
   ```bash
   npm start -- --clear
   ```

2. **Check Console**
   Look for:
   ```
   [API Client] Initialized with base URL: http://localhost:5001/coverkeep-af231/us-central1/api/api/v1
   ```

   **✅ GOOD:** Port 5001  
   **❌ BAD:** Port 3000 → .env not loaded, restart again

3. **Test AI Scan**
   - Should work now!
   - Check console logs for `[AI Scan]` messages

---

## 🆘 Still Not Working?

### Issue: Console shows `localhost:3000`
**Problem:** `.env.local` changes not loaded

**Solutions:**
1. Verify you saved `.env.local` after editing
2. Restart Expo with `--clear` flag: `npm start -- --clear`
3. Check file location: `CoverKeep/.env.local` (NOT in project root!)
4. Verify all `REACT_APP_` changed to `EXPO_PUBLIC_`

### Issue: "Cannot find .env.local"
**Problem:** File doesn't exist

**Solution:**
```bash
cd CoverKeep
cp .env.example .env.local
# Then edit .env.local with your actual values
```

### Issue: Variables still `undefined`
**Problem:** Typo in variable name

**Check:**
- Must be `EXPO_PUBLIC_API_URL` (all caps, underscores)
- Must be at root level (not nested in JSON)
- No extra spaces or quotes

---

## 📄 Reference: Complete .env.local Template

```bash
# Firebase Configuration (EXPO_PUBLIC_ prefix for React Native/Expo)
EXPO_PUBLIC_FIREBASE_API_KEY=AIzaSyD_THnIHdqWQ14EIhbmIysDGiBdLTWjq84
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=coverkeep-af231.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=coverkeep-af231
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=coverkeep-af231.firebasestorage.app
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=594344844244
EXPO_PUBLIC_FIREBASE_APP_ID=1:594344844244:web:a69dbfe8b075034d3d1441
EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID=G-X40R0B50S9

# API Configuration (CRITICAL: Use EXPO_PUBLIC_ for Expo apps!)
EXPO_PUBLIC_API_URL=http://localhost:5001/coverkeep-af231/us-central1/api/api/v1
EXPO_PUBLIC_ENVIRONMENT=development

# Stripe
EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51StgsPEEracdP0V0pcODQy17ncUbo3hryYtkzZWxpOsDSodtrhjIbRJVhC4H9Ome1T88QpIeAISEK7K8seFcIFeo001PwRRfDn

# OpenAI (client-side, if needed for direct calls)
EXPO_PUBLIC_OPENAI_API_KEY=your-openai-api-key-here
```

**Note:** Replace with your actual API keys (above are examples from your current config).

---

## ✅ Checklist

Before testing AI scan:

- [ ] Opened `CoverKeep/.env.local` in text editor
- [ ] Changed ALL `REACT_APP_` to `EXPO_PUBLIC_`
- [ ] Saved the file
- [ ] Restarted Expo with `npm start -- --clear`
- [ ] Console shows port 5001 (not 3000)
- [ ] Ready to test!

---

## 🎯 Why Gitignored?

`.env.local` contains **secrets** (API keys, credentials). It's in `.gitignore` to prevent accidental commits to GitHub.

**Security rule:** Never commit API keys to git!

That's why this file must be updated manually on each machine.

---

**After updating, proceed to testing!** →  See `AI_SCAN_TESTING_GUIDE.md`
