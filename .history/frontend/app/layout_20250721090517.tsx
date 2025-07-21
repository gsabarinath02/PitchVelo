import './globals.css'
import { Inter } from 'next/font/google'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from '@/contexts/AuthContext'
import ErrorBoundary from '@/components/ErrorBoundary'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Presentation Analytics',
  description: 'Interactive presentation viewer with analytics tracking',
}

// Suppress console warnings for smooth experience
const suppressWarnings = `
  if (typeof window !== 'undefined') {
    const originalWarn = console.warn;
    console.warn = function(...args) {
      if (args[0] && typeof args[0] === 'string' && 
          (args[0].includes('data-scholarcy-content-script-executed') || 
           args[0].includes('Extra attributes from the server'))) {
        return;
      }
      originalWarn.apply(console, args);
    };
  }
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <script dangerouslySetInnerHTML={{ __html: suppressWarnings }} />
      </head>
      <body className={`${inter.className} gradient-bg min-h-screen`}>
        <ErrorBoundary>
          <AuthProvider>
            {children}
            <Toaster 
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#363636',
                  color: '#fff',
                },
              }}
            />
          </AuthProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
} 