/**
 * Main JavaScript for 2026 NBA Finals Predictor
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize i18n first (handles language toggle)
  if (typeof I18N !== 'undefined') {
    I18N.init();
  }
  initNavbar();
  initAnimations();
});

/**
 * Highlight active navigation link
 */
function initNavbar() {
  const currentPath = window.location.pathname;
  const links = document.querySelectorAll('.navbar-links a');

  links.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '/' && href === '/')) {
      link.classList.add('active');
    }
  });
}

/**
 * Intersection Observer for fade-in animations
 */
function initAnimations() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  document.querySelectorAll('.card, .game-card, .player-card, .matchup-card, .scenario-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(el);
  });
}

/**
 * Add animate-in class styles
 */
const style = document.createElement('style');
style.textContent = `
  .animate-in {
    opacity: 1 !important;
    transform: translateY(0) !important;
  }
`;
document.head.appendChild(style);

/**
 * Animate a number counting up
 */
function animateNumber(element, target, duration = 1000, suffix = '') {
  const start = 0;
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);

    // Ease out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(start + (target - start) * eased);

    element.textContent = current + suffix;

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  requestAnimationFrame(update);
}

/**
 * Run Monte Carlo simulation via API
 */
async function runSimulation(n = 10000) {
  try {
    const response = await fetch(`/api/simulate?n=${n}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Simulation failed:', error);
    return null;
  }
}

/**
 * Fetch game prediction via API
 */
async function getPrediction(gameNumber) {
  try {
    const response = await fetch(`/api/predict/${gameNumber}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Prediction fetch failed:', error);
    return null;
  }
}
