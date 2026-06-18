# AlphaGen Solutions - Backend API

REST API backend for the AlphaGen Solutions website, built with Node.js, Express, and MongoDB.

## 🚀 Features

- **Contact Form API**: Handle contact form submissions
- **Email Notifications**: Automatic email alerts for new inquiries
- **MongoDB Integration**: Store and manage contact data
- **Input Validation**: Comprehensive validation using express-validator
- **Rate Limiting**: Prevent spam and abuse
- **Security**: Helmet.js for security headers, CORS configuration
- **Error Handling**: Centralized error handling middleware
- **RESTful API**: Clean and consistent API design

## 📋 Prerequisites

- Node.js (v18+ recommended)
- MongoDB (local installation or MongoDB Atlas account)
- Gmail account (or other email service) for sending emails

## 🛠️ Installation

1. **Install dependencies:**
   ```bash
   cd backend
   npm install
   ```

2. **Configure environment variables:**
   ```bash
   cp .env.example .env
   ```

3. **Edit `.env` file with your configuration:**
   ```env
   PORT=5000
  FRONTEND_URLS=http://localhost:5173
   MONGODB_URI=mongodb://localhost:27017/alphagen
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   EMAIL_TO=info@alphagensolutions.com
   ```

### 📧 Setting up Gmail for Emails

1. Enable 2-factor authentication on your Google account
2. Generate an App Password:
   - Go to Google Account → Security → 2-Step Verification → App passwords
   - Create a new app password for "Mail"
   - Use this password in `EMAIL_PASS` environment variable

## 🚀 Running the Application

### Development Mode (with auto-restart):
```bash
npm run dev
```

### Production Mode:
```bash
npm start
```

The API will start on `http://localhost:5000`

## 📡 API Endpoints

### Health Check
```
GET /api/health
```
Returns API status, uptime, and service state (database/email).

### Readiness Check
```
GET /api/readiness
```
Returns `200` when at least one contact delivery path is available (database or email).
Returns `503` when both database and email are unavailable.

### Operational Status
```
GET /api/status
```
Returns Node runtime info, memory usage, uptime, and service state.

### Contact Form

#### Submit Contact Form
```
POST /api/contact
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "company": "Tech Corp",
  "message": "I'm interested in your services."
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Thank you for your message! We will get back to you soon.",
  "data": {
    "id": "60d5ec49f1b2c8b4f8e4b1a1",
    "name": "John Doe",
    "email": "john@example.com",
    "submittedAt": "2026-06-18T10:30:00.000Z"
  }
}
```

#### Get All Contacts (Admin)
```
GET /api/contact?status=new&page=1&limit=10
```

#### Get Single Contact
```
GET /api/contact/:id
```

#### Update Contact Status
```
PATCH /api/contact/:id/status
Content-Type: application/json

{
  "status": "read"
}
```
Status options: `new`, `read`, `responded`, `archived`

#### Delete Contact
```
DELETE /api/contact/:id
```

## 🔒 Security Features

- **Helmet.js**: Sets secure HTTP headers
- **CORS**: Configured to accept requests only from frontend
- **Rate Limiting**: 5 requests per 15 minutes per IP for contact endpoint
- **Input Validation**: All inputs are validated and sanitized
- **MongoDB Injection Prevention**: Mongoose schema validation

## 📊 Database Schema

### Contact Model
```javascript
{
  name: String (required, max 100 chars),
  email: String (required, valid email),
  company: String (optional, max 100 chars),
  message: String (required, 10-1000 chars),
  status: String (new|read|responded|archived),
  ipAddress: String,
  userAgent: String,
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

## 🐛 Error Handling

All errors return a consistent format:
```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    {
      "field": "email",
      "message": "Please provide a valid email address"
    }
  ]
}
```

## 📝 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| PORT | Server port | 5000 |
| NODE_ENV | Environment mode | development |
| FRONTEND_URLS | Frontend URL(s) for CORS (comma-separated) | http://localhost:5173 |
| MONGODB_URI | MongoDB connection string | mongodb://localhost:27017/alphagen |
| EMAIL_SERVICE | Email service provider | gmail |
| EMAIL_USER | Email account username | - |
| EMAIL_PASS | Email account password/app password | - |
| EMAIL_FROM | "From" email address | noreply@alphagensolutions.com |
| EMAIL_TO | Recipient email for form submissions | info@alphagensolutions.com |
| RATE_LIMIT_WINDOW_MS | Rate limit time window | 900000 (15 min) |
| RATE_LIMIT_MAX_REQUESTS | Max requests per window | 5 |

## 🧪 Testing the API

### Using curl:
```bash
curl -X POST http://localhost:5000/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "company": "Test Company",
    "message": "This is a test message."
  }'
```

### Using Postman or Thunder Client:
1. Import the collection or create a new request
2. Method: POST
3. URL: `http://localhost:5000/api/contact`
4. Headers: `Content-Type: application/json`
5. Body: Raw JSON with name, email, company, message

## 📦 Project Structure

```
backend/
├── config/
│   └── database.js          # MongoDB connection
├── middleware/
│   ├── validation.js        # Input validation rules
│   └── errorHandler.js      # Error handling middleware
├── models/
│   └── Contact.js           # Contact schema
├── routes/
│   └── contact.js           # Contact routes
├── utils/
│   └── emailService.js      # Email functionality
├── .env.example             # Environment template
├── .gitignore               # Git ignore rules
├── package.json             # Dependencies
├── server.js                # Main application
└── README.md                # This file
```

## 🚢 Deployment

### MongoDB Atlas Setup:
1. Create account at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Add database user
4. Whitelist IP (0.0.0.0/0 for all IPs)
5. Get connection string and update `MONGODB_URI`

### Deployment Platforms:
- **Heroku**: Add MongoDB Atlas and configure environment variables
- **Railway**: Connect GitHub repo, add environment variables
- **DigitalOcean**: Deploy as Node.js app
- **AWS/Azure**: Use their respective Node.js hosting services

## 📄 License

MIT License - See LICENSE file for details

## 👥 Support

For issues or questions:
- Email: info@alphagensolutions.com
- GitHub Issues: [Create an issue](https://github.com/alphagensolutions/website/issues)
