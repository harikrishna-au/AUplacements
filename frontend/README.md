# 🎨 Frontend - AU Placements Portal

React + Vite frontend application for the AU Placements Portal.

---

## 📚 Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Directory Structure](#directory-structure)
- [Setup & Installation](#setup--installation)
- [Environment Variables](#environment-variables)
- [Project Architecture](#project-architecture)
- [Pages & Routes](#pages--routes)
- [Components](#components)
- [State Management](#state-management)
- [API Integration](#api-integration)
- [Styling](#styling)
- [Development](#development)
- [Build & Deployment](#build--deployment)

---

## 🌟 Overview

Modern React application built with **Vite** for fast development and optimized production builds. Features include:

- 🔐 **Passwordless Authentication** (Magic Link)
- 📅 **Interactive Calendar** (Placement events)
- 🏢 **Company Pipeline** (Application tracking)
- 💬 **Discussion Forums** (Company-specific channels)
- 📚 **Resource Library** (Study materials)
- 🎫 **Support Tickets** (Help & feedback system)
- 📊 **Dashboard** (Quick overview)

---

## 🛠️ Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| React | v19.1.1 | UI framework |
| Vite | v7.1.7 | Build tool & dev server |
| React Router DOM | v7.9.4 | Client-side routing |
| Axios | v1.12.2 | HTTP requests |
| TailwindCSS | v3.4.18 | Utility-first styling |
| shadcn/ui | - | UI component library |
| React Big Calendar | v1.19.4 | Calendar component |
| Lucide React | v0.469.0 | Icon library |
| date-fns | v4.1.0 | Date manipulation |

---

## 📁 Directory Structure

```
frontend/
├── public/
│   ├── favicon.ico              # App icon
│   └── ...                      # Static assets
│
├── src/
│   ├── components/              # Reusable UI components
│   │   ├── ui/                  # shadcn/ui base components
│   │   │   ├── button.jsx
│   │   │   ├── card.jsx
│   │   │   ├── dialog.jsx
│   │   │   ├── input.jsx
│   │   │   ├── label.jsx
│   │   │   ├── select.jsx
│   │   │   ├── textarea.jsx
│   │   │   ├── badge.jsx
│   │   │   ├── avatar.jsx
│   │   │   ├── tabs.jsx
│   │   │   ├── progress.jsx
│   │   │   └── ...
│   │   │
│   │   ├── ProtectedRoute.jsx   # Auth guard wrapper
│   │   ├── Navbar.jsx           # Top navigation
│   │   └── ...                  # Custom components
│   │
│   ├── context/
│   │   └── AuthContext.jsx      # Authentication state
│   │
│   ├── pages/                   # Page components (routes)
│   │   ├── LoginPage.jsx        # Email login
│   │   ├── VerifyPage.jsx       # Magic link verification
│   │   ├── DashboardPage.jsx    # Dashboard overview
│   │   ├── ProfilePage.jsx      # Student profile
│   │   ├── PlacementsCalendar.jsx  # Events calendar
│   │   ├── CompanyPipeline.jsx  # Application tracker
│   │   ├── CompanyListPage.jsx  # Browse companies
│   │   ├── DiscussionForum.jsx  # Company forums
│   │   ├── ResourcesPage.jsx    # Study materials
│   │   └── FeedbackSupport.jsx  # Support tickets
│   │
│   ├── services/
│   │   └── api.js               # API service layer
│   │
│   ├── lib/
│   │   └── utils.js             # Utility functions
│   │
│   ├── App.jsx                  # Root component
│   ├── main.jsx                 # Entry point
│   ├── index.css                # Global styles
│   └── ...
│
├── .env                         # Environment variables
├── .gitignore                   # Git ignore rules
├── components.json              # shadcn/ui config
├── eslint.config.js             # ESLint configuration
├── index.html                   # HTML template
├── jsconfig.json                # Path aliases
├── package.json                 # Dependencies
├── postcss.config.js            # PostCSS config
├── tailwind.config.js           # Tailwind config
├── vite.config.js               # Vite configuration
└── README.md                    # This file
```

---

## 🚀 Setup & Installation

### Prerequisites
- Node.js v18 or higher
- Backend server running on `http://localhost:3001`

### Installation Steps

1. **Install Dependencies**
   ```bash
   cd frontend
   npm install
   ```

2. **Configure Environment Variables**
   ```bash
   # Create .env file
   echo "VITE_API_URL=http://localhost:3001/api" > .env
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```

   Application will open at `http://localhost:5173`

4. **Build for Production** (Optional)
   ```bash
   npm run build
   ```

---

## 🔐 Environment Variables

Create a `.env` file in the frontend directory:

```env
# Backend API URL
VITE_API_URL=http://localhost:3001/api
```

**Important:** All Vite environment variables must be prefixed with `VITE_`

### Usage in Code
```javascript
const API_URL = import.meta.env.VITE_API_URL;
```

---

## 🏗️ Project Architecture

### Component Hierarchy

```
App.jsx
├── AuthProvider (Context)
│   ├── LoginPage
│   ├── VerifyPage
│   └── ProtectedRoute
│       ├── Navbar
│       ├── DashboardPage
│       ├── ProfilePage
│       ├── PlacementsCalendar
│       ├── CompanyPipeline
│       ├── CompanyListPage
│       ├── DiscussionForum
│       ├── ResourcesPage
│       └── FeedbackSupport
```

### Data Flow

```
User Action → Component → API Service → Backend → Database
                                ↓
                          Update State
                                ↓
                          Re-render UI
```

---

## 🛣️ Pages & Routes

### Public Routes

| Path | Component | Description |
|------|-----------|-------------|
| `/login` | `LoginPage` | Email-based login |
| `/verify/:token` | `VerifyPage` | Magic link verification |

### Protected Routes (Require Authentication)

| Path | Component | Description |
|------|-----------|-------------|
| `/` | `DashboardPage` | Overview dashboard |
| `/profile` | `ProfilePage` | Student profile editor |
| `/calendar` | `PlacementsCalendar` | Event calendar |
| `/pipeline` | `CompanyPipeline` | Application tracking |
| `/companies` | `CompanyListPage` | Browse companies |
| `/discussions` | `DiscussionForum` | Company forums |
| `/resources` | `ResourcesPage` | Study materials |
| `/support` | `FeedbackSupport` | Support tickets |

### Route Protection

All authenticated routes are wrapped with `ProtectedRoute`:

```jsx
<Route
  path="/calendar"
  element={
    <ProtectedRoute>
      <PlacementsCalendar />
    </ProtectedRoute>
  }
/>
```

---

## 🧩 Components

### Core Components

#### **ProtectedRoute.jsx**
Guards routes requiring authentication.
- Checks for JWT token in localStorage
- Redirects to login if not authenticated
- Shows loading state during verification

```jsx
<ProtectedRoute>
  <YourComponent />
</ProtectedRoute>
```

#### **Navbar.jsx**
Top navigation bar with:
- Logo and app name
- Navigation links
- User profile dropdown
- Logout functionality

### UI Components (shadcn/ui)

Located in `src/components/ui/`:

| Component | Purpose |
|-----------|---------|
| `Button` | Interactive buttons |
| `Card` | Content containers |
| `Dialog` | Modal dialogs |
| `Input` | Text input fields |
| `Label` | Form labels |
| `Select` | Dropdown selects |
| `Textarea` | Multi-line text |
| `Badge` | Status indicators |
| `Avatar` | User avatars |
| `Tabs` | Tab navigation |
| `Progress` | Progress bars |

### Component Usage Example

```jsx
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

function MyComponent() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Title</CardTitle>
      </CardHeader>
      <CardContent>
        <Button onClick={handleClick}>Click Me</Button>
      </CardContent>
    </Card>
  );
}
```

---

## 🔄 State Management

### Authentication State (Context API)

**AuthContext.jsx** manages global authentication:

```javascript
const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  // Login, logout, token refresh
  // ...

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Usage in components
const { user, logout } = useAuth();
```

### Local State (useState)

Each page manages its own local state:
- Form inputs
- Loading states
- Error messages
- Fetched data

### Data Fetching Pattern

```javascript
const [data, setData] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);

useEffect(() => {
  async function fetchData() {
    try {
      const response = await api.getData();
      setData(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }
  fetchData();
}, []);
```

---

## 🌐 API Integration

### API Service (`src/services/api.js`)

Centralized API client using Axios.

#### Configuration

```javascript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' }
});
```

#### Interceptors

**Request Interceptor** - Adds JWT token:
```javascript
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

**Response Interceptor** - Handles 401 errors:
```javascript
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

#### API Methods

**Authentication**
```javascript
authAPI.sendMagicLink(email)
authAPI.verifyToken(token)
authAPI.getCurrentUser()
authAPI.logout()
```

**Students**
```javascript
studentAPI.getProfile()
studentAPI.updateProfile(data)
studentAPI.uploadResume(file)
```

**Companies**
```javascript
companyAPI.getAll()
companyAPI.getById(id)
```

**Applications**
```javascript
applicationAPI.getMyApplications()
applicationAPI.apply(companyId)
applicationAPI.updateStage(id, stage)
applicationAPI.withdraw(id)
applicationAPI.getMyStats()
```

**Resources**
```javascript
resourceAPI.getByCompany(companyId)
resourceAPI.getAll()
resourceAPI.contribute(data)
resourceAPI.download(id)
resourceAPI.rate(id, rating)
```

**Discussions**
```javascript
discussionAPI.getMyForums()
discussionAPI.getMessages(companyId, channel)
discussionAPI.sendMessage(data)
discussionAPI.editMessage(id, message)
discussionAPI.deleteMessage(id)
```

**Events**
```javascript
eventAPI.getAll()
eventAPI.getMyEvents()
eventAPI.register(id)
eventAPI.getById(id)
```

**Support**
```javascript
supportAPI.getMyTickets()
supportAPI.getTicketById(id)
supportAPI.createTicket(data)
supportAPI.updateStatus(id, status)
supportAPI.addResponse(id, response)
```

---

## 🎨 Styling

### TailwindCSS

Utility-first CSS framework for rapid UI development.

#### Configuration (`tailwind.config.js`)

```javascript
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#3b82f6',
        secondary: '#6b7280',
        // ... custom colors
      }
    }
  },
  plugins: []
};
```

#### Common Utilities

```jsx
// Layout
<div className="flex items-center justify-between">

// Spacing
<div className="p-4 m-2 space-y-4">

// Typography
<h1 className="text-2xl font-bold text-gray-900">

// Colors
<div className="bg-blue-500 text-white">

// Responsive
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
```

### Global Styles (`src/index.css`)

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Custom global styles */
@layer base {
  body {
    @apply bg-gray-50 text-gray-900;
  }
}
```

### shadcn/ui Theming

Customize component styles in `src/index.css`:

```css
@layer base {
  :root {
    --primary: 221.2 83.2% 53.3%;
    --secondary: 210 40% 96.1%;
    /* ... CSS variables */
  }
}
```

---

## 🛠️ Development

### Available Scripts

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

### Development Server

- Runs on `http://localhost:5173`
- Hot Module Replacement (HMR) enabled
- Fast refresh for React components

### Code Formatting

ESLint configuration in `eslint.config.js`:
```bash
npm run lint
```

### Path Aliases

Configure in `jsconfig.json`:
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

Usage:
```javascript
import { Button } from '@/components/ui/button';
import api from '@/services/api';
```

---

## 📦 Build & Deployment

### Production Build

```bash
npm run build
```

Creates optimized build in `dist/` directory:
- Minified JavaScript
- Optimized CSS
- Asset hashing for cache busting
- Source maps

### Preview Build

```bash
npm run preview
```

Test production build locally.

### Deployment Options

#### **1. Vercel** (Recommended)
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel
```

#### **2. Netlify**
```bash
# Build command
npm run build

# Publish directory
dist
```

#### **3. GitHub Pages**
```bash
# Install gh-pages
npm install gh-pages

# Add to package.json
"scripts": {
  "deploy": "gh-pages -d dist"
}

# Deploy
npm run deploy
```

#### **4. Docker**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 5173
CMD ["npm", "run", "preview"]
```

### Environment Variables for Production

Update `.env` for production:
```env
VITE_API_URL=https://your-backend-api.com/api
```

---

## 🔍 Debugging

### Browser DevTools

- **React DevTools** extension
- **Redux DevTools** (if using Redux)
- Console logging
- Network tab for API requests

### Common Issues

**1. API Connection Error**
```
✗ Check backend is running on port 3001
✗ Verify VITE_API_URL in .env
✗ Check CORS settings in backend
```

**2. Token Expiration**
```
✗ Token expires after 7 days
✗ Logout and login again
✗ Check localStorage for 'token'
```

**3. Build Errors**
```
✗ Clear node_modules and reinstall
✗ Check for duplicate dependencies
✗ Verify Vite configuration
```

---

## 📊 Performance Optimization

### Code Splitting

React Router automatically splits code by route.

### Lazy Loading

```javascript
const LazyComponent = lazy(() => import('./components/HeavyComponent'));

<Suspense fallback={<Loading />}>
  <LazyComponent />
</Suspense>
```

### Image Optimization

```jsx
<img 
  src="/image.jpg" 
  alt="Description"
  loading="lazy"
  className="w-full h-auto"
/>
```

### Memoization

```javascript
const MemoizedComponent = React.memo(Component);

const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);

const memoizedCallback = useCallback(() => doSomething(a, b), [a, b]);
```

---

## 🧪 Testing

### Setup Testing (Optional)

```bash
# Install testing libraries
npm install -D vitest @testing-library/react @testing-library/jest-dom

# Add script to package.json
"scripts": {
  "test": "vitest"
}
```

### Example Test

```javascript
import { render, screen } from '@testing-library/react';
import { Button } from '@/components/ui/button';

test('renders button with text', () => {
  render(<Button>Click Me</Button>);
  expect(screen.getByText('Click Me')).toBeInTheDocument();
});
```

---

## 📝 Best Practices

1. **Component Structure**
   - Keep components small and focused
   - Use functional components with hooks
   - Extract reusable logic into custom hooks

2. **State Management**
   - Use Context for global state
   - Use useState for local state
   - Avoid prop drilling

3. **API Calls**
   - Always handle loading and error states
   - Use try-catch for async operations
   - Show user feedback on success/error

4. **Styling**
   - Use TailwindCSS utility classes
   - Keep custom CSS minimal
   - Maintain consistent spacing and colors

5. **Performance**
   - Use React.memo for expensive components
   - Implement lazy loading for routes
   - Optimize images and assets

6. **Security**
   - Never store sensitive data in localStorage
   - Validate user inputs
   - Use HTTPS in production

---

## 🐛 Troubleshooting

### Development Issues

**Vite Dev Server Not Starting**
```bash
# Clear cache
rm -rf node_modules/.vite

# Restart
npm run dev
```

**Module Not Found**
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

**HMR Not Working**
```bash
# Check Vite config
# Restart dev server
```

### Production Issues

**White Screen After Deploy**
```
✗ Check base URL in vite.config.js
✗ Verify build files in dist/
✗ Check browser console for errors
```

**API Calls Failing**
```
✗ Update VITE_API_URL to production backend
✗ Rebuild after changing .env
✗ Check CORS configuration
```

---

## 📞 Support

For frontend issues:
- Check browser console for errors
- Verify environment variables
- Test API endpoints with Postman
- Review network tab in DevTools

---

**Frontend maintained by AU Placements Development Team**
