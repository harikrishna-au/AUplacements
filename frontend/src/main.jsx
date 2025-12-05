import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ClerkProvider } from '@clerk/clerk-react'
import './index.css'
import App from './App.jsx'

// Suppress browser extension errors
const originalError = console.error;
console.error = (...args) => {
  const errorString = args.join(' ');
  // Filter out common extension-related errors
  if (
    errorString.includes('message channel closed') ||
    errorString.includes('requestIdleCallback') ||
    errorString.includes('Importing binding name') ||
    errorString.includes('extension')
  ) {
    return;
  }
  originalError.apply(console, args);
};

// Suppress unhandled promise rejections from extensions
window.addEventListener('unhandledrejection', (event) => {
  if (
    event.reason?.message?.includes('message channel closed') ||
    event.reason?.message?.includes('extension')
  ) {
    event.preventDefault();
  }
});

// const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY
// if (!clerkPubKey) {
//   throw new Error('Missing Clerk Publishable Key')
// }

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element not found');
}

createRoot(rootElement).render(
  <StrictMode>
    {/* <ClerkProvider publishableKey={clerkPubKey}> */}
    <App />
    {/* </ClerkProvider> */}
  </StrictMode>,
);
