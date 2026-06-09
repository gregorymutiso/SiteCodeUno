// Smooth scrolling for navigation links (only for same-page anchors)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        // Only prevent default and scroll if it's a same-page anchor (not linking to another page)
        if (href.startsWith('#')) {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});

// Intersection Observer for scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in-up');
        }
    });
}, observerOptions);

// Observe all sections for animation (only if IntersectionObserver is supported)
if ('IntersectionObserver' in window) {
    document.querySelectorAll('section').forEach(section => {
        observer.observe(section);
    });
}

const header = document.querySelector('.header');
let lastScrollY = window.scrollY;
let ticking = false;

// Throttled scroll handler for better performance
function updateHeader() {
    if (!header) return;

    const currentScrollY = window.scrollY;

    // Update background opacity
    if (currentScrollY > 100) {
        header.style.background = 'rgba(255, 255, 255, 0.98)';
    } else {
        header.style.background = 'rgba(255, 255, 255, 0.95)';
    }

    // Hide/show header based on scroll direction
    // Only hide if scrolled down more than 80px, and show when scrolling up
    if (currentScrollY > lastScrollY && currentScrollY > 80) {
        header.classList.add('hidden');
    } else if (currentScrollY < lastScrollY) {
        header.classList.remove('hidden');
    }

    lastScrollY = currentScrollY;
    ticking = false;
}

// Throttle scroll events for better performance
window.addEventListener('scroll', () => {
    if (!ticking) {
        requestAnimationFrame(updateHeader);
        ticking = true;
    }
});

// Mobile menu toggle
const nav = document.querySelector('.nav');
const navLinks = document.querySelector('.nav-links');
const navToggle = document.querySelector('.nav-toggle');

if (navToggle && navLinks && nav) {
    // Initialize aria attributes
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', 'Open menu');

    navToggle.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent event bubbling
        const isOpen = navLinks.classList.toggle('open');
        navToggle.classList.toggle('open');
        navToggle.setAttribute('aria-expanded', String(isOpen));
        navToggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
    });

    // Close menu when clicking outside
    document.addEventListener('click', (event) => {
        if (navLinks.classList.contains('open') && !nav.contains(event.target)) {
            navLinks.classList.remove('open');
            navToggle.classList.remove('open');
            navToggle.setAttribute('aria-expanded', 'false');
            navToggle.setAttribute('aria-label', 'Open menu');
        }
    });

    // Close menu when clicking on nav links
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('open');
            navToggle.classList.remove('open');
            navToggle.setAttribute('aria-expanded', 'false');
            navToggle.setAttribute('aria-label', 'Open menu');
        });
    });
}

// Simple form validation for contact forms
function validateForm(form) {
    const inputs = form.querySelectorAll('input, textarea');
    let isValid = true;

    inputs.forEach(input => {
        if (input.hasAttribute('required') && !input.value.trim()) {
            isValid = false;
            input.style.borderColor = '#dc3545';
        } else {
            input.style.borderColor = '#ddd';
        }
    });

    return isValid;
}

// Add real-time validation feedback for forms
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('form').forEach(form => {
        const inputs = form.querySelectorAll('input, textarea');

        inputs.forEach(input => {
            // Reset border color when user starts typing
            input.addEventListener('input', () => {
                if (input.style.borderColor === 'rgb(220, 53, 69)') { // #dc3545 in rgb
                    input.style.borderColor = '#ddd';
                }
            });

            // Also reset on focus
            input.addEventListener('focus', () => {
                if (input.style.borderColor === 'rgb(220, 53, 69)') {
                    input.style.borderColor = '#ddd';
                }
            });
        });
    });

    const contactForm = document.getElementById('contact-form');
    const statusElement = document.getElementById('form-status');

    if (contactForm) {
        emailjs.init('kNoaG4-J0Vjo7HCSR');

        contactForm.addEventListener('submit', function (event) {
            event.preventDefault();

            if (!validateForm(contactForm)) {
                if (statusElement) {
                    statusElement.textContent = 'Please fill in all required fields.';
                    statusElement.style.color = '#dc3545';
                }
                return;
            }

            const submitButton = contactForm.querySelector('button[type="submit"]');
            if (submitButton) {
                submitButton.disabled = true;
                submitButton.textContent = 'Sending...';
            }

            if (statusElement) {
                statusElement.textContent = 'Sending your message...';
                statusElement.style.color = '#333';
            }

            if (!window.emailjs) {
                console.error('EmailJS is not loaded.');
                if (statusElement) {
                    statusElement.textContent = 'Email service is unavailable. Please try again later or email sitecodeuno@gmail.com directly.';
                    statusElement.style.color = '#dc3545';
                }
                if (submitButton) {
                    submitButton.disabled = false;
                    submitButton.textContent = 'Send Message';
                }
                return;
            }

            emailjs.sendForm('service_4gfkhgc', 'template_9yvkgd9', contactForm)
                .then(() => {
                    if (statusElement) {
                        statusElement.textContent = 'Thank you! Your message has been sent. I will reply within 24 hours.';
                        statusElement.style.color = '#2d7a46';
                    }
                    contactForm.reset();
                })
                .catch((error) => {
                    console.error('EmailJS error', error);
                    if (statusElement) {
                        statusElement.textContent = 'Unable to send the message right now. Please try again later or email sitecodeuno@gmail.com directly.';
                        statusElement.style.color = '#dc3545';
                    }
                })
                .finally(() => {
                    if (submitButton) {
                        submitButton.disabled = false;
                        submitButton.textContent = 'Send Message';
                    }
                });
        });
    }
});

// Add loading animation for images (prevent flash of invisible images)
document.querySelectorAll('img').forEach(img => {
    // Only apply if image is not already loaded
    if (!img.complete) {
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.3s ease';

        img.addEventListener('load', () => {
            img.style.opacity = '1';
        });
    } else {
        // Image is already loaded/cached
        img.style.opacity = '1';
    }
});