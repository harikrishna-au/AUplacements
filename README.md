# 🎓 AU Placements Portal

A comprehensive placement management system for Andhra University students to track companies, manage applications, access resources, and stay updated with placement events.

## 🌟 Features

### For Students
- **📧 Magic Link Authentication** - Secure passwordless login using email
- **👤 Profile Management** - View and manage student profile
- **🏢 Company Pipeline** - Track application status with companies
- **📅 Placement Calendar** - View placement events, interviews, and deadlines
- **💬 Discussion Forums** - Company-specific channels for peer discussions
- **📚 Resource Library** - Access study materials, interview guides, and prep resources
- **🎫 Support System** - Submit feedback, report bugs, and get help

### Key Highlights
- ✅ **No Mock Data** - All data comes from MongoDB database
- ✅ **Real-time Updates** - Live application status tracking
- ✅ **User-specific Content** - Personalized pipeline and resources
- ✅ **Secure Authentication** - JWT-based with 7-day sessions
- ✅ **Responsive Design** - Works on desktop and mobile devices

---

## 🏗️ Tech Stack

### Backend
- **Runtime:** Node.js v18+
- **Framework:** Express.js v5.1.0
- **Database:** MongoDB v8.19.1
- **Authentication:** JWT (jsonwebtoken v9.0.2)
- **Email Service:** Nodemailer v7.0.9
- **CORS:** cors v2.8.5

### Frontend
- **Framework:** React v19.1.1
- **Build Tool:** Vite v7.1.7
- **Routing:** React Router DOM v7.9.4
- **Styling:** TailwindCSS v3.4.18
- **HTTP Client:** Axios v1.12.2
- **UI Components:** shadcn/ui, Radix UI
- **Icons:** Lucide React v0.545.0
- **Calendar:** React Big Calendar v1.19.4

---

## 📁 Project Structure

```
AUplacements/
├── backend/                    # Backend API server
│   ├── config/                # Database configuration
│   ├── middleware/            # Authentication middleware
│   ├── models/                # MongoDB schemas (8 models)
│   ├── routes/                # API route handlers (7 routes)
│   ├── scripts/               # Database seeding scripts
│   ├── services/              # Email and other services
│   ├── utils/                 # Utility functions
│   ├── server.js              # Express server entry point
│   ├── .env                   # Environment variables
│   └── package.json           # Backend dependencies
│
└── frontend/                   # React frontend
    ├── public/                # Static assets
    ├── src/
    │   ├── assets/            # Images, fonts
    │   ├── components/        # Reusable UI components
    │   │   ├── ui/            # shadcn/ui components
    │   │   └── ProtectedRoute.jsx
    │   ├── context/           # React context (Auth)
    │   ├── pages/             # Page components (10 pages)
    │   ├── services/          # API service layer
    │   ├── lib/               # Utility functions
    │   ├── App.jsx            # Main app component
    │   └── main.jsx           # React entry point
    ├── .env                   # Environment variables
    ├── vite.config.js         # Vite configuration
    ├── tailwind.config.js     # Tailwind configuration
    └── package.json           # Frontend dependencies
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js v18 or higher
- MongoDB installed and running
- Gmail account (for email service)

### 1. Clone the Repository
```bash
git clone <repository-url>
cd AUplacements
```

### 2. Setup Backend
```bash
cd backend
npm install

# Configure environment variables
cp .env.example .env
# Edit .env with your configuration:
# - PORT=3001
# - MONGODB_URI=mongodb://localhost:27017/auplacements
# - JWT_SECRET=your-secret-key
# - EMAIL_USER=your-gmail@gmail.com
# - EMAIL_PASSWORD=your-gmail-app-password

# Seed the database
npm run seed-companies
npm run seed-events

# Start the backend server
npm start
# Backend runs on http://localhost:3001
```

### 3. Setup Frontend
```bash
cd ../frontend
npm install

# Configure environment variables
cp .env.example .env
# Edit .env with:
# VITE_API_URL=http://localhost:3001/api

# Start the frontend development server
npm run dev
# Frontend runs on http://localhost:5173
```

### 4. Access the Application
Open your browser and navigate to:
```
http://localhost:5173
```

---

## 📚 API Endpoints

### Authentication (`/api/auth`)
- `POST /send-magic-link` - Send login magic link
- `GET /verify/:token` - Verify magic link token
- `GET /me` - Get current user

### Students (`/api/students`)
- `GET /profile` - Get student profile
- `PUT /profile` - Update profile
- `POST /resume` - Upload resume

### Applications (`/api/applications`)
- `GET /companies` - Get all companies
- `GET /companies/:id` - Get company details
- `GET /my-applications` - Get student's applications
- `POST /apply` - Apply to a company
- `GET /my-stats` - Get application statistics

### Resources (`/api/resources`)
- `GET /company/:companyId` - Get company resources
- `GET /all` - Get all resources
- `POST /contribute` - Contribute a resource
- `POST /:id/download` - Track download
- `POST /:id/rate` - Rate a resource

### Discussions (`/api/discussions`)
- `GET /my-forums` - Get available forums
- `GET /channel/:companyId/:channelName` - Get messages
- `POST /send` - Send message
- `PUT /:id` - Edit message
- `DELETE /:id` - Delete message

### Events (`/api/events`)
- `GET /my-events` - Get student's events
- `POST /:id/register` - Register for event
- `GET /:id` - Get event details

### Support (`/api/support`)
- `GET /my-tickets` - Get user's tickets
- `POST /create` - Create new ticket
- `GET /stats` - Get ticket statistics
- `PATCH /tickets/:id/status` - Update ticket status

---

## 🗄️ Database Models

1. **Student** - User accounts and profiles
2. **Company** - Company information and recruitment details
3. **StudentApplication** - Application tracking
4. **CompanyResource** - Study materials and resources
5. **DiscussionMessage** - Forum messages
6. **PlacementEvent** - Calendar events
7. **SupportTicket** - Support/feedback system
8. **MagicLink** - Authentication tokens

---

## 🔐 Authentication Flow

1. Student enters email on login page
2. System sends magic link to email
3. Student clicks link in email
4. Token is verified and JWT is issued
5. JWT stored in localStorage
6. JWT sent with every API request
7. Session expires after 7 days

---

## 🎨 Pages & Routes

| Route | Page | Description |
|-------|------|-------------|
| `/login` | LoginPage | Email login with magic link |
| `/auth/verify` | VerifyPage | Token verification |
| `/dashboard` | DashboardPage | User dashboard |
| `/profile` | ProfilePage | Student profile |
| `/calendar` | PlacementsCalendar | Placement events calendar |
| `/pipeline` | CompanyPipeline | Application tracking |
| `/companies` | CompanyListPage | Browse companies |
| `/forum` | DiscussionForum | Discussion forums |
| `/resources` | ResourcesPage | Study resources |
| `/support` | FeedbackSupport | Support & feedback |

---

## 🛠️ Development

### Backend Development
```bash
cd backend

# Run with auto-reload
npm run dev

# Seed database
npm run seed-companies
npm run seed-events
```

### Frontend Development
```bash
cd frontend

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

---

## 📦 Deployment

### Backend Deployment
1. Set environment variables in production
2. Update `MONGODB_URI` to production MongoDB
3. Change `JWT_SECRET` to secure random string
4. Configure production email service
5. Set `NODE_ENV=production`
6. Deploy to cloud platform (Heroku, Railway, etc.)

### Frontend Deployment
1. Update `VITE_API_URL` to production backend URL
2. Build the application: `npm run build`
3. Deploy `dist` folder to static hosting (Vercel, Netlify, etc.)

---

## 🔧 Environment Variables

### Backend (.env)
```env
PORT=3001
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/auplacements
JWT_SECRET=your-super-secret-key
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-gmail-app-password
FRONTEND_URL=http://localhost:5173
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:3001/api
```

---

## 📝 Key Features Implementation

### ✅ Real Data Only
- All pages fetch from MongoDB
- No hardcoded/mock data
- Dynamic content based on user

### ✅ User-Specific Experience
- Personalized pipeline
- User's own tickets
- Applied companies only in resources
- Custom event list

### ✅ Security
- JWT authentication
- Protected routes
- Token expiry (7 days)
- Secure password reset

### ✅ Performance
- Optimistic UI updates
- Loading states
- Error handling
- Auto-refresh on auth errors

---

## 🐛 Troubleshooting

### Backend won't start
- Check MongoDB is running: `mongosh`
- Verify .env file exists and is configured
- Check port 3001 is available

### Frontend can't connect to backend
- Verify backend is running on port 3001
- Check VITE_API_URL in frontend/.env
- Ensure CORS is configured correctly

### Email not sending
- Use Gmail App Password, not regular password
- Enable 2FA on Gmail account
- Generate app password: https://myaccount.google.com/apppasswords

### Database issues
- Check MongoDB connection string
- Verify database name is correct
- Run seed scripts if tables are empty

---

## 📄 License

This project is licensed under the ISC License.

---

## 👥 Contributors

- Development Team - Andhra University

---

## 📞 Support

For issues or questions:
- Submit a ticket in the Support page
- Email: placements@andhrauniversity.edu.in
- Phone: +91 891 234 5678

---

## 🎯 Future Enhancements

- [ ] Admin dashboard for placement cell
- [ ] Bulk email notifications
- [ ] PDF report generation
- [ ] Mobile application
- [ ] Resume parsing with AI
- [ ] Video interview scheduling
- [ ] Analytics dashboard
- [ ] Company portal

---

**Built with ❤️ for Andhra University Students**
