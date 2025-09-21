import React, { useEffect } from 'react';

interface ToastProps {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000); // Auto-dismiss after 5 seconds

    return () => {
      clearTimeout(timer);
    };
  }, [onClose]);

  const baseClasses = 'fixed bottom-5 right-5 z-50 p-4 rounded-lg shadow-lg flex items-center max-w-sm animate-fade-in-up';
  const typeClasses = {
    success: 'bg-emerald-600 text-white',
    error: 'bg-red-600 text-white',
  };

  return (
    <div className={`${baseClasses} ${typeClasses[type]}`}>
      <div className="flex-grow">{message}</div>
      <button onClick={onClose} className="ml-4 p-1 rounded-full hover:bg-white/20 transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
};

export default Toast;
