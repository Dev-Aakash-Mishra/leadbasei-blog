// Blog Post JavaScript with Theme Toggle

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

        // Announce theme change for accessibility
        announceThemeChange(theme);
    });
}

// ==========================================
// Reading Progress Bar
// ==========================================

function createProgressBar() {
    const progressBar = document.createElement('div');
    progressBar.id = 'reading-progress';
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 3px;
        background: linear-gradient(90deg, var(--color-accent) 0%, var(--color-primary) 100%);
        z-index: 9999;
        transition: width 0.1s ease-out;
    `;
    document.body.appendChild(progressBar);

    return progressBar;
}

const progressBar = createProgressBar();

function updateReadingProgress() {
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight - windowHeight;
    const scrolled = window.scrollY;
    const progress = (scrolled / documentHeight) * 100;

    progressBar.style.width = `${Math.min(progress, 100)}%`;
}

window.addEventListener('scroll', updateReadingProgress);
window.addEventListener('resize', updateReadingProgress);

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

    // Update reading time if element exists
    const readingTimeElement = document.querySelector('.reading-time');
    if (readingTimeElement) {
        readingTimeElement.textContent = `${readingTime} min read`;
    }
}

// Calculate on page load
calculateReadingTime();

// ==========================================
// Table of Contents Generator
// ==========================================

function generateTableOfContents() {
    const content = document.querySelector('.blog-post-content');
    if (!content) return;

    const headings = content.querySelectorAll('h2, h3');
    if (headings.length === 0) return;

    const toc = document.createElement('div');
    toc.className = 'table-of-contents';
    toc.innerHTML = '<h3>Table of Contents</h3><ul></ul>';

    const tocList = toc.querySelector('ul');

    headings.forEach((heading, index) => {
        // Add ID to heading if it doesn't have one
        if (!heading.id) {
            heading.id = `heading-${index}`;
        }

        const li = document.createElement('li');
        li.className = heading.tagName.toLowerCase();

        const link = document.createElement('a');
        link.href = `#${heading.id}`;
        link.textContent = heading.textContent;
        link.addEventListener('click', (e) => {
            e.preventDefault();
            heading.scrollIntoView({ behavior: 'smooth', block: 'start' });

            // Update URL without triggering scroll
            history.pushState(null, null, `#${heading.id}`);
        });

        li.appendChild(link);
        tocList.appendChild(li);
    });

    // Add TOC styles
    const style = document.createElement('style');
    style.textContent = `
        .table-of-contents {
            background: var(--color-bg-alt);
            border: 2px solid var(--color-border);
            border-radius: var(--radius-lg);
            padding: 1.5rem;
            margin: 2rem 0 3rem;
        }
        
        .table-of-contents h3 {
            margin-top: 0 !important;
            margin-bottom: 1rem !important;
            font-size: 1.25rem !important;
            color: var(--color-text);
        }
        
        .table-of-contents ul {
            list-style: none;
            padding-left: 0 !important;
            margin-bottom: 0 !important;
        }
        
        .table-of-contents li {
            margin-bottom: 0.5rem !important;
        }
        
        .table-of-contents li.h3 {
            padding-left: 1.5rem;
        }
        
        .table-of-contents a {
            color: var(--color-text);
            text-decoration: none;
            border-bottom: none !important;
            transition: color var(--transition-fast);
        }
        
        .table-of-contents a:hover {
            color: var(--color-accent);
        }
    `;
    document.head.appendChild(style);

    // Insert TOC after the first paragraph
    const firstParagraph = content.querySelector('p');
    if (firstParagraph) {
        firstParagraph.after(toc);
    }
}

// Generate TOC on page load
generateTableOfContents();

// ==========================================
// Copy Code Button
// ==========================================

function addCopyButtonsToCodeBlocks() {
    const codeBlocks = document.querySelectorAll('pre code');

    codeBlocks.forEach((codeBlock) => {
        const pre = codeBlock.parentElement;
        pre.style.position = 'relative';

        const button = document.createElement('button');
        button.className = 'copy-code-btn';
        button.textContent = 'Copy';
        button.setAttribute('aria-label', 'Copy code to clipboard');

        button.addEventListener('click', async () => {
            const code = codeBlock.textContent;

            try {
                await navigator.clipboard.writeText(code);
                button.textContent = 'Copied!';
                button.style.background = 'var(--color-success)';

                setTimeout(() => {
                    button.textContent = 'Copy';
                    button.style.background = '';
                }, 2000);
            } catch (err) {
                button.textContent = 'Failed';
                setTimeout(() => {
                    button.textContent = 'Copy';
                }, 2000);
            }
        });

        pre.appendChild(button);
    });

    // Add styles for copy button
    const style = document.createElement('style');
    style.textContent = `
        .copy-code-btn {
            position: absolute;
            top: 0.5rem;
            right: 0.5rem;
            background: var(--color-accent);
            color: white;
            border: none;
            padding: 0.375rem 0.75rem;
            border-radius: var(--radius-sm);
            font-size: 0.75rem;
            font-weight: 600;
            cursor: pointer;
            transition: all var(--transition-fast);
            opacity: 0;
        }
        
        pre:hover .copy-code-btn {
            opacity: 1;
        }
        
        .copy-code-btn:hover {
            transform: scale(1.05);
        }
        
        .copy-code-btn:active {
            transform: scale(0.95);
        }
    `;
    document.head.appendChild(style);
}

// Add copy buttons on page load
addCopyButtonsToCodeBlocks();

// ==========================================
// Image Zoom on Click
// ==========================================

function addImageZoom() {
    const images = document.querySelectorAll('.blog-post-content img');

    images.forEach((img) => {
        img.style.cursor = 'zoom-in';

        img.addEventListener('click', () => {
            const overlay = document.createElement('div');
            overlay.className = 'image-overlay';
            overlay.innerHTML = `
                <div class="image-overlay-content">
                    <img src="${img.src}" alt="${img.alt}">
                    <button class="close-overlay" aria-label="Close">×</button>
                </div>
            `;

            document.body.appendChild(overlay);
            document.body.style.overflow = 'hidden';

            const closeBtn = overlay.querySelector('.close-overlay');
            const closeOverlay = () => {
                overlay.remove();
                document.body.style.overflow = '';
            };

            closeBtn.addEventListener('click', closeOverlay);
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) closeOverlay();
            });

            document.addEventListener('keydown', function escHandler(e) {
                if (e.key === 'Escape') {
                    closeOverlay();
                    document.removeEventListener('keydown', escHandler);
                }
            });
        });
    });

    // Add styles for image overlay
    const style = document.createElement('style');
    style.textContent = `
        .image-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.9);
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 2rem;
            animation: fadeIn 0.2s ease-out;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        .image-overlay-content {
            position: relative;
            max-width: 90vw;
            max-height: 90vh;
        }
        
        .image-overlay img {
            max-width: 100%;
            max-height: 90vh;
            object-fit: contain;
            border-radius: var(--radius-lg);
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
        }
        
        .close-overlay {
            position: absolute;
            top: -1rem;
            right: -1rem;
            background: white;
            color: #0F172A;
            border: none;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            font-size: 1.5rem;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.3);
            transition: transform var(--transition-fast);
        }
        
        .close-overlay:hover {
            transform: scale(1.1);
        }
    `;
    document.head.appendChild(style);
}

// Add image zoom on page load
addImageZoom();

// ==========================================
// Smooth Scroll for Anchor Links
// ==========================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');

        if (href === '#') return;

        const target = document.querySelector(href);

        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            history.pushState(null, null, href);
        }
    });
});

// ==========================================
// Social Share Buttons
// ==========================================

function addSocialShareButtons() {
    const article = document.querySelector('.blog-post-header');
    if (!article) return;

    const shareContainer = document.createElement('div');
    shareContainer.className = 'social-share';

    const pageUrl = encodeURIComponent(window.location.href);
    const pageTitle = encodeURIComponent(document.title);

    shareContainer.innerHTML = `
        <p class="share-label">Share this article:</p>
        <div class="share-buttons">
            <a href="https://twitter.com/intent/tweet?url=${pageUrl}&text=${pageTitle}" 
               target="_blank" rel="noopener" class="share-btn twitter" aria-label="Share on Twitter">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"/>
                </svg>
            </a>
            <a href="https://www.linkedin.com/sharing/share-offsite/?url=${pageUrl}" 
               target="_blank" rel="noopener" class="share-btn linkedin" aria-label="Share on LinkedIn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/>
                    <circle cx="4" cy="4" r="2"/>
                </svg>
            </a>
            <a href="https://wa.me/?text=${pageTitle}%20${pageUrl}" 
               target="_blank" rel="noopener" class="share-btn whatsapp" aria-label="Share on WhatsApp">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
            </a>
            <button class="share-btn copy-link" aria-label="Copy link">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
                    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
                </svg>
            </button>
        </div>
    `;

    article.appendChild(shareContainer);

    // Copy link functionality
    const copyLinkBtn = shareContainer.querySelector('.copy-link');
    copyLinkBtn.addEventListener('click', async () => {
        try {
            await navigator.clipboard.writeText(window.location.href);
            const originalHTML = copyLinkBtn.innerHTML;
            copyLinkBtn.innerHTML = '<span style="font-size: 14px;">✓</span>';
            setTimeout(() => {
                copyLinkBtn.innerHTML = originalHTML;
            }, 2000);
        } catch (err) {
            console.error('Failed to copy link:', err);
        }
    });

    // Add styles
    const style = document.createElement('style');
    style.textContent = `
        .social-share {
            margin-top: 2rem;
            padding-top: 2rem;
            border-top: 1px solid var(--color-border);
        }
        
        .share-label {
            font-weight: 600;
            color: var(--color-text);
            margin-bottom: 1rem;
            font-size: 0.9375rem;
        }
        
        .share-buttons {
            display: flex;
            gap: 0.75rem;
        }
        
        .share-btn {
            width: 44px;
            height: 44px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            text-decoration: none;
            border: 2px solid var(--color-border);
            background: var(--color-bg);
            color: var(--color-text);
            transition: all var(--transition-base);
            cursor: pointer;
        }
        
        .share-btn:hover {
            transform: translateY(-2px);
            box-shadow: var(--shadow-md);
        }
        
        .share-btn.twitter:hover {
            background: #1DA1F2;
            border-color: #1DA1F2;
            color: white;
        }
        
        .share-btn.linkedin:hover {
            background: #0A66C2;
            border-color: #0A66C2;
            color: white;
        }
        
        .share-btn.whatsapp:hover {
            background: #25D366;
            border-color: #25D366;
            color: white;
        }
        
        .share-btn.copy-link:hover {
            background: var(--color-accent);
            border-color: var(--color-accent);
            color: white;
        }
    `;
    document.head.appendChild(style);
}

// Add social share buttons
addSocialShareButtons();

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

// Add screen reader only class
const srStyle = document.createElement('style');
srStyle.textContent = `
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
document.head.appendChild(srStyle);

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

// ==========================================
// Console Message
// ==========================================

console.log('%c📝 LeadbaseAI Blog Post Loaded!', 'color: #33B5FF; font-size: 16px; font-weight: bold;');
console.log('%cTheme Toggle: Click the button in the navbar or press Alt+T', 'color: #64748B; font-size: 12px;');
console.log('%cReading progress bar enabled', 'color: #64748B; font-size: 12px;');
