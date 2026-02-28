// src/components/Learning Paths/MERNStack.jsx
import React from "react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const DATA = {
  title: "MERN Stack Web Development",
  accent: "text-emerald-400",
  topics: [
    {
      name: "HTML & CSS Basics",
      subtopics: [
        "HTML Structure: Basic page setup with DOCTYPE, html, head, and body",
        "Text Content: Headings, paragraphs, and text formatting",
        "Links: Creating clickable links to other pages",
        "Images & Media: Adding images, audio, and video",
        "Lists: Bullet points and numbered lists",
        "Tables: Organizing data in rows and columns",
        "Forms: Creating input forms for users",
        "Form Inputs: Text boxes, buttons, and checkboxes",
        "Meta Tags: Settings for mobile and search engines",
        "Semantic HTML: Using meaningful tags for better structure",
        "Page Sections: header, nav, main, section, article, aside, footer",
        "Accessibility Basics: Making websites work for screen readers",
        "SEO Basics: Helping search engines find your site",
        "Form Validation: Checking user input",
        "Validation Rules: Required fields, min/max length, patterns",
        "Input Types: Email, number, date pickers",
        "Browser Validation: Built-in error checking",
        "Custom Error Messages: Helpful feedback for users",
        "CSS Box Model: Content, padding, border, and margin",
        "Box Sizing: How element size is calculated",
        "Display Types: Block, inline elements",
        "Flexbox: Modern way to arrange items in rows/columns",
        "Flex Direction: Horizontal or vertical layout",
        "Flex Alignment: Centering and spacing items",
        "Flex Item Control: Sizing and ordering flex items",
        "Flex Spacing: Gaps between items",
        "CSS Grid: Advanced layout system for 2D grids",
        "Grid Structure: Rows and columns setup",
        "Grid Placement: Positioning items in grid",
        "Responsive Grid: Grids that adapt to screen size",
        "Responsive Design: Making sites work on mobile and desktop",
        "Media Queries: Different styles for different screen sizes",
        "Orientation: Portrait vs landscape handling",
        "Tailwind CSS: Utility classes for fast styling",
        "Tailwind Setup: Installing and configuring Tailwind",
        "Tailwind Text: Font size, weight, and alignment classes",
        "Tailwind Spacing: Margin and padding utilities",
        "Tailwind Colors: Color system and themes",
        "Tailwind Layout: Flexbox and grid utilities",
        "Responsive Classes: Breakpoint-based styling",
        "State Classes: Hover, focus, active states",
        "Dark Mode: Light/dark theme switching",
        "Tailwind Customization: Custom colors and settings",
      ],
    },
    {
      name: "JavaScript Fundamentals",
      subtopics: [
        "What is JavaScript: Programming language that runs in browsers",
        "JavaScript History: How JS evolved over time",
        "Basic Syntax: Writing statements and comments",
        "Code Style: Writing clean, readable code",
        "Variables: Storing data with var, let, and const",
        "Variable Scope: Where variables can be used",
        "Variable Best Practices: Choosing the right declaration",
        "Data Types: Numbers, strings, booleans, objects, arrays",
        "Type Conversion: Changing one type to another",
        "Mutable vs Immutable: Values that can or can't change",
        "Pass by Value/Reference: How data is passed around",
        "Type Checking: Verifying what type of data you have",
        "Operators: Math, comparison, and logic operations",
        "Advanced Operators: Ternary, spread, optional chaining",
        "Operator Order: Which operations happen first",
        "If Statements: Making decisions in code",
        "Boolean Logic: True and false evaluations",
        "Short-Circuiting: Logical shortcuts",
        "Loops: Repeating code with for and while loops",
        "Loop Types: for-in and for-of loops",
        "Loop Control: break and continue",
        "Iterables: Things you can loop through",
        "Functions: Reusable blocks of code",
        "Function Parameters: Passing data to functions",
        "Function Execution: How functions run and return values",
        "Callbacks: Passing functions to other functions",
        "IIFE: Functions that run immediately",
        "Function Design: Writing good, reusable functions",
        "Scope: Where variables are accessible",
        "Scope Chain: How JavaScript finds variables",
        "Closures: Functions that remember their environment",
        "Objects: Collections of related data and functions",
        "this Keyword: Refers to current object context",
        "Object Destructuring: Extracting object properties easily",
        "Getters & Setters: Controlled property access",
        "Object Copying: Shallow vs deep copies",
        "Object Manipulation: Safely updating objects",
        "Arrays: Ordered lists of items",
        "Array Methods: map, filter, reduce, forEach",
        "Array Modification: slice, splice, sort, reverse",
        "Array Best Practices: Avoiding mutations",
        "Strings: Text data",
        "Template Literals: Embedding variables in strings",
        "String Methods: Manipulating text",
        "String Processing: Formatting and pattern matching",
        "Numbers: Numeric data and calculations",
        "Math Object: Built-in math functions",
        "Number Edge Cases: Precision and special values",
        "Dates: Working with dates and time",
        "Error Handling: Catching and dealing with errors",
        "Error Types: Different kinds of JavaScript errors",
        "Execution Context: How JavaScript runs code",
        "Call Stack: Tracking function calls",
        "Async JavaScript: Dealing with delays and API calls",
        "Event Loop: How JavaScript handles asynchronous code",
        "Prototypes: JavaScript's inheritance system",
        "Constructor Functions: Creating objects with functions",
        "Classes: Modern way to create objects",
        "Functional Programming: Pure functions and immutability",
        "Memory Management: How JavaScript handles memory",
        "WeakMap & WeakSet: Special memory-efficient collections",
        "Equality: Loose (==) vs strict (===) comparison",
        "Type Coercion: Automatic type conversions",
        "this Binding: call, apply, bind methods",
        "Advanced Closures: Complex closure patterns",
        "Polyfills: Adding missing JavaScript features",
      ],
    },
    {
      name: "TypeScript (JavaScript with Types)",
      subtopics: [
        "What is TypeScript: JavaScript with type checking",
        "Why TypeScript: Catch errors before runtime",
        "Setup: Installing TypeScript",
        "tsconfig.json: TypeScript settings file",
        "Type Annotations: Adding types to variables",
        "Type Inference: TypeScript guessing types",
        "Basic Types: string, number, boolean, null, undefined",
        "any Type: Opting out of type checking (avoid when possible)",
        "unknown Type: Safer alternative to any",
        "void & never: Special return types",
        "Arrays & Tuples: Typed lists and fixed-length arrays",
        "Object Types: Defining object shapes",
        "Interfaces: Contracts for object structure",
        "Type Aliases: Creating reusable type names",
        "Interfaces vs Type Aliases: When to use each",
        "Optional Properties: Properties that may not exist",
        "Readonly Properties: Properties that can't change",
        "Index Signatures: Dynamic property names",
        "Function Types: Typing function parameters and returns",
        "Function Overloads: Multiple function signatures",
        "Union Types: Multiple possible types with |",
        "Intersection Types: Combining types with &",
        "Literal Types: Exact values as types",
        "Type Narrowing: Refining types in conditions",
        "Type Guards: Checking types at runtime",
        "Discriminated Unions: Pattern matching with types",
        "Generics Basics: Reusable type-safe code",
        "Generic Functions: Functions that work with any type",
        "Generic Interfaces: Interfaces with type parameters",
        "Generic Constraints: Limiting generic types",
        "Generic Classes: Classes with type parameters",
        "Utility Types: Partial, Required, Pick, Omit helpers",
        "Record & Map Types: Dictionary-like structures",
        "Conditional Types: Types that depend on conditions",
        "Mapped Types: Transforming existing types",
        "Template Literal Types: String manipulation at type level",
        "Enum Types: Named constant values",
        "Const Assertions: Creating immutable literal types",
        "Type Assertions: Overriding TypeScript's type inference",
        "Non-null Assertion: Telling TypeScript value is not null",
        "Classes in TypeScript: Typed class properties",
        "Access Modifiers: public, private, protected",
        "Abstract Classes: Base classes that can't be instantiated",
        "Implements Keyword: Ensuring classes match interfaces",
        "Decorators: Metadata and behavior modification",
        "Modules: Organizing code with imports/exports",
        "ES Modules: Import and export with types",
        "Declaration Files: .d.ts files for JavaScript libraries",
        "DefinitelyTyped: Community type definitions",
        "Type Compatibility: How TypeScript compares types",
        "Advanced Types: Complex type compositions",
        "TypeScript with React: Typing React components",
        "TypeScript with Node.js: Backend typing",
        "Strict Mode: Stricter type checking",
        "Migration: Moving from JavaScript to TypeScript",
        "Best Practices: Writing maintainable TypeScript",
        "Common Errors: Understanding type errors",
        "Performance: Compilation speed",
      ],
    },
    {
      name: "React (Frontend Framework)",
      subtopics: [
        "What is React: JavaScript library for building UIs",
        "React Philosophy: Component-based approach",
        "Project Setup: Creating a React app",
        "JSX: HTML-like syntax in JavaScript",
        "Components: Building blocks of React apps",
        "Component Rendering: How React displays components",
        "Props: Passing data from parent to child",
        "Props Best Practices: Immutable data flow",
        "State: Component-local data that can change",
        "useState Hook: Managing state in components",
        "Event Handling: Responding to user clicks and input",
        "Conditional Rendering: Showing/hiding UI based on conditions",
        "List Rendering: Displaying lists of items",
        "Component Lifecycle: Component creation and updates",
        "useEffect Hook: Side effects like API calls",
        "Controlled Components: Forms managed by React",
        "Component Composition: Combining components",
        "Lifting State Up: Sharing state between components",
        "Context API: Passing data without prop drilling",
        "Refs: Accessing DOM elements",
        "Fragments: Grouping elements without extra div",
        "Styling in React: CSS and inline styles",
        "Conditional Styling: Dynamic classes and styles",
        "Performance: Avoiding unnecessary re-renders",
        "Memoization: useMemo and useCallback",
        "Custom Hooks: Reusable logic",
        "Error Handling: Catching runtime errors",
        "Error Boundaries: Catching errors in component trees",
        "React Strict Mode: Development checks",
        "React Best Practices: Writing clean React code",
      ],
    },
    {
      name: "Node.js & Express (Backend)",
      subtopics: [
        "What is Backend: Server-side of web applications",
        "Node.js Basics: JavaScript runtime for servers",
        "Node.js Event Loop: How Node handles async operations",
        "Modules: Organizing code with require and exports",
        "Built-in Modules: fs, path, os, http",
        "NPM: Package manager for installing libraries",
        "Environment Variables: Storing configuration securely",
        "Express.js Basics: Web framework for Node.js",
        "Express Setup: Creating an Express app",
        "Routing: Handling different URLs",
        "HTTP Methods: GET, POST, PUT, DELETE",
        "Request & Response: req and res objects",
        "Middleware: Functions that process requests",
        "Custom Middleware: Creating your own middleware",
        "Error Handling: Catching and responding to errors",
        "REST API Design: Creating RESTful endpoints",
        "JSON: Sending and receiving JSON data",
        "MongoDB Basics: NoSQL document database",
        "MongoDB Data Modeling: Designing database structure",
        "CRUD Operations: Create, Read, Update, Delete",
        "Mongoose Basics: ODM for MongoDB",
        "Schemas & Models: Defining data structure",
        "Database Connection: Connecting Node to MongoDB",
        "Async Database Operations: Handling async queries",
        "Data Validation: Validating input before saving",
        "Authentication Basics: User login system",
        "Password Handling: Hashing passwords securely",
        "Authorization: Controlling who can access what",
        "JWT: Token-based authentication",
        "Cookies & Sessions: Maintaining user state",
        "API Security: Protecting your API",
        "CORS: Allowing cross-origin requests",
        "Rate Limiting: Preventing abuse",
        "File Uploads: Handling file uploads",
        "Logging: Tracking requests and errors",
        "Backend Performance: Making API faster",
        "Pagination: Loading data in chunks",
        "Backend Best Practices: Writing maintainable server code",
      ],
    },
    {
      name: "MongoDB & Authentication",
      subtopics: [
        "Database Basics: What databases are and why we need them",
        "Database Types: SQL vs NoSQL",
        "NoSQL Concepts: Flexible, schema-less data",
        "MongoDB Architecture: Collections and documents",
        "Database Design: Structuring data efficiently",
        "Data Relationships: Embedding vs referencing",
        "Indexes: Speeding up queries",
        "CRUD Operations: Create, read, update, delete",
        "Querying: Finding, filtering, sorting data",
        "Aggregation: Processing and transforming data",
        "Mongoose ODM: Object modeling for MongoDB",
        "Schemas: Defining data structure and rules",
        "Models: Interacting with collections",
        "Schema Validation: Ensuring data quality",
        "Middleware (Hooks): Running code before/after operations",
        "Population: Loading referenced documents",
        "Transactions: Atomic operations",
        "Authentication Basics: Identifying users",
        "Auth Flow: Signup, login, logout process",
        "Password Security: Hashing and salting",
        "JWT: JSON Web Tokens for authentication",
        "Access Tokens: Short-lived tokens",
        "Refresh Tokens: Renewing authentication",
        "Session-Based Auth: Server-side sessions",
        "Cookies: Storing auth data in browser",
        "Authorization: Role-based access control",
        "Protected Routes: Restricting access",
        "Auth Middleware: Verifying user identity",
        "Password Reset: Secure password recovery",
        "Email Verification: Confirming user email",
        "Account Security: Preventing unauthorized access",
        "Common Auth Attacks: Security threats",
        "Security Best Practices: Safe credential handling",
      ],
    },
    {
      name: "SQL Database",
      subtopics: [
        "What is SQL: Structured Query Language for databases",
        "Relational Model: Tables, rows, and columns",
        "SQL Basics: Writing database queries",
        "Data Types: Numbers, strings, dates, booleans",
        "Database Schema: Database structure",
        "Creating Tables: CREATE DATABASE and CREATE TABLE",
        "Constraints: PRIMARY KEY, FOREIGN KEY, UNIQUE, NOT NULL",
        "INSERT: Adding data to tables",
        "SELECT: Retrieving data",
        "WHERE: Filtering records",
        "ORDER BY & LIMIT: Sorting and limiting results",
        "UPDATE: Modifying records",
        "DELETE: Removing records",
        "Aggregate Functions: COUNT, SUM, AVG, MIN, MAX",
        "GROUP BY: Grouping records",
        "HAVING: Filtering grouped results",
        "Joins: Combining data from multiple tables",
        "Subqueries: Nested queries",
        "Views: Reusable query results",
        "Indexes: Improving query speed",
        "Normalization: Reducing data redundancy",
        "Transactions: All-or-nothing operations",
        "ACID Properties: Reliable transactions",
        "Stored Procedures: Reusable SQL code",
        "Functions: Built-in and custom functions",
        "Triggers: Automatic actions on data changes",
        "Database Security: Users and permissions",
        "SQL Injection Prevention: Protecting from attacks",
        "Query Optimization: Writing efficient queries",
        "Backup & Recovery: Protecting data",
      ],
    },
    {
      name: "Connecting Frontend & Backend",
      subtopics: [
        "Client-Server Model: How frontend talks to backend",
        "HTTP Request Flow: From browser to server and back",
        "API Consumption: Calling backend from frontend",
        "REST API Integration: Connecting React to Express",
        "Data Flow: UI → API → Database",
        "Environment Config: Managing environment variables",
        "CORS: Handling cross-origin requests",
        "Auth Flow: Frontend to backend authentication",
        "JWT Integration: Storing and sending tokens",
        "Protected Routes (Frontend): Restricting UI access",
        "Protected APIs (Backend): Securing endpoints",
        "Role-Based Access: Syncing roles across stack",
        "Form Submission: Sending form data to backend",
        "Error Handling: Handling API errors in UI",
        "Loading States: Managing async request states",
        "API Response Format: Consistent response structure",
        "Pagination: Coordinating paginated data",
        "Search & Filtering: Passing query parameters",
        "File Uploads: Uploading files from frontend",
        "Data Sync: Keeping UI and database in sync",
        "Optimistic Updates: Updating UI before confirmation",
        "Security: End-to-end security",
        "Session Persistence: Maintaining login state",
        "Logout Flow: Clearing auth state",
        "API Versioning: Handling API changes",
        "Deployment: Connecting in production",
        "Production Debugging: Tracing issues",
        "Full-Stack Best Practices: Building scalable apps",
      ],
    },
    {
      name: "AI Features Integration",
      subtopics: [
        "AI Basics: What AI is and how to use it in apps",
        "Types of AI: Different AI models and capabilities",
        "AI Use Cases: Common AI features in apps",
        "AI APIs: Using third-party AI services",
        "Prompt Engineering: Writing good prompts",
        "Frontend AI: Triggering AI from user actions",
        "Backend AI: Calling AI APIs from server",
        "API Requests: Sending data to AI models",
        "API Responses: Using AI responses",
        "Streaming: Real-time AI output",
        "Context: Maintaining AI conversation state",
        "Token Management: Controlling AI costs",
        "AI Error Handling: Handling AI failures",
        "AI Security: Protecting API keys",
        "Input Validation: Preventing prompt injection",
        "Output Validation: Ensuring safe AI responses",
        "Caching: Reducing repeated AI calls",
        "Rate Limiting: Preventing AI abuse",
        "Personalization: Custom AI behavior per user",
        "Feature Toggles: Enabling/disabling AI features",
        "AI Performance: Reducing latency",
        "Ethical AI: Responsible AI usage",
        "AI Logging: Tracking AI usage",
        "AI Testing: Validating AI features",
        "Production AI: Running AI at scale",
        "AI Best Practices: Building maintainable AI apps",
      ],
    },
    {
      name: "Scaling & Performance",
      subtopics: [
        "Scalability Basics: Vertical and horizontal scaling",
        "Performance Bottlenecks: Finding slow parts",
        "Load Balancing: Distributing traffic",
        "Stateless Architecture: Designing scalable servers",
        "Caching: Reducing load with Redis",
        "Redis Caching: In-memory data store",
        "Cache Invalidation: Keeping cache fresh",
        "Database Scaling: Read replicas and sharding",
        "Index Optimization: Faster database queries",
        "Connection Pooling: Efficient database connections",
        "Async Processing: Background tasks",
        "Message Queues: Job processing systems",
        "Job Scheduling: Recurring background tasks",
        "API Rate Limiting: Protecting from traffic spikes",
        "Traffic Throttling: Controlling request flow",
        "Microservices: Splitting app into services",
        "Service Communication: How services talk",
        "Data Consistency: Handling distributed data",
        "Distributed Transactions: Multi-service operations",
        "API Gateway: Centralized routing",
        "Monitoring: Tracking system health",
        "Logging at Scale: Centralized logs",
        "Health Checks: Detecting unhealthy services",
        "Auto Scaling: Scaling based on load",
        "Fault Tolerance: Handling failures",
        "Disaster Recovery: Backup and recovery",
        "High Availability: Minimizing downtime",
        "Security at Scale: Protecting under high traffic",
        "Scaling AI: Handling many AI requests",
        "Cost Optimization: Balancing performance and cost",
        "Scaling Best Practices: Growing reliably",
      ],
    },
    {
      name: "Projects & Career",
      subtopics: [
        "Build Auth Apps: Login/signup systems",
        "AI Dashboards: Apps with AI features",
        "SaaS Products: Subscription-based apps",
        "Open-source: Contributing to open-source projects",
      ],
    },
  ],
};

export default function MERNStack({ state, setState, stateKey = 'mern' }) {
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
      // Initialize with topics from DATA
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
        <div className="absolute inset-0 bg-linear-to-br from-emerald-500/20 to-teal-500/10 rounded-3xl blur-xl opacity-60 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="relative flex items-center gap-4 p-1 pl-6 rounded-3xl border border-white/10 bg-slate-900/80 backdrop-blur-xl transition-all focus-within:ring-2 focus-within:ring-emerald-500/40 focus-within:border-emerald-500/30 shadow-xl">
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
        {/* Glow Effect */}
        <div className="absolute inset-0 bg-linear-to-br from-emerald-500/20 to-teal-500/10 rounded-[2.5rem] blur-2xl opacity-60 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* Card */}
        <div
          className="relative rounded-[2.5rem] border border-white/10 bg-slate-900/80 backdrop-blur-xl shadow-2xl overflow-hidden flex flex-col"
          style={{ maxHeight: "75vh" }}
        >
          {/* Header - Fixed */}
          <div className="flex justify-between items-center px-6 md:px-10 py-6 md:py-8 sticky top-0 bg-slate-900/90 backdrop-blur-xl border-b border-white/10 z-10">
            <div>
              <motion.h3
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="text-xs md:text-sm font-black italic tracking-[0.2em] text-emerald-400 mb-2"
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
                className="text-xs md:text-sm font-mono font-black text-emerald-400 bg-emerald-500/10 px-4 py-2 rounded-2xl border border-emerald-500/30 shadow-lg shadow-emerald-500/20"
              >
                {learningItems.filter((t) => t.done).length + learningItems.reduce((sum, t) => sum + t.subtopics.filter(st => st.done).length, 0)} / {learningItems.reduce((sum, t) => sum + 1 + t.subtopics.length, 0)}
              </motion.span>
              <span className="text-[9px] md:text-[10px] font-mono text-slate-500">
                {learningItems.filter((t) => t.done).length}/{learningItems.length} topics · {learningItems.reduce((sum, t) => sum + t.subtopics.filter(st => st.done).length, 0)}/{learningItems.reduce((sum, t) => sum + t.subtopics.length, 0)} items
              </span>
            </div>
          </div>

          {/* List - Custom scrollbar */}
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
                    className={`group rounded-3xl transition-all duration-300 border ${
                      isExpanded
                        ? "bg-white/5 border-white/10 shadow-lg"
                        : "border-transparent hover:bg-white/5 hover:border-white/5"
                    }`}
                  >
                    {/* Main Topic Row */}
                    <div className="flex items-center gap-4 p-5 md:p-6">
                      <input
                        type="checkbox"
                        id={`main-${originalIndex}`}
                        checked={t.done}
                        onChange={() => toggleTopic(originalIndex)}
                        className="w-5 h-5 md:w-6 md:h-6 rounded-lg border-white/20 bg-black/40 text-emerald-500 focus:ring-offset-0 focus:ring-emerald-500/50 cursor-pointer transition-all hover:scale-110"
                      />
                      <label
                        htmlFor={`main-${originalIndex}`}
                        className={`flex-1 text-sm md:text-base font-bold cursor-pointer transition-all ${
                          t.done ? "line-through text-slate-500 opacity-60" : "text-slate-100"
                        }`}
                      >
                        {t.task}
                      </label>
                      <motion.button
                        type="button"
                        onClick={() => toggleExpand(originalIndex)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className={`p-3 rounded-xl hover:bg-white/10 transition-all ${
                          isExpanded ? "rotate-180 text-emerald-400 bg-white/5" : "text-slate-500"
                        }`}
                        aria-expanded={isExpanded}
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </motion.button>
                    </div>

                    {/* Subtopics Container */}
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
                              className="relative pl-6 border-l-2 border-white/10 hover:border-emerald-500/30 transition-colors"
                            >
                              <div className="flex items-start gap-3 py-2 group/sub">
                                <input
                                  type="checkbox"
                                  id={`sub-${originalIndex}-${j}`}
                                  checked={st.done}
                                  onChange={() => toggleSubtopic(originalIndex, j)}
                                  className="mt-0.5 w-4 h-4 rounded border-white/20 bg-black/20 text-emerald-400 cursor-pointer transition-all hover:scale-110"
                                />
                                <label
                                  htmlFor={`sub-${originalIndex}-${j}`}
                                  className={`text-xs md:text-sm font-medium cursor-pointer transition-colors leading-relaxed ${
                                    st.done
                                      ? "line-through text-slate-600"
                                      : "text-slate-300 group-hover/sub:text-slate-100"
                                  }`}
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
