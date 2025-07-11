import React from 'react';
import { Home, Calendar, TrendingUp, BookOpen, MessageCircle, Trophy, X } from 'lucide-react';

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  isOpen?: boolean;
  onClose?: () => void;
}

const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange, isOpen = true, onClose }) => {
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'progress', label: 'Progress', icon: TrendingUp },
    { id: 'education', label: 'Content', icon: BookOpen },
    { id: 'achievements', label: 'Achievements', icon: Trophy },
    { id: 'support', label: 'Support', icon: MessageCircle }
  ];

  const handleTabClick = (tabId: string) => {
    onTabChange(tabId);
    if (onClose) onClose();
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && onClose && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={onClose}
        />
      )}
      
      {/* Navigation Sidebar */}
      <nav className={`
        fixed lg:static inset-y-0 left-0 z-50 w-64 bg-gray-900 border-r border-gray-800 transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Mobile Close Button */}
        {onClose && (
          <div className="lg:hidden flex justify-end p-4">
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-800 transition-colors"
            >
              <X className="h-5 w-5 text-gray-400" />
            </button>
          </div>
        )}
        
        <div className="px-4 py-6">
          <ul className="space-y-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              
              return (
                <li key={tab.id}>
                  <button
                    onClick={() => handleTabClick(tab.id)}
                    className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                      isActive
                        ? 'bg-gradient-to-r from-yellow-500/20 to-red-500/20 text-yellow-500 border border-yellow-500/30'
                        : 'text-gray-400 hover:text-white hover:bg-gray-800'
                    }`}
                  >
                    <Icon className={`mr-3 h-5 w-5 ${isActive ? 'text-yellow-500' : ''}`} />
                    {tab.label}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>
    </>
  );
};

export default Navigation;