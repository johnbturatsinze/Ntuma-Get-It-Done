/* ============================================
   NTUMA - JavaScript Functionality
   ============================================ */

// Toggle about section (Mission/Vision expand/collapse)
function toggleAboutSection(headingElement) {
    const section = headingElement.closest('.about-section');
    const isActive = section.classList.contains('about-section-active');
    
    // Remove active from all sections
    document.querySelectorAll('.about-section').forEach(s => {
        s.classList.remove('about-section-active');
    });
    
    // Activate clicked section if it wasn't active
    if (!isActive) {
        section.classList.add('about-section-active');
    }
}

// Toggle agent dropdown (Requirements/What You Get)
function toggleAgentDropdown(headerElement) {
    const dropdown = headerElement.closest('.agent-dropdown');
    const content = dropdown.querySelector('.agent-dropdown-content');
    
    // Close all other dropdowns in this section
    document.querySelectorAll('.agent-dropdown').forEach(ad => {
        const c = ad.querySelector('.agent-dropdown-content');
        const h = ad.querySelector('.agent-dropdown-header');
        if (c && c !== content) {
            c.classList.remove('active');
        }
        if (h && h !== headerElement) {
            h.classList.remove('active');
        }
    });

    // Toggle current dropdown and header active state
    content.classList.toggle('active');
    headerElement.classList.toggle('active');
}

// Toggle service dropdown (only one open at a time)
function toggleServiceDropdown(button) {
    const dropdown = button.closest('.service-dropdown');
    const isActive = dropdown.classList.contains('active');
    
    // Close all other service dropdowns
    document.querySelectorAll('.service-dropdown').forEach(el => {
        if (el !== dropdown) {
            el.classList.remove('active');
        }
    });
    
    // Toggle current dropdown
    dropdown.classList.toggle('active');
}

// Scroll to section helper function
function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        // Get header height for offset
        const header = document.querySelector('.header');
        const headerHeight = header ? header.offsetHeight : 100;
        const offset = headerHeight + 20; // Add 20px padding below header
        const elementPosition = element.offsetTop - offset;
        
        window.scrollTo({
            top: elementPosition,
            behavior: 'smooth'
        });
    }
}

// Update form fields based on selected service
function updateFormFields() {
    const serviceType = document.getElementById('service').value;
    
    // Hide all service-specific fields
    document.getElementById('delivery-fields').style.display = 'none';
    document.getElementById('errands-fields').style.display = 'none';
    document.getElementById('personal-fields').style.display = 'none';
    document.getElementById('business-fields').style.display = 'none';
    document.getElementById('general-fields').style.display = 'none';

    // Show selected service fields
    if (serviceType === 'delivery') {
        document.getElementById('delivery-fields').style.display = 'block';
    } else if (serviceType === 'errands') {
        document.getElementById('errands-fields').style.display = 'block';
    } else if (serviceType === 'personal') {
        document.getElementById('personal-fields').style.display = 'block';
    } else if (serviceType === 'business') {
        document.getElementById('business-fields').style.display = 'block';
    } else if (serviceType === 'default') {
        document.getElementById('general-fields').style.display = 'block';
    }
}



// Update active nav link on scroll
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    function highlightActiveSection() {
        let currentSection = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            const scrollPosition = window.scrollY + 100; // Add offset for header
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            // Extract section name from onclick attribute
            const onclickText = link.getAttribute('onclick') || '';
            const match = onclickText.match(/scrollToSection\('([^']+)'\)/);
            const linkSection = match ? match[1] : '';
            
            if (linkSection === currentSection) {
                link.classList.add('active');
            }
        });
    }

    // Call on page load
    highlightActiveSection();

    // Call on scroll with throttle
    let isScrolling = false;
    window.addEventListener('scroll', () => {
        if (!isScrolling) {
            isScrolling = true;
            highlightActiveSection();
            setTimeout(() => {
                isScrolling = false;
            }, 100);
        }
    }, { passive: true });
}

// Handle request form submission
function handleFormSubmit(event) {
    event.preventDefault();

    const form = document.getElementById('requestForm');
    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;
    const serviceType = document.getElementById('service').value;

    if (!serviceType) {
        showNotification('Please select a service type');
        return;
    }

    // Generate WhatsApp message based on service type
    let whatsappMessage = '';

    if (serviceType === 'delivery') {
        const item = document.getElementById('item').value;
        const pickup = document.getElementById('pickup').value;
        const dropoff = document.getElementById('dropoff').value;

        whatsappMessage = `Hello Ntuma 👋\nMy name is ${name}.\nPhone number: ${phone}\n\nI need a delivery service.\nItem: ${item}\nPickup location: ${pickup}\nDrop-off location: ${dropoff}\n\nPlease confirm availability and cost.\nThank you.`;
    } 
    else if (serviceType === 'errands') {
        const errandTask = document.getElementById('errand-task').value;
        const errandLocation = document.getElementById('errand-location').value;

        whatsappMessage = `Hello Ntuma 👋\nMy name is ${name}.\nPhone number: ${phone}\n\nI need help with an errand.\nTask: ${errandTask}\nLocation: ${errandLocation}\n\nPlease advise if this can be done today.\nThank you.`;
    } 
    else if (serviceType === 'personal') {
        const personalTasks = document.getElementById('personal-tasks').value;
        const personalLocation = document.getElementById('personal-location').value;
        const personalTime = document.getElementById('personal-time').value || 'Not specified';

        whatsappMessage = `Hello Ntuma 👋\nMy name is ${name}.\nPhone number: ${phone}\n\nI need personal assistance.\nTasks involved: ${personalTasks}\nLocation: ${personalLocation}\nEstimated time needed: ${personalTime}\n\nPlease let me know how we can proceed.\nThank you.`;
    } 
    else if (serviceType === 'business') {
        const businessName = document.getElementById('business-name').value || 'Not specified';
        const businessTask = document.getElementById('business-task').value;
        const businessLocation = document.getElementById('business-location').value;

        whatsappMessage = `Hello Ntuma 👋\nMy name is ${name}.\nCompany / Business name: ${businessName}\nPhone number: ${phone}\n\nI need business support services.\nTask details: ${businessTask}\nPickup / Office location: ${businessLocation}\n\nPlease advise on availability and pricing.\nThank you.`;
    } 
    else if (serviceType === 'default') {
        const generalTask = document.getElementById('general-task').value;
        const generalLocation = document.getElementById('general-location').value;

        whatsappMessage = `Hello Ntuma 👋\nMy name is ${name}.\nPhone number: ${phone}\n\nI would like help with the following task:\n${generalTask}\n\nLocation: ${generalLocation}\n\nPlease let me know how soon this can be handled.\nThank you.`;
    }

    // Show success notification
    showNotification('Message ready! Redirecting to WhatsApp...');

    // Encode and redirect to WhatsApp
    const encodedMessage = encodeURIComponent(whatsappMessage);
    setTimeout(() => {
        window.open(`https://wa.me/250788455272?text=${encodedMessage}`, '_blank');
        form.reset();
        updateFormFields(); // Reset form fields visibility
    }, 500);
}

// Show notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background-color: #00A651;
        color: white;
        padding: 16px 24px;
        border-radius: 6px;
        z-index: 2000;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        font-weight: 600;
        animation: slideDown 0.3s ease;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideUp 0.3s ease forwards';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Add animation styles
const style = document.createElement('style');
style.textContent = `
    @keyframes slideDown {
        from {
            opacity: 0;
            transform: translateX(-50%) translateY(-20px);
        }
        to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }
    }

    @keyframes slideUp {
        from {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }
        to {
            opacity: 0;
            transform: translateX(-50%) translateY(-20px);
        }
    }
`;
document.head.appendChild(style);

// Make logo clickable to scroll to home
document.addEventListener('DOMContentLoaded', () => {
    const logo = document.querySelector('.logo');
    if (logo) {
        logo.addEventListener('click', () => {
            scrollToSection('home');
        });
        logo.style.cursor = 'pointer';
    }

    // Initialize active nav link
    updateActiveNavLink();

    // Phone number validation for form
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', (e) => {
            // Allow only numbers, +, and spaces
            e.target.value = e.target.value.replace(/[^0-9+\s]/g, '');
        });
    }

    // Email validation
    const emailInput = document.getElementById('email');
    if (emailInput) {
        emailInput.addEventListener('blur', (e) => {
            const email = e.target.value;
            if (email && !isValidEmail(email)) {
                e.target.style.borderColor = '#FF6B35';
            } else {
                e.target.style.borderColor = '';
            }
        });
    }

    // ABOUT section accordion: show only one card expanded at a time
    const aboutCards = document.querySelectorAll('.about-card');
    if (aboutCards && aboutCards.length) {
        // Collapse all and expand the first
        aboutCards.forEach((card, idx) => {
            card.classList.remove('active');
            // Make the heading clickable
            const heading = card.querySelector('h3');
            if (heading) {
                heading.style.cursor = 'pointer';
                heading.addEventListener('click', () => {
                    // If this card is already active, collapse it
                    const isActive = card.classList.contains('active');
                    aboutCards.forEach(c => c.classList.remove('active'));
                    if (!isActive) {
                        card.classList.add('active');
                        // ensure it's visible in viewport
                        card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                    }
                });
            }
            // allow keyboard activation
            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    const h = card.querySelector('h3');
                    if (h) h.click();
                }
            });
            // set tabindex to enable keyboard focus
            card.setAttribute('tabindex', '0');
        });

        // expand first card by default
        aboutCards[0].classList.add('active');
    }
});

// Email validation helper
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Intersection Observer for fade-in animations on scroll
if ('IntersectionObserver' in window) {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Apply to service cards, trust cards, etc.
    document.querySelectorAll('.service-card, .trust-card, .contact-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Log analytics or tracking (optional)
console.log('NTUMA Website Loaded - Send me & Save your time!');
