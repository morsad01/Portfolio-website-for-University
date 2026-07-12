# Portfolio Project Viva & Presentation Guide

This guide contains everything you need to know about the code and design choices of your portfolio website. If your university teacher (ma'am/sir) asks questions about **where**, **why**, and **how** things work in this project, you can answer them confidently using the explanations below.

---

## 1. Project Overview & Architecture

### **Q: What technologies did you use to build this website?**
- **A:** It is built using **pure native web technologies**:
  - **HTML5** for semantic markup.
  - **CSS3** (Vanilla CSS) for styling, layouts (Grid & Flexbox), and custom properties (CSS variables).
  - **Vanilla JavaScript (ES6+)** for DOM interactions, animations, and state management (theme switching, vertical tabs, form actions).
  - **No external frameworks** (no React, Vue, jQuery, Bootstrap, or Tailwind CSS) are used, keeping the website lightweight and fully compliant with vanilla university requirements.
  - **Vite** is used as the build tool/bundler to handle fast hot-reloading during development and optimize/minify files for production.

---

## 2. HTML Structure (`index.html`)

### **Q: What is Semantic HTML, and where did you use it?**
- **A:** Semantic HTML means using HTML tags that describe the meaning of the content they contain, rather than just how they look. This helps with **SEO** (Search Engine Optimization) and **Accessibility** (screen readers for visually impaired users).
- **Where we used it:**
  - `<header>`: For the sticky navigation bar.
  - `<nav>`: Wraps the main navigation links.
  - `<main>`: Contains the primary content of the page.
  - `<section>`: Divides different content zones (Hero, About, Expert, Projects, Services, Contact).
  - `<article>`: Used for individual project cards because they represent self-contained, reusable blocks of content.
  - `<footer>`: For the copyright and quick links section at the bottom.

### **Q: How did you implement Accessibility (a11y) in the navigation and tabs?**
- **A:** By using **ARIA (Accessible Rich Internet Applications) attributes**:
  - `role="tablist"`, `role="tab"`, and `role="tabpanel"` are used in the **Expertise section** to define tabbed panels.
  - `aria-selected="true/false"` indicates which tab button is active.
  - `aria-controls="panel-id"` programmatically links each tab button to its matching content panel.
  - `aria-expanded="true/false"` on the mobile navigation toggle informs screen readers whether the collapsible drawer is open.

---

## 3. CSS Styling & Layouts (`style.css`)

### **Q: What are CSS Custom Properties (Variables), and why did you use them?**
- **A:** CSS variables allow us to store design tokens (colors, fonts, sizes, margins) in a central place (`:root`) and reuse them throughout the stylesheet.
- **Why we used them:**
  - **Theme Toggle:** We define theme variables (like `--bg-primary`, `--text-primary`, `--border-color`) in `:root` for dark mode, and override them under `html[data-theme="light"]` for light mode. When the theme swaps, the colors change instantly.
  - **Consistency:** Ensures padding, transitions, and round corners are uniform across the entire site.

### **Q: How does the Dark Mode / Light Mode styling change in CSS?**
- **A:** The document root (`<html>`) gets a custom attribute `data-theme="dark"` or `data-theme="light"`. In CSS, we write selectors targeting this attribute to swap color variables:
  ```css
  /* Default variables (Dark Theme) */
  :root {
    --bg-primary: #09090b;
    --text-primary: #f4f4f5;
  }
  
  /* Overrides for Light Theme */
  [data-theme="light"] {
    --bg-primary: #fafafa;
    --text-primary: #09090b;
  }
  ```

### **Q: What is Glassmorphism, and how did you implement it?**
- **A:** Glassmorphism is a design style that makes elements look like frosted glass.
- **How we did it:** We styled the header (`.nav-header`) and card elements with:
  1. `background: var(--bg-glass)` (a transparent color like `rgba(9, 9, 11, 0.7)`).
  2. `backdrop-filter: blur(20px) saturate(180%)` (tells the browser to blur and saturate the content showing *behind* the element).
  3. `border: 1px solid var(--border-color)` (a thin, low-opacity border to act as a glass edge highlight).

### **Q: What layout techniques did you use for positioning?**
- **A:** We used a combination of **CSS Grid** and **CSS Flexbox**:
  - **CSS Grid** for main two-dimensional layouts:
    - **Header Centering:** The desktop `.nav-container` uses `display: grid; grid-template-columns: 1fr auto 1fr;` to place the logo on the left, navigation links centered in the middle, and action buttons on the right.
    - **About Me Section:** Uses grid to place the bio columns side-by-side with the DIU student photo.
    - **Projects & Services Grids:** Automatic multi-column layouts that adjust column counts responsively.
  - **CSS Flexbox** for one-dimensional layouts:
    - Alignment of icons next to text (in competencies, contact cards, and header actions).
    - Tab buttons in the credentials panel.

---

## 4. JavaScript Functionality & Logic (`script.js`)

### **Q: Why is your JavaScript code wrapped in an IIFE?**
- **A:** It is wrapped in an **IIFE (Immediately Invoked Function Expression)**:
  ```javascript
  (function () {
    'use strict';
    // code here
  })();
  ```
  - **Why:** This creates a private scope. Any variables or functions defined inside cannot pollute the browser's global scope (`window`), preventing name collisions with external scripts.
  - **`'use strict';`**: Enforces strict mode to prevent unsafe actions (like declaring accidental global variables) and helps debug errors.

### **Q: How does the theme switcher work under the hood?**
- **A:**
  1. It reads the user's preferred theme from browser storage using `localStorage.getItem('theme')` (defaults to `dark`).
  2. It applies this theme by setting an attribute on the document root: `document.documentElement.setAttribute('data-theme', theme)`.
  3. When the toggle button is clicked, it swaps the attribute (`dark` ↔ `light`) and saves the new value back to `localStorage` so the setting persists when the page reloads.

### **Q: How does the Interactive vertical tab system work?**
- **A:**
  1. It selects all tab buttons (`.expert-tab-btn`) and content panels (`.expert-panel`).
  2. When a button is clicked, JS removes the `.active` class from all buttons, sets their `aria-selected` to `false`, and adds the `hidden` attribute to all panels.
  3. It reads the target panel ID from the clicked button's `aria-controls` attribute, removes the `hidden` attribute from that specific panel, and triggers a CSS class (`.fade-panel-in`) to perform a smooth fade animation.

### **Q: How does the scroll observer highlight active navigation links?**
- **A:** It uses the **`IntersectionObserver` API**, which is a modern, high-performance API that observes when an element enters or leaves the browser viewport.
  - **How it works:** We observe all sections with an ID. When a section crosses the threshold (e.g. fills the center of the viewport), the observer updates the navigation link that has the matching `href="#id"` by adding the `.active` class, while removing it from other links.
  - **Benefit:** It is much faster and uses fewer CPU resources than binding a heavy scroll listener to `window.onscroll`.

### **Q: How does the fade-in animation on scroll work?**
- **A:** Also uses `IntersectionObserver`. It observes elements with the `.slide-up` class. When they enter the viewport, the JS adds the `.visible` class (triggering the CSS opacity and transform slide-up animations) and then immediately calls `unobserve(element)` so the animation only fires once and stops consuming resources.

---

## 5. Tooling & Compilation

### **Q: What is Vite and why did you use it?**
- **A:** Vite is a modern frontend build tool.
  - **Why:** During development, it uses native ES modules to load files instantly without pre-bundling. For production, it runs a build process (`npm run build`) which bundles, minifies, and compresses the HTML, CSS, and JS files so the page loads instantly for visitors.
