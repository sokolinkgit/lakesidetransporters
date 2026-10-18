(() => {
  'use strict';

  document.documentElement.classList.add('js-ready');

  const counties = [
    { name: 'Mombasa', x: 239, y: 188 },
    { name: 'Kwale', x: 227, y: 202 },
    { name: 'Kilifi', x: 239, y: 174 },
    { name: 'Tana River', x: 244, y: 148 },
    { name: 'Lamu', x: 253, y: 155 },
    { name: 'Taita-Taveta', x: 211, y: 181 },
    { name: 'Garissa', x: 231, y: 132 },
    { name: 'Wajir', x: 242, y: 92 },
    { name: 'Mandera', x: 251, y: 57 },
    { name: 'Marsabit', x: 185, y: 70 },
    { name: 'Isiolo', x: 177, y: 106 },
    { name: 'Meru', x: 175, y: 121 },
    { name: 'Tharaka-Nithi', x: 169, y: 132 },
    { name: 'Embu', x: 167, y: 141 },
    { name: 'Kitui', x: 188, y: 154 },
    { name: 'Machakos', x: 169, y: 158 },
    { name: 'Makueni', x: 177, y: 174 },
    { name: 'Nyandarua', x: 143, y: 136 },
    { name: 'Nyeri', x: 158, y: 132 },
    { name: 'Kirinyaga', x: 164, y: 137 },
    { name: "Murang'a", x: 155, y: 129 },
    { name: 'Kiambu', x: 147, y: 141 },
    { name: 'Turkana', x: 78, y: 57 },
    { name: 'West Pokot', x: 98, y: 101 },
    { name: 'Samburu', x: 139, y: 91 },
    { name: 'Trans Nzoia', x: 105, y: 116 },
    { name: 'Uasin Gishu', x: 123, y: 120 },
    { name: 'Elgeyo-Marakwet', x: 136, y: 111 },
    { name: 'Nandi', x: 118, y: 133 },
    { name: 'Baringo', x: 137, y: 122 },
    { name: 'Laikipia', x: 155, y: 105 },
    { name: 'Nakuru', x: 132, y: 141 },
    { name: 'Narok', x: 122, y: 160 },
    { name: 'Kajiado', x: 146, y: 169 },
    { name: 'Kericho', x: 115, y: 147 },
    { name: 'Bomet', x: 117, y: 157 },
    { name: 'Kakamega', x: 94, y: 136 },
    { name: 'Vihiga', x: 101, y: 144 },
    { name: 'Bungoma', x: 83, y: 130 },
    { name: 'Busia', x: 70, y: 141 },
    { name: 'Siaya', x: 80, y: 151 },
    { name: 'Kisumu', x: 95, y: 153 },
    { name: 'Homa Bay', x: 89, y: 165 },
    { name: 'Migori', x: 104, y: 177 },
    { name: 'Kisii', x: 111, y: 164 },
    { name: 'Nyamira', x: 117, y: 160 },
    { name: 'Nairobi', x: 151, y: 151 }
  ];

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const routePath = document.getElementById('route-path');
  const routeDestination = document.getElementById('route-destination');
  const routeIndex = document.getElementById('route-index');
  const routeProgress = document.getElementById('route-progress-bar');
  const mapDestination = document.getElementById('map-destination');
  const mapDestinationHalo = document.getElementById('map-destination-halo');
  const mapDots = document.getElementById('map-county-dots');
  const destinationSelect = document.getElementById('destination-select');
  const svgNamespace = 'http://www.w3.org/2000/svg';
  const origin = { x: 151, y: 151 };
  let routeIndexValue = 0;

  function makeSvgElement(tag, attrs = {}) {
    const element = document.createElementNS(svgNamespace, tag);
    Object.entries(attrs).forEach(([key, value]) => element.setAttribute(key, value));
    return element;
  }

  if (destinationSelect) {
    counties.forEach((county) => {
      const option = document.createElement('option');
      option.value = county.name;
      option.textContent = county.name;
      destinationSelect.appendChild(option);
    });
  }

  if (mapDots && routePath && routeDestination && routeIndex && routeProgress && mapDestination && mapDestinationHalo) {
    const dotElements = counties.map((county, index) => {
      const dot = makeSvgElement('circle', {
        cx: county.x,
        cy: county.y,
        r: county.name === 'Nairobi' ? 2.6 : 2.1,
        class: `map-county-dot${county.name === 'Nairobi' ? ' is-origin' : ''}`,
        'data-county-index': index
      });
      mapDots.appendChild(dot);
      return dot;
    });

    function drawRoute(county, index) {
      const end = county.name === 'Nairobi' ? { x: 160, y: 158 } : county;
      const curveY = Math.min(origin.y, end.y) - 20 - Math.min(14, Math.abs(end.x - origin.x) * 0.055);
      const controlX = (origin.x + end.x) / 2;
      routePath.setAttribute('d', `M ${origin.x} ${origin.y} Q ${controlX} ${curveY} ${end.x} ${end.y}`);
      mapDestination.setAttribute('cx', end.x);
      mapDestination.setAttribute('cy', end.y);
      mapDestinationHalo.setAttribute('cx', end.x);
      mapDestinationHalo.setAttribute('cy', end.y);
      routeDestination.textContent = county.name;
      routeDestination.setAttribute('aria-label', county.name);
      routeIndex.textContent = String(index + 1).padStart(2, '0');
      routeProgress.style.width = `${((index + 1) / counties.length) * 100}%`;
      dotElements.forEach((dot, dotIndex) => {
        dot.classList.toggle('is-destination', dotIndex === index);
      });
    }

    drawRoute(counties[routeIndexValue], routeIndexValue);

    if (!reducedMotion) {
      window.setInterval(() => {
        routeIndexValue = (routeIndexValue + 1) % counties.length;
        drawRoute(counties[routeIndexValue], routeIndexValue);
      }, 2000);
    }
  }

  // A genuine review feed can be supplied as window.LAKESIDE_VERIFIED_REVIEWS.
  // Keep this empty until the business connects a permitted source or provides authentic review content.
  const reviewData = Array.isArray(window.LAKESIDE_VERIFIED_REVIEWS)
    ? window.LAKESIDE_VERIFIED_REVIEWS.filter((review) => review && typeof review.text === 'string' && review.text.trim() && typeof review.name === 'string' && review.name.trim())
    : [];
  const reviewGrid = document.getElementById('review-grid');
  const reviewEmpty = document.getElementById('reviews-empty');
  const reviewControls = document.getElementById('review-controls');
  const reviewPage = document.getElementById('review-page');
  let reviewPageIndex = 0;
  let reviewTimer = null;

  function safeRating(value) {
    const rating = Number(value);
    return Number.isFinite(rating) ? Math.max(0, Math.min(5, Math.round(rating))) : 0;
  }

  function makeReviewCard(review) {
    const card = document.createElement('article');
    card.className = 'review-card';

    const top = document.createElement('div');
    top.className = 'review-card-top';
    const avatar = document.createElement('span');
    avatar.className = 'review-avatar';
    avatar.setAttribute('aria-hidden', 'true');
    avatar.textContent = review.name.trim().slice(0, 1).toLocaleUpperCase();

    const meta = document.createElement('span');
    meta.className = 'review-meta';
    const name = document.createElement('strong');
    name.textContent = review.name.trim();
    meta.appendChild(name);
    if (typeof review.date === 'string' && review.date.trim()) {
      const date = document.createElement('span');
      date.textContent = review.date.trim();
      meta.appendChild(date);
    }

    top.append(avatar, meta);
    const rating = safeRating(review.rating);
    if (rating > 0) {
      const stars = document.createElement('span');
      stars.className = 'review-stars';
      stars.setAttribute('aria-label', `${rating} out of 5 stars`);
      stars.textContent = `${'★'.repeat(rating)}${'☆'.repeat(5 - rating)}`;
      top.appendChild(stars);
    }

    const quote = document.createElement('blockquote');
    quote.textContent = `“${review.text.trim()}”`;
    const source = document.createElement('div');
    source.className = 'review-source';
    const googleMini = document.createElement('span');
    googleMini.className = 'google-mini';
    googleMini.setAttribute('aria-hidden', 'true');
    googleMini.textContent = 'G';
    const sourceText = document.createElement('span');
    sourceText.textContent = typeof review.source === 'string' && review.source.trim() ? review.source.trim() : 'Customer feedback';
    source.append(googleMini, sourceText);
    card.append(top, quote, source);
    return card;
  }

  function renderReviews() {
    if (!reviewGrid || !reviewData.length) return;
    const totalPages = Math.ceil(reviewData.length / 3);
    const firstReview = reviewPageIndex * 3;
    const visibleReviews = reviewData.slice(firstReview, firstReview + 3);
    reviewGrid.replaceChildren(...visibleReviews.map(makeReviewCard));
    reviewGrid.hidden = false;
    if (reviewEmpty) reviewEmpty.hidden = true;
    if (reviewControls) reviewControls.hidden = reviewData.length <= 3;
    if (reviewPage && reviewData.length > 3) {
      reviewPage.textContent = `${String(reviewPageIndex + 1).padStart(2, '0')} / ${String(totalPages).padStart(2, '0')}`;
    }
  }

  function moveReviews(direction) {
    if (reviewData.length <= 3) return;
    const totalPages = Math.ceil(reviewData.length / 3);
    reviewPageIndex = (reviewPageIndex + (direction === 'previous' ? -1 : 1) + totalPages) % totalPages;
    renderReviews();
  }

  if (reviewData.length) {
    renderReviews();
    if (reviewData.length > 3 && !reducedMotion) {
      reviewTimer = window.setInterval(() => moveReviews('next'), 5000);
    }
    document.querySelectorAll('[data-review-direction]').forEach((button) => {
      button.addEventListener('click', () => {
        moveReviews(button.dataset.reviewDirection);
        if (reviewTimer) {
          window.clearInterval(reviewTimer);
          reviewTimer = window.setInterval(() => moveReviews('next'), 5000);
        }
      });
    });
  }

  const menuToggle = document.querySelector('.menu-toggle');
  const primaryNav = document.getElementById('primary-nav');

  function setMenuOpen(isOpen) {
    if (!menuToggle || !primaryNav) return;
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    menuToggle.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
    primaryNav.classList.toggle('is-open', isOpen);
    document.body.classList.toggle('menu-open', isOpen && window.innerWidth <= 790);
  }

  if (menuToggle && primaryNav) {
    menuToggle.addEventListener('click', () => {
      setMenuOpen(menuToggle.getAttribute('aria-expanded') !== 'true');
    });
    primaryNav.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => setMenuOpen(false)));
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') setMenuOpen(false);
    });
    window.addEventListener('resize', () => {
      if (window.innerWidth > 790) setMenuOpen(false);
    }, { passive: true });
    document.addEventListener('click', (event) => {
      if (menuToggle.getAttribute('aria-expanded') === 'true' && !primaryNav.contains(event.target) && !menuToggle.contains(event.target)) {
        setMenuOpen(false);
      }
    });
  }

  document.querySelectorAll('[data-service]').forEach((link) => {
    link.addEventListener('click', () => {
      const select = document.getElementById('service-select');
      const service = link.dataset.service;
      if (!select || !service) return;
      const existingOption = Array.from(select.options).find((option) => option.value === service || option.textContent === service);
      if (existingOption) select.value = existingOption.value;
    });
  });

  const quoteForm = document.getElementById('quote-form');
  const formFeedback = document.getElementById('form-feedback');
  const toast = document.getElementById('site-toast');
  let toastTimer = null;

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('is-visible');
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toast.classList.remove('is-visible'), 3800);
  }

  function formatMovingDate(value) {
    if (!value) return '';
    const [year, month, day] = value.split('-').map(Number);
    if (!year || !month || !day) return value;
    return new Intl.DateTimeFormat('en-KE', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(year, month - 1, day));
  }

  if (quoteForm) {
    quoteForm.addEventListener('submit', (event) => {
      event.preventDefault();
      if (!quoteForm.reportValidity()) return;

      const values = new FormData(quoteForm);
      const lines = [
        'Hello Lakeside Transporters, I would like to request a moving quote.',
        '',
        `Name: ${String(values.get('name') || '').trim()}`,
        `Phone: ${String(values.get('phone') || '').trim()}`,
        `Move type: ${String(values.get('service') || '').trim()}`,
        `Pickup: Nairobi${String(values.get('pickup') || '').trim() ? ` — ${String(values.get('pickup')).trim()}` : ''}`,
        `Destination county: ${String(values.get('destination') || '').trim()}`
      ];
      const date = formatMovingDate(String(values.get('date') || ''));
      const details = String(values.get('details') || '').trim();
      if (date) lines.push(`Preferred date: ${date}`);
      if (details) lines.push(`More about the move: ${details}`);
      lines.push('', 'Please let me know the next steps and an estimate. Thank you.');

      const whatsappUrl = `https://wa.me/254717986463?text=${encodeURIComponent(lines.join('\n'))}`;
      const link = document.createElement('a');
      link.href = whatsappUrl;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.setAttribute('aria-hidden', 'true');
      link.tabIndex = -1;
      document.body.appendChild(link);
      link.click();
      link.remove();

      if (formFeedback) formFeedback.textContent = 'Your WhatsApp draft is ready. Please review it and tap Send in WhatsApp.';
      showToast('Your move details are ready to review in WhatsApp.');
    });
  }

  const revealItems = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reducedMotion) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.11, rootMargin: '0px 0px -35px 0px' });
    revealItems.forEach((item) => revealObserver.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add('is-visible'));
  }

  const navigationLinks = Array.from(document.querySelectorAll('.primary-nav .nav-link'));
  const navTargets = navigationLinks
    .map((link) => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);
  if ('IntersectionObserver' in window && navTargets.length) {
    const activeSections = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navigationLinks.forEach((link) => {
          const isActive = link.getAttribute('href') === `#${entry.target.id}`;
          link.classList.toggle('is-active', isActive);
          if (isActive) link.setAttribute('aria-current', 'location');
          else link.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-28% 0px -62% 0px', threshold: 0 });
    navTargets.forEach((target) => activeSections.observe(target));
  }

  const currentYear = document.getElementById('current-year');
  if (currentYear) currentYear.textContent = String(new Date().getFullYear());
})();
