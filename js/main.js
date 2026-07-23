(() => {
  const details = [...document.querySelectorAll(".faq-list details")];
  details.forEach((item) => item.addEventListener("toggle", () => {
    if (!item.open) return;
    details.forEach((other) => { if (other !== item) other.open = false; });
  }));

  const links = [...document.querySelectorAll('.site-header nav a[href^="#"]')];
  const sections = links.map((link) => document.querySelector(link.getAttribute("href"))).filter(Boolean);
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        links.forEach((link) => link.removeAttribute("aria-current"));
        const active = links.find((link) => link.getAttribute("href") === "#" + entry.target.id);
        if (active) active.setAttribute("aria-current", "page");
      });
    }, { rootMargin: "-20% 0px -68%", threshold: 0 });
    sections.forEach((section) => observer.observe(section));
  }
})();
