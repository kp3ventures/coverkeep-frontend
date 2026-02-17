# 🧪 AI Scan Testing Guide - User Manual

**Feature:** AI Product Identification  
**Status:** ✅ Fixed and Ready to Test  
**Date:** February 17, 2026

---

## 🚀 Quick Start (5 Minutes)

### Step 1: Restart Everything
```bash
# Terminal 1: Restart Expo (IMPORTANT - loads new .env variables!)
cd CoverKeep
npm start -- --clear

# Terminal 2: Start Backend
cd coverkeep-backend/functions
npm run serve
```

**Why restart?** The `.env.local` file was updated with correct environment variables. Expo must restart to load them.

### Step 2: Open Console
Open your browser's developer console (Chrome DevTools, Safari Console, etc.) to see debug logs.

### Step 3: Test AI Scan
1. Open the app (scan QR code with Expo Go)
2. Tap "Add Product"
3. Tap "Identify with AI" (✨ NEW badge)
4. Allow camera permission
5. Point camera at a product (laptop, phone, book, etc.)
6. Take photo
7. Watch console logs...

**Expected Console Output:**
```
[API Client] Initialized with base URL: http://localhost:5001/...
[AI Scan] Photo captured: file:///...
[AI Scan] Step 1: Converting image to base64...
[AI Scan] Step 2: Base64 conversion successful, size: 523451
[AI Scan] Step 3: Calling API with userId: user123
[AI Scan] Calling API: http://localhost:5001/.../products/identify
[AI Scan] Image size: 523451 characters
[AI Scan] User ID: user123
[AI Scan] API Response: 200 { success: true, product: {...} }
[AI Scan] Step 4: API response received: { name: "MacBook Pro", ... }
```

---

## ✅ What You Should See

### 1. Camera Opens ✅
- Tap "Identify with AI"
- Camera view appears
- Dashed box overlay shows where to point
- Instructions: "Point camera at product"

### 2. Photo Capture ✅
- Tap white circle button
- Photo preview appears
- Options: "Retake" or "Use Photo"

### 3. Processing ✅
- Modal appears with spinner
- Text: "Processing with AI..."
- Sub-text: "Analyzing your product photo"
- Takes 3-5 seconds

### 4. Success Result ✅
- Modal shows product details:
  - Product Name
  - Brand
  - Category
  - Model (if detected)
  - Color (if detected)
  - Confidence score (e.g., "95% Confidence")
  - Suggested Warranty
- Buttons: "✓ Looks Good", "Edit", "Retake"

### 5. Form Auto-Fill ✅
- Tap "✓ Looks Good"
- Product form appears
- Fields auto-filled:
  - Product Name ✅
  - Brand ✅
  - Category ✅
  - Warranty Length ✅
- Green banner: "✨ Identified with AI"
- User can edit before saving

---

## ❌ Common Issues & Solutions

### Issue 1: "API call failed with 400"

**Symptoms:**
```
[AI Scan] ERROR: Request failed with status 400
error: { code: 'INVALID_USER_ID', message: '...' }
```

**Cause:** Old version of app still running.

**Solution:**
```bash
# Force restart Expo
npm start -- --clear
# or press 'r' in Expo terminal to reload
```

---

### Issue 2: "Network error, check your connection"

**Symptoms:**
```
Error modal shows: "Connection Issue"
Console: [AI Scan] ERROR: Network Error
```

**Possible Causes:**
1. Backend not running
2. Wrong API URL
3. Firewall blocking connection

**Solution:**

**A. Check Backend is Running**
```bash
cd coverkeep-backend/functions
npm run serve

# Should see:
✔  functions: Emulator started at http://localhost:5001
```

**B. Verify API URL in Console**
Look for this line when app starts:
```
[API Client] Initialized with base URL: http://localhost:5001/coverkeep-af231/us-central1/api/api/v1
```

If you see `http://localhost:3000` → **WRONG! .env not loaded.**

**C. Test Backend Manually**
```bash
curl http://localhost:5001/coverkeep-af231/us-central1/api/health

# Should return: {"status":"ok","timestamp":"..."}
```

---

### Issue 3: "Photo Quality Too Low"

**Symptoms:**
```
Error modal shows: "Photo Quality Too Low"
Backend returns: { code: 'LOW_CONFIDENCE' }
```

**Cause:** GPT-4 Vision couldn't confidently identify the product.

**Solutions:**
1. **Better Lighting**
   - Use natural light or bright indoor lighting
   - Avoid shadows on product
   
2. **Clearer Photo**
   - Make sure brand name is visible
   - Get closer to product
   - Focus the camera (tap screen)
   
3. **Better Angle**
   - Show product label/logo
   - Avoid reflective surfaces
   - Show unique features

**Good Photos:**
- ✅ Laptop with Apple logo visible
- ✅ Phone box with brand name
- ✅ Product label clearly readable

**Bad Photos:**
- ❌ Blurry image
- ❌ Too dark
- ❌ Generic object with no branding
- ❌ Too far away

---

### Issue 4: "Product Not Recognized"

**Symptoms:**
```
Error modal: "Product Not Recognized"
Backend returns: { code: 'NO_PRODUCT' }
```

**Cause:** AI couldn't find a product in the image.

**When This Happens:**
- Photo of empty table
- Photo of person/face
- Very generic item (plain white mug)
- Product too new/rare (AI doesn't know it)

**Solutions:**
1. Retake with product in frame
2. Show brand name or model number
3. Or use "Enter Manually" option

---

### Issue 5: Console Logs Not Appearing

**Symptoms:**
No `[AI Scan]` logs in console.

**Solution:**

**For Expo Go on iOS:**
```bash
# In terminal where Expo is running:
# Press 'j' to open Chrome DevTools
# Or shake device → "Debug Remote JS"
```

**For Expo Go on Android:**
```bash
# Shake device → "Debug Remote JS"
# Open Chrome DevTools (automatically opens)
```

**For Web:**
- Open browser DevTools (F12)
- Console tab

---

## 🧪 Testing Different Scenarios

### Test 1: Clear Product (Expected Success)
1. Use: Laptop, phone, branded electronics
2. Good lighting, clear photo
3. **Expected:** Identification succeeds, confidence >80%
4. **Console:** See all 4 steps complete
5. **Result:** Product details appear

### Test 2: Blurry Photo (Expected Error)
1. Take intentionally blurry photo
2. **Expected:** "Photo Quality Too Low"
3. **Console:** `LOW_CONFIDENCE` error
4. **Result:** Error modal with guidance

### Test 3: No Product (Expected Error)
1. Photo blank wall or random object
2. **Expected:** "Product Not Recognized"
3. **Console:** `NO_PRODUCT` error
4. **Result:** Error modal suggests manual entry

### Test 4: Network Issue (Expected Error)
1. Stop backend (`Ctrl+C` in backend terminal)
2. Try to scan product
3. **Expected:** "Connection Issue"
4. **Console:** Network error or timeout
5. **Result:** Error modal with troubleshooting tips

### Test 5: Form Auto-Fill (Expected Success)
1. Successfully identify product
2. Tap "✓ Looks Good"
3. **Expected:** Form fields auto-filled
4. **Check:**
   - Product Name ✅
   - Brand ✅
   - Category ✅
   - Warranty Length ✅
5. Green banner shows "✨ Identified with AI"

---

## 🔍 Debugging Tips

### Check 1: Environment Variables Loaded
**When app starts, look for:**
```
[API Client] Initialized with base URL: http://localhost:5001/coverkeep-af231/us-central1/api/api/v1
```

**If you see `localhost:3000`:**
- .env.local not loaded
- Restart Expo: `npm start -- --clear`

### Check 2: Backend Responding
**Test health endpoint:**
```bash
curl http://localhost:5001/coverkeep-af231/us-central1/api/health
```

**Expected:** `{"status":"ok",...}`

### Check 3: Full API Call
**Test product identification endpoint:**
```bash
# Save this to test-ai-scan.sh
curl -X POST http://localhost:5001/coverkeep-af231/us-central1/api/api/v1/products/identify \
  -H "Content-Type: application/json" \
  -d '{
    "image": "data:image/jpeg;base64,/9j/4AAQSkZJRg...[truncated]",
    "userId": "test-user-123"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "product": {
    "name": "MacBook Pro",
    "brand": "Apple",
    "category": "Electronics",
    "confidence": 0.95
  }
}
```

### Check 4: OpenAI API Key
**Verify backend has OpenAI key:**
```bash
cd coverkeep-backend/functions
cat .env.local | grep OPENAI_API_KEY
```

**Should see:** `OPENAI_API_KEY=sk-proj-...`

**If missing:**
- Add to `coverkeep-backend/functions/.env.local`
- Restart backend

---

## 📊 Success Criteria

**Feature is working when:**
- ✅ Camera opens on button tap
- ✅ Photo captures successfully
- ✅ Console shows all 4 steps
- ✅ API call returns 200 status
- ✅ Product details appear in modal
- ✅ Confidence score shown
- ✅ Form auto-fills on confirm
- ✅ Errors show clear messages
- ✅ User can retry or fallback to manual entry

**If ANY of these fail:**
1. Check console logs (look for errors)
2. Verify backend is running
3. Verify API URL is correct
4. Test backend endpoint manually with curl
5. Check OpenAI API key is valid

---

## 🎯 Real-World Testing

**Test with these products:**

1. **Apple Products** (High Success Rate)
   - MacBook (any model)
   - iPhone (box or device)
   - iPad
   - AirPods (box)
   - **Expected:** ~95% confidence

2. **Samsung Products** (High Success Rate)
   - Galaxy phone
   - Samsung TV
   - Tablet
   - **Expected:** ~90% confidence

3. **Generic Electronics** (Medium Success Rate)
   - Laptop (Dell, HP, Lenovo)
   - Monitor
   - Keyboard
   - **Expected:** ~80% confidence

4. **Appliances** (Medium Success Rate)
   - Blender (with brand visible)
   - Toaster
   - Coffee maker
   - **Expected:** ~75% confidence

5. **Challenging Items** (Lower Success Rate)
   - Generic white items
   - Very old products
   - Custom/DIY items
   - **Expected:** May fail, use manual entry

---

## 📝 Reporting Issues

**If something doesn't work:**

1. **Capture Console Logs**
   ```
   [AI Scan] Photo captured: ...
   [AI Scan] Step 1: ...
   [AI Scan] ERROR: ...
   ```

2. **Note Error Details**
   - What did you see on screen?
   - What error message appeared?
   - What was the product?
   - How was the lighting?

3. **Test Backend Manually**
   ```bash
   curl http://localhost:5001/coverkeep-af231/us-central1/api/health
   ```
   Include output.

4. **Check .env.local**
   ```bash
   cd CoverKeep
   cat .env.local | grep EXPO_PUBLIC_API_URL
   ```
   Should show: `EXPO_PUBLIC_API_URL=http://localhost:5001/...`

5. **Create GitHub Issue** with:
   - Steps to reproduce
   - Console logs
   - Screenshots
   - Expected vs actual behavior

---

## ✅ Final Checklist

Before reporting success:

- [ ] Backend running (`npm run serve`)
- [ ] Expo restarted with `--clear` flag
- [ ] Console shows correct API URL (5001, not 3000)
- [ ] Camera opens when tapping "Identify with AI"
- [ ] Photo captures successfully
- [ ] Processing modal appears
- [ ] Console shows all 4 steps
- [ ] Product identified successfully (at least once)
- [ ] Form auto-fills with AI data
- [ ] Error cases handled gracefully
- [ ] Can retry or fallback to manual entry

---

## 🎉 Success!

**If you see this flow working end-to-end:**

1. Tap "Identify with AI"
2. Camera opens
3. Take photo of laptop
4. Console shows: `[AI Scan] Step 1...2...3...4`
5. Modal shows: "MacBook Pro" with confidence
6. Form auto-fills
7. You can save product

**🎊 Congratulations! AI Scan is working!** 🎊

---

## 🆘 Still Having Issues?

**Contact:**
- GitHub: Create issue with logs
- Email: Include console output
- Slack: Share screenshot + logs

**Include:**
1. Console logs (full `[AI Scan]` sequence)
2. Backend logs (`npm run serve` output)
3. Screenshot of error modal
4. Product you tried to scan
5. Device type (iOS/Android/Web)

---

**Happy Testing!** 🚀

Built by FRONTEND-DEV for CoverKeep  
Last Updated: February 17, 2026
