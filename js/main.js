const topButton = document.querySelector('.btn-top');

const updateTopButton = () => {
  if (!topButton) return;
  const visible = window.scrollY > 250;
  topButton.classList.toggle('is-visible', visible);
  topButton.setAttribute('aria-hidden', String(!visible));
  topButton.tabIndex = visible ? 0 : -1;
};

topButton?.addEventListener('click', () => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
});

window.addEventListener('scroll', updateTopButton, { passive: true });
updateTopButton();

document.querySelectorAll('.faq-list details').forEach((item) => {
  item.addEventListener('toggle', () => {
    if (!item.open) return;
    document.querySelectorAll('.faq-list details[open]').forEach((other) => {
      if (other !== item) other.open = false;
    });
  });
});

const navLinks = [...document.querySelectorAll('.site-header nav a[href^="#"]')];
const sections = navLinks
  .map((link) => document.querySelector(link.getAttribute('href')))
  .filter(Boolean);

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (!visible) return;
    navLinks.forEach((link) => {
      const active = link.getAttribute('href') === '#' + visible.target.id;
      if (active) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });
  }, { rootMargin: '-20% 0px -65%', threshold: [0.05, 0.25, 0.6] });
  sections.forEach((section) => observer.observe(section));
}
