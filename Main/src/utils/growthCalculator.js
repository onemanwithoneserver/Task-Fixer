// Compound Growth Calculator and Analytics Engine
// Implements 1.01^n growth model and provides comprehensive analytics

/**
 * Calculate compound growth based on consistent daily improvement
 * Formula: Final Value = Initial Value × (1 + growth_rate)^days
 * Default: 1% daily improvement → 1.01^n
 */
export function calculateCompoundGrowth(days, initialValue = 1, growthRate = 0.01) {
  if (days < 0) return initialValue;
  return initialValue * Math.pow(1 + growthRate, days);
}

/**
 * Calculate actual growth based on performance
 * Takes into account completion rates and consistency
 */
export function calculateActualGrowth(records, config = {}) {
  const {
    baseGrowthRate = 0.01,
    taskWeight = 0.4,
    habitWeight = 0.3,
    learningWeight = 0.2,
    consistencyWeight = 0.1
  } = config;

  if (!records || records.length === 0) {
    return {
      totalGrowth: 1,
      growthPercentage: 0,
      averageDailyRate: 0,
      projectedGrowth: 1,
    };
  }

  let cumulativeGrowth = 1;
  const dailyRates = [];

  records.forEach((record) => {
    const taskScore = record.tasksCompleted / Math.max(record.totalTasks, 1);
    const habitScore = record.habitsCompleted / Math.max(record.totalHabits, 1);
    const learningScore = record.learningItemsCompleted / Math.max(record.totalLearningItems || 1, 1);
    const consistencyScore = record.missedDays === 0 ? 1 : 0.7;

    // Weighted performance score
    const performanceScore = (
      taskScore * taskWeight +
      habitScore * habitWeight +
      learningScore * learningWeight +
      consistencyScore * consistencyWeight
    );

    // Adjust growth rate based on performance
    const dailyRate = baseGrowthRate * performanceScore;
    dailyRates.push(dailyRate);

    // Apply compound growth
    cumulativeGrowth *= (1 + dailyRate);
  });

  const averageDailyRate = dailyRates.reduce((sum, rate) => sum + rate, 0) / dailyRates.length;
  const growthPercentage = ((cumulativeGrowth - 1) * 100);

  // Project future growth (30 days)
  const projectedGrowth = cumulativeGrowth * Math.pow(1 + averageDailyRate, 30);

  return {
    totalGrowth: cumulativeGrowth,
    growthPercentage: growthPercentage,
    averageDailyRate: averageDailyRate * 100,
    projectedGrowth: projectedGrowth,
    projectedPercentage: ((projectedGrowth - 1) * 100),
  };
}

/**
 * Analyze trends over time
 */
export function analyzeTrends(records) {
  if (!records || records.length < 2) {
    return {
      trend: 'insufficient_data',
      improvement: 0,
      consistency: 0,
      streaks: { current: 0, longest: 0 },
      recentAverage: 0,
      overallAverage: 0
    };
  }

  // Sort by date
  const sortedRecords = [...records].sort((a, b) => 
    new Date(a.date) - new Date(b.date)
  );

  // Calculate moving average completion rate
  const recentWindow = 7;
  const recentRecords = sortedRecords.slice(-recentWindow);
  const olderRecords = sortedRecords.slice(0, -recentWindow);

  const calculateAvgCompletion = (recs) => {
    if (recs.length === 0) return 0;
    const sum = recs.reduce((acc, r) => {
      const taskRate = r.tasksCompleted / Math.max(r.totalTasks, 1);
      const habitRate = r.habitsCompleted / Math.max(r.totalHabits, 1);
      return acc + (taskRate + habitRate) / 2;
    }, 0);
    return sum / recs.length;
  };

  const recentAvg = calculateAvgCompletion(recentRecords);
  const olderAvg = calculateAvgCompletion(olderRecords);
  const improvement = ((recentAvg - olderAvg) / Math.max(olderAvg, 0.01)) * 100;

  // Calculate consistency (percentage of days with >70% completion)
  const consistentDays = records.filter(r => {
    const completion = (r.tasksCompleted / Math.max(r.totalTasks, 1) + 
                       r.habitsCompleted / Math.max(r.totalHabits, 1)) / 2;
    return completion >= 0.7;
  }).length;
  const consistency = (consistentDays / records.length) * 100;

  // Calculate streaks
  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  sortedRecords.forEach((record, index) => {
    const recordDate = new Date(record.date);
    recordDate.setHours(0, 0, 0, 0);

    const isGoodDay = (r) => {
      const completion = (r.tasksCompleted / Math.max(r.totalTasks, 1) + 
                         r.habitsCompleted / Math.max(r.totalHabits, 1)) / 2;
      return completion >= 0.7;
    };

    if (isGoodDay(record)) {
      tempStreak++;
      longestStreak = Math.max(longestStreak, tempStreak);
      
      // Check if this is part of current streak
      const daysDiff = Math.floor((today - recordDate) / (1000 * 60 * 60 * 24));
      if (daysDiff <= 1) {
        currentStreak = tempStreak;
      }
    } else {
      tempStreak = 0;
    }
  });

  // Determine trend
  let trend = 'stable';
  if (improvement > 10) trend = 'improving';
  else if (improvement < -10) trend = 'declining';

  return {
    trend,
    improvement: improvement,
    consistency: consistency,
    streaks: {
      current: currentStreak,
      longest: longestStreak
    },
    recentAverage: recentAvg * 100,
    overallAverage: calculateAvgCompletion(records) * 100,
  };
}

/**
 * Calculate weekly and monthly summaries
 */
export function calculatePeriodSummaries(records) {
  const now = new Date();
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const filterRecords = (since) => records.filter(r => new Date(r.date) >= since);

  const weekRecords = filterRecords(oneWeekAgo);
  const monthRecords = filterRecords(oneMonthAgo);

  const summarize = (recs) => {
    if (recs.length === 0) return null;

    const totalTasks = recs.reduce((sum, r) => sum + r.tasksCompleted, 0);
    const totalHabits = recs.reduce((sum, r) => sum + r.habitsCompleted, 0);
    const totalLearning = recs.reduce((sum, r) => sum + (r.learningItemsCompleted || 0), 0);
    
    const avgCompletion = recs.reduce((sum, r) => {
      const rate = (r.tasksCompleted / Math.max(r.totalTasks, 1) + 
                   r.habitsCompleted / Math.max(r.totalHabits, 1)) / 2;
      return sum + rate;
    }, 0) / recs.length;

    return {
      days: recs.length,
      tasksCompleted: totalTasks,
      habitsCompleted: totalHabits,
      learningItemsCompleted: totalLearning,
      averageCompletion: avgCompletion * 100,
      totalScore: totalTasks + totalHabits + totalLearning,
    };
  };

  return {
    week: summarize(weekRecords),
    month: summarize(monthRecords),
    all: summarize(records),
  };
}

/**
 * Identify strengths and improvement areas
 */
export function identifyInsights(records) {
  if (!records || records.length < 3) {
    return {
      strengths: ['Start tracking to identify strengths'],
      improvements: ['Complete daily records consistently'],
    };
  }

  const strengths = [];
  const improvements = [];

  // Analyze task completion
  const avgTaskRate = records.reduce((sum, r) => 
    sum + (r.tasksCompleted / Math.max(r.totalTasks, 1)), 0
  ) / records.length;

  if (avgTaskRate >= 0.8) {
    strengths.push(`Excellent task completion (${(avgTaskRate * 100).toFixed(0)}%)`);
  } else if (avgTaskRate < 0.5) {
    improvements.push(`Improve task completion (currently ${(avgTaskRate * 100).toFixed(0)}%)`);
  }

  // Analyze habit consistency
  const avgHabitRate = records.reduce((sum, r) => 
    sum + (r.habitsCompleted / Math.max(r.totalHabits, 1)), 0
  ) / records.length;

  if (avgHabitRate >= 0.8) {
    strengths.push(`Strong habit consistency (${(avgHabitRate * 100).toFixed(0)}%)`);
  } else if (avgHabitRate < 0.5) {
    improvements.push(`Build stronger habits (currently ${(avgHabitRate * 100).toFixed(0)}%)`);
  }

  // Analyze learning progress
  const avgLearningItems = records.reduce((sum, r) => 
    sum + (r.learningItemsCompleted || 0), 0
  ) / records.length;

  if (avgLearningItems >= 3) {
    strengths.push(`Consistent learning (avg ${avgLearningItems.toFixed(1)} items/day)`);
  } else if (avgLearningItems < 1) {
    improvements.push('Focus more on daily learning');
  }

  // Analyze consistency (no missed days)
  const consistentDays = records.filter(r => !r.missedDays).length;
  const consistencyRate = consistentDays / records.length;

  if (consistencyRate >= 0.85) {
    strengths.push(`Excellent tracking consistency (${(consistencyRate * 100).toFixed(0)}%)`);
  } else if (consistencyRate < 0.6) {
    improvements.push('Improve daily tracking consistency');
  }

  // Analyze reflections
  const reflectionCount = records.filter(r => r.reflection && r.reflection.length > 10).length;
  if (reflectionCount / records.length >= 0.7) {
    strengths.push('Great self-reflection practice');
  } else if (reflectionCount / records.length < 0.3) {
    improvements.push('Add daily reflections for better insights');
  }

  return { strengths, improvements };
}

/**
 * Enhanced productivity calculation with historical context
 */
export function calculateEnhancedProductivity(state, historicalRecords = []) {
  // Current day calculation (existing logic)
  const totalTasks = state.planner?.length || 0;
  const doneTasks = state.planner?.filter(t => t.done).length || 0;
  const plannerScore = totalTasks === 0 ? 0 : Math.round((doneTasks / totalTasks) * 100);

  const habitScore = state.communication?.habits?.filter(h => h.done).length || 0;
  const totalHabits = state.communication?.habits?.length || 1;
  const habitPercent = Math.round((habitScore / totalHabits) * 100);

  const debtScore = state.queries?.filter(q => !q.resolved).length || 0;

  // Enhanced with historical context
  const growth = calculateActualGrowth(historicalRecords);
  const trends = analyzeTrends(historicalRecords);
  const summaries = calculatePeriodSummaries(historicalRecords);
  const insights = identifyInsights(historicalRecords);

  return {
    // Current metrics
    global: Math.round((plannerScore + habitPercent) / 2),
    planner: plannerScore,
    habits: habitPercent,
    knowledgeDebt: debtScore,

    // Growth metrics
    growth: {
      total: growth.totalGrowth,
      percentage: growth.growthPercentage,
      daily: growth.averageDailyRate,
      projected: growth.projectedGrowth,
      projectedPercentage: growth.projectedPercentage,
    },

    // Trends
    trends: trends,

    // Summaries
    summaries: summaries,

    // Insights
    insights: insights,

    // Metadata
    totalDaysTracked: historicalRecords.length,
    activeDays: state.cycleDay || 1,
  };
}
