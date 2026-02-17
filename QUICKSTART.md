# 🚀 CoverKeep Quick Start Guide

Get the CoverKeep app running in **under 5 minutes**.

---

## Prerequisites

- **Node.js** 18+ ([download here](https://nodejs.org/))
- **npm** (comes with Node.js)
- **Expo CLI**: `npm install -g expo-cli`
- **Mobile device** with Expo Go app OR **simulator** installed

---

## Step 1: Install Dependencies

```bash
cd CoverKeep
npm install
```

This installs all required packages (~1-2 minutes).

---

## Step 2: Start the Development Server

```bash
npm start
```

You'll see a QR code in the terminal and a browser window will open.

---

## Step 3: Run the App

### Option A: Physical Device (Recommended)

1. Install **Expo Go** app:
   - [iOS App Store](https://apps.apple.com/app/expo-go/id982107779)
   - [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)

2. Open Expo Go and **scan the QR code** from terminal

3. App loads on your device!

### Option B: iOS Simulator (Mac only)

```bash
# In the terminal where Expo is running, press:
i
```

Xcode Simulator will open and load the app.

### Option C: Android Emulator

```bash
# In the terminal where Expo is running, press:
a
```

Android Studio emulator will open and load the app.

---

## Step 4: Test the App

### Login Screen
- Enter **any email and password** (mock auth for now)
- Toggle between "Log In" and "Sign Up"
- Press the primary button to authenticate

### Dashboard
- View sample products
- Try the filter tabs (All, Active, Expiring Soon, Expired)
- Pull down to refresh
- Tap the **+** button to add a product

### Add Product
- Choose input method (Manual for quickest test)
- Fill in the form:
  - **Product Name**: "Test Product"
  - **Brand**: "Test Brand"
  - **Purchase Date**: "2025-01-01"
  - **Warranty Length**: "12"
- Press "Add Product"

### Product Detail
- Tap any product card to see details
- Press "File Warranty Claim"

### Warranty Claim
- Chat with the AI assistant
- Try different messages to see contextual responses

### Settings
- View account info
- Try the "Upgrade to Premium" button
- Toggle notification settings
- Log out to return to login

---

## 🐛 Troubleshooting

### "Command not found: expo"
```bash
npm install -g expo-cli
```

### Metro bundler issues
```bash
# Clear cache and restart
npm start -- --clear
```

### Camera permission errors
The barcode scanner requires camera permissions. Accept when prompted.

### Can't scan QR code
Make sure your phone and computer are on the **same WiFi network**.

---

## 📝 Development Tips

### Hot Reload
Changes to code automatically refresh the app. No need to restart!

### Debug Menu
- **iOS**: Shake device or `Cmd + D` in simulator
- **Android**: Shake device or `Cmd + M` in emulator

### View Logs
All `console.log()` statements appear in the terminal where `npm start` is running.

---

## 🔧 Configuration

### Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Currently uses mock data, so no configuration needed for local testing.

### API Configuration
When backend is ready, update in `.env`:
```
EXPO_PUBLIC_API_URL=https://your-api.com/api/v1
```

---

## 🎨 Customization

### Change Theme Colors
Edit `tailwind.config.js`:
```javascript
colors: {
  primary: {
    500: '#YOUR_COLOR',
  },
}
```

### Add New Screens
1. Create screen in `src/screens/`
2. Add route to `src/types/index.ts` (RootStackParamList)
3. Add screen to `src/navigation/AppNavigator.tsx`

---

## 🚀 Next Steps

- Read `README.md` for full documentation
- Check `FRONTEND_IMPLEMENTATION.md` for technical details
- See `src/api/` for backend integration points

---

## 💬 Need Help?

- **Frontend Issues**: Contact frontend-dev
- **Backend Integration**: Coordinate with backend-dev
- **QA/Testing**: Report to QA team

---

**Happy coding! 🎉**
