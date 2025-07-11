import React from 'react';
import { Calendar, Zap, Target, Award } from 'lucide-react';
import { DailyEntry, Achievement } from '../../types';

interface DashboardStatsProps {
  currentStreak: number;
  totalDays: number;
  achievements: Achievement[];
  dailyEntries: DailyEntry[];
}

const DashboardStats: React.FC<DashboardStatsProps> = ({ 
  currentStreak, 
  totalDays, 
  achievements, 
  dailyEntries 
}) => {
  const unlockedAchievements = achievements.filter(a => a.unlockedAt).length;
  const averagePerformance = dailyEntries.length > 0 
    ? Math.round(dailyEntries
        .filter(e => e.performance)
        .reduce((acc, e) => acc + (e.performance || 0), 0) / dailyEntries.filter(e => e.performance).length)
    : 0;

  // Calculate progress towards 180 days
  const treatmentProgress = Math.min((totalDays / 180) * 100, 100);
  const daysRemaining = Math.max(180 - totalDays, 0);

  const stats = [
    {
      title: 'Current Streak',
      value: currentStreak,
      unit: 'days',
      icon: Calendar,
      color: 'from-yellow-500 to-yellow-600',
      bgColor: 'from-yellow-500/20 to-yellow-600/20'
    },
    {
      title: 'Treatment Progress',
      value: totalDays,
      unit: '/180',
      icon: Zap,
      color: 'from-red-500 to-red-600',
      bgColor: 'from-red-500/20 to-red-600/20',
      progress: treatmentProgress
    },
    {
      title: 'Avg Performance',
      value: averagePerformance,
      unit: '/10',
      icon: Target,
      color: 'from-green-500 to-green-600',
      bgColor: 'from-green-500/20 to-green-600/20'
    },
    {
      title: 'Achievements',
      value: unlockedAchievements,
      unit: `/${achievements.length}`,
      icon: Award,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'from-purple-500/20 to-purple-600/20'
    }
  ];

  return (
    <div className="space-y-4">
      {/* 180-Day Progress Banner */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl p-4 border border-gray-700">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-lg font-bold text-white">6-Month Journey</h3>
            <p className="text-sm text-gray-400">Complete transformation in 180 days</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-yellow-500">{Math.round(treatmentProgress)}%</div>
            <div className="text-xs text-gray-400">Complete</div>
          </div>
        </div>
        
        <div className="w-full bg-gray-700 rounded-full h-3 mb-2">
          <div 
            className="bg-gradient-to-r from-yellow-500 to-red-500 h-3 rounded-full transition-all duration-500"
            style={{ width: `${treatmentProgress}%` }}
          />
        </div>
        
        <div className="flex justify-between text-xs text-gray-400">
          <span>{totalDays} days completed</span>
          <span>{daysRemaining} days remaining</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          
          return (
            <div
              key={index}
              className="bg-gray-800 rounded-xl p-3 sm:p-6 border border-gray-700 hover:border-gray-600 transition-all duration-200 hover:scale-105"
            >
              <div className="flex items-center justify-between mb-2 sm:mb-4">
                <div className={`p-2 sm:p-3 rounded-lg bg-gradient-to-r ${stat.bgColor}`}>
                  <Icon className={`h-4 w-4 sm:h-6 sm:w-6 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`} />
                </div>
              </div>
              
              <div className="space-y-1">
                <p className="text-lg sm:text-2xl font-bold text-white">
                  {stat.value}
                  <span className="text-sm sm:text-lg text-gray-400 ml-1">{stat.unit}</span>
                </p>
                <p className="text-xs sm:text-sm text-gray-400">{stat.title}</p>
                
                {stat.progress && (
                  <div className="w-full bg-gray-700 rounded-full h-1 mt-2">
                    <div 
                      className={`bg-gradient-to-r ${stat.color} h-1 rounded-full transition-all duration-300`}
                      style={{ width: `${stat.progress}%` }}
                    />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DashboardStats;