// Enhanced Projects Page JavaScript with Minimalist Features
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
    updateResponsiveLayout();
  });

  // Check initial layout
  updateResponsiveLayout();

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

      // Set up the links overlay if not present
      setupLinksOverlay(card);

      // Add minimalist icon navigation
      addProjectIcons(card);

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
   * Adds minimalist icon navigation to project cards
   */
  function addProjectIcons(card) {
    const frontSide = card.querySelector('.project-card-front');
    const existingLinks = card.querySelector('.project-links');

    // Only proceed if we have a front side and links
    if (!frontSide || !existingLinks) return;

    // Create icons container if it doesn't exist
    if (!frontSide.querySelector('.project-icons')) {
      const iconsContainer = document.createElement('div');
      iconsContainer.className = 'project-icons';

      // Get all links from the original links div
      const links = existingLinks.querySelectorAll('a');

      // Create icon for each link
      links.forEach(link => {
        const icon = document.createElement('a');
        icon.className = `project-icon`;

        // Set appropriate class based on original link
        if (link.classList.contains('github')) {
          icon.classList.add('github');
        } else if (link.classList.contains('demo')) {
          icon.classList.add('demo');
        } else if (link.classList.contains('details')) {
          icon.classList.add('details');
        }

        // Copy attributes
        icon.href = link.getAttribute('href') || '#';
        if (link.getAttribute('target')) {
          icon.setAttribute('target', link.getAttribute('target'));
        }

        // Copy icon HTML
        const iconElement = link.querySelector('i');
        if (iconElement) {
          icon.innerHTML = iconElement.outerHTML;
        }

        // Add event listener for details link
        if (link.classList.contains('details')) {
          icon.addEventListener('click', function(e) {
            e.preventDefault();
            card.classList.add('is-flipped');
          });
        }

        // Add to container
        iconsContainer.appendChild(icon);
      });

      // Add to front side
      frontSide.appendChild(iconsContainer);
    }
  }

  /**
   * Sets up the premium links overlay
   */
  function setupLinksOverlay(card) {
    const contentArea = card.querySelector('.project-content');
    const existingLinks = card.querySelector('.project-links');

    // Only proceed if we have content area and links
    if (!contentArea || !existingLinks) return;

    // Create overlay if it doesn't exist
    if (!card.querySelector('.project-links-overlay')) {
      // Create new overlay
      const linksOverlay = document.createElement('div');
      linksOverlay.className = 'project-links-overlay';

      // Clone the links to put in overlay
      const clonedLinks = existingLinks.cloneNode(true);

      // Add event listeners to the cloned links
      clonedLinks.querySelectorAll('a').forEach(link => {
        // For the details link
        if (link.classList.contains('details')) {
          link.addEventListener('click', function(e) {
            e.preventDefault();
            card.classList.add('is-flipped');
          });
        }

        // For other links, make sure they open in a new tab
        if (link.getAttribute('href') && link.getAttribute('href') !== '#') {
          link.setAttribute('target', '_blank');
          link.setAttribute('rel', 'noopener noreferrer');
        }
      });

      linksOverlay.appendChild(clonedLinks);
      card.appendChild(linksOverlay);

      // Hide the original links if we're not on mobile
      if (window.innerWidth > 768) {
        existingLinks.style.display = 'none';
      }
    }
  }

  /**
   * Sets up the card flipping functionality
   */
  function setupCardFlipping(card) {
    // Find the front and back buttons/elements
    const detailsBtn = card.querySelector('.project-link.details');
    const backBtn = card.querySelector('.back-link.back-to-front');
    const cardInner = card.querySelector('.project-card-inner');
    const frontSide = card.querySelector('.project-card-front');
    const backSide = card.querySelector('.project-card-back');

    // Add click event for the details button (original and in overlay)
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

    // Add mobile indicators if we're on mobile
    updateMobileIndicators(card, frontSide, backSide);
  }

  /**
   * Updates mobile indicators based on screen size with minimalist design
   */
  function updateMobileIndicators(card, frontSide, backSide) {
    if (window.innerWidth <= 768) {
      // Simplified front indicator (if it doesn't exist)
      if (frontSide && !frontSide.querySelector('.mobile-flip-indicator')) {
        const mobileIndicator = document.createElement('div');
        mobileIndicator.className = 'mobile-flip-indicator';
        mobileIndicator.innerHTML = '<i class="fas fa-info-circle"></i> Tap for details';
        frontSide.appendChild(mobileIndicator);

        // Make the entire front card clickable on mobile
        frontSide.addEventListener('click', function(e) {
          // Don't flip if clicking on an icon or link
          if (window.innerWidth <= 768 && !e.target.closest('a') && !e.target.closest('.project-icons')) {
            card.classList.add('is-flipped');
          }
        });
      }

      // Simplified back indicator
      if (backSide && !backSide.querySelector('.mobile-back-indicator')) {
        const backIndicator = document.createElement('div');
        backIndicator.className = 'mobile-back-indicator';
        backIndicator.innerHTML = '<i class="fas fa-arrow-left"></i> Tap anywhere to go back';
        backSide.appendChild(backIndicator);
      }

      // Check if back links need to be converted to icons
      const backLinks = backSide ? backSide.querySelectorAll('.back-link') : [];
      backLinks.forEach(link => {
        if (link.classList.contains('back-to-front') && link.tagName === 'BUTTON') {
          const icon = link.querySelector('i');
          const text = link.textContent.trim();
          if (icon && text !== '' && !link.classList.contains('icon-only')) {
            // Save the icon and replace content
            const iconHTML = icon.outerHTML;
            link.innerHTML = iconHTML;
            link.classList.add('icon-only');
          }
        }
      });
    } else {
      // Remove mobile indicators on larger screens
      const indicators = card.querySelectorAll('.mobile-flip-indicator, .mobile-back-indicator');
      indicators.forEach(indicator => indicator.remove());

      // Restore back button text if needed
      const backLinks = backSide ? backSide.querySelectorAll('.back-link.back-to-front.icon-only') : [];
      backLinks.forEach(link => {
        if (link.tagName === 'BUTTON') {
          link.innerHTML = '<i class="fas fa-arrow-left"></i> Back';
          link.classList.remove('icon-only');
        }
      });
    }
  }

  /**
   * Updates the layout based on screen size
   */
  function updateResponsiveLayout() {
    const isMobile = window.innerWidth <= 768;
    const isTablet = window.innerWidth <= 992 && window.innerWidth > 768;

    projectCards.forEach(card => {
      const frontSide = card.querySelector('.project-card-front');
      const backSide = card.querySelector('.project-card-back');
      const existingLinks = card.querySelector('.project-links');
      const icons = card.querySelector('.project-icons');

      // Update indicators with minimalist design
      updateMobileIndicators(card, frontSide, backSide);

      if (isMobile) {
        // Mobile adjustments
        const content = card.querySelector('.project-content');
        const linksOverlay = card.querySelector('.project-links-overlay');

        // Hide original links on mobile when using icons
        if (existingLinks && icons) existingLinks.style.display = 'none';

        // Show icons
        if (icons) icons.style.opacity = '1';

        // Adjust description line clamp
        const description = card.querySelector('.project-description');
        if (description) {
          description.style.webkitLineClamp = '2';
        }

        // Set proper padding
        if (content) content.style.padding = '1.2rem';
        if (backSide) backSide.style.padding = '1rem';

        // Dynamic height for mobile
        card.style.height = 'auto';
        card.style.minHeight = '420px';

      } else if (isTablet) {
        // Tablet adjustments
        card.style.height = '450px';
        if (existingLinks) existingLinks.style.display = 'none';

        // Show icons on tablet
        if (icons) icons.style.opacity = '1';

      } else {
        // Desktop adjustments
        card.style.height = '450px';
        if (existingLinks) existingLinks.style.display = 'none';

        // Hide icons on desktop
        if (icons) icons.style.opacity = '0';

        const description = card.querySelector('.project-description');
        if (description) {
          // Reset line clamp based on card type
          if (card.classList.contains('featured')) {
            description.style.webkitLineClamp = '3';
          } else {
            description.style.webkitLineClamp = '2';
          }
        }
      }
    });

    // Apply normalized heights for desktop and tablet
    if (!isMobile) {
      normalizeCardHeights();
    }
  }

  /**
   * Sets up filtering functionality
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
   */
  function filterCards(cards, filter) {
    cards.forEach(card => {
      // First hide all cards with animation
      card.style.opacity = '0';
      card.style.transform = 'translateY(20px)';

      setTimeout(() => {
        // Then filter based on category
        if (filter === 'all') {
          card.style.display = 'block';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 50);
        } else {
          const category = card.getAttribute('data-category');
          if (category === filter) {
            card.style.display = 'block';
            setTimeout(() => {
              card.style.opacity = '1';
              card.style.transform = 'translateY(0)';
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
    // Skip on mobile
    if (window.innerWidth <= 768) return;

    // Only normalize visible cards
    const visibleCards = Array.from(projectCards).filter(
      card => window.getComputedStyle(card).display !== 'none'
    );

    // Reset heights to get natural height
    visibleCards.forEach(card => {
      card.style.height = '';
    });

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
});