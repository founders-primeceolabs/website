const header = document.querySelector('[data-header]');
const menuButton = document.querySelector('.menu-button');
const nav = document.querySelector('.site-header nav');

const closeMenu = () => {
  nav.classList.remove('open');
  header.classList.remove('menu-open');
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.textContent = 'Menu';
};

menuButton.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('open');
  header.classList.toggle('menu-open', isOpen);
  menuButton.setAttribute('aria-expanded', String(isOpen));
  menuButton.textContent = isOpen ? 'Close' : 'Menu';
});

nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));

const setHeaderState = () => header.classList.toggle('scrolled', window.scrollY > 24);
setHeaderState();
window.addEventListener('scroll', setHeaderState, { passive: true });

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const revealItems = document.querySelectorAll('.reveal');

if (reducedMotion || !('IntersectionObserver' in window)) {
  revealItems.forEach((item) => item.classList.add('visible'));
} else {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -5% 0px' });
  revealItems.forEach((item) => revealObserver.observe(item));
}

const assessment = document.querySelector('#assessment-form');
const result = document.querySelector('#assessment-result');
const progress = document.querySelector('.assessment-progress span');
const radioInputs = [...assessment.querySelectorAll('input[type="radio"]')];

const updateProgress = () => {
  const completed = new Set(radioInputs.filter((input) => input.checked).map((input) => input.name)).size;
  progress.style.width = `${(completed / 8) * 100}%`;
};
radioInputs.forEach((input) => input.addEventListener('change', updateProgress));

const resultContent = {
  Revenue: 'Your company may have capacity, but demand, positioning, pricing, or conversion is not yet producing reliable momentum. The next move is to strengthen the system that creates and converts opportunity.',
  Operations: 'Growth may be creating complexity faster than your systems can absorb it. The next move is to clarify ownership, stabilize delivery, and replace recurring intervention with repeatable operating rhythms.',
  Leadership: 'The business may be waiting for its leadership architecture to catch up. The next move is to reduce founder dependency, improve decision cadence, and build leaders who can own outcomes without routing everything through you.'
};

assessment.addEventListener('submit', (event) => {
  event.preventDefault();
  if (!assessment.reportValidity()) return;

  const values = Object.fromEntries(new FormData(assessment).entries());
  const scores = {
    Revenue: Number(values.q1) + Number(values.q2),
    Operations: Number(values.q3) + Number(values.q4),
    Leadership: Number(values.q5) + Number(values.q6)
  };
  const lowestScore = Math.min(...Object.values(scores));
  const constraint = Object.keys(scores).find((engine) => scores[engine] === lowestScore);
  const stageScore = Number(values.q7) + Number(values.q8);
  const stage = stageScore <= 3 ? 'MVE / early Operator' : stageScore <= 5 ? 'Operator' : stageScore <= 7 ? 'CEO transition' : 'Owner transition';

  document.querySelector('#result-engine').textContent = constraint;
  document.querySelector('#result-copy').textContent = resultContent[constraint];
  document.querySelector('#result-stage').textContent = stage;

  const subject = encodeURIComponent(`CEO Diagnostic Application — ${constraint} constraint`);
  const body = encodeURIComponent(`I completed the PRIME check.\n\nLikely constraint: ${constraint}\nFounder stage signal: ${stage}\n\nI would like to explore a CEO Diagnostic.`);
  document.querySelector('#result-cta').href = `mailto:founders@primeceolab.com?subject=${subject}&body=${body}`;

  assessment.hidden = true;
  result.hidden = false;
  result.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'center' });
});

document.querySelector('#retake').addEventListener('click', () => {
  assessment.reset();
  progress.style.width = '0%';
  result.hidden = true;
  assessment.hidden = false;
  assessment.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' });
});
