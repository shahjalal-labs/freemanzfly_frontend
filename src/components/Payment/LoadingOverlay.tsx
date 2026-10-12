// components/LoadingOverlay.tsx
import React from 'react';

interface LoadingOverlayProps {
  isVisible: boolean;
  message?: string;
}

export default function LoadingOverlay({ isVisible, message = "Processing your order..." }: LoadingOverlayProps) {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-3xl p-8 shadow-2xl max-w-md mx-4 text-center">
        {/* Animated Loading Spinner */}
        <div className="relative mb-6">
          <div className="w-16 h-16 mx-auto">
            {/* Outer spinning ring */}
            <div className="absolute inset-0 border-4 border-gray-200 rounded-full animate-pulse"></div>
            {/* Inner spinning ring */}
            <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            {/* Center dot */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-3 h-3 bg-primary rounded-full animate-bounce"></div>
            </div>
          </div>
        </div>

        {/* Loading Text */}
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {message}
        </h3>
        
        {/* Animated dots */}
        <div className="flex justify-center items-center space-x-1">
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>

        {/* Progress bar */}
        <div className="mt-6">
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div className="bg-primary h-1.5 rounded-full animate-pulse" style={{ width: '75%' }}></div>
          </div>
          <p className="text-sm text-gray-500 mt-2">Please don&apos;t close this window</p>
        </div>
      </div>
    </div>
  );
}