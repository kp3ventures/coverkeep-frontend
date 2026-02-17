# CoverKeep - Warranty Tracking Mobile App

**Never lose track of your warranties again.**

CoverKeep is a React Native mobile application built with Expo that helps users track product warranties, receive expiration reminders, and file warranty claims with AI assistance.

## 🚀 Tech Stack

- **Framework**: React Native + Expo
- **UI Library**: NativeWind (Tailwind CSS for React Native)
- **State Management**: Zustand
- **Navigation**: React Navigation (Native Stack)
- **Backend**: Firebase Authentication + Custom REST API
- **Camera/Barcode**: Expo Camera + Vision Camera
- **Language**: TypeScript

## 📦 Features

### ✅ Implemented (MVP - Week 2-3)

- **Authentication**: Email/password login and signup
- **Dashboard**: View all products with filtering (all, active, expiring soon, expired)
- **Product Management**:
  - Add products via barcode scan, photo (AI), or manual entry
  - View detailed product information
  - Edit and delete products
- **Warranty Tracking**: 
  - Visual expiration badges
  - Days remaining display
  - Automatic status categorization
- **Claim Assistant**: AI-powered chatbot to guide warranty claims
- **Premium Features**: Freemium model with upgrade prompts
- **Settings**: Account management, notifications, premium features

### 🔜 Coming Soon

- Firebase Authentication integration
- Backend API integration
- AI product identification from photos
- Receipt OCR scanning
- Push notifications for expiring warranties
- Analytics dashboard
- Automatic warranty detection

## 🛠️ Project Structure

```
CoverKeep/
├── src/
│   ├── api/              # API client and endpoints
│   │   ├── client.ts     # Axios instance with interceptors
│   │   ├── products.ts   # Product CRUD operations
│   │   └── claims.ts     # Claim operations
│   ├── components/       # Reusable UI components
│   │   ├── Header.tsx
│   │   ├── ProductCard.tsx
│   │   ├── ExpirationBadge.tsx
│   │   ├── BarcodeScanner.tsx
│   │   ├── ClaimAssistant.tsx
│   │   ├── PremiumUpsell.tsx
│   │   ├── Toast.tsx
│   │   └── LoadingOverlay.tsx
│   ├── screens/          # Screen components
│   │   ├── LoginScreen.tsx
│   │   ├── DashboardScreen.tsx
│   │   ├── AddProductScreen.tsx
│   │   ├── ProductDetailScreen.tsx
│   │   ├── WarrantyClaimScreen.tsx
│   │   └── SettingsScreen.tsx
│   ├── stores/           # Zustand state management
│   │   ├── userStore.ts
│   │   ├── productStore.ts
│   │   ├── claimStore.ts
│   │   └── uiStore.ts
│   ├── types/            # TypeScript type definitions
│   ├── utils/            # Utility functions
│   ├── config/           # Environment configuration
│   └── navigation/       # Navigation setup
├── assets/               # Images and icons
├── App.tsx               # Main app component
├── tailwind.config.js    # Tailwind configuration
└── package.json
```

## 🏃 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Expo CLI: `npm install -g expo-cli`
- iOS Simulator (Mac) or Android Studio
- Expo Go app (for physical device testing)

### Installation

1. **Clone the repository**:
   ```bash
   cd CoverKeep
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   ```bash
   cp .env.example .env
   # Edit .env with your API URLs and Firebase config
   ```

4. **Start the development server**:
   ```bash
   npm start
   ```

5. **Run on device/simulator**:
   - Press `i` for iOS simulator
   - Press `a` for Android emulator
   - Scan QR code with Expo Go app for physical device

## 🎨 Design System

### Color Palette (Dark Theme)

- **Primary**: `#0ea5e9` (Sky Blue)
- **Background**: `#0f172a` (Slate 900)
- **Card**: `#1e293b` (Slate 800)
- **Border**: `#334155` (Slate 700)
- **Text**: `#f1f5f9` (Slate 100)
- **Muted**: `#94a3b8` (Slate 400)

### Components

All components follow a consistent design language with:
- Rounded corners (xl = 12px)
- Subtle borders
- Active state opacity
- Accessible touch targets (min 44px)
- WCAG AA compliant contrast ratios

## 📱 Screenshots

_Coming soon after UI polish_

## 🔗 API Integration

The app expects a REST API with the following endpoints:

- `POST /api/v1/auth/login` - User authentication
- `POST /api/v1/auth/signup` - User registration
- `GET /api/v1/products` - List user's products
- `POST /api/v1/products` - Create new product
- `PATCH /api/v1/products/:id` - Update product
- `DELETE /api/v1/products/:id` - Delete product
- `POST /api/v1/ai/identify` - AI product identification
- `POST /api/v1/claims/draft` - Create claim draft
- `POST /api/v1/claims/:id/submit` - Submit claim
- `POST /api/v1/claims/ai-assist` - Get AI claim assistance

See `src/api/` for detailed request/response types.

## 🧪 Testing

_Testing framework to be set up in Week 4_

```bash
npm test
```

## 📦 Building for Production

### iOS

```bash
expo build:ios
```

### Android

```bash
expo build:android
```

## 🚢 Deployment

_EAS Build configuration to be added in Week 3_

## 📝 Development Notes

### Current Mock Data

The app currently uses mock data for development:
- Mock authentication (any email/password works)
- Sample products in Dashboard
- Simulated AI responses in Claim Assistant

### Next Steps

1. **Backend Integration** (depends on backend-dev):
   - Connect Firebase Auth
   - Hook up REST API endpoints
   - Replace mock data with real API calls

2. **Camera Features**:
   - Implement AI product identification
   - Add receipt OCR scanning
   - Barcode API integration

3. **Polish**:
   - Add loading skeletons
   - Improve error handling
   - Accessibility testing
   - Performance optimization

4. **Premium Features**:
   - Set up payment processing (Stripe/RevenueCat)
   - Implement premium-only features
   - Add subscription management

## 🤝 Contributing

This is an MVP project. Coordinate with:
- **Backend Dev**: API integration
- **QA**: Testing and bug reports
- **Design**: UI/UX refinements

## 📄 License

Proprietary - KP3 Ventures

## 👤 Author

**Frontend-Dev Agent** for KP3 Ventures  
GitHub: [@kp3ventures](https://github.com/kp3ventures)

---

**Status**: ✅ MVP Complete - Ready for Backend Integration & Testing  
**Version**: 1.0.0  
**Last Updated**: Feb 17, 2026
