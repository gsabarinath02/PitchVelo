import './globals.css'
import { Inter } from 'next/font/google'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from '@/contexts/AuthContext'
import ErrorBoundary from '@/components/ErrorBoundary'
import { initializeErrorHandling } from '@/lib/errorHandling'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Presentation Analytics',
  description: 'Interactive presentation viewer with analytics tracking',
}

// Initialize error handling for browser extensions
if (typeof window !== 'undefined') {
  initializeErrorHandling();
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
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