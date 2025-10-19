# AU Placements Backend

RESTful API server for the AU Placements Portal built with Node.js, Express, and MongoDB.

## 🚀 Tech Stack

- **Runtime:** Node.js v18+
- **Framework:** Express.js v5.1.0
- **Database:** MongoDB v8.19.1
- **Authentication:** JWT (jsonwebtoken v9.0.2)
- **Email:** Nodemailer v7.0.9
- **Security:** bcryptjs, cors

## 📁 Project Structure

```
backend/
├── config/
│   └── database.js          # MongoDB connection
├── middleware/
│   └── auth.js              # JWT authentication middleware
├── models/                  # Mongoose schemas
│   ├── Student.js
│   ├── Company.js
│   ├── StudentApplication.js
│   ├── CompanyResource.js
│   ├── DiscussionMessage.js
│   ├── PlacementEvent.js
│   ├── SupportTicket.js
│   └── MagicLink.js
├── routes/                  # API endpoints
│   ├── auth.js
│   ├── students.js
│   ├── applications.js
│   ├── resources.js
│   ├── discussions.js
│   ├── events.js
│   └── support.js
├── services/
│   └── emailService.js      # Email sending logic
├── scripts/
│   ├── seedCompanies.js     # Seed company data
│   └── seedEvents.js        # Seed event data
├── utils/
│   └── helpers.js           # Utility functions
├── server.js                # Express server entry
├── .env                     # Environment variables
└── package.json
```

## 🔧 Environment Variables

Create a `.env` file in the backend directory:

```env
PORT=3001
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/auplacements
JWT_SECRET=your-super-secret-jwt-key-change-this
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-gmail-app-password
FRONTEND_URL=http://localhost:5173
```

## 📦 Installation

```bash
cd backend
npm install
```

## 🗄️ Database Setup

1. **Start MongoDB:**
```bash
mongod
```

2. **Seed Database:**
```bash
npm run seed-companies
npm run seed-events
```

## 🏃 Running the Server

**Development:**
```bash
npm run dev
```

**Production:**
```bash
npm start
```

Server runs on `http://localhost:3001`

## 📡 API Endpoints

### Authentication
- `POST /api/auth/send-magic-link` - Send login email
- `GET /api/auth/verify/:token` - Verify magic link
- `GET /api/auth/me` - Get current user

### Students
- `GET /api/students/profile` - Get profile
- `PUT /api/students/profile` - Update profile
- `POST /api/students/resume` - Upload resume

### Applications
- `GET /api/applications/companies` - List companies
- `GET /api/applications/companies/:id` - Company details
- `GET /api/applications/my-applications` - User applications
- `POST /api/applications/apply` - Apply to company
- `GET /api/applications/my-stats` - Application stats

### Resources
- `GET /api/resources/company/:companyId` - Company resources
- `GET /api/resources/all` - All resources
- `POST /api/resources/contribute` - Add resource
- `POST /api/resources/:id/download` - Track download
- `POST /api/resources/:id/rate` - Rate resource

### Discussions
- `GET /api/discussions/my-forums` - Available forums
- `GET /api/discussions/channel/:companyId/:channelName` - Messages
- `POST /api/discussions/send` - Send message
- `PUT /api/discussions/:id` - Edit message
- `DELETE /api/discussions/:id` - Delete message

### Events
- `GET /api/events/my-events` - User events
- `POST /api/events/:id/register` - Register for event
- `GET /api/events/:id` - Event details

### Support
- `GET /api/support/my-tickets` - User tickets
- `POST /api/support/create` - Create ticket
- `GET /api/support/stats` - Ticket stats
- `PATCH /api/support/tickets/:id/status` - Update status

## 🔐 Authentication Flow

1. User enters email
2. Magic link sent to email
3. User clicks link with token
4. Token verified, JWT issued
5. JWT stored in client
6. JWT sent in Authorization header
7. Middleware validates JWT

## 🛠️ Scripts

```bash
npm start              # Start server
npm run dev            # Start with nodemon
npm run seed-companies # Seed company data
npm run seed-events    # Seed event data
```

## 📝 Notes

- JWT tokens expire after 7 days
- Magic links expire after 15 minutes
- Use Gmail App Password for email service
- CORS enabled for frontend URL
