# 🚀 Elite 31-Day Productivity OS (v2.2)

---

### *“Consistency is the New Superpower”*

**Focus OS** is a personal productivity system designed to help you master technical skills through daily execution.  
It blends **learning, discipline, and tracking** into one clean, focused workflow.

👉 Start here: **[Open the Daily Planner →](./Planner.md)**

---

## ⚡ Philosophy: Small Steps, Big Results

This system is built on one idea: **tiny daily improvements compound fast.**

- **No Improvement:**  
  `1.00^365 = 1.00` → No growth
- **1% Daily Improvement:**  
  `1.01^365 = 37.78` → **38× better in a year**
- **10% Daily Improvement:**  
  `1.10^30 = 17.45` → **17× better in 30 days**

**Focus OS targets 10% daily improvement.**

---

## 🎯 What This System Does

- **Centralizes Learning** — MERN, DSA, UI in one dashboard
- **Builds Consistency** — work daily, not randomly
- **Reveals Gaps** — shows exactly what to learn next
- **Aligns Actions with Goals** — daily tasks → long-term wins

---

## 🧠 System Features

| Feature | Description |
|------|------------|
| **Dashboard** | Stats, streaks, and progress |
| **Daily Planner** | Day-by-day execution plan |
| **Learning Tracker** | MERN, DSA, UI progress |
| **Habit Builder** | Communication & confidence |
| **Vocabulary Tools** | Language improvement |
| **Question Tracker** | Knowledge gaps |
| **Milestone Log** | Long-term progress |

---

## 💾 Data Persistence Options

### LocalStorage (Default)
- ✅ Works out of the box, no setup needed
- ✅ Fast and simple
- ⚠️ Data stored in browser only
- ⚠️ Lost if cache is cleared

### MongoDB Integration (Optional)
- ✅ Data persists across devices
- ✅ Multi-device sync
- ✅ Automatic backups
- ✅ Cloud-ready
- ⚠️ Requires backend setup (5 minutes)

**Want MongoDB?** → Read the **[MongoDB Setup Guide →](./docs/MONGODB_SETUP.md)**

Quick start with MongoDB:
```bash
# Option 1: Use start script
.\scripts\start.bat

# Option 2: Manual start
cd backend && npm install && npm run dev
cd Main && npm run dev
```

The app automatically detects MongoDB and switches modes. No MongoDB? It falls back to localStorage seamlessly.

---

## 📂 Project Structure

```text
/
├── README.md               # System overview
├── Planner.md              # Daily planning & routines
└── src
    ├── App.jsx
    ├── components
    │   ├── Header.jsx
    │   ├── Dashboard.jsx
    │   ├── Planner.jsx
    │   ├── Engineering.jsx
    │   ├── Queries.jsx
    │   └── Milestones.jsx
    ├── data
    │   ├── schedules.js
    │   └── syllabus.js
    └── styles
        └── globals.css
