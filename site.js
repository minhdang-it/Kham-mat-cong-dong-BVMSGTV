document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  const topButton = document.querySelector(".btn-top");
  const faqItems = document.querySelectorAll(".faq-list details");
  const navigationLinks = document.querySelectorAll(
    '.site-header nav a[href^="#"]',
  );
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  );

  // Back to top: show the control only after the reader scrolls 250px.
  const updateTopButton = () => {
    if (!topButton) {
      return;
    }

    const isVisible = window.scrollY > 250;
    topButton.classList.toggle("is-visible", isVisible);
    topButton.setAttribute("aria-hidden", String(!isVisible));
    topButton.tabIndex = isVisible ? 0 : -1;
  };

  topButton?.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion.matches ? "auto" : "smooth",
    });
  });

  window.addEventListener("scroll", updateTopButton, { passive: true });
  updateTopButton();

  // FAQ: keep only one answer open to make the list easier to scan.
  faqItems.forEach((item) => {
    item.addEventListener("toggle", () => {
      if (!item.open) {
        return;
      }

      faqItems.forEach((otherItem) => {
        if (otherItem !== item) {
          otherItem.open = false;
        }
      });
    });
  });

  // Navigation: highlight the section currently visible in the viewport.
  const observedSections = Array.from(navigationLinks)
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  if ("IntersectionObserver" in window && observedSections.length > 0) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (firstEntry, secondEntry) =>
              secondEntry.intersectionRatio - firstEntry.intersectionRatio,
          )[0];

        if (!visibleEntry) {
          return;
        }

        navigationLinks.forEach((link) => {
          const isVisible =
            link.getAttribute("href") === `#${visibleEntry.target.id}`;
          link.classList.toggle("is-active", isVisible);
          link.toggleAttribute("aria-current", isVisible);
        });
      },
      {
        rootMargin: "-25% 0px -60% 0px",
        threshold: [0.05, 0.25, 0.5],
      },
    );

    observedSections.forEach((section) => sectionObserver.observe(section));
  }
});
