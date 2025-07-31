/**
 * Portfolio Website Configuration
 * 
 * This file contains all configuration data for the portfolio website.
 * 
 */

// ============================================================================
// GENERAL CONFIGURATION
// ============================================================================

const CONFIG = {
    carousel: {
        maxDots: 5,
        interval: 15000,
    },
};

// ============================================================================
// GALLERY CONFIGURATION
// ============================================================================

const EXPERIENCE_CONFIG = {
    'sem9': {
        name: 'SEM9',
        images: [
            {
                src: 'static/assets/experience/sem9_1.jpg',
                title: 'SEM9',
                description: 'SEA Games Hanoi'
            },
            {
                src: 'static/assets/experience/sem9_2.jpg',
                title: 'SEM9',
                description: 'Group Stage game win against Team Phillipines'
            },
            {
                src: 'static/assets/experience/sem9_3.jpg',
                title: 'SEM9',
                description: 'Departure to Hanoi for SEA Games'
            },
            {
                src: 'static/assets/experience/sem9_4.jpg',
                title: 'SEM9',
                description: 'SEM9 Office in Petaling Jaya'
            }
        ]
    },
    'bjd': {
        name: 'Berjaya Dragons',
        images: [
            {
                src: 'static/assets/experience/bjd_1.png',
                title: 'Berjaya Dragons',
                description: 'Berjaya Dragons at the Pacific Championship Series (PCS)'
            },
            {
                src: 'static/assets/experience/bjd_2.jpg',
                title: 'Berjaya Dragons',
                description: 'BJD training facilities in Taiwan'
            },
            {
                src: 'static/assets/experience/bjd_3.png',
                title: 'Berjaya Dragons',
                description: 'Ready to soar — The Sun Malaysia'
            },
            {
                src: 'static/assets/experience/bjd_4.png',
                title: 'Berjaya Dragons',
                description: 'Berjaya Dragons Wild Rift'
            },
            {
                src: 'static/assets/experience/bjd_5.jpg',
                title: 'Berjaya Dragons',
                description: 'Icon Series Malaysia Champions'
            }
        ]
    },
    'fdg': {
        name: 'Fire Dragoon',
        images: [
            {
                src: 'static/assets/experience/fdg_1.jpg',
                title: 'Fire Dragoon',
                description: 'Fire Dragoon takes flight — The Star Newspaper'
            },
            {
                src: 'static/assets/experience/fdg_2.jpg',
                title: 'Fire Dragoon',
                description: 'Invited as a colorcaster for the Garena All-Stars Playoffs'
            },
            {
                src: 'static/assets/experience/fdg_3.jpg',
                title: 'Fire Dragoon',
                description: 'Champions of LoC Malaysia'
            }
        ]
    },
    'kpmg': {
        name: 'KPMG',
        images: [
            {
                src: 'static/assets/experience/kpmg.jpg',
                title: 'KPMG',
                description: 'Internship at KPMG'
            }
        ]
    }
};

// ============================================================================
// PROJECT CONFIGURATION
// ============================================================================

const PROJECT_CONFIG = {
    'mlbb_ban_pick': {
        name: 'Mobile Legends Draft Simulator',
        images: [
            {
                src: 'static/assets/projects/mlbb_ban_pick/create.png',
                title: 'Create Page',
                description: 'Landing page for team setup and settings'
            },
            {
                src: 'static/assets/projects/mlbb_ban_pick/links.png',
                title: 'Links Page',
                description: 'Draft links for both teams and spectator'
            },
            {
                src: 'static/assets/projects/mlbb_ban_pick/draft.png',
                title: 'Draft Page',
                description: 'Real-time ban pick simulation'
            },
            {
                src: 'static/assets/projects/mlbb_ban_pick/preview.mp4',
                poster: 'static/assets/projects/mlbb_ban_pick/preview.png',
                title: 'Preview Video',
                description: 'Draft simulator preview',
                type: 'video'
            },
        ]
    },
    'mortgage_calculator': {
        name: 'Mortgage Calculator',
        images: [
            {
                src: 'static/assets/projects/mortgage_calculator/preview.gif',
                title: 'Mortgage Calculator',
                description: 'Mortgage calculator built with Streamlit'
            }
        ]
    }
}; 