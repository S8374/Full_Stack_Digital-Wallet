// src/pages/GoogleCallback.tsx
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function GoogleCallback() {
  const location = useLocation();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check for error in URL parameters
    const urlParams = new URLSearchParams(location.search);
    const errorParam = urlParams.get('error');
    
    if (errorParam) {
      setError(errorParam);
      // Redirect to login page after showing error
      setTimeout(() => {
        navigate('/login', { 
          state: { 
            error: `Google authentication failed: ${errorParam}` 
          } 
        });
      }, 3000);
    } else {
      // Successful authentication - backend should handle the rest
      // You can redirect to dashboard or home page
      navigate('/');
    }
  }, [location, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 text-center">
        {error ? (
          <>
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Authentication Failed</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">{error}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Redirecting to login page...</p>
          </>
        ) : (
          <>
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-6">
              <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Completing Sign In</h2>
            <p className="text-gray-600 dark:text-gray-300">Please wait while we complete your authentication...</p>
          </>
        )}
      </div>
    </div>
  );
}