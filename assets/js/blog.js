// Blog Post JavaScript – Lenis Smooth Scroll + Theme Toggle + Premium Features
// ============================================================

// ==========================================
// Lenis Smooth Scroll Initialization
// ==========================================

let lenis;

function initLenis() {
    // Guard: Lenis must be loaded from CDN before this runs
    if (typeof Lenis === 'undefined') {
        console.warn('Lenis not loaded yet – skipping smooth scroll init.');
        return;
    }

    lenis = new Lenis({
        duration: 1.2,              // Scroll animation duration (seconds)
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Expo out
        direction: 'vertical',
        gestureDirection: 'vertical',
        smooth: true,
        mouseMultiplier: 1.0,
        smoothTouch: false,         // Keep native on mobile for performance
        touchMultiplier: 2,
        infinite: false,
    });

    // Tick Lenis on every animation frame
    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Wire scroll-dependent UI updates through Lenis
    lenis.on('scroll', ({ scroll, limit, velocity, direction, progress }) => {
        // Reading progress bar
        const pct = Math.min(progress * 100, 100);
        if (progressBar) progressBar.style.width = `${pct}%`;

        // Navbar scroll state
        handleNavScroll(scroll);
    });

    console.log('%c🌊 Lenis Smooth Scroll Active', 'color: #6366F1; font-size: 13px; font-weight: bold;');
}

// ==========================================
// Theme Toggle Functionality
// ==========================================

const themeToggle = document.getElementById('themeToggle');
const sunIcon = document.getElementById('sunIcon');
const moonIcon = document.getElementById('moonIcon');
const html = document.documentElement;

// Check for saved theme preference or default to 'light'
const currentTheme = localStorage.getItem('theme') || 'light';
html.setAttribute('data-theme', currentTheme);

function updateThemeIcons(theme) {
    if (sunIcon && moonIcon) {
        sunIcon.className = theme === 'dark' ? 'theme-icon-hidden' : 'theme-icon';
        moonIcon.className = theme === 'dark' ? 'theme-icon' : 'theme-icon-hidden';
    }
}
updateThemeIcons(currentTheme);

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        const theme = html.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
        html.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        updateThemeIcons(theme);
        announceThemeChange(theme);
    });
}

// ==========================================
// Inject Premium Background Orbs
// ==========================================

function injectBlobs() {
    // Avoid double injection
    if (document.querySelector('.blob-container')) return;

    const container = document.createElement('div');
    container.className = 'blob-container';
    container.innerHTML = `
        <div class="blob blob-1"></div>
        <div class="blob blob-2"></div>
        <div class="blob blob-3"></div>
        <div class="blob blob-4"></div>
    `;
    document.body.prepend(container);
}

// ==========================================
// Natural CTA Injection Logic
// ==========================================

function injectCTAs() {
    const postContent = document.querySelector('.blog-post-content');
    if (!postContent) return;

    // Simple, high-converting 1-2 liner starter message for WhatsApp leads
    const whatsappMessage = `Hey LeadbaseAI! I just read your blog and I'm interested in getting custom leads to scale my business. Let's connect!`;

    const whatsappLink = `https://wa.me/918766334584?text=${encodeURIComponent(whatsappMessage)}`;

    // Top CTA – placed after the 3rd paragraph
    const paragraphs = postContent.querySelectorAll('p');
    if (paragraphs.length >= 3) {
        const topCTA = document.createElement('div');
        topCTA.className = 'blog-cta inline-cta';
        topCTA.innerHTML = `
            <div class="cta-content">
                <div class="cta-tag">Industry Leading Insights</div>
                <h3 class="cta-title">Want more high-quality leads?</h3>
                <p class="cta-desc">Scale your sales with AI-filtered prospects and automated outreach.</p>
            </div>
            <a href="${whatsappLink}" class="cta-button" target="_blank" rel="noopener noreferrer">
                Get Free Consultation
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </a>
        `;
        paragraphs[2].after(topCTA);
    }
}

// ==========================================
// Inject Premium Footer
// ==========================================

function injectFooter() {
    if (document.querySelector('.footer')) return;

    const footer = document.createElement('footer');
    footer.className = 'footer';
    footer.innerHTML = `
        <div class="footer-main">
            <div class="footer-brand">
                <a href="https://blog.leadbaseai.in" class="footer-logo">
                    <img src="../assets/images/logo.png" alt="LeadbaseAI">
                    <span>LeadbaseAI</span>
                </a>
                <p class="footer-tagline">AI for lead generation starts here</p>
            </div>
            <div class="footer-column">
                <h4>Products</h4>
                <ul>
                    <li><a href="#">Lead Scraper</a></li>
                    <li><a href="#">Email Finder</a></li>
                    <li><a href="#">AI Filter</a></li>
                </ul>
            </div>
            <div class="footer-column">
                <h4>Company</h4>
                <ul>
                    <li><a href="https://leadbaseai.in/about">About Us</a></li>
                    <li><a href="https://blog.leadbaseai.in">Blog</a></li>
                    <li><a href="https://leadbaseai.in/contact">Contact</a></li>
                    <li><a href="https://leadbaseai.in/terms">Terms of Service</a></li>
                    <li><a href="https://leadbaseai.in/privacy">Privacy Policy</a></li>
                </ul>
            </div>
            <div class="footer-column">
                <h4>Socials</h4>
                <ul>
                    <li><a href="mailto:support@leadbaseai.in">support@leadbaseai.in</a></li>
                    <li><a href="#">LinkedIn</a></li>
                    <li><a href="#">X</a></li>
                    <li><a href="https://instagram.com/leadbaseai">Instagram</a></li>
                </ul>
            </div>
        </div>
        <div class="footer-gradient">
            <div class="footer-bottom">
                <span class="footer-copyright">Copyright LeadbaseAI 2026</span>
                <span class="footer-legal">All rights reserved, India</span>
            </div>
        </div>
    `;
    document.body.appendChild(footer);
}

// ==========================================
// Reading Progress Bar
// ==========================================

function createProgressBar() {
    const bar = document.createElement('div');
    bar.id = 'reading-progress';
    bar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 3px;
        background: linear-gradient(90deg, var(--color-accent) 0%, var(--color-primary) 100%);
        z-index: 9999;
        transition: width 0.08s ease-out;
        pointer-events: none;
    `;
    document.body.appendChild(bar);
    return bar;
}

const progressBar = createProgressBar();

// Fallback updater used only when Lenis is NOT available
function updateReadingProgressNative() {
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight - windowHeight;
    const scrolled = window.scrollY;
    const progress = (scrolled / documentHeight) * 100;
    if (progressBar) progressBar.style.width = `${Math.min(progress, 100)}%`;
}

// ==========================================
// Navbar Scroll Handlers
// ==========================================

function handleNavScroll(scrollY) {
    const nav = document.querySelector('nav');
    if (!nav) return;
    const y = scrollY !== undefined ? scrollY : window.scrollY;

    if (y > 30) {
        nav.classList.add('navbar-scrolled');
    } else {
        nav.classList.remove('navbar-scrolled');
    }
}

// ==========================================
// Estimated Reading Time
// ==========================================

function calculateReadingTime() {
    const content = document.querySelector('.blog-post-content');
    if (!content) return;

    const text = content.innerText || content.textContent;
    const wordCount = text.trim().split(/\s+/).length;
    const wordsPerMinute = 200;
    const readingTime = Math.ceil(wordCount / wordsPerMinute);

    const readingTimeElement = document.querySelector('.reading-time');
    if (readingTimeElement) {
        readingTimeElement.innerHTML = `<span>🕒</span> ${readingTime} min read`;
    }
}

// ==========================================
// Initialize Everything on DOM Ready
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    injectBlobs();
    injectCTAs();
    injectFooter();
    calculateReadingTime();
    handleNavScroll(0);

    // Init Lenis after DOM is ready
    initLenis();

    // If Lenis failed (CDN not loaded), fall back to native scroll listeners
    if (!lenis) {
        window.addEventListener('scroll', () => {
            updateReadingProgressNative();
            handleNavScroll();
        });
        window.addEventListener('resize', updateReadingProgressNative);
    }
});

// ==========================================
// Accessibility Enhancements
// ==========================================

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

// ==========================================
// Keyboard Shortcuts
// ==========================================

document.addEventListener('keydown', (e) => {
    // Alt + T to toggle theme
    if (e.altKey && e.key === 't') {
        e.preventDefault();
        themeToggle?.click();
    }
});

console.log('%c📝 Premium Blog Engine Activated!', 'color: #2563EB; font-size: 16px; font-weight: bold;');
