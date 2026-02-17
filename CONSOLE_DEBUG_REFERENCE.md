# 🖥️ Console Debug Reference - AI Scan

**Quick Reference:** What you should see in the console when AI scan works correctly.

---

## ✅ Successful AI Scan Flow

### On App Startup
```javascript
[API Client] Initialized with base URL: http://localhost:5001/coverkeep-af231/us-central1/api/api/v1
[API Client] Environment: Development
```

**✅ CHECK:** URL should be `localhost:5001`, NOT `localhost:3000`

**❌ IF WRONG:**
```bash
# Restart Expo to load new .env variables
npm start -- --clear
```

---

### Step 1: User Taps "Identify with AI"
```javascript
// No logs yet - camera opens
```

**✅ CHECK:** Camera view appears with instructions

---

### Step 2: User Captures Photo
```javascript
[AI Scan] Photo captured: file:///data/user/0/host.exp.exponent/cache/Camera/abc123.jpg
```

**✅ CHECK:** File path logged

---

### Step 3: Converting to Base64
```javascript
[AI Scan] Step 1: Converting image to base64...
[AI Scan] Step 2: Base64 conversion successful, size: 523451
```

**✅ CHECK:**
- Size is reasonable (100K - 2MB typical)
- Too small (<10K) = problem
- Too large (>5MB) = may timeout

---

### Step 4: Calling API
```javascript
[AI Scan] Step 3: Calling API with userId: abc123-user-id
[AI Scan] Calling API: http://localhost:5001/coverkeep-af231/us-central1/api/api/v1/products/identify
[AI Scan] Image size: 523451 characters
[AI Scan] User ID: abc123-user-id
```

**✅ CHECK:**
- URL is correct (port 5001)
- userId is present (NOT null or undefined)
- Image size matches Step 2

**❌ IF userId IS NULL:**
- User not logged in
- Check authentication state

---

### Step 5: API Response (Success)
```javascript
[AI Scan] API Response: 200 {
  success: true,
  product: {
    name: "MacBook Pro 14-inch",
    brand: "Apple",
    category: "Electronics",
    model: "M1 Pro",
    color: "Space Gray",
    confidence: 0.95,
    suggestedWarranty: "1 year (Apple standard warranty)"
  },
  error: null
}
[AI Scan] Step 4: API response received: {
  name: "MacBook Pro 14-inch",
  brand: "Apple",
  ...
}
```

**✅ CHECK:**
- Status is 200
- `success: true`
- `product` object has name, brand, category
- `confidence` is 0-1 (typically >0.7)

---

## ❌ Error Scenarios

### Error 1: Missing userId (400)
```javascript
[AI Scan] Step 3: Calling API with userId: undefined
[AI Scan] ERROR: Request failed with status code 400
[AI Scan] Error details: {
  message: "Request failed with status code 400",
  status: 400,
  data: {
    success: false,
    error: {
      code: "INVALID_USER_ID",
      message: "userId is required for logging and analytics"
    }
  }
}
[AI Scan] 400 Error - Code: INVALID_USER_ID Message: userId is required...
```

**❌ PROBLEM:** User not logged in or user state is null

**✅ FIX:**
- Check user authentication
- Verify `useUserStore()` returns valid user
- User should log in before scanning

---

### Error 2: Wrong API URL (Network Error)
```javascript
[AI Client] Initialized with base URL: http://localhost:3000/api/v1
[AI Scan] Calling API: http://localhost:3000/api/v1/products/identify
[AI Scan] ERROR: Network Error
[AI Scan] Error details: {
  message: "Network Error",
  status: undefined,
  data: undefined
}
```

**❌ PROBLEM:** Wrong API URL (3000 instead of 5001)

**✅ FIX:**
```bash
# .env.local not loaded - restart Expo
npm start -- --clear
```

---

### Error 3: Backend Not Running (Network Error)
```javascript
[API Client] Initialized with base URL: http://localhost:5001/...
[AI Scan] Calling API: http://localhost:5001/.../products/identify
[AI Scan] ERROR: Network Error (Connection refused)
```

**❌ PROBLEM:** Backend server not running

**✅ FIX:**
```bash
cd coverkeep-backend/functions
npm run serve
```

---

### Error 4: Low Confidence (400)
```javascript
[AI Scan] API Response: 400 {
  success: false,
  product: null,
  error: {
    code: "LOW_CONFIDENCE",
    message: "No product detected, please photograph the product clearly"
  }
}
[AI Scan] 400 Error - Code: LOW_CONFIDENCE Message: No product detected...
```

**⚠️ EXPECTED:** Photo quality too low or product not clear

**✅ USER ACTION:**
- Retake with better lighting
- Get closer to product
- Show brand name clearly

---

### Error 5: No Product Detected (400)
```javascript
[AI Scan] API Response: 400 {
  success: false,
  error: {
    code: "NO_PRODUCT",
    message: "No product detected, please photograph the product clearly"
  }
}
```

**⚠️ EXPECTED:** Photo doesn't contain identifiable product

**✅ USER ACTION:**
- Take photo of actual product
- Make sure product is in frame
- Or use manual entry

---

## 🔍 Quick Diagnostics

### Check 1: API URL
**Look for on app startup:**
```
[API Client] Initialized with base URL: http://localhost:5001/...
```

**✅ GOOD:** Port 5001  
**❌ BAD:** Port 3000 → Restart Expo

---

### Check 2: userId Present
**Look for in Step 3:**
```
[AI Scan] Step 3: Calling API with userId: abc123
```

**✅ GOOD:** Actual user ID  
**❌ BAD:** `undefined` or `null` → Check auth

---

### Check 3: Base64 Size
**Look for in Step 2:**
```
[AI Scan] Step 2: Base64 conversion successful, size: 523451
```

**✅ GOOD:** 100,000 - 2,000,000  
**⚠️ WARNING:** <10,000 (corrupted) or >5,000,000 (may timeout)

---

### Check 4: HTTP Status
**Look for in response:**
```
[AI Scan] API Response: 200 {...}
```

**✅ 200:** Success  
**❌ 400:** Bad request (check error.code)  
**❌ 404:** Endpoint not found (backend issue)  
**❌ 500:** Server error (backend crash)  
**❌ Network Error:** Connection failed (backend not running)

---

## 📋 Complete Log Sequence (Success)

```javascript
// App Startup
[API Client] Initialized with base URL: http://localhost:5001/coverkeep-af231/us-central1/api/api/v1
[API Client] Environment: Development

// User captures photo
[AI Scan] Photo captured: file:///...
[AI Scan] Step 1: Converting image to base64...
[AI Scan] Step 2: Base64 conversion successful, size: 523451
[AI Scan] Step 3: Calling API with userId: user123
[AI Scan] Calling API: http://localhost:5001/.../products/identify
[AI Scan] Image size: 523451 characters
[AI Scan] User ID: user123
[AI Scan] API Response: 200 { success: true, product: {...} }
[AI Scan] Step 4: API response received: { name: "MacBook Pro", ... }

// User confirms
// Form auto-fills
✓ Success toast: "✨ Product identified!"
```

**Total time:** 3-5 seconds from capture to result

---

## 🎯 Error Code Quick Reference

| Code | Meaning | User Action |
|------|---------|-------------|
| `INVALID_USER_ID` | userId missing | Check auth, restart app |
| `INVALID_IMAGE` | Image format wrong | Retake photo |
| `IMAGE_TOO_SMALL` | Image corrupted | Retake photo |
| `LOW_CONFIDENCE` | Photo unclear | Better lighting, closer |
| `NO_PRODUCT` | Nothing detected | Show product in frame |
| `RATE_LIMIT` | Too many requests | Wait a moment, retry |
| Network Error | Backend down | Start backend server |

---

## 🛠️ Testing Commands

### Test API URL
```bash
curl http://localhost:5001/coverkeep-af231/us-central1/api/health
# Expected: {"status":"ok","timestamp":"..."}
```

### Test Product Identification
```bash
curl -X POST http://localhost:5001/coverkeep-af231/us-central1/api/api/v1/products/identify \
  -H "Content-Type: application/json" \
  -d '{
    "image": "data:image/jpeg;base64,/9j/4AAQ...",
    "userId": "test-user"
  }'
```

---

## 📝 Notes

**Console filters:**
```
[AI Scan]     - AI scan flow
[API Client]  - API configuration
ERROR:        - All errors
```

**Timing:**
- Photo capture: Instant
- Base64 conversion: <1 second
- API call: 3-5 seconds
- Total flow: 4-6 seconds

**Normal behavior:**
- Some photos may fail (LOW_CONFIDENCE) - this is OK
- ~90% success rate with clear photos
- ~70% success rate with generic items
- Retry usually works

---

**Keep this reference open while testing!** 📖

Compare your console output with the examples above to diagnose issues quickly.
