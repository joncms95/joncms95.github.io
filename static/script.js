/**
 * Portfolio Website JavaScript
 * Jonathan Chan Mun Shum - Personal Portfolio
 * 
 * This file contains all interactive functionality for the portfolio website
 * including gallery modals, carousel navigation, and UI interactions.
 */

// ============================================================================
// CONFIGURATION
// ============================================================================

const CONFIG = {
    // Gallery settings
    gallery: {
        maxDots: 5,
        dotPattern: {
            bigDots: 3,
            smallDots: 2
        },
        transitionDuration: 300,
        carouselInterval: false,
        modalSize: 'modal-lg',
        modalCentered: true
    },

    // Scroll settings
    scroll: {
        threshold: 300,
        duration: 500
    },

    // Animation settings
    animation: {
        fadeIn: 300,
        fadeOut: 300,
        hover: 200
    }
};

// ============================================================================
// DATA CONFIGURATION
// ============================================================================

const EXPERIENCE_CONFIG = {
    'sem9': {
        name: 'SEM9 Holding Sdn Bhd',
        images: [
            {
                src: 'static/assets/experience/sem9_1.jpg',
                title: 'SEM9 Experience',
                description: 'Professional Player & Administrative Executive'
            },
            {
                src: 'static/assets/experience/sem9_2.jpg',
                title: 'SEM9 Experience',
                description: 'Professional Player & Administrative Executive'
            },
            {
                src: 'static/assets/experience/sem9_3.jpg',
                title: 'SEM9 Experience',
                description: 'Professional Player & Administrative Executive'
            },
            {
                src: 'static/assets/experience/sem9_4.jpg',
                title: 'SEM9 Experience',
                description: 'Professional Player & Administrative Executive'
            }
        ]
    },
    'bjd': {
        name: 'Berjaya Dragons',
        images: [
            {
                src: 'static/assets/experience/bjd_1.png',
                title: 'Berjaya Dragons',
                description: 'Professional Player & Esports Coach'
            },
            {
                src: 'static/assets/experience/bjd_2.jpg',
                title: 'Berjaya Dragons',
                description: 'Professional Player & Esports Coach'
            },
            {
                src: 'static/assets/experience/bjd_3.png',
                title: 'Berjaya Dragons',
                description: 'Professional Player & Esports Coach'
            },
            {
                src: 'static/assets/experience/bjd_4.png',
                title: 'Berjaya Dragons',
                description: 'Professional Player & Esports Coach'
            },
            {
                src: 'static/assets/experience/bjd_5.jpg',
                title: 'Berjaya Dragons',
                description: 'Professional Player & Esports Coach'
            }
        ]
    },
    'fdg': {
        name: 'Fire Dragoon Esports',
        images: [
            {
                src: 'static/assets/experience/fdg_1.jpg',
                title: 'Fire Dragoon Esports',
                description: 'Professional Player'
            },
            {
                src: 'static/assets/experience/fdg_2.jpg',
                title: 'Fire Dragoon Esports',
                description: 'Professional Player'
            },
            {
                src: 'static/assets/experience/fdg_3.jpg',
                title: 'Fire Dragoon Esports',
                description: 'Professional Player'
            }
        ]
    },
    'kpmg': {
        name: 'KPMG',
        images: [
            {
                src: 'static/assets/experience/kpmg.jpg',
                title: 'KPMG',
                description: 'Audit Trainee'
            }
        ]
    }
};

const PROJECT_CONFIG = {
    'mlbb_ban_pick': {
        name: 'MLBB Ban Pick Tool',
        images: [
            {
                src: 'static/assets/projects/mlbb_ban_pick/create.png',
                title: 'Create Page',
                description: 'Draft creation interface for team setup'
            },
            {
                src: 'static/assets/projects/mlbb_ban_pick/links.png',
                title: 'Links Page',
                description: 'Share team and spectator links'
            },
            {
                src: 'static/assets/projects/mlbb_ban_pick/draft.png',
                title: 'Draft Interface',
                description: 'Real-time ban pick simulation'
            }
        ]
    },
    'mortgage_calculator': {
        name: 'Mortgage Calculator',
        images: [
            {
                src: 'static/assets/projects/mortgage_calculator/preview.gif',
                title: 'Streamlit App Preview',
                description: 'Interactive mortgage calculation interface'
            }
        ]
    }
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Safely get element by ID
 * @param {string} id - Element ID
 * @returns {HTMLElement|null} - Element or null if not found
 */
function getElement(id) {
    return document.getElementById(id);
}

/**
 * Safely get elements by selector
 * @param {string} selector - CSS selector
 * @returns {NodeList} - Elements matching selector
 */
function getElements(selector) {
    return document.querySelectorAll(selector);
}

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
        } else {
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
 * Safe function execution with error handling
 * @param {Function} func - Function to execute
 * @param {*} defaultValue - Default value if function fails
 * @returns {*} - Function result or default value
 */
function safeExecute(func, defaultValue = null) {
    try {
        return func();
    } catch (error) {
        console.error('Function execution failed:', error);
        return defaultValue;
    }
}

/**
 * Debounce function for performance optimization
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in ms
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
 * @param {string} title - Modal title
 * @param {Array} images - Array of image objects with src, title, description
 * @param {number} startIndex - Starting image index (default: 0)
 */
function createCarouselModal(modalId, title, images, startIndex = 0) {
    // Validate inputs
    if (!modalId || !title || !Array.isArray(images) || images.length === 0) {
        console.error('Invalid parameters for createCarouselModal');
        return;
    }

    // Remove existing modal if any
    const existingModal = getElement(modalId);
    if (existingModal) {
        existingModal.remove();
    }

    // Create modal HTML
    const modalContent = createModalHTML(modalId, title, images, startIndex);

    // Add modal to body
    document.body.insertAdjacentHTML('beforeend', modalContent);

    // Populate carousel
    populateCarousel(modalId, images, startIndex);

    // Show modal
    const modal = new bootstrap.Modal(getElement(modalId));
    modal.show();

    // Setup carousel functionality
    setupCarouselFunctionality(modalId, images);

    // Clean up modal after it's hidden
    getElement(modalId).addEventListener('hidden.bs.modal', function () {
        this.remove();
    });
}

/**
 * Creates modal HTML structure
 * @param {string} modalId - Modal ID
 * @param {string} title - Modal title
 * @param {Array} images - Images array
 * @param {number} startIndex - Starting index
 * @returns {string} - Modal HTML
 */
function createModalHTML(modalId, title, images, startIndex) {
    return `
        <div class="modal fade" id="${modalId}" tabindex="-1" aria-labelledby="${modalId}Label" aria-hidden="true">
            <div class="modal-dialog ${CONFIG.gallery.modalSize} modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="${modalId}Label">${title}</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div id="${modalId}Carousel" class="carousel slide" data-bs-ride="false" data-bs-interval="${CONFIG.gallery.carouselInterval}">
                            <div class="carousel-indicators" id="${modalId}Indicators">
                                <!-- Indicators will be dynamically generated -->
                            </div>
                            <div class="carousel-inner" id="${modalId}Inner">
                                <!-- Images will be dynamically loaded here -->
                            </div>
                            <div class="carousel-index" id="${modalId}Index">
                                ${createElegantDotPattern(images.length, startIndex)}
                            </div>
                            <button class="carousel-control-prev" type="button" data-bs-target="#${modalId}Carousel" data-bs-slide="prev">
                                <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                                <span class="visually-hidden">Previous</span>
                            </button>
                            <button class="carousel-control-next" type="button" data-bs-target="#${modalId}Carousel" data-bs-slide="next">
                                <span class="carousel-control-next-icon" aria-hidden="true"></span>
                                <span class="visually-hidden">Next</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

/**
 * Populates carousel with images and indicators
 * @param {string} modalId - Modal ID
 * @param {Array} images - Images array
 * @param {number} startIndex - Starting index
 */
function populateCarousel(modalId, images, startIndex) {
    const carouselInner = getElement(`${modalId}Inner`);
    const carouselIndicators = getElement(`${modalId}Indicators`);

    if (!carouselInner || !carouselIndicators) {
        console.error('Carousel elements not found');
        return;
    }

    images.forEach((image, index) => {
        // Create carousel item
        const carouselItem = createCarouselItem(image, index, startIndex);
        carouselInner.appendChild(carouselItem);

        // Create indicator
        const indicator = createCarouselIndicator(modalId, index, startIndex);
        carouselIndicators.appendChild(indicator);
    });
}

/**
 * Creates a carousel item element
 * @param {Object} image - Image object
 * @param {number} index - Image index
 * @param {number} startIndex - Starting index
 * @returns {HTMLElement} - Carousel item element
 */
function createCarouselItem(image, index, startIndex) {
    const carouselItem = createElement('div', {
        className: `carousel-item ${index === startIndex ? 'active' : ''}`
    });

    const img = createElement('img', {
        src: image.src,
        className: 'd-block w-100',
        alt: image.title || 'Gallery image'
    });

    carouselItem.appendChild(img);

    // Add caption if title or description exists
    if (image.title || image.description) {
        const caption = createElement('div', {
            className: 'carousel-caption d-none d-md-block'
        });

        caption.innerHTML = `
            ${image.title ? `<h5>${image.title}</h5>` : ''}
            ${image.description ? `<p>${image.description}</p>` : ''}
        `;

        carouselItem.appendChild(caption);
    }

    return carouselItem;
}

/**
 * Creates a carousel indicator element
 * @param {string} modalId - Modal ID
 * @param {number} index - Indicator index
 * @param {number} startIndex - Starting index
 * @returns {HTMLElement} - Indicator element
 */
function createCarouselIndicator(modalId, index, startIndex) {
    const indicator = createElement('button', {
        type: 'button',
        'data-bs-target': `#${modalId}Carousel`,
        'data-bs-slide-to': index,
        'aria-label': `Slide ${index + 1}`
    });

    if (index === startIndex) {
        indicator.classList.add('active');
        indicator.setAttribute('aria-current', 'true');
    }

    return indicator;
}

/**
 * Sets up carousel functionality and event listeners
 * @param {string} modalId - Modal ID
 * @param {Array} images - Images array
 */
function setupCarouselFunctionality(modalId, images) {
    const carouselElement = getElement(`${modalId}Carousel`);
    const indexElement = getElement(`${modalId}Index`);

    if (!carouselElement || !indexElement) {
        console.error('Carousel elements not found for functionality setup');
        return;
    }

    // Ensure carousel starts at the correct index
    setTimeout(() => {
        const carousel = new bootstrap.Carousel(carouselElement, {
            interval: CONFIG.gallery.carouselInterval
        });
    }, 100);

    // Add carousel slide event listener to update index
    carouselElement.addEventListener('slide.bs.carousel', function (event) {
        const currentIndex = event.to;
        updateElegantDotPattern(indexElement, images.length, currentIndex);
    });
}

// ============================================================================
// DOT PATTERN NAVIGATION
// ============================================================================

/**
 * Creates LINE Design System inspired dot pattern with smart pagination
 * @param {number} totalImages - Total number of images
 * @param {number} currentIndex - Current active index
 * @returns {string} HTML string for dot pattern
 */
function createElegantDotPattern(totalImages, currentIndex) {
    if (totalImages <= CONFIG.gallery.maxDots) {
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
        const className = `carousel-index-dot ${i === currentIndex ? 'active' : 'same-size'}`;
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

    // Add LINE-style numbering
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
    } else if (Math.abs(index - currentIndex) === 1) {
        className += ' adjacent';
    } else {
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
    while (dots.length < CONFIG.gallery.maxDots && totalImages >= CONFIG.gallery.maxDots) {
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
 * Updates the elegant dot pattern when carousel slides
 * @param {HTMLElement} indexElement - The index container element
 * @param {number} totalImages - Total number of images
 * @param {number} currentIndex - Current active index
 */
function updateElegantDotPattern(indexElement, totalImages, currentIndex) {
    if (!indexElement) return;

    indexElement.innerHTML = createElegantDotPattern(totalImages, currentIndex);
}

// ============================================================================
// ENTRY INTERACTIONS
// ============================================================================

/**
 * Sets up hover functionality for entries with images
 * @param {string} selector - CSS selector for entries
 * @param {Object} config - Configuration object (EXPERIENCE_CONFIG or PROJECT_CONFIG)
 * @param {string} type - Entry type ('experience' or 'project')
 */
function setupEntryHover(selector, config, type) {
    const entries = getElements(selector);

    entries.forEach(entry => {
        const key = entry.getAttribute(`data-${type === 'experience' ? 'company' : 'project'}`);
        const entryConfig = config[key];

        if (entryConfig?.images?.length > 0) {
            setupEntryInteractions(entry, entryConfig, type);
        } else {
            removeEntryInteractions(entry, type);
        }
    });
}

/**
 * Sets up click and keyboard interactions for an entry
 * @param {HTMLElement} entry - Entry element
 * @param {Object} entryConfig - Entry configuration
 * @param {string} type - Entry type
 */
function setupEntryInteractions(entry, entryConfig, type) {
    const modalId = `${type}CarouselModal`;
    const title = `${entryConfig.name} - ${type === 'experience' ? 'Experience' : 'Project'} Gallery`;

    // Add click handler
    entry.addEventListener('click', () => {
        createCarouselModal(modalId, title, entryConfig.images);
    });

    // Add keyboard accessibility
    entry.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            createCarouselModal(modalId, title, entryConfig.images);
        }
    });

    // Make entry focusable
    entry.setAttribute('tabindex', '0');
    entry.setAttribute('role', 'button');
    entry.setAttribute('aria-label', `View gallery for ${entryConfig.name}`);
}

/**
 * Removes interactive functionality from an entry
 * @param {HTMLElement} entry - Entry element
 * @param {string} type - Entry type
 */
function removeEntryInteractions(entry, type) {
    entry.classList.remove(`${type}-entry`);
    entry.style.cursor = 'default';
    entry.removeAttribute('tabindex');
    entry.removeAttribute('role');
    entry.removeAttribute('aria-label');
}

// ============================================================================
// GALLERY FUNCTIONALITY
// ============================================================================

/**
 * Sets up gallery filtering functionality
 */
function setupGalleryFiltering() {
    const filterButtons = getElements('.filter-btn');
    const galleryItems = getElements('.gallery-item');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.getAttribute('data-filter');
            filterGalleryItems(filter, filterButtons, galleryItems);
        });
    });
}

/**
 * Filters gallery items based on selected category
 * @param {string} filter - Filter category
 * @param {NodeList} filterButtons - Filter button elements
 * @param {NodeList} galleryItems - Gallery item elements
 */
function filterGalleryItems(filter, filterButtons, galleryItems) {
    // Update active button
    filterButtons.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');

    // Filter gallery items
    galleryItems.forEach(item => {
        const category = item.getAttribute('data-category');

        if (filter === 'all' || category === filter) {
            item.classList.remove('hidden');
            item.classList.add('visible');
        } else {
            item.classList.add('hidden');
            item.classList.remove('visible');
        }
    });
}

/**
 * Sets up gallery item click interactions
 */
function setupGalleryItemInteractions() {
    const galleryItems = getElements('.gallery-item');

    galleryItems.forEach(item => {
        // Add click handler
        item.addEventListener('click', () => {
            openGalleryModal(item, galleryItems);
        });

        // Add keyboard accessibility
        item.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openGalleryModal(item, galleryItems);
            }
        });

        // Make items focusable
        item.setAttribute('tabindex', '0');
        item.setAttribute('role', 'button');

        // Initialize as visible
        item.classList.add('visible');
    });
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
    const galleryImages = visibleItems.map(item => ({
        src: item.querySelector('img').src,
        title: item.querySelector('.gallery-item-overlay h5').textContent,
        description: item.querySelector('.gallery-item-overlay p').textContent
    }));

    createCarouselModal('galleryImageModal', 'Gallery', galleryImages, currentIndex);
}

// ============================================================================
// SCROLL TO TOP FUNCTIONALITY
// ============================================================================

/**
 * Sets up scroll to top button functionality
 */
function setupScrollToTop() {
    const scrollToTopBtn = getElement('scrollToTopBtn');

    if (!scrollToTopBtn) return;

    // Debounced scroll handler for performance
    const debouncedScrollHandler = debounce(() => {
        if (window.pageYOffset > CONFIG.scroll.threshold) {
            scrollToTopBtn.classList.add('show');
        } else {
            scrollToTopBtn.classList.remove('show');
        }
    }, 100);

    window.addEventListener('scroll', debouncedScrollHandler);

    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ============================================================================
// CERTIFICATE MODAL
// ============================================================================

/**
 * Opens the certificate modal
 */
function openCertificateModal() {
    const modalContent = `
        <div class="modal fade" id="certificateModal" tabindex="-1" aria-labelledby="certificateModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-lg modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="certificateModalLabel">CS50 Certificate</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body text-center">
                        <img src="static/assets/education/cs50.png" alt="CS50 Certificate" class="img-fluid" style="max-height: 500px;">
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

    // Remove existing modal if any
    const existingModal = getElement('certificateModal');
    if (existingModal) {
        existingModal.remove();
    }

    // Add new modal to body
    document.body.insertAdjacentHTML('beforeend', modalContent);

    // Show modal
    const modal = new bootstrap.Modal(getElement('certificateModal'));
    modal.show();

    // Clean up modal after it's hidden
    getElement('certificateModal').addEventListener('hidden.bs.modal', function () {
        this.remove();
    });
}

// ============================================================================
// MAIN INITIALIZATION
// ============================================================================

/**
 * Main initialization function
 */
function initializePortfolio() {
    // Setup scroll to top functionality
    setupScrollToTop();

    // Setup experience entries
    setupEntryHover('.experience-entry', EXPERIENCE_CONFIG, 'experience');

    // Setup project entries
    setupEntryHover('.project-entry', PROJECT_CONFIG, 'project');

    // Setup gallery functionality
    setupGalleryFiltering();
    setupGalleryItemInteractions();
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initializePortfolio);

// Make functions available globally for HTML onclick handlers
window.openCertificateModal = openCertificateModal;