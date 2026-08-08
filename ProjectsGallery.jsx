import React, { useState } from 'react';
import MorphSlider from './MorphSlider';

const ALL_PROJECTS = [
  {
    image: '/portlio.png',
    title: 'Portlio',
    description: 'A SaaS platform that helps developers, students, and professionals create and deploy modern portfolio websites in minutes.',
    tags: ['SaaS', 'React', 'Next.js', 'Vercel'],
    link: 'https://auto-portfolio-rho.vercel.app/',
    category: 'web saas'
  },
  {
    image: '/Quantum_Fraud_Detection.PNG',
    title: 'Quantum Fraud Detection',
    description: 'Leveraging quantum computing algorithms to detect sophisticated patterns of financial fraud with high precision.',
    tags: ['Quantum', 'Finance', 'Security'],
    link: 'https://huggingface.co/spaces/Sushanth-27/quantum-fraud-detection',
    category: 'quantum'
  },
  {
    image: '/GeoPopulation_Explorer.PNG',
    title: 'GeoPopulation Explorer',
    description: 'A dynamic, data-driven visualization platform for exploring global population trends and demographic shifts.',
    tags: ['React', 'DataViz', 'D3.js'],
    link: 'https://population-pyramid-34p9z13j6-sushanths-projects-e33b8b82.vercel.app/',
    category: 'web'
  },
  {
    image: '/AI_Legislative_Analyser.PNG',
    title: 'AI Legislative Analyser',
    description: 'An advanced tool using LLMs to parse, summarize, and analyze complex legislative documents for better transparency.',
    tags: ['AI', 'LLM', 'LegalTech'],
    link: 'https://huggingface.co/spaces/Sushanth-27/The_AI_Legislative_Analyzer',
    category: 'ai'
  },
  {
    image: '/GENZ_Projects.PNG',
    title: 'GENZ PROJECTS',
    description: 'A curated collection of modern web experiments and avant-garde UI/UX designs.',
    tags: ['Design', 'Portfolio'],
    link: 'https://p-sushanth.github.io/GENZ-Projects/',
    category: 'web'
  },
  {
    image: '/cognitive_load_monitor.PNG',
    title: 'Cognitive Load Monitor',
    description: 'A sophisticated tool designed to monitor and analyze cognitive load during complex tasks.',
    tags: ['React', 'Analysis'],
    link: 'https://cognitive-load-monitor.onrender.com',
    category: 'web'
  },
  {
    image: '/multi_functional_calculator.PNG',
    title: 'Multi-Functional Calculator',
    description: 'A comprehensive calculation suite featuring advanced mathematical and specialized functions.',
    tags: ['Web App', 'Logic'],
    link: 'https://p-sushanth.github.io/Multi-Functional-Calculator/',
    category: 'web'
  },
  {
    image: '/password.PNG',
    title: 'Password Strength Visualizer',
    description: 'An interactive tool to visualize and analyze the security level of passwords in real-time.',
    tags: ['JavaScript', 'Security'],
    link: 'https://p-sushanth.github.io/Password-Strength-Visualizer/',
    category: 'web'
  },
  {
    image: '/typing_test.PNG',
    title: 'Typing Test',
    description: 'A sleek, minimalist typing speed and accuracy testing application.',
    tags: ['Performance', 'UI'],
    link: 'https://p-sushanth.github.io/Typing-Test/',
    category: 'web'
  }
];

export default function ProjectsGallery() {
  const [filter, setFilter] = useState('all');

  const filteredProjects = ALL_PROJECTS.filter(project => {
    if (filter === 'all') return true;
    const categories = project.category.split(' ');
    return categories.includes(filter);
  }).map(p => ({
    ...p,
    image: `${import.meta.env.BASE_URL || '/'}${p.image.replace(/^\//, '')}`
  }));

  return (
    <div>
      <div className="filter-wrapper">
        {['all', 'ai', 'quantum', 'web', 'saas'].map(cat => (
          <button
            key={cat}
            className={`filter-btn ${filter === cat ? 'active' : ''}`}
            onClick={() => setFilter(cat)}
            style={{ textTransform: 'uppercase' }}
          >
            {cat === 'all' ? 'All' : cat === 'web' ? 'Web Dev' : cat}
          </button>
        ))}
      </div>

      <div style={{ height: '550px', position: 'relative', marginTop: '2rem' }}>
        <MorphSlider
          key={filter}
          items={filteredProjects}
          transition="melt"
          intensity={0.55}
          aberration={0.35}
          drift={0.35}
          autoplay={false}
          radius={8}
        />
      </div>
    </div>
  );
}
