import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const usePageTitle = () => {
  const location = useLocation();

  useEffect(() => {
    const pageTitles = {
      '/': 'Dashboard • LakshyaTracker',
      '/planner': 'Daily Planner • LakshyaTracker',
      '/learning-paths': 'Learning Paths • LakshyaTracker',
      '/communication': 'Communication • LakshyaTracker',
      '/queries': 'Knowledge Queries • LakshyaTracker',
      '/milestones': 'Milestones • LakshyaTracker',
      '/todolist': 'Todo List • LakshyaTracker',
      '/moneytracker': 'Money Tracker • LakshyaTracker',
      '/settings': 'Settings • LakshyaTracker',
      '/docs': 'Documentation • LakshyaTracker',
    };

    const title = pageTitles[location.pathname] || 'LakshyaTracker - Your 31-Day Growth System';
    document.title = title;
  }, [location.pathname]);
};
