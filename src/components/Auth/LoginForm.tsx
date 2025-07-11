import React, { useState } from 'react';
import { Mail, Lock, UserX, Eye, EyeOff } from 'lucide-react';
import { User } from '../../types';

interface LoginFormProps {
  onLogin: (user: User) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const user: User = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      anonymous: false,
      createdAt: new Date(),
      treatmentStartDate: new Date()
    };
    
    localStorage.setItem('vitarise-user', JSON.stringify(user));
    onLogin(user);
  };

  const handleAnonymousLogin = () => {
    const user: User = {
      id: 'anonymous-' + Math.random().toString(36).substr(2, 9),
      email: '',
      anonymous: true,
      createdAt: new Date(),
      treatmentStartDate: new Date()
    };
    
    localStorage.setItem('vitarise-user', JSON.stringify(user));
    onLogin(user);
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-6 sm:space-y-8">
        <div className="text-center">
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-yellow-500 to-red-500 bg-clip-text text-transparent mb-2">
            VitaRise
          </h1>
          <p className="text-gray-400 text-sm sm:text-base">
            Your journey to enhanced sexual wellness
          </p>
        </div>

        <div className="bg-gray-800 rounded-xl p-6 sm:p-8 border border-gray-700">
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-10 pr-3 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-colors text-sm sm:text-base"
                  placeholder="your@email.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-10 pr-10 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-colors text-sm sm:text-base"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-yellow-500 to-red-500 text-white font-semibold py-3 px-4 rounded-lg hover:from-yellow-600 hover:to-red-600 transition-all duration-200 transform hover:scale-105 text-sm sm:text-base"
            >
              {isSignUp ? 'Create Account' : 'Sign In'}
            </button>
          </form>

          <div className="mt-4 sm:mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-600" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-800 text-gray-400">or</span>
              </div>
            </div>

            <button
              onClick={handleAnonymousLogin}
              className="mt-4 w-full flex items-center justify-center space-x-2 bg-gray-700 hover:bg-gray-600 text-white font-medium py-3 px-4 rounded-lg transition-colors text-sm sm:text-base"
            >
              <UserX className="h-5 w-5" />
              <span>Continue Anonymously</span>
            </button>
          </div>

          <div className="mt-4 sm:mt-6 text-center">
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-yellow-500 hover:text-yellow-400 text-sm transition-colors"
            >
              {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Create one"}
            </button>
          </div>
        </div>

        <div className="text-center text-xs text-gray-500">
          <p>Your data is private and secure.</p>
          <p>Anonymous mode available for complete privacy.</p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;