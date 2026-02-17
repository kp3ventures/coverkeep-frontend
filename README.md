# CoverKeep - Warranty Tracking Mobile App

A React Native mobile application for tracking product warranties, built with Expo, Firebase, and OpenAI.

## 📱 Project Overview

CoverKeep helps users track their product warranties by:
- Scanning product barcodes to automatically fetch product information
- Storing warranty details and expiration dates
- Sending notifications before warranties expire
- Using AI to extract warranty information from photos

## 🛠 Tech Stack

- **Framework**: React Native with Expo
- **Navigation**: React Navigation (Native Stack)
- **Backend**: Firebase (Firestore, Auth, Storage)
- **State Management**: Zustand
- **Barcode Scanning**: Expo Camera
- **HTTP Client**: Axios
- **AI**: OpenAI GPT (for warranty document analysis)

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator (Mac) or Android Emulator
- Firebase account
- Git

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/kp3ventures/coverkeep-frontend.git
cd coverkeep-frontend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment

Copy `.env.example` to `.env` and fill in your credentials:

```bash
cp .env.example .env
```

Update `.env` with your Firebase configuration:
```
EXPO_PUBLIC_FIREBASE_API_KEY=your-api-key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your-auth-domain
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your-storage-bucket
EXPO_PUBLIC_API_URL=your-backend-url
```

### 4. Firebase Setup

The app is configured to use Firebase project `coverkeep-af231`. Make sure:
- Firestore is enabled
- Authentication (Email/Password) is enabled
- Storage is configured

### 5. Run the App

```bash
# Start Expo development server
npm start

# Run on iOS
npm run ios

# Run on Android
npm run android

# Run on web (limited functionality)
npm run web
```

## 📁 Project Structure

```
CoverKeep/
├── src/
│   ├── screens/           # App screens
│   │   ├── LoginScreen.tsx
│   │   ├── DashboardScreen.tsx
│   │   ├── AddProductScreen.tsx
│   │   └── ProductDetailScreen.tsx
│   ├── components/        # Reusable components
│   │   └── BarcodeScanner.tsx
│   ├── services/          # External services
│   │   ├── firebaseConfig.ts
│   │   └── api.ts
│   └── utils/             # Utility functions
├── App.tsx                # Main app entry
├── package.json
└── README.md
```

## 🔥 Firebase Data Structure

```
users/{userId}/products/{productId}
{
  name: string
  brand: string
  barcode?: string
  purchaseDate?: string
  warrantyExpiry?: string
  notes?: string
  createdAt: string
}
```

## 🎯 Features Roadmap

### Week 1 (Current) ✅
- [x] Project initialization
- [x] Basic navigation setup
- [x] Firebase integration
- [x] Login/Signup screens
- [x] Dashboard with product list
- [x] Add product screen
- [x] Barcode scanner component

### Week 2-3 (Upcoming)
- [ ] Backend API integration
- [ ] Barcode lookup functionality
- [ ] Image upload for warranty documents
- [ ] AI-powered warranty extraction
- [ ] Product detail editing

### Week 4-6
- [ ] Push notifications
- [ ] Warranty expiration alerts
- [ ] Search and filter
- [ ] Product categories
- [ ] Receipt photo storage

### Week 7-8
- [ ] Testing and bug fixes
- [ ] Performance optimization
- [ ] App store preparation
- [ ] Documentation

## 🧪 Development Notes

### Camera Permissions
The barcode scanner requires camera permissions. When testing:
- iOS: Permissions will be requested automatically
- Android: Ensure camera permissions are granted in settings

### Firebase Rules
For development, Firestore rules allow authenticated users to read/write their own data:

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

## 🤝 Contributing

This project is under active development. Current sprint: **Week 1 - Project Setup**

### Development Workflow
1. Create feature branch from `main`
2. Make changes and test locally
3. Commit with descriptive messages
4. Push to GitHub
5. Create pull request

### Commit Message Format
```
type: description

Examples:
feat: Add barcode scanning functionality
fix: Resolve Firebase auth error
docs: Update setup instructions
style: Format code with Prettier
```

## 📞 Support & Contact

- Project Owner: KP3 (kp3ventures)
- GitHub: https://github.com/kp3ventures/coverkeep-frontend
- Timeline: 8-week MVP sprint

## 📄 License

Private project - All rights reserved

---

**Current Status**: Week 1 - Project Structure Complete ✅

**Next Steps**: 
- Push to GitHub repository
- Backend team can start API specification
- Begin Week 2: Backend integration
