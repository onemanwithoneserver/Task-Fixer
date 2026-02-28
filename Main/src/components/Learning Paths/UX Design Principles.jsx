import React from "react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const DATA = {
  title: "Product Design & Experience",
  accent: "text-purple-400",
  topics: [
    {
      name: "Design Basics & Rules",
      subtopics: [
        "Design Fundamentals: Balance, alignment, contrast, and spacing",
        "Gestalt Principles: How people group and see things together",
        "Visual Hierarchy: Guiding attention with size, color, and position",
        "Consistency: Making things predictable and easy to learn",
        "Affordances: Making it obvious what users can do",
        "Feedback: Showing users what happened after they act",
        "Fitts's Law: Making buttons the right size and distance",
        "Hick's Law: Reducing choices to speed up decisions",
        "Law of Proximity: Grouping related items close together",
        "Keep it Simple: Removing unnecessary stuff",
      ],
    },
    {
      name: "Visual Layout",
      subtopics: [
        "Grid Systems: Organizing layouts with grids",
        "Golden Ratio: Natural proportions that look good",
        "Typography Scale: Text size hierarchy",
        "Visual Weight: Balancing elements on the page",
      ],
    },
    {
      name: "Text & Readability",
      subtopics: [
        "Typography Basics: Understanding fonts and typefaces",
        "Font Types: Serif, sans-serif, monospace, display",
        "Font Size: Creating readable text hierarchy",
        "Line Height & Spacing: Making text easier to read",
        "Text Alignment: Left, center, right, justified",
        "Contrast & Legibility: Text readable against backgrounds",
        "Responsive Text: Text that adapts to screen size",
        "Readability vs Scanability: Easy to read and skim",
        "Content Density: Not overwhelming users with info",
        "Accessible Text: Supporting people with vision impairments",
      ],
    },
    {
      name: "Color & Contrast",
      subtopics: [
        "Color Basics: Hue, saturation, and brightness",
        "Color Systems: RGB, HEX, and HSL codes",
        "Color Psychology: How colors affect feelings",
        "Color Harmony: Colors that look good together",
        "Contrast Basics: Making elements visually different",
        "Text Contrast: Readable text on backgrounds",
        "Accessibility Standards: Meeting contrast requirements",
        "Color in UI: Using color for emphasis and feedback",
        "Dark Mode: Designing effective dark themes",
        "Color Consistency: Using colors consistently",
      ],
    },
    {
      name: "Mobile & Responsive Design",
      subtopics: [
        "Responsive Basics: Layouts that work on any screen",
        "Mobile-First: Start designing for phones first",
        "Breakpoints: Where layout changes for different sizes",
        "Flexible Layouts: Using grids that stretch",
        "Responsive Text: Text that scales for devices",
        "Touch-Friendly: Designing for fingers, not mice",
        "Mobile Navigation: Menus for small screens",
        "Performance: Making mobile experiences fast",
        "Device Testing: Checking on real devices",
        "Cross-Device Consistency: Same experience everywhere",
      ],
    },
    {
      name: "Understanding Users",
      subtopics: [
        "User Research Basics: Why and how to study users",
        "Research Methods: Interviews, surveys, and observations",
        "User Interviews: Talking to users to learn",
        "Surveys: Collecting feedback from many users",
        "User Pain Points: Problems users face",
        "Behavior Analysis: How users actually use things",
        "Creating Personas: Profiles of typical users",
        "Validating Personas: Making sure personas are real",
        "Empathy Mapping: Understanding user thoughts and feelings",
        "Using Personas: Making decisions based on user needs",
      ],
    },
    {
      name: "User Journeys",
      subtopics: [
        "Journey Basics: Following users step by step",
        "Journey Mapping: Drawing out the user's path",
        "Touchpoints: Where users interact with product",
        "User Goals: What users want to achieve",
        "Pain Points: Problems in the user flow",
        "Emotions: How users feel at each step",
        "Happy Path: The ideal user flow",
        "Edge Cases: Handling unusual situations",
        "Journey Optimization: Making flows better",
        "Feature Mapping: Turning journeys into features",
      ],
    },
    {
      name: "UI Design Basics",
      subtopics: [
        "Visual Layout: Structuring interfaces with grids",
        "Spacing & Alignment: Clean and balanced layouts",
        "Typography in UI: Readable and consistent text",
        "Color Usage: Using color to guide attention",
        "Icons: Designing and using icons well",
        "Components: Building reusable UI elements",
        "Visual Feedback: Hover, active, focus states",
        "Design Consistency: Uniform visual patterns",
        "Clarity: Reducing visual noise",
        "Scalability: Designs that grow with the product",
      ],
    },
    {
      name: "Interaction Design",
      subtopics: [
        "Interaction Basics: How users interact with interfaces",
        "User Input: Clicks, taps, and gestures",
        "Microinteractions: Small interactions that delight",
        "State Changes: Transitions between UI states",
        "Motion & Animation: Using movement for feedback",
        "Interaction Feedback: Confirming user actions",
        "Error Interactions: Helpful responses to errors",
        "Navigation: Moving between screens",
        "Consistency: Predictable behavior everywhere",
        "Performance: Interactions that feel fast",
      ],
    },
    {
      name: "Accessibility for All",
      subtopics: [
        "Accessibility Basics: Usable by people of all abilities",
        "WCAG Guidelines: Accessibility standards",
        "Perceivable: Information visible and audible",
        "Operable: Works with keyboard and assistive tools",
        "Understandable: Clear and predictable",
        "Robust: Supports assistive technologies",
        "Color & Contrast: Sufficient contrast for readability",
        "Keyboard Navigation: Usable without a mouse",
        "Screen Readers: Content structured for assistive tech",
        "Accessible Forms: Inclusive forms and controls",
      ],
    },
    {
      name: "Design Systems",
      subtopics: [
        "Design System Basics: Centralized design decisions",
        "Design Tokens: Reusable values for color, spacing, text",
        "Component Library: Standardized UI components",
        "Pattern Guidelines: Reusable interaction patterns",
        "Built-in Accessibility: Accessibility in all components",
        "Theming: Supporting different themes and variations",
        "Documentation: Clear usage guidelines",
        "Version Control: Managing system changes",
        "Designer-Developer Collaboration: Aligning teams",
        "Scaling: Consistency across large products",
      ],
    },
    {
      name: "Figma Design Tool",
      subtopics: [
        "Figma Basics: Interface, canvas, and core tools",
        "Frames & Layouts: Creating responsive designs",
        "Auto Layout: Building flexible components",
        "Components & Variants: Reusable elements and states",
        "Styles & Tokens: Managing colors and text styles",
        "Constraints: Controlling responsive behavior",
        "Prototyping: Linking screens and interactions",
        "Collaboration: Real-time editing and comments",
        "Design Handoff: Sharing with developers",
        "Version History: Managing changes safely",
      ],
    },
    {
      name: "Prototyping & Testing Ideas",
      subtopics: [
        "Prototyping Basics: Simulating product before building",
        "Low-Fidelity: Quick sketches to test flows",
        "High-Fidelity: Realistic interactive designs",
        "Interaction Flows: Connecting screens",
        "Microinteractions: Showing small details",
        "Animation: Using motion to explain behavior",
        "Prototype Testing: Validating with real users",
        "Iterating: Improving based on feedback",
        "Limitations: What prototypes can't validate",
        "Handoff: Translating to build-ready designs",
      ],
    },
    {
      name: "Usability Testing",
      subtopics: [
        "Testing Basics: Evaluating ease of use",
        "Test Planning: Defining goals and tasks",
        "Moderated Testing: Guided usability sessions",
        "Unmoderated Testing: Observing without guidance",
        "Test Scenarios: Creating realistic tasks",
        "Metrics: Measuring effectiveness and satisfaction",
        "Finding Issues: Detecting usability problems",
        "Analyzing Results: Interpreting findings",
        "Prioritizing: Deciding what to fix first",
        "Iterating: Improving based on insights",
      ],
    },
    {
      name: "Feedback & Improvement",
      subtopics: [
        "Feedback Basics: Role of feedback in improvement",
        "Feedback Sources: Users, stakeholders, analytics",
        "Types of Feedback: Qualitative vs quantitative",
        "Feedback Synthesis: Turning feedback into actions",
        "Iteration Cycles: Refining through improvements",
        "Prioritization: Deciding what to change first",
        "Rapid Iteration: Small, frequent improvements",
        "Validation: Re-testing to confirm improvements",
        "Collaboration: Aligning teams during iteration",
        "Continuous Improvement: Evolving over time",
      ],
    },
    {
      name: "Business Alignment",
      subtopics: [
        "Business Goals: Aligning design with company objectives",
        "Product Vision: Designing toward long-term direction",
        "Stakeholder Alignment: Working with teams",
        "Success Metrics: Measuring design impact",
        "User vs Business Value: Balancing needs and constraints",
        "Constraints & Trade-offs: Designing within limits",
        "Feature Prioritization: Aligning effort with priorities",
        "Market Analysis: Designing with market context",
        "Design ROI: Demonstrating value of design",
        "Design-to-Delivery: Ensuring successful products",
      ],
    },
    {
      name: "Information Architecture",
      subtopics: [
        "IA Basics: Structuring information for usability",
        "Content Inventory: Organizing all content",
        "Content Grouping: Categorizing logically",
        "Navigation Structure: Clear and intuitive navigation",
        "Hierarchy: Relationships between content",
        "Mental Models: Aligning with user expectations",
        "Labeling: Creating clear and meaningful labels",
        "Findability: Making information easy to locate",
        "Sitemap: Visualizing content structure",
        "IA Validation: Testing structure with users",
      ],
    },
    {
      name: "Wireframing",
      subtopics: [
        "Wireframe Basics: Purpose and role of wireframes",
        "Low-Fidelity: Simple layouts focusing on structure",
        "Content Placement: Positioning based on hierarchy",
        "User Flow: Showing navigation and transitions",
        "Layout Patterns: Common interface structures",
        "Annotations: Explaining behavior in wireframes",
        "Iterative Wireframing: Refining through feedback",
        "Validation: Reviewing for usability issues",
        "To Visual Design: Transitioning to full design",
        "Collaboration: Sharing and reviewing with teams",
      ],
    },
    {
      name: "Core UX Principles",
      subtopics: [
        "User-Centered Design: Design around user needs",
        "Usability: Ensuring ease of use",
        "Consistency: Familiar patterns across interfaces",
        "Feedback & Visibility: Keep users informed",
        "Error Prevention: Design to minimize mistakes",
        "Error Recovery: Help users recover from errors",
        "Simplicity: Reducing mental effort",
        "Progressive Disclosure: Show info when needed",
        "Accessibility: Designing for everyone",
        "UX Heuristics: Proven usability guidelines",
      ],
    },
  ],
};

export default function UXDesignPrinciples({ state, setState, stateKey = 'ui' }) {
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
        <div className="absolute inset-0 bg-linear-to-br from-purple-500/20 to-pink-500/10 rounded-3xl blur-xl opacity-60 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="relative flex items-center gap-4 p-1 pl-6 rounded-3xl border border-white/10 bg-slate-900/80 backdrop-blur-xl transition-all focus-within:ring-2 focus-within:ring-purple-500/40 focus-within:border-purple-500/30 shadow-xl">
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
        <div className="absolute inset-0 bg-linear-to-br from-purple-500/20 to-pink-500/10 rounded-[2.5rem] blur-2xl opacity-60 group-hover:opacity-100 transition-opacity duration-500" />
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
                className="text-xs md:text-sm font-black italic tracking-[0.2em] text-purple-400 mb-2"
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
                className="text-xs md:text-sm font-mono font-black text-purple-400 bg-purple-500/10 px-4 py-2 rounded-2xl border border-purple-500/30 shadow-lg shadow-purple-500/20"
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
              filtered.map(({ item: t, originalIndex }) => {
                const isExpanded = expanded[originalIndex];
                return (
                  <motion.div
                    key={originalIndex}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: originalIndex * 0.03 }}
                    className={`group rounded-3xl transition-all duration-300 border ${isExpanded ? 'bg-white/5 border-white/10 shadow-lg' : 'border-transparent hover:bg-white/5 hover:border-white/5'}`}
                  >
                    <div className="flex items-center gap-4 p-5 md:p-6">
                      <input
                        type="checkbox"
                        id={`main-${originalIndex}`}
                        checked={t.done}
                        onChange={() => toggleTopic(originalIndex)}
                        className="w-5 h-5 md:w-6 md:h-6 rounded-lg border-white/20 bg-black/40 text-purple-500 focus:ring-offset-0 focus:ring-purple-500/50 cursor-pointer transition-all hover:scale-110"
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
                        className={`p-3 rounded-xl hover:bg-white/10 transition-all ${isExpanded ? 'rotate-180 text-purple-400 bg-white/5' : 'text-slate-500'}`}
                        aria-expanded={isExpanded}
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </motion.button>
                    </div>
                    <AnimatePresence>
                      {isExpanded && (
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
                              className="relative pl-6 border-l-2 border-white/10 hover:border-purple-500/30 transition-colors"
                            >
                              <div className="flex items-start gap-3 py-2 group/sub">
                                <input
                                  type="checkbox"
                                  id={`sub-${originalIndex}-${j}`}
                                  checked={st.done}
                                  onChange={() => toggleSubtopic(originalIndex, j)}
                                  className="mt-0.5 w-4 h-4 rounded border-white/20 bg-black/20 text-purple-400 cursor-pointer transition-all hover:scale-110"
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
                );
              })
            )}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
