import React from "react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const DATA = {
  title: "Problem Solving & Logic",
  accent: "text-blue-400",
  topics: [
    {
      name: "How Fast Does Code Run?",
      subtopics: [
        "Big O: A way to describe how code speed changes as data grows",
        "Time: How long code takes to run with different input sizes",
        "Space: How much memory code uses with different input sizes",
        "Average Cost: Looking at typical performance over many operations",
        "Best, Average, and Worst: Understanding different scenarios",
        "Recursive Speed: Calculating how recursive functions perform",
      ],
    },
    {
      name: "Making Things Easy to Use",
      subtopics: [
        "User-Focused Design: Build for what people actually need",
        "Easy to Use: Make sure anyone can figure it out quickly",
        "Stay Consistent: Use familiar patterns people already know",
        "Give Feedback: Let users know what's happening",
        "Prevent Mistakes: Design so errors are hard to make",
        "Error Recovery: Help users fix mistakes easily",
        "Keep it Simple: Don't make users think too hard",
        "Show Gradually: Show info only when needed, not all at once",
        "Include Everyone: Design for people with disabilities too",
        "Best Practices: Follow proven rules that work"
      ],
    },
    {
      name: "Working with Lists (Arrays)",
      subtopics: [
        "Going Through Items: Basic way to check every item in a list",
        "Two Pointers: Use two positions to compare items efficiently",
        "Sliding Window: Look at a moving section of the list",
        "Running Totals: Keep track of sums as you go",
        "In-Place Changes: Modify the list without using extra memory",
        "Using Sorting: Sort first to make other operations easier",
        "Maximum Sum: Find the biggest sum in a section (Kadane's way)",
      ],
    },
    {
      name: "Quick Lookups (Hash Maps)",
      subtopics: [
        "Hash Functions: Convert data into a storage location",
        "Hash Tables: Store pairs of keys and values for fast finding",
        "Handling Collisions: Deal with items that hash to same spot",
        "Maps vs Objects: Different ways to store key-value pairs",
        "Counting Items: Track how many times things appear",
        "Sets: Store unique items and check if something exists",
        "Resizing: Make the storage bigger when it gets full",
      ],
    },
    {
      name: "Linked Lists (Connected Nodes)",
      subtopics: [
        "Single Direction: Each item points to the next one",
        "Two Directions: Each item points forward and backward",
        "Circular: Last item connects back to first",
        "Walking Through: Visit each node one by one",
        "Add & Remove: Put in or take out nodes efficiently",
        "Reversing: Flip the direction of all connections",
        "Two Speed Pointers: Find middle or detect loops (Tortoise & Hare)",
      ],
    },
    {
      name: "Stacks & Queues (Ordering Data)",
      subtopics: [
        "LIFO (Last In, First Out): Stacks work like a stack of plates",
        "FIFO (First In, First Out): Queues work like a line of people",
        "Stack Uses: Undo buttons, checking brackets, backtracking",
        "Queue Types: Double-ended, circular, and priority queues",
        "Monotonic: Keep items in increasing or decreasing order",
        "Building Them: Make stacks and queues using arrays or linked lists",
      ],
    },
    {
      name: "Recursion & Trying Options (Backtracking)",
      subtopics: [
        "Recursion Basics: Function that calls itself with smaller problems",
        "Stop Condition: Know when to stop calling the function",
        "Call Stack: How computer tracks recursive function calls",
        "Backtracking: Try an option, if it doesn't work, go back and try another",
        "Decision Tree: Picture of all possible choices",
        "Pruning: Skip paths you know won't work",
        "All Combinations: Generate every possible arrangement",
      ],
    },
    {
      name: "Finding Things (Searching)",
      subtopics: [
        "Linear Search: Check every item one by one until found",
        "Binary Search: Cut search area in half each time (only works if sorted)",
        "Narrowing Down: Eliminate impossible areas to search faster",
        "Edge Cases: Handle beginning, end, and special situations",
        "Recursive Search: Search by calling function again",
        "Loop Search: Search using a regular loop",
        "Search for Best Answer: Find optimal value in a range",
      ],
    },
    {
      name: "Putting in Order (Sorting)",
      subtopics: [
        "Comparison Sorting: Sort by comparing two items at a time",
        "Bubble Sort: Swap neighbors until everything is in order",
        "Selection Sort: Pick smallest item, move it to front, repeat",
        "Insertion Sort: Build sorted list one item at a time",
        "Merge Sort: Split list in half, sort each half, combine",
        "Quick Sort: Pick a pivot, split around it, sort each side",
        "Special Sorts: Counting, Radix, Bucket for specific number types",
      ],
    },
    {
      name: "Exploring Networks (Graphs)",
      subtopics: [
        "Graph Structure: Store connections using lists or grids",
        "BFS (Breadth-First): Explore level by level, like ripples in water",
        "DFS (Depth-First): Explore one path completely before trying another",
        "Tracking Visited: Remember where you've been to avoid loops",
        "Connected Parts: Find separate groups in the network",
        "Finding Loops: Detect cycles in the connections",
        "Task Ordering: Arrange tasks that depend on each other",
      ],
    },
    {
      name: "Heaps & Priority Queues",
      subtopics: [
        "Heap Rules: Tree where parent is smaller (min) or larger (max) than children",
        "Binary Heap: Store heap in an array for efficiency",
        "Heapify: Keep heap organized when adding or removing items",
        "Priority Queue: Process most important items first",
        "Top K Items: Find the K biggest or smallest items efficiently",
        "Heap Sort: Use heap structure to sort in O(n log n) time",
      ],
    },
    {
      name: "Smart Reusing (Dynamic Programming)",
      subtopics: [
        "Main Idea: Save answers to small problems, reuse them for bigger problems",
        "Repeating Problems: Same small problem appears many times",
        "Building Up: Use solutions to small problems for big solution",
        "Memoization: Save results as you calculate (top-down)",
        "Tabulation: Build table of results from bottom up",
        "State Changes: How one step relates to previous steps",
        "Save Memory: Use less space by only keeping recent results",
      ],
    },
    {
      name: "Greedy Methods (Pick Best Now)",
      subtopics: [
        "Greedy Strategy: Always pick what looks best right now",
        "Local to Global: Make sure best-now choices lead to best-overall",
        "Problem Structure: Type of problem where greedy works",
        "Scheduling Tasks: Pick tasks that don't overlap",
        "Using Resources: Get most value from limited resources",
        "When Greedy Fails: Some problems need different approaches",
        "Huffman Coding: Greedy way to compress data efficiently",
      ],
    },
    {
      name: "Tree Structures",
      subtopics: [
        "Tree Terms: Root, parent, child, leaf, and branches",
        "Binary Tree: Each node has at most two children",
        "Binary Search Tree: Left child smaller, right child bigger",
        "Walking Trees: Inorder, preorder, and postorder ways to visit nodes",
        "Height & Depth: How tall the tree is and how deep each node is",
        "Balanced Trees: Keep tree height small for fast operations",
        "Tries: Special tree for storing and searching words",
      ],
    },
  ],
};

export default function AlgorithmsAndSystemsLogic({ state, setState, stateKey = 'dsa' }) {
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState(() => {
    const init = {};
    DATA.topics.forEach((topic, idx) => {
      init[idx] = false;
    });
    return init;
  });

  // Initialize engineering[stateKey] if empty
  useEffect(() => {
    const learningItems = state?.engineering?.[stateKey] || [];
    if (learningItems.length === 0 && setState) {
      const initialItems = DATA.topics.map((t) => ({
        task: t.name,
        done: false,
        subtopics: t.subtopics.map((st) => ({
          task: st,
          done: false,
        })),
      }));
      
      setState((prev) => ({
        ...prev,
        engineering: {
          ...prev.engineering,
          [stateKey]: initialItems,
        },
      }));
    }
  }, [state, setState, stateKey]);

  const learningItems = state?.engineering?.[stateKey] || [];

  const toggleTopic = (index) => {
    setState((prev) => {
      const items = prev.engineering?.[stateKey] || [];
      const updated = items.map((t, i) => {
        if (i !== index) return t;
        const newDone = !t.done;
        return {
          ...t,
          done: newDone,
          subtopics: t.subtopics.map((st) => ({ ...st, done: newDone })),
        };
      });
      
      return {
        ...prev,
        engineering: {
          ...prev.engineering,
          [stateKey]: updated,
        },
      };
    });
  };

  const toggleSubtopic = (topicIndex, subtopicIndex) => {
    setState((prev) => {
      const items = prev.engineering?.[stateKey] || [];
      const updated = items.map((topic, i) =>
        i === topicIndex
          ? {
              ...topic,
              subtopics: topic.subtopics.map((st, j) =>
                j === subtopicIndex ? { ...st, done: !st.done } : st
              ),
              done: topic.subtopics.every((st, j) =>
                j === subtopicIndex ? !st.done : st.done
              ),
            }
          : topic
      );
      
      return {
        ...prev,
        engineering: {
          ...prev.engineering,
          [stateKey]: updated,
        },
      };
    });
  };

  const toggleExpand = (index) => {
    setExpanded((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const filtered = learningItems
    .map((t, originalIndex) => ({ item: t, originalIndex }))
    .filter(({ item }) =>
      item.task.toLowerCase().includes(search.toLowerCase())
    );

  return (
    <section className="flex flex-col gap-6">
      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="relative group"
      >
        <div className="absolute inset-0 bg-linear-to-br from-blue-500/20 to-cyan-500/10 rounded-3xl blur-xl opacity-60 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="relative flex items-center gap-4 p-1 pl-6 rounded-3xl border border-white/10 bg-slate-900/80 backdrop-blur-xl transition-all focus-within:ring-2 focus-within:ring-blue-500/40 focus-within:border-blue-500/30 shadow-xl">
          <motion.span
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="text-2xl opacity-40 group-focus-within:opacity-100 transition-opacity"
            aria-hidden="true"
          >
            🔍
          </motion.span>
          <input
            type="text"
            placeholder="Search for topics..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent py-4 outline-none text-sm font-medium placeholder:text-slate-500 text-slate-200"
            aria-label="Search topics"
          />
        </div>
      </motion.div>

      {/* Content Card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="relative group"
      >
        <div className="absolute inset-0 bg-linear-to-br from-blue-500/20 to-cyan-500/10 rounded-[2.5rem] blur-2xl opacity-60 group-hover:opacity-100 transition-opacity duration-500" />
        <div
          className="relative rounded-[2.5rem] border border-white/10 bg-slate-900/80 backdrop-blur-xl shadow-2xl overflow-hidden flex flex-col"
          style={{ maxHeight: "75vh" }}
        >
          <div className="flex justify-between items-center px-6 md:px-10 py-6 md:py-8 sticky top-0 bg-slate-900/90 backdrop-blur-xl border-b border-white/10 z-10">
            <div>
              <motion.h3
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="text-xs md:text-sm font-black italic tracking-[0.2em] text-blue-400 mb-2"
              >
                {DATA.title}
              </motion.h3>
              <motion.p
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="text-[10px] text-slate-500 font-bold tracking-wider"
              >
                Learning Checklist
              </motion.p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, type: "spring" }}
                className="text-xs md:text-sm font-mono font-black text-blue-400 bg-blue-500/10 px-4 py-2 rounded-2xl border border-blue-500/30 shadow-lg shadow-blue-500/20"
              >
                {learningItems.filter((t) => t.done).length + learningItems.reduce((sum, t) => sum + t.subtopics.filter(st => st.done).length, 0)} / {learningItems.reduce((sum, t) => sum + 1 + t.subtopics.length, 0)}
              </motion.span>
              <span className="text-[9px] md:text-[10px] font-mono text-slate-500">
                {learningItems.filter((t) => t.done).length}/{learningItems.length} topics · {learningItems.reduce((sum, t) => sum + t.subtopics.filter(st => st.done).length, 0)}/{learningItems.reduce((sum, t) => sum + t.subtopics.length, 0)} items
              </span>
            </div>
          </div>
          <div className="grow overflow-y-auto custom-scroll p-6 md:p-8 space-y-4">
            {filtered.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-20 text-center flex flex-col items-center gap-4 border-2 border-dashed border-white/10 rounded-3xl bg-white/5 backdrop-blur-sm"
              >
                <span className="text-5xl opacity-20">📂</span>
                <p className="text-slate-500 font-medium">No matching topics found.</p>
              </motion.div>
            ) : (
              filtered.map(({ item: t, originalIndex }) => (
                <motion.div
                  key={originalIndex}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: originalIndex * 0.03 }}
                  className={`group rounded-3xl transition-all duration-300 border ${expanded[originalIndex] ? 'bg-white/5 border-white/10 shadow-lg' : 'border-transparent hover:bg-white/5 hover:border-white/5'}`}
                >
                  <div className="flex items-center gap-4 p-5 md:p-6">
                    <input
                      type="checkbox"
                      id={`main-${originalIndex}`}
                      checked={t.done}
                      onChange={() => toggleTopic(originalIndex)}
                      className="w-5 h-5 md:w-6 md:h-6 rounded-lg border-white/20 bg-black/40 text-blue-500 focus:ring-offset-0 focus:ring-blue-500/50 cursor-pointer transition-all hover:scale-110"
                    />
                    <label
                      htmlFor={`main-${originalIndex}`}
                      className={`flex-1 text-sm md:text-base font-bold cursor-pointer transition-all ${t.done ? "line-through text-slate-500 opacity-60" : "text-slate-100"}`}
                    >
                      {t.task}
                    </label>
                    <motion.button
                      type="button"
                      onClick={() => toggleExpand(originalIndex)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className={`p-3 rounded-xl hover:bg-white/10 transition-all ${expanded[originalIndex] ? 'rotate-180 text-blue-400 bg-white/5' : 'text-slate-500'}`}
                      aria-expanded={expanded[originalIndex]}
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </motion.button>
                  </div>
                  <AnimatePresence>
                    {expanded[originalIndex] && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="px-5 md:px-6 pb-5 md:pb-6 ml-8 md:ml-10 space-y-3"
                      >
                        {t.subtopics.map((st, j) => (
                          <motion.div
                            key={j}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: j * 0.02 }}
                            className="relative pl-6 border-l-2 border-white/10 hover:border-blue-500/30 transition-colors"
                          >
                            <div className="flex items-start gap-3 py-2 group/sub">
                              <input
                                type="checkbox"
                                id={`sub-${originalIndex}-${j}`}
                                checked={st.done}
                                onChange={() => toggleSubtopic(originalIndex, j)}
                                className="mt-0.5 w-4 h-4 rounded border-white/20 bg-black/20 text-blue-400 cursor-pointer transition-all hover:scale-110"
                              />
                              <label
                                htmlFor={`sub-${originalIndex}-${j}`}
                                className={`text-xs md:text-sm font-medium cursor-pointer transition-colors leading-relaxed ${st.done ? "line-through text-slate-600" : "text-slate-300 group-hover/sub:text-slate-100"}`}
                              >
                                {st.task}
                              </label>
                            </div>
                          </motion.div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
