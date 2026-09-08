# P Sushanth | Portfolio

A comprehensive, dual-mode web portfolio engineered with modern front-end technologies, custom WebGL shaders, Three.js 3D constellations, dynamic canvas particle physics, and an ultra-minimalist Recruiter View.

---

## Table of Contents

- [Overview](#overview)
- [Architecture and Dual-Mode System](#architecture-and-dual-mode-system)
  - [1. Recruiter Gatekeeper](#1-recruiter-gatekeeper)
  - [2. Recruiter View (Minimalist & High-Density)](#2-recruiter-view-minimalist--high-density)
  - [3. Interactive Designer Portfolio (Full Mode)](#3-interactive-designer-portfolio-full-mode)
- [Key Features and Technical Implementations](#key-features-and-technical-implementations)
  - [WebGL Morph Slider](#webgl-morph-slider)
  - [Three.js 3D Telescope Constellation Mode](#threejs-3d-telescope-constellation-mode)
  - [Interactive 2D Canvas Particle Engine](#interactive-2d-canvas-particle-engine)
  - [Dynamic Rocket Cursor](#dynamic-rocket-cursor)
  - [Magnetic Cursor Project Preview](#magnetic-cursor-project-preview)
  - [Circular Ripple View Transitions](#circular-ripple-view-transitions)
  - [Quantum Qubit Proximity State Machine](#quantum-qubit-proximity-state-machine)
  - [SVG Stroke Preloader](#svg-stroke-preloader)
  - [Browser History and Popstate Navigation](#browser-history-and-popstate-navigation)
- [Projects Showcase](#projects-showcase)
- [Education and Academic Background](#education-and-academic-background)
- [Professional Certifications](#professional-certifications)
- [Research Publications](#research-publications)
- [Contact and Professional Links](#contact-and-professional-links)
- [Technical Stack](#technical-stack)
- [Project Directory Structure](#project-directory-structure)
- [Local Development and Build](#local-development-and-build)
- [CI/CD and Deployment](#cicd-and-deployment)
- [License and Attribution](#license-and-attribution)

---

## Overview

- **Developer**: P Sushanth
- **Focus Areas**: AI Agents, Quantum Computing Algorithms, Full-Stack Architecture, Interactive WebGL
- **Location**: Visakhapatnam, India
- **Availability**: Open for Software Engineering (SWE) Roles

This project is built from scratch to cater to two distinct audiences through a unified codebase:
1. **Recruiters and Engineering Hiring Managers**: Requiring rapid readability, dense technical data, zero scroll fatigue, instant section navigation, and fast access to credentials, publications, and code repositories.
2. **Designers, Engineers, and General Visitors**: An immersive experience showcasing custom GLSL shaders, 3D math, canvas physics, and interactive UI micro-interactions.

---

## Architecture and Dual-Mode System

### 1. Recruiter Gatekeeper
- **Entry Overlay**: A pure black (`#000000`) minimal interface presenting the question `"Are you a recruiter?"` with two options: `"YES"` and `"NO"`.
- **Underline Animation**: Hovering over options animates a line beneath the text using CSS width transitions and easing.
- **History Routing**: Clicking `"YES"` pushes the state `#recruiter` into the HTML5 history; clicking `"NO"` pushes `#portfolio`.
- **Zero Scrollbar Policy**: `overflow: hidden` is enforced on both `html` and `body` while in gatekeeper mode to eliminate unwanted page scrollbars.

### 2. Recruiter View (Minimalist & High-Density)
- **Unified Canvas**: Eliminates header and sidebar divider lines and two-tone background differences. The entire screen is rendered on a continuous canvas.
- **Typography Pairing**:
  - **Times New Roman** (`'Times New Roman', Times, serif`): Used strictly for navigation menu items, panel headers, timeline headings, project titles, and section labels.
  - **Inter** (`'Inter', sans-serif`): Used for all body text, bios, metadata, tags, metric counters, and contact cards.
- **No-Scroll Sliding Panels**: 7 separate sections rendered within an absolute container that transitions smoothly:
  - `About Me`
  - `Education`
  - `Featured Projects`
  - `Skills`
  - `Professional Certifications`
  - `Selected Publications`
  - `Get In Touch`
- **Transition Dynamics**: Panel switching runs on a 1.05s easing curve (`cubic-bezier(0.16, 1, 0.3, 1)`) with a staggered child animation (`panelContentSlowFade`) for fluid reading.
- **Dynamic Floating Header**: Contains a single theme toggle button (automatically switching between Sun and Moon icons based on active theme) and a direct PDF resume download icon button.

### 3. Interactive Designer Portfolio (Full Mode)
- **Rich Layout**: Multi-section long-scroll interface including the Hero section with live typewriter typing effect, Interactive About section with profile picture crossfade, WebGL Morph Project Slider, Interactive 3D tilt cards, Quantum Research section, Skills matrix, Certifications grid, and a functional Formspree contact form.
- **Active Scrollbar**: Vertical scrolling and scroll progress indicator are re-enabled dynamically upon exiting the gatekeeper.

---

## Key Features and Technical Implementations

### WebGL Morph Slider
- **Technology**: React 19, `ogl` (Minimal WebGL library), and `gsap`.
- **Mechanism**: Renders project slides onto WebGL quads with custom vertex and fragment shaders.
- **Shader Effect**: Applies noise-based UV displacement and morphing transitions when navigating between project cards, producing a liquid distortion effect.

### Three.js 3D Telescope Constellation Mode
- **Technology**: Three.js scene graph, PerspectiveCamera, OrbitControls, and custom particle geometries.
- **Telescope Eyepiece**: Radial vignette overlay that creates the illusion of looking through an astronomical observatory lens.
- **Constellation Anchors**: Individual 3D star clusters represent sections (`Home`, `About`, `Projects`, `Education`, `Contact`).
- **Interactive Camera Zoom**: Clicking navigation items or stars calculates 3D cubic Bezier curves to pan and zoom the camera directly to targeted constellation nodes with star-label popup cards.

### Interactive 2D Canvas Particle Engine
- **Technology**: HTML5 Canvas 2D Context, requestAnimationFrame loop.
- **Pixel Sampling**: Renders `"P SUSHANTH"` onto an offscreen canvas using the `Fugaz One` font, samples active pixel coordinates at 4px intervals, and assigns them as home coordinates to particle entities.
- **Behavior Loop**: Automatically transitions particles between text assembly and background dispersion every few seconds.
- **Mouse Proximity Repulsion**: Calculates Euclidean distance from cursor coordinates (`dx`, `dy`) and applies inverse force vectors for continuous user interaction.

### Dynamic Rocket Cursor
- **Technology**: Custom SVG vector with CSS transform matrix and JavaScript requestAnimationFrame interpolation.
- **Angle Calculation**: Uses `Math.atan2(dy, dx)` to orient the rocket tip in the precise vector of travel.
- **Lerping and Damping**: Coordinates are interpolated (`x += (targetX - x) * 0.22`) for organic physical weight.
- **Context-Aware Visibility**: Automatically enlarges on interactive elements (`a`, `button`, `.project-card`) and hides in 3D mode and the Recruiter View.

### Magnetic Cursor Project Preview
- **Implementation**: Located in `main.js` and `style.css`.
- **Behavior**: Hovering over any project card in the Recruiter View triggers `#recruiter-cursor-preview`.
- **Lerped Tracking**: The thumbnail image tracks the cursor coordinates with a smooth easing factor (`0.18`) and automatic viewport edge detection to prevent clipping off-screen.

### Circular Ripple View Transitions
- **Implementation**: Leverages the native View Transition API (`document.startViewTransition`) paired with CSS pseudo-elements `::view-transition-old(root)` and `::view-transition-new(root)`.
- **Dynamic Origin**: Sets `--ripple-x` and `--ripple-y` to the exact click coordinates of the theme toggle button to expand a radial clip-path circle across the entire viewport.

### Quantum Qubit Proximity State Machine
- **Implementation**: Custom interactive component in the Research section.
- **State Logic**:
  - Distance > 150px: Idle resting state with continuous pulse glow.
  - Distance < 150px: High-frequency vibration animation (`.vibrating`).
  - Distance < 50px: Quantum superposition and entanglement state (`.entangled`) splitting into multiple blurred orbital shadows.
  - Magnetic Pull: Applies directional transform translation toward the mouse pointer when within 100px.

### SVG Stroke Preloader
- **Implementation**: Initial page load vector animation.
- **Mechanism**: A custom reverse "S" path animated using `stroke-dasharray` and `stroke-dashoffset` keyframes, followed by a coordinated opacity fade-out once the DOM and assets are ready.

### Browser History and Popstate Navigation
- **HTML5 History API**: Uses `history.pushState` and `history.replaceState` to create navigable history checkpoints.
- **Popstate Listener**: Supports browser Back and Forward buttons. Going back from either portfolio view returns directly to the gatekeeper overlay.

---

## Projects Showcase

### 1. Portlio
- **Category**: SaaS / Developer Tools
- **Tech Stack**: React, Next.js, Vercel, TailwindCSS
- **Summary**: A SaaS platform that empowers developers, students, and professionals to generate, customize, and deploy modern portfolio websites in minutes.
- **Links**: [Live Demo](https://theportlio.com)

### 2. AI Revenue Recovery Engine
- **Category**: AI Agent / Autonomous Billing / FinTech
- **Tech Stack**: Next.js 16, Supabase, Ollama, Qwen 9B LLM, TailwindCSS
- **Summary**: An autonomous billing intervention engine that detects recurring payment failures, analyzes raw bank decline logs (HDFC velocity caps, RBI e-mandates) using a local LLM, enforces deterministic policy guardrails, and issues secure single-click payment recovery links.
- **Links**: [GitHub Repository](https://github.com/P-Sushanth/AI_Revenue_Recovery)

### 3. Quantum Fraud Detection
- **Category**: Quantum Computing / Machine Learning / Security
- **Tech Stack**: Python, Qiskit, Quantum Support Vector Machines (QSVM), HuggingFace
- **Summary**: An implementation of Quantum Machine Learning algorithms demonstrating superior high-dimensional classification accuracy in detecting complex financial transaction fraud patterns.
- **Links**: [HuggingFace Space](https://huggingface.co/spaces/Sushanth-27/quantum-fraud-detection)

### 4. GeoPopulation Explorer
- **Category**: Data Visualization / Analytics
- **Tech Stack**: React, D3.js, TopoJSON, Vercel
- **Summary**: An expansive interactive visualization tool for exploring global demographic shifts, age-sex pyramid distributions, and population migration trends using D3.js.
- **Links**: [Live Demo](https://population-pyramid-34p9z13j6-sushanths-projects-e33b8b82.vercel.app/)

### 5. AI Legislative Analyser
- **Category**: Natural Language Processing / LegalTech
- **Tech Stack**: Python, HuggingFace, Transformers, LLMs
- **Summary**: An NLP platform utilizing Large Language Models to parse, summarize, cross-reference, and analyze complex legal and legislative bills for civic transparency.
- **Links**: [HuggingFace Space](https://huggingface.co/spaces/Sushanth-27/The_AI_Legislative_Analyzer)

### 6. GENZ PROJECTS
- **Category**: Front-End Engineering / Experimental UI
- **Tech Stack**: HTML5, Vanilla CSS, Modern JavaScript
- **Summary**: A curated collection of avant-garde user interfaces, micro-interactions, and experimental web animations pushing the boundaries of modern front-end aesthetics.
- **Links**: [Live Demo](https://p-sushanth.github.io/GENZ-Projects/)

### 7. Cognitive Load Monitor
- **Category**: UX Analytics / Performance Monitoring
- **Tech Stack**: React, Web Performance APIs, Render
- **Summary**: A dashboard application designed to evaluate and measure user cognitive load during complex multi-step digital tasks through telemetry and interaction metrics.
- **Links**: [Live Demo](https://cognitive-load-monitor.onrender.com)

### 8. Multi-Functional Calculator
- **Category**: Web Application / Mathematical Logic
- **Tech Stack**: JavaScript (ES6+), Modular CSS
- **Summary**: A comprehensive calculation suite supporting scientific computing, matrix operations, base conversions, and logical calculations with a clean interface.
- **Links**: [Live Demo](https://p-sushanth.github.io/Multi-Functional-Calculator/)

### 9. Password Strength Visualizer
- **Category**: Web Security / UI Visualization
- **Tech Stack**: Vanilla JavaScript, Cryptographic Entropy Algorithms
- **Summary**: An interactive security tool that provides real-time entropy calculation, pattern detection, and visual strength feedback for passwords.
- **Links**: [Live Demo](https://p-sushanth.github.io/Password-Strength-Visualizer/)

### 10. Typing Test
- **Category**: Web Application / Performance
- **Tech Stack**: Vanilla JavaScript, CSS Keyframes
- **Summary**: A minimalist typing speed and accuracy testing platform featuring dynamic WPM calculation, accuracy tracking, and error highlighting.
- **Links**: [Live Demo](https://p-sushanth.github.io/Typing-Test/)

### 11. Pure Black Chrome Theme
- **Category**: Browser Extension / OLED Optimization
- **Tech Stack**: Chrome Extension Manifest V3, Custom CSS
- **Summary**: A high-contrast, pure black Google Chrome theme engineered for OLED monitors and battery efficiency.
- **Links**: [GitHub Repository](https://github.com/P-Sushanth/custom_chrome_theme)

---

## Education and Academic Background

- **Bachelor of Technology (B.Tech) in Computer Science and Engineering**
  - **Institution**: GITAM University, Visakhapatnam, India
  - **Timeline**: Present
  - **Performance**: CGPA 9.22 (Scholarship Recipient)
- **Class XII (Higher Secondary)**
  - **Board**: State Board
  - **Year**: 2022
  - **Score**: 83%
- **Class X (Secondary Education)**
  - **Board**: Central Board of Secondary Education (CBSE)
  - **Year**: 2020
  - **Score**: 75%

---

## Professional Certifications

- **Meta Front-End Developer** — Meta Professional Certificate
- **Meta Back-End Developer** — Meta Professional Certificate
- **Google AI Essentials** — Google Specialization
- **Google Prompting Essentials** — Google Specialization
- **Anthropic MCP Advanced** — Anthropic Professional Certificate
- **Introduction to Agent Skills** — Anthropic Professional Certificate

---

## Research Publications

- **Title**: Impact of Quantum Computing on RSA Cryptographic Security
- **Role**: Lead Author
- **Conference**: International Conference ANITS
- **Publication Date**: July 2026
- **Summary**: Comprehensive evaluation of quantum algorithms (including Shor's algorithm) against asymmetric RSA encryption standards, analyzing quantum circuit depths, qubit requirements, and migration strategies toward post-quantum cryptographic (PQC) standards.
- **Document**: [Read Full Camera-Ready PDF](./Impact%20of%20Quantum%20Computing%20on%20RSA%20Cryptographic%20Security-Camera%20Ready.pdf)

---

## Contact and Professional Links

- **Email**: [popurisushanth@gmail.com](mailto:popurisushanth@gmail.com)
- **Phone**: +91 9878323932
- **Location**: Visakhapatnam, India
- **LinkedIn**: [linkedin.com/in/p-sushanth-a04587312](https://www.linkedin.com/in/p-sushanth-a04587312)
- **GitHub**: [github.com/P-Sushanth](https://github.com/P-Sushanth)
- **Medium**: [medium.com/@popurisushanth](https://medium.com/@popurisushanth)
- **Product Hunt**: [producthunt.com/@p_sushanth](https://www.producthunt.com/@p_sushanth)

---

## Technical Stack

| Layer | Technologies |
| :--- | :--- |
| **Core Frameworks** | React 19, Vanilla JavaScript (ES6+), HTML5 Semantic Architecture |
| **3D & WebGL** | Three.js, ogl, Custom GLSL Shaders, GSAP (GreenSock) |
| **Styling & Design** | Vanilla CSS3, CSS Custom Properties, View Transitions API |
| **Typography** | Times New Roman, Inter, Fugaz One, Crimson Text, DotGothic16, Sacramento, Unica One, Yellowtail |
| **Build & Bundling** | Vite 5 |
| **Forms & APIs** | Formspree Contact Endpoint |
| **Deployment & CI/CD**| GitHub Pages, GitHub Actions, Vercel |

---

## Project Directory Structure

```plaintext
Portfolio/
├── .github/
│   └── workflows/
│       └── deploy.yml            # Automated GitHub Actions deployment workflow
├── public/
│   ├── AI_Legislative_Analyser.PNG
│   ├── AI_Revenue_Recovery.png
│   ├── GENZ_Projects.PNG
│   ├── GeoPopulation_Explorer.PNG
│   ├── Impact of Quantum Computing on RSA Cryptographic Security-Camera Ready.pdf
│   ├── P_Sushanth_Resume.pdf
│   ├── Quantum_Fraud_Detection.PNG
│   ├── cognitive_load_monitor.PNG
│   ├── custom_chrome_extension.png
│   ├── favicon.png
│   ├── multi_functional_calculator.PNG
│   ├── password.PNG
│   ├── portlio.png
│   ├── profile1.jpg
│   ├── profile2.jpg
│   └── typing_test.PNG
├── dist/                         # Production build output
├── index.html                    # Root HTML document and structural components
├── main.js                       # Core application logic, canvas physics, history, and recruiter view
├── MorphSlider.jsx               # React WebGL displacement project slider component
├── MorphSlider.css               # WebGL Slider styling tokens
├── style.css                     # Comprehensive design system, theme definitions, and recruiter styles
├── vite.config.js                # Vite build and plugin configuration
├── package.json                  # Project manifest, dependencies, and build scripts
└── README.md                     # Comprehensive technical documentation
```

---

## Local Development and Build

### Prerequisites
- Node.js (v18.0.0 or higher recommended)
- npm or yarn package manager

### 1. Clone the Repository
```bash
git clone https://github.com/P-Sushanth/Portfolio.git
cd Portfolio
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Run Development Server
```bash
npm run dev
```
Open your browser and navigate to `http://localhost:5173`.

### 4. Build for Production
```bash
npm run build
```
Build output will be generated inside the `dist/` directory.

### 5. Preview Production Build
```bash
npm run preview
```

---

## CI/CD and Deployment

- **Automated Workflow**: Pushes to the `index.html` branch trigger `.github/workflows/deploy.yml`.
- **Workflow Steps**:
  1. Checks out repository code.
  2. Sets up Node.js environment with caching.
  3. Executes `npm ci` for deterministic dependency resolution.
  4. Runs `npm run build` to compile static HTML, JS, CSS, and asset bundles.
  5. Deploys the `dist/` build directory to GitHub Pages.

---

## License and Attribution

Copyright (c) 2026 P Sushanth. All rights reserved.
Developed independently as an open portfolio demonstration.
