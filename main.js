document.addEventListener('DOMContentLoaded', () => {
    // Remove Loader
    const loader = document.getElementById('loader');
    if (loader) {
        setTimeout(() => {
            loader.style.opacity = '0';
            setTimeout(() => loader.style.display = 'none', 800);
        }, 500);
    }

    // Navbar Scroll Effect
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Enhanced Intersection Observer with Staggering
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Handle counters
                if (entry.target.classList.contains('counter')) {
                    countUp(entry.target);
                }

                // If it's a grid container, stagger the children
                if (entry.target.classList.contains('project-grid') ||
                    entry.target.classList.contains('skill-tags') ||
                    entry.target.classList.contains('timeline')) {
                    const children = entry.target.children;
                    Array.from(children).forEach((child, index) => {
                        setTimeout(() => {
                            child.classList.add('appear');
                        }, index * 100);
                    });
                } else {
                    entry.target.classList.add('appear');
                }
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Number Counting Animation
    function countUp(element) {
        const target = parseFloat(element.getAttribute('data-target'));
        const decimals = parseInt(element.getAttribute('data-decimals')) || 0;
        const suffix = element.getAttribute('data-suffix') || '';
        const duration = 2000; // 2 seconds
        const start = 0;
        const startTime = performance.now();

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Ease out cubic
            const easeProgress = 1 - Math.pow(1 - progress, 3);

            const currentCount = start + easeProgress * (target - start);
            element.textContent = currentCount.toFixed(decimals) + suffix;

            if (progress < 1) {
                requestAnimationFrame(update);
            }
        }

        requestAnimationFrame(update);
    }

    // Elements to observe with different animations
    const scrollElements = document.querySelectorAll('.animate-up, .animate-fade, .animate-left, .animate-right, .animate-zoom, .project-grid, .timeline, .counter');
    scrollElements.forEach(el => observer.observe(el));

    // Project Filtering Logic
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update Active Button
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');

            projectCards.forEach((card, index) => {
                const category = card.getAttribute('data-category');
                card.classList.remove('appear'); // Reset animation

                const categories = category ? category.split(' ') : [];
                if (filter === 'all' || categories.includes(filter)) {
                    card.style.display = 'block';
                    // Re-trigger animation with delay
                    setTimeout(() => {
                        card.classList.add('appear');
                    }, index * 50);
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // Parallax removed for minimal aesthetic

    // Typewriter Effect
    const typewriterElement = document.querySelector('.typewriter');
    const words = ["Quantum Computing Learner", "Full-Stack Developer", "AI/ML Enthusiast", "Competitive Programmer", "App Developer"];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeSpeed = 100;

    function type() {
        const currentWord = words[wordIndex];
        if (isDeleting) {
            typewriterElement.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
            typeSpeed = 50;
        } else {
            typewriterElement.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
            typeSpeed = 100;
        }

        if (!isDeleting && charIndex === currentWord.length) {
            isDeleting = true;
            typeSpeed = 4000; // Longer pause at the end for reflection
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            typeSpeed = 800; // Pause before starting new word
        }

        setTimeout(type, typeSpeed);
    }
    type();

    // Smooth Scroll for Nav Links
    document.querySelectorAll('.nav-links a, .scroll-down a').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            window.scrollTo({
                top: targetElement.offsetTop - 70,
                behavior: 'smooth'
            });

            // Update Active Link
            document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Mobile Menu Toggle
    const menuBtn = document.getElementById('menu-btn');
    const navLinksContainer = document.querySelector('.nav-links');
    const navLinks = document.querySelectorAll('.nav-links li a');

    if (menuBtn) {
        menuBtn.addEventListener('click', () => {
            menuBtn.classList.toggle('active');
            navLinksContainer.classList.toggle('active');
            document.body.classList.toggle('no-scroll');
        });
    }

    // Close menu when a link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            menuBtn.classList.remove('active');
            navLinksContainer.classList.remove('active');
            document.body.classList.remove('no-scroll');
        });
    });

    // Theme Toggle with Ripple Effect
    const themeToggle = document.getElementById('theme-toggle');
    const toggleTheme = (e) => {
        const x = e.clientX || window.innerWidth / 2;
        const y = e.clientY || window.innerHeight / 2;

        document.documentElement.style.setProperty('--ripple-x', x + 'px');
        document.documentElement.style.setProperty('--ripple-y', y + 'px');

        if (!document.startViewTransition) {
            document.documentElement.classList.toggle('light-theme');
            const isLight = document.documentElement.classList.contains('light-theme');
            localStorage.setItem('theme', isLight ? 'light' : 'dark');
            return;
        }

        document.documentElement.classList.add('ripple-transition');
        const transition = document.startViewTransition(() => {
            document.documentElement.classList.toggle('light-theme');
            const isLight = document.documentElement.classList.contains('light-theme');
            localStorage.setItem('theme', isLight ? 'light' : 'dark');
        });

        transition.finished.finally(() => {
            document.documentElement.classList.remove('ripple-transition');
        });
    };

    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }

    // Check for saved theme
    if (localStorage.getItem('theme') === 'light') {
        document.documentElement.classList.add('light-theme');
    }

    // Contact Form Handling (Functional via Formspree)
    const contactForm = document.getElementById('contact-form');
    // NOTE: Replace 'YOUR_FORMSPREE_ID' with your actual Formspree ID from https://formspree.io
    const FORMSPREE_ENDPOINT = 'https://formspree.io/f/mlgowdyw';

    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = contactForm.querySelector('button');
        const originalText = btn.textContent;
        const formData = new FormData(contactForm);

        btn.textContent = 'Sending...';
        btn.disabled = true;

        try {
            const response = await fetch(FORMSPREE_ENDPOINT, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                btn.textContent = 'Message Sent!';
                btn.style.background = '#10b981'; // Success green
                contactForm.reset();
            } else {
                throw new Error('Failed to send');
            }
        } finally {
            setTimeout(() => {
                btn.textContent = originalText;
                btn.style.background = '';
                btn.disabled = false;
            }, 3000);
        }
    });

    // Particle Effect
    const canvas = document.getElementById('particle-canvas');
    const ctx = canvas.getContext('2d');
    let particles = [];
    let mouse = { x: null, y: null, radius: 150 };
    let textCoordinates = [];
    let isFormingText = false;

    function initCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        sampleText("P SUSHANTH");
    }

    // Sample text for particle targets
    function sampleText(text) {
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');
        tempCanvas.width = canvas.width;
        tempCanvas.height = canvas.height;

        // Adaptive font size based on screen width
        const fontSize = Math.min(canvas.width / 8, 120);
        tempCtx.font = `bold ${fontSize}px Newsreader`;
        tempCtx.fillStyle = 'white';
        tempCtx.textAlign = 'center';
        tempCtx.textBaseline = 'middle';
        tempCtx.fillText(text, tempCanvas.width / 2, tempCanvas.height / 2);

        const imageData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height).data;
        textCoordinates = [];
        // Sample every 4th pixel for high-resolution text
        for (let y = 0; y < tempCanvas.height; y += 4) {
            for (let x = 0; x < tempCanvas.width; x += 4) {
                if (imageData[(y * tempCanvas.width + x) * 4 + 3] > 128) {
                    textCoordinates.push({ x, y });
                }
            }
        }
    }

    class Particle {
        constructor() {
            this.homeX = Math.random() * canvas.width;
            this.homeY = Math.random() * canvas.height;
            this.x = this.homeX;
            this.y = this.homeY;
            this.targetX = null;
            this.targetY = null;
            this.size = Math.random() * 2 + 1;
            this.vx = (Math.random() - 0.5) * 0.15; // Slowed down from 0.4
            this.vy = (Math.random() - 0.5) * 0.15; // Slowed down from 0.4
            this.density = (Math.random() * 20) + 5;
            this.ease = 0.02 + Math.random() * 0.03; // Thinned from 0.05
        }

        draw() {
            const color = getComputedStyle(document.documentElement).getPropertyValue('--particle-color') || '#000000';
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.closePath();
            ctx.fill();
        }

        update() {
            // Determine current target (either text target or home position)
            let currentTargetX = isFormingText && this.targetX !== null ? this.targetX : this.homeX;
            let currentTargetY = isFormingText && this.targetX !== null ? this.targetY : this.homeY;

            // Move toward target with easing
            this.x += (currentTargetX - this.x) * this.ease;
            this.y += (currentTargetY - this.y) * this.ease;

            // Mouse repulsion (Always active for interactivity)
            let dx = mouse.x - this.x;
            let dy = mouse.y - this.y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < mouse.radius) {
                let force = (mouse.radius - distance) / mouse.radius;
                let directionX = (dx / distance) * force * this.density;
                let directionY = (dy / distance) * force * this.density;
                this.x -= directionX;
                this.y -= directionY;
            }
        }
    }

    function createParticles() {
        particles = [];
        const numToCreate = Math.max(textCoordinates.length, 2000);
        for (let i = 0; i < numToCreate; i++) {
            const p = new Particle();
            if (i < textCoordinates.length) {
                p.targetX = textCoordinates[i].x;
                p.targetY = textCoordinates[i].y;
            }
            particles.push(p);
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < particles.length; i++) {
            particles[i].draw();
            particles[i].update();
        }
        requestAnimationFrame(animate);
    }

    // Animation cycle: Form text, wait, scatter, wait
    function cycleAnimation() {
        isFormingText = true;
        setTimeout(() => {
            isFormingText = false;
            // Scatter for 12 seconds before re-forming
            setTimeout(cycleAnimation, 10000);
        }, 8000); // Hold text for 8 seconds
    }

    // Start cycle after a short initial delay
    setTimeout(cycleAnimation, 2000);

    window.addEventListener('mousemove', (event) => {
        mouse.x = event.x;
        mouse.y = event.y;
    });

    window.addEventListener('resize', () => {
        initCanvas();
        createParticles();
    });

    initCanvas();
    createParticles();
    animate();

    // Custom Cursor Logic
    const cursorDot = document.getElementById('cursor-dot');
    const cursorOutline = document.getElementById('cursor-outline');
    let cursorX = 0, cursorY = 0;
    let outlineX = 0, outlineY = 0;

    window.addEventListener('mousemove', (e) => {
        cursorX = e.clientX;
        cursorY = e.clientY;
        cursorDot.style.left = `${cursorX}px`;
        cursorDot.style.top = `${cursorY}px`;
    });

    // Smooth lerp for cursor outline
    function animateCursor() {
        outlineX += (cursorX - outlineX) * 0.15;
        outlineY += (cursorY - outlineY) * 0.15;
        cursorOutline.style.left = `${outlineX}px`;
        cursorOutline.style.top = `${outlineY}px`;
        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Scroll Progress Indicator
    const scrollBar = document.getElementById('scroll-bar');
    window.addEventListener('scroll', () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        if (scrollBar) scrollBar.style.width = scrolled + "%";
    });

    // Project Modals Controller
    const projectData = {
        'autoportfolio': {
            title: 'AutoPortfolio',
            tags: ['SaaS', 'React', 'Next.js', 'Vercel', 'TailwindCSS'],
            img: 'public/autoportfolio.png',
            description: 'AutoPortfolio is a SaaS platform that helps developers, students, and professionals create and deploy modern portfolio websites in minutes without dealing with design complexity, hosting setup, or frontend development.',
            link: 'https://auto-portfolio-rho.vercel.app/'
        },
        'password-visualizer': {
            title: 'Password Strength Visualizer',
            tags: ['JavaScript', 'Security', 'UI'],
            img: 'public/password.PNG',
            description: 'An interactive tool that provides instant visual feedback on password entropy and complexity, helping users understand security patterns through dynamic UI transitions.',
            link: 'https://p-sushanth.github.io/Password-Strength-Visualizer/'
        },
        'cognitive-monitor': {
            title: 'Cognitive Load Monitor',
            tags: ['React', 'Analysis', 'UX'],
            img: 'public/cognitive_load_monitor.PNG',
            description: 'A sophisticated monitoring dashboard built with React that tracks user cognitive performance metrics during complex task execution using real-time data processing.',
            link: 'https://cognitive-load-monitor.onrender.com'
        },
        'multi-calculator': {
            title: 'Multi-Functional Calculator',
            tags: ['Web App', 'Logic', 'ES6+'],
            img: 'public/multi_functional_calculator.PNG',
            description: 'A comprehensive suite of calculation tools designed for scientific and specialized logical operations, featuring a clean, modular architecture.',
            link: 'https://p-sushanth.github.io/Multi-Functional-Calculator/'
        },
        'typing-test': {
            title: 'Typing Test',
            tags: ['Performance', 'UI', 'UX'],
            img: 'public/typing_test.PNG',
            description: 'A minimalist typing performance tool that measures WPM and accuracy with live feedback, optimized for a smooth, distraction-free user experience.',
            link: 'https://p-sushanth.github.io/Typing-Test/'
        },
        'genz-projects': {
            title: 'GENZ PROJECTS',
            tags: ['Design', 'Portfolio', 'Modern UI'],
            img: 'public/GENZ_Projects.PNG',
            description: 'A curated showcase of experimental web designs and avant-garde UI components, pushing the boundaries of modern front-end aesthetics.',
            link: 'https://p-sushanth.github.io/GENZ-Projects/'
        },
        'ai-legislative': {
            title: 'AI Legislative Analyser',
            tags: ['AI', 'LLM', 'LegalTech'],
            img: 'public/AI_Legislative_Analyser.PNG',
            description: 'A high-end NLP application that uses Large Language Models to parse and summarize complex legislative texts, enhancing legal transparency and accessibility.',
            link: 'https://huggingface.co/spaces/Sushanth-27/The_AI_Legislative_Analyzer'
        },
        'geopopulation': {
            title: 'GeoPopulation Explorer',
            tags: ['React', 'D3.js', 'DataViz'],
            img: 'public/GeoPopulation_Explorer.PNG',
            description: 'An expansive interactive visualization tool for global demographic shifts, utilizing D3.js for high-fidelity geographic data mapping and React for state management.',
            link: 'https://population-pyramid-34p9z13j6-sushanths-projects-e33b8b82.vercel.app/'
        },
        'quantum-fraud': {
            title: 'Quantum Fraud Detection',
            tags: ['Quantum', 'Qiskit', 'Security'],
            img: 'public/Quantum_Fraud_Detection.PNG',
            description: 'An innovative research project demonstrating the application of Quantum Machine Learning (QML) to detect financial fraud patterns with superior precision.',
            link: 'https://huggingface.co/spaces/Sushanth-27/quantum-fraud-detection'
        }
    };

    const modal = document.getElementById('project-modal');
    const modalBody = document.getElementById('modal-body');
    const modalClose = document.getElementById('modal-close');

    function openModal(projectId) {
        const data = projectData[projectId];
        if (!data) return;

        modalBody.innerHTML = `
            <div class="modal-grid">
                <div class="modal-img-container">
                    <img src="${data.img}" alt="${data.title}">
                </div>
                <div class="modal-info">
                    <h3>${data.title}</h3>
                    <div class="modal-tags">
                        ${data.tags.map(tag => `<span class="modal-tag">${tag}</span>`).join('')}
                    </div>
                    <p>${data.description}</p>
                    <a href="${data.link}" target="_blank" class="btn primary" style="margin-top: 1.5rem; display: inline-block;">View Live Space</a>
                </div>
            </div>
        `;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Attach to project cards
    document.querySelectorAll('.project-card').forEach(card => {
        card.addEventListener('click', () => {
            const projectId = card.getAttribute('data-project');
            if (projectId) openModal(projectId);
        });
    });

    modalClose.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    // Quantum Qubit Proximity Interaction
    const qubit = document.getElementById('quantum-qubit');
    if (qubit) {
        window.addEventListener('mousemove', (e) => {
            const rect = qubit.getBoundingClientRect();
            const qubitX = rect.left + rect.width / 2;
            const qubitY = rect.top + rect.height / 2;

            const distance = Math.sqrt(
                Math.pow(e.clientX - qubitX, 2) +
                Math.pow(e.clientY - qubitY, 2)
            );

            // States based on distance
            if (distance < 50) {
                qubit.classList.add('entangled');
                qubit.classList.remove('vibrating');
            } else if (distance < 150) {
                qubit.classList.add('vibrating');
                qubit.classList.remove('entangled');
            } else {
                qubit.classList.remove('vibrating', 'entangled');
            }

            // Subtle magnetic pull for the qubit itself
            if (distance < 100) {
                const pullX = (e.clientX - qubitX) * 0.15;
                const pullY = (e.clientY - qubitY) * 0.15;
                qubit.style.transform = `translate(${pullX}px, ${pullY}px) rotate(${distance * 0.5}deg)`;
            } else {
                qubit.style.transform = 'translate(0, 0) rotate(0)';
            }
        });
    }
});
