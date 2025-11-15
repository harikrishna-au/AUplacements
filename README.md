# AU Placements Portal

A comprehensive placement management system built for Andhra University students to streamline the campus recruitment process.

## What is this?

This web application helps students manage their entire placement journey - from browsing companies to tracking applications, participating in discussions, and accessing preparation resources. Built with modern web technologies, it provides a smooth experience across desktop and mobile devices.

## Core Features

**For Students:**
- Browse and apply to companies visiting campus
- Track application status through different stages
- View placement calendar with upcoming events and deadlines
- Join company-specific discussion forums
- Access interview preparation resources
- Submit feedback and get support

**Platform Highlights:**
- Clean, intuitive interface built with React
- Real-time application status updates
- Mobile-responsive design
- Secure authentication with Clerk
- Fast performance with optimized database queries

## Tech Stack

### Frontend
- **React 19** - Modern UI framework
- **Vite** - Fast build tooling
- **TailwindCSS** - Utility-first styling
- **React Router** - Client-side routing
- **Axios** - HTTP requests

### Backend
- **Node.js & Express** - REST API server
- **MongoDB** - Document database
- **Mongoose** - MongoDB object modeling
- **Clerk** - Authentication & user management

## Getting Started

### Prerequisites
- Node.js 18 or higher
- MongoDB (local or Atlas)
- Clerk account for authentication

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/harikrishna-au/AUplacements.git
cd AUplacements
```

2. **Setup Backend**
```bash
cd backend
npm install

# Create .env file
cp .env.example .env
# Edit .env with your MongoDB URI and Clerk credentials

# Start backend
npm start
```

3. **Setup Frontend**
```bash
cd frontend
npm install

# Create .env file
cp .env.example .env
# Add your backend API URL and Clerk publishable key

# Start frontend
npm run dev
```

4. **Access the Application**

Open http://localhost:5173 in your browser

## Project Structure

```
AUplacements/
├── backend/
│   ├── config/          # Database configuration
│   ├── middleware/      # Auth middleware
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API endpoints
│   └── server.js        # Express server
│
└── frontend/
    ├── src/
    │   ├── components/  # Reusable components
    │   ├── context/     # React context providers
    │   ├── pages/       # Page components
    │   └── services/    # API client
    └── vite.config.js   # Build configuration
```

## Key Pages

- **Dashboard** - Overview with stats and quick actions
- **Companies** - Browse and search companies
- **Pipeline** - Visual application tracker
- **Calendar** - Placement events and schedules
- **Forum** - Company-specific discussions
- **Resources** - Study materials and guides
- **Support** - Help tickets and feedback

## API Endpoints

The backend exposes RESTful APIs for:
- Authentication (`/api/auth`)
- Student profiles (`/api/students`)
- Applications (`/api/applications`)
- Resources (`/api/resources`)
- Discussions (`/api/discussions`)
- Events (`/api/events`)
- Support tickets (`/api/support`)

## Development

```bash
# Backend (with auto-reload)
cd backend
npm run dev

# Frontend (with HMR)
cd frontend
npm run dev

# Build frontend for production
cd frontend
npm run build
```

## Environment Variables

**Backend (.env)**
```
PORT=3001
MONGODB_URI=your_mongodb_connection_string
CLERK_SECRET_KEY=your_clerk_secret_key
ALLOWED_EMAILS=comma,separated,emails  # Optional whitelist
FRONTEND_URL=http://localhost:5173
```

**Frontend (.env)**
```
VITE_API_URL=http://localhost:3001/api
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
```

## Contributing

This is a student project for Andhra University. Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

ISC License

## Contact

For questions or support:
- Email: placements@andhrauniversity.edu.in
- Project Maintainer: Harikrishna

---

Built with dedication for Andhra University students
