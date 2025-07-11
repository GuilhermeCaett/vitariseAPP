import React from 'react';
import { User, Menu } from 'lucide-react';
import { User as UserType } from '../../types';

interface HeaderProps {
  user: UserType;
  currentStreak: number;
  onMenuToggle?: () => void;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, currentStreak, onMenuToggle }) => {
  return (
    <header className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16">
          <div className="flex items-center space-x-3">
            {onMenuToggle && (
              <button
                onClick={onMenuToggle}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-800 transition-colors"
              >
                <Menu className="h-5 w-5 text-gray-400" />
              </button>
            )}
            <div className="flex-shrink-0">
              <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-yellow-500 to-red-500 bg-clip-text text-transparent">
                VitaRise
              </h1>
            </div>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-4">
            {currentStreak > 0 && (
              <div className="flex items-center text-yellow-500 bg-gray-800 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm">
                <span className="mr-1">🔥</span>
                <span className="font-semibold">{currentStreak}d</span>
              </div>
            )}
            
            <div className="flex items-center">
              <div className="h-7 w-7 sm:h-8 sm:w-8 bg-gradient-to-r from-yellow-500 to-red-500 rounded-full flex items-center justify-center">
                <User className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
              </div>
              <span className="ml-2 text-xs sm:text-sm text-gray-300 hidden sm:block">
                {user.name || user.email?.split('@')[0] || 'User'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;