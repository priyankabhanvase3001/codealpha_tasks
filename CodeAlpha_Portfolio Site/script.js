/* ============================================================
   ALEX MORGAN — PORTFOLIO JAVASCRIPT
   Features:
   1. Smooth scrolling navigation
   2. Mobile hamburger menu
   3. Active nav link on scroll (Intersection Observer)
   4. Scroll reveal animations
   5. Typing effect in hero
   6. Back-to-top button
   7. Skill progress bar animation
   8. Project filter tabs
   9. Contact form validation
   10. Footer year auto-update
   ============================================================ */

"use strict";   /* Strict mode helps catch silent JS errors */


/* ─── 1. ELEMENT CACHE ─────────────────────────
   Grab DOM elements once and reuse — cheaper
   than repeated querySelector calls              */

const navbar     = document.getElementById("navbar");
const hamburger  = document.getElementById("hamburger");
const navMenu    = document.getElementById("navMenu");
const navLinks   = document.querySelectorAll(".nav-link");
const backToTop  = document.getElementById("backToTop");
const sections   = document.querySelectorAll("section[id]");
const revealEls  = document.querySelectorAll(".reveal");
const skillBars  = document.querySelectorAll(".skill-bar-fill");
const filterBtns = document.querySelectorAll(".filter-btn");
const projectCards = document.querySelectorAll(".project-card");
const contactForm  = document.getElementById("contactForm");
const formSuccess  = document.getElementById("formSuccess");
const submitBtn    = document.getElementById("submitBtn");
const footerYear   = document.getElementById("footerYear");
const typingEl     = document.getElementById("typingText");


/* ─── 2. FOOTER YEAR ───────────────────────────
   Auto-updates the copyright year so you never
   need to change the HTML manually.               */

if (footerYear) {
  footerYear.textContent = new Date().getFullYear();
}


/* ─── 3. NAVBAR SCROLL EFFECT ─────────────────
   Adds/removes .scrolled class to darken the
   navbar when user scrolls past 60px             */

function onScroll() {
  const y = window.scrollY;

  /* Navbar background */
  navbar.classList.toggle("scrolled", y > 60);

  /* Back-to-top button visibility */
  backToTop.classList.toggle("visible", y > 400);

  /* Active nav link */
  updateActiveNavLink();
}

window.addEventListener("scroll", onScroll, { passive: true });


/* ─── 4. BACK-TO-TOP BUTTON ────────────────────
   Smooth scroll to the very top of the page      */

backToTop.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});


/* ─── 5. ACTIVE NAV LINK ───────────────────────
   Highlights the nav link for whichever section
   is currently in the viewport                   */

function updateActiveNavLink() {
  let current = "";

  sections.forEach(section => {
    /* A section is "current" when we've scrolled
       past its top minus a 200px buffer           */
    if (window.scrollY >= section.offsetTop - 200) {
      current = section.getAttribute("id");
    }
  });

  navLinks.forEach(link => {
    link.classList.remove("active");
    if (link.dataset.section === current) {
      link.classList.add("active");
    }
  });
}


/* ─── 6. SMOOTH SCROLL FOR NAV ANCHORS ─────────
   Intercepts anchor clicks and scrolls smoothly,
   accounting for the fixed navbar height          */

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", e => {
    const targetId = anchor.getAttribute("href");
    if (targetId === "#") return;

    const target = document.querySelector(targetId);
    if (!target) return;

    e.preventDefault();
    const navHeight = navbar.offsetHeight;
    const targetTop = target.getBoundingClientRect().top + window.scrollY - navHeight;

    window.scrollTo({ top: targetTop, behavior: "smooth" });

    /* Close mobile menu after clicking a link */
    closeMobileMenu();
  });
});


/* ─── 7. MOBILE HAMBURGER MENU ─────────────────
   Toggles the fullscreen mobile nav open/closed  */

hamburger.addEventListener("click", () => {
  const isOpen = navMenu.classList.toggle("open");
  hamburger.classList.toggle("open", isOpen);
  hamburger.setAttribute("aria-expanded", isOpen.toString());
  document.body.style.overflow = isOpen ? "hidden" : "";
});

function closeMobileMenu() {
  navMenu.classList.remove("open");
  hamburger.classList.remove("open");
  hamburger.setAttribute("aria-expanded", "false");
  document.body.style.overflow = "";
}

/* Close on backdrop click */
document.addEventListener("click", e => {
  if (
    navMenu.classList.contains("open") &&
    !navMenu.contains(e.target) &&
    !hamburger.contains(e.target)
  ) {
    closeMobileMenu();
  }
});

/* Close on Escape key */
document.addEventListener("keydown", e => {
  if (e.key === "Escape" && navMenu.classList.contains("open")) {
    closeMobileMenu();
    hamburger.focus();
  }
});


/* ─── 8. SCROLL REVEAL ANIMATION ───────────────
   Uses IntersectionObserver to trigger CSS
   transitions on .reveal elements as they enter
   the viewport. Much smoother than scroll events */

const revealObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        /* Stop observing once revealed — saves memory */
        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.12,               /* Trigger when 12% visible */
    rootMargin: "0px 0px -40px 0px" /* Slight bottom offset     */
  }
);

revealEls.forEach(el => revealObserver.observe(el));


/* ─── 9. SKILL PROGRESS BAR ANIMATION ──────────
   Bars start at width:0 in CSS.
   When the bar's PARENT section enters the viewport,
   we set width to data-level% — CSS transition does the rest */

const skillSection = document.getElementById("skills");
let skillsAnimated = false;

const skillObserver = new IntersectionObserver(
  entries => {
    if (entries[0].isIntersecting && !skillsAnimated) {
      skillsAnimated = true;

      skillBars.forEach(bar => {
        const level = bar.dataset.level;
        /* Small delay so the bar is in view before moving */
        requestAnimationFrame(() => {
          bar.style.width = level + "%";
        });
      });

      skillObserver.disconnect();
    }
  },
  { threshold: 0.3 }
);

if (skillSection) skillObserver.observe(skillSection);


/* ─── 10. TYPING EFFECT ────────────────────────
   Cycles through an array of role strings with
   a typewriter & backspace animation

   REPLACE: Add or remove roles from the array below */

const roles = [
  "Web Developer",
  "UI Designer",
  "JavaScript Enthusiast",
  "Problem Solver",
  "Open Source Contributor",
];

let roleIndex  = 0;
let charIndex  = 0;
let isDeleting = false;
const TYPE_SPEED   = 90;   /* ms per character while typing  */
const DELETE_SPEED = 50;   /* ms per character while deleting */
const PAUSE_END    = 1600; /* ms to pause at full word        */
const PAUSE_START  = 350;  /* ms to pause before next word    */

function typeEffect() {
  if (!typingEl) return;

  const currentRole = roles[roleIndex];
  const isFullWord  = charIndex === currentRole.length;
  const isEmpty     = charIndex === 0;

  if (!isDeleting && isFullWord) {
    /* Pause at end, then start deleting */
    setTimeout(() => { isDeleting = true; typeEffect(); }, PAUSE_END);
    return;
  }

  if (isDeleting && isEmpty) {
    /* Move to next role, pause before typing */
    isDeleting = false;
    roleIndex  = (roleIndex + 1) % roles.length;
    setTimeout(typeEffect, PAUSE_START);
    return;
  }

  /* Update displayed text */
  charIndex += isDeleting ? -1 : 1;
  typingEl.textContent = currentRole.slice(0, charIndex);

  const delay = isDeleting ? DELETE_SPEED : TYPE_SPEED;
  setTimeout(typeEffect, delay);
}

/* Start after a short delay so the page finishes loading */
setTimeout(typeEffect, 800);


/* ─── 11. PROJECT FILTER TABS ──────────────────
   Clicking a filter button shows/hides project
   cards based on their data-category attribute   */

filterBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    /* Update active button state */
    filterBtns.forEach(b => {
      b.classList.remove("active");
      b.setAttribute("aria-selected", "false");
    });
    btn.classList.add("active");
    btn.setAttribute("aria-selected", "true");

    const filter = btn.dataset.filter;

    projectCards.forEach(card => {
      const category = card.dataset.category;
      const show     = filter === "all" || category === filter;

      if (show) {
        /* Remove hidden → animate back in */
        card.classList.remove("hidden");
        card.style.animation = "fadeIn 0.4s ease both";
      } else {
        card.classList.add("hidden");
        card.style.animation = "";
      }
    });
  });
});

/* Keyframe for filter fade-in (injected into <head>) */
const filterStyle = document.createElement("style");
filterStyle.textContent = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }
`;
document.head.appendChild(filterStyle);


/* ─── 12. CONTACT FORM VALIDATION ──────────────
   Pure JS validation — no library needed.
   Checks each field on submit and shows inline
   error messages.                                */

/* Helper: show or clear a field error */
function setFieldError(fieldId, message) {
  const input = document.getElementById(fieldId);
  const error = document.getElementById(fieldId + "Error");
  const group = input ? input.closest(".form-group") : null;

  if (!input || !error || !group) return;

  if (message) {
    group.classList.add("error");
    error.textContent = message;
  } else {
    group.classList.remove("error");
    error.textContent = "";
  }
}

/* Helper: check a single field */
function validateField(id) {
  const el = document.getElementById(id);
  if (!el) return true;

  const val = el.value.trim();

  if (!val) {
    setFieldError(id, "This field is required.");
    return false;
  }

  /* Email-specific check */
  if (id === "email") {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(val)) {
      setFieldError(id, "Please enter a valid email address.");
      return false;
    }
  }

  setFieldError(id, "");
  return true;
}

/* Clear errors as user types */
["name", "email", "subject", "message"].forEach(id => {
  const el = document.getElementById(id);
  if (el) {
    el.addEventListener("input", () => {
      if (el.value.trim()) setFieldError(id, "");
    });
  }
});

/* Form submit */
if (contactForm) {
  contactForm.addEventListener("submit", (e) => {

    const nameOk = validateField("name");
    const emailOk = validateField("email");
    const subjectOk = validateField("subject");
    const messageOk = validateField("message");

    if (!(nameOk && emailOk && subjectOk && messageOk)) {
      e.preventDefault();
      return;
    }

    submitBtn.disabled = true;
    submitBtn.innerHTML =
      '<i class="ph ph-circle-notch ph-spin"></i> Sending...';

    // Browser submits the form automatically.
  });
}

/* ─── 13. INITIALISE ON PAGE LOAD ───────────────
   Run once after the DOM is fully loaded          */

window.addEventListener("load", () => {
  /* Trigger hero reveals immediately */
  document.querySelectorAll(".hero .reveal").forEach(el => {
    el.classList.add("visible");
  });

  /* Set footer year (belt and suspenders) */
  if (footerYear) footerYear.textContent = new Date().getFullYear();

  /* Initial scroll state (handles page refresh mid-scroll) */
  onScroll();
});


/* ─── HOW TO CUSTOMIZE THIS FILE ──────────────

   Typing roles → Edit the `roles` array (line ~170)

   Form submission → Replace the setTimeout block
   (line ~250) with a real fetch() call to your
   backend or a service like Formspree:
     fetch('https://formspree.io/f/YOUR_ID', {
       method: 'POST',
       body: new FormData(contactForm),
       headers: { 'Accept': 'application/json' }
     })

   Project filters → Add data-category="yourTag"
   to project cards in HTML, then add a matching
   <button data-filter="yourTag"> in the filter row.

   Scroll reveal speed → Change `transition-delay`
   values on .reveal--delay-* classes in style.css

   Typing speed → Adjust TYPE_SPEED and DELETE_SPEED
   constants near the top of section 10.

──────────────────────────────────────────────── */
