// Blog Listing Page JavaScript - Fetches from index.json

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

themeToggle.addEventListener('click', () => {
    const theme = html.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    html.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    updateThemeIcons(theme);
});

// ==========================================
// Blog Data Management
// ==========================================

let blogPosts = [];
let isLoading = true;

// Category mapping
const categoryMap = {
    'AI & Automation': 'ai',
    'Lead Generation': 'leads',
    'Sales Strategy': 'sales',
    'Business Growth': 'growth'
};

// Format date from YYYY-MM-DD to "Mon DD, YYYY"
function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

// Fetch blog posts from index.json
async function fetchBlogPosts() {
    try {
        const response = await fetch('assets/index.json');
        if (!response.ok) {
            throw new Error('Failed to fetch blog posts');
        }
        const data = await response.json();

        // Transform data to match expected format
        blogPosts = data.map((post, index) => ({
            id: index + 1,
            title: post.title,
            excerpt: post.preview,
            category: categoryMap[post.category] || 'ai',
            categoryLabel: post.category,
            author: 'LeadbaseAI Team',
            date: formatDate(post.date),
            readTime: post.readTime,
            image: post.image || 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=600&fit=crop',
            slug: post.slug,
            location: post.location || `/blog/${post.slug}`
        }));

        isLoading = false;
        // Do NOT render on initial load — keep static HTML for SEO
        // JS only renders when user interacts with filters/pagination
    } catch (error) {
        console.error('Error fetching blog posts:', error);
        isLoading = false;
        // On error, static cards remain visible — no broken state
    }
}

// Show error message
function showErrorMessage() {
    const blogGrid = document.getElementById('blogGrid');
    blogGrid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 3rem;">
            <h3 style="color: var(--color-text); margin-bottom: 1rem;">No articles found</h3>
            <p style="color: var(--color-text-muted);">Try adjusting your filter criteria</p>
        </div>
    `;
}

// ==========================================
// State Management
// ==========================================

let currentCategory = 'all';
let currentPage = 1;
let searchQuery = '';
const postsPerPage = 6;
let userInteracted = false; // Only render via JS after user interaction

// Get author initials
function getInitials(name) {
    return name.split(' ').map(n => n[0]).join('');
}

// Filter posts
function getFilteredPosts() {
    return blogPosts.filter(post => {
        const matchesCategory = currentCategory === 'all' || post.category === currentCategory;
        const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });
}

// Render blog cards — only called after user interaction (filter/search/page change)
function renderBlogCards() {
    if (!userInteracted) return; // Preserve static HTML on initial load

    const blogGrid = document.getElementById('blogGrid');
    const filteredPosts = getFilteredPosts();
    const startIndex = (currentPage - 1) * postsPerPage;
    const endIndex = startIndex + postsPerPage;
    const postsToShow = filteredPosts.slice(startIndex, endIndex);

    if (postsToShow.length === 0) {
        blogGrid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 3rem;">
                <h3 style="color: var(--color-text); margin-bottom: 1rem;">No articles found</h3>
                <p style="color: var(--color-text-muted);">Try adjusting your filter criteria</p>
            </div>
        `;
        return;
    }

    blogGrid.innerHTML = postsToShow.map(post => `
        <article class="blog-card revealed" onclick="this.classList.add('clicking');setTimeout(()=>window.open('${post.location}','_blank'),150)">
            <div class="blog-image">
                <img src="${post.image}" alt="${post.title}" loading="lazy">
                <span class="blog-category">${post.categoryLabel}</span>
            </div>
            <div class="blog-content">
                <div class="blog-meta">
                    <span class="blog-meta-item">📅 ${post.date}</span>
                    <span class="blog-meta-item">⏱️ ${post.readTime}</span>
                </div>
                <h3 class="blog-title">${post.title}</h3>
                <p class="blog-excerpt">${post.excerpt}</p>
                <div class="blog-footer">
                    <div class="blog-author">
                        <div class="author-avatar">${getInitials(post.author)}</div>
                        <span class="author-name">${post.author}</span>
                    </div>
                    <a href="${post.location}" target="_blank" rel="noopener" class="read-more" onclick="event.stopPropagation()">
                        Read More →
                    </a>
                </div>
            </div>
        </article>
    `).join('');

    // Update pagination
    updatePagination(filteredPosts.length);
}

// Update pagination
function updatePagination(totalPosts) {
    const totalPages = Math.ceil(totalPosts / postsPerPage);
    const pagination = document.getElementById('pagination');

    let paginationHTML = `
        <button class="pagination-btn" id="prevBtn" ${currentPage === 1 ? 'disabled' : ''}>← Previous</button>
    `;

    for (let i = 1; i <= totalPages; i++) {
        paginationHTML += `
            <button class="pagination-btn ${i === currentPage ? 'active' : ''}" onclick="changePage(${i})">${i}</button>
        `;
    }

    paginationHTML += `
        <button class="pagination-btn" id="nextBtn" ${currentPage === totalPages ? 'disabled' : ''}>Next →</button>
    `;

    pagination.innerHTML = paginationHTML;

    // Add event listeners to prev/next buttons
    document.getElementById('prevBtn').addEventListener('click', () => {
        if (currentPage > 1) changePage(currentPage - 1);
    });

    document.getElementById('nextBtn').addEventListener('click', () => {
        if (currentPage < totalPages) changePage(currentPage + 1);
    });
}

// Change page
function changePage(page) {
    userInteracted = true;
    currentPage = page;
    renderBlogCards();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Filter by category
document.querySelectorAll('.filter-tag').forEach(tag => {
    tag.addEventListener('click', () => {
        userInteracted = true;
        document.querySelectorAll('.filter-tag').forEach(t => t.classList.remove('active'));
        tag.classList.add('active');
        currentCategory = tag.dataset.category;
        currentPage = 1;
        renderBlogCards();
    });
});

// Search functionality (if search box exists)
const searchInput = document.getElementById('searchInput');
if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        userInteracted = true;
        searchQuery = e.target.value;
        currentPage = 1;
        renderBlogCards();
    });
}

// Navbar scroll handled by inline script in index.html

// ==========================================
// Initialize
// ==========================================

// Fetch JSON data (for filtering/pagination) but do NOT replace static HTML
fetchBlogPosts();

console.log('%c📚 LeadbaseAI Blog Listing Loaded!', 'color: #33B5FF; font-size: 16px; font-weight: bold;');
console.log('%cStatic cards preserved for SEO. JS handles filtering only.', 'color: #64748B; font-size: 12px;');

