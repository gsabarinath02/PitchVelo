// Error handling utilities for browser extensions and development warnings

// List of known browser extension warnings to suppress
const BROWSER_EXTENSION_WARNINGS = [
  'data-scholarcy-content-script-executed',
  'Extra attributes from the server',
  'Warning: Extra attributes from the server',
  'data-extension-',
  'data-browser-extension',
];

// Check if an error is from a browser extension
export const isBrowserExtensionError = (error: string | Error): boolean => {
  const message = typeof error === 'string' ? error : error.message;
  return BROWSER_EXTENSION_WARNINGS.some(warning => 
    message.includes(warning)
  );
};

// Suppress console warnings for browser extensions in development
export const suppressBrowserExtensionWarnings = () => {
  if (typeof window === 'undefined' || process.env.NODE_ENV !== 'development') {
    return;
  }

  const originalConsoleError = console.error;
  const originalConsoleWarn = console.warn;

  console.error = (...args) => {
    const message = args.join(' ');
    if (isBrowserExtensionError(message)) {
      return; // Suppress browser extension warnings
    }
    originalConsoleError.apply(console, args);
  };

  console.warn = (...args) => {
    const message = args.join(' ');
    if (isBrowserExtensionError(message)) {
      return; // Suppress browser extension warnings
    }
    originalConsoleWarn.apply(console, args);
  };
};

// Enhanced error logging for production
export const logError = (error: Error, context?: string) => {
  if (isBrowserExtensionError(error)) {
    return; // Don't log browser extension errors
  }

  console.error(`[${context || 'Application'}] Error:`, error);
  
  // In production, you might want to send this to an error reporting service
  if (process.env.NODE_ENV === 'production') {
    // Example: Sentry.captureException(error, { tags: { context } });
  }
};

// Initialize error handling
export const initializeErrorHandling = () => {
  suppressBrowserExtensionWarnings();
  
  // Global error handler
  if (typeof window !== 'undefined') {
    window.addEventListener('error', (event) => {
      if (isBrowserExtensionError(event.error)) {
        event.preventDefault();
        return;
      }
    });

    window.addEventListener('unhandledrejection', (event) => {
      if (isBrowserExtensionError(event.reason)) {
        event.preventDefault();
        return;
      }
    });
  }
}; 