import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const DATA = {
  title: "Making Websites Work for Everyone",
  accent: "text-orange-400",
  topics: [
    {
      name: "Getting Started",
      subtopics: [
        "Types of Disabilities: Vision, Hearing, Movement, Thinking, and Brain-related",
        "Tools People Use: Screen readers, Voice control, Magnifiers, and more",
        "Core Ideas: Make it See-able, Use-able, Understandable, and Reliable",
        "Testing Methods: Testing by hand, Using tools, or Both",
        "Quality vs Rules: Following rules AND making it easy to use",
        "Test Early: Check accessibility while designing and building",
      ],
    },
    {
      name: "Tools People Use",
      subtopics: [
        {
          name: "Screen Reader Shortcuts (Desktop)",
          subtopics: [
            "NVDA (Windows): Insert+Space (Switch modes), Insert+F7 (List items), Control+Home (Go to top)",
            "JAWS (Windows): Insert+F7 (Show links), Insert+F6 (Show headings), Insert+CTRL+B (Show buttons)",
            "Narrator (Windows): Caps Lock+Backspace (Search), Caps Lock+F1 (Show commands)",
            "VoiceOver (Mac): VO(Control+Option)+Space (Click), VO+U (Menu), VO+Arrows (Move around)",
          ]
        },
        {
          name: "Phone Screen Readers",
          subtopics: [
            "TalkBack (Android): Swipe to move, Double tap to click, 3-finger tap for menu",
            "VoiceOver (iPhone): Swipe to move, 2-finger turn for menu, 3-finger swipe to scroll",
            "Focus Management: Make sure focus moves correctly in popups and menus",
          ]
        },
        {
          name: "Basic Testing Steps",
          subtopics: [
            "Keyboard Use: Check Tab key order, visible focus, and no keyboard traps",
            "Color Contrast: Use tools to check text is readable (4.5:1 ratio minimum)",
            "Button Size: Make sure buttons are big enough to tap (44x44 pixels)",
            "Page Structure: Check headings go in order (H1, H2, H3) and sections are labeled",
          ]
        },
        {
          name: "Testing Both Ways",
          subtopics: [
            "Quick Scans: Use Axe or Lighthouse to find 30-40% of problems quickly",
            "Manual Testing: Try using the site with only keyboard for important tasks",
            "Screen Reader Check: Make sure labels and messages are announced correctly",
            "Real User Testing: Get feedback from people with disabilities",
          ]
        },
        {
          name: "Tracking Problems",
          subtopics: [
            "Priority Levels: Mark bugs as Blocker, Critical, Serious, or Small",
            "Writing Reports: Explain what should happen vs what actually happens",
            "Checking Fixes: Test again after developers fix the problems",
          ]
        }
      ],
    },
    {
      name: "Web Accessibility Rules (WCAG)",
      subtopics: [
        {
          name: "Rule 1: People Can See and Hear It",
          rules: [
            "1.1.1 Add text for images and buttons",
            "1.2.1 Provide text version of audio/video",
            "1.2.2 Add captions to videos",
            "1.2.3 Describe what's happening in videos",
            "1.2.4 Add captions to live streams",
            "1.2.5 Describe videos in detail",
            "1.3.1 Use proper HTML tags",
            "1.3.2 Content should be in the right order",
            "1.3.3 Don't rely only on color or position",
            "1.3.4 Work in portrait and landscape",
            "1.3.5 Label form fields properly",
            "1.4.1 Don't use only color to show meaning",
            "1.4.2 Let users stop auto-playing audio",
            "1.4.3 Text must be readable (good contrast)",
            "1.4.4 Text can be resized without breaking",
            "1.4.5 Use real text, not text in images",
            "1.4.10 Content works at 400% zoom",
            "1.4.11 Buttons and controls are visible",
            "1.4.12 Text spacing can be adjusted",
            "1.4.13 Popups can be dismissed easily",
          ]
        },
        {
          name: "Rule 2: People Can Use It",
          rules: [
            "2.1.1 Everything works with keyboard",
            "2.1.2 Keyboard doesn't get stuck",
            "2.1.4 Keyboard shortcuts can be turned off",
            "2.2.1 Give enough time to read and use",
            "2.2.2 Users can pause moving content",
            "2.4.1 Skip to main content easily",
            "2.4.2 Pages have clear titles",
            "2.4.3 Tab key moves in logical order",
            "2.4.4 Link text explains where it goes",
            "2.4.5 Multiple ways to find pages",
            "2.4.6 Headings and labels are clear",
            "2.4.7 Show where keyboard focus is",
            "2.4.11 Focus indicator is visible",
            "2.5.1 Don't require complex gestures",
            "2.5.2 Actions happen on release, not press",
            "2.5.3 Button label matches visible text",
            "2.5.4 Don't require shaking device",
            "2.5.7 Provide alternatives to dragging",
            "2.5.8 Buttons are big enough to tap",
          ]
        },
        {
          name: "Rule 3: People Can Understand It",
          rules: [
            "3.1.1 Set the page language",
            "3.1.2 Mark text in other languages",
            "3.2.1 Focus doesn't trigger surprises",
            "3.2.2 Typing doesn't trigger surprises",
            "3.2.3 Navigation is in same place",
            "3.2.4 Same things look the same",
            "3.2.6 Help is easy to find",
            "3.3.1 Clearly show errors",
            "3.3.2 Label all form fields",
            "3.3.3 Suggest how to fix errors",
            "3.3.4 Confirm before important actions",
            "3.3.7 Don't ask for same info twice",
            "3.3.8 Login should be simple",
          ]
        },
        {
          name: "Rule 4: Works with All Tools",
          rules: [
            "4.1.1 Use valid HTML (old rule)",
            "4.1.2 All controls have names and roles",
            "4.1.3 Announce status messages",
          ]
        }
      ],
    },
    {
      name: "ARIA - Extra Help for Websites",
      subtopics: [
        {
          name: "What is ARIA?",
          subtopics: [
            "What it is: Special code to help screen readers understand websites",
            "Why use it: When normal HTML isn't enough",
            "How it works: Adds extra info for assistive tools",
            "Golden Rule: Use normal HTML first (like <button>), only use ARIA when needed",
            "Important: ARIA only helps screen readers, doesn't change how site works",
          ]
        },
        {
          name: "ARIA for Controls",
          rules: [
            "aria-autocomplete (shows suggestions)", "aria-checked (checkbox/radio state)", "aria-disabled (can't use)", "aria-errormessage (link to error)",
            "aria-expanded (open or closed)", "aria-haspopup (opens menu/dialog)", "aria-hidden (hide from screen readers)", "aria-invalid (has error)",
            "aria-label (button name)", "aria-level (heading level)", "aria-modal (popup/dialog)", "aria-multiline (multi-line text)",
            "aria-multiselectable (select many)", "aria-orientation (horizontal/vertical)", "aria-placeholder (hint text)",
            "aria-pressed (toggle state)", "aria-readonly (can't edit)", "aria-required (must fill out)", "aria-selected (currently selected)",
            "aria-sort (sorted order)", "aria-valuemax (max number)", "aria-valuemin (min number)", "aria-valuenow (current number)", "aria-valuetext (number as text)"
          ]
        },
        {
          name: "ARIA for Updates",
          rules: [
            "aria-live: Tell screen readers about updates (polite or urgent)",
            "aria-busy: Show when something is loading",
            "aria-relevant: What changes to announce (new items, removed items)",
            "aria-atomic: Read whole section or just the change",
          ]
        },
        {
          name: "ARIA for Relationships",
          rules: [
            "aria-labelledby: Point to the label for this control",
            "aria-describedby: Point to more details or error message",
            "aria-controls: This controls that other thing",
            "aria-owns: Parent-child relationship",
            "aria-activedescendant: Where focus is in a list",
            "aria-posinset & aria-setsize: Item position in a list (item 3 of 10)",
            "aria-colcount, aria-rowcount, aria-colspan, aria-rowspan: Table info",
            "aria-flowto (reading order)", "aria-details (link to details)", "aria-description (short description)"
          ]
        },
        {
          name: "ARIA You Can Use Anywhere",
          rules: [
            "aria-atomic", "aria-busy", "aria-controls", "aria-current (current page/step)",
            "aria-describedby", "aria-description", "aria-details", "aria-disabled",
            "aria-dropeffect (old)", "aria-errormessage", "aria-flowto", "aria-grabbed (old)",
            "aria-haspopup", "aria-hidden", "aria-invalid", "aria-keyshortcuts",
            "aria-label", "aria-labelledby", "aria-live", "aria-owns",
            "aria-relevant", "aria-roledescription"
          ]
        },
        {
          name: "Old ARIA (Don't Use)",
          rules: [
            "aria-dropeffect (Outdated)",
            "aria-grabbed (Outdated)"
          ]
        }
      ],
    },
    {
      name: "Common Website Patterns",
      subtopics: [
        {
          name: "Navigation & Layout",
          rules: [
            "Accordion: Click to show/hide sections",
            "Breadcrumb: Links showing where you are (Home > Products > Shoes)",
            "Carousel: Slideshow that moves through images",
            "Feed: Content that loads as you scroll (like social media)",
            "Landmarks: Page sections (header, main, footer)",
            "Link: Clickable text that takes you somewhere",
            "Tabs: Click to switch between different panels",
            "Tree View: Folder-like structure you can expand/collapse"
          ]
        },
        {
          name: "Buttons & Form Controls",
          rules: [
            "Button: Click to do something",
            "Checkbox: Check or uncheck boxes (can select many)",
            "Combobox: Dropdown list you can type in",
            "Listbox: List where you can pick options",
            "Menu & Menubar: Lists of actions (like File menu)",
            "Menu Button: Button that opens a menu",
            "Radio Group: Circle buttons (can only pick one)",
            "Slider: Drag to choose a value (like volume control)",
            "Spinbutton: Click up/down arrows to change number",
            "Switch: Toggle between on and off"
          ]
        },
        {
          name: "Popups & Messages",
          rules: [
            "Dialog (Modal): Popup window that covers the page",
            "Alert: Important message that grabs attention",
            "Alert Dialog: Popup asking you to confirm something",
            "Disclosure: Click to expand and read more",
            "Tooltip: Small popup with helpful info on hover"
          ]
        },
        {
          name: "Data Display",
          rules: [
            "Grid: Table where you can edit and interact",
            "Table: Table showing data (can't edit)",
            "Treegrid: Table with expandable rows",
            "Meter: Visual bar showing a value (like progress)",
            "Toolbar: Row of buttons and controls",
            "Window Splitter: Drag to resize sections"
          ]
        },
        {
          name: "Key Rules",
          rules: [
            "Most Important: Use normal HTML first, ARIA only when needed",
            "Keyboard: Everything must work with Tab, Arrow, Enter, and Esc keys",
            "ARIA Attributes: Add the right ARIA code for each pattern"
          ]
        }
      ],
    },
    {
      name: "Coding for Accessibility",
      subtopics: [
        {
          name: "Managing Focus in React",
          rules: [
            "useRef Hook: Use to move focus to specific elements",
            "useEffect for Page Changes: Move focus to top when page changes",
            "Focus Trapping: Keep focus inside popups and modals",
            "Restoring Focus: Move focus back to button after closing popup",
            "Managing .blur(): Handle clicking outside without breaking keyboard use",
          ]
        },
        {
          name: "Keyboard Events",
          rules: [
            "Keyboard Callbacks: Make Enter and Space work on custom buttons",
            "Preventing Default: Stop page from scrolling on arrow keys when needed",
            "Tab Index: Use tabIndex={0} for keyboard focus, tabIndex={-1} for code-only focus",
            "Form Submission: Move focus to errors when form has mistakes",
          ]
        },
        {
          name: "Dynamic Content & Updates",
          rules: [
            "ARIA Live Regions: Announce success/error messages to screen readers",
            "Loading States: Tell screen readers when data is loading",
            "Conditional Rendering: Update ARIA when React state changes",
            "Page Transitions: Announce when page changes in single-page apps",
          ]
        },
        {
          name: "Advanced Browser Features",
          rules: [
            "Intersection Observer: Load content only when visible for better performance",
            "MatchMedia API: Detect if user prefers less motion or dark mode",
            "Mutation Observer: Watch for changes in third-party code",
            "Custom Hooks: Build reusable code for common accessibility needs",
          ]
        },
        {
          name: "Full-Stack Accessibility",
          rules: [
            "Server-Side Rendering: Make sure HTML is good before React loads",
            "Database Alt Text: Require alt text for all images in database",
            "Component Libraries: Check that UI libraries are accessible",
          ]
        }
      ],
    },
    {
      name: "Testing & Legal Stuff",
      subtopics: [
        {
          name: "How to Test",
          rules: [
            "Manual Testing: Try using site with only keyboard",
            "Screen Reader Testing: Test with NVDA, JAWS, and VoiceOver",
            "Automated Scanning: Use Axe and Lighthouse to scan pages",
            "Color & Contrast: Check text is readable (4.5:1 minimum)",
            "Color Blindness: Test how it looks for color-blind users",
            "Code Review: Check HTML structure and headings",
            "Mobile Testing: Check button sizes and gestures",
            "Zoom Testing: Test up to 400% zoom still works",
          ]
        },
        {
          name: "Laws & Standards",
          rules: [
            "WCAG 2.0/2.1/2.2: The main web accessibility rules",
            "ADA (USA): Americans with Disabilities Act - can get sued",
            "EAA (Europe): European law coming June 2025",
            "Section 508: Required for US government sites",
            "CVAA: Rules for video and communication",
            "AODA (Canada): Ontario's accessibility law",
            "EN 301 549: European buying standard",
            "IS 17800: India's accessibility standard",
          ]
        },
        {
          name: "Reports & Documentation",
          rules: [
            "VPAT: Document showing accessibility status",
            "ACR: Official accessibility report",
            "Security Reports: Include accessibility in security testing",
            "Accessibility Statement: Public page about your compliance",
            "Executive Summary: Short report for managers",
            "Fix Plan: List what to fix first based on importance",
            "Regression Testing: Make sure old fixes still work",
          ]
        },
        {
          name: "Quality & Risk",
          rules: [
            "Quality Gates: Block code with serious accessibility bugs",
            "Third-Party Check: Make sure plugins are accessible",
            "Legal Risk: Know how to handle lawsuits",
            "Design Review: Check accessibility before coding",
            "User Testing: Get feedback from people with disabilities",
            "Ongoing Testing: Always test, not just once",
          ]
        }
      ],
    },
  ],
};

export default function AccessibilityTesting() {
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState({});
  const [expandedPrinciples, setExpandedPrinciples] = useState({});
  
  const [state, setState] = useState(() =>
    DATA.topics.map((t) => ({
      task: t.name,
      done: false,
      subtopics: t.subtopics.map((st) => {
        if (typeof st === 'string') {
          return {
            task: st,
            done: false,
          };
        } else if (st.rules) {
          return {
            task: st.name,
            done: false,
            rules: st.rules.map((rule) => ({
              task: rule,
              done: false,
            })),
          };
        } else if (st.subtopics) {
          return {
            task: st.name,
            done: false,
            subtopics: st.subtopics.map((nestedSt) => ({
              task: nestedSt,
              done: false,
            })),
          };
        }
        return {
          task: st.name || st,
          done: false,
        };
      }),
    }))
  );

  const toggleTopic = (index) => {
    setState((prev) =>
      prev.map((t, i) => {
        if (i !== index) return t;
        const newDone = !t.done;
        return {
          ...t,
          done: newDone,
          subtopics: t.subtopics.map((st) => ({ ...st, done: newDone })),
        };
      })
    );
  };

  const toggleSubtopic = (topicIndex, subtopicIndex) => {
    setState((prev) =>
      prev.map((topic, i) =>
        i === topicIndex
          ? {
              ...topic,
              subtopics: topic.subtopics.map((st, j) => {
                if (j !== subtopicIndex) return st;
                const newDone = !st.done;
                if (st.rules) {
                  return {
                    ...st,
                    done: newDone,
                    rules: st.rules.map((rule) => ({ ...rule, done: newDone })),
                  };
                }
                if (st.subtopics) {
                  return {
                    ...st,
                    done: newDone,
                    subtopics: st.subtopics.map((nestedSt) => ({ ...nestedSt, done: newDone })),
                  };
                }
                return { ...st, done: newDone };
              }),
              done: topic.subtopics.every((st, j) =>
                j === subtopicIndex ? !st.done : st.done
              ),
            }
          : topic
      )
    );
  };

  const toggleNestedSubtopic = (topicIndex, subtopicIndex, nestedIndex) => {
    setState((prev) =>
      prev.map((topic, i) =>
        i === topicIndex
          ? {
              ...topic,
              subtopics: topic.subtopics.map((st, j) =>
                j === subtopicIndex && st.subtopics
                  ? {
                      ...st,
                      subtopics: st.subtopics.map((nestedSt, k) =>
                        k === nestedIndex ? { ...nestedSt, done: !nestedSt.done } : nestedSt
                      ),
                      done: st.subtopics.every((nestedSt, k) =>
                        k === nestedIndex ? !nestedSt.done : nestedSt.done
                      ),
                    }
                  : st
              ),
              done: topic.subtopics.every((st, j) => {
                if (j === subtopicIndex && st.subtopics) {
                  return st.subtopics.every((nestedSt, k) =>
                    k === nestedIndex ? !nestedSt.done : nestedSt.done
                  );
                }
                return st.done;
              }),
            }
          : topic
      )
    );
  };

  const toggleRule = (topicIndex, subtopicIndex, ruleIndex) => {
    setState((prev) =>
      prev.map((topic, i) =>
        i === topicIndex
          ? {
              ...topic,
              subtopics: topic.subtopics.map((st, j) =>
                j === subtopicIndex && st.rules
                  ? {
                      ...st,
                      rules: st.rules.map((rule, k) =>
                        k === ruleIndex ? { ...rule, done: !rule.done } : rule
                      ),
                      done: st.rules.every((rule, k) =>
                        k === ruleIndex ? !rule.done : rule.done
                      ),
                    }
                  : st
              ),
              done: topic.subtopics.every((st, j) => {
                if (j === subtopicIndex && st.rules) {
                  return st.rules.every((rule, k) =>
                    k === ruleIndex ? !rule.done : rule.done
                  );
                }
                return st.done;
              }),
            }
          : topic
      )
    );
  };

  const toggleExpand = (index) => {
    setExpanded((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const toggleExpandPrinciple = (topicIndex, subtopicIndex) => {
    const key = `${topicIndex}-${subtopicIndex}`;
    setExpandedPrinciples((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const filtered = state
    .map((t, originalIndex) => ({ item: t, originalIndex }))
    .filter(({ item }) =>
      item.task.toLowerCase().includes(search.toLowerCase()) ||
      item.subtopics.some(sub => 
        sub.task.toLowerCase().includes(search.toLowerCase()) ||
        (sub.rules && sub.rules.some(rule => rule.task.toLowerCase().includes(search.toLowerCase()))) ||
        (sub.subtopics && sub.subtopics.some(nestedSt => nestedSt.task.toLowerCase().includes(search.toLowerCase())))
      )
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
        <div className="absolute inset-0 bg-linear-to-br from-orange-500/20 to-amber-500/10 rounded-3xl blur-xl opacity-60 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="relative flex items-center gap-4 p-1 pl-6 rounded-3xl border border-white/10 bg-slate-900/80 backdrop-blur-xl transition-all focus-within:ring-2 focus-within:ring-orange-500/40 focus-within:border-orange-500/30 shadow-xl">
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
        <div className="absolute inset-0 bg-linear-to-br from-orange-500/20 to-amber-500/10 rounded-[2.5rem] blur-2xl opacity-60 group-hover:opacity-100 transition-opacity duration-500" />
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
                className="text-xs md:text-sm font-black italic tracking-[0.2em] text-orange-400 mb-2"
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
                className="text-xs md:text-sm font-mono font-black text-orange-400 bg-orange-500/10 px-4 py-2 rounded-2xl border border-orange-500/30 shadow-lg shadow-orange-500/20"
              >
                {state.filter((t) => t.done).length + state.reduce((sum, t) => sum + t.subtopics.filter(st => st.done).length, 0)} / {state.reduce((sum, t) => sum + 1 + t.subtopics.length, 0)}
              </motion.span>
              <span className="text-[9px] md:text-[10px] font-mono text-slate-500">
                {state.filter((t) => t.done).length}/{state.length} topics · {state.reduce((sum, t) => sum + t.subtopics.filter(st => st.done).length, 0)}/{state.reduce((sum, t) => sum + t.subtopics.length, 0)} items
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
              filtered.map(({ item, originalIndex }) => {
                const topic = item;
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
                        checked={topic.done}
                        onChange={() => toggleTopic(originalIndex)}
                        className="w-5 h-5 md:w-6 md:h-6 rounded-lg border-white/20 bg-black/40 text-orange-500 focus:ring-offset-0 focus:ring-orange-500/50 cursor-pointer transition-all hover:scale-110"
                      />
                      <label
                        htmlFor={`main-${originalIndex}`}
                        className={`flex-1 text-sm md:text-base font-bold cursor-pointer transition-all ${topic.done ? "line-through text-slate-500 opacity-60" : "text-slate-100"}`}
                      >
                        {topic.task}
                      </label>
                      <motion.button
                        type="button"
                        onClick={() => toggleExpand(originalIndex)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className={`p-3 rounded-xl hover:bg-white/10 transition-all ${isExpanded ? 'rotate-180 text-orange-400 bg-white/5' : 'text-slate-500'}`}
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
                          {topic.subtopics.map((sub, subIdx) => {
                            const isPrincipleExpanded = expandedPrinciples[`${originalIndex}-${subIdx}`];
                            const hasNestedContent = sub.rules || sub.subtopics;

                            return (
                              <motion.div
                                key={subIdx}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: subIdx * 0.02 }}
                                className="relative pl-6 border-l-2 border-white/10 hover:border-orange-500/30 transition-colors"
                              >
                                {!hasNestedContent ? (
                                  /* Simple Subtopic */
                                  <div className="flex items-start gap-3 py-2 group/sub">
                                    <input
                                      type="checkbox"
                                      id={`sub-${originalIndex}-${subIdx}`}
                                      checked={sub.done}
                                      onChange={() => toggleSubtopic(originalIndex, subIdx)}
                                      className="mt-0.5 w-4 h-4 rounded border-white/20 bg-black/20 text-orange-400 cursor-pointer transition-all hover:scale-110"
                                    />
                                    <label
                                      htmlFor={`sub-${originalIndex}-${subIdx}`}
                                      className={`text-xs md:text-sm font-medium cursor-pointer transition-colors leading-relaxed ${sub.done ? "line-through text-slate-600" : "text-slate-300 group-hover/sub:text-slate-100"}`}
                                    >
                                      {sub.task}
                                    </label>
                                  </div>
                                ) : (
                                  /* Nested Principle (e.g., WCAG Principles) */
                                  <div className="py-2">
                                    <div className="flex items-center gap-2 group/principle">
                                      <input
                                        type="checkbox"
                                        checked={sub.done}
                                        onChange={() => toggleSubtopic(originalIndex, subIdx)}
                                        className="w-3.5 h-3.5 rounded border-white/20 bg-black/20 text-orange-400 transition-all hover:scale-110 cursor-pointer"
                                      />
                                      <motion.button
                                        onClick={() => toggleExpandPrinciple(originalIndex, subIdx)}
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        className={`text-[10px] transition-transform ${isPrincipleExpanded ? 'rotate-90 text-orange-300' : 'text-slate-600'}`}
                                      >
                                        ▶
                                      </motion.button>
                                      <span className={`text-[11px] font-black tracking-wider ${sub.done ? "text-slate-600" : "text-orange-300/80"}`}>
                                        {sub.task}
                                      </span>
                                    </div>

                                    {/* Deep Nested Rules */}
                                    <AnimatePresence>
                                      {isPrincipleExpanded && (
                                        <motion.div
                                          initial={{ opacity: 0, height: 0 }}
                                          animate={{ opacity: 1, height: "auto" }}
                                          exit={{ opacity: 0, height: 0 }}
                                          transition={{ duration: 0.2 }}
                                          className="grid grid-cols-1 gap-1 mt-2 ml-4"
                                        >
                                          {(sub.rules || sub.subtopics).map((rule, ruleIdx) => (
                                            <label key={ruleIdx} className="flex items-start gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer group/rule">
                                              <input
                                                type="checkbox"
                                                checked={rule.done}
                                                onChange={() => sub.rules 
                                                  ? toggleRule(originalIndex, subIdx, ruleIdx) 
                                                  : toggleNestedSubtopic(originalIndex, subIdx, ruleIdx)
                                                }
                                                className="mt-0.5 w-3 h-3 rounded-sm border-white/10 bg-black/20 text-orange-500 cursor-pointer"
                                              />
                                              <span className={`text-[11px] leading-relaxed ${rule.done ? "line-through text-slate-700" : "text-slate-400 group-hover/rule:text-slate-200"}`}>
                                                {rule.task}
                                              </span>
                                            </label>
                                          ))}
                                        </motion.div>
                                      )}
                                    </AnimatePresence>
                                  </div>
                                )}
                              </motion.div>
                            );
                          })}
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