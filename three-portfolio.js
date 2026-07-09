// Three.js and GSAP are loaded via CDN in index.html and accessed globally
// --- CONFIG & DATA ---
const CONSTELLATIONS = {
    about: {
        name: "About Me",
        center: { x: 0, y: 0, z: -10 },
        color: 0xffffff,
        isCentral: true,
        stars: [
            { id: "about-main", name: "P Sushanth", x: 0, y: 0, z: -10, size: 2.2, type: "about" }
        ]
    },
    projects: {
        name: "Projects",
        center: { x: 35, y: 15, z: -40 },
        color: 0x3b82f6, // Blue
        stars: [
            { id: "autoportfolio", name: "AutoPortfolio", x: 30, y: 20, z: -35, size: 0.9, type: "project" },
            { id: "password-visualizer", name: "Password Visualizer", x: 38, y: 22, z: -45, size: 0.7, type: "project" },
            { id: "cognitive-monitor", name: "Cognitive Load Monitor", x: 42, y: 12, z: -38, size: 0.8, type: "project" },
            { id: "multi-calculator", name: "Multi-Functional Calculator", x: 34, y: 8, z: -48, size: 0.6, type: "project" },
            { id: "typing-test", name: "Typing Test", x: 26, y: 14, z: -42, size: 0.6, type: "project" },
            { id: "genz-projects", name: "GENZ Projects", x: 45, y: 18, z: -50, size: 0.7, type: "project" },
            { id: "ai-legislative", name: "AI Legislative Analyser", x: 28, y: 26, z: -46, size: 0.8, type: "project" },
            { id: "geopopulation", name: "GeoPopulation Explorer", x: 48, y: 8, z: -40, size: 0.8, type: "project" },
            { id: "quantum-fraud", name: "Quantum Fraud Detection", x: 25, y: 8, z: -32, size: 0.9, type: "project" }
        ],
        connections: [
            [0, 1], [1, 2], [2, 7], [7, 5], [5, 3], [3, 4], [4, 8], [8, 6], [6, 0], [0, 2] // Constellation outline
        ]
    },
    education: {
        name: "Education",
        center: { x: -35, y: 20, z: -45 },
        color: 0x10b981, // Green
        stars: [
            { id: "edu-btech", name: "B.Tech - Computer Science", x: -32, y: 24, z: -40, size: 0.9, type: "education" },
            { id: "edu-xii", name: "Class XII", x: -40, y: 26, z: -50, size: 0.7, type: "education" },
            { id: "edu-x", name: "Class X", x: -42, y: 16, z: -42, size: 0.7, type: "education" }
        ],
        connections: [
            [0, 1], [1, 2], [2, 0]
        ]
    },
    certifications: {
        name: "Certifications",
        center: { x: -40, y: -5, z: -45 },
        color: 0x06b6d4, // Cyan
        stars: [
            { id: "cert-mcp", name: "Anthropic MCP Advanced", x: -38, y: 0, z: -40, size: 0.8, type: "cert" },
            { id: "cert-skills", name: "Introduction to Agent Skills", x: -45, y: -2, z: -48, size: 0.7, type: "cert" },
            { id: "cert-meta-front", name: "Meta Front-End Developer", x: -46, y: -10, z: -44, size: 0.7, type: "cert" },
            { id: "cert-meta-back", name: "Meta Back-End Developer", x: -35, y: -12, z: -42, size: 0.7, type: "cert" },
            { id: "cert-google-ai", name: "Google AI Essentials", x: -38, y: -6, z: -38, size: 0.8, type: "cert" }
        ],
        connections: [
            [0, 1], [1, 2], [2, 3], [3, 4], [4, 0]
        ]
    },
    skills: {
        name: "Skills",
        center: { x: -25, y: -20, z: -50 },
        color: 0x8b5cf6, // Purple
        stars: [
            { id: "skill-lang", name: "Languages (Python, JS, Java)", x: -20, y: -16, z: -45, size: 0.8, type: "skills", dataKey: "languages" },
            { id: "skill-frame", name: "Frameworks (React, Next, Node)", x: -30, y: -24, z: -55, size: 0.8, type: "skills", dataKey: "frameworks" },
            { id: "skill-quantum", name: "Quantum Computing & Qiskit", x: -16, y: -26, z: -48, size: 0.9, type: "skills", dataKey: "quantum" },
            { id: "skill-tools", name: "Tools (Git, Figma, MongoDB)", x: -34, y: -15, z: -52, size: 0.7, type: "skills", dataKey: "tools" }
        ],
        connections: [
            [0, 1], [1, 3], [3, 2], [2, 0]
        ]
    },
    contact: {
        name: "Contact",
        center: { x: 30, y: -20, z: -35 },
        color: 0xf59e0b, // Amber
        stars: [
            { id: "contact-email", name: "Email Me", x: 26, y: -16, z: -30, size: 0.8, type: "contact", url: "mailto:popurisushanth@gmail.com" },
            { id: "contact-linkedin", name: "LinkedIn Profile", x: 36, y: -24, z: -40, size: 0.8, type: "contact", url: "https://www.linkedin.com/in/p-sushanth-a04587312" },
            { id: "contact-github", name: "GitHub Profile", x: 22, y: -25, z: -32, size: 0.8, type: "contact", url: "https://github.com/P-Sushanth" }
        ],
        connections: [
            [0, 1], [1, 2], [2, 0]
        ]
    }
};

// --- DOM ELEMENTS ---
const toggleBtn = document.getElementById('three-d-toggle');
const container = document.getElementById('three-container');
const canvas = document.getElementById('three-canvas');
const skipBtn = document.getElementById('skip-intro-btn');
const vignette = document.getElementById('telescope-vignette');

// Create a popup element dynamically for hover labels
const labelPopup = document.createElement('div');
labelPopup.className = 'star-label-popup';
document.body.appendChild(labelPopup);

// --- THREE.JS GLOBALS ---
let scene, camera, renderer;
let starField, interactiveStars = [], constellationLines = [];
let animationFrameId = null;
let isIntroPlaying = false;
let controlsActive = false;
let introTimeline = null;
let hoveredObject = null;
let environmentGroup;

const mouse = new THREE.Vector2();
const raycaster = new THREE.Raycaster();
raycaster.params.Points.threshold = 0.5;

// Camera default focus targets
const defaultTarget = new THREE.Vector3(0, 0, -20);
let currentTarget = new THREE.Vector3().copy(defaultTarget);
let targetCameraPos = new THREE.Vector3(0, 0, 10);
let baseCameraPos = new THREE.Vector3(0, 0, 26);

// --- INITIALIZATION ---
function initThree() {
    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x000000, 0.015);

    // Camera
    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    // Start way back for the outer night sky view
    camera.position.set(0, 45, 120); 
    camera.lookAt(0, 15, -20);

    // Renderer
    renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: false });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 1.5, 100);
    pointLight.position.set(0, 0, 10);
    scene.add(pointLight);

    // Create background stars, nebula, and interactive constellations
    createBackgroundStars();
    createNebula();
    buildConstellations();
    createObservationScene();

    // Resize Handler
    window.addEventListener('resize', onWindowResize);
}

// --- BACKGROUND STARFIELD ---
function createBackgroundStars() {
    const starCount = 3000;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(starCount * 3);
    const colors = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount; i++) {
        // Distribute stars in a large sphere around the scene
        const r = 200 + Math.random() * 200;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos((Math.random() * 2) - 1);

        positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
        positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
        positions[i * 3 + 2] = r * Math.cos(phi);

        // Random star colors (pure white, light blue, warm orange hues)
        const rand = Math.random();
        if (rand > 0.8) {
            colors[i * 3] = 0.8; colors[i * 3 + 1] = 0.9; colors[i * 3 + 2] = 1.0; // blue-white
        } else if (rand > 0.6) {
            colors[i * 3] = 1.0; colors[i * 3 + 1] = 0.9; colors[i * 3 + 2] = 0.8; // warm
        } else {
            colors[i * 3] = 1.0; colors[i * 3 + 1] = 1.0; colors[i * 3 + 2] = 1.0; // white
        }
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // Custom round star texture using canvas
    const starTexture = createCircleTexture();

    const material = new THREE.PointsMaterial({
        size: 1.5,
        map: starTexture,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });

    starField = new THREE.Points(geometry, material);
    scene.add(starField);
}

function createCircleTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 16;
    canvas.height = 16;
    const ctx = canvas.getContext('2d');
    const grad = ctx.createRadialGradient(8, 8, 0, 8, 8, 8);
    grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
    grad.addColorStop(0.3, 'rgba(255, 255, 255, 0.8)');
    grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 16, 16);

    const texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;
    return texture;
}

// --- SLOW ROTATING NEBULA CLOUD ---
let nebulaParticles;
function createNebula() {
    const count = 100;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 150;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 100;
        positions[i * 3 + 2] = -50 - Math.random() * 80;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    // Draw soft blurry clouds
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, 'rgba(60, 130, 246, 0.15)'); // Soft cosmic blue
    grad.addColorStop(0.5, 'rgba(139, 92, 246, 0.08)'); // Soft purple
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 64, 64);

    const texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;

    const material = new THREE.PointsMaterial({
        size: 80,
        map: texture,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });

    nebulaParticles = new THREE.Points(geometry, material);
    scene.add(nebulaParticles);
}

// --- CONSTELLATION BUILDER ---
function buildConstellations() {
    const starTex = createCircleTexture();

    Object.keys(CONSTELLATIONS).forEach(key => {
        const data = CONSTELLATIONS[key];
        const color = data.color;

        // 1. Create Constellation Star Meshes
        data.stars.forEach(starData => {
            // Group each star with a glowing halo
            const starGroup = new THREE.Group();
            starGroup.position.set(starData.x, starData.y, starData.z);

            // Core sphere
            const sphereGeo = new THREE.SphereGeometry(starData.size, 16, 16);
            const sphereMat = new THREE.MeshBasicMaterial({
                color: color,
                transparent: true,
                opacity: 0.95
            });
            const coreMesh = new THREE.Mesh(sphereGeo, sphereMat);
            starGroup.add(coreMesh);

            // Glowing Outer Ring/Halo
            const ringGeo = new THREE.RingGeometry(starData.size * 1.5, starData.size * 1.7, 32);
            const ringMat = new THREE.MeshBasicMaterial({
                color: color,
                side: THREE.DoubleSide,
                transparent: true,
                opacity: 0.35
            });
            const ringMesh = new THREE.Mesh(ringGeo, ringMat);
            starGroup.add(ringMesh);

            // Store custom metadata on the object for raycasting
            coreMesh.userData = {
                id: starData.id,
                name: starData.name,
                type: starData.type,
                url: starData.url,
                dataKey: starData.dataKey,
                parentGroup: starGroup,
                color: color,
                defaultScale: new THREE.Vector3(1, 1, 1),
                starData: starData
            };

            scene.add(starGroup);
            interactiveStars.push(coreMesh);
        });

        // 2. Connect stars in constellation lines
        if (data.connections && data.connections.length > 0) {
            const linePositions = [];
            data.connections.forEach(pair => {
                const startStar = data.stars[pair[0]];
                const endStar = data.stars[pair[1]];
                linePositions.push(startStar.x, startStar.y, startStar.z);
                linePositions.push(endStar.x, endStar.y, endStar.z);
            });

            const lineGeo = new THREE.BufferGeometry();
            lineGeo.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));

            const lineMat = new THREE.LineBasicMaterial({
                color: color,
                transparent: true,
                opacity: 0.15,
                blending: THREE.AdditiveBlending
            });

            const lines = new THREE.LineSegments(lineGeo, lineMat);
            lines.userData = { constellationKey: key };
            scene.add(lines);
            constellationLines.push({ lines, defaultOpacity: 0.15, activeColor: color });
        }
    });
}

// --- CINEMATIC INTRO TIMELINE ---
function playIntro() {
    isIntroPlaying = true;
    controlsActive = false;

    if (environmentGroup) {
        environmentGroup.visible = true;
        environmentGroup.position.set(0, 0, 0);
    }

    // Reset camera position to side-behind overview of the telescope
    camera.position.set(2.5, 2.0, 11.5);
    currentTarget.set(0, 1.55, 6);
    camera.lookAt(currentTarget);

    skipBtn.classList.remove('hidden');
    vignette.classList.add('visible');
    vignette.style.background = '';

    // Create GSAP animation timeline
    introTimeline = gsap.timeline({
        onComplete: () => {
            finishIntro();
        }
    });

    // 1. Zoom around the telescope to align perfectly with the eyepiece lens
    introTimeline.to(camera.position, {
        x: 0,
        y: 0.48,
        z: 7.29,
        duration: 4.5,
        ease: "power2.inOut",
        onUpdate: () => {
            // Keep looking at the eyepiece center (0, 0.99, 6.67)
            currentTarget.set(0, 0.99, 6.67);
            camera.lookAt(currentTarget);
        }
    });

    // 2. Dive straight down the optical tube through the eyepiece (blackout)
    introTimeline.to(camera.position, {
        x: 0,
        y: 1.55,
        z: 6.0,
        duration: 1.5,
        ease: "power3.in",
        onStart: () => {
            // Darken lens vignette overlay completely as camera enters barrel
            vignette.style.background = 'radial-gradient(circle, transparent 0%, rgba(0, 0, 0, 1) 40%)';
        },
        onUpdate: () => {
            currentTarget.set(0, 1.55, 5.0);
            camera.lookAt(currentTarget);
        }
    });

    // 3. Emerge into the deep space (white/blue flash + fade out telescope group)
    introTimeline.to(camera.position, {
        x: 0,
        y: 0,
        z: 26,
        duration: 1.8,
        ease: "power2.out",
        onStart: () => {
            // Hide the ground/telescope environment now that we are in deep space!
            if (environmentGroup) {
                environmentGroup.visible = false;
            }
            // Flash screen white, then fade lens vignette to normal
            vignette.style.background = 'radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(0,0,0,1) 100%)';
            setTimeout(() => {
                vignette.style.background = '';
                vignette.classList.remove('visible');
            }, 300);
        },
        onUpdate: () => {
            currentTarget.lerp(defaultTarget, 0.05);
            camera.lookAt(currentTarget);
        }
    });
}

function finishIntro() {
    isIntroPlaying = false;
    controlsActive = true;
    skipBtn.classList.add('hidden');
    vignette.classList.remove('visible');
    vignette.style.background = '';

    if (environmentGroup) {
        environmentGroup.visible = false;
    }

    // Smoothly settle camera onto home position
    gsap.to(camera.position, {
        x: 0,
        y: 0,
        z: 26,
        duration: 1.0,
        ease: "power1.out",
        onUpdate: () => {
            camera.lookAt(defaultTarget);
        }
    });
}

// --- RENDER LOOP & PHYSICS ANIMATION ---
function animate(time) {
    animationFrameId = requestAnimationFrame(animate);

    // Twinkle background stars slightly
    if (starField) {
        starField.rotation.y = time * 0.00002;
    }

    // Slowly rotate nebula
    if (nebulaParticles) {
        nebulaParticles.rotation.z = time * 0.00001;
    }

    // Spin interactive star ring glows
    interactiveStars.forEach(mesh => {
        const ring = mesh.userData.parentGroup.children[1];
        if (ring) {
            ring.rotation.z += 0.01;
        }
    });

    // Handle interactive user camera pan (parallax) when controls are active
    if (controlsActive && !isIntroPlaying) {
        // Move target position slightly based on mouse relative to the current constellation base view pos
        const factor = 8;
        const tempCameraPos = new THREE.Vector3(
            baseCameraPos.x + mouse.x * factor,
            baseCameraPos.y + mouse.y * factor,
            baseCameraPos.z
        );

        // Smooth camera damping
        camera.position.lerp(tempCameraPos, 0.05);
        camera.lookAt(defaultTarget);
    }

    renderer.render(scene, camera);
}

// --- RAYCASTING (HOVER/CLICK SELECTION) ---
function onMouseMove(event) {
    // Convert mouse coordinates to normalized device coordinates (-1 to +1)
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // Move hover label element on screen
    labelPopup.style.left = `${event.clientX}px`;
    labelPopup.style.top = `${event.clientY}px`;

    if (!controlsActive || isIntroPlaying) return;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(interactiveStars);

    if (intersects.length > 0) {
        const object = intersects[0].object;

        if (hoveredObject !== object) {
            // Reset previous hover object
            resetHovered();

            // Set new hover state
            hoveredObject = object;
            document.body.style.cursor = 'pointer';

            // Scale up the star mesh
            gsap.to(object.scale, { x: 1.5, y: 1.5, z: 1.5, duration: 0.3 });
            
            // Brighten its constellation line network
            const type = object.userData.type;
            brightenConstellationLines(type, true);

            // Show custom label
            labelPopup.textContent = object.userData.name;
            labelPopup.classList.add('visible');
        }
    } else {
        resetHovered();
    }
}

function resetHovered() {
    if (hoveredObject) {
        gsap.to(hoveredObject.scale, { x: 1, y: 1, z: 1, duration: 0.3 });
        brightenConstellationLines(hoveredObject.userData.type, false);
        hoveredObject = null;
        document.body.style.cursor = '';
        labelPopup.classList.remove('visible');
    }
}

function brightenConstellationLines(type, highlight) {
    const typeToKey = {
        'project': 'projects',
        'cert': 'certifications',
        'education': 'education',
        'skills': 'skills',
        'contact': 'contact'
    };
    const targetKey = typeToKey[type];
    if (!targetKey) return;

    constellationLines.forEach(item => {
        if (item.lines.userData.constellationKey === targetKey) {
            gsap.to(item.lines.material, {
                opacity: highlight ? 0.6 : item.defaultOpacity,
                duration: 0.4
            });
        }
    });
}

function onMouseClick() {
    if (!controlsActive || isIntroPlaying || !hoveredObject) return;

    const uData = hoveredObject.userData;
    
    // Smooth camera focus zoom towards clicked star
    controlsActive = false;
    resetHovered();

    const targetPos = new THREE.Vector3().copy(uData.parentGroup.position);
    // Position camera offset from star so it's centered in view
    const cameraZoomPos = new THREE.Vector3(
        targetPos.x,
        targetPos.y,
        targetPos.z + 12
    );

    gsap.to(camera.position, {
        x: cameraZoomPos.x,
        y: cameraZoomPos.y,
        z: cameraZoomPos.z,
        duration: 1.5,
        ease: "power2.inOut",
        onUpdate: () => {
            camera.lookAt(targetPos);
        },
        onComplete: () => {
            // Trigger appropriate modal/action based on star type
            triggerAction(uData);

            // Return camera back to overview after brief delay/modal close
            setTimeout(() => {
                returnToOverview();
            }, 1000);
        }
    });
}

function returnToOverview() {
    gsap.to(camera.position, {
        x: 0,
        y: 0,
        z: 26,
        duration: 1.5,
        ease: "power2.out",
        onUpdate: () => {
            camera.lookAt(defaultTarget);
        },
        onComplete: () => {
            controlsActive = true;
        }
    });
}

// --- ACTIONS WHEN CLICKING STARS ---
function triggerAction(uData) {
    if (uData.type === 'project') {
        if (window.openPortfolioModal) {
            window.openPortfolioModal(uData.id);
        }
    } else if (uData.type === 'cert') {
        openCertModal(uData.id);
    } else if (uData.type === 'education') {
        openEducationModal(uData.id);
    } else if (uData.type === 'skills') {
        openSkillsModal(uData.dataKey);
    } else if (uData.type === 'contact') {
        if (uData.url) {
            window.open(uData.url, '_blank');
        }
    } else if (uData.type === 'about') {
        // Zoomed into central about star - return to 2D about me view or show profile modal
        openAboutModal();
    }
}

function openEducationModal(eduId) {
    const eduDetails = {
        'edu-btech': { title: "B.Tech - Computer Science", school: "GITAM University, Visakhapatnam", desc: "Present • CGPA: 9.22. Received academic scholarship. Focuses on advanced software engineering, AI architectures, and quantum algorithms." },
        'edu-xii': { title: "Class XII", school: "State Board", desc: "2022 • Score: 83%. Specializations in Mathematics, Physics, and Chemistry." },
        'edu-x': { title: "Class X", school: "CBSE", desc: "2020 • Score: 75%." }
    };

    const details = eduDetails[eduId];
    if (details && window.openCustomModal) {
        window.openCustomModal(
            details.title,
            `<div style="text-align: left;">
                <p style="font-size: 0.95rem; color: var(--text-muted); margin-bottom: 1.5rem;">${details.school}</p>
                <p style="line-height: 1.7; font-size: 1.1rem;">${details.desc}</p>
             </div>`
        );
    }
}

// Helper to open generic cards reusing existing layout
function openAboutModal() {
    if (window.openCustomModal) {
        window.openCustomModal(
            "About Me",
            `<div class="about-grid" style="grid-template-columns: 1fr; gap: 1.5rem; text-align: left;">
                <p>I am a B.Tech Computer Science student at GITAM University with a CGPA of 9.22.</p>
                <p>My interest is centered on bridging the gap between high-level engineering abstractions and real-world, performant applications. I am actively researching Post-Quantum Cryptographic systems and building lightweight SaaS tools.</p>
                <div class="personal-info">
                    <div class="item"><strong>Location:</strong> Visakhapatnam, India</div>
                    <div class="item"><strong>Email:</strong> popurisushanth@gmail.com</div>
                </div>
            </div>`
        );
    }
}

function openCertModal(certId) {
    const certDetails = {
        'cert-mcp': { title: "Anthropic MCP Advanced", org: "Anthropic", desc: "Advanced systems development and design around Model Context Protocol interfaces." },
        'cert-skills': { title: "Introduction to Agent Skills", org: "Anthropic", desc: "Instructional and functional training on designing autonomous subagents and prompt routing schemas." },
        'cert-meta-front': { title: "Meta Front-End Developer", org: "Meta", desc: "Professional certificate covering advanced JS, React architectures, UI/UX systems, and production builds." },
        'cert-meta-back': { title: "Meta Back-End Developer", org: "Meta", desc: "Professional certificate covering Node.js databases (SQL/NoSQL), system design, APIs, and cloud deployments." },
        'cert-google-ai': { title: "Google AI Essentials", org: "Google", desc: "Practical applications of GenAI, prompt engineering, and LLM integrations in business workflows." }
    };

    const details = certDetails[certId];
    if (details && window.openCustomModal) {
        window.openCustomModal(
            details.title,
            `<div style="text-align: left;">
                <p style="font-size: 0.95rem; color: var(--text-muted); margin-bottom: 1.5rem;">${details.org} • Professional Certification</p>
                <p style="line-height: 1.7; font-size: 1.1rem;">${details.desc}</p>
             </div>`
        );
    }
}

function openSkillsModal(key) {
    const skillDetails = {
        'languages': { title: "Languages Stack", list: ["Python", "JavaScript / ES6+", "Java / Dart (Flutter)", "HTML5 & CSS3", "C Programming", "SQL (Postgres/MySQL)"] },
        'frameworks': { title: "Frameworks & Runtimes", list: ["React.js & Next.js", "Node.js (Express)", "TensorFlow & Keras", "Three.js & WebGL"] },
        'quantum': { title: "Quantum & Mathematics", list: ["Qiskit Quantum SDK", "Quantum Cryptography Analysis", "Linear Algebra & Probability", "Numerical Optimization"] },
        'tools': { title: "Developer Tools", list: ["Git / GitHub Actions", "VS Code & Android Studio", "Figma Design Editor", "MongoDB & Supabase", "Postman API Tester"] }
    };

    const details = skillDetails[key];
    if (details && window.openCustomModal) {
        window.openCustomModal(
            details.title,
            `<div style="text-align: left;">
                <ul style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; font-size: 1.05rem;">
                    ${details.list.map(item => `<li><span style="color: var(--primary); margin-right: 0.5rem;">✦</span>${item}</li>`).join('')}
                </ul>
             </div>`
        );
    }
}

// --- TOGGLE EVENT HANDLER ---
function toggle3DMode(enable) {
    if (enable) {
        document.body.classList.add('three-d-active');
        toggleBtn.textContent = "2D View";
        
        // Reset base positions
        if (defaultTarget) defaultTarget.set(0, 0, -20);
        if (baseCameraPos) baseCameraPos.set(0, 0, 26);

        // Start Three.js
        if (!scene) {
            initThree();
        }
        
        // Start Render Loop
        if (!animationFrameId) {
            animate(0);
        }

        // Add Mouse interaction listeners
        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('click', onMouseClick);

        // Play intro
        playIntro();
    } else {
        document.body.classList.remove('three-d-active');
        toggleBtn.textContent = "3D View";

        // Stop Render Loop to save performance
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
            animationFrameId = null;
        }

        if (introTimeline) {
            introTimeline.kill();
        }

        // Remove listeners
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('click', onMouseClick);
        labelPopup.classList.remove('visible');

        controlsActive = false;
        isIntroPlaying = false;
    }
}

// Zoom to specific constellation
function zoomToConstellation(key) {
    if (isIntroPlaying) return;

    controlsActive = false;

    if (key === 'home') {
        // Reset back to overview
        gsap.to(defaultTarget, { x: 0, y: 0, z: -20, duration: 1.5, ease: "power2.out" });
        gsap.to(baseCameraPos, { x: 0, y: 0, z: 26, duration: 1.5, ease: "power2.out" });
        gsap.to(camera.position, {
            x: 0,
            y: 0,
            z: 26,
            duration: 1.5,
            ease: "power2.out",
            onUpdate: () => {
                camera.lookAt(defaultTarget);
            },
            onComplete: () => {
                controlsActive = true;
            }
        });
        return;
    }

    const data = CONSTELLATIONS[key];
    if (!data) return;

    const targetPos = new THREE.Vector3(data.center.x, data.center.y, data.center.z);
    
    // Zoomed camera position
    const cameraZoomPos = new THREE.Vector3(
        targetPos.x,
        targetPos.y,
        targetPos.z + 30
    );

    // Animate focal target and base position
    gsap.to(defaultTarget, { x: targetPos.x, y: targetPos.y, z: targetPos.z, duration: 1.5, ease: "power2.inOut" });
    gsap.to(baseCameraPos, { x: cameraZoomPos.x, y: cameraZoomPos.y, z: cameraZoomPos.z, duration: 1.5, ease: "power2.inOut" });

    gsap.to(camera.position, {
        x: cameraZoomPos.x,
        y: cameraZoomPos.y,
        z: cameraZoomPos.z,
        duration: 1.5,
        ease: "power2.inOut",
        onUpdate: () => {
            camera.lookAt(defaultTarget);
        },
        onComplete: () => {
            controlsActive = true;
        }
    });
}

window.zoomToThreeConstellation = zoomToConstellation;

// Toggle Click
if (toggleBtn) {
    toggleBtn.addEventListener('click', (e) => {
        const isActive = document.body.classList.contains('three-d-active');
        const enable = !isActive;

        const x = e.clientX || window.innerWidth / 2;
        const y = e.clientY || window.innerHeight / 2;

        document.documentElement.style.setProperty('--ripple-x', x + 'px');
        document.documentElement.style.setProperty('--ripple-y', y + 'px');

        if (!document.startViewTransition) {
            toggle3DMode(enable);
            return;
        }

        document.documentElement.classList.add('ripple-transition');
        const transition = document.startViewTransition(() => {
            toggle3DMode(enable);
        });

        transition.finished.finally(() => {
            document.documentElement.classList.remove('ripple-transition');
        });
    });
}

// Skip button Click
if (skipBtn) {
    skipBtn.addEventListener('click', () => {
        if (introTimeline) {
            introTimeline.kill();
        }
        finishIntro();
    });
}

function onWindowResize() {
    if (!camera || !renderer) return;
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// --- PROCEDURAL GENERATORS & SCENE ENVIRONMENT ---
function createGrassTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    
    // Dark nocturnal grass base color
    ctx.fillStyle = '#0a140f';
    ctx.fillRect(0, 0, 128, 128);
    
    // Draw fine grass strands
    for (let i = 0; i < 3000; i++) {
        ctx.fillStyle = `rgb(8, ${20 + Math.random() * 25}, 12)`;
        ctx.fillRect(Math.random() * 128, Math.random() * 128, 1, 2 + Math.random() * 3);
    }
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(40, 40);
    return texture;
}

function createWoodTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    
    // Deep mahogany wood tone
    ctx.fillStyle = '#2b1a11';
    ctx.fillRect(0, 0, 128, 128);
    
    // Add grain texture
    ctx.fillStyle = '#1c0f0a';
    for (let i = 0; i < 128; i += 3) {
        ctx.fillRect(0, i + Math.floor(Math.random() * 3), 128, 1 + Math.floor(Math.random() * 2));
    }
    
    const texture = new THREE.CanvasTexture(canvas);
    return texture;
}

function createObservationScene() {
    environmentGroup = new THREE.Group();
    scene.add(environmentGroup);

    // 1. Moonlight lighting system (Directional blue light + Ambient)
    const ambientLight = new THREE.AmbientLight(0x0a1420, 0.75); // Night atmosphere
    environmentGroup.add(ambientLight);

    const moonlight = new THREE.DirectionalLight(0x738ba5, 1.2); // Bright moonlit beams
    moonlight.position.set(15, 25, 20);
    environmentGroup.add(moonlight);

    // 2. Volumetric Grass Plane
    const grassGeo = new THREE.PlaneGeometry(120, 120);
    const grassMat = new THREE.MeshStandardMaterial({
        color: 0x0c160e,
        roughness: 0.95,
        metalness: 0.05,
        map: createGrassTexture()
    });
    const ground = new THREE.Mesh(grassGeo, grassMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = 0;
    environmentGroup.add(ground);

    // 3. Wooden Fence Assembly
    const fenceGroup = new THREE.Group();
    const woodMat = new THREE.MeshStandardMaterial({
        color: 0x3d271d,
        roughness: 0.85,
        map: createWoodTexture()
    });
    
    const postGeo = new THREE.CylinderGeometry(0.08, 0.08, 1.8, 8);
    const slatGeo = new THREE.BoxGeometry(6, 0.15, 0.04);

    // Build vertical posts and horizontal slats in a neat sequence
    for (let x = -15; x <= 15; x += 2.5) {
        const post = new THREE.Mesh(postGeo, woodMat);
        post.position.set(x, 0.9, 0);
        fenceGroup.add(post);
    }
    for (let y = 0.5; y <= 1.4; y += 0.45) {
        const slat1 = new THREE.Mesh(slatGeo, woodMat);
        slat1.position.set(-6, y, 0);
        const slat2 = new THREE.Mesh(slatGeo, woodMat);
        slat2.position.set(6, y, 0);
        fenceGroup.add(slat1, slat2);
    }
    fenceGroup.position.set(0, 0, 1.5); // Placed slightly behind telescope
    environmentGroup.add(fenceGroup);

    // 4. Detailed Tripod and Telescope
    const telescopeGroup = new THREE.Group();
    telescopeGroup.position.set(0, 0, 6);

    const metalDarkMat = new THREE.MeshStandardMaterial({
        color: 0x121214,
        metalness: 0.9,
        roughness: 0.25
    });
    const metalChromeMat = new THREE.MeshStandardMaterial({
        color: 0xdbdbdb,
        metalness: 0.95,
        roughness: 0.1
    });

    // Three leg tripod
    const legGeo = new THREE.CylinderGeometry(0.035, 0.015, 1.5, 8);
    for (let i = 0; i < 3; i++) {
        const leg = new THREE.Mesh(legGeo, metalDarkMat);
        leg.geometry.translate(0, -0.75, 0); // Translate origin to pivot
        leg.position.set(0, 1.4, 0);
        
        const angle = (i * Math.PI * 2) / 3;
        leg.rotation.z = 0.22;
        leg.rotation.y = angle;
        telescopeGroup.add(leg);
    }

    // Chrome mount pivot head
    const mountGeo = new THREE.CylinderGeometry(0.1, 0.1, 0.15, 12);
    const mount = new THREE.Mesh(mountGeo, metalChromeMat);
    mount.position.set(0, 1.45, 0);
    telescopeGroup.add(mount);

    // Optic tube group
    const tubeGroup = new THREE.Group();
    tubeGroup.position.set(0, 1.55, 0);
    tubeGroup.rotation.x = -0.7; // Aimed up at 40 degrees

    // Main barrel tube
    const mainTubeGeo = new THREE.CylinderGeometry(0.14, 0.11, 1.2, 16);
    const mainTube = new THREE.Mesh(mainTubeGeo, metalDarkMat);
    mainTube.rotation.x = Math.PI / 2; // Lie flat along local Z
    tubeGroup.add(mainTube);

    // Objective lens rim
    const capGeo = new THREE.CylinderGeometry(0.15, 0.15, 0.08, 16);
    const cap = new THREE.Mesh(capGeo, metalChromeMat);
    cap.position.set(0, 0, -0.6); // local front tip
    cap.rotation.x = Math.PI / 2;
    tubeGroup.add(cap);

    // Chrome drawtube focus barrel
    const eyeTubeGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.25, 12);
    const eyeTube = new THREE.Mesh(eyeTubeGeo, metalChromeMat);
    eyeTube.position.set(0, 0, 0.7); // local back
    eyeTube.rotation.x = Math.PI / 2;
    tubeGroup.add(eyeTube);

    // Eyepiece lens rim
    const eyeRingGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.06, 12);
    const eyeRing = new THREE.Mesh(eyeRingGeo, metalDarkMat);
    eyeRing.position.set(0, 0, 0.85);
    eyeRing.rotation.x = Math.PI / 2;
    tubeGroup.add(eyeRing);

    // Glowing eyepiece lens (representing the entry point)
    const lensGeo = new THREE.SphereGeometry(0.045, 12, 12);
    const lensMat = new THREE.MeshBasicMaterial({ color: 0x4dabf7 }); // bright sky blue
    const lens = new THREE.Mesh(lensGeo, lensMat);
    lens.position.set(0, 0, 0.87);
    tubeGroup.add(lens);

    telescopeGroup.add(tubeGroup);
    environmentGroup.add(telescopeGroup);

    // Hide environment initially until intro triggers it
    environmentGroup.visible = false;
}
