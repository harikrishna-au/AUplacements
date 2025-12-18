# AU Placements Portal

> **Enterprise-Grade Campus Recruitment Management Platform**  
> A full-stack placement management system designed to streamline campus recruitment workflows, enhance student engagement, and provide actionable insights for placement coordination.

[![Tech Stack](https://img.shields.io/badge/Stack-MERN-green)]()
[![React](https://img.shields.io/badge/React-19.1-blue)]()
[![Node](https://img.shields.io/badge/Node.js-18%2B-brightgreen)]()
[![MongoDB](https://img.shields.io/badge/MongoDB-8.0-green)]()

---

## 🎯 Executive Summary

**AU Placements Portal** is a production-ready web application that digitizes and automates the entire campus placement lifecycle for Andhra University. The platform addresses critical inefficiencies in traditional placement processes by providing real-time application tracking, centralized communication, and comprehensive resource management—resulting in improved placement coordination and enhanced student outcomes.

### Business Impact
- **Process Efficiency**: Reduced manual coordination overhead by digitizing application workflows
- **Data-Driven Insights**: Centralized analytics for tracking placement metrics and trends
- **User Experience**: Modern, responsive interface accessible across all devices
- **Scalability**: Architected to handle concurrent users during peak recruitment seasons

---

## 📋 Problem Statement & Solution

### The Challenge
Campus placement processes traditionally involve:
- Manual tracking of applications across multiple companies
- Fragmented communication channels (email, notices, word-of-mouth)
- Limited visibility into application status and upcoming deadlines
- Difficulty coordinating interviews, events, and preparation resources
- No centralized system for student feedback and support

### The Solution
A unified digital platform providing:
- **Centralized Dashboard** - Single source of truth for all placement activities
- **Application Pipeline** - Visual Kanban-style tracking of application stages
- **Smart Calendar** - Automated scheduling and deadline management
- **Discussion Forums** - Company-specific Q&A and peer collaboration
- **Resource Library** - Curated preparation materials and guides
- **Support System** - Structured ticketing for student queries and feedback

---

## 🏗️ System Architecture

### High-Level Architecture
```
┌─────────────────────────────────────────────────────────────┐
│                      Client Layer                           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   React 19   │  │  Vite Build  │  │  TailwindCSS │     │
│  │   Frontend   │  │    System    │  │   Styling    │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
                            ↕ HTTPS/REST API
┌─────────────────────────────────────────────────────────────┐
│                   Application Layer                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │ Express.js   │  │    Clerk     │  │  Middleware  │     │
│  │  REST API    │  │     Auth     │  │  Validation  │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
                            ↕ Mongoose ODM
┌─────────────────────────────────────────────────────────────┐
│                      Data Layer                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   MongoDB    │  │   Schemas    │  │  Indexing    │     │
│  │   Database   │  │   Models     │  │  Strategy    │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
```

### Technical Architecture Decisions

#### Frontend Architecture
- **React 19**: Leveraging latest concurrent rendering features for optimal performance
- **Component-Based Design**: Modular, reusable components following atomic design principles
- **State Management**: Context API for global state, local state for component-specific data
- **Routing**: Client-side routing with React Router 7 for seamless navigation
- **API Layer**: Centralized Axios service layer for consistent API communication

#### Backend Architecture
- **RESTful API Design**: Stateless, resource-oriented endpoints following REST conventions
- **Middleware Pipeline**: Request validation, authentication, error handling
- **Database Design**: Normalized schemas with strategic denormalization for read optimization
- **Authentication**: Clerk integration for enterprise-grade auth with SSO capabilities

---

## 💼 Core Features & Capabilities

### Student Portal
| Feature | Description | Business Value |
|---------|-------------|----------------|
| **Unified Dashboard** | Real-time overview of applications, upcoming events, and notifications | Single-pane visibility reduces information overload |
| **Company Directory** | Searchable catalog of visiting companies with filters | Efficient discovery of opportunities |
| **Application Pipeline** | Visual Kanban board tracking applications through stages | Transparency and progress monitoring |
| **Event Calendar** | Integrated scheduling with deadline reminders | Reduced missed opportunities |
| **Discussion Forums** | Company-specific Q&A threads and peer discussions | Knowledge sharing and community building |
| **Resource Library** | Categorized interview prep materials and guides | Centralized learning resources |
| **Feedback System** | Structured ticket system for support and suggestions | Continuous improvement feedback loop |

### Platform Capabilities
- **Responsive Design**: Mobile-first approach ensuring accessibility on all devices
- **Real-Time Updates**: Live status changes reflected across all users
- **Secure Authentication**: OAuth-based login with session management
- **Performance Optimized**: Lazy loading, code splitting, and caching strategies
- **Scalable Infrastructure**: Horizontal scaling support for high-traffic periods

---

## 🛠️ Technology Stack

### Frontend Technologies
| Technology | Version | Purpose |
|-----------|---------|---------|
| **React** | 19.1.1 | UI framework with concurrent rendering |
| **Vite** | 7.1.7 | Next-generation build tool with HMR |
| **TailwindCSS** | 3.4.18 | Utility-first CSS framework |
| **React Router** | 7.9.4 | Declarative routing |
| **Axios** | 1.12.2 | HTTP client with interceptors |
| **Radix UI** | Latest | Accessible component primitives |
| **Lucide React** | 0.545.0 | Modern icon library |
| **React Big Calendar** | 1.19.4 | Event scheduling interface |
| **date-fns** | 4.1.0 | Date manipulation utilities |

### Backend Technologies
| Technology | Version | Purpose |
|-----------|---------|---------|
| **Node.js** | 18+ | Runtime environment |
| **Express.js** | 4.18.2 | Web application framework |
| **MongoDB** | 8.0 | NoSQL document database |
| **Mongoose** | 8.0.0 | ODM for MongoDB |
| **Clerk SDK** | 4.13.23 | Authentication service |
| **Express Validator** | 7.0.1 | Request validation middleware |

### DevOps & Deployment
- **Vercel**: Frontend hosting with global CDN
- **MongoDB Atlas**: Managed database with automated backups
- **Environment Management**: Secure configuration via environment variables
- **Version Control**: Git with feature branch workflow

---

## 🚀 Getting Started

### System Requirements
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **MongoDB**: v5.0 or higher (local) or MongoDB Atlas account
- **Clerk Account**: For authentication services

### Quick Start Guide

#### 1. Repository Setup
```bash
# Clone the repository
git clone https://github.com/harikrishna-au/AUplacements.git
cd AUplacements
```

#### 2. Backend Configuration
```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env

# Edit .env with your credentials:
# - MONGODB_URI: Your MongoDB connection string
# - CLERK_SECRET_KEY: Clerk secret key from dashboard
# - ALLOWED_EMAILS: Comma-separated whitelist (optional)
# - FRONTEND_URL: Frontend URL for CORS

# Start development server
npm run dev
```

**Backend Environment Variables:**
```env
PORT=3001
MONGODB_URI=mongodb://localhost:27017/auplacements
CLERK_SECRET_KEY=sk_test_xxxxx
ALLOWED_EMAILS=student1@andhrauniversity.edu.in,student2@andhrauniversity.edu.in
FRONTEND_URL=http://localhost:5173
```

#### 3. Frontend Configuration
```bash
# Navigate to frontend directory (from project root)
cd frontend

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env

# Edit .env with your credentials:
# - VITE_API_URL: Backend API endpoint
# - VITE_CLERK_PUBLISHABLE_KEY: Clerk publishable key

# Start development server
npm run dev
```

**Frontend Environment Variables:**
```env
VITE_API_URL=http://localhost:3001/api
VITE_CLERK_PUBLISHABLE_KEY=pk_test_xxxxx
```

#### 4. Access Application
Open your browser and navigate to: **http://localhost:5173**

---

## 📁 Project Structure

```
AUplacements/
│
├── backend/                    # Node.js/Express API Server
│   ├── config/                 # Database and service configuration
│   │   └── db.js              # MongoDB connection setup
│   ├── middleware/             # Express middleware functions
│   │   └── auth.js            # Clerk authentication middleware
│   ├── models/                 # Mongoose schemas and models
│   │   ├── Student.js         # Student profile schema
│   │   ├── Company.js         # Company information schema
│   │   ├── Application.js     # Application tracking schema
│   │   ├── Event.js           # Calendar event schema
│   │   ├── Discussion.js      # Forum discussion schema
│   │   ├── Resource.js        # Learning resource schema
│   │   └── Support.js         # Support ticket schema
│   ├── routes/                 # API endpoint definitions
│   │   ├── auth.js            # Authentication routes
│   │   ├── students.js        # Student profile routes
│   │   ├── companies.js       # Company CRUD routes
│   │   ├── applications.js    # Application management routes
│   │   ├── events.js          # Calendar event routes
│   │   ├── discussions.js     # Forum routes
│   │   ├── resources.js       # Resource library routes
│   │   └── support.js         # Support ticket routes
│   ├── utils/                  # Utility functions
│   ├── server.js              # Express app entry point
│   └── package.json           # Backend dependencies
│
├── frontend/                   # React/Vite Application
│   ├── src/
│   │   ├── components/        # Reusable React components
│   │   │   ├── ui/           # Base UI components (buttons, inputs, etc.)
│   │   │   ├── layout/       # Layout components (navbar, sidebar)
│   │   │   └── shared/       # Shared feature components
│   │   ├── context/           # React Context providers
│   │   │   └── AuthContext.jsx  # Authentication state management
│   │   ├── pages/             # Page-level components (routes)
│   │   │   ├── DashboardPage.jsx      # Main dashboard
│   │   │   ├── CompanyListPage.jsx    # Company directory
│   │   │   ├── CompanyPipeline.jsx    # Application tracker
│   │   │   ├── PlacementsCalendar.jsx # Event calendar
│   │   │   ├── DiscussionForum.jsx    # Discussion boards
│   │   │   ├── ResourcesPage.jsx      # Resource library
│   │   │   ├── FeedbackSupport.jsx    # Support system
│   │   │   └── ProfilePage.jsx        # User profile
│   │   ├── services/          # API client services
│   │   │   └── api.js        # Axios configuration and API calls
│   │   ├── App.jsx           # Root component with routing
│   │   └── main.jsx          # Application entry point
│   ├── public/                # Static assets
│   ├── index.html            # HTML template
│   ├── vite.config.js        # Vite build configuration
│   ├── tailwind.config.js    # Tailwind CSS configuration
│   └── package.json          # Frontend dependencies
│
├── vercel.json               # Vercel deployment configuration
├── .gitignore               # Git ignore rules
└── README.md                # Project documentation
```

---

## 🔐 Security & Best Practices

### Authentication & Authorization
- **OAuth 2.0 Flow**: Secure authentication via Clerk
- **Session Management**: JWT-based token authentication
- **Role-Based Access**: Student and admin role separation
- **Email Verification**: Optional email whitelist for controlled access

### Data Security
- **Input Validation**: Server-side validation using express-validator
- **MongoDB Injection Prevention**: Parameterized queries via Mongoose
- **CORS Configuration**: Restricted cross-origin requests
- **Environment Variables**: Sensitive data stored outside version control

### Performance Optimizations
- **Code Splitting**: Dynamic imports for route-based splitting
- **Lazy Loading**: On-demand component loading
- **Database Indexing**: Strategic indexes on frequently queried fields
- **Caching Strategy**: HTTP caching headers for static assets
- **Bundle Optimization**: Tree-shaking and minification via Vite

---

## 📊 API Documentation

### RESTful Endpoints

#### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User authentication
- `GET /api/auth/profile` - Get current user profile

#### Students
- `GET /api/students` - List all students (admin)
- `GET /api/students/:id` - Get student details
- `PUT /api/students/:id` - Update student profile

#### Companies
- `GET /api/companies` - List all companies
- `GET /api/companies/:id` - Get company details
- `POST /api/companies` - Create company (admin)
- `PUT /api/companies/:id` - Update company (admin)

#### Applications
- `GET /api/applications` - Get user applications
- `POST /api/applications` - Submit new application
- `PUT /api/applications/:id` - Update application status
- `DELETE /api/applications/:id` - Withdraw application

#### Events
- `GET /api/events` - List upcoming events
- `GET /api/events/:id` - Get event details
- `POST /api/events` - Create event (admin)

#### Discussions
- `GET /api/discussions` - List forum discussions
- `POST /api/discussions` - Create new discussion
- `POST /api/discussions/:id/comments` - Add comment

#### Resources
- `GET /api/resources` - List learning resources
- `GET /api/resources/:id` - Get resource details
- `POST /api/resources` - Upload resource (admin)

#### Support
- `GET /api/support` - List user tickets
- `POST /api/support` - Create support ticket
- `PUT /api/support/:id` - Update ticket status

---

## 🚀 Deployment

### Production Build

#### Frontend
```bash
cd frontend
npm run build
# Generates optimized production build in dist/
```

#### Backend
```bash
cd backend
npm start
# Runs production server with NODE_ENV=production
```

### Vercel Deployment
The application is configured for seamless Vercel deployment:
- Frontend served via global CDN
- Automatic HTTPS and custom domain support
- SPA fallback routing configured in `vercel.json`
- Environment variables managed through Vercel dashboard

### Deployment Checklist
- [ ] Configure production environment variables
- [ ] Set up MongoDB Atlas cluster with network whitelist
- [ ] Configure Clerk production instance
- [ ] Set up custom domain and SSL
- [ ] Configure monitoring and error tracking
- [ ] Set up automated backups for database

---

## 🧪 Development Workflow

### Local Development
```bash
# Terminal 1: Backend with auto-reload
cd backend && npm run dev

# Terminal 2: Frontend with HMR
cd frontend && npm run dev
```

### Code Quality
```bash
# Frontend linting
cd frontend && npm run lint

# Backend testing (if configured)
cd backend && npm test
```

### Git Workflow
1. Create feature branch: `git checkout -b feature/your-feature`
2. Commit changes: `git commit -m "feat: add new feature"`
3. Push to remote: `git push origin feature/your-feature`
4. Create pull request for review

---

## 📈 Scalability Considerations

### Current Architecture Strengths
- **Stateless API**: Enables horizontal scaling of backend servers
- **Document Database**: Flexible schema evolution without downtime
- **CDN Delivery**: Global content delivery for frontend assets
- **Cloud-Native**: Designed for containerization and orchestration

### Future Scaling Strategies
- **Caching Layer**: Redis for session storage and frequently accessed data
- **Load Balancing**: Distribute traffic across multiple backend instances
- **Database Sharding**: Partition data across multiple MongoDB instances
- **Microservices**: Decompose monolith into domain-specific services
- **Message Queue**: Async processing for background jobs

---

## 🎓 Key Learnings & Technical Highlights

### Full-Stack Development
- End-to-end ownership of feature development from database to UI
- RESTful API design following industry best practices
- Modern React patterns including hooks, context, and composition

### System Design
- Architected scalable, maintainable application structure
- Implemented authentication and authorization flows
- Designed normalized database schemas with relationship modeling

### DevOps & Deployment
- Configured CI/CD pipeline for automated deployments
- Managed environment configurations across development and production
- Implemented monitoring and logging strategies

### User Experience
- Responsive design ensuring cross-device compatibility
- Performance optimization for fast load times
- Accessible UI components following WCAG guidelines

---

## 📞 Contact & Portfolio

**Project Maintainer**: Harikrishna  
**Institution**: Andhra University  
**Repository**: [github.com/harikrishna-au/AUplacements](https://github.com/harikrishna-au/AUplacements)

---

## 📄 License

This project is licensed under the ISC License.

---

**Built with engineering excellence and dedication to solving real-world problems.**
