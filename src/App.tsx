import React, { useState, useEffect } from 'react';
import Header from './components/Layout/Header';
import Navigation from './components/Layout/Navigation';
import LoginForm from './components/Auth/LoginForm';
import DashboardStats from './components/Dashboard/DashboardStats';
import TodayEntry from './components/Dashboard/TodayEntry';
import ProgressCharts from './components/Progress/ProgressCharts';
import AchievementCard from './components/Achievements/AchievementCard';
import { Calendar, BookOpen, Trophy, Download, Users, MessageCircle, Mail, Phone, Clock } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from 'date-fns';
import { User, DailyEntry, Achievement } from './types';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dailyEntries, setDailyEntries] = useState<DailyEntry[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);

  // Initialize achievements - 180 days treatment journey
  useEffect(() => {
    const defaultAchievements: Achievement[] = [
      // Week 1 - Getting Started
      {
        id: 'first-dose',
        title: 'First Step',
        description: 'Took your first VitaRise dose - Welcome to your transformation!',
        icon: '🚀',
        target: 1
      },
      {
        id: '7-day-streak',
        title: 'Week 1 Champion',
        description: 'Completed your first week! Consistency is key.',
        icon: '🔥',
        target: 7
      },
      
      // Month 1 - Building Habits
      {
        id: '14-day-milestone',
        title: '2 Week Warrior',
        description: 'Two weeks strong! Your body is adapting.',
        icon: '💪',
        target: 14
      },
      {
        id: '30-day-milestone',
        title: 'Month 1 Master',
        description: 'First month complete! You should start feeling changes.',
        icon: '🌟',
        target: 30
      },
      
      // Month 2 - Seeing Results
      {
        id: '45-day-milestone',
        title: '6 Week Achiever',
        description: 'Halfway through month 2! Results are becoming visible.',
        icon: '⚡',
        target: 45
      },
      {
        id: '60-day-milestone',
        title: 'Month 2 Complete',
        description: '2 months done! Significant improvements should be noticeable.',
        icon: '💎',
        target: 60
      },
      
      // Month 3 - Momentum Building
      {
        id: '90-day-milestone',
        title: 'Quarter Champion',
        description: '3 months! You\'re halfway to your transformation goal.',
        icon: '🏆',
        target: 90
      },
      
      // Month 4 - Steady Progress
      {
        id: '120-day-milestone',
        title: 'Month 4 Hero',
        description: '4 months strong! Your dedication is paying off.',
        icon: '🦸',
        target: 120
      },
      
      // Month 5 - Almost There
      {
        id: '150-day-milestone',
        title: 'Month 5 Legend',
        description: '5 months complete! You\'re in the final stretch.',
        icon: '👑',
        target: 150
      },
      
      // Month 6 - Transformation Complete
      {
        id: '180-day-complete',
        title: 'TRANSFORMATION COMPLETE',
        description: '🎉 6 MONTHS DONE! You\'ve completed the full VitaRise journey!',
        icon: '🏅',
        target: 180
      },
      
      // Special Achievements
      {
        id: 'perfect-month',
        title: 'Perfect Month',
        description: 'Didn\'t miss a single dose for 30 consecutive days!',
        icon: '⭐',
        target: 30
      },
      {
        id: 'dedication-master',
        title: 'Dedication Master',
        description: 'Maintained a 60-day streak without missing any doses!',
        icon: '🎯',
        target: 60
      }
    ];
    setAchievements(defaultAchievements);
  }, []);

  // Load user and data from localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem('vitarise-user');
    const savedEntries = localStorage.getItem('vitarise-entries');
    const savedAchievements = localStorage.getItem('vitarise-achievements');

    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }

    if (savedEntries) {
      setDailyEntries(JSON.parse(savedEntries));
    }

    if (savedAchievements) {
      setAchievements(JSON.parse(savedAchievements));
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    if (dailyEntries.length > 0) {
      localStorage.setItem('vitarise-entries', JSON.stringify(dailyEntries));
    }
  }, [dailyEntries]);

  useEffect(() => {
    if (achievements.length > 0) {
      localStorage.setItem('vitarise-achievements', JSON.stringify(achievements));
    }
  }, [achievements]);

  // Calculate stats
  const currentStreak = React.useMemo(() => {
    const sortedEntries = dailyEntries
      .filter(entry => entry.medicationTaken)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    let streak = 0;
    const today = new Date();
    
    for (let i = 0; i < sortedEntries.length; i++) {
      const entryDate = new Date(sortedEntries[i].date);
      const daysDiff = Math.floor((today.getTime() - entryDate.getTime()) / (1000 * 3600 * 24));
      
      if (daysDiff === i) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  }, [dailyEntries]);

  const totalDays = dailyEntries.filter(entry => entry.medicationTaken).length;

  const addDailyEntry = (entry: Omit<DailyEntry, 'id' | 'createdAt'>) => {
    const newEntry: DailyEntry = {
      ...entry,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date()
    };

    setDailyEntries(prev => {
      const filtered = prev.filter(e => e.date !== entry.date);
      return [newEntry, ...filtered];
    });

    checkAchievements();
  };

  const updateDailyEntry = (id: string, entryUpdate: Partial<DailyEntry>) => {
    setDailyEntries(prev =>
      prev.map(entry =>
        entry.id === id ? { ...entry, ...entryUpdate } : entry
      )
    );
    checkAchievements();
  };

  const checkAchievements = () => {
    const medicationEntries = dailyEntries.filter(e => e.medicationTaken);
    const totalDays = medicationEntries.length;
    
    // Calculate current streak
    const sortedEntries = dailyEntries
      .filter(entry => entry.medicationTaken)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    let currentStreak = 0;
    const today = new Date();
    
    for (let i = 0; i < sortedEntries.length; i++) {
      const entryDate = new Date(sortedEntries[i].date);
      const daysDiff = Math.floor((today.getTime() - entryDate.getTime()) / (1000 * 3600 * 24));
      
      if (daysDiff === i) {
        currentStreak++;
      } else {
        break;
      }
    }

    // Check achievements based on total days and streaks
    setAchievements(prev => prev.map(achievement => {
      if (achievement.unlockedAt) return achievement; // Already unlocked
      
      const shouldUnlock = (() => {
        switch (achievement.id) {
          case 'first-dose':
            return totalDays >= 1;
          case '7-day-streak':
            return currentStreak >= 7;
          case '14-day-milestone':
            return totalDays >= 14;
          case '30-day-milestone':
            return totalDays >= 30;
          case '45-day-milestone':
            return totalDays >= 45;
          case '60-day-milestone':
            return totalDays >= 60;
          case '90-day-milestone':
            return totalDays >= 90;
          case '120-day-milestone':
            return totalDays >= 120;
          case '150-day-milestone':
            return totalDays >= 150;
          case '180-day-complete':
            return totalDays >= 180;
          case 'perfect-month':
            return currentStreak >= 30;
          case 'dedication-master':
            return currentStreak >= 60;
          default:
            return false;
        }
      })();

      if (shouldUnlock) {
        return { ...achievement, unlockedAt: new Date() };
      }
      
      return achievement;
    }));
  };

  const handleLogout = () => {
    localStorage.removeItem('vitarise-user');
    localStorage.removeItem('vitarise-entries');
    localStorage.removeItem('vitarise-achievements');
    setUser(null);
    setDailyEntries([]);
    setAchievements([]);
  };

  if (!user) {
    return <LoginForm onLogin={setUser} />;
  }

  const renderCalendar = () => {
    const today = new Date();
    const monthStart = startOfMonth(today);
    const monthEnd = endOfMonth(today);
    const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

    return (
      <div className="bg-gray-800 rounded-xl p-4 sm:p-6 border border-gray-700">
        <h3 className="text-lg sm:text-xl font-semibold text-white mb-4 sm:mb-6">
          {format(today, "MMMM yyyy")}
        </h3>
        
        <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-4">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="text-center text-xs sm:text-sm font-medium text-gray-400 py-2">
              {day}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 gap-1 sm:gap-2">
          {days.map((day) => {
            const dayStr = format(day, 'yyyy-MM-dd');
            const entry = dailyEntries.find(e => e.date === dayStr);
            const isToday = isSameDay(day, today);
            const medicationTaken = entry?.medicationTaken;
            
            return (
              <div
                key={dayStr}
                className={`aspect-square flex items-center justify-center text-xs sm:text-sm rounded-lg transition-all ${
                  isToday
                    ? 'bg-gradient-to-r from-yellow-500 to-red-500 text-white font-bold'
                    : medicationTaken
                    ? 'bg-green-600 text-white font-semibold'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {format(day, 'd')}
              </div>
            );
          })}
        </div>
        
        <div className="flex items-center justify-center space-x-4 sm:space-x-6 mt-4 sm:mt-6 text-xs sm:text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-600 rounded"></div>
            <span className="text-gray-300">Medication taken</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-gray-700 rounded"></div>
            <span className="text-gray-300">No record</span>
          </div>
        </div>
      </div>
    );
  };

  const renderEducationalContent = () => {
    const ebooks = [
      {
        title: 'The Complete VitaRise Guide',
        description: 'Everything you need to know about your treatment journey',
        category: 'Getting Started',
        pdfUrl: '/pdfs/vitarise-complete-guide.pdf',
        color: 'from-blue-500 to-blue-600'
      },
      {
        title: 'Iron-Man Manual 60 Minutes Without Cumming',
        description: 'Advanced techniques for extended performance',
        category: 'Performance',
        pdfUrl: '/pdfs/Iron-Man-Manual-60-Minutes-Without-Cumming.pdf',
        color: 'from-green-500 to-green-600'
      },
      {
        title: 'Horse Mode',
        description: 'Ultimate guide to maximum hardness and size',
        category: 'Enhancement',
        pdfUrl: '/pdfs/Horse-Mode.pdf',
        color: 'from-red-500 to-red-600'
      },
      {
        title: 'The Secret of Lesbians',
        description: 'How two fingers unlock intense female orgasms',
        category: 'Pleasure Secrets',
        pdfUrl: '/pdfs/The-Secret-of-Lesbians-How-to-Make-Her-Come-with-Two-Fingers.pdf',
        color: 'from-purple-500 to-indigo-600'
      },
      {
        title: 'Lifestyle Optimization',
        description: 'Sleep, stress management, and daily habits',
        category: 'Lifestyle',
        pdfUrl: '/pdfs/lifestyle-optimization.pdf',
        color: 'from-yellow-500 to-yellow-600'
      },
      {
        title: 'Mental Health & Confidence',
        description: 'Building confidence and managing performance anxiety',
        category: 'Psychology',
        pdfUrl: '/pdfs/mental-health-confidence.pdf',
        color: 'from-orange-500 to-indigo-600'
      }
    ];

    const dailyTips = [
      "Proper hydration is essential for sexual health. Drink at least 2 liters of water daily to improve blood circulation.",
      "Regular cardio exercise for 30 minutes can significantly improve erectile function within 2-4 weeks.",
      "Dark chocolate contains flavonoids that help improve blood flow. Enjoy a small piece daily!",
      "Quality sleep (7-9 hours) is crucial for testosterone production and overall sexual health.",
      "Reduce stress through meditation or deep breathing - stress hormones can negatively impact performance.",
      "Limit alcohol consumption as it can interfere with blood flow and hormone production.",
      "Include zinc-rich foods like oysters, pumpkin seeds, and lean meats in your diet."
    ];

    const todayTip = dailyTips[new Date().getDay()];

    return (
      <div className="space-y-6">
        {/* E-books Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {ebooks.map((ebook, index) => (
            <button
              key={index}
              onClick={() => window.open(ebook.pdfUrl, '_blank')}
              className="bg-gray-800 rounded-xl p-4 sm:p-6 border border-gray-700 hover:border-gray-600 transition-all cursor-pointer group hover:scale-105 text-left"
            >
              <div className="flex items-start space-x-3 sm:space-x-4">
                <div className={`p-3 bg-gradient-to-r ${ebook.color}/20 rounded-lg group-hover:scale-110 transition-transform`}>
                  <Download className={`h-6 w-6 bg-gradient-to-r ${ebook.color} bg-clip-text text-transparent`} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="text-base sm:text-lg font-semibold text-white group-hover:text-yellow-500 transition-colors mb-2">
                    {ebook.title}
                  </h3>
                  <p className="text-gray-400 text-xs sm:text-sm mb-3">
                    {ebook.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-medium px-2 py-1 rounded-full bg-gradient-to-r ${ebook.color}/20 text-white`}>
                      {ebook.category}
                    </span>
                    <div className="flex items-center text-yellow-500 text-xs font-medium">
                      <Download className="h-3 w-3 mr-1" />
                      <span>PDF</span>
                    </div>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
        
        {/* Daily Tip */}
        <div className="bg-gradient-to-r from-yellow-500/10 to-red-500/10 border border-yellow-500/30 rounded-xl p-4 sm:p-6">
          <h3 className="text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4 flex items-center">
            💡 Daily Tip
            <span className="ml-2 text-xs bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded-full">
              {format(new Date(), 'EEEE')}
            </span>
          </h3>
          <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
            {todayTip}
          </p>
          <div className="mt-4 flex items-center text-xs text-yellow-500">
            <BookOpen className="h-4 w-4 mr-1" />
            <span>New tip every day to support your journey</span>
          </div>
        </div>

        {/* Download All Button */}
        <div className="text-center">
          <button
            onClick={() => {
              // You can implement a zip download or redirect to a page with all PDFs
              alert('Feature coming soon! Individual PDFs are available above.');
            }}
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-yellow-500 to-red-500 text-white font-semibold py-3 px-6 rounded-lg hover:from-yellow-600 hover:to-red-600 transition-all duration-200 transform hover:scale-105"
          >
            <Download className="h-5 w-5" />
            <span>Download All E-books</span>
          </button>
          <p className="text-xs text-gray-400 mt-2">
            Get the complete VitaRise knowledge library
          </p>
        </div>
      </div>
    );
  };

  const renderSupport = () => {
    return (
      <div className="space-y-6">
        {/* Main Support Card */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 sm:p-8 border border-gray-700 shadow-xl">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-yellow-500/20 to-red-500/20 rounded-full mb-4">
              <MessageCircle className="h-8 w-8 text-yellow-500" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">Need Support?</h2>
            <p className="text-gray-400 text-sm sm:text-base">
              Our VitaRise team is here to help you on your journey
            </p>
          </div>

          <div className="bg-gray-700/50 rounded-lg p-6 border border-gray-600 mb-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <Mail className="h-5 w-5 text-yellow-500 mr-2" />
              Contact Our Team
            </h3>
            <p className="text-gray-300 text-sm mb-4">
              Have questions about your treatment, need guidance, or want to share your progress? 
              Our specialized team is ready to support you.
            </p>
            
            <a
              href="mailto:contact@vitariseboost.com?subject=VitaRise Support Request"
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-yellow-500 to-red-500 text-white font-semibold py-3 px-6 rounded-lg hover:from-yellow-600 hover:to-red-600 transition-all duration-200 transform hover:scale-105"
            >
              <Mail className="h-5 w-5" />
              <span>Send Email</span>
            </a>
          </div>

          <div className="text-center text-sm text-gray-400">
            <p>📧 contact@vitariseboost.com</p>
            <p className="mt-2">We typically respond within 24 hours</p>
          </div>
        </div>

        {/* Support Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <div className="bg-gray-800 rounded-xl p-4 sm:p-6 border border-gray-700">
            <div className="flex items-center space-x-3 mb-3 sm:mb-4">
              <Users className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-500" />
              <h3 className="text-base sm:text-lg font-semibold text-white">Expert Guidance</h3>
            </div>
            <p className="text-gray-400 text-xs sm:text-sm mb-3 sm:mb-4">
              Get personalized advice from our men's health specialists about your treatment progress.
            </p>
            <div className="flex items-center text-yellow-500 text-xs sm:text-sm">
              <Clock className="h-4 w-4 mr-1" />
              <span>Available Monday - Friday</span>
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl p-4 sm:p-6 border border-gray-700">
            <div className="flex items-center space-x-3 mb-3 sm:mb-4">
              <BookOpen className="h-5 w-5 sm:h-6 sm:w-6 text-red-500" />
              <h3 className="text-base sm:text-lg font-semibold text-white">Treatment Support</h3>
            </div>
            <p className="text-gray-400 text-xs sm:text-sm mb-3 sm:mb-4">
              Questions about dosage, side effects, or optimizing your results? We're here to help.
            </p>
            <div className="flex items-center text-red-500 text-xs sm:text-sm">
              <MessageCircle className="h-4 w-4 mr-1" />
              <span>Confidential & Professional</span>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-gray-800 rounded-xl p-4 sm:p-6 border border-gray-700">
          <h3 className="text-base sm:text-lg font-semibold text-white mb-4">Frequently Asked Questions</h3>
          <div className="space-y-4">
            <div className="border-b border-gray-700 pb-3">
              <h4 className="font-medium text-white text-sm mb-2">How long until I see results?</h4>
              <p className="text-gray-400 text-xs sm:text-sm">
                Most users report improvements within 2-4 weeks of consistent use. Individual results may vary.
              </p>
            </div>
            <div className="border-b border-gray-700 pb-3">
              <h4 className="font-medium text-white text-sm mb-2">What if I miss a dose?</h4>
              <p className="text-gray-400 text-xs sm:text-sm">
                Take your next dose as scheduled. Don't double up. Consistency is key for best results.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-white text-sm mb-2">Is my data secure?</h4>
              <p className="text-gray-400 text-xs sm:text-sm">
                Yes! All your data is encrypted and stored securely. We never share your personal information.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderAchievements = () => {
    const achievementProgress = {
      'first-dose': totalDays,
      '7-day-streak': currentStreak,
      '14-day-milestone': totalDays,
      '30-day-milestone': totalDays,
      '45-day-milestone': totalDays,
      '60-day-milestone': totalDays,
      '90-day-milestone': totalDays,
      '120-day-milestone': totalDays,
      '150-day-milestone': totalDays,
      '180-day-complete': totalDays,
      'perfect-month': currentStreak,
      'dedication-master': currentStreak
    };

    // Calculate overall progress
    const overallProgress = Math.min((totalDays / 180) * 100, 100);
    const daysRemaining = Math.max(180 - totalDays, 0);
    const monthsRemaining = Math.ceil(daysRemaining / 30);

    return (
      <div className="space-y-6">
        {/* Overall Progress Card */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700 shadow-xl">
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold text-white mb-2">Your 6-Month Journey</h3>
            <p className="text-gray-400">Complete transformation in 180 days</p>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Overall Progress</span>
              <span className="text-white font-semibold">{totalDays}/180 days</span>
            </div>
            
            <div className="w-full bg-gray-700 rounded-full h-4">
              <div 
                className="bg-gradient-to-r from-yellow-500 to-red-500 h-4 rounded-full transition-all duration-500 relative overflow-hidden"
                style={{ width: `${overallProgress}%` }}
              >
                <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="bg-gray-700/50 rounded-lg p-3">
                <div className="text-2xl font-bold text-yellow-500">{Math.round(overallProgress)}%</div>
                <div className="text-xs text-gray-400">Complete</div>
              </div>
              <div className="bg-gray-700/50 rounded-lg p-3">
                <div className="text-2xl font-bold text-red-500">{daysRemaining}</div>
                <div className="text-xs text-gray-400">Days Left</div>
              </div>
            </div>
            
            {daysRemaining > 0 && (
              <div className="text-center">
                <p className="text-sm text-gray-300">
                  Keep going! You're approximately <span className="text-yellow-500 font-semibold">{monthsRemaining} month{monthsRemaining !== 1 ? 's' : ''}</span> away from completing your transformation.
                </p>
              </div>
            )}
            
            {totalDays >= 180 && (
              <div className="text-center bg-gradient-to-r from-yellow-500/20 to-red-500/20 rounded-lg p-4 border border-yellow-500/30">
                <p className="text-lg font-bold text-yellow-500 mb-2">🎉 TRANSFORMATION COMPLETE! 🎉</p>
                <p className="text-sm text-gray-300">
                  Congratulations! You've completed the full 6-month VitaRise journey!
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Achievements Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {achievements.map((achievement) => (
            <AchievementCard
              key={achievement.id}
              achievement={achievement}
              progress={achievementProgress[achievement.id as keyof typeof achievementProgress]}
            />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <Header 
        user={user} 
        currentStreak={currentStreak} 
        onMenuToggle={() => setSidebarOpen(true)}
        onLogout={handleLogout}
      />
      
      <div className="flex">
        <Navigation 
          activeTab={activeTab} 
          onTabChange={setActiveTab}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        
        <main className="flex-1 p-4 sm:p-6 pb-20 lg:pb-6">
          <div className="max-w-7xl mx-auto">
            {activeTab === 'dashboard' && (
              <div className="space-y-6 sm:space-y-8">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">Dashboard</h2>
                  <p className="text-gray-400 text-sm sm:text-base">Track your daily progress</p>
                </div>
                
                <TodayEntry 
                  dailyEntries={dailyEntries}
                  onAddEntry={addDailyEntry}
                  onUpdateEntry={updateDailyEntry}
                />
                
                <DashboardStats 
                  currentStreak={currentStreak}
                  totalDays={totalDays}
                  achievements={achievements}
                  dailyEntries={dailyEntries}
                />
                
                <div className="grid grid-cols-1 lg:grid-cols-1 gap-6 sm:gap-8">
                  {renderCalendar()}
                </div>
              </div>
            )}

            {activeTab === 'calendar' && (
              <div className="space-y-6 sm:space-y-8">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">Calendar</h2>
                  <p className="text-gray-400 text-sm sm:text-base">View your treatment history</p>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
                  <div className="lg:col-span-2">
                    {renderCalendar()}
                  </div>
                  <div className="space-y-6">
                    <DashboardStats 
                      currentStreak={currentStreak}
                      totalDays={totalDays}
                      achievements={achievements}
                      dailyEntries={dailyEntries}
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'progress' && (
              <div className="space-y-6 sm:space-y-8">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">Progress</h2>
                  <p className="text-gray-400 text-sm sm:text-base">Visualize your evolution over time</p>
                </div>
                
                <ProgressCharts dailyEntries={dailyEntries} />
              </div>
            )}

            {activeTab === 'education' && (
              <div className="space-y-6 sm:space-y-8">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">Educational Content</h2>
                  <p className="text-gray-400 text-sm sm:text-base">Download our specialized e-books and get daily tips</p>
                </div>
                
                {renderEducationalContent()}
              </div>
            )}

            {activeTab === 'achievements' && (
              <div className="space-y-6 sm:space-y-8">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">Achievements</h2>
                  <p className="text-gray-400 text-sm sm:text-base">Your 180-day transformation journey</p>
                </div>
                
                {renderAchievements()}
              </div>
            )}

            {activeTab === 'support' && (
              <div className="space-y-6 sm:space-y-8">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">Support</h2>
                  <p className="text-gray-400 text-sm sm:text-base">Get help from our VitaRise team</p>
                </div>
                
                {renderSupport()}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Mobile Navigation - Fixed to 6 columns */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 z-40">
        <div className="grid grid-cols-6 gap-1">
          {[
            { id: 'dashboard', icon: Calendar, label: 'Home' },
            { id: 'calendar', icon: Calendar, label: 'Calendar' },
            { id: 'progress', icon: Trophy, label: 'Progress' },
            { id: 'education', icon: BookOpen, label: 'Learn' },
            { id: 'achievements', icon: Trophy, label: 'Awards' },
            { id: 'support', icon: MessageCircle, label: 'Support' }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`p-2 transition-colors flex flex-col items-center space-y-1 ${
                  isActive ? 'text-yellow-500' : 'text-gray-400'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="text-xs">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default App;