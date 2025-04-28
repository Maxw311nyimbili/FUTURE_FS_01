/**
 * Portfolio Project JavaScript
 * Handles card flip animations, filtering, scroll animations, and counters
 */

document.addEventListener('DOMContentLoaded', function() {
  // Initialize project filtering
  initProjectFiltering();

  initProjectCards();

  // Initialize animations on scroll
  initScrollAnimations();

  // Initialize counter animations for GitHub stats
  initCounters();
});

/**
 * Initialize project category filtering
 */
function initProjectFiltering() {
  const filterBtns = document.querySelectorAll('.category-btn');
  const projectCards = document.querySelectorAll('.project-card');

  // If there are no filter buttons, return
  if (filterBtns.length === 0) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove active class from all buttons
      filterBtns.forEach(b => b.classList.remove('active'));
      // Add active class to clicked button
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      // Filter projects
      projectCards.forEach(card => {
        // Calculate animation delay based on index
        const index = Array.from(projectCards).indexOf(card);
        const delay = index * 0.1;

        if (filter === 'all' || card.getAttribute('data-category') === filter) {
          // Show cards that match the filter
          card.style.display = 'block';
          // Apply staggered animation
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 50 + (delay * 100));
        } else {
          // Hide with fade out effect
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 300);
        }
      });
    });
  });

  // Trigger "all" filter click on load if present
  const allFilterBtn = document.querySelector('.category-btn[data-filter="all"]');
  if (allFilterBtn) {
    allFilterBtn.click();
  }
}

/**
 * Initialize project cards with premium interactions
 */
function initProjectCards() {
  const projectCards = document.querySelectorAll('.project-card');

  projectCards.forEach(card => {
    // Add tabindex to make cards focusable
    card.setAttribute('tabindex', '0');

    // Get card elements
    const cardInner = card.querySelector('.project-card-inner');
    const cardFront = card.querySelector('.project-card-front');
    const cardBack = card.querySelector('.project-card-back');

    if (!cardInner || !cardFront || !cardBack) return;

    // Set accessibility attributes
    cardFront.setAttribute('aria-hidden', 'false');
    cardBack.setAttribute('aria-hidden', 'true');

    // Add hover effect for tech tags
    card.addEventListener('mouseenter', () => {
      const techTags = card.querySelectorAll('.project-tech span');
      techTags.forEach((tag, index) => {
        tag.style.transitionDelay = `${index * 0.05}s`;
      });
    });

    card.addEventListener('mouseleave', () => {
      const techTags = card.querySelectorAll('.project-tech span');
      techTags.forEach(tag => {
        tag.style.transitionDelay = '0s';
      });
    });

    // "View Details" button click handler
    const detailsButtons = cardFront.querySelectorAll('.project-link.details');
    detailsButtons.forEach(button => {
      button.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        toggleCardFlip(card);
      });
    });

    // "Back to front" button on the back of the card
    const backToFrontButtons = cardBack.querySelectorAll('.back-to-front');
    backToFrontButtons.forEach(button => {
      button.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        toggleCardFlip(card);
      });
    });

    // Card click handler (but not when clicking links)
    card.addEventListener('click', function(e) {
      const target = e.target;
      if (target.tagName === 'A' ||
          target.parentElement.tagName === 'A' ||
          target.closest('a')) {
        return;
      }

      toggleCardFlip(card);
    });

    // Keyboard navigation
    card.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleCardFlip(card);
      }
    });

    // Add touch events for better mobile experience
    card.addEventListener('touchstart', function(e) {
      // Store the touch position
      card.touchStartX = e.touches[0].clientX;
      card.touchStartY = e.touches[0].clientY;
    });

    card.addEventListener('touchend', function(e) {
      // Don't flip if it's a scroll attempt
      const touchEndX = e.changedTouches[0].clientX;
      const touchEndY = e.changedTouches[0].clientY;
      const diffX = Math.abs(touchEndX - card.touchStartX);
      const diffY = Math.abs(touchEndY - card.touchStartY);

      // If it's not a significant movement (not a scroll attempt)
      if (diffX < 5 && diffY < 5) {
        // Don't flip if touching a link
        if (e.target.tagName !== 'A' && e.target.parentElement.tagName !== 'A' && !e.target.closest('a')) {
          toggleCardFlip(card);
        }
      }
    });
  });

  // Add a CSS class to indicate the user is using mouse/touch vs keyboard navigation
  document.addEventListener('mousedown', function() {
    document.body.classList.add('using-mouse');
  });

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Tab') {
      document.body.classList.remove('using-mouse');
    }
  });
}

/**
 * Toggle card flip state with premium animation
 */
function toggleCardFlip(card) {
  const cardInner = card.querySelector('.project-card-inner');
  const cardFront = card.querySelector('.project-card-front');
  const cardBack = card.querySelector('.project-card-back');

  if (!cardInner || !cardFront || !cardBack) return;

  // Toggle the flip class
  card.classList.toggle('is-flipped');

  // Update accessibility attributes
  if (card.classList.contains('is-flipped')) {
    cardFront.setAttribute('aria-hidden', 'true');
    cardBack.setAttribute('aria-hidden', 'false');
  } else {
    cardFront.setAttribute('aria-hidden', 'false');
    cardBack.setAttribute('aria-hidden', 'true');
  }
}

/**
 * Initialize animations for elements that appear when scrolled into view
 */
function initScrollAnimations() {
  const animatedElements = document.querySelectorAll('.project-card, .github-metric, .github-calendar');

  // Create an intersection observer
  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      // If element is in viewport
      if (entry.isIntersecting) {
        // Add animation classes based on element type
        if (entry.target.classList.contains('project-card')) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        } else {
          const index = Array.from(document.querySelectorAll(
            entry.target.classList.contains('github-metric') ? '.github-metric' : '.github-calendar'
          )).indexOf(entry.target);

          entry.target.style.animationDelay = `${index * 0.1}s`;
          entry.target.classList.add('animate-in');
        }
        // Stop observing after animation is triggered
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.2, // Trigger when 20% of the element is visible
    rootMargin: '0px 0px -50px 0px' // Slightly before element comes into view
  });

  // Start observing all animated elements
  animatedElements.forEach(el => {
    // Set initial state
    if (el.classList.contains('project-card')) {
      el.style.opacity = '0';
      el.style.transform = 'translateY(40px)';
      el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    }
    observer.observe(el);
  });
}

/**
 * Initialize counter animations for GitHub stats
 */
function initCounters() {
  const countElements = document.querySelectorAll('.metric-info h3');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const countEl = entry.target.querySelector('h3') || entry.target;
        animateCount(countEl);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  countElements.forEach(el => {
    observer.observe(el.parentElement || el);
  });
}

/**
 * Animate counting for GitHub stats
 */
function animateCount(el) {
  const target = el.innerText;
  const suffix = target.includes('+') ? '+' : '';
  const targetNum = parseInt(target.replace(/\D/g, ''));
  const duration = 2000; // ms
  const step = Math.ceil(targetNum / (duration / 50)); // Update every 50ms
  let current = 0;

  const timer = setInterval(() => {
    current += step;
    if (current >= targetNum) {
      clearInterval(timer);
      current = targetNum;
    }
    el.innerText = current + suffix;
  }, 50);
}