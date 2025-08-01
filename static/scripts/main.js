/**
 * Portfolio Website
 * 
 * This file contains all interactive functionality for the portfolio website.
 * Configuration is loaded from config.js
 * 
 */

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Create element with attributes
 * @param {string} tag - HTML tag name
 * @param {Object} attributes - Element attributes
 * @param {string} content - Element content
 * @returns {HTMLElement} - Created element
 */
function createElement(tag, attributes = {}, content = '') {
    const element = document.createElement(tag);

    // Set attributes
    Object.entries(attributes).forEach(([key, value]) => {
        if (key === 'className') {
            element.className = value;
        } else if (value !== undefined) {
            element.setAttribute(key, value);
        }
    });

    // Set content
    if (content) {
        element.innerHTML = content;
    }

    return element;
}

/**
 * Debounce function to limit the rate at which a function can fire
 * @param {Function} func - Function to debounce
 * @param {number} wait - Time to wait in milliseconds
 * @returns {Function} - Debounced function
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ============================================================================
// CAROUSEL MODAL MANAGEMENT
// ============================================================================

/**
 * Creates a standardized carousel modal
 * @param {string} modalId - Unique ID for the modal
 * @param {Array} images - Array of image objects with src, title, description
 * @param {number} startIndex - Starting image index (default: 0)
 */
function createCarouselModal(modalId, images, startIndex = 0) {
    // Create modal HTML
    const modalContent = createModalHTML(modalId, images, startIndex);

    // Add modal to body
    document.body.insertAdjacentHTML('beforeend', modalContent);

    // Populate carousel
    populateCarousel(modalId, images, startIndex);

    // Get modal element and show it
    const modalElement = document.getElementById(modalId);
    const modal = new bootstrap.Modal(modalElement);
    modal.show();

    // Setup carousel functionality after modal is shown
    modalElement.addEventListener('shown.bs.modal', function () {
        setupCarouselFunctionality(modalId, images);
    });

    // Clean up modal after it's hidden
    modalElement.addEventListener('hidden.bs.modal', function () {
        this.remove();
    });
}

/**
 * Creates modal HTML structure
 * @param {string} modalId - Modal ID
 * @param {Array} images - Images array
 * @param {number} startIndex - Starting index
 * @returns {string} - Modal HTML
 */
function createModalHTML(modalId, images, startIndex) {
    const showNavigation = images.length > 1;

    return `
        <div class="modal fade" id="${modalId}" tabindex="-1" aria-labelledby="${modalId}Label" aria-hidden="true">
            <div class="modal-dialog modal-xl modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-body">
                        <div id="${modalId}Carousel" class="carousel slide" tabindex="0" data-bs-ride="carousel">
                            <div class="carousel-inner" id="${modalId}Inner"></div>
                            ${showNavigation ? `<div class="carousel-index" id="${modalId}Index">
                                ${createDotPattern(images.length, startIndex)}
                            </div>` : ''}
                            ${showNavigation ? `<button class="carousel-control-prev" type="button" data-bs-target="#${modalId}Carousel" data-bs-slide="prev">
                                <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                                <span class="visually-hidden">Previous</span>
                            </button>
                            <button class="carousel-control-next" type="button" data-bs-target="#${modalId}Carousel" data-bs-slide="next">
                                <span class="carousel-control-next-icon" aria-hidden="true"></span>
                                <span class="visually-hidden">Next</span>
                            </button>` : ''}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

/**
 * Populates carousel with images
 * @param {string} modalId - Modal ID
 * @param {Array} images - Images array
 * @param {number} startIndex - Starting index
 */
function populateCarousel(modalId, images, startIndex) {
    const carouselInner = document.getElementById(`${modalId}Inner`);

    images.forEach((image, index) => {
        // Create carousel item
        const carouselItem = createCarouselItem(image, index, startIndex);
        carouselInner.appendChild(carouselItem);
    });
}

/**
 * Creates a carousel item element
 * @param {Object} image - Image or video object
 * @param {number} index - Image index
 * @param {number} startIndex - Starting index
 * @returns {HTMLElement} - Carousel item element
 */
function createCarouselItem(image, index, startIndex) {
    const carouselItem = createElement('div', {
        className: `carousel-item ${index === startIndex ? 'active' : ''}`
    });

    // Check if this is a video
    if (image.type === 'video' || image.src.endsWith('.mp4')) {
        const video = createElement('video', {
            className: 'd-block w-100',
            muted: true,
            loop: true,
            playsinline: true,
            preload: 'metadata',
            poster: image.poster,
        });

        const source = createElement('source', {
            src: image.src,
            type: 'video/mp4'
        });

        video.appendChild(source);
        carouselItem.appendChild(video);
    } else {
        // Handle as image
        const img = createElement('img', {
            src: image.src,
            className: 'd-block w-100',
            alt: image.title || 'Gallery Image'
        });

        carouselItem.appendChild(img);
    }

    // Add caption if title or description exists
    if (image.title || image.description) {
        const caption = createElement('div', {
            className: 'carousel-caption'
        });

        caption.innerHTML = `
            ${image.title ? `<h4>${image.title}</h4>` : ''}
            ${image.description ? `<p>${image.description}</p>` : ''}
        `;

        carouselItem.appendChild(caption);
    }

    return carouselItem;
}

/**
 * Sets up carousel functionality and event listeners
 * @param {string} modalId - Modal ID
 * @param {Array} images - Images array
 */
function setupCarouselFunctionality(modalId, images) {
    const carouselElement = document.getElementById(`${modalId}Carousel`);
    const indexElement = document.getElementById(`${modalId}Index`);

    if (images.length > 1) {
        const carousel = new bootstrap.Carousel(carouselElement, {
            interval: CONFIG.carousel.interval,
            pause: false
        });

        if (indexElement) {
            carouselElement.addEventListener('slide.bs.carousel', function (event) {
                updateDotPattern(indexElement, images.length, event.to);
            });
        }

        // Handle video playback on carousel slide
        carouselElement.addEventListener('slide.bs.carousel', function (event) {
            handleVideoPlayback(carouselElement, event.from, event.to);
        });
    }

    // Handle initial video on modal open
    setTimeout(() => {
        const activeItem = carouselElement.querySelector('.carousel-item.active');
        if (activeItem) {
            const video = activeItem.querySelector('video');
            if (video) {
                video.play()
            }
        }
    }, 500);

    // Focus the carousel element for immediate keyboard access
    carouselElement.focus();
}

/**
 * Handles video playback when carousel slides
 * @param {HTMLElement} carouselElement - Carousel element
 * @param {number} fromIndex - Previous slide index
 * @param {number} toIndex - New slide index
 */
function handleVideoPlayback(carouselElement, fromIndex, toIndex) {
    const carouselItems = carouselElement.querySelectorAll('.carousel-item');

    // Pause all videos when sliding
    carouselItems.forEach((item, index) => {
        const video = item.querySelector('video');
        if (video) {
            video.pause();
            video.currentTime = 0;
        }
    });

    // Auto-play video on the new active slide if it exists
    const activeItem = carouselItems[toIndex];
    if (activeItem) {
        const video = activeItem.querySelector('video');
        if (video) {
            // Use requestAnimationFrame for smoother timing
            requestAnimationFrame(() => {
                video.play()
            });
        }
    }
}

// ============================================================================
// DOT PATTERN NAVIGATION
// ============================================================================

/**
 * Creates dot pattern with smart pagination
 * @param {number} totalImages - Total number of images
 * @param {number} currentIndex - Current active index
 * @returns {string} HTML string for dot pattern
 */
function createDotPattern(totalImages, currentIndex) {
    if (totalImages <= CONFIG.carousel.maxDots) {
        return createSimpleDotPattern(totalImages, currentIndex);
    }

    return createSlidingDotPattern(totalImages, currentIndex);
}

/**
 * Creates simple dot pattern for 5 or fewer images
 * @param {number} totalImages - Total number of images
 * @param {number} currentIndex - Current active index
 * @returns {string} HTML string for dot pattern
 */
function createSimpleDotPattern(totalImages, currentIndex) {
    const dots = Array.from({ length: totalImages }, (_, i) => {
        const className = `carousel-index-dot ${i === currentIndex ? 'active' : ''}`;
        return `<div class="${className}" data-index="${i}"></div>`;
    }).join('');

    const numbering = `<div class="carousel-index-number">${currentIndex + 1}/${totalImages}</div>`;

    return dots + numbering;
}

/**
 * Creates sliding dot pattern for more than 5 images
 * @param {number} totalImages - Total number of images
 * @param {number} currentIndex - Current active index
 * @returns {string} HTML string for dot pattern
 */
function createSlidingDotPattern(totalImages, currentIndex) {
    let dots = [];
    let startIndex, endIndex;

    // Calculate the range of dots to show based on current position
    if (currentIndex <= 1) {
        // Near start: show first 5 dots
        startIndex = 0;
        endIndex = Math.min(4, totalImages - 1);
    } else if (currentIndex >= totalImages - 2) {
        // Near end: show last 5 dots
        startIndex = Math.max(0, totalImages - 5);
        endIndex = totalImages - 1;
    } else {
        // In middle: show 2 dots before current, current, and 2 dots after
        startIndex = Math.max(0, currentIndex - 2);
        endIndex = Math.min(totalImages - 1, currentIndex + 2);
    }

    // Create the 5-dot pattern
    for (let i = startIndex; i <= endIndex; i++) {
        const className = getDotClassName(i, currentIndex);
        dots.push(`<div class="${className}" data-index="${i}"></div>`);
    }

    // Ensure we have exactly 5 dots
    dots = ensureFiveDots(dots, startIndex, endIndex, currentIndex, totalImages);

    // Add numbering
    const numbering = `<div class="carousel-index-number">${currentIndex + 1}/${totalImages}</div>`;

    return dots.join('') + numbering;
}

/**
 * Gets the appropriate CSS class for a dot based on its position
 * @param {number} index - Dot index
 * @param {number} currentIndex - Current active index
 * @returns {string} - CSS class name
 */
function getDotClassName(index, currentIndex) {
    let className = 'carousel-index-dot';

    if (index === currentIndex) {
        className += ' active';
    } else if (Math.abs(index - currentIndex) > 1) {
        className += ' far';
    }

    return className;
}

/**
 * Ensures exactly 5 dots are present in the pattern
 * @param {Array} dots - Current dots array
 * @param {number} startIndex - Start index
 * @param {number} endIndex - End index
 * @param {number} currentIndex - Current active index
 * @param {number} totalImages - Total number of images
 * @returns {Array} - Updated dots array
 */
function ensureFiveDots(dots, startIndex, endIndex, currentIndex, totalImages) {
    while (dots.length < CONFIG.carousel.maxDots && totalImages >= CONFIG.carousel.maxDots) {
        if (startIndex > 0) {
            // Add dots from the beginning
            startIndex--;
            const className = getDotClassName(startIndex, currentIndex);
            dots.unshift(`<div class="carousel-index-dot ${className}" data-index="${startIndex}"></div>`);
        } else if (endIndex < totalImages - 1) {
            // Add dots from the end
            endIndex++;
            const className = getDotClassName(endIndex, currentIndex);
            dots.push(`<div class="carousel-index-dot ${className}" data-index="${endIndex}"></div>`);
        } else {
            break;
        }
    }

    return dots;
}

/**
 * Updates the dot pattern when carousel slides
 * @param {HTMLElement} indexElement - The index container element
 * @param {number} totalImages - Total number of images
 * @param {number} currentIndex - Current active index
 */
function updateDotPattern(indexElement, totalImages, currentIndex) {
    indexElement.innerHTML = createDotPattern(totalImages, currentIndex);
}

// ============================================================================
// ENTRY INTERACTIONS
// ============================================================================

/**
 * Sets up hover functionality for entries with images
 * @param {string} selector - CSS selector for entries
 * @param {Object} config - Configuration object (EXPERIENCE_CONFIG or PROJECT_CONFIG)
 * @param {string} type - Entry type ('company' or 'project')
 */
function setupEntryHover(selector, config, type) {
    const entries = document.querySelectorAll(selector);

    entries.forEach(entry => {
        const key = entry.getAttribute(`data-${type}`);
        const entryConfig = config[key];

        setupEntryInteractions(entry, entryConfig, type);
    });
}

/**
 * Sets up click interactions for an entry
 * @param {HTMLElement} entry - Entry element
 * @param {Object} entryConfig - Entry configuration
 * @param {string} type - Entry type
 */
function setupEntryInteractions(entry, entryConfig, type) {
    const modalId = `${type}CarouselModal`;

    // Add click handler
    entry.addEventListener('click', () => {
        createCarouselModal(modalId, entryConfig.images);
    });

    // Prevent carousel trigger on external links and achievement links
    const externalLinks = entry.querySelectorAll('a[target="_blank"]');
    externalLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    });
}

// ============================================================================
// GALLERY FUNCTIONALITY
// ============================================================================

/**
 * Generates gallery items from configuration
 * @param {Object} config - Configuration object (EXPERIENCE_CONFIG or PROJECT_CONFIG)
 * @param {string} type - Gallery type ('experience' or 'projects')
 */
function generateGalleryItems(config, type) {
    const galleryGrid = document.getElementById(`${type}-gallery-grid`);

    if (!galleryGrid) return;

    // Clear existing content
    galleryGrid.innerHTML = '';

    // Generate gallery items for each entry in config
    Object.entries(config).forEach(([key, entryConfig]) => {
        if (entryConfig.images && entryConfig.images.length > 0) {
            entryConfig.images.forEach((image, index) => {
                const galleryItem = createGalleryItem(image, entryConfig, type, key, index);
                galleryGrid.appendChild(galleryItem);
            });
        }
    });
}

/**
 * Creates a gallery item element
 * @param {Object} image - Image configuration
 * @param {Object} entryConfig - Entry configuration
 * @param {string} type - Gallery type
 * @param {string} key - Entry key
 * @param {number} index - Image index
 * @returns {HTMLElement} - Gallery item element
 */
function createGalleryItem(image, entryConfig, type, key, index) {
    const galleryItem = createElement('div', {
        className: 'gallery-item visible',
        'data-category': type === 'experience' ? 'experience' : 'projects',
        'data-company': type === 'experience' ? key : undefined,
        'data-project': type === 'projects' ? key : undefined,
    });

    // Check if this is a video
    if (image.type === 'video' || image.src.endsWith('.mp4')) {
        // Create a video element that uses the same styling as images
        const video = createElement('video', {
            src: image.src,
            alt: image.title || `${entryConfig.name} - ${index + 1}`,
            muted: true,
            poster: image.poster
        });
        galleryItem.appendChild(video);
    } else {
        // Handle as image
        const img = createElement('img', {
            src: image.src,
            alt: image.title || `${entryConfig.name} - ${index + 1}`,
        });
        galleryItem.appendChild(img);
    }

    const overlay = createElement('div', {
        className: 'gallery-item-overlay'
    });

    const title = createElement('h4', {}, entryConfig.name);
    const description = createElement('p', {}, image.description || entryConfig.name);

    overlay.appendChild(title);
    overlay.appendChild(description);
    galleryItem.appendChild(overlay);

    return galleryItem;
}

// ============================================================================
// GALLERY FILTER STATE MANAGEMENT
// ============================================================================

// Global filter state
const GALLERY_FILTER_STATE = {
    mainFilter: 'all',
    companyFilter: 'all',
    projectFilter: 'all'
};

/**
 * Sets up gallery filtering functionality
 */
function setupGalleryFiltering() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const companyFilterButtons = document.querySelectorAll('#company-filters .inner-filter-btn');
    const projectFilterButtons = document.querySelectorAll('#project-filters .inner-filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');

    // Setup filter button handlers
    const setupFilterHandler = (buttons, filterType, attributeName) => {
        buttons.forEach(button => {
            button.addEventListener('click', () => {
                const value = button.getAttribute(attributeName);
                const isActive = button.classList.contains('active');

                if (isActive) {
                    // If already active, deselect it (show all)
                    button.classList.remove('active');
                    GALLERY_FILTER_STATE[filterType] = 'all';
                } else {
                    // Select this filter
                    buttons.forEach(btn => btn.classList.remove('active'));
                    button.classList.add('active');
                    GALLERY_FILTER_STATE[filterType] = value;
                }

                // Apply all filters
                applyAllFilters(galleryItems);
            });
        });
    };

    // Main filter buttons (All, Experience, Projects)
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.getAttribute('data-filter');
            const isActive = button.classList.contains('active');

            if (isActive && filter !== 'all') {
                // Remove active from all, set only All as active
                filterButtons.forEach(btn => btn.classList.remove('active'));
                const allBtn = Array.from(filterButtons).find(btn => btn.getAttribute('data-filter') === 'all');
                if (allBtn) allBtn.classList.add('active');
                GALLERY_FILTER_STATE.mainFilter = 'all';
            } else {
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                GALLERY_FILTER_STATE.mainFilter = filter;
            }

            // Apply all filters
            applyAllFilters(galleryItems);
        });
    });

    // Setup inner filter handlers
    setupFilterHandler(companyFilterButtons, 'companyFilter', 'data-company');
    setupFilterHandler(projectFilterButtons, 'projectFilter', 'data-project');
}

/**
 * Applies all filters together based on current filter state
 * @param {NodeList} galleryItems - Gallery item elements
 */
function applyAllFilters(galleryItems) {
    const { mainFilter, companyFilter, projectFilter } = GALLERY_FILTER_STATE;

    galleryItems.forEach(item => {
        const category = item.getAttribute('data-category');
        const itemCompany = item.getAttribute('data-company');
        const itemProject = item.getAttribute('data-project');

        // Check main filter first
        if (mainFilter !== 'all' && category !== mainFilter) {
            item.classList.add('hidden');
            item.classList.remove('visible');
            return;
        }

        // Check specific filters
        const shouldHide =
            (category === 'experience' && companyFilter !== 'all' && itemCompany !== companyFilter) ||
            (category === 'projects' && projectFilter !== 'all' && itemProject !== projectFilter);

        if (shouldHide) {
            item.classList.add('hidden');
            item.classList.remove('visible');
        } else {
            item.classList.remove('hidden');
            item.classList.add('visible');
        }
    });

    // Handle section headers visibility
    handleSectionHeadersVisibility(mainFilter);
}

/**
 * Handles the visibility of gallery section headers based on filter
 * @param {string} filter - Current filter
 */
function handleSectionHeadersVisibility(filter) {
    const experienceSection = document.querySelector('#experience-gallery-grid')?.closest('.gallery-section');
    const projectsSection = document.querySelector('#projects-gallery-grid')?.closest('.gallery-section');

    if (filter === 'all') {
        // Show all sections when "All" is selected
        if (experienceSection) experienceSection.style.display = 'block';
        if (projectsSection) projectsSection.style.display = 'block';
        return;
    }

    // Check if experience section has visible items
    if (experienceSection) {
        const experienceItems = experienceSection.querySelectorAll('.gallery-item');
        const hasVisibleExperienceItems = Array.from(experienceItems).some(item =>
            !item.classList.contains('hidden')
        );
        experienceSection.style.display = hasVisibleExperienceItems ? 'block' : 'none';
    }

    // Check if projects section has visible items
    if (projectsSection) {
        const projectsItems = projectsSection.querySelectorAll('.gallery-item');
        const hasVisibleProjectsItems = Array.from(projectsItems).some(item =>
            !item.classList.contains('hidden')
        );
        projectsSection.style.display = hasVisibleProjectsItems ? 'block' : 'none';
    }
}

/**
 * Sets up gallery item click interactions
 */
function setupGalleryItemInteractions() {
    const galleryItems = document.querySelectorAll('.gallery-item');

    const setupItemInteraction = (item) => {
        // Add click handler
        item.addEventListener('click', () => {
            openGalleryModal(item, galleryItems);
        });

        // Initialize as visible
        item.classList.add('visible');
    };

    galleryItems.forEach(setupItemInteraction);
}

/**
 * Opens gallery modal for clicked item
 * @param {HTMLElement} clickedItem - Clicked gallery item
 * @param {NodeList} allItems - All gallery items
 */
function openGalleryModal(clickedItem, allItems) {
    // Get all visible items for navigation
    const visibleItems = Array.from(allItems).filter(item =>
        !item.classList.contains('hidden')
    );
    const currentIndex = visibleItems.indexOf(clickedItem);

    // Create gallery modal
    const galleryImages = visibleItems.map(item => {
        // Check if it's a video or image
        const img = item.querySelector('img');
        const video = item.querySelector('video');

        let src, type;
        if (video) {
            src = video.src;
            type = 'video';
        } else if (img) {
            src = img.src;
            type = 'image';
        } else {
            src = '';
            type = 'image';
        }

        return {
            src: src,
            title: item.querySelector('.gallery-item-overlay h4').textContent,
            description: item.querySelector('.gallery-item-overlay p').textContent,
            type: type
        };
    });

    createCarouselModal('galleryImageModal', galleryImages, currentIndex);
}

// ============================================================================
// CERTIFICATE MODAL
// ============================================================================

/**
 * Sets up the certificate modal during initialization
 */
function setupCertificateModal() {
    const modalContent = `
        <div class="modal fade" id="certificateModal" tabindex="-1" aria-labelledby="certificateModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-lg modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-body text-center carousel-item active">
                        <img src="static/assets/education/cs50.png" alt="CS50 Certificate" class="d-block w-100">
                        <div class="mt-3">
                            <a href="https://cs50.harvard.edu/certificates/ddcd40ec-a2a7-4c48-b3a5-8fd3ae58a3b4" 
                               target="_blank" class="btn btn-primary">
                                <i class="fa fa-external-link"></i> View Official Certificate
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Add modal to body
    document.body.insertAdjacentHTML('beforeend', modalContent);
}

/**
 * Opens the certificate modal
 */
function openCertificateModal() {
    const modal = new bootstrap.Modal(document.getElementById('certificateModal'));
    modal.show();
}

// ============================================================================
// SCROLL TO TOP FUNCTIONALITY
// ============================================================================

/**
 * Sets up scroll to top button functionality
 */
function setupScrollToTop() {
    const scrollToTopBtn = document.getElementById('scrollToTopBtn');

    // Debounced scroll handler
    const debouncedScrollHandler = debounce(() => {
        if (window.pageYOffset > 300) {
            scrollToTopBtn.classList.add('show');
        } else {
            scrollToTopBtn.classList.remove('show');
        }
    }, 100); // 100ms debounce delay

    // Scroll handler
    window.addEventListener('scroll', debouncedScrollHandler);

    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ============================================================================
// MAIN INITIALIZATION
// ============================================================================

/**
 * Main initialization function
 */
function initializePortfolio() {
    // Setup entries
    setupEntryHover('.entry[data-company]', EXPERIENCE_CONFIG, 'company');
    setupEntryHover('.entry[data-project]', PROJECT_CONFIG, 'project');

    // Generate and populate galleries
    generateGalleryItems(EXPERIENCE_CONFIG, 'experience');
    generateGalleryItems(PROJECT_CONFIG, 'projects');

    // Setup gallery functionality
    setupGalleryFiltering();
    setupGalleryItemInteractions();

    // Setup certificate modal
    setupCertificateModal();

    // Setup scroll to top functionality
    setupScrollToTop();
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initializePortfolio);
