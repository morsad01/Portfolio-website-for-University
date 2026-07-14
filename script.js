/* ============================================================
   script.js  –  Md. Morsadul Islam Portfolio Interactions
   ============================================================ */

(function () {
  'use strict';

  /* ----------------------------------------------------------
     1. THEME SWITCHER (Dark / Light)
     ---------------------------------------------------------- */
  const themeToggle = document.getElementById('theme-toggle');
  
  // Set default theme from localStorage or default to dark
  const currentTheme = localStorage.getItem('theme') || 'dark';
  document.documentElement.setAttribute('data-theme', currentTheme);

  themeToggle.addEventListener('click', function () {
    const activeTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = activeTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  });

  /* ----------------------------------------------------------
     2. NAVIGATION: Scroll State & Underlying Border
     ---------------------------------------------------------- */
  const navHeader = document.getElementById('nav-header');

  function onScroll() {
    navHeader.classList.toggle('scrolled', window.scrollY > 20);
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // Run immediately to sync state on reload

  /* ----------------------------------------------------------
     3. NAVIGATION: Mobile Menu Drawer Toggle
     ---------------------------------------------------------- */
  const navToggle = document.getElementById('nav-toggle');
  const navLinks  = document.getElementById('nav-links');

  navToggle.addEventListener('click', function () {
    const isOpen = navLinks.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', isOpen);
    
    // Prevent double scrolling when drawer is open on mobile
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close menu when clicking on nav link
  navLinks.querySelectorAll('.nav-link').forEach(function (link) {
    link.addEventListener('click', function () {
      navLinks.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  // Close menu if user clicks outside of nav links area
  document.addEventListener('click', function (e) {
    if (navLinks.classList.contains('open') &&
        !navLinks.contains(e.target) &&
        !navToggle.contains(e.target)) {
      navLinks.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  });

  /* ----------------------------------------------------------
     4. INTERACTIVE TABS SYSTEM (Expert / Resume Section)
     ---------------------------------------------------------- */
  const tabButtons = document.querySelectorAll('.expert-tab-btn');
  const tabPanels  = document.querySelectorAll('.expert-panel');

  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Deactivate all tab buttons
      tabButtons.forEach(btn => {
        btn.classList.remove('active');
        btn.setAttribute('aria-selected', 'false');
      });

      // Activate selected button
      button.classList.add('active');
      button.setAttribute('aria-selected', 'true');

      // Hide all panels
      tabPanels.forEach(panel => {
        panel.setAttribute('hidden', '');
        panel.classList.remove('fade-panel-in');
      });

      // Show matching panel
      const targetPanelId = button.getAttribute('aria-controls');
      const targetPanel = document.getElementById(targetPanelId);
      if (targetPanel) {
        targetPanel.removeAttribute('hidden');
        
        // Trigger a tiny micro-animation trigger
        setTimeout(() => {
          targetPanel.classList.add('fade-panel-in');
        }, 10);
      }
    });
  });

  // Add styles dynamically for the panel fade-in effect to script
  const styleEl = document.createElement('style');
  styleEl.textContent = `
    .expert-panel {
      opacity: 0;
      transform: translateY(8px);
      transition: opacity 0.3s ease, transform 0.3s ease;
    }
    .expert-panel:not([hidden]) {
      display: block;
    }
    .expert-panel.fade-panel-in {
      opacity: 1;
      transform: translateY(0);
    }
  `;
  document.head.appendChild(styleEl);
  
  // Set default panel class for active panel on load
  const activePanel = document.querySelector('.expert-panel.active');
  if (activePanel) {
    activePanel.classList.add('fade-panel-in');
  }

  /* ----------------------------------------------------------
     5. PROJECTS FILTER SYSTEM
     ---------------------------------------------------------- */
  const filterBtns   = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      const filter = btn.dataset.filter;

      filterBtns.forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');

      projectCards.forEach(function (card) {
        const match = filter === 'all' || card.dataset.category === filter;
        if (match) {
          card.classList.remove('hidden');
          card.style.opacity = '0';
          card.style.transform = 'translateY(12px)';
          
          setTimeout(() => {
            card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 50);
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });

  /* ----------------------------------------------------------
     6. ACTIVE LINK STATE ON SCROLL (IntersectionObserver)
     ---------------------------------------------------------- */
  const sections  = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-link');

  const sectionObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navAnchors.forEach(function (a) {
          const matches = a.getAttribute('href') === '#' + id;
          a.classList.toggle('active', matches);
        });
      }
    });
  }, {
    rootMargin: '-30% 0px -60% 0px',
    threshold: 0
  });

  sections.forEach(function (s) { sectionObserver.observe(s); });

  /* ----------------------------------------------------------
     7. FADE-IN ON SCROLL ANIMATIONS
     ---------------------------------------------------------- */
  const animObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        animObserver.unobserve(entry.target); // Trigger only once
      }
    });
  }, {
    rootMargin: '0px 0px -50px 0px',
    threshold: 0.05
  });

  document.querySelectorAll('.slide-up').forEach(function (el) {
    animObserver.observe(el);
  });

  /* ----------------------------------------------------------
     8. SCROLL-TO-TOP BUTTON
     ---------------------------------------------------------- */
  const scrollTopBtn = document.getElementById('scroll-top');

  window.addEventListener('scroll', function () {
    if (window.scrollY > 400) {
      scrollTopBtn.removeAttribute('hidden');
    } else {
      scrollTopBtn.setAttribute('hidden', '');
    }
  }, { passive: true });

  scrollTopBtn.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ----------------------------------------------------------
     9. FOOTER YEAR
     ---------------------------------------------------------- */
  const yearEl = document.getElementById('footer-year');
  if (yearEl) { yearEl.textContent = new Date().getFullYear(); }

  /* ----------------------------------------------------------
     10. CONTACT FORM: Simulation & Validation
     ---------------------------------------------------------- */
  const form     = document.getElementById('contact-form');
  const feedback = document.getElementById('form-feedback');

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const name    = form.name.value.trim();
    const email   = form.email.value.trim();
    const subject = form.subject.value.trim();
    const message = form.message.value.trim();

    if (!name || !email || !subject || !message) {
      setFeedback('All fields are required.', 'error');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setFeedback('Please enter a valid email address.', 'error');
      return;
    }

    const submitBtn = form.querySelector('[type="submit"]');
    submitBtn.disabled = true;
    const btnSpan = submitBtn.querySelector('span');
    btnSpan.textContent = 'SENDING...';

    // Simulate async submission
    setTimeout(function () {
      form.reset();
      submitBtn.disabled = false;
      btnSpan.textContent = 'SEND MESSAGE';
      setFeedback('Message sent successfully! I will reach out to you soon.', 'success');

      setTimeout(function () { setFeedback('', ''); }, 6000);
    }, 1500);
  });

  function setFeedback(msg, type) {
    feedback.textContent = msg;
    feedback.className = 'form-status-message' + (type ? ' ' + type : '');
  }

  /* ----------------------------------------------------------
     11. SMOOTH SCROLL ANCHORS & URL CLEANUP
     ---------------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const href = anchor.getAttribute('href');
      
      // Prevent default hash behavior for empty links so '#' never gets added to URL
      if (href === '#') {
        e.preventDefault();
        return;
      }

      const id = href.slice(1);
      const target = document.getElementById(id);
      if (!target) return;
      
      e.preventDefault();
      
      const offset = 76; // Header height
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      
      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  });

  /* ----------------------------------------------------------
     12. INITIAL LOAD: SCROLL TO HASH & CLEAN URL
     ---------------------------------------------------------- */
  window.addEventListener('DOMContentLoaded', function () {
    const hash = window.location.hash;
    if (hash) {
      const target = document.querySelector(hash);
      if (target) {
        // Scroll smoothly to section if page is loaded with hash link
        setTimeout(function () {
          const offset = 76; // Header height
          const top = target.getBoundingClientRect().top + window.scrollY - offset;
          window.scrollTo({ top: top, behavior: 'smooth' });
          
          // Remove the hash from the URL bar after scrolling
          if (history.replaceState) {
            history.replaceState(null, document.title, window.location.pathname + window.location.search);
          }
        }, 150);
      } else {
        // Remove invalid hash from URL bar
        if (history.replaceState) {
          history.replaceState(null, document.title, window.location.pathname + window.location.search);
        }
      }
    } else if (window.location.href.endsWith('#')) {
      // Remove trailing '#' from the URL bar if present
      if (history.replaceState) {
        history.replaceState(null, document.title, window.location.pathname + window.location.search);
      }
    }
  });

})();
