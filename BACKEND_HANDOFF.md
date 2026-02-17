# Backend Team Handoff - CoverKeep API Specifications

**Date**: 2025-02-17  
**Frontend Status**: ✅ Complete (Week 1)  
**Backend Status**: 🟡 Ready to Start  

---

## Overview

The React Native frontend is complete and ready for API integration. This document specifies the backend endpoints the mobile app expects.

---

## Authentication

### Expected Flow
1. Frontend handles authentication via **Firebase Authentication**
2. After login, frontend gets Firebase ID token
3. All API requests include: `Authorization: Bearer <firebase-id-token>`
4. Backend verifies token with Firebase Admin SDK

### Backend Setup Required
```javascript
// Node.js example
const admin = require('firebase-admin');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccountKey)
});

// Middleware to verify token
async function authenticateUser(req, res, next) {
  const token = req.headers.authorization?.split('Bearer ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  
  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.userId = decodedToken.uid;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
}
```

---

## API Base URL

**Development**: `http://localhost:3000/api/v1`  
**Production**: `https://api.coverkeep.com/api/v1`

Configure in mobile app via `.env`:
```
EXPO_PUBLIC_API_URL=http://localhost:3000/api/v1
```

---

## Endpoints Specification

### 1. Products

#### GET `/products`
Get all products for authenticated user.

**Request**:
```http
GET /api/v1/products
Authorization: Bearer <firebase-token>
```

**Response** (200):
```json
{
  "products": [
    {
      "id": "prod_123",
      "userId": "user_456",
      "name": "iPhone 15 Pro",
      "brand": "Apple",
      "category": "Electronics",
      "purchaseDate": "2024-01-15T00:00:00Z",
      "warrantyEndDate": "2025-01-15T00:00:00Z",
      "warrantyLength": 12,
      "price": 999.99,
      "retailer": "Apple Store",
      "imageUrl": "https://storage.../product.jpg",
      "receiptImageUrl": "https://storage.../receipt.jpg",
      "barcode": "0194253484516",
      "status": "active",
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z"
    }
  ]
}
```

#### GET `/products/:id`
Get single product by ID.

**Request**:
```http
GET /api/v1/products/prod_123
Authorization: Bearer <firebase-token>
```

**Response** (200):
```json
{
  "product": {
    "id": "prod_123",
    "userId": "user_456",
    "name": "iPhone 15 Pro",
    // ... (same as above)
  }
}
```

**Response** (404):
```json
{
  "error": "Product not found"
}
```

#### POST `/products`
Create new product.

**Request**:
```http
POST /api/v1/products
Authorization: Bearer <firebase-token>
Content-Type: application/json

{
  "name": "iPhone 15 Pro",
  "brand": "Apple",
  "category": "Electronics",
  "purchaseDate": "2024-01-15",
  "warrantyEndDate": "2025-01-15",
  "warrantyLength": 12,
  "price": 999.99,
  "retailer": "Apple Store",
  "barcode": "0194253484516"
}
```

**Response** (201):
```json
{
  "product": {
    "id": "prod_123",
    "userId": "user_456",
    // ... full product object
  }
}
```

#### PATCH `/products/:id`
Update product.

**Request**:
```http
PATCH /api/v1/products/prod_123
Authorization: Bearer <firebase-token>
Content-Type: application/json

{
  "name": "iPhone 15 Pro Max",
  "notes": "Updated model"
}
```

**Response** (200):
```json
{
  "product": {
    "id": "prod_123",
    // ... updated product
  }
}
```

#### DELETE `/products/:id`
Delete product.

**Request**:
```http
DELETE /api/v1/products/prod_123
Authorization: Bearer <firebase-token>
```

**Response** (204): No content

---

### 2. Barcode Lookup

#### POST `/products/barcode/:code`
Look up product info by barcode.

**Request**:
```http
POST /api/v1/products/barcode/0194253484516
Authorization: Bearer <firebase-token>
```

**Response** (200):
```json
{
  "product": {
    "name": "iPhone 15 Pro 256GB",
    "brand": "Apple",
    "category": "Smartphones",
    "imageUrl": "https://...",
    "upc": "0194253484516",
    "description": "Apple iPhone 15 Pro with A17 Pro chip",
    "source": "barcodelookup.com"
  }
}
```

**Response** (404):
```json
{
  "error": "Product not found for barcode",
  "barcode": "0194253484516"
}
```

**External API Options**:
- UPCitemdb.com (Free tier: 100/day)
- Barcode Lookup API
- Open Food Facts (for food products)

---

### 3. AI Warranty Extraction

#### POST `/ai/extract-warranty`
Extract warranty info from receipt/document image.

**Request**:
```http
POST /api/v1/ai/extract-warranty
Authorization: Bearer <firebase-token>
Content-Type: multipart/form-data

{
  "image": <file>,
  "productId": "prod_123" (optional)
}
```

**Response** (200):
```json
{
  "extracted": {
    "productName": "MacBook Pro 16\"",
    "brand": "Apple",
    "purchaseDate": "2024-03-10",
    "warrantyEndDate": "2027-03-10",
    "warrantyLength": 36,
    "price": 2499.00,
    "retailer": "Apple Store",
    "confidence": 0.95
  },
  "raw": {
    "text": "... extracted OCR text ..."
  }
}
```

**OpenAI Prompt Example**:
```
Extract warranty information from this receipt:
- Product name
- Brand
- Purchase date
- Warranty length (in months)
- Price
- Retailer

Return as JSON.
```

---

### 4. Warranty Claims (Week 3+)

#### POST `/claims`
Create warranty claim.

**Request**:
```http
POST /api/v1/claims
Authorization: Bearer <firebase-token>
Content-Type: application/json

{
  "productId": "prod_123",
  "issueDescription": "Screen stopped working",
  "images": ["url1", "url2"]
}
```

**Response** (201):
```json
{
  "claim": {
    "id": "claim_789",
    "productId": "prod_123",
    "userId": "user_456",
    "status": "draft",
    "issueDescription": "Screen stopped working",
    "aiSuggestions": [
      "Contact Apple Support at 1-800-MY-APPLE",
      "Bring device to Apple Store Genius Bar",
      "Have proof of purchase ready"
    ],
    "createdAt": "2024-02-17T10:00:00Z"
  }
}
```

#### GET `/claims/:id`
Get claim details.

#### PATCH `/claims/:id`
Update claim status.

---

## Data Models

### Product Model
```typescript
interface Product {
  id: string;                    // UUID
  userId: string;                // Firebase user ID
  name: string;                  // Required
  brand: string;                 // Required
  category: string;              // e.g., "Electronics"
  purchaseDate: Date;            // ISO 8601
  warrantyEndDate: Date;         // ISO 8601
  warrantyLength: number;        // In months
  price?: number;                // Optional
  retailer?: string;             // Optional
  imageUrl?: string;             // Firebase Storage URL
  receiptImageUrl?: string;      // Firebase Storage URL
  barcode?: string;              // UPC/EAN code
  status: 'active' | 'expired' | 'expiring-soon';
  createdAt: Date;
  updatedAt: Date;
}
```

### WarrantyClaim Model
```typescript
interface WarrantyClaim {
  id: string;
  productId: string;
  userId: string;
  status: 'draft' | 'submitted' | 'in-progress' | 'approved' | 'rejected';
  issueDescription: string;
  claimDate: Date;
  aiSuggestions?: string[];
  documents?: string[];
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

---

## Error Responses

All errors follow this format:
```json
{
  "error": "Error message",
  "code": "ERROR_CODE",
  "details": {} // optional
}
```

### Status Codes
- `200` - Success
- `201` - Created
- `204` - No Content (successful deletion)
- `400` - Bad Request (validation error)
- `401` - Unauthorized (invalid/missing token)
- `403` - Forbidden (trying to access another user's data)
- `404` - Not Found
- `500` - Internal Server Error

---

## Firebase Storage

Product images and receipts are uploaded directly to Firebase Storage from the mobile app.

**Upload Flow**:
1. Mobile app uploads image to Firebase Storage
2. Gets public URL
3. Sends URL to backend in API request

**Storage Structure**:
```
users/
  {userId}/
    products/
      {productId}/
        image.jpg
        receipt.jpg
```

Backend doesn't need to handle file uploads directly.

---

## Rate Limiting

Recommended limits:
- **Products**: 100 requests/minute per user
- **Barcode Lookup**: 50 requests/minute per user
- **AI Extraction**: 10 requests/minute per user (expensive)

---

## Webhook Events (Future)

For warranty expiration notifications:

```http
POST /api/v1/webhooks/warranty-expiring
Content-Type: application/json

{
  "userId": "user_456",
  "productId": "prod_123",
  "productName": "iPhone 15 Pro",
  "expiresIn": 7, // days
  "warrantyEndDate": "2025-01-15"
}
```

Backend should trigger:
1. Push notification to user's device
2. Email notification (if configured)

---

## Environment Variables

Backend needs:
```env
PORT=3000
NODE_ENV=production

# Firebase Admin
FIREBASE_PROJECT_ID=coverkeep-af231
FIREBASE_CLIENT_EMAIL=...
FIREBASE_PRIVATE_KEY=...

# Database
DATABASE_URL=postgresql://...

# External APIs
BARCODE_API_KEY=...
OPENAI_API_KEY=...

# Optional
SENTRY_DSN=...
SENDGRID_API_KEY=...
```

---

## Testing

### Test User
Firebase Auth test account:
- Email: `test@coverkeep.com`
- Password: `TestUser123!`

### Postman Collection
Create collection with example requests for each endpoint.

### Test Data
```json
{
  "products": [
    {
      "name": "iPhone 15 Pro",
      "brand": "Apple",
      "barcode": "0194253484516",
      "purchaseDate": "2024-01-15",
      "warrantyEndDate": "2025-01-15"
    },
    {
      "name": "Samsung Galaxy S24",
      "brand": "Samsung",
      "barcode": "8806095299358",
      "purchaseDate": "2024-02-01",
      "warrantyEndDate": "2025-02-01"
    }
  ]
}
```

---

## Mobile App Code References

### API Client
- Location: `src/services/api.ts` and `src/api/client.ts`
- Axios instance with interceptors
- Auto-adds Firebase token to requests

### Product API Calls
- Location: `src/api/products.ts`
- TypeScript interfaces for all endpoints
- Example usage in screens

### State Management
- Location: `src/stores/productStore.ts`
- Zustand store for product data
- Handles caching and optimistic updates

---

## Week 2 Timeline

**Backend Developer Tasks**:
1. **Day 1-2**: Setup Node.js/Express server, Firebase Admin SDK
2. **Day 3-4**: Implement product CRUD endpoints
3. **Day 4-5**: Barcode lookup integration
4. **Day 6-7**: AI warranty extraction (OpenAI)

**Integration Testing**:
- Day 7: Mobile app connects to backend
- Test all endpoints with actual mobile app

---

## Questions?

**Frontend Lead**: KP3 (kp3ventures@gmail.com)  
**Repository**: https://github.com/kp3ventures/coverkeep-frontend  
**Documentation**: README.md, TESTING.md, this file  

**Slack Channel**: #coverkeep-dev  
**Stand-ups**: Daily at 10:00 AM PST  

---

**Status**: 🟢 Frontend ready for backend integration  
**Next Milestone**: Week 2 - API Integration Complete  
**Target**: Fully functional app with backend by Feb 24, 2025
