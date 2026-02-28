import React from 'react';
import { motion } from 'framer-motion';
import { 
  calculateActualGrowth, 
  analyzeTrends, 
  calculatePeriodSummaries,
  identifyInsights 
} from '../utils/growthCalculator';

const AnalyticsAndTrends = ({ records = [] }) => {
  if (records.length === 0) {
    return (
      <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8 text-center">
        <div className="text-6xl mb-4">📊</div>
        <h3 className="text-xl font-bold text-slate-300 mb-2">No Data Yet</h3>
        <p className="text-slate-500">Start tracking your daily activities to see analytics</p>
      </div>
    );
  }

  const growth = calculateActualGrowth(records);
  const trends = analyzeTrends(records);
  const summaries = calculatePeriodSummaries(records);
  const insights = identifyInsights(records);

  return (
    <div className="space-y-6">
      {/* Compound Growth Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-linear-to-br from-emerald-500/10 to-blue-500/10 border border-emerald-500/30 rounded-2xl p-6"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="text-3xl">📈</div>
          <div>
            <h3 className="text-xl font-bold text-emerald-400">Compound Growth</h3>
            <p className="text-sm text-slate-400">Your improvement multiplier</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <GrowthMetric 
            label="Total Growth" 
            value={`${growth.totalGrowth.toFixed(2)}x`}
            sublabel={`+${growth.growthPercentage.toFixed(1)}%`}
          />
          <GrowthMetric 
            label="Daily Rate" 
            value={`${growth.averageDailyRate.toFixed(2)}%`}
            sublabel="Avg improvement"
          />
          <GrowthMetric 
            label="30-Day Projection" 
            value={`${growth.projectedGrowth.toFixed(2)}x`}
            sublabel={`+${growth.projectedPercentage.toFixed(0)}%`}
          />
          <GrowthMetric 
            label="Days Tracked" 
            value={records.length}
            sublabel="Total records"
          />
        </div>

        {/* Growth Explanation */}
        <div className="mt-4 p-4 bg-slate-900/50 rounded-xl">
          <p className="text-sm text-slate-300">
            With <span className="text-emerald-400 font-bold">{growth.averageDailyRate.toFixed(2)}%</span> daily improvement, 
            you're <span className="text-emerald-400 font-bold">{growth.totalGrowth.toFixed(2)}x</span> better than day 1. 
            In 30 days, you could be <span className="text-blue-400 font-bold">{growth.projectedGrowth.toFixed(2)}x</span> better!
          </p>
        </div>
      </motion.div>

      {/* Trends Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="text-3xl">📊</div>
          <div>
            <h3 className="text-xl font-bold text-fde047">Trends & Patterns</h3>
            <p className="text-sm text-slate-400">Your progress analysis</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TrendCard
            label="Trend Direction"
            value={trends.trend === 'improving' ? '⬆️ Improving' : 
                   trends.trend === 'declining' ? '⬇️ Needs Attention' : '➡️ Stable'}
            detail={`${trends.improvement >= 0 ? '+' : ''}${trends.improvement.toFixed(1)}% change`}
            positive={trends.trend === 'improving'}
          />
          <TrendCard
            label="Consistency"
            value={`${trends.consistency.toFixed(0)}%`}
            detail="Days with >70% completion"
            positive={trends.consistency >= 70}
          />
          <TrendCard
            label="Current Streak"
            value={`${trends.streaks.current} days`}
            detail={`Best: ${trends.streaks.longest} days`}
            positive={trends.streaks.current > 0}
          />
          <TrendCard
            label="Average Score"
            value={`${(trends.overallAverage || 0).toFixed(0)}%`}
            detail={`Recent: ${(trends.recentAverage || 0).toFixed(0)}%`}
            positive={(trends.recentAverage || 0) >= (trends.overallAverage || 0)}
          />
        </div>
      </motion.div>

      {/* Period Summaries */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="text-3xl">📅</div>
          <div>
            <h3 className="text-xl font-bold text-fde047">Period Summaries</h3>
            <p className="text-sm text-slate-400">Weekly & monthly overview</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {summaries.week && (
            <PeriodSummaryCard
              title="This Week"
              summary={summaries.week}
              icon="📅"
            />
          )}
          {summaries.month && (
            <PeriodSummaryCard
              title="This Month"
              summary={summaries.month}
              icon="📆"
            />
          )}
          {summaries.all && (
            <PeriodSummaryCard
              title="All Time"
              summary={summaries.all}
              icon="🏆"
            />
          )}
        </div>
      </motion.div>

      {/* Insights Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        {/* Strengths */}
        <div className="bg-linear-to-br from-emerald-500/10 to-emerald-600/5 border border-emerald-500/30 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl">💪</span>
            <h3 className="text-lg font-bold text-emerald-400">Your Strengths</h3>
          </div>
          <ul className="space-y-2">
            {insights.strengths.map((strength, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-slate-300">
                <span className="text-emerald-400 mt-0.5">✓</span>
                <span>{strength}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Improvement Areas */}
        <div className="bg-linear-to-br from-amber-500/10 to-orange-500/5 border border-amber-500/30 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl">🎯</span>
            <h3 className="text-lg font-bold text-amber-400">Focus Areas</h3>
          </div>
          <ul className="space-y-2">
            {insights.improvements.map((improvement, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-slate-300">
                <span className="text-amber-400 mt-0.5">→</span>
                <span>{improvement}</span>
              </li>
            ))}
          </ul>
        </div>
      </motion.div>
    </div>
  );
};

// Subcomponents
const GrowthMetric = ({ label, value, sublabel }) => (
  <div className="bg-slate-900/50 rounded-xl p-4">
    <p className="text-xs text-slate-400 mb-1">{label}</p>
    <p className="text-2xl font-bold text-fde047 mb-1">{value}</p>
    <p className="text-xs text-slate-500">{sublabel}</p>
  </div>
);

const TrendCard = ({ label, value, detail, positive }) => (
  <div className={`border rounded-xl p-4 ${
    positive ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-slate-700 bg-slate-900/30'
  }`}>
    <p className="text-sm text-slate-400 mb-2">{label}</p>
    <p className={`text-xl font-bold mb-1 ${positive ? 'text-emerald-400' : 'text-slate-300'}`}>
      {value}
    </p>
    <p className="text-xs text-slate-500">{detail}</p>
  </div>
);

const PeriodSummaryCard = ({ title, summary, icon }) => (
  <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-4">
    <div className="flex items-center gap-2 mb-3">
      <span className="text-xl">{icon}</span>
      <h4 className="font-bold text-slate-200">{title}</h4>
    </div>
    <div className="space-y-2 text-sm">
      <div className="flex justify-between">
        <span className="text-slate-400">Days:</span>
        <span className="text-slate-200 font-semibold">{summary.days}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-slate-400">Tasks:</span>
        <span className="text-emerald-400 font-semibold">{summary.tasksCompleted}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-slate-400">Habits:</span>
        <span className="text-blue-400 font-semibold">{summary.habitsCompleted}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-slate-400">Learning:</span>
        <span className="text-purple-400 font-semibold">{summary.learningItemsCompleted}</span>
      </div>
      <div className="flex justify-between pt-2 border-t border-slate-700">
        <span className="text-slate-400">Avg Score:</span>
        <span className="text-fde047 font-bold">{summary.averageCompletion.toFixed(0)}%</span>
      </div>
    </div>
  </div>
);

export default AnalyticsAndTrends;
