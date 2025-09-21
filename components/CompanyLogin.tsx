import React, { useState } from 'react';
import Card from './ui/Card';
import Input from './ui/Input';
import Button from './ui/Button';
import Spinner from './ui/Spinner';

interface CompanyLoginProps {
  onLogin: (username: string, password: string) => Promise<boolean>;
}

const CompanyLogin: React.FC<CompanyLoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      setError('Please enter both username and password.');
      return;
    }
    
    setIsLoading(true);
    setError('');

    try {
      const success = await onLogin(username, password);
      if (!success) {
        setError('Invalid credentials. Please try again.');
      }
    } catch (e) {
      console.error("Login failed:", e);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center pt-16">
      <Card className="max-w-md w-full">
        <h2 className="text-2xl font-bold text-center mb-6 text-sky-400">Company Portal Login</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-slate-300">Username</label>
            <Input 
              id="username"
              type="text"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                if(error) setError('');
              }}
              placeholder="Enter username"
              disabled={isLoading}
            />
          </div>
           <div>
            <label htmlFor="password"className="block text-sm font-medium text-slate-300">Password</label>
            <Input 
              id="password"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if(error) setError('');
              }}
              placeholder="Enter password"
              disabled={isLoading}
            />
          </div>
          {error && <p className="text-sm text-red-400">{error}</p>}
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? <Spinner /> : 'Login'}
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default CompanyLogin;