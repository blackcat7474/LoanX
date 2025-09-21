import React from 'react';
import { Customer } from '../types';

type UserRole = 'company' | 'customer';

interface HeaderProps {
    userRole: UserRole;
    setUserRole: (role: UserRole) => void;
    authenticatedCustomer: Customer | null;
    onLogout: () => void;
    isCompanyAuthenticated: boolean;
    onCompanyLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ userRole, setUserRole, authenticatedCustomer, onLogout, isCompanyAuthenticated, onCompanyLogout }) => {
  const buttonClasses = "px-4 py-2 text-sm font-medium rounded-md transition-colors";
  const activeClasses = "bg-sky-600 text-white";
  const inactiveClasses = "bg-slate-700 text-slate-300 hover:bg-slate-600";
    
  return (
    <header className="bg-slate-900/80 backdrop-blur-sm shadow-lg shadow-sky-900/20 sticky top-0 z-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span className="ml-3 text-2xl font-bold text-slate-100">LoanX</span>
          </div>
          <div className="flex items-center space-x-4">
            {isCompanyAuthenticated ? (
                 <div className="flex items-center gap-4">
                    <span className="text-slate-300">Welcome, <span className="font-semibold text-white">Company Admin</span></span>
                    <button onClick={onCompanyLogout} className="px-4 py-2 text-sm font-medium rounded-md transition-colors bg-red-600 text-white hover:bg-red-700">
                        Logout
                    </button>
                 </div>
            ) : authenticatedCustomer ? (
              <div className="flex items-center gap-4">
                <span className="text-slate-300">Welcome, <span className="font-semibold text-white">{authenticatedCustomer.name}</span></span>
                 <button onClick={onLogout} className="px-4 py-2 text-sm font-medium rounded-md transition-colors bg-red-600 text-white hover:bg-red-700">
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2 p-1 bg-slate-800 rounded-lg">
                <button onClick={() => setUserRole('customer')} className={`${buttonClasses} ${userRole === 'customer' ? activeClasses : inactiveClasses}`}>
                  Customer Dashboard
                </button>
                <button onClick={() => setUserRole('company')} className={`${buttonClasses} ${userRole === 'company' ? activeClasses : inactiveClasses}`}>
                  Company Portal
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;