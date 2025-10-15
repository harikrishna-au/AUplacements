# 🔧 Backend - AU Placements Portal# Backend API



Node.js + Express + MongoDB backend API server for the AU Placements Portal.Express.js backend server for the application.



---## Quick Start



## 📚 Table of Contents```bash

# Install dependencies (already done)

- [Architecture](#architecture)npm install

- [Tech Stack](#tech-stack)

- [Directory Structure](#directory-structure)# Start development server with auto-reload

- [Setup & Installation](#setup--installation)npm run dev

- [Environment Variables](#environment-variables)

- [Database Models](#database-models)# Start production server

- [API Endpoints](#api-endpoints)npm start

- [Authentication](#authentication)```

- [Seeding Data](#seeding-data)

- [Development](#development)## API Endpoints



---- `GET /` - Welcome message

- `GET /api/health` - Health check

## 🏗️ Architecture- `GET /api/data` - Get sample data

- `POST /api/data` - Send data to server

The backend follows a **modular MVC architecture**:

## Environment Variables

```

Client Request → Routes → Middleware (Auth) → Controller Logic → Models → MongoDBCreate a `.env` file:

```

```

**Key Features:**PORT=5000

- RESTful API designNODE_ENV=development

- JWT-based authentication```

- MongoDB for data persistence

- Email service integration## Tech Stack

- Request logging

- Error handling- Express.js - Web framework

- CORS - Cross-origin resource sharing

---- dotenv - Environment variables

- nodemon - Auto-reload during development

## 🛠️ Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | v18+ | Runtime environment |
| Express.js | v5.1.0 | Web framework |
| MongoDB | v8.19.1 | Database |
| Mongoose | v8.19.1 | ODM for MongoDB |
| JWT | v9.0.2 | Authentication |
| Nodemailer | v7.0.9 | Email service |
| CORS | v2.8.5 | Cross-origin requests |
| dotenv | v17.2.3 | Environment config |
| XLSX | v0.18.5 | Excel file parsing |

---

## 📁 Directory Structure

```
backend/
├── config/
│   └── database.js              # MongoDB connection setup
│
├── middleware/
│   └── auth.js                  # JWT authentication middleware
│
├── models/                      # Mongoose schemas
│   ├── Student.js               # Student/User model
│   ├── Company.js               # Company information
│   ├── StudentApplication.js    # Application tracking
│   ├── CompanyResource.js       # Study materials
│   ├── DiscussionMessage.js     # Forum messages
│   ├── PlacementEvent.js        # Calendar events
│   ├── SupportTicket.js         # Support tickets
│   └── MagicLink.js             # Auth tokens
│
├── routes/                      # API route handlers
│   ├── auth.js                  # Authentication routes
│   ├── students.js              # Student profile routes
│   ├── applications.js          # Application & company routes
│   ├── resources.js             # Resource management
│   ├── discussions.js           # Forum/discussion routes
│   ├── events.js                # Calendar event routes
│   └── support.js               # Support ticket routes
│
├── scripts/                     # Utility scripts
│   ├── seedCompanies.js         # Seed companies data
│   └── seedEvents.js            # Seed events data
│
├── services/
│   └── emailService.js          # Nodemailer configuration
│
├── utils/                       # Utility functions
│
├── data/                        # Static data files
│
├── server.js                    # Express server entry point
├── .env                         # Environment variables
├── .gitignore                   # Git ignore rules
├── package.json                 # Dependencies
└── README.md                    # This file
```

---

## 🚀 Setup & Installation

### Prerequisites
- Node.js v18 or higher
- MongoDB installed and running locally or MongoDB Atlas account
- Gmail account with App Password enabled

### Installation Steps

1. **Install Dependencies**
   ```bash
   cd backend
   npm install
   ```

2. **Configure Environment Variables**
   ```bash
   cp .env.example .env
   # Edit .env file with your configuration
   ```

3. **Start MongoDB**
   ```bash
   # If using local MongoDB
   mongod
   
   # Or connect to MongoDB Atlas (configure MONGODB_URI in .env)
   ```

4. **Seed Database (Optional)**
   ```bash
   # Seed companies
   node scripts/seedCompanies.js
   
   # Seed events
   node scripts/seedEvents.js
   ```

5. **Start Server**
   ```bash
   # Production mode
   npm start
   
   # Development mode (with auto-reload)
   npm run dev
   ```

Server will start on `http://localhost:3001`

---

## 🔐 Environment Variables

Create a `.env` file in the backend directory:

```env
# Server Configuration
PORT=3001
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/auplacements

# JWT Secret (change in production!)
JWT_SECRET=your-super-secret-key-change-this-in-production

# Email Service (Gmail)
# Use Gmail App Password (not regular password)
# Get it from: https://myaccount.google.com/apppasswords
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-gmail-app-password

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173
```

### Getting Gmail App Password
1. Enable 2FA on your Gmail account
2. Go to https://myaccount.google.com/apppasswords
3. Generate app password for "Mail"
4. Use this password in `EMAIL_PASSWORD`

---

## 🗄️ Database Models

### 1. Student
Stores student information and authentication.

```javascript
{
  universityRegisterNumber: String (unique),
  fullName: String,
  collegeEmail: String (unique),
  course: String,
  branch: String,
  currentSemester: Number,
  collegeName: String,
  phoneNumber: String,
  personalEmail: String,
  dateOfBirth: Date,
  gender: String,
  address: Object,
  academicDetails: Object,
  resumeUrl: String
}
```

### 2. Company
Company information and recruitment stages.

```javascript
{
  name: String (unique),
  logo: String,
  description: String,
  industry: String,
  website: String,
  rolesOffered: [String],
  eligibilityCriteria: Object,
  recruitmentStages: [Object],
  stats: Object,
  isActive: Boolean
}
```

### 3. StudentApplication
Tracks student applications to companies.

```javascript
{
  studentId: ObjectId (ref: Student),
  companyId: ObjectId (ref: Company),
  appliedDate: Date,
  currentStage: Number,
  status: String (pending/shortlisted/rejected/selected),
  stageHistory: [Object],
  notes: String
}
```

### 4. CompanyResource
Study materials and resources.

```javascript
{
  companyId: ObjectId (ref: Company),
  title: String,
  description: String,
  resourceType: String (PDF/video/link),
  category: String,
  fileUrl: String,
  fileName: String,
  fileSize: Number,
  externalUrl: String,
  uploadedBy: ObjectId (ref: Student),
  downloads: Number,
  views: Number,
  rating: Object,
  status: String (pending/approved/rejected)
}
```

### 5. DiscussionMessage
Forum messages for company channels.

```javascript
{
  companyId: ObjectId (ref: Company),
  channelType: String,
  channelName: String,
  studentId: ObjectId (ref: Student),
  message: String,
  timestamp: Date,
  edited: Boolean,
  reactions: [Object]
}
```

### 6. PlacementEvent
Calendar events for placement activities.

```javascript
{
  title: String,
  type: String (pre-placement/test/interview/drive/result),
  description: String,
  companyId: ObjectId (ref: Company),
  startDate: Date,
  endDate: Date,
  location: String,
  mode: String (online/offline/hybrid),
  registeredStudents: [ObjectId],
  maxCapacity: Number,
  eligibility: Object
}
```

### 7. SupportTicket
Support and feedback system.

```javascript
{
  studentId: ObjectId (ref: Student),
  ticketNumber: String (auto-generated),
  type: String (feedback/bug/feature/help),
  category: String,
  subject: String,
  message: String,
  priority: String (low/medium/high/urgent),
  status: String (pending/in-progress/resolved/closed),
  rating: Number,
  response: Object,
  attachments: [Object]
}
```

### 8. MagicLink
Temporary tokens for passwordless authentication.

```javascript
{
  email: String,
  token: String (unique),
  expiresAt: Date,
  used: Boolean
}
```

---

## 🛣️ API Endpoints

### Authentication (`/api/auth`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/send-magic-link` | Send login email | No |
| GET | `/verify/:token` | Verify magic link | No |
| GET | `/me` | Get current user | Yes |
| POST | `/logout` | Logout user | Yes |

### Students (`/api/students`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/profile` | Get student profile | Yes |
| PUT | `/profile` | Update profile | Yes |
| POST | `/resume` | Upload resume | Yes |

### Applications & Companies (`/api/applications`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/companies` | Get all companies | Yes |
| GET | `/companies/:id` | Get company details | Yes |
| GET | `/my-applications` | Get my applications | Yes |
| POST | `/apply` | Apply to company | Yes |
| GET | `/my-stats` | Get statistics | Yes |
| PUT | `/:id/stage` | Update stage | Yes |
| POST | `/:id/notes` | Add notes | Yes |
| DELETE | `/:id` | Withdraw application | Yes |

### Resources (`/api/resources`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/company/:companyId` | Get company resources | Yes |
| GET | `/all` | Get all resources | Yes |
| POST | `/contribute` | Contribute resource | Yes |
| POST | `/:id/download` | Track download | Yes |
| POST | `/:id/view` | Track view | Yes |
| POST | `/:id/rate` | Rate resource | Yes |
| GET | `/my-contributions` | Get my contributions | Yes |

### Discussions (`/api/discussions`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/my-forums` | Get available forums | Yes |
| GET | `/channel/:companyId/:channelName` | Get messages | Yes |
| POST | `/send` | Send message | Yes |
| PUT | `/:id` | Edit message | Yes |
| DELETE | `/:id` | Delete message | Yes |
| POST | `/:id/react` | React to message | Yes |
| GET | `/channels/:companyId` | Get channels | Yes |

### Events (`/api/events`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/` | Get all events | Yes |
| GET | `/my-events` | Get my events | Yes |
| POST | `/:id/register` | Register for event | Yes |
| PUT | `/:id/attendance` | Update attendance | Yes |
| GET | `/:id` | Get event details | Yes |

### Support (`/api/support`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/my-tickets` | Get my tickets | Yes |
| GET | `/tickets/:id` | Get ticket details | Yes |
| POST | `/create` | Create ticket | Yes |
| PATCH | `/tickets/:id/status` | Update status | Yes |
| POST | `/tickets/:id/response` | Add response | Yes |
| GET | `/stats` | Get statistics | Yes |
| DELETE | `/tickets/:id` | Delete ticket | Yes |

---

## 🔐 Authentication

### JWT Authentication Flow

1. **Login Request**
   - Student enters email
   - Server generates magic link token
   - Token stored in database with expiry
   - Email sent with magic link

2. **Token Verification**
   - Student clicks magic link
   - Server verifies token validity
   - JWT token generated (7-day expiry)
   - JWT returned to frontend

3. **Protected Routes**
   - Frontend sends JWT in Authorization header
   - Middleware validates JWT
   - User info extracted from token
   - Request proceeds if valid

### Middleware Usage

```javascript
const { authenticateToken } = require('../middleware/auth');

router.get('/protected-route', authenticateToken, async (req, res) => {
  // req.user contains studentId, email, etc.
  const userId = req.user.studentId;
  // ... handle request
});
```

### Token Structure

```javascript
{
  studentId: "507f1f77bcf86cd799439011",
  email: "student@university.edu.in",
  name: "Student Name",
  iat: 1634567890,
  exp: 1635172690  // 7 days later
}
```

---

## 🌱 Seeding Data

### Seed Companies

```bash
node scripts/seedCompanies.js
```

Seeds 10 companies:
- TCS, Infosys, Wipro, Google, Microsoft
- Amazon, Cognizant, Accenture, IBM, Capgemini

Each company includes:
- Name, logo, description
- Industry, roles offered
- Eligibility criteria
- Recruitment stages
- Statistics

### Seed Events

```bash
node scripts/seedEvents.js
```

Seeds 15 placement events:
- Pre-placement talks
- Aptitude tests
- Technical interviews
- HR rounds
- Group discussions
- Campus drives
- Result announcements

Date range: October 16 - November 5, 2025

---

## 🛠️ Development

### Run in Development Mode

```bash
npm run dev
```

Uses `nodemon` for auto-reload on file changes.

### Debug Mode

```bash
NODE_ENV=development npm start
```

Enables detailed logging.

### Testing Endpoints

Use tools like:
- Postman
- Thunder Client (VS Code extension)
- cURL

Example cURL request:
```bash
# Send magic link
curl -X POST http://localhost:3001/api/auth/send-magic-link \
  -H "Content-Type: application/json" \
  -d '{"email":"student@university.edu.in"}'

# Get profile (with JWT)
curl http://localhost:3001/api/students/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## 📊 Monitoring

### Request Logging

All requests are logged to console:
```
📨 POST /api/auth/send-magic-link
📨 GET /api/students/profile
```

### Database Connection

On successful connection:
```
✅ MongoDB Connected: localhost
```

### Email Service

On startup:
```
✅ Email service is ready
```

---

## 🐛 Error Handling

### Global Error Handler

All errors are caught and returned in consistent format:

```javascript
{
  "error": "Error message",
  "message": "Detailed description"
}
```

### Common Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 404 | Not Found |
| 500 | Server Error |

---

## 🔒 Security Best Practices

1. **Environment Variables**
   - Never commit `.env` file
   - Use strong JWT secret in production
   - Rotate secrets regularly

2. **Password Security**
   - Use Gmail App Passwords only
   - Never store passwords in code

3. **JWT Tokens**
   - 7-day expiry
   - Secure secret key
   - Verify on every protected route

4. **CORS Configuration**
   - Allow only trusted origins in production
   - Currently allows all (`*`) for development

5. **Input Validation**
   - Validate all user inputs
   - Sanitize data before database operations

---

## 📝 Scripts

Add these to `package.json`:

```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "seed-companies": "node scripts/seedCompanies.js",
    "seed-events": "node scripts/seedEvents.js",
    "seed-all": "npm run seed-companies && npm run seed-events"
  }
}
```

---

## 🚀 Production Deployment

### Pre-deployment Checklist

- [ ] Update `JWT_SECRET` to secure random string
- [ ] Set `NODE_ENV=production`
- [ ] Configure production MongoDB URI
- [ ] Update `FRONTEND_URL` to production domain
- [ ] Set up proper CORS origins
- [ ] Enable rate limiting
- [ ] Set up logging service (e.g., Winston)
- [ ] Configure monitoring (e.g., PM2)

### Deployment Steps

1. **Deploy to Platform** (Heroku, Railway, Render, etc.)
2. **Set Environment Variables** on platform
3. **Connect to MongoDB Atlas** or managed MongoDB
4. **Run migrations/seeds** if needed
5. **Test API endpoints**
6. **Monitor logs** for errors

---

## 📞 Support

For backend issues:
- Check MongoDB connection
- Verify environment variables
- Review server logs
- Test API endpoints individually

---

**Backend maintained by AU Placements Development Team**
