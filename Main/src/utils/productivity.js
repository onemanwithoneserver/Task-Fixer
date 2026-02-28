// src/utils/productivity.js
export const calculateProductivity = (state) => {
  // Planner Logic: (Done tasks / Total tasks) * 100
  const totalTasks = state.planner?.length || 0;
  const doneTasks = state.planner?.filter(t => t.done).length || 0;
  const plannerScore = totalTasks === 0 ? 0 : Math.round((doneTasks / totalTasks) * 100);

  // Knowledge Debt: Count of unresolved queries
  const debtScore = state.queries?.filter(q => !q.resolved).length || 0;

  // Global Score: Average of Planner and Habit consistency
  const habitScore = state.communication?.habits?.filter(h => h.done).length || 0;
  const totalHabits = state.communication?.habits?.length || 1;
  const habitPercent = Math.round((habitScore / totalHabits) * 100);

  return {
    global: Math.round((plannerScore + habitPercent) / 2),
    planner: plannerScore,
    knowledgeDebt: debtScore
  };
};
