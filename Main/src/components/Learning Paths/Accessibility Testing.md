# Making Websites Work for Everyone

A learning checklist for web accessibility — covering tools, WCAG rules, ARIA, coding patterns, and legal standards.

---

## 1. Getting Started

- Types of Disabilities: Vision, Hearing, Movement, Thinking, and Brain-related
- Tools People Use: Screen readers, Voice control, Magnifiers, and more
- Core Ideas: Make it See-able, Use-able, Understandable, and Reliable
- Testing Methods: Testing by hand, Using tools, or Both
- Quality vs Rules: Following rules AND making it easy to use
- Test Early: Check accessibility while designing and building

---

## 2. Tools People Use

### Screen Reader Shortcuts (Desktop)
- NVDA (Windows): Insert+Space (Switch modes), Insert+F7 (List items), Control+Home (Go to top)
- JAWS (Windows): Insert+F7 (Show links), Insert+F6 (Show headings), Insert+CTRL+B (Show buttons)
- Narrator (Windows): Caps Lock+Backspace (Search), Caps Lock+F1 (Show commands)
- VoiceOver (Mac): VO(Control+Option)+Space (Click), VO+U (Menu), VO+Arrows (Move around)

### Phone Screen Readers
- TalkBack (Android): Swipe to move, Double tap to click, 3-finger tap for menu
- VoiceOver (iPhone): Swipe to move, 2-finger turn for menu, 3-finger swipe to scroll
- Focus Management: Make sure focus moves correctly in popups and menus

### Basic Testing Steps
- Keyboard Use: Check Tab key order, visible focus, and no keyboard traps
- Color Contrast: Use tools to check text is readable (4.5:1 ratio minimum)
- Button Size: Make sure buttons are big enough to tap (44x44 pixels)
- Page Structure: Check headings go in order (H1, H2, H3) and sections are labeled

### Testing Both Ways
- Quick Scans: Use Axe or Lighthouse to find 30-40% of problems quickly
- Manual Testing: Try using the site with only keyboard for important tasks
- Screen Reader Check: Make sure labels and messages are announced correctly
- Real User Testing: Get feedback from people with disabilities

### Tracking Problems
- Priority Levels: Mark bugs as Blocker, Critical, Serious, or Small
- Writing Reports: Explain what should happen vs what actually happens
- Checking Fixes: Test again after developers fix the problems

---

## 3. Web Accessibility Rules (WCAG)

### Rule 1: People Can See and Hear It
- 1.1.1 Add text for images and buttons
- 1.2.1 Provide text version of audio/video
- 1.2.2 Add captions to videos
- 1.2.3 Describe what's happening in videos
- 1.2.4 Add captions to live streams
- 1.2.5 Describe videos in detail
- 1.3.1 Use proper HTML tags
- 1.3.2 Content should be in the right order
- 1.3.3 Don't rely only on color or position
- 1.3.4 Work in portrait and landscape
- 1.3.5 Label form fields properly
- 1.4.1 Don't use only color to show meaning
- 1.4.2 Let users stop auto-playing audio
- 1.4.3 Text must be readable (good contrast)
- 1.4.4 Text can be resized without breaking
- 1.4.5 Use real text, not text in images
- 1.4.10 Content works at 400% zoom
- 1.4.11 Buttons and controls are visible
- 1.4.12 Text spacing can be adjusted
- 1.4.13 Popups can be dismissed easily

### Rule 2: People Can Use It
- 2.1.1 Everything works with keyboard
- 2.1.2 Keyboard doesn't get stuck
- 2.1.4 Keyboard shortcuts can be turned off
- 2.2.1 Give enough time to read and use
- 2.2.2 Users can pause moving content
- 2.4.1 Skip to main content easily
- 2.4.2 Pages have clear titles
- 2.4.3 Tab key moves in logical order
- 2.4.4 Link text explains where it goes
- 2.4.5 Multiple ways to find pages
- 2.4.6 Headings and labels are clear
- 2.4.7 Show where keyboard focus is
- 2.4.11 Focus indicator is visible
- 2.5.1 Don't require complex gestures
- 2.5.2 Actions happen on release, not press
- 2.5.3 Button label matches visible text
- 2.5.4 Don't require shaking device
- 2.5.7 Provide alternatives to dragging
- 2.5.8 Buttons are big enough to tap

### Rule 3: People Can Understand It
- 3.1.1 Set the page language
- 3.1.2 Mark text in other languages
- 3.2.1 Focus doesn't trigger surprises
- 3.2.2 Typing doesn't trigger surprises
- 3.2.3 Navigation is in same place
- 3.2.4 Same things look the same
- 3.2.6 Help is easy to find
- 3.3.1 Clearly show errors
- 3.3.2 Label all form fields
- 3.3.3 Suggest how to fix errors
- 3.3.4 Confirm before important actions
- 3.3.7 Don't ask for same info twice
- 3.3.8 Login should be simple

### Rule 4: Works with All Tools
- 4.1.1 Use valid HTML (old rule)
- 4.1.2 All controls have names and roles
- 4.1.3 Announce status messages

---

## 4. ARIA — Extra Help for Websites

### What is ARIA?
- What it is: Special code to help screen readers understand websites
- Why use it: When normal HTML isn't enough
- How it works: Adds extra info for assistive tools
- Golden Rule: Use normal HTML first (like `<button>`), only use ARIA when needed
- Important: ARIA only helps screen readers, doesn't change how site works

### ARIA for Controls
- aria-autocomplete (shows suggestions)
- aria-checked (checkbox/radio state)
- aria-disabled (can't use)
- aria-errormessage (link to error)
- aria-expanded (open or closed)
- aria-haspopup (opens menu/dialog)
- aria-hidden (hide from screen readers)
- aria-invalid (has error)
- aria-label (button name)
- aria-level (heading level)
- aria-modal (popup/dialog)
- aria-multiline (multi-line text)
- aria-multiselectable (select many)
- aria-orientation (horizontal/vertical)
- aria-placeholder (hint text)
- aria-pressed (toggle state)
- aria-readonly (can't edit)
- aria-required (must fill out)
- aria-selected (currently selected)
- aria-sort (sorted order)
- aria-valuemax (max number)
- aria-valuemin (min number)
- aria-valuenow (current number)
- aria-valuetext (number as text)

### ARIA for Updates
- aria-live: Tell screen readers about updates (polite or urgent)
- aria-busy: Show when something is loading
- aria-relevant: What changes to announce (new items, removed items)
- aria-atomic: Read whole section or just the change

### ARIA for Relationships
- aria-labelledby: Point to the label for this control
- aria-describedby: Point to more details or error message
- aria-controls: This controls that other thing
- aria-owns: Parent-child relationship
- aria-activedescendant: Where focus is in a list
- aria-posinset & aria-setsize: Item position in a list (item 3 of 10)
- aria-colcount, aria-rowcount, aria-colspan, aria-rowspan: Table info
- aria-flowto (reading order)
- aria-details (link to details)
- aria-description (short description)

### ARIA You Can Use Anywhere
- aria-atomic, aria-busy, aria-controls, aria-current (current page/step)
- aria-describedby, aria-description, aria-details, aria-disabled
- aria-dropeffect (old), aria-errormessage, aria-flowto, aria-grabbed (old)
- aria-haspopup, aria-hidden, aria-invalid, aria-keyshortcuts
- aria-label, aria-labelledby, aria-live, aria-owns
- aria-relevant, aria-roledescription

### Old ARIA (Don't Use)
- aria-dropeffect (Outdated)
- aria-grabbed (Outdated)

---

## 5. Common Website Patterns

### Navigation & Layout
- Accordion: Click to show/hide sections
- Breadcrumb: Links showing where you are (Home > Products > Shoes)
- Carousel: Slideshow that moves through images
- Feed: Content that loads as you scroll (like social media)
- Landmarks: Page sections (header, main, footer)
- Link: Clickable text that takes you somewhere
- Tabs: Click to switch between different panels
- Tree View: Folder-like structure you can expand/collapse

### Buttons & Form Controls
- Button: Click to do something
- Checkbox: Check or uncheck boxes (can select many)
- Combobox: Dropdown list you can type in
- Listbox: List where you can pick options
- Menu & Menubar: Lists of actions (like File menu)
- Menu Button: Button that opens a menu
- Radio Group: Circle buttons (can only pick one)
- Slider: Drag to choose a value (like volume control)
- Spinbutton: Click up/down arrows to change number
- Switch: Toggle between on and off

### Popups & Messages
- Dialog (Modal): Popup window that covers the page
- Alert: Important message that grabs attention
- Alert Dialog: Popup asking you to confirm something
- Disclosure: Click to expand and read more
- Tooltip: Small popup with helpful info on hover

### Data Display
- Grid: Table where you can edit and interact
- Table: Table showing data (can't edit)
- Treegrid: Table with expandable rows
- Meter: Visual bar showing a value (like progress)
- Toolbar: Row of buttons and controls
- Window Splitter: Drag to resize sections

### Key Rules
- Most Important: Use normal HTML first, ARIA only when needed
- Keyboard: Everything must work with Tab, Arrow, Enter, and Esc keys
- ARIA Attributes: Add the right ARIA code for each pattern

---

## 6. Coding for Accessibility

### Managing Focus in React
- useRef Hook: Use to move focus to specific elements
- useEffect for Page Changes: Move focus to top when page changes
- Focus Trapping: Keep focus inside popups and modals
- Restoring Focus: Move focus back to button after closing popup
- Managing .blur(): Handle clicking outside without breaking keyboard use

### Keyboard Events
- Keyboard Callbacks: Make Enter and Space work on custom buttons
- Preventing Default: Stop page from scrolling on arrow keys when needed
- Tab Index: Use `tabIndex={0}` for keyboard focus, `tabIndex={-1}` for code-only focus
- Form Submission: Move focus to errors when form has mistakes

### Dynamic Content & Updates
- ARIA Live Regions: Announce success/error messages to screen readers
- Loading States: Tell screen readers when data is loading
- Conditional Rendering: Update ARIA when React state changes
- Page Transitions: Announce when page changes in single-page apps

### Advanced Browser Features
- Intersection Observer: Load content only when visible for better performance
- MatchMedia API: Detect if user prefers less motion or dark mode
- Mutation Observer: Watch for changes in third-party code
- Custom Hooks: Build reusable code for common accessibility needs

### Full-Stack Accessibility
- Server-Side Rendering: Make sure HTML is good before React loads
- Database Alt Text: Require alt text for all images in database
- Component Libraries: Check that UI libraries are accessible

---

## 7. Testing & Legal Stuff

### How to Test
- Manual Testing: Try using site with only keyboard
- Screen Reader Testing: Test with NVDA, JAWS, and VoiceOver
- Automated Scanning: Use Axe and Lighthouse to scan pages
- Color & Contrast: Check text is readable (4.5:1 minimum)
- Color Blindness: Test how it looks for color-blind users
- Code Review: Check HTML structure and headings
- Mobile Testing: Check button sizes and gestures
- Zoom Testing: Test up to 400% zoom still works

### Laws & Standards
- WCAG 2.0/2.1/2.2: The main web accessibility rules
- ADA (USA): Americans with Disabilities Act — can get sued
- EAA (Europe): European law coming June 2025
- Section 508: Required for US government sites
- CVAA: Rules for video and communication
- AODA (Canada): Ontario's accessibility law
- EN 301 549: European buying standard
- IS 17800: India's accessibility standard

### Reports & Documentation
- VPAT: Document showing accessibility status
- ACR: Official accessibility report
- Security Reports: Include accessibility in security testing
- Accessibility Statement: Public page about your compliance
- Executive Summary: Short report for managers
- Fix Plan: List what to fix first based on importance
- Regression Testing: Make sure old fixes still work

### Quality & Risk
- Quality Gates: Block code with serious accessibility bugs
- Third-Party Check: Make sure plugins are accessible
- Legal Risk: Know how to handle lawsuits
- Design Review: Check accessibility before coding
- User Testing: Get feedback from people with disabilities
- Ongoing Testing: Always test, not just once
