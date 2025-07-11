import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { format, subDays } from 'date-fns';
import { DailyEntry } from '../../types';

interface ProgressChartsProps {
  dailyEntries: DailyEntry[];
}

const ProgressCharts: React.FC<ProgressChartsProps> = ({ dailyEntries }) => {
  // Prepare data for the last 30 days
  const last30Days = Array.from({ length: 30 }, (_, i) => {
    const date = subDays(new Date(), 29 - i);
    const dateStr = format(date, 'yyyy-MM-dd');
    const entry = dailyEntries.find(e => e.date === dateStr);
    
    return {
      date: format(date, 'MM/dd'),
      fullDate: dateStr,
      medicationTaken: entry?.medicationTaken ? 1 : 0,
      performance: entry?.performance || 0,
      energy: entry?.symptoms.energy || 0,
      libido: entry?.symptoms.libido || 0,
      rigidity: entry?.symptoms.rigidity || 0,
      selfEsteem: entry?.symptoms.selfEsteem || 0
    };
  });

  // Weekly average data
  const weeklyData = [];
  for (let i = 0; i < 4; i++) {
    const weekStart = i * 7;
    const weekEnd = weekStart + 7;
    const weekEntries = last30Days.slice(weekStart, weekEnd);
    
    const avgPerformance = weekEntries.reduce((acc, e) => acc + e.performance, 0) / weekEntries.length;
    const avgEnergy = weekEntries.reduce((acc, e) => acc + e.energy, 0) / weekEntries.length;
    const avgLibido = weekEntries.reduce((acc, e) => acc + e.libido, 0) / weekEntries.length;
    const medicationCompliance = (weekEntries.reduce((acc, e) => acc + e.medicationTaken, 0) / weekEntries.length) * 100;
    
    weeklyData.push({
      week: `Week ${i + 1}`,
      performance: Math.round(avgPerformance * 10) / 10,
      energy: Math.round(avgEnergy * 10) / 10,
      libido: Math.round(avgLibido * 10) / 10,
      compliance: Math.round(medicationCompliance)
    });
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Medication Compliance */}
      <div className="bg-gray-800 rounded-xl p-4 sm:p-6 border border-gray-700">
        <h3 className="text-lg sm:text-xl font-semibold text-white mb-4 sm:mb-6">Treatment Adherence (30 days)</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={last30Days}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis 
              dataKey="date" 
              stroke="#9CA3AF"
              fontSize={10}
              interval="preserveStartEnd"
            />
            <YAxis 
              stroke="#9CA3AF"
              fontSize={10}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1F2937',
                border: '1px solid #374151',
                borderRadius: '8px',
                color: '#F9FAFB',
                fontSize: '12px'
              }}
              formatter={(value: number) => [
                value === 1 ? 'Yes' : 'No',
                'Medication Taken'
              ]}
            />
            <Bar 
              dataKey="medicationTaken" 
              fill="url(#medicationGradient)"
              radius={[2, 2, 0, 0]}
            />
            <defs>
              <linearGradient id="medicationGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#EAB308" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#DC2626" stopOpacity={0.8}/>
              </linearGradient>
            </defs>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Performance Evolution */}
      <div className="bg-gray-800 rounded-xl p-4 sm:p-6 border border-gray-700">
        <h3 className="text-lg sm:text-xl font-semibold text-white mb-4 sm:mb-6">Performance Evolution</h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={last30Days}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis 
              dataKey="date" 
              stroke="#9CA3AF"
              fontSize={10}
              interval="preserveStartEnd"
            />
            <YAxis 
              domain={[0, 10]}
              stroke="#9CA3AF"
              fontSize={10}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1F2937',
                border: '1px solid #374151',
                borderRadius: '8px',
                color: '#F9FAFB',
                fontSize: '12px'
              }}
            />
            <Line 
              type="monotone" 
              dataKey="performance" 
              stroke="#DC2626" 
              strokeWidth={2}
              dot={{ fill: '#DC2626', strokeWidth: 2, r: 3 }}
              activeDot={{ r: 5, stroke: '#DC2626', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Symptoms Evolution */}
      <div className="bg-gray-800 rounded-xl p-4 sm:p-6 border border-gray-700">
        <h3 className="text-lg sm:text-xl font-semibold text-white mb-4 sm:mb-6">Symptoms Evolution</h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={last30Days}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis 
              dataKey="date" 
              stroke="#9CA3AF"
              fontSize={10}
              interval="preserveStartEnd"
            />
            <YAxis 
              domain={[1, 10]}
              stroke="#9CA3AF"
              fontSize={10}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1F2937',
                border: '1px solid #374151',
                borderRadius: '8px',
                color: '#F9FAFB',
                fontSize: '12px'
              }}
            />
            <Line type="monotone" dataKey="energy" stroke="#EAB308" strokeWidth={2} name="Energy" />
            <Line type="monotone" dataKey="libido" stroke="#DC2626" strokeWidth={2} name="Libido" />
            <Line type="monotone" dataKey="rigidity" stroke="#7C3AED" strokeWidth={2} name="Rigidity" />
            <Line type="monotone" dataKey="selfEsteem" stroke="#059669" strokeWidth={2} name="Self-Esteem" />
          </LineChart>
        </ResponsiveContainer>
        
        <div className="flex flex-wrap gap-3 sm:gap-4 mt-4 justify-center">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span className="text-xs sm:text-sm text-gray-300">Energy</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span className="text-xs sm:text-sm text-gray-300">Libido</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
            <span className="text-xs sm:text-sm text-gray-300">Rigidity</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-xs sm:text-sm text-gray-300">Self-Esteem</span>
          </div>
        </div>
      </div>

      {/* Weekly Summary */}
      <div className="bg-gray-800 rounded-xl p-4 sm:p-6 border border-gray-700">
        <h3 className="text-lg sm:text-xl font-semibold text-white mb-4 sm:mb-6">Weekly Summary</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={weeklyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis 
              dataKey="week" 
              stroke="#9CA3AF"
              fontSize={10}
            />
            <YAxis 
              stroke="#9CA3AF"
              fontSize={10}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1F2937',
                border: '1px solid #374151',
                borderRadius: '8px',
                color: '#F9FAFB',
                fontSize: '12px'
              }}
            />
            <Bar dataKey="compliance" fill="#EAB308" name="Adherence (%)" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ProgressCharts;