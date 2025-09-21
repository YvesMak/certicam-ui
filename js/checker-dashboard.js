/**
 * Checker Instructions Page
 * Modern JavaScript implementation following UX best practices
 */

class CheckerInstructions {
    constructor() {
        this.init();
    }

    init() {
        console.log('🔍 Page d\'instructions vérificateur initialisée');
        
        // Initialize components
        this.setupQRCodeInteraction();
        this.setupInstructionAnimations();
        this.trackPageView();
        this.setupAccessibility();
    }

    /**
     * Setup QR Code interactions and hover effects
     */
    setupQRCodeInteraction() {
        const qrCode = document.querySelector('.qr-code');
        
        if (qrCode) {
            // Add click handler for mobile devices
            qrCode.addEventListener('click', () => {
                this.handleQRCodeInteraction();
            });

            // Add keyboard support
            qrCode.setAttribute('tabindex', '0');
            qrCode.setAttribute('role', 'button');
            qrCode.setAttribute('aria-label', 'Code QR pour accéder à l\'application de vérification');
            
            qrCode.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.handleQRCodeInteraction();
                }
            });
        }
    }

    /**
     * Handle QR code interaction (click/tap)
     */
    handleQRCodeInteraction() {
        // In a real implementation, this could:
        // 1. Show a modal with the QR code enlarged
        // 2. Copy the URL to clipboard
        // 3. Open the verification app URL
        
        console.log('🔗 QR Code interaction - ouverture de l\'application de vérification');
        
        // Example: Copy URL to clipboard (would be the actual app URL)
        const appUrl = window.location.origin + '/verification-app';
        
        if (navigator.clipboard) {
            navigator.clipboard.writeText(appUrl).then(() => {
                this.showToast('URL copiée dans le presse-papier !');
            }).catch(err => {
                console.log('Erreur lors de la copie:', err);
            });
        }
    }

    /**
     * Setup smooth scroll animations for instruction steps
     */
    setupInstructionAnimations() {
        // Intersection Observer for animating steps on scroll
        const observerOptions = {
            threshold: 0.2,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        // Observe all instruction steps
        const steps = document.querySelectorAll('.instruction-step');
        steps.forEach((step, index) => {
            // Initial state for animation
            step.style.opacity = '0';
            step.style.transform = 'translateY(20px)';
            step.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
            
            observer.observe(step);
        });

        // Observe QR section
        const qrSection = document.querySelector('.qr-section');
        if (qrSection) {
            qrSection.style.opacity = '0';
            qrSection.style.transform = 'scale(0.95)';
            qrSection.style.transition = 'opacity 0.8s ease 0.3s, transform 0.8s ease 0.3s';
            observer.observe(qrSection);
        }

        // Observe success banner
        const successBanner = document.querySelector('.success-banner');
        if (successBanner) {
            successBanner.style.opacity = '0';
            successBanner.style.transform = 'translateY(20px)';
            successBanner.style.transition = 'opacity 0.6s ease 0.5s, transform 0.6s ease 0.5s';
            observer.observe(successBanner);
        }
    }

    /**
     * Setup accessibility enhancements
     */
    setupAccessibility() {
        // Add skip link for keyboard navigation
        this.addSkipLink();
        
        // Enhance device instructions with better ARIA labels
        const deviceOptions = document.querySelectorAll('.device-option');
        deviceOptions.forEach((option, index) => {
            option.setAttribute('role', 'region');
            option.setAttribute('aria-labelledby', `device-${index}-title`);
            
            const title = option.querySelector('h4');
            if (title) {
                title.id = `device-${index}-title`;
            }
        });
    }

    /**
     * Add skip link for accessibility
     */
    addSkipLink() {
        const skipLink = document.createElement('a');
        skipLink.href = '#main-content';
        skipLink.textContent = 'Passer au contenu principal';
        skipLink.className = 'skip-link';
        skipLink.style.cssText = `
            position: absolute;
            top: -40px;
            left: 6px;
            background: var(--color-text-primary);
            color: var(--color-surface-primary);
            padding: 8px;
            text-decoration: none;
            z-index: 1000;
            border-radius: 4px;
            transition: top 0.3s;
        `;
        
        skipLink.addEventListener('focus', () => {
            skipLink.style.top = '6px';
        });
        
        skipLink.addEventListener('blur', () => {
            skipLink.style.top = '-40px';
        });
        
        document.body.insertBefore(skipLink, document.body.firstChild);
        
        // Add id to main content
        const mainContent = document.querySelector('.checker-page');
        if (mainContent) {
            mainContent.id = 'main-content';
        }
    }

    /**
     * Show toast notification
     */
    showToast(message) {
        // Create toast element
        const toast = document.createElement('div');
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: var(--color-text-primary);
            color: var(--color-surface-primary);
            padding: 12px 24px;
            border-radius: 8px;
            z-index: 1000;
            font-size: 14px;
            font-weight: 500;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;
        
        document.body.appendChild(toast);
        
        // Animate in
        setTimeout(() => {
            toast.style.opacity = '1';
        }, 100);
        
        // Remove after 3 seconds
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }, 3000);
    }

    /**
     * Track page view for analytics
     */
    trackPageView() {
        // Analytics tracking
        console.log('📊 Page vue trackée: Instructions vérificateur');
        
        // Track scroll depth
        let maxScroll = 0;
        window.addEventListener('scroll', () => {
            const scrollPercent = Math.round(
                (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
            );
            
            if (scrollPercent > maxScroll) {
                maxScroll = scrollPercent;
                
                // Track milestones
                if (maxScroll === 25 || maxScroll === 50 || maxScroll === 75 || maxScroll === 100) {
                    console.log(`📊 Scroll milestone: ${maxScroll}%`);
                }
            }
        });
        
        // Track time on page
        this.startTime = Date.now();
        
        window.addEventListener('beforeunload', () => {
            const timeSpent = Math.round((Date.now() - this.startTime) / 1000);
            console.log(`⏱️ Temps passé sur la page: ${timeSpent}s`);
        });
    }

    /**
     * Handle reduced motion preference
     */
    respectMotionPreference() {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
        if (prefersReducedMotion) {
            // Disable animations for users who prefer reduced motion
            const style = document.createElement('style');
            style.textContent = `
                .instruction-step,
                .qr-section,
                .success-banner,
                .qr-code {
                    transition: none !important;
                    animation: none !important;
                }
            `;
            document.head.appendChild(style);
        }
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new CheckerInstructions();
});

// Export for potential external use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CheckerInstructions;
}
