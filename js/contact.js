// Contact Page JavaScript with Theme Toggle and Form Handling

// ==========================================
// Theme Toggle Functionality
// ==========================================

const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');
const html = document.documentElement;

// Check for saved theme preference or default to 'light'
const currentTheme = localStorage.getItem('theme') || 'light';
html.setAttribute('data-theme', currentTheme);

// Set initial icon
if (themeIcon) {
    themeIcon.textContent = currentTheme === 'dark' ? '🌙' : '☀️';
}

// Theme toggle event listener
if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        const theme = html.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
        html.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);

        if (themeIcon) {
            themeIcon.textContent = theme === 'dark' ? '🌙' : '☀️';
        }

        // Add a subtle animation to the toggle
        themeToggle.style.transform = 'scale(0.95)';
        setTimeout(() => {
            themeToggle.style.transform = 'scale(1)';
        }, 150);
    });
}

// ==========================================
// Form Handling
// ==========================================

const leadForm = document.getElementById('leadForm');
const submitButton = leadForm?.querySelector('button[type="submit"]');

// Create message element
function createMessageElement() {
    let messageEl = document.getElementById('formMessage');
    if (!messageEl) {
        messageEl = document.createElement('div');
        messageEl.id = 'formMessage';
        messageEl.className = 'message';
        leadForm.appendChild(messageEl);
    }
    return messageEl;
}

// Show message
function showMessage(message, type = 'success') {
    const messageEl = createMessageElement();
    messageEl.className = `message message-${type} show`;

    const icon = type === 'success' ? '✓' : '⚠';
    messageEl.innerHTML = `
        <span class="message-icon">${icon}</span>
        <span>${message}</span>
    `;

    // Auto-hide after 5 seconds
    setTimeout(() => {
        messageEl.classList.remove('show');
    }, 5000);
}

// Form validation
function validateForm(formData) {
    const errors = [];

    // Name validation
    if (!formData.name || formData.name.trim().length < 2) {
        errors.push('Please enter a valid name (at least 2 characters)');
    }

    // Revenue validation
    if (!formData.revenue) {
        errors.push('Please select your current revenue range');
    }

    // Business type validation
    if (!formData.businessType) {
        errors.push('Please select your business type');
    }

    // Niche validation
    if (!formData.niche || formData.niche.trim().length < 2) {
        errors.push('Please enter your target niche');
    }

    // Country validation
    if (!formData.country || formData.country.trim().length < 2) {
        errors.push('Please enter your target country');
    }

    return errors;
}

// Format WhatsApp message
function formatWhatsAppMessage(formData) {
    return `*New Lead Request from LeadbaseAI*

 *Name:* ${formData.name}
 *Current Revenue:* ${formData.revenue}
 *Business Type:* ${formData.businessType}
 *Target Niche:* ${formData.niche}
 *Target Country:* ${formData.country}

_Sent via LeadbaseAI Contact Form_`;
}

// Send to WhatsApp
function sendToWhatsApp(formData) {
    // Replace with your actual WhatsApp number (format: country code + number, no + or spaces)
    // Example: For +1 234 567 8900, use: 12345678900
    const whatsappNumber = '+918766334584'; // Replace with your actual number

    const message = formatWhatsAppMessage(formData);
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

    // Open WhatsApp in new tab
    window.open(whatsappUrl, '_blank');
}

// Form submission handler
if (leadForm) {
    leadForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Get form data
        const formData = {
            name: document.getElementById('nameInput')?.value || '',
            revenue: document.getElementById('revenueSelect')?.value || '',
            businessType: document.getElementById('businessSelect')?.value || '',
            niche: document.getElementById('nicheInput')?.value || '',
            country: document.getElementById('countryInput')?.value || ''
        };

        // Validate form
        const errors = validateForm(formData);

        if (errors.length > 0) {
            showMessage(errors[0], 'error');
            return;
        }

        // Show loading state
        if (submitButton) {
            submitButton.classList.add('btn-loading');
            submitButton.disabled = true;
        }

        // Simulate processing delay for better UX
        setTimeout(() => {
            // Track conversion FIRST
            if (typeof gtag !== 'undefined') {
                gtag('event', 'whatsapp_click', {
                    event_category: 'Lead',
                    event_label: window.location.pathname
                });
            }

            // Delay WhatsApp redirect slightly to allow GA to send event
            setTimeout(() => {
                sendToWhatsApp(formData);
            }, 200);

            // Show success message
            showMessage('Opening WhatsApp... Your request is ready to send!', 'success');

            // Reset form
            leadForm.reset();

            // Remove loading state
            if (submitButton) {
                submitButton.classList.remove('btn-loading');
                submitButton.disabled = false;
            }
        }, 800);
    });
}

// ==========================================
// Input Enhancement - Auto-format and Validation
// ==========================================

// Add real-time validation feedback
const inputs = leadForm?.querySelectorAll('input, select, textarea');

inputs?.forEach(input => {
    // Add focus animation
    input.addEventListener('focus', () => {
        const formGroup = input.closest('.form-group');
        if (formGroup) {
            const label = formGroup.querySelector('label');
            if (label) {
                label.style.color = 'var(--color-accent)';
            }
        }
    });

    // Remove focus animation
    input.addEventListener('blur', () => {
        const formGroup = input.closest('.form-group');
        if (formGroup) {
            const label = formGroup.querySelector('label');
            if (label) {
                label.style.color = 'var(--color-text)';
            }
        }

        // Validate on blur
        if (input.value && input.required) {
            if (input.value.trim().length < 2) {
                input.style.borderColor = 'var(--color-error)';
            } else {
                input.style.borderColor = 'var(--color-success)';
            }
        }
    });

    // Reset border color on input
    input.addEventListener('input', () => {
        input.style.borderColor = 'var(--color-border)';
    });
});

// ==========================================
// Navbar Scroll Effect
// ==========================================

let lastScroll = 0;
const navbar = document.querySelector('nav');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (navbar) {
        if (currentScroll > 100) {
            navbar.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.boxShadow = 'none';
        }
    }

    lastScroll = currentScroll;
});

// ==========================================
// Smooth Scroll for Anchor Links
// ==========================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');

        // Don't prevent default for links that are just "#"
        if (href === '#') return;

        const target = document.querySelector(href);

        if (target) {
            e.preventDefault();

            const navHeight = navbar?.offsetHeight || 0;
            const targetPosition = target.offsetTop - navHeight - 20;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ==========================================
// Keyboard Shortcuts
// ==========================================

document.addEventListener('keydown', (e) => {
    // Alt + T to toggle theme
    if (e.altKey && e.key === 't') {
        e.preventDefault();
        themeToggle?.click();
    }

    // Escape to clear form
    if (e.key === 'Escape' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'SELECT') {
        const messageEl = document.getElementById('formMessage');
        if (messageEl?.classList.contains('show')) {
            messageEl.classList.remove('show');
        }
    }
});

// ==========================================
// Auto-save Form Data (Draft)
// ==========================================

const DRAFT_KEY = 'leadbase_contact_draft';

// Load draft on page load
function loadDraft() {
    const draft = localStorage.getItem(DRAFT_KEY);
    if (draft) {
        try {
            const data = JSON.parse(draft);

            if (document.getElementById('nameInput')) {
                document.getElementById('nameInput').value = data.name || '';
            }
            if (document.getElementById('revenueSelect')) {
                document.getElementById('revenueSelect').value = data.revenue || '';
            }
            if (document.getElementById('businessSelect')) {
                document.getElementById('businessSelect').value = data.businessType || '';
            }
            if (document.getElementById('nicheInput')) {
                document.getElementById('nicheInput').value = data.niche || '';
            }
            if (document.getElementById('countryInput')) {
                document.getElementById('countryInput').value = data.country || '';
            }
        } catch (e) {
            console.error('Error loading draft:', e);
        }
    }
}

// Save draft on input
function saveDraft() {
    const formData = {
        name: document.getElementById('nameInput')?.value || '',
        revenue: document.getElementById('revenueSelect')?.value || '',
        businessType: document.getElementById('businessSelect')?.value || '',
        niche: document.getElementById('nicheInput')?.value || '',
        country: document.getElementById('countryInput')?.value || ''
    };

    localStorage.setItem(DRAFT_KEY, JSON.stringify(formData));
}

// Clear draft on successful submission
function clearDraft() {
    localStorage.removeItem(DRAFT_KEY);
}

// Add input listeners for auto-save
inputs?.forEach(input => {
    input.addEventListener('input', () => {
        // Debounce the save
        clearTimeout(window.draftSaveTimeout);
        window.draftSaveTimeout = setTimeout(saveDraft, 500);
    });
});

// Load draft on page load
loadDraft();

// Clear draft on successful form submission
if (leadForm) {
    leadForm.addEventListener('submit', () => {
        setTimeout(clearDraft, 1000);
    });
}

// ==========================================
// Accessibility Enhancements
// ==========================================

// Announce theme changes to screen readers
function announceThemeChange(theme) {
    const announcement = document.createElement('div');
    announcement.setAttribute('role', 'status');
    announcement.setAttribute('aria-live', 'polite');
    announcement.className = 'sr-only';
    announcement.textContent = `Theme changed to ${theme} mode`;
    document.body.appendChild(announcement);

    setTimeout(() => {
        announcement.remove();
    }, 1000);
}

// Add screen reader only class
const style = document.createElement('style');
style.textContent = `
    .sr-only {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border-width: 0;
    }
`;
document.head.appendChild(style);

// ==========================================
// Console Message
// ==========================================

console.log('%c🚀 LeadbaseAI Contact Form Loaded!', 'color: #33B5FF; font-size: 16px; font-weight: bold;');
console.log('%cTheme Toggle: Click the button in the navbar or press Alt+T', 'color: #64748B; font-size: 12px;');
console.log('%cForm auto-saves as draft while you type', 'color: #64748B; font-size: 12px;');

// ==========================================
// Export functions for testing (optional)
// ==========================================

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        validateForm,
        formatWhatsAppMessage,
        sendToWhatsApp
    };
}
