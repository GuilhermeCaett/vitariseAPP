import React, { useState } from 'react';
import { Pill, Zap, Heart, Users, Smile, CheckCircle, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { DailyEntry } from '../../types';

interface TodayEntryProps {
  dailyEntries: DailyEntry[];
  onAddEntry: (entry: Omit<DailyEntry, 'id' | 'createdAt'>) => void;
  onUpdateEntry: (id: string, entry: Partial<DailyEntry>) => void;
}

const TodayEntry: React.FC<TodayEntryProps> = ({ dailyEntries, onAddEntry, onUpdateEntry }) => {
  const today = format(new Date(), 'yyyy-MM-dd');
  const todayEntry = dailyEntries.find(entry => entry.date === today);
  
  const [medicationTaken, setMedicationTaken] = useState(todayEntry?.medicationTaken || false);
  const [symptoms, setSymptoms] = useState(todayEntry?.symptoms || {
    energy: 5,
    libido: 5,
    rigidity: 5,
    selfEsteem: 5
  });
  const [performance, setPerformance] = useState(todayEntry?.performance || 0);
  const [notes, setNotes] = useState(todayEntry?.notes || '');
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    const entryData = {
      date: today,
      medicationTaken,
      symptoms,
      performance: performance || undefined,
      notes: notes || undefined
    };

    if (todayEntry) {
      onUpdateEntry(todayEntry.id, entryData);
    } else {
      onAddEntry(entryData);
    }

    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const symptomIcons = {
    energy: Zap,
    libido: Heart,
    rigidity: Users,
    selfEsteem: Smile
  };

  const symptomLabels = {
    energy: 'Energy Level',
    libido: 'Libido',
    rigidity: 'Rigidity',
    selfEsteem: 'Self-Esteem'
  };

  const isCompleted = medicationTaken && Object.values(symptoms).every(val => val > 0);

  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-4 sm:p-6 border border-gray-700 shadow-xl">
      {/* Header with status indicator */}
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-full ${isCompleted ? 'bg-green-500/20' : 'bg-yellow-500/20'}`}>
            {isCompleted ? (
              <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-green-500" />
            ) : (
              <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-500" />
            )}
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-white">Today's Entry</h3>
            <p className="text-xs sm:text-sm text-gray-400">
              {format(new Date(), "EEEE, MMM dd")}
            </p>
          </div>
        </div>
        
        <div className={`px-3 py-1 rounded-full text-xs font-medium ${
          isCompleted 
            ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
            : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
        }`}>
          {isCompleted ? 'Complete' : 'Pending'}
        </div>
      </div>

      {/* Medication Section - Enhanced */}
      <div className="mb-6">
        <div className="bg-gray-700/50 rounded-lg p-4 border border-gray-600">
          <label className="flex items-center space-x-3 cursor-pointer group">
            <div className="relative">
              <input
                type="checkbox"
                checked={medicationTaken}
                onChange={(e) => setMedicationTaken(e.target.checked)}
                className="sr-only"
              />
              <div className={`w-6 h-6 sm:w-7 sm:h-7 rounded-lg border-2 flex items-center justify-center transition-all duration-200 ${
                medicationTaken 
                  ? 'bg-gradient-to-r from-yellow-500 to-red-500 border-yellow-500 scale-110' 
                  : 'border-gray-500 hover:border-gray-400 group-hover:scale-105'
              }`}>
                {medicationTaken && (
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg transition-all ${
                medicationTaken ? 'bg-yellow-500/20' : 'bg-gray-600/50'
              }`}>
                <Pill className={`h-5 w-5 sm:h-6 sm:w-6 transition-colors ${
                  medicationTaken ? 'text-yellow-500' : 'text-gray-400'
                }`} />
              </div>
              <div>
                <span className="text-sm sm:text-base text-white font-semibold">VitaRise Taken Today</span>
                <p className="text-xs text-gray-400">Mark when you've taken your daily dose</p>
              </div>
            </div>
          </label>
        </div>
      </div>

      {/* Symptoms Section - Enhanced */}
      <div className="mb-6">
        <h4 className="text-base sm:text-lg font-semibold text-white mb-4 flex items-center">
          <Zap className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-500 mr-2" />
          How are you feeling today?
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {Object.entries(symptoms).map(([key, value]) => {
            const Icon = symptomIcons[key as keyof typeof symptomIcons];
            const label = symptomLabels[key as keyof typeof symptomLabels];
            
            return (
              <div key={key} className="bg-gray-700/30 rounded-lg p-3 border border-gray-600/50">
                <div className="flex items-center space-x-2 mb-3">
                  <Icon className="h-4 w-4 text-gray-300" />
                  <label className="text-sm font-medium text-gray-200">{label}</label>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-xs text-gray-400 w-4">1</span>
                  <div className="flex-1 relative">
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={value}
                      onChange={(e) => setSymptoms(prev => ({ ...prev, [key]: parseInt(e.target.value) }))}
                      className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
                    />
                  </div>
                  <span className="text-xs text-gray-400 w-6">10</span>
                  <div className="bg-gradient-to-r from-yellow-500 to-red-500 text-white text-xs font-bold px-2 py-1 rounded min-w-[24px] text-center">
                    {value}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Performance Section - Enhanced */}
      <div className="mb-6">
        <div className="bg-gray-700/30 rounded-lg p-4 border border-gray-600/50">
          <h4 className="text-base sm:text-lg font-semibold text-white mb-3 flex items-center">
            <Heart className="h-4 w-4 sm:h-5 sm:w-5 text-red-500 mr-2" />
            Sexual Performance
            <span className="text-xs text-gray-400 ml-2">(optional)</span>
          </h4>
          <div className="flex items-center space-x-3">
            <span className="text-xs text-gray-400 w-4">0</span>
            <div className="flex-1 relative">
              <input
                type="range"
                min="0"
                max="10"
                value={performance}
                onChange={(e) => setPerformance(parseInt(e.target.value))}
                className="w-full h-3 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
              />
            </div>
            <span className="text-xs text-gray-400 w-6">10</span>
            <div className="bg-gradient-to-r from-red-500 to-red-600 text-white text-sm font-bold px-3 py-1 rounded min-w-[32px] text-center">
              {performance}
            </div>
          </div>
        </div>
      </div>

      {/* Notes Section - Enhanced */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-200 mb-3">
          Personal Notes
          <span className="text-xs text-gray-400 ml-2">(optional)</span>
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="How was your day? Any observations or improvements you noticed?"
          rows={3}
          className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-400 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 transition-all resize-none"
        />
      </div>

      {/* Save Button - Enhanced */}
      <button
        onClick={handleSave}
        disabled={isSaved}
        className={`w-full font-semibold py-4 px-6 rounded-lg transition-all duration-200 transform text-base ${
          isSaved
            ? 'bg-green-600 text-white scale-105'
            : 'bg-gradient-to-r from-yellow-500 to-red-500 text-white hover:from-yellow-600 hover:to-red-600 hover:scale-105 active:scale-95'
        }`}
      >
        {isSaved ? (
          <span className="flex items-center justify-center space-x-2">
            <CheckCircle className="h-5 w-5" />
            <span>Entry Saved!</span>
          </span>
        ) : (
          'Save Today\'s Entry'
        )}
      </button>

      {/* Progress indicator */}
      {isCompleted && (
        <div className="mt-4 p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
          <p className="text-green-400 text-sm text-center font-medium">
            🎉 Great job! You've completed today's entry
          </p>
        </div>
      )}
    </div>
  );
};

export default TodayEntry;