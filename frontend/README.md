# AU Placements Frontend

Modern React application for the AU Placements Portal with responsive design and real-time features.

## 🚀 Tech Stack

- **Framework:** React v19.1.1
- **Build Tool:** Vite v7.1.7
- **Routing:** React Router DOM v7.9.4
- **Styling:** TailwindCSS v3.4.18
- **HTTP Client:** Axios v1.12.2
- **UI Components:** shadcn/ui, Radix UI
- **Icons:** Lucide React v0.545.0
- **Calendar:** React Big Calendar v1.19.4
- **Date Handling:** date-fns v4.1.0

## 📁 Project Structure

```
frontend/
├── public/                  # Static assets
├── src/
│   ├── assets/             # Images, fonts
│   ├── components/         # Reusable components
│   │   ├── ui/            # shadcn/ui components
│   │   ├── Navbar.jsx
│   │   ├── PipelineCard.jsx
│   │   ├── CalendarView.jsx
│   │   ├── ForumCompanyList.jsx
│   │   ├── ForumChannelList.jsx
│   │   ├── ForumChatArea.jsx
│   │   ├── RefreshButton.jsx
│   │   ├── CompanyLogo.jsx
│   │   └── LogoutModal.jsx
│   ├── context/
│   │   └── AuthContext.jsx # Authentication state
│   ├── pages/              # Page components
│   │   ├── LoginPage.jsx
│   │   ├── VerifyPage.jsx
│   │   ├── DashboardPage.jsx
│   │   ├── ProfilePage.jsx
│   │   ├── CompanyListPage.jsx
│   │   ├── CompanyPipeline.jsx
│   │   ├── PlacementsCalendar.jsx
│   │   ├── DiscussionForum.jsx
│   │   ├── ResourcesPage.jsx
│   │   └── FeedbackSupport.jsx
│   ├── services/
│   │   └── api.js          # API service layer
│   ├── lib/
│   │   └── utils.js        # Utility functions
│   ├── App.jsx             # Main app component
│   ├── App.css             # Global styles
│   └── main.jsx            # React entry point
├── .env                    # Environment variables
├── vite.config.js          # Vite configuration
├── tailwind.config.js      # Tailwind configuration
├── postcss.config.js       # PostCSS configuration
└── package.json
```

## 🔧 Environment Variables

Create a `.env` file in the frontend directory:

```env
VITE_API_URL=http://localhost:3001/api
```

## 📦 Installation

```bash
cd frontend
npm install
```

## 🏃 Running the App

**Development:**
```bash
npm run dev
```
Runs on `http://localhost:5173`

**Build:**
```bash
npm run build
```

**Preview Build:**
```bash
npm run preview
```

**Lint:**
```bash
npm run lint
```

## 🎨 Features

### Authentication
- Magic link passwordless login
- JWT-based session management
- Protected routes with AuthContext
- Auto-redirect on auth errors

### Pages

**Dashboard**
- Quick stats overview
- Recent applications
- Upcoming events
- Quick actions

**Companies**
- Browse all companies
- Filter and search
- View company details
- Apply to companies

**Pipeline**
- Track application status
- Visual pipeline stages
- Dotted line connectors
- Status badges

**Calendar**
- Month/Week/Day/Agenda views
- Color-coded events
- Event registration
- Custom navigation

**Forum**
- Company-specific channels
- Real-time messaging
- Channel categories (General, Interview, Resources, Offers)
- Mobile-optimized layout

**Resources**
- Study materials
- Interview guides
- Company-specific resources
- Download tracking
- Rating system

**Support**
- Submit tickets
- Track ticket status
- Feedback system
- Bug reporting

**Profile**
- View/edit profile
- Resume upload
- Personal information

## 🎨 UI Components

### Custom Components
- **Navbar:** Floating navbar with sliding indicator (desktop), slide-in drawer (mobile)
- **RefreshButton:** Reusable refresh button with loading state
- **PipelineCard:** Application status visualization
- **CalendarView:** Custom calendar with event overlay
- **CompanyLogo:** Fallback logo component

### shadcn/ui Components
- Button, Card, Input, Textarea
- Select, Dialog, Tabs
- Badge, Avatar, Separator

## 📱 Responsive Design

- **Desktop:** Floating navbar, multi-column layouts
- **Mobile:** 
  - Full-width navbar at top
  - Slide-in mobile menu
  - Stacked layouts
  - Smaller headings
  - Touch-optimized buttons
  - No horizontal scroll

## 🎯 Key Features

### Navbar
- Sliding gradient indicator on active link
- Smooth transitions
- Mobile slide-in drawer
- Profile link without indicator
- Logout modal

### Calendar
- Hidden default toolbar
- Custom navigation (Prev/Next)
- Beautiful event styling
- Hover effects
- Mobile-responsive

### Pipeline
- Dotted line connectors
- Status-based colors
- Offer details display
- Responsive stages

### Forum
- Emoji-only buttons on mobile
- Horizontal channel list
- Company tabs
- Real-time updates

## 🔐 Authentication

```javascript
// Protected route example
<Route element={<ProtectedRoute />}>
  <Route path="/dashboard" element={<DashboardPage />} />
</Route>
```

## 🌐 API Integration

```javascript
// API service example
import { applicationAPI } from './services/api';

const response = await applicationAPI.getMyApplications();
```

## 🎨 Styling

- **TailwindCSS** for utility classes
- **Custom CSS** in App.css for:
  - Calendar styling
  - Mobile optimizations
  - Global overrides
- **Gradient theme:** Indigo → Purple → Pink

## 🛠️ Development Tips

1. **Hot Reload:** Vite provides instant HMR
2. **Component Structure:** Keep components small and reusable
3. **API Calls:** Use try-catch with loading states
4. **Responsive:** Test on mobile viewport
5. **Icons:** Use Lucide React for consistency

## 📝 Notes

- All data fetched from backend (no mock data)
- JWT stored in localStorage
- Auto-logout on 401 errors
- Optimistic UI updates
- Loading states on all async operations
