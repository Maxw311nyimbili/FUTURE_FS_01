// Apply theme immediately to prevent flash of wrong theme
(function() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.setAttribute('data-theme', 'dark');
    }
})();

// Global flag to track if theme toggle has been initialized
let themeToggleInitialized = false;

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // ============================
    // Navigation and Scroll Effects
    // ============================
    const header = document.querySelector('header');
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav-links');

    // Only run this code if these elements exist
    if (header) {
        // Scroll effect
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // Mobile navigation toggle - only if burger menu exists
    if (burger && nav) {
        burger.addEventListener('click', () => {
            nav.classList.toggle('nav-active');
            burger.classList.toggle('toggle');

            // Animate links if they exist
            const navLinks = document.querySelectorAll('.nav-links li');
            navLinks.forEach((link, index) => {
                if (link.style.animation) {
                    link.style.animation = '';
                } else {
                    link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
                }
            });
        });
    }

    // ============================
    // Theme Toggle Functionality
    // ============================
    const themeToggle = document.querySelector('.theme-toggle');

    if (themeToggle && !themeToggleInitialized) {
        console.log("Theme toggle initialized once");
        themeToggleInitialized = true;

        // Remove any existing click listeners to prevent duplicates
        const newThemeToggle = themeToggle.cloneNode(true);
        themeToggle.parentNode.replaceChild(newThemeToggle, themeToggle);

        newThemeToggle.addEventListener('click', function() {
            // Get current theme or default to light
            const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

            console.log("Toggling theme from", currentTheme, "to", newTheme);

            // Set the new theme
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);

            // Update toggle icon
            const icon = newThemeToggle.querySelector('i');
            if (icon) {
                icon.classList.remove('fa-sun', 'fa-moon');
                icon.classList.add(newTheme === 'dark' ? 'fa-sun' : 'fa-moon');

                console.log("Icon updated to", icon.className);
            }
        });

        // Apply saved theme on load
        const savedTheme = localStorage.getItem('theme');
        console.log("Saved theme:", savedTheme);

        if (savedTheme) {
            document.documentElement.setAttribute('data-theme', savedTheme);
            const icon = newThemeToggle.querySelector('i');
            if (icon) {
                icon.className = 'fas ' + (savedTheme === 'dark' ? 'fa-sun' : 'fa-moon');
                console.log("Applied saved theme, icon is", icon.className);
            }
        } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            // Use system preference if no saved preference
            console.log("Using system dark mode preference");
            document.documentElement.setAttribute('data-theme', 'dark');
            const icon = newThemeToggle.querySelector('i');
            if (icon) {
                icon.className = 'fas fa-sun';
            }
        }
    } else if (!themeToggle) {
        console.warn("Theme toggle button not found");
    } else {
        console.warn("Theme toggle already initialized");
    }

    // ============================
    // Loading Overlay
    // ============================
    const body = document.body;
    const loadingOverlay = document.createElement('div');
    loadingOverlay.className = 'loading-overlay';
    loadingOverlay.innerHTML = `
        <div class="loading-spinner">
            <div class="spinner-outer"></div>
            <div class="spinner-middle"></div>
            <div class="spinner-inner"></div>
            <div class="spinner-text">Loading...</div>
        </div>
    `;
    body.appendChild(loadingOverlay);

    // Remove loading overlay after a short delay
    setTimeout(() => {
        loadingOverlay.style.opacity = '0';
        setTimeout(() => {
            loadingOverlay.remove();
        }, 500);
    }, 1000); // Reduced from 1500ms to 1000ms for faster loading

    // ============================
    // Code Tabs
    // ============================
    function initCodeTabs() {
        const codeTabs = document.querySelectorAll('.code-tab');
        const codeBlocks = document.querySelectorAll('.code-block');

        if (codeTabs.length === 0 || codeBlocks.length === 0) return;

        codeTabs.forEach(tab => {
            tab.addEventListener('click', function() {
                // Get the selected language
                const lang = this.getAttribute('data-lang');

                // Remove active class from all tabs and blocks
                codeTabs.forEach(t => t.classList.remove('active'));
                codeBlocks.forEach(block => block.classList.remove('active'));

                // Add active class to selected tab and block
                this.classList.add('active');
                const codeBlock = document.getElementById(`${lang}-code`);
                if (codeBlock) {
                    codeBlock.classList.add('active');
                    // Reset and restart the typewriter when changing tabs
                    initCodeTypewriter();
                }
            });
        });
    }

    // ============================
    // Typewriter Effect
    // ============================
    function initCodeTypewriter() {
        const activeBlock = document.querySelector('.code-block.active');
        if (!activeBlock) return;

        const typewriterElements = activeBlock.querySelectorAll('.typewriter');

        typewriterElements.forEach(element => {
            if (!element.getAttribute('data-words')) return;

            // Get word list
            const words = element.getAttribute('data-words').split(',').map(word => word.trim());
            let wordIndex = 0;
            let charIndex = 0;
            let isDeleting = false;

            // Clear any existing content
            element.textContent = '';

            // Speed variables - optimize for better performance
            const typingSpeed = 80;
            const deletingSpeed = 40;
            const pauseBeforeDelete = 1200;
            const pauseBeforeNewWord = 400;

            function type() {
                if (!activeBlock.classList.contains('active')) return;

                const currentWord = words[wordIndex];

                if (isDeleting) {
                    element.textContent = currentWord.substring(0, charIndex - 1);
                    charIndex--;
                } else {
                    element.textContent = currentWord.substring(0, charIndex + 1);
                    charIndex++;
                }

                let delay = isDeleting ? deletingSpeed : typingSpeed;

                if (!isDeleting && charIndex === currentWord.length) {
                    delay = pauseBeforeDelete;
                    isDeleting = true;
                } else if (isDeleting && charIndex === 0) {
                    isDeleting = false;
                    wordIndex = (wordIndex + 1) % words.length;
                    delay = pauseBeforeNewWord;
                }

                setTimeout(type, delay);
            }

            // Start typing with a small delay
            setTimeout(type, 400);
        });
    }

    // ============================
    // About Tabs
    // ============================
    function initAboutTabs() {
        const tabButtons = document.querySelectorAll('.tab-btn');
        const tabPanes = document.querySelectorAll('.tab-pane');

        if (tabButtons.length === 0 || tabPanes.length === 0) return;

        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const targetTab = button.getAttribute('data-tab');
                if (!targetTab) return;

                // Remove active class from all buttons and panes
                tabButtons.forEach(btn => btn.classList.remove('active'));
                tabPanes.forEach(pane => pane.classList.remove('active'));

                // Add active class to current button and pane
                button.classList.add('active');
                const targetPane = document.getElementById(targetTab);
                if (targetPane) {
                    targetPane.classList.add('active');
                    // Animate skill bars in the active tab
                    animateSkillBars();
                }
            });
        });
    }

    // ============================
    // Skills Tabs
    // ============================
    function initSkillsTabs() {
        const skillNavBtns = document.querySelectorAll('.skill-nav-btn');
        const skillPanes = document.querySelectorAll('.skill-pane');

        if (skillNavBtns.length === 0 || skillPanes.length === 0) return;

        skillNavBtns.forEach(button => {
            button.addEventListener('click', () => {
                const targetPane = button.getAttribute('data-target');
                if (!targetPane) return;

                // Remove active class from all buttons and panes
                skillNavBtns.forEach(btn => btn.classList.remove('active'));
                skillPanes.forEach(pane => pane.classList.remove('active'));

                // Add active class to current button and pane
                button.classList.add('active');
                const pane = document.getElementById(targetPane);
                if (pane) {
                    pane.classList.add('active');
                    // Animate skill bars in the active pane
                    animateSkillBars();
                }
            });
        });
    }

    // ============================
    // Skill Bars Animation
    // ============================


/**
 * Improved Skill Bars Animation
 * This function properly sets and animates skill level bars
 */
function animateSkillBars() {
    // Select all skill bars
    const skillBars = document.querySelectorAll('.skill-level');
    if (skillBars.length === 0) return;

    // Force set their widths initially based on the percentages in the HTML
    skillBars.forEach(bar => {
        // Try to find the percentage in parent container
        const skillInfoText = bar.closest('.skill-bar-item')?.querySelector('.skill-info')?.textContent || '';
        const percentMatch = skillInfoText.match(/(\d+)%/);

        // Set the width directly from the percentage in HTML
        if (percentMatch && percentMatch[1]) {
            // Store the target width in a data attribute for animation purposes
            const targetWidth = percentMatch[1] + '%';
            bar.setAttribute('data-target-width', targetWidth);

            // Initially set the width to the target width to ensure it displays correctly
            bar.style.width = targetWidth;
        }
    });

    // Now set up the animation for when bars come into view
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const bar = entry.target;
                    const targetWidth = bar.getAttribute('data-target-width');

                    if (targetWidth) {
                        // First reset to 0
                        bar.style.transition = 'none';
                        bar.style.width = '0%';

                        // Force reflow to ensure the browser registers the change to 0%
                        bar.offsetWidth;

                        // Then animate to the target width
                        bar.style.transition = 'width 0.8s ease-in-out';
                        requestAnimationFrame(() => {
                            bar.style.width = targetWidth;
                        });
                    }

                    // Stop observing after animation
                    observer.unobserve(bar);
                }
            });
        }, { threshold: 0.1 });

        // Start observing each skill bar
        skillBars.forEach(bar => observer.observe(bar));
    } else {
        // Fallback animation for browsers without IntersectionObserver
        skillBars.forEach(bar => {
            const targetWidth = bar.getAttribute('data-target-width');
            if (!targetWidth) return;

            setTimeout(() => {
                // Reset to 0 then animate
                bar.style.width = '0%';
                bar.style.transition = 'width 0.8s ease-in-out';

                setTimeout(() => {
                    bar.style.width = targetWidth;
                }, 50);
            }, 500);
        });
    }
}

    // ============================
    // Project Cards Hover Effect
    // ============================
    function initProjectCards() {
        const projectCards = document.querySelectorAll('.project-card');
        if (projectCards.length === 0) return;

        projectCards.forEach(card => {
            const overlay = card.querySelector('.project-overlay');
            if (!overlay) return;

            card.addEventListener('mouseenter', () => {
                overlay.style.opacity = '1';
            });

            card.addEventListener('mouseleave', () => {
                overlay.style.opacity = '0';
            });
        });
    }

    // ============================
    // Form Validation
    // ============================
    function initFormValidation() {
        const contactForm = document.getElementById('contactForm');
        if (!contactForm) return;

        contactForm.addEventListener('submit', (e) => {
            const nameInput = document.getElementById('name');
            const emailInput = document.getElementById('email');
            const messageInput = document.getElementById('message');
            let isValid = true;

            // Reset error states
            document.querySelectorAll('.error-message').forEach(el => el.remove());

            // Validate name
            if (nameInput && nameInput.value.trim() === '') {
                showError(nameInput, 'Name is required');
                isValid = false;
            }

            // Validate email
            if (emailInput) {
                if (emailInput.value.trim() === '') {
                    showError(emailInput, 'Email is required');
                    isValid = false;
                } else if (!isValidEmail(emailInput.value)) {
                    showError(emailInput, 'Please enter a valid email address');
                    isValid = false;
                }
            }

            // Validate message
            if (messageInput && messageInput.value.trim() === '') {
                showError(messageInput, 'Message is required');
                isValid = false;
            }

            if (!isValid) {
                e.preventDefault();
            }
        });
    }

    function showError(input, message) {
        if (!input) return;

        const formControl = input.parentElement;
        const errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.textContent = message;
        errorElement.style.color = 'var(--error)';
        errorElement.style.fontSize = '0.8rem';
        errorElement.style.marginTop = '5px';
        formControl.appendChild(errorElement);
        input.classList.add('input-error');
    }

    function isValidEmail(email) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    // ============================
    // Interactive Cursor Effect
    // ============================
    function initCursorEffect() {
        const cursorDot = document.querySelector('.cursor-dot');
        const cursorCircle = document.querySelector('.cursor-circle');

        if (cursorDot && cursorCircle && window.innerWidth > 992) {
            document.addEventListener('mousemove', function(e) {
                requestAnimationFrame(() => {
                    cursorDot.style.left = e.clientX + 'px';
                    cursorDot.style.top = e.clientY + 'px';

                    // Slight delay for circle for trailing effect
                    setTimeout(() => {
                        cursorCircle.style.left = e.clientX + 'px';
                        cursorCircle.style.top = e.clientY + 'px';
                    }, 50);
                });
            });

            // Add hover effect for links and buttons
            document.querySelectorAll('a, button, .btn, .card, .project-card').forEach(element => {
                element.classList.add('interactive');

                element.addEventListener('mouseenter', function() {
                    cursorDot.classList.add('expand');
                    cursorCircle.classList.add('expand');
                });

                element.addEventListener('mouseleave', function() {
                    cursorDot.classList.remove('expand');
                    cursorCircle.classList.remove('expand');
                });
            });
        }
    }

    // ============================
    // Initialize Empty Skills Wheel Function
    // ============================
    function initSkillsWheel() {
        // This function is a placeholder to prevent errors
        // Implement actual functionality if needed
        const skillWheel = document.querySelector('.skills-wheel');
        if (!skillWheel) return;

        console.log("Skills wheel initialized");
    }

    // ============================
    // Initialize Everything
    // ============================
    // First, initialize critical UI elements
    initCodeTabs();
    initCodeTypewriter();
    initAboutTabs();
    initSkillsTabs();
    animateSkillBars();

    // Then initialize less critical features
    initProjectCards();
    initFormValidation();
    initCursorEffect();
    initSkillsWheel();

    // Initialize AOS (Animate on Scroll) if it exists
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            once: true,
            offset: 50,
            disable: window.innerWidth < 768 // Disable on mobile for better performance
        });
    }
});