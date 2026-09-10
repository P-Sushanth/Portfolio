import React from 'react';
import { createRoot } from 'react-dom/client';
import GithubContributionHeatmap from './components/GithubContributionHeatmap';

function initHeatmaps() {
  const recruiterContainer = document.getElementById('recruiter-github-heatmap');
  if (recruiterContainer && !recruiterContainer.dataset.mounted) {
    recruiterContainer.dataset.mounted = "true";
    const recruiterRoot = createRoot(recruiterContainer);
    recruiterRoot.render(<GithubContributionHeatmap username="P-Sushanth" />);
  }

  const standardContainer = document.getElementById('standard-github-heatmap');
  if (standardContainer && !standardContainer.dataset.mounted) {
    standardContainer.dataset.mounted = "true";
    const standardRoot = createRoot(standardContainer);
    standardRoot.render(<GithubContributionHeatmap username="P-Sushanth" />);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initHeatmaps);
} else {
  initHeatmaps();
}
