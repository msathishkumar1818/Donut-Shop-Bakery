/**
 * DONUT SHOP & BAKERY - GLOBAL JAVASCRIPT (MAIN.JS)
 * Features:
 * - Branded Loader auto-dismiss
 * - Click-only Home Dropdown (Hover NEVER triggers)
 * - Mobile Offcanvas Drawer & Mobile Accordion
 * - Dark Mode persistence (#000000 root)
 * - RTL/LTR direction toggle with localStorage
 * - Scroll to top
 * - Auth Modal (Login/Register tab switching)
 * - Active navigation detection
 */

(function () {
  'use strict';

  // 1. BRANDED LOADER
  function initLoader() {
    const loader = document.getElementById('global-loader');
    if (!loader) return;
    window.addEventListener('load', () => {
      setTimeout(() => {
        loader.classList.add('loaded');
      }, 350);
    });
    // Fallback safeguard in case window.load takes long
    setTimeout(() => {
      if (loader && !loader.classList.contains('loaded')) {
        loader.classList.add('loaded');
      }
    }, 2000);
  }

  // 2. DARK MODE SYSTEM (#000000 background)
  function initDarkMode() {
    const savedTheme = localStorage.getItem('donut_theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcons(savedTheme);

    const toggleBtns = document.querySelectorAll('.theme-toggle-btn');
    toggleBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', nextTheme);
        localStorage.setItem('donut_theme', nextTheme);
        updateThemeIcons(nextTheme);
      });
    });
  }

  function updateThemeIcons(theme) {
    const sunIcons = document.querySelectorAll('.icon-sun');
    const moonIcons = document.querySelectorAll('.icon-moon');
    if (theme === 'dark') {
      sunIcons.forEach((icon) => (icon.style.display = 'block'));
      moonIcons.forEach((icon) => (icon.style.display = 'none'));
    } else {
      sunIcons.forEach((icon) => (icon.style.display = 'none'));
      moonIcons.forEach((icon) => (icon.style.display = 'block'));
    }
  }

  // 3. RTL / LTR DIRECTION TOGGLE
  function initRTL() {
    const savedDir = localStorage.getItem('donut_direction') || 'ltr';
    document.documentElement.setAttribute('dir', savedDir);

    const rtlBtns = document.querySelectorAll('.rtl-toggle-btn');
    const updateRtlLabels = (dir) => {
      rtlBtns.forEach((btn) => {
        const textSpan = btn.querySelector('.rtl-toggle-text');
        if (textSpan) {
          textSpan.textContent = dir === 'rtl' ? 'LTR' : 'RTL';
        }
      });
    };

    updateRtlLabels(savedDir);

    rtlBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const currentDir = document.documentElement.getAttribute('dir') || 'ltr';
        const nextDir = currentDir === 'ltr' ? 'rtl' : 'ltr';
        document.documentElement.setAttribute('dir', nextDir);
        localStorage.setItem('donut_direction', nextDir);
        updateRtlLabels(nextDir);
      });
    });
  }

  // 4. CLICK-ONLY DESKTOP HOME DROPDOWN (Strict: Hover NEVER opens it)
  function initDesktopDropdown() {
    const dropdownToggle = document.querySelector('.dropdown-toggle');
    const dropdownMenu = document.querySelector('.dropdown-menu');

    if (!dropdownToggle || !dropdownMenu) return;

    dropdownToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = dropdownMenu.classList.contains('open');
      if (isOpen) {
        dropdownMenu.classList.remove('open');
        dropdownToggle.setAttribute('aria-expanded', 'false');
      } else {
        dropdownMenu.classList.add('open');
        dropdownToggle.setAttribute('aria-expanded', 'true');
      }
    });

    // Close on click outside
    document.addEventListener('click', (e) => {
      if (!dropdownToggle.contains(e.target) && !dropdownMenu.contains(e.target)) {
        dropdownMenu.classList.remove('open');
        dropdownToggle.setAttribute('aria-expanded', 'false');
      }
    });

    // Close on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && dropdownMenu.classList.contains('open')) {
        dropdownMenu.classList.remove('open');
        dropdownToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // 5. MOBILE DRAWER & ACCORDION
  function initMobileMenu() {
    const openBtn = document.querySelector('.btn-menu-toggle');
    const closeBtn = document.querySelector('.mobile-close-btn');
    const drawer = document.querySelector('.mobile-nav-drawer');
    const accordionToggle = document.querySelector('.mobile-accordion-toggle');
    const accordionContent = document.querySelector('.mobile-accordion-content');
    const allDrawerLinks = drawer ? drawer.querySelectorAll('a') : [];

    if (!drawer) return;

    // Always start accordion CLOSED (regardless of page or URL)
    function resetAccordion() {
      if (accordionContent && accordionToggle) {
        accordionContent.classList.remove('open');
        accordionToggle.setAttribute('aria-expanded', 'false');
      }
    }

    function openDrawer() {
      resetAccordion(); // Always reset Home dropdown when drawer opens
      drawer.classList.add('open');
      drawer.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }

    function closeDrawer() {
      drawer.classList.remove('open');
      drawer.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      resetAccordion(); // Reset when drawer closes too
    }

    if (openBtn) openBtn.addEventListener('click', openDrawer);
    if (closeBtn) closeBtn.addEventListener('click', closeDrawer);

    // Close drawer on backdrop click
    drawer.addEventListener('click', (e) => {
      if (e.target === drawer) closeDrawer();
    });

    // Close drawer on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && drawer.classList.contains('open')) {
        closeDrawer();
      }
    });

    // Close drawer when screen is resized to desktop width (> 1380px)
    window.addEventListener('resize', () => {
      if (window.innerWidth > 1380 && drawer.classList.contains('open')) {
        closeDrawer();
      }
    });

    // Close drawer on Back/Forward Cache page restore or page navigation
    window.addEventListener('pageshow', () => {
      closeDrawer();
    });
    window.addEventListener('pagehide', () => {
      closeDrawer();
    });

    // Close drawer immediately when any link inside drawer is clicked
    allDrawerLinks.forEach((link) => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (!href) {
          closeDrawer();
          return;
        }

        const targetPath = href.split('/').pop().toLowerCase().split('?')[0].split('#')[0];
        let currentPath = window.location.pathname.split('/').pop().toLowerCase().split('?')[0].split('#')[0];
        if (!currentPath || currentPath === '') currentPath = 'index.html';

        // If clicking link to current page, prevent redundant reload, close drawer smoothly & scroll top
        if (targetPath === currentPath) {
          e.preventDefault();
          closeDrawer();
          window.scrollTo({ top: 0, behavior: 'smooth' });
          return;
        }

        // For other pages, close drawer immediately before navigating
        closeDrawer();
      });
    });

    // Accordion toggle: ONLY user click opens/closes it — no auto-open
    if (accordionToggle && accordionContent) {
      accordionToggle.addEventListener('click', () => {
        const isOpen = accordionContent.classList.contains('open');
        if (isOpen) {
          resetAccordion(); // Close
        } else {
          accordionContent.classList.add('open'); // Open
          accordionToggle.setAttribute('aria-expanded', 'true');
        }
      });
    }

    // Force drawer & accordion strictly CLOSED on initial load
    closeDrawer();
  }

  // 6. SCROLL TO TOP BUTTON
  function initScrollToTop() {
    const scrollBtn = document.querySelector('.btn-scroll-top');
    if (!scrollBtn) return;

    window.addEventListener('scroll', () => {
      if (window.scrollY > 300) {
        scrollBtn.classList.add('visible');
      } else {
        scrollBtn.classList.remove('visible');
      }
    });

    scrollBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    });
  }

  // 7. AUTH MODAL (LOGIN & REGISTER)
  function initAuthModal() {
    const overlay = document.querySelector('.auth-modal-overlay');
    const closeBtn = document.querySelector('.auth-modal-close');
    const openBtns = document.querySelectorAll('.btn-login, [data-auth-modal]');
    const tabBtns = document.querySelectorAll('.auth-tab-btn');
    const loginForm = document.getElementById('modal-login-form');
    const registerForm = document.getElementById('modal-register-form');

    if (!overlay) return;

    function openModal() {
      overlay.classList.add('open');
      document.body.style.overflow = 'hidden';
    }

    function closeModal() {
      overlay.classList.remove('open');
      document.body.style.overflow = '';
    }

    openBtns.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        // If it's not linking directly to an external page, open modal
        if (!btn.getAttribute('href') || btn.getAttribute('href') === '#') {
          e.preventDefault();
          openModal();
        }
      });
    });

    if (closeBtn) closeBtn.addEventListener('click', closeModal);

    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeModal();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && overlay.classList.contains('open')) {
        closeModal();
      }
    });

    // Tab switching
    tabBtns.forEach((tab) => {
      tab.addEventListener('click', () => {
        const targetTab = tab.getAttribute('data-tab');
        tabBtns.forEach((b) => b.classList.remove('active'));
        tab.classList.add('active');

        if (targetTab === 'register') {
          if (loginForm) loginForm.style.display = 'none';
          if (registerForm) registerForm.style.display = 'block';
        } else {
          if (loginForm) loginForm.style.display = 'block';
          if (registerForm) registerForm.style.display = 'none';
        }
      });
    });
  }

  // 8. ACTIVE NAVIGATION DETECTION
  function initActiveNav() {
    let currentPath = window.location.pathname.split('/').pop().toLowerCase().split('?')[0].split('#')[0];
    if (!currentPath || currentPath === '') {
      currentPath = 'index.html';
    }

    const isHomePage = (currentPath === 'index.html' || currentPath === 'home-2.html');

    // 1. Desktop Home dropdown toggle
    const desktopHomeToggle = document.querySelector('.dropdown-toggle');
    if (desktopHomeToggle) {
      if (isHomePage) {
        desktopHomeToggle.classList.add('active');
      } else {
        desktopHomeToggle.classList.remove('active');
      }
    }

    // 2. Mobile accordion toggle
    const accordionToggle = document.querySelector('.mobile-accordion-toggle');
    if (accordionToggle) {
      if (isHomePage) {
        accordionToggle.classList.add('active');
      } else {
        accordionToggle.classList.remove('active');
      }
    }

    // 3. Mark active links across navigation
    const allLinks = document.querySelectorAll('.nav-link, .dropdown-link, .mobile-nav-link, .mobile-sublink');
    allLinks.forEach((link) => {
      const href = link.getAttribute('href');
      if (href) {
        const linkPath = href.split('/').pop().toLowerCase().split('?')[0].split('#')[0];
        if (linkPath === currentPath) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      }
    });
  }

  // 9. UNIVERSAL SCROLL & ENTRANCE ANIMATIONS (All Pages)
  function initScrollAnimations() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.querySelectorAll('.reveal-on-scroll, .reveal-scale-in, .reveal-fade-in').forEach((el) => {
        el.classList.add('is-visible');
      });
      return;
    }

    const animTargets = document.querySelectorAll(
      '.reveal-on-scroll, .reveal-scale-in, .reveal-fade-in, ' +
      '.section-header, .section-head, .flavor-card, .pillar-card, .curation-card, ' +
      '.team-card, .amenity-card, .contact-desk-card, .contact-faq-card, ' +
      '.showcase-image-card, .kitchen-mosaic-item, .craft-step-item, ' +
      '.cta-inner-box, .concierge-status-card, .contact-live-map-card, ' +
      '.location-card, .chapter-card, .style-card, .timeline-step, .mosaic-photo'
    );

    animTargets.forEach((el) => {
      if (!el.classList.contains('reveal-on-scroll') && 
          !el.classList.contains('reveal-scale-in') && 
          !el.classList.contains('reveal-fade-in')) {
        el.classList.add('reveal-on-scroll');
        const siblingIndex = Array.from(el.parentNode.children).indexOf(el);
        if (siblingIndex > 0 && siblingIndex <= 5) {
          el.style.transitionDelay = `${siblingIndex * 0.12}s`;
        }
      }
    });

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            obs.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
      });

      animTargets.forEach((el) => observer.observe(el));
    } else {
      // Fallback for older browsers
      animTargets.forEach((el) => el.classList.add('is-visible'));
    }
  }

  // 10. LUXURY BRANDED CUSTOM SELECT COMPONENT
  function initCustomSelects() {
    const selects = document.querySelectorAll('select.auth-form-input, .contact-field-group select');
    selects.forEach((select) => {
      if (select.dataset.customized === 'true') return;
      select.dataset.customized = 'true';

      // Hide native select visually
      select.style.display = 'none';

      // Wrapper
      const wrapper = document.createElement('div');
      wrapper.className = 'custom-select-wrapper';

      // Trigger button
      const trigger = document.createElement('button');
      trigger.type = 'button';
      trigger.className = 'custom-select-trigger';
      trigger.setAttribute('aria-haspopup', 'listbox');
      trigger.setAttribute('aria-expanded', 'false');

      const triggerText = document.createElement('span');
      triggerText.className = 'custom-select-text';
      const selectedOption = select.options[select.selectedIndex] || select.options[0];
      triggerText.textContent = selectedOption ? selectedOption.textContent : 'Select...';

      // SVG chevron arrow
      const arrow = document.createElement('span');
      arrow.className = 'custom-select-arrow';
      arrow.innerHTML = `
        <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16" aria-hidden="true">
          <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.25a.75.75 0 01-1.06 0L5.21 8.27a.75.75 0 01.02-1.06z" clip-rule="evenodd" />
        </svg>
      `;

      trigger.appendChild(triggerText);
      trigger.appendChild(arrow);
      wrapper.appendChild(trigger);

      // Options menu
      const optionsMenu = document.createElement('div');
      optionsMenu.className = 'custom-select-options';
      optionsMenu.setAttribute('role', 'listbox');

      Array.from(select.options).forEach((opt, index) => {
        if (opt.disabled && !opt.value) {
          return;
        }
        const optEl = document.createElement('div');
        optEl.className = 'custom-select-option';
        if (index === select.selectedIndex) {
          optEl.classList.add('selected');
        }
        optEl.setAttribute('role', 'option');
        optEl.setAttribute('data-value', opt.value);
        optEl.textContent = opt.textContent;

        optEl.addEventListener('click', (e) => {
          e.stopPropagation();
          select.selectedIndex = index;
          triggerText.textContent = opt.textContent;

          optionsMenu.querySelectorAll('.custom-select-option').forEach(o => o.classList.remove('selected'));
          optEl.classList.add('selected');

          closeDropdown();
          select.dispatchEvent(new Event('change', { bubbles: true }));
        });

        optionsMenu.appendChild(optEl);
      });

      wrapper.appendChild(optionsMenu);
      select.parentNode.insertBefore(wrapper, select.nextSibling);

      function openDropdown() {
        document.querySelectorAll('.custom-select-wrapper.open').forEach(w => {
          if (w !== wrapper) {
            w.classList.remove('open');
            const otherTrigger = w.querySelector('.custom-select-trigger');
            if (otherTrigger) otherTrigger.setAttribute('aria-expanded', 'false');
          }
        });
        wrapper.classList.add('open');
        trigger.setAttribute('aria-expanded', 'true');
      }

      function closeDropdown() {
        wrapper.classList.remove('open');
        trigger.setAttribute('aria-expanded', 'false');
      }

      trigger.addEventListener('click', (e) => {
        e.stopPropagation();
        if (wrapper.classList.contains('open')) {
          closeDropdown();
        } else {
          openDropdown();
        }
      });
    });

    document.addEventListener('click', (e) => {
      if (!e.target.closest('.custom-select-wrapper')) {
        document.querySelectorAll('.custom-select-wrapper.open').forEach(w => {
          w.classList.remove('open');
          const t = w.querySelector('.custom-select-trigger');
          if (t) t.setAttribute('aria-expanded', 'false');
        });
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        document.querySelectorAll('.custom-select-wrapper.open').forEach(w => {
          w.classList.remove('open');
          const t = w.querySelector('.custom-select-trigger');
          if (t) t.setAttribute('aria-expanded', 'false');
        });
      }
    });
  }

  // 11. LUXURY ARTISAN CUSTOM DATEPICKER COMPONENT
  function initCustomDatePicker() {
    const dateInputs = document.querySelectorAll('input[type="date"]');
    if (!dateInputs.length) return;

    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const monthShortNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const dayNames = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

    dateInputs.forEach((input) => {
      if (input.dataset.customized === 'true') return;
      input.dataset.customized = 'true';

      // Hide native input visually
      input.style.display = 'none';

      // Current view month & year state
      const today = new Date();
      let selectedDate = null;
      if (input.value) {
        const parts = input.value.split('-');
        if (parts.length === 3) {
          selectedDate = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
        }
      }

      let viewYear = selectedDate ? selectedDate.getFullYear() : today.getFullYear();
      let viewMonth = selectedDate ? selectedDate.getMonth() : today.getMonth();

      // Create wrapper
      const wrapper = document.createElement('div');
      wrapper.className = 'custom-datepicker-wrapper';

      // Create trigger button
      const trigger = document.createElement('button');
      trigger.type = 'button';
      trigger.className = 'custom-datepicker-trigger';
      trigger.setAttribute('aria-haspopup', 'dialog');
      trigger.setAttribute('aria-expanded', 'false');

      const defaultPlaceholder = input.getAttribute('placeholder') || 'DD/MM/YYYY';

      const triggerText = document.createElement('span');
      triggerText.className = selectedDate ? 'datepicker-value' : 'datepicker-placeholder';
      triggerText.textContent = selectedDate 
        ? `${monthShortNames[selectedDate.getMonth()]} ${selectedDate.getDate()}, ${selectedDate.getFullYear()}`
        : defaultPlaceholder;

      const triggerIcon = document.createElement('span');
      triggerIcon.className = 'datepicker-icon';
      triggerIcon.innerHTML = `
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
          <line x1="16" y1="2" x2="16" y2="6"/>
          <line x1="8" y1="2" x2="8" y2="6"/>
          <line x1="3" y1="10" x2="21" y2="10"/>
        </svg>
      `;

      trigger.appendChild(triggerText);
      trigger.appendChild(triggerIcon);
      wrapper.appendChild(trigger);

      // Create popup
      const popup = document.createElement('div');
      popup.className = 'custom-datepicker-popup';
      popup.setAttribute('role', 'dialog');
      popup.setAttribute('aria-label', 'Calendar Date Picker');

      // Popup Header
      const header = document.createElement('div');
      header.className = 'datepicker-header';

      const prevBtn = document.createElement('button');
      prevBtn.type = 'button';
      prevBtn.className = 'datepicker-nav-btn prev';
      prevBtn.setAttribute('aria-label', 'Previous Month');
      prevBtn.innerHTML = `
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="15 18 9 12 15 6"/>
        </svg>
      `;

      const monthYearTitle = document.createElement('span');
      monthYearTitle.className = 'datepicker-month-year';

      const nextBtn = document.createElement('button');
      nextBtn.type = 'button';
      nextBtn.className = 'datepicker-nav-btn next';
      nextBtn.setAttribute('aria-label', 'Next Month');
      nextBtn.innerHTML = `
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="9 18 15 12 9 6"/>
        </svg>
      `;

      header.appendChild(prevBtn);
      header.appendChild(monthYearTitle);
      header.appendChild(nextBtn);
      popup.appendChild(header);

      // Weekday headers
      const weekdaysRow = document.createElement('div');
      weekdaysRow.className = 'datepicker-weekdays';
      dayNames.forEach((d) => {
        const span = document.createElement('span');
        span.textContent = d;
        weekdaysRow.appendChild(span);
      });
      popup.appendChild(weekdaysRow);

      // Days grid container
      const daysGrid = document.createElement('div');
      daysGrid.className = 'datepicker-days';
      popup.appendChild(daysGrid);

      // Footer
      const footer = document.createElement('div');
      footer.className = 'datepicker-footer';

      const clearBtn = document.createElement('button');
      clearBtn.type = 'button';
      clearBtn.className = 'datepicker-action-btn clear-btn';
      clearBtn.textContent = 'Clear';

      const todayBtn = document.createElement('button');
      todayBtn.type = 'button';
      todayBtn.className = 'datepicker-action-btn today-btn';
      todayBtn.textContent = 'Today';

      footer.appendChild(clearBtn);
      footer.appendChild(todayBtn);
      popup.appendChild(footer);

      wrapper.appendChild(popup);
      input.parentNode.insertBefore(wrapper, input.nextSibling);

      // Render calendar for viewYear & viewMonth
      function renderCalendar() {
        monthYearTitle.textContent = `${monthNames[viewMonth]} ${viewYear}`;
        daysGrid.innerHTML = '';

        const firstDayIndex = new Date(viewYear, viewMonth, 1).getDay();
        const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
        const prevMonthLastDay = new Date(viewYear, viewMonth, 0).getDate();

        // Previous month days
        for (let i = firstDayIndex - 1; i >= 0; i--) {
          const dayBtn = document.createElement('button');
          dayBtn.type = 'button';
          dayBtn.className = 'datepicker-day other-month';
          dayBtn.textContent = prevMonthLastDay - i;
          const dayNum = prevMonthLastDay - i;
          dayBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            viewMonth--;
            if (viewMonth < 0) {
              viewMonth = 11;
              viewYear--;
            }
            selectDay(viewYear, viewMonth, dayNum);
          });
          daysGrid.appendChild(dayBtn);
        }

        // Current month days
        for (let d = 1; d <= daysInMonth; d++) {
          const dayBtn = document.createElement('button');
          dayBtn.type = 'button';
          dayBtn.className = 'datepicker-day';
          dayBtn.textContent = d;

          const isToday = (
            d === today.getDate() &&
            viewMonth === today.getMonth() &&
            viewYear === today.getFullYear()
          );
          if (isToday) dayBtn.classList.add('today');

          const isSelected = (
            selectedDate &&
            d === selectedDate.getDate() &&
            viewMonth === selectedDate.getMonth() &&
            viewYear === selectedDate.getFullYear()
          );
          if (isSelected) dayBtn.classList.add('selected');

          dayBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            selectDay(viewYear, viewMonth, d);
          });

          daysGrid.appendChild(dayBtn);
        }

        // Next month days to complete grid rows
        const totalSlots = daysGrid.children.length;
        const remainingSlots = (totalSlots % 7 === 0) ? 0 : 7 - (totalSlots % 7);
        for (let n = 1; n <= remainingSlots; n++) {
          const dayBtn = document.createElement('button');
          dayBtn.type = 'button';
          dayBtn.className = 'datepicker-day other-month';
          dayBtn.textContent = n;
          const dayNum = n;
          dayBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            viewMonth++;
            if (viewMonth > 11) {
              viewMonth = 0;
              viewYear++;
            }
            selectDay(viewYear, viewMonth, dayNum);
          });
          daysGrid.appendChild(dayBtn);
        }
      }

      function selectDay(year, month, day) {
        selectedDate = new Date(year, month, day);
        const yyyy = selectedDate.getFullYear();
        const mm = String(selectedDate.getMonth() + 1).padStart(2, '0');
        const dd = String(selectedDate.getDate()).padStart(2, '0');

        input.value = `${yyyy}-${mm}-${dd}`;
        triggerText.className = 'datepicker-value';
        triggerText.textContent = `${monthShortNames[selectedDate.getMonth()]} ${selectedDate.getDate()}, ${selectedDate.getFullYear()}`;

        renderCalendar();
        closePopup();
        input.dispatchEvent(new Event('change', { bubbles: true }));
        input.dispatchEvent(new Event('input', { bubbles: true }));
      }

      function clearSelection() {
        selectedDate = null;
        input.value = '';
        triggerText.className = 'datepicker-placeholder';
        triggerText.textContent = defaultPlaceholder;
        renderCalendar();
        closePopup();
        input.dispatchEvent(new Event('change', { bubbles: true }));
        input.dispatchEvent(new Event('input', { bubbles: true }));
      }

      function openPopup() {
        // Close all other open datepickers or custom selects
        document.querySelectorAll('.custom-datepicker-wrapper.open').forEach((w) => {
          if (w !== wrapper) {
            w.classList.remove('open');
            const trig = w.querySelector('.custom-datepicker-trigger');
            if (trig) trig.setAttribute('aria-expanded', 'false');
          }
        });
        document.querySelectorAll('.custom-select-wrapper.open').forEach((w) => {
          w.classList.remove('open');
          const trig = w.querySelector('.custom-select-trigger');
          if (trig) trig.setAttribute('aria-expanded', 'false');
        });

        renderCalendar();
        wrapper.classList.add('open');
        trigger.setAttribute('aria-expanded', 'true');
      }

      function closePopup() {
        wrapper.classList.remove('open');
        trigger.setAttribute('aria-expanded', 'false');
      }

      // Prev / Next button listeners
      prevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        viewMonth--;
        if (viewMonth < 0) {
          viewMonth = 11;
          viewYear--;
        }
        renderCalendar();
      });

      nextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        viewMonth++;
        if (viewMonth > 11) {
          viewMonth = 0;
          viewYear++;
        }
        renderCalendar();
      });

      // Clear & Today button listeners
      clearBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        clearSelection();
      });

      todayBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const now = new Date();
        viewYear = now.getFullYear();
        viewMonth = now.getMonth();
        selectDay(viewYear, viewMonth, now.getDate());
      });

      // Toggle trigger
      trigger.addEventListener('click', (e) => {
        e.stopPropagation();
        if (wrapper.classList.contains('open')) {
          closePopup();
        } else {
          openPopup();
        }
      });
    });

    // Close on click outside
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.custom-datepicker-wrapper')) {
        document.querySelectorAll('.custom-datepicker-wrapper.open').forEach((w) => {
          w.classList.remove('open');
          const trig = w.querySelector('.custom-datepicker-trigger');
          if (trig) trig.setAttribute('aria-expanded', 'false');
        });
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        document.querySelectorAll('.custom-datepicker-wrapper.open').forEach((w) => {
          w.classList.remove('open');
          const trig = w.querySelector('.custom-datepicker-trigger');
          if (trig) trig.setAttribute('aria-expanded', 'false');
        });
      }
    });
  }

  // Initialize all features once DOM is ready
  document.addEventListener('DOMContentLoaded', () => {
    initLoader();
    initDarkMode();
    initRTL();
    initDesktopDropdown();
    initMobileMenu();
    initScrollToTop();
    initAuthModal();
    initActiveNav();
    initScrollAnimations();
    initCustomSelects();
    initCustomDatePicker();
  });
})();
