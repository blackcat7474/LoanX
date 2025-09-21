import React, { useState } from 'react';
import Card from './ui/Card';
import Input from './ui/Input';
import Button from './ui/Button';
import Spinner from './ui/Spinner';

interface LoginProps {
  // Fix: Changed onLogin prop to accept a function that returns a Promise<boolean> to match the async handleLogin function in App.tsx.
  onLogin: (mobileNumber: string) => Promise<boolean>;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [mobileNumber, setMobileNumber] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validateMobileNumber = (number: string): boolean => {
    if (number && !/^\d{10}$/.test(number)) {
      setError('Please enter a valid 10-digit mobile number.');
      return false;
    }
    setError('');
    return true;
  };

  const handleMobileNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numericValue = e.target.value.replace(/[^0-9]/g, '');
    setMobileNumber(numericValue);

    // Clear error as user types
    if (error) {
      setError('');
    }
  };

  const handleBlur = () => {
    // Show validation error when the user leaves the input field
    validateMobileNumber(mobileNumber);
  };

  // Fix: Made handleSubmit async to correctly await the result of the onLogin function.
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateMobileNumber(mobileNumber)) {
      return;
    }
    
    setIsLoading(true);
    setError('');
    try {
      const success = await onLogin(mobileNumber);
      if (!success) {
        setError('This mobile number is not registered. Please contact the company to register your number.');
      }
    } catch (err) {
      console.error("Login failed:", err);
      setError('An unexpected error occurred during login. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center pt-16">
      <Card className="max-w-md w-full">
        <h2 className="text-2xl font-bold text-center mb-6 text-sky-400">Customer Login</h2>
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div>
            <label htmlFor="mobileNumber" className="block text-sm font-medium text-slate-300">Registered Mobile Number</label>
            <Input 
              id="mobileNumber"
              type="tel"
              value={mobileNumber}
              onChange={handleMobileNumberChange}
              onBlur={handleBlur}
              placeholder="Enter 10-digit number"
              maxLength={10}
              aria-invalid={!!error}
              aria-describedby="mobile-error"
              disabled={isLoading}
            />
          </div>
          {error && <p id="mobile-error" className="text-sm text-red-400">{error}</p>}
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? <Spinner /> : 'Login'}
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default Login;
