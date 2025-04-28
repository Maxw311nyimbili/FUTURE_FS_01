// Enhanced Projects Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
  // Get all project cards
  const projectCards = document.querySelectorAll('.project-card');
  const filterButtons = document.querySelectorAll('.filter-btn');

  // Initialize the project cards
  initializeCards();

  // Add filter functionality
  setupFilters(filterButtons, projectCards);

  // Handle window resize for responsive layouts
  window.addEventListener('resize', function() {
    normalizeCardHeights();
    checkMobileView();
  });

  // Check if we're in mobile view on initial load
  checkMobileView();

  /**
   * Initialize all cards with necessary elements and event listeners
   */
  function initializeCards() {
    projectCards.forEach(card => {
      // Add gradient overlay to images
      const imageContainer = card.querySelector('.project-image');
      if (imageContainer && !imageContainer.querySelector('.image-overlay')) {
        const overlay = document.createElement('div');
        overlay.className = 'image-overlay';
        imageContainer.appendChild(overlay);
      }

      // Setup card flipping functionality
      setupCardFlipping(card);
    });

    // Normalize card heights for consistent rows
    setTimeout(normalizeCardHeights, 100);

    // Add animation classes for cards to fade in
    projectCards.forEach((card, index) => {
      setTimeout(() => {
        card.classList.add('animate-in');
        card.style.animationDelay = (index * 0.1) + 's';
      }, 100);
    });
  }

  /**
   * Sets up the card flipping functionality
   * @param {HTMLElement} card - The card element to set up
   */
  function setupCardFlipping(card) {
    // Find the front and back buttons
    const detailsBtn = card.querySelector('.project-link.details');
    const backBtn = card.querySelector('.back-link.back-to-front');
    const cardInner = card.querySelector('.project-card-inner');
    const frontSide = card.querySelector('.project-card-front');
    const backSide = card.querySelector('.project-card-back');

    // Add click event for the details button
    if (detailsBtn) {
      detailsBtn.addEventListener('click', function(e) {
        e.preventDefault();
        card.classList.add('is-flipped');
      });
    }

    // Add click event for the back button
    if (backBtn) {
      backBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation(); // Prevent event bubbling
        card.classList.remove('is-flipped');
      });
    }

    // Make entire back card clickable on mobile for returning
    if (backSide) {
      backSide.addEventListener('click', function(e) {
        // Only if we're on mobile and not clicking a link
        if (window.innerWidth <= 768 && !e.target.closest('a') && !e.target.closest('.back-link')) {
          card.classList.remove('is-flipped');
        }
      });
    }

    // Add touch swipe functionality for mobile
    let touchStartX = 0;
    let touchEndX = 0;

    if (cardInner) {
      cardInner.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
      }, false);

      cardInner.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
      }, false);
    }

    // Handle swipe gestures
    function handleSwipe() {
      if (touchEndX < touchStartX - 50) { // Swipe left
        card.classList.add('is-flipped');
      }
      if (touchEndX > touchStartX + 50) { // Swipe right
        card.classList.remove('is-flipped');
      }
    }

    // Add mobile indicator for flippable cards on smaller screens
    if (window.innerWidth <= 768) {
      // Front indicator (if it doesn't exist)
      if (!frontSide.querySelector('.mobile-flip-indicator')) {
        const mobileIndicator = document.createElement('div');
        mobileIndicator.className = 'mobile-flip-indicator';
        mobileIndicator.innerHTML = '<i class="fas fa-info-circle"></i> Tap for details';
        frontSide.appendChild(mobileIndicator);
      }

      // Back indicator (if it doesn't exist)
      if (backSide && !backSide.querySelector('.mobile-back-indicator')) {
        const backIndicator = document.createElement('div');
        backIndicator.className = 'mobile-back-indicator';
        backIndicator.innerHTML = '<i class="fas fa-arrow-left"></i> Tap anywhere to go back';
        backSide.appendChild(backIndicator);
      }

      // Make the entire front card clickable on mobile
      frontSide.addEventListener('click', function(e) {
        // Don't flip if clicking on a link
        if (window.innerWidth <= 768 && !e.target.closest('a')) {
          card.classList.add('is-flipped');
        }
      });
    }
  }

  /**
   * Sets up filtering functionality
   * @param {NodeList} buttons - Filter buttons
   * @param {NodeList} cards - Project cards
   */
  function setupFilters(buttons, cards) {
    if (!buttons.length) return;

    buttons.forEach(button => {
      button.addEventListener('click', function() {
        // Remove active class from all buttons
        buttons.forEach(btn => btn.classList.remove('active'));

        // Add active class to clicked button
        this.classList.add('active');

        // Get filter value
        const filter = this.getAttribute('data-filter');

        // Filter cards with animation
        filterCards(cards, filter);
      });
    });
  }

  /**
   * Filters cards based on category
   * @param {NodeList} cards - All project cards
   * @param {string} filter - Category to filter by
   */
  function filterCards(cards, filter) {
    cards.forEach(card => {
      // First hide all cards with animation
      card.style.opacity = '0';
      card.style.transform = 'scale(0.8)';

      setTimeout(() => {
        // Then filter based on category
        if (filter === 'all') {
          card.style.display = 'block';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
          }, 50);
        } else {
          const category = card.getAttribute('data-category');
          if (category === filter) {
            card.style.display = 'block';
            setTimeout(() => {
              card.style.opacity = '1';
              card.style.transform = 'scale(1)';
            }, 50);
          } else {
            card.style.display = 'none';
          }
        }
      }, 300);
    });

    // Re-normalize heights after filtering
    setTimeout(normalizeCardHeights, 600);
  }

  /**
   * Normalizes card heights for consistent rows
   */
  function normalizeCardHeights() {
    // Only normalize visible cards
    const visibleCards = Array.from(projectCards).filter(
      card => window.getComputedStyle(card).display !== 'none'
    );

    // Reset heights to get natural height
    visibleCards.forEach(card => {
      card.style.height = '';
    });

    // Skip height normalization on mobile
    if (window.innerWidth <= 768) {
      visibleCards.forEach(card => {
        // Set consistent padding on mobile
        const content = card.querySelector('.project-content');
        const backSide = card.querySelector('.project-card-back');

        if (content) content.style.padding = '1.2rem';
        if (backSide) backSide.style.padding = '1.2rem';

        // Let cards have natural height on mobile
        card.style.height = '';
      });
      return;
    }

    // Group cards by row based on their position
    const cardRows = groupCardsByRow(visibleCards);

    // For each row, find the tallest card and set all cards to that height
    cardRows.forEach(row => {
      let maxHeight = 0;

      // Find tallest card in this row
      row.forEach(card => {
        const cardHeight = card.scrollHeight;
        maxHeight = Math.max(maxHeight, cardHeight);
      });

      // Set all cards in this row to the max height
      if (maxHeight > 0) {
        row.forEach(card => {
          card.style.height = `${maxHeight}px`;
        });
      }
    });
  }

  /**
   * Groups cards into rows based on their Y position
   * @param {Array} cards - Array of card elements
   * @returns {Array} - Array of card rows
   */
  function groupCardsByRow(cards) {
    const rows = [];
    const threshold = 10; // px threshold to consider cards on the same row

    // Sort cards by their vertical position
    cards.sort((a, b) => {
      return a.getBoundingClientRect().top - b.getBoundingClientRect().top;
    });

    if (cards.length === 0) return rows;

    let currentRow = [cards[0]];
    let currentTop = cards[0].getBoundingClientRect().top;

    // Group cards with similar Y positions
    for (let i = 1; i < cards.length; i++) {
      const cardTop = cards[i].getBoundingClientRect().top;

      if (Math.abs(cardTop - currentTop) <= threshold) {
        // Same row
        currentRow.push(cards[i]);
      } else {
        // New row
        rows.push(currentRow);
        currentRow = [cards[i]];
        currentTop = cardTop;
      }
    }

    // Add the last row
    if (currentRow.length > 0) {
      rows.push(currentRow);
    }

    return rows;
  }

  /**
   * Checks if we're in mobile view and adjusts UI accordingly
   */
  function checkMobileView() {
    const isMobile = window.innerWidth <= 768;

    if (isMobile) {
      // Apply mobile-specific adjustments
      projectCards.forEach(card => {
        const frontSide = card.querySelector('.project-card-front');
        const backSide = card.querySelector('.project-card-back');

        // Add tap indicator if it doesn't exist
        if (frontSide && !frontSide.querySelector('.mobile-flip-indicator')) {
          const indicator = document.createElement('div');
          indicator.className = 'mobile-flip-indicator';
          indicator.innerHTML = '<i class="fas fa-info-circle"></i> Tap for details';
          frontSide.appendChild(indicator);
        }

        // Add back indicator if it doesn't exist
        if (backSide && !backSide.querySelector('.mobile-back-indicator')) {
          const backIndicator = document.createElement('div');
          backIndicator.className = 'mobile-back-indicator';
          backIndicator.innerHTML = '<i class="fas fa-arrow-left"></i> Tap anywhere to go back';
          backSide.appendChild(backIndicator);
        }

        // Adjust description line clamp for smaller screens
        const description = card.querySelector('.project-description');
        if (description) {
          description.style.webkitLineClamp = '2';
        }

        // Remove fixed height on mobile
        card.style.height = '';
      });
    } else {
      // Remove mobile-specific elements on larger screens
      document.querySelectorAll('.mobile-flip-indicator, .mobile-back-indicator').forEach(el => {
        el.remove();
      });

      // Reset to desktop view
      projectCards.forEach(card => {
        const description = card.querySelector('.project-description');
        if (description) {
          // Reset line clamp based on card type
          if (card.classList.contains('featured')) {
            description.style.webkitLineClamp = '3';
          } else {
            description.style.webkitLineClamp = '2';
          }
        }
      });

      // Reapply normalized heights
      normalizeCardHeights();
    }
  }
});