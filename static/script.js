// ============================================================================
// GALLERY CONFIGURATION
// ============================================================================

// Experience Gallery Configuration
const experienceConfig = {
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

// Project Gallery Configuration
const projectConfig = {
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
 * Creates a standardized carousel modal
 * @param {string} modalId - Unique ID for the modal
 * @param {string} title - Modal title
 * @param {Array} images - Array of image objects with src, title, description
 * @param {number} startIndex - Starting image index (default: 0)
 */
function createCarouselModal(modalId, title, images, startIndex = 0) {
    // Remove existing modal if any
    const existingModal = document.getElementById(modalId);
    if (existingModal) {
        existingModal.remove();
    }

    // Create modal HTML
    const modalContent = `
        <div class="modal fade" id="${modalId}" tabindex="-1" aria-labelledby="${modalId}Label" aria-hidden="true">
            <div class="modal-dialog modal-lg modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="${modalId}Label">${title}</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div id="${modalId}Carousel" class="carousel slide" data-bs-ride="false" data-bs-interval="false">
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

    // Add modal to body
    document.body.insertAdjacentHTML('beforeend', modalContent);

    // Populate carousel
    const carouselInner = document.getElementById(`${modalId}Inner`);
    const carouselIndicators = document.getElementById(`${modalId}Indicators`);

    images.forEach((image, index) => {
        // Create carousel item
        const carouselItem = document.createElement('div');
        carouselItem.className = `carousel-item ${index === startIndex ? 'active' : ''}`;
        
        const img = document.createElement('img');
        img.src = image.src;
        img.className = 'd-block w-100';
        img.alt = image.title;
        
        carouselItem.appendChild(img);

        // Add caption if title or description exists
        if (image.title || image.description) {
            const caption = document.createElement('div');
            caption.className = 'carousel-caption d-none d-md-block';
            caption.innerHTML = `
                ${image.title ? `<h5>${image.title}</h5>` : ''}
                ${image.description ? `<p>${image.description}</p>` : ''}
            `;
            carouselItem.appendChild(caption);
        }

        carouselInner.appendChild(carouselItem);

        // Create indicator
        const indicator = document.createElement('button');
        indicator.type = 'button';
        indicator.setAttribute('data-bs-target', `#${modalId}Carousel`);
        indicator.setAttribute('data-bs-slide-to', index);
        indicator.setAttribute('aria-label', `Slide ${index + 1}`);
        if (index === startIndex) {
            indicator.classList.add('active');
            indicator.setAttribute('aria-current', 'true');
        }
        carouselIndicators.appendChild(indicator);
    });

    // Show modal
    const modal = new bootstrap.Modal(document.getElementById(modalId));
    modal.show();

    // Add carousel slide event listener to update index
    const carouselElement = document.getElementById(`${modalId}Carousel`);
    const indexElement = document.getElementById(`${modalId}Index`);
    
    // Ensure carousel starts at the correct index
    // Use setTimeout to ensure the modal is fully rendered before setting the slide
    setTimeout(() => {
        const carousel = new bootstrap.Carousel(carouselElement, {
            interval: false
        });
        if (startIndex > 0) {
            carousel.to(startIndex);
        }
    }, 100);
    
    carouselElement.addEventListener('slide.bs.carousel', function(event) {
        const currentIndex = event.to;
        updateElegantDotPattern(indexElement, images.length, currentIndex);
    });

    // Clean up modal after it's hidden
    document.getElementById(modalId).addEventListener('hidden.bs.modal', function() {
        this.remove();
    });
}

/**
 * Creates LINE Design System inspired dot pattern with smart pagination
 * @param {number} totalImages - Total number of images
 * @param {number} currentIndex - Current active index
 * @returns {string} HTML string for dot pattern
 */
function createElegantDotPattern(totalImages, currentIndex) {
    const maxDots = 5; // LINE uses 5 dots maximum for clean look
    
    if (totalImages <= 5) {
        // If total images is 5 or less, show all dots with same size
        const dots = Array.from({length: totalImages}, (_, i) => {
            let className = 'carousel-index-dot';
            
            if (i === currentIndex) {
                className += ' active';
            } else {
                className += ' same-size'; // Same size for all non-active dots
            }
            
            return `<div class="${className}" data-index="${i}"></div>`;
        }).join('');
        
        // Add LINE-style numbering
        const numbering = `<div class="carousel-index-number">${currentIndex + 1}/${totalImages}</div>`;
        
        return dots + numbering;
    }
    
    // For more than 5 images, implement the sliding 5-dot pattern
    let dots = [];
    
    // Calculate the range of dots to show based on current position
    let startIndex, endIndex;
    
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
        let className = 'carousel-index-dot';
        
        if (i === currentIndex) {
            className += ' active';
        } else if (Math.abs(i - currentIndex) === 1) {
            className += ' adjacent';
        } else {
            className += ' far';
        }
        
        dots.push(`<div class="${className}" data-index="${i}"></div>`);
    }
    
    // Ensure we have exactly 5 dots
    while (dots.length < 5 && totalImages >= 5) {
        if (startIndex > 0) {
            // Add dots from the beginning
            startIndex--;
            const className = startIndex === currentIndex ? 'active' : 
                            (Math.abs(startIndex - currentIndex) === 1 ? 'adjacent' : 'far');
            dots.unshift(`<div class="carousel-index-dot ${className}" data-index="${startIndex}"></div>`);
        } else if (endIndex < totalImages - 1) {
            // Add dots from the end
            endIndex++;
            const className = endIndex === currentIndex ? 'active' : 
                            (Math.abs(endIndex - currentIndex) === 1 ? 'adjacent' : 'far');
            dots.push(`<div class="carousel-index-dot ${className}" data-index="${endIndex}"></div>`);
        } else {
            break;
        }
    }
    
    // Add LINE-style numbering
    const numbering = `<div class="carousel-index-number">${currentIndex + 1}/${totalImages}</div>`;
    
    return dots.join('') + numbering;
}

/**
 * Updates the elegant dot pattern when carousel slides
 * @param {HTMLElement} indexElement - The index container element
 * @param {number} totalImages - Total number of images
 * @param {number} currentIndex - Current active index
 */
function updateElegantDotPattern(indexElement, totalImages, currentIndex) {
    indexElement.innerHTML = createElegantDotPattern(totalImages, currentIndex);
}

/**
 * Sets up hover functionality for entries with images
 * @param {string} selector - CSS selector for entries
 * @param {Object} config - Configuration object (experienceConfig or projectConfig)
 * @param {string} type - Entry type ('experience' or 'project')
 */
function setupEntryHover(selector, config, type) {
    const entries = document.querySelectorAll(selector);
    
    entries.forEach(entry => {
        const key = entry.getAttribute(`data-${type === 'experience' ? 'company' : 'project'}`);
        const entryConfig = config[key];

        if (entryConfig && entryConfig.images && entryConfig.images.length > 0) {
            // Add click handler
            entry.addEventListener('click', function() {
                const modalId = `${type}CarouselModal`;
                const title = `${entryConfig.name} - ${type === 'experience' ? 'Experience' : 'Project'} Gallery`;
                createCarouselModal(modalId, title, entryConfig.images);
            });

            // Add keyboard accessibility
            entry.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    const modalId = `${type}CarouselModal`;
                    const title = `${entryConfig.name} - ${type === 'experience' ? 'Experience' : 'Project'} Gallery`;
                    createCarouselModal(modalId, title, entryConfig.images);
                }
            });

            // Make entry focusable
            entry.setAttribute('tabindex', '0');
            entry.setAttribute('role', 'button');
            entry.setAttribute('aria-label', `View gallery for ${entryConfig.name}`);
        } else {
            // Remove hover effect for entries without images
            entry.classList.remove(`${type}-entry`);
            entry.style.cursor = 'default';
        }
    });
}

// ============================================================================
// MAIN INITIALIZATION
// ============================================================================

document.addEventListener('DOMContentLoaded', function() {
    // Scroll to Top Button
    const scrollToTopBtn = document.getElementById('scrollToTopBtn');
    
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            scrollToTopBtn.classList.add('show');
        } else {
            scrollToTopBtn.classList.remove('show');
        }
    });
    
    scrollToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Setup Experience Entries
    setupEntryHover('.experience-entry', experienceConfig, 'experience');

    // Setup Project Entries
    setupEntryHover('.project-entry', projectConfig, 'project');

    // Gallery Functionality
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');

    // Filter functionality
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
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
        });
    });

    // Gallery item click to open modal
    galleryItems.forEach(item => {
        item.addEventListener('click', function() {
            const img = this.querySelector('img');
            const title = this.querySelector('.gallery-item-overlay h5').textContent;
            const description = this.querySelector('.gallery-item-overlay p').textContent;
            
            // Get all visible items for navigation
            const visibleItems = Array.from(galleryItems).filter(item => 
                !item.classList.contains('hidden')
            );
            const currentIndex = visibleItems.indexOf(this);
            
            // Create gallery modal
            const galleryImages = visibleItems.map(item => ({
                src: item.querySelector('img').src,
                title: item.querySelector('.gallery-item-overlay h5').textContent,
                description: item.querySelector('.gallery-item-overlay p').textContent
            }));
            
            createCarouselModal('galleryImageModal', 'Gallery', galleryImages, currentIndex);
        });

        // Add keyboard accessibility
        item.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const visibleItems = Array.from(galleryItems).filter(item => 
                    !item.classList.contains('hidden')
                );
                const currentIndex = visibleItems.indexOf(this);
                
                const galleryImages = visibleItems.map(item => ({
                    src: item.querySelector('img').src,
                    title: item.querySelector('.gallery-item-overlay h5').textContent,
                    description: item.querySelector('.gallery-item-overlay p').textContent
                }));
                
                createCarouselModal('galleryImageModal', 'Gallery', galleryImages, currentIndex);
            }
        });

        // Make items focusable
        item.setAttribute('tabindex', '0');
        item.setAttribute('role', 'button');
    });

    // Initialize gallery items as visible
    galleryItems.forEach(item => {
        item.classList.add('visible');
    });
});

// ============================================================================
// CERTIFICATE MODAL
// ============================================================================

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
    const existingModal = document.getElementById('certificateModal');
        if (existingModal) {
            existingModal.remove();
        }

        // Add new modal to body
        document.body.insertAdjacentHTML('beforeend', modalContent);

        // Show modal
    const modal = new bootstrap.Modal(document.getElementById('certificateModal'));
        modal.show();

        // Clean up modal after it's hidden
    document.getElementById('certificateModal').addEventListener('hidden.bs.modal', function() {
            this.remove();
        });
    }