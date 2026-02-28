import { useEffect, useState } from "react";

const STORAGE_KEY = "focus_os_v2";

const initialState = {
  cycleDay: 1,
  streak: 0,

  dayType: "weekday",

  planner: [
    { time: "05:00 – 06:00", task: "Deep Work Session", done: false },
    { time: "06:00 – 07:00", task: "DSA Practice", done: false },
    { time: "19:30 – 20:30", task: "MERN Development", done: false },
    { time: "21:00 – 21:20", task: "Daily Review & Log", done: false },
  ],

  engineering: {
    mern: [],
    dsa: [],
    ui: [],
  },

  communication: {
    habits: [
      { task: "Read Aloud (5 min)", done: false },
      { task: "Mirror Talk", done: false },
      { task: "Shadowing Practice", done: false },
      { task: "Self Review", done: false },
      { task: "Write 5 Vocabulary Sentences", done: false },
    ],
    vault: [],
  },

  queries: [],
  milestones: [],

  dailyStatus: {
    date: null,
    submitted: false,
  },
};

export function useFocusStore() {
  const [state, setState] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : initialState;
  });

  /* 🔁 Auto Persist */
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  return { state, setState };
}
