# Problem Solving & Logic

A learning checklist covering algorithms, data structures, and systems thinking for software engineers.

---

## 1. How Fast Does Code Run?

- Big O: A way to describe how code speed changes as data grows
- Time: How long code takes to run with different input sizes
- Space: How much memory code uses with different input sizes
- Average Cost: Looking at typical performance over many operations
- Best, Average, and Worst: Understanding different scenarios
- Recursive Speed: Calculating how recursive functions perform

---

## 2. Making Things Easy to Use

- User-Focused Design: Build for what people actually need
- Easy to Use: Make sure anyone can figure it out quickly
- Stay Consistent: Use familiar patterns people already know
- Give Feedback: Let users know what's happening
- Prevent Mistakes: Design so errors are hard to make
- Error Recovery: Help users fix mistakes easily
- Keep it Simple: Don't make users think too hard
- Show Gradually: Show info only when needed, not all at once
- Include Everyone: Design for people with disabilities too
- Best Practices: Follow proven rules that work

---

## 3. Working with Lists (Arrays)

- Going Through Items: Basic way to check every item in a list
- Two Pointers: Use two positions to compare items efficiently
- Sliding Window: Look at a moving section of the list
- Running Totals: Keep track of sums as you go
- In-Place Changes: Modify the list without using extra memory
- Using Sorting: Sort first to make other operations easier
- Maximum Sum: Find the biggest sum in a section (Kadane's way)

---

## 4. Quick Lookups (Hash Maps)

- Hash Functions: Convert data into a storage location
- Hash Tables: Store pairs of keys and values for fast finding
- Handling Collisions: Deal with items that hash to same spot
- Maps vs Objects: Different ways to store key-value pairs
- Counting Items: Track how many times things appear
- Sets: Store unique items and check if something exists
- Resizing: Make the storage bigger when it gets full

---

## 5. Linked Lists (Connected Nodes)

- Single Direction: Each item points to the next one
- Two Directions: Each item points forward and backward
- Circular: Last item connects back to first
- Walking Through: Visit each node one by one
- Add & Remove: Put in or take out nodes efficiently
- Reversing: Flip the direction of all connections
- Two Speed Pointers: Find middle or detect loops (Tortoise & Hare)

---

## 6. Stacks & Queues (Ordering Data)

- LIFO (Last In, First Out): Stacks work like a stack of plates
- FIFO (First In, First Out): Queues work like a line of people
- Stack Uses: Undo buttons, checking brackets, backtracking
- Queue Types: Double-ended, circular, and priority queues
- Monotonic: Keep items in increasing or decreasing order
- Building Them: Make stacks and queues using arrays or linked lists

---

## 7. Recursion & Trying Options (Backtracking)

- Recursion Basics: Function that calls itself with smaller problems
- Stop Condition: Know when to stop calling the function
- Call Stack: How computer tracks recursive function calls
- Backtracking: Try an option, if it doesn't work, go back and try another
- Decision Tree: Picture of all possible choices
- Pruning: Skip paths you know won't work
- All Combinations: Generate every possible arrangement

---

## 8. Finding Things (Searching)

- Linear Search: Check every item one by one until found
- Binary Search: Cut search area in half each time (only works if sorted)
- Narrowing Down: Eliminate impossible areas to search faster
- Edge Cases: Handle beginning, end, and special situations
- Recursive Search: Search by calling function again
- Loop Search: Search using a regular loop
- Search for Best Answer: Find optimal value in a range

---

## 9. Putting in Order (Sorting)

- Comparison Sorting: Sort by comparing two items at a time
- Bubble Sort: Swap neighbors until everything is in order
- Selection Sort: Pick smallest item, move it to front, repeat
- Insertion Sort: Build sorted list one item at a time
- Merge Sort: Split list in half, sort each half, combine
- Quick Sort: Pick a pivot, split around it, sort each side
- Special Sorts: Counting, Radix, Bucket for specific number types

---

## 10. Exploring Networks (Graphs)

- Graph Structure: Store connections using lists or grids
- BFS (Breadth-First): Explore level by level, like ripples in water
- DFS (Depth-First): Explore one path completely before trying another
- Tracking Visited: Remember where you've been to avoid loops
- Connected Parts: Find separate groups in the network
- Finding Loops: Detect cycles in the connections
- Task Ordering: Arrange tasks that depend on each other

---

## 11. Heaps & Priority Queues

- Heap Rules: Tree where parent is smaller (min) or larger (max) than children
- Binary Heap: Store heap in an array for efficiency
- Heapify: Keep heap organized when adding or removing items
- Priority Queue: Process most important items first
- Top K Items: Find the K biggest or smallest items efficiently
- Heap Sort: Use heap structure to sort in O(n log n) time

---

## 12. Smart Reusing (Dynamic Programming)

- Main Idea: Save answers to small problems, reuse them for bigger problems
- Repeating Problems: Same small problem appears many times
- Building Up: Use solutions to small problems for big solution
- Memoization: Save results as you calculate (top-down)
- Tabulation: Build table of results from bottom up
- State Changes: How one step relates to previous steps
- Save Memory: Use less space by only keeping recent results

---

## 13. Greedy Methods (Pick Best Now)

- Greedy Strategy: Always pick what looks best right now
- Local to Global: Make sure best-now choices lead to best-overall
- Problem Structure: Type of problem where greedy works
- Scheduling Tasks: Pick tasks that don't overlap
- Using Resources: Get most value from limited resources
- When Greedy Fails: Some problems need different approaches
- Huffman Coding: Greedy way to compress data efficiently

---

## 14. Tree Structures

- Tree Terms: Root, parent, child, leaf, and branches
- Binary Tree: Each node has at most two children
- Binary Search Tree: Left child smaller, right child bigger
- Walking Trees: Inorder, preorder, and postorder ways to visit nodes
- Height & Depth: How tall the tree is and how deep each node is
- Balanced Trees: Keep tree height small for fast operations
- Tries: Special tree for storing and searching words
