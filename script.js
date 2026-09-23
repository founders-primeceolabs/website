const header = document.querySelector('[data-header]');
const menuButton = document.querySelector('.menu-button');
const nav = document.querySelector('.site-header nav');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const closeMenu = () => { nav.classList.remove('open'); header.classList.remove('menu-open'); menuButton.setAttribute('aria-expanded', 'false'); menuButton.textContent = 'Menu'; };
menuButton.addEventListener('click', () => { const open = nav.classList.toggle('open'); header.classList.toggle('menu-open', open); menuButton.setAttribute('aria-expanded', String(open)); menuButton.textContent = open ? 'Close' : 'Menu'; });
nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
const setHeaderState = () => header.classList.toggle('scrolled', window.scrollY > 24);
setHeaderState(); window.addEventListener('scroll', setHeaderState, { passive: true });

const revealItems = document.querySelectorAll('.reveal');
if (reducedMotion || !('IntersectionObserver' in window)) revealItems.forEach((item) => item.classList.add('visible'));
else { const observer = new IntersectionObserver((entries, current) => entries.forEach((entry) => { if (entry.isIntersecting) { entry.target.classList.add('visible'); current.unobserve(entry.target); } }), { threshold: .12, rootMargin: '0px 0px -5% 0px' }); revealItems.forEach((item) => observer.observe(item)); }

const application = document.querySelector('#application-form');
if (application) application.addEventListener('submit', (event) => { event.preventDefault(); if (!application.reportValidity()) return; const values = Object.fromEntries(new FormData(application).entries()); const subject = encodeURIComponent(`CEO LAB inquiry — ${values.company}`); const body = encodeURIComponent(`CEO LAB inquiry\n\nName: ${values.name}\nEmail: ${values.email}\nCompany: ${values.company}\n\nWhat I would like to work on:\n${values.challenge}`); window.location.href = `mailto:founders@primeceolab.com?subject=${subject}&body=${body}`; });
