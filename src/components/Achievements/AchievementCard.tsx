import React from 'react';
import { Achievement } from '../../types';
import { format } from 'date-fns';

interface AchievementCardProps {
  achievement: Achievement;
  progress?: number;
}

const AchievementCard: React.FC<AchievementCardProps> = ({ achievement, progress = 0 }) => {
  const isUnlocked = !!achievement.unlockedAt;
  const progressPercentage = achievement.target ? Math.min((progress / achievement.target) * 100, 100) : 0;

  return (
    <div className={`bg-gray-800 rounded-xl p-4 sm:p-6 border transition-all duration-300 hover:scale-105 ${
      isUnlocked 
        ? 'border-yellow-500/50 bg-gradient-to-br from-yellow-500/10 to-red-500/10 shadow-lg shadow-yellow-500/20' 
        : 'border-gray-700 hover:border-gray-600'
    }`}>
      <div className="flex items-start space-x-3 sm:space-x-4">
        <div className={`text-3xl sm:text-5xl transition-all duration-300 ${
          isUnlocked ? 'animate-pulse' : 'opacity-50 grayscale'
        }`}>
          {achievement.icon}
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className={`text-base sm:text-lg font-bold mb-2 ${
            isUnlocked ? 'text-yellow-500' : 'text-white'
          }`}>
            {achievement.title}
          </h3>
          
          <p className="text-gray-400 text-xs sm:text-sm mb-3">
            {achievement.description}
          </p>
          
          {!isUnlocked && achievement.target && (
            <div className="space-y-2">
              <div className="flex justify-between text-xs sm:text-sm">
                <span className="text-gray-400">Progress</span>
                <span className="text-gray-300 font-semibold">{progress}/{achievement.target} days</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-yellow-500 to-red-500 h-3 rounded-full transition-all duration-500 relative overflow-hidden"
                  style={{ width: `${progressPercentage}%` }}
                >
                  <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                </div>
              </div>
              <div className="text-center">
                <span className="text-xs text-yellow-500 font-medium">
                  {Math.round(progressPercentage)}% Complete
                </span>
              </div>
            </div>
          )}
          
          {isUnlocked && achievement.unlockedAt && (
            <div className="space-y-2">
              <div className="flex items-center text-xs sm:text-sm text-yellow-500 font-semibold">
                <span>🎉 Unlocked on {format(achievement.unlockedAt, "MMM dd, yyyy")}</span>
              </div>
              <div className="bg-gradient-to-r from-yellow-500/20 to-red-500/20 rounded-lg p-2 border border-yellow-500/30">
                <p className="text-xs text-yellow-400 text-center font-medium">
                  Achievement Completed! 🏆
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AchievementCard;