# CoverKeep - Testing Guide

## Quick Start Testing

### 1. Install & Setup
```bash
cd /Volumes/AI_WORKSPACE/agents/clawdbot_workspace/CoverKeep
npm install
cp .env.example .env
# Edit .env with your Firebase credentials
```

### 2. Run Development Server
```bash
npm start
```

This will open Expo DevTools in your browser.

### 3. Test on Devices

#### iOS (Mac Only)
```bash
npm run ios
```
- Opens iOS Simulator automatically
- Requires Xcode installed

#### Android
```bash
npm run android
```
- Requires Android Studio and emulator running
- Or connect physical Android device with USB debugging

#### Physical Device (Recommended for Camera Testing)
1. Install **Expo Go** app from App Store/Play Store
2. Scan QR code from terminal/browser
3. App loads on your device

---

## Test Checklist

### ✅ Authentication Flow
- [ ] Sign up with new email/password
- [ ] Login with existing account
- [ ] Logout functionality
- [ ] Auth persistence (stays logged in on app restart)
- [ ] Error handling (wrong password, invalid email, etc.)

### ✅ Dashboard
- [ ] Empty state displays correctly
- [ ] Product list loads from Firestore
- [ ] Real-time updates (add product in another device, see it update)
- [ ] Navigation to product details
- [ ] Logout button works

### ✅ Add Product
- [ ] Form validation (required fields)
- [ ] Barcode scanner opens camera
- [ ] Camera permissions requested correctly
- [ ] Barcode scanning works (test with product barcode)
- [ ] Manual entry works without scanning
- [ ] Product saves to Firestore
- [ ] Returns to dashboard after save

### ✅ Product Detail
- [ ] Product information displays correctly
- [ ] Delete confirmation dialog
- [ ] Product deletes from Firestore
- [ ] Returns to dashboard after delete

### ✅ Barcode Scanner
- [ ] Camera permission request
- [ ] Camera view displays
- [ ] Scan overlay visible
- [ ] Barcode detection works
- [ ] Close button returns to form
- [ ] "Scan Again" functionality

---

## Camera Testing Requirements

**⚠️ Important**: Barcode scanning **only works on physical devices**. Simulators have limited camera support.

### Supported Barcode Types
- QR Code
- EAN-13 (most common product barcodes)
- EAN-8
- UPC-A
- UPC-E
- Code 128
- Code 39
- Code 93

### Test Products
1. Any retail product box with barcode
2. QR code from online generator
3. Test barcode images (print or display on screen)

---

## Firebase Firestore Testing

### Data Structure Verification
```
users/{userId}/products/{productId}
{
  name: "iPhone 15 Pro"
  brand: "Apple"
  barcode: "123456789012"
  purchaseDate: "2024-01-15"
  warrantyExpiry: "2025-01-15"
  notes: "Purchased from Apple Store"
  createdAt: "2024-01-15T10:30:00Z"
}
```

### Test Cases
1. **Create**: Add product via app → Verify in Firebase Console
2. **Read**: View product list → Check real-time sync
3. **Update**: (Future feature - edit product)
4. **Delete**: Delete product → Verify removed from Firestore

### Firestore Rules (Development)
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

**⚠️ Security**: These rules allow users to read/write their own data only.

---

## API Integration Testing (Week 2+)

### Backend Health Check
```bash
curl http://localhost:3000/api/health
```

### Test Endpoints (when backend is ready)
```bash
# Get products
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:3000/api/products

# Create product
curl -X POST \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Product","brand":"Test Brand"}' \
  http://localhost:3000/api/products
```

---

## Common Issues & Solutions

### Issue: Camera Permission Denied
**Solution**: 
- iOS: Settings → Privacy → Camera → Expo Go → Enable
- Android: Settings → Apps → Expo Go → Permissions → Camera → Allow

### Issue: Firebase Connection Error
**Solution**:
- Verify `.env` has correct Firebase credentials
- Check Firebase project is active
- Ensure Firestore is initialized in Firebase Console

### Issue: "Cannot connect to Metro bundler"
**Solution**:
```bash
# Clear cache and restart
npx expo start -c
```

### Issue: Module not found errors
**Solution**:
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
```

### Issue: iOS build fails
**Solution**:
```bash
# Clear iOS cache
cd ios && pod deintegrate && pod install
# Or just
npx expo run:ios --clean
```

---

## Performance Testing

### App Launch Time
- Target: < 3 seconds on modern devices
- Test on both iOS and Android

### Camera Initialization
- Target: < 1 second to show camera feed
- Test barcode detection speed

### Firestore Queries
- Dashboard load: < 500ms for 10 products
- Real-time updates: < 1 second latency

---

## Security Testing

### ✅ Authentication
- [ ] Passwords not logged to console
- [ ] Firebase rules prevent unauthorized access
- [ ] Logout clears all user data from app

### ✅ Data Privacy
- [ ] Users can only see their own products
- [ ] API calls include proper authentication
- [ ] No sensitive data in error messages

---

## Automated Testing (Future)

### Unit Tests
```bash
npm test
```

### E2E Tests (Detox - Future Implementation)
```bash
# iOS
npm run test:e2e:ios

# Android
npm run test:e2e:android
```

---

## Test Data

### Sample Products for Testing
```json
{
  "name": "iPhone 15 Pro Max",
  "brand": "Apple",
  "purchaseDate": "2024-01-15",
  "warrantyExpiry": "2025-01-15",
  "barcode": "0194253484516"
}

{
  "name": "Samsung Galaxy S24",
  "brand": "Samsung",
  "purchaseDate": "2024-02-01",
  "warrantyExpiry": "2025-02-01",
  "barcode": "8806095299358"
}

{
  "name": "MacBook Pro 16\"",
  "brand": "Apple",
  "purchaseDate": "2024-03-10",
  "warrantyExpiry": "2027-03-10",
  "notes": "3-year AppleCare+"
}
```

---

## Production Testing Checklist

Before deploying to App Store/Play Store:

- [ ] All features tested on physical iOS device
- [ ] All features tested on physical Android device
- [ ] Firebase production environment configured
- [ ] API endpoints pointing to production backend
- [ ] Error tracking configured (Sentry/Crashlytics)
- [ ] Analytics configured (Firebase Analytics)
- [ ] App icons and splash screen finalized
- [ ] Privacy policy and terms of service ready
- [ ] App store listings prepared
- [ ] Beta testing completed (TestFlight/Internal Testing)

---

## Reporting Issues

When reporting bugs, include:
1. Device model and OS version
2. Steps to reproduce
3. Expected vs actual behavior
4. Screenshots/screen recordings
5. Console logs (if applicable)

**Log Location**: Expo DevTools → Terminal output

---

**Last Updated**: 2025-02-17  
**Version**: 1.0.0 (Week 1 - MVP Structure)
