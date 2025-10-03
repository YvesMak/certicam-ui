// ===== NAVBAR MODERNE AVEC AUTH SYSTEM =====

class NavbarAuth {
    constructor() {
        this.profileDropdownOpen = false;
        this.init();
    }

    init() {
        // Initialisation optimisée sans délais - navbar épurée avec photo de profil
        this.setupAuthState();
        this.initProfileLink();
        this.initLogoutButtons();
        this.highlightCurrentPage();
        
        // Setup léger des événements
        this.setupEventListeners();
    }

    setupAuthState() {
        // Pour le moment, utiliser des données par défaut sans SessionManager
        // Éviter les mises à jour qui causent des délais visuels
        const defaultUser = {
            profile: { firstName: 'Rico' },
            email: 'rico.tangana@certicam.com',
            role: 'user'
        };
        
        // Mise à jour immédiate et unique
        this.updateUserProfileOnce(defaultUser);
        this.updateRoleBasedNavigation(defaultUser.role);
    }
    
    updateUserProfileOnce(user) {
        // Mise à jour optimisée sans re-render multiples
        const userNameElements = document.querySelectorAll('[data-user="name"]');
        const userEmailElements = document.querySelectorAll('[data-user="email"]');
        const userRoleElements = document.querySelectorAll('[data-user="role"]');
        
        // Batch update pour éviter les reflows
        if (userNameElements.length > 0) {
            const name = user.profile.firstName || user.email.split('@')[0];
            userNameElements.forEach(el => el.textContent = name);
        }
        
        if (userEmailElements.length > 0) {
            userEmailElements.forEach(el => el.textContent = user.email);
        }
        
        if (userRoleElements.length > 0) {
            const roleNames = {
                user: 'Particulier',
                checker: 'Vérificateur', 
                agent: 'Agent',
                admin: 'Administrateur'
            };
            const roleName = roleNames[user.role] || user.role;
            userRoleElements.forEach(el => el.textContent = roleName);
        }

        // Update profile avatar if available
        if (user.profile.avatar) {
            document.querySelectorAll('[data-user="avatar"]').forEach(el => {
                el.src = user.profile.avatar;
            });
        }
    }

    updateRoleBasedNavigation(userRole) {
        // Show/hide navigation items based on role - version optimisée
        const roleElements = document.querySelectorAll('[data-show-for-role]');
        
        roleElements.forEach(el => {
            const allowedRoles = el.dataset.showForRole.split(',');
            el.style.display = (allowedRoles.includes(userRole) || !userRole) ? '' : 'none';
        });

        // Si pas d'utilisateur connecté, afficher les liens basiques pour les tests
        if (!userRole) {
            document.querySelectorAll('[data-show-for-role*="user"]').forEach(el => {
                el.style.display = '';
            });
        }
    }

    hideAllRoleNavigation() {
        document.querySelectorAll('[data-show-for-role]').forEach(el => {
            el.style.display = 'none';
        });
    }

    setActivePage() {
        // Remove all active classes
        document.querySelectorAll('.mobile-menu-link').forEach(link => {
            link.classList.remove('active');
        });

        // Add active class to current page
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const currentLink = document.querySelector(`a[href="${currentPage}"]`);
        if (currentLink) {
            currentLink.classList.add('active');
        }
    }

    setupEventListeners() {
        // Logout button
        const logoutButton = document.getElementById('logout-button');
        if (logoutButton) {
            logoutButton.addEventListener('click', this.handleLogout.bind(this));
        }

        // Listen for session changes
        document.addEventListener('sessionChanged', (e) => {
            const { user, action } = e.detail;
            
            if (action === 'login') {
                this.showAuthenticatedState(user);
            } else if (action === 'logout') {
                this.showUnauthenticatedState();
            }
        });

        // Listen for session expiration
        document.addEventListener('sessionExpired', () => {
            this.showUnauthenticatedState();
        });

        // Update notifications
        this.setupNotifications();
    }

    setupNotifications() {
        // Simulate notification updates
        this.updateNotificationBadge();
        
        // Update every 30 seconds
        setInterval(() => {
            this.updateNotificationBadge();
        }, 30000);
    }

    updateNotificationBadge() {
        // Vérifier si SessionManager existe
        if (typeof SessionManager === 'undefined') {
            console.log('SessionManager non disponible pour les notifications');
            return;
        }
        
        const session = SessionManager.getSession();
        if (!session) return;

        const notificationBadge = document.getElementById('notification-count');
        if (!notificationBadge) return;

        // Simulate notification count based on role
        let count = 0;
        switch (session.user.role) {
            case 'admin':
                count = Math.floor(Math.random() * 10) + 5; // 5-15 notifications
                break;
            case 'agent':
                count = Math.floor(Math.random() * 8) + 3; // 3-11 notifications
                break;
            case 'checker':
                count = Math.floor(Math.random() * 5) + 2; // 2-7 notifications
                break;
            case 'user':
                count = Math.floor(Math.random() * 3); // 0-3 notifications
                break;
        }

        if (count > 0) {
            notificationBadge.textContent = count > 99 ? '99+' : count;
            notificationBadge.style.display = 'inline-block';
        } else {
            notificationBadge.style.display = 'none';
        }
    }

    handleLogout() {
        // Create a more elegant logout confirmation modal
        this.showLogoutModal();
    }

    showLogoutModal() {
        // Create modal overlay
        const overlay = document.createElement('div');
        overlay.className = 'logout-modal-overlay';
        overlay.innerHTML = `
            <div class="logout-modal" role="dialog" aria-modal="true" aria-labelledby="logout-title" aria-describedby="logout-description">
                <div class="logout-modal-icon">
                    <i class="fi fi-rr-sign-out-alt"></i>
                </div>
                <div class="logout-modal-content">
                    <h3 id="logout-title">Déconnexion</h3>
                    <p id="logout-description">Voulez-vous vraiment vous déconnecter ?</p>
                </div>
                <div class="logout-modal-actions">
                    <button class="logout-cancel-btn" type="button">
                        <i class="fi fi-rr-cross-small"></i>
                        <span>Annuler</span>
                    </button>
                    <button class="logout-confirm-btn" type="button">
                        <i class="fi fi-rr-check"></i>
                        <span>Confirmer</span>
                    </button>
                </div>
            </div>
        `;

        // Add styles if not already present
        if (!document.getElementById('logout-modal-styles')) {
            const styles = document.createElement('style');
            styles.id = 'logout-modal-styles';
            styles.textContent = `
                /* Logout Modal - Design System Certicam */
                .logout-modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100vw;
                    height: 100vh;
                    background: rgba(0, 0, 0, 0.6);
                    backdrop-filter: blur(8px);
                    -webkit-backdrop-filter: blur(8px);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 10000;
                    padding: var(--spacing-xl);
                    animation: fadeIn 0.25s cubic-bezier(0.16, 1, 0.3, 1);
                }

                .logout-modal {
                    background: var(--color-white);
                    border-radius: var(--radius-2xl);
                    max-width: 420px;
                    width: 100%;
                    padding: var(--spacing-3xl);
                    text-align: center;
                    animation: scaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
                    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
                    position: relative;
                }

                .logout-modal-icon {
                    width: 72px;
                    height: 72px;
                    background: linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 0 auto var(--spacing-xl);
                    position: relative;
                    box-shadow: 0 8px 16px rgba(245, 158, 11, 0.15);
                }

                .logout-modal-icon::before {
                    content: '';
                    position: absolute;
                    inset: -4px;
                    border-radius: 50%;
                    border: 2px solid #FCD34D;
                    opacity: 0.3;
                }

                .logout-modal-icon i {
                    font-size: 2rem;
                    color: #D97706;
                    animation: iconBounce 0.5s ease 0.2s;
                }

                .logout-modal-content h3 {
                    margin: 0 0 var(--spacing-xs) 0;
                    font-size: var(--font-size-heading-md);
                    font-weight: var(--font-weight-bold);
                    color: var(--color-text-primary);
                    letter-spacing: -0.02em;
                }

                .logout-modal-content p {
                    margin: 0 0 var(--spacing-2xl) 0;
                    font-size: var(--font-size-body-md);
                    color: var(--color-text-secondary);
                    line-height: 1.6;
                }

                .logout-modal-actions {
                    display: flex;
                    gap: var(--spacing-md);
                    margin-top: var(--spacing-xl);
                }

                .logout-cancel-btn,
                .logout-confirm-btn {
                    flex: 1;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: var(--spacing-xs);
                    padding: var(--spacing-md) var(--spacing-xl);
                    border-radius: var(--radius-lg);
                    font-size: var(--font-size-body-md);
                    font-weight: var(--font-weight-semibold);
                    font-family: var(--font-family);
                    cursor: pointer;
                    transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
                    border: none;
                    outline: none;
                    position: relative;
                    overflow: hidden;
                }

                .logout-cancel-btn i,
                .logout-confirm-btn i {
                    font-size: 1.125rem;
                    transition: transform 0.2s ease;
                }

                .logout-cancel-btn {
                    background: var(--color-gray-100);
                    color: var(--color-text-primary);
                    border: 1.5px solid var(--color-gray-200);
                }

                .logout-cancel-btn:hover {
                    background: var(--color-gray-200);
                    border-color: var(--color-gray-300);
                    transform: translateY(-1px);
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.08);
                }

                .logout-cancel-btn:hover i {
                    transform: rotate(90deg);
                }

                .logout-cancel-btn:active {
                    transform: translateY(0);
                    box-shadow: none;
                }

                .logout-confirm-btn {
                    background: linear-gradient(135deg, #EF4444 0%, #DC2626 100%);
                    color: white;
                    box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
                }

                .logout-confirm-btn:hover {
                    box-shadow: 0 8px 20px rgba(239, 68, 68, 0.4);
                    transform: translateY(-2px);
                }

                .logout-confirm-btn:hover i {
                    transform: scale(1.1);
                }

                .logout-confirm-btn:active {
                    transform: translateY(0);
                    box-shadow: 0 2px 8px rgba(239, 68, 68, 0.3);
                }

                /* Animations */
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                    }
                    to {
                        opacity: 1;
                    }
                }

                @keyframes scaleIn {
                    from {
                        opacity: 0;
                        transform: scale(0.9);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1);
                    }
                }

                @keyframes iconBounce {
                    0%, 100% {
                        transform: scale(1);
                    }
                    50% {
                        transform: scale(1.1);
                    }
                }

                @keyframes fadeOut {
                    from {
                        opacity: 1;
                    }
                    to {
                        opacity: 0;
                    }
                }

                @keyframes scaleOut {
                    from {
                        opacity: 1;
                        transform: scale(1);
                    }
                    to {
                        opacity: 0;
                        transform: scale(0.9);
                    }
                }

                .logout-modal-overlay.closing {
                    animation: fadeOut 0.2s ease forwards;
                }

                .logout-modal-overlay.closing .logout-modal {
                    animation: scaleOut 0.2s ease forwards;
                }

                /* Responsive */
                @media (max-width: 640px) {
                    .logout-modal {
                        max-width: 100%;
                        padding: var(--spacing-2xl);
                    }

                    .logout-modal-icon {
                        width: 64px;
                        height: 64px;
                    }

                    .logout-modal-icon i {
                        font-size: 1.75rem;
                    }

                    .logout-modal-content h3 {
                        font-size: var(--font-size-heading-sm);
                    }

                    .logout-modal-actions {
                        flex-direction: column-reverse;
                        gap: var(--spacing-sm);
                    }

                    .logout-cancel-btn,
                    .logout-confirm-btn {
                        width: 100%;
                    }
                }

                @media (max-width: 400px) {
                    .logout-modal-overlay {
                        padding: var(--spacing-md);
                    }

                    .logout-modal {
                        padding: var(--spacing-xl);
                    }
                }
            `;
            document.head.appendChild(styles);
        }

        // Add event listeners avec animations de sortie
        const cancelBtn = overlay.querySelector('.logout-cancel-btn');
        const confirmBtn = overlay.querySelector('.logout-confirm-btn');
        const modal = overlay.querySelector('.logout-modal');

        // Fonction pour fermer avec animation
        const closeModal = () => {
            overlay.classList.add('closing');
            setTimeout(() => {
                overlay.remove();
                document.removeEventListener('keydown', handleEscape);
            }, 200);
        };

        // Focus management pour l'accessibilité
        const focusableElements = modal.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstFocusableElement = focusableElements[0];
        const lastFocusableElement = focusableElements[focusableElements.length - 1];

        // Focus sur le premier élément
        setTimeout(() => firstFocusableElement?.focus(), 100);

        // Trap focus dans le modal
        const trapFocus = (e) => {
            if (e.key === 'Tab') {
                if (e.shiftKey && document.activeElement === firstFocusableElement) {
                    e.preventDefault();
                    lastFocusableElement?.focus();
                } else if (!e.shiftKey && document.activeElement === lastFocusableElement) {
                    e.preventDefault();
                    firstFocusableElement?.focus();
                }
            }
        };

        cancelBtn.addEventListener('click', (e) => {
            e.preventDefault();
            closeModal();
        });

        confirmBtn.addEventListener('click', (e) => {
            e.preventDefault();
            // Animation de chargement
            confirmBtn.innerHTML = '<i class="fi fi-rr-loading"></i> Déconnexion...';
            confirmBtn.disabled = true;
            confirmBtn.style.opacity = '0.7';
            
            setTimeout(() => {
                closeModal();
                this.performLogout();
            }, 800);
        });

        // Close on overlay click (avec vérification stricte)
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay && !modal.contains(e.target)) {
                closeModal();
            }
        });

        // Prevent modal click from closing
        modal.addEventListener('click', (e) => {
            e.stopPropagation();
        });

        // Close on Escape key avec trap focus
        const handleEscape = (e) => {
            trapFocus(e);
            if (e.key === 'Escape') {
                e.preventDefault();
                closeModal();
            }
        };
        document.addEventListener('keydown', handleEscape);

        document.body.appendChild(overlay);
    }

    performLogout() {
        try {
            // Show loading state on logout button
            const logoutButton = document.getElementById('logout-button');
            if (logoutButton) {
                const originalContent = logoutButton.innerHTML;
                logoutButton.innerHTML = '<i class="fi fi-rr-loading"></i> <span>Déconnexion...</span>';
                logoutButton.style.opacity = '0.7';
                logoutButton.disabled = true;
            }

            // Perform logout
            SessionManager.logout();
            
            // Redirect to login page
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 500);
            
        } catch (error) {
            console.error('Erreur lors de la déconnexion:', error);
            // Fallback redirect
            window.location.href = 'login.html';
        }
    }

    // === MÉTHODES POUR NAVBAR ÉPURÉE ===
    
    initProfileLink() {
        const profileLink = document.getElementById('navbar-profile-link');
        if (profileLink) {
            profileLink.addEventListener('click', (e) => {
                e.preventDefault();
                this.goToProfileSettings();
            });
        }
    }
    
    goToProfileSettings() {
        // Navigate to settings page with profile section
        const currentPath = window.location.pathname;
        
        if (currentPath.includes('settings.html')) {
            // Already on settings page, just scroll to profile section
            window.location.hash = 'profile';
            setTimeout(() => {
                const profileSection = document.getElementById('profile-section') || 
                                     document.querySelector('[data-section="profile"]') ||
                                     document.querySelector('.profile-section');
                if (profileSection) {
                    profileSection.scrollIntoView({ behavior: 'smooth' });
                }
            }, 100);
        } else {
            // Navigate to settings page with profile section
            window.location.href = 'settings.html#profile';
        }
    }
    
    initLogoutButtons() {
        // Mobile logout button seulement
        const mobileLogout = document.getElementById('mobile-menu-logout');
        if (mobileLogout) {
            mobileLogout.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleLogout();
            });
        }
    }
    
    handleLogout() {
        // Simple confirmation
        if (confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
            this.performLogout();
        }
    }
    
    performLogout() {
        // Clear session if SessionManager exists
        if (typeof SessionManager !== 'undefined') {
            SessionManager.clearSession();
        }
        
        // Clear localStorage
        localStorage.clear();
        sessionStorage.clear();
        
        // Redirect to login page
        window.location.href = 'login.html';
    }
    
    highlightCurrentPage() {
        // Get current page name
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        
        // Remove all active states
        document.querySelectorAll('.mobile-menu-link').forEach(link => {
            link.classList.remove('active');
        });
        
        // Add active state to current page
        const currentLink = document.querySelector(`.mobile-menu-link[data-page="${currentPage.replace('.html', '')}"]`);
        if (currentLink) {
            currentLink.classList.add('active');
        }
        
        // Fallback: try href matching
        if (!currentLink) {
            const hrefLink = document.querySelector(`.mobile-menu-link[href="${currentPage}"]`);
            if (hrefLink) {
                hrefLink.classList.add('active');
            }
        }
    }
}

// Global navigation functions
function goToAuth() {
    window.location.href = 'login.html';
}

function toggleMobileMenu() {
    const overlay = document.getElementById('mobile-menu-overlay');
    if (overlay) {
        overlay.classList.toggle('active');
    }
}

// Mobile menu functionality - Amélioration pour éviter les conflits
function initMobileMenu() {
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenuClose = document.getElementById('mobile-menu-close');
    const mobileMenuOverlay = document.getElementById('mobile-menu-overlay');

    console.log('InitMobileMenu called from navbar.js:', { 
        mobileMenuButton: !!mobileMenuButton, 
        mobileMenuClose: !!mobileMenuClose, 
        mobileMenuOverlay: !!mobileMenuOverlay,
        location: window.location.pathname 
    });

    // Vérifier que les éléments existent
    if (!mobileMenuButton || !mobileMenuClose || !mobileMenuOverlay) {
        console.warn('Éléments du menu mobile introuvables, nouvelle tentative rapide...');
        setTimeout(() => initMobileMenu(), 100);
        return;
    }

    // Éviter de réinitialiser si déjà initialisé par ce script
    if (mobileMenuButton.hasAttribute('data-navbar-js-initialized')) {
        console.log('Menu mobile déjà initialisé par navbar.js');
        return;
    }

    // Supprimer les anciens event listeners potentiellement ajoutés par navbar-loader.js
    const cleanButton = mobileMenuButton.cloneNode(true);
    const cleanClose = mobileMenuClose.cloneNode(true);
    const cleanOverlay = mobileMenuOverlay.cloneNode(true);
    
    mobileMenuButton.parentNode.replaceChild(cleanButton, mobileMenuButton);
    mobileMenuClose.parentNode.replaceChild(cleanClose, mobileMenuClose);
    mobileMenuOverlay.parentNode.replaceChild(cleanOverlay, mobileMenuOverlay);

    // Ajouter les nouveaux event listeners - réaction immédiate
    cleanButton.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        console.log('Burger menu clicked - opening overlay (navbar.js)');
        cleanOverlay.classList.add('active');
    });

    cleanClose.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        console.log('Close button clicked (navbar.js)');
        cleanOverlay.classList.remove('active');
    });

    cleanOverlay.addEventListener('click', function(e) {
        if (e.target === cleanOverlay) {
            console.log('Overlay background clicked (navbar.js)');
            cleanOverlay.classList.remove('active');
        }
    });

    // Marquer comme initialisé
    cleanButton.setAttribute('data-navbar-js-initialized', 'true');
    cleanClose.setAttribute('data-navbar-js-initialized', 'true');
    cleanOverlay.setAttribute('data-navbar-js-initialized', 'true');
    
    console.log('Menu mobile initialisé avec succès par navbar.js');
}

// Exposer la fonction globalement pour réinitialisation
window.initMobileMenu = initMobileMenu;

function closeMobileMenu() {
    const mobileMenuOverlay = document.getElementById('mobile-menu-overlay');
    if (mobileMenuOverlay) {
        console.log('Fermeture du menu mobile');
        mobileMenuOverlay.classList.remove('active');
        console.log('Overlay classes after close:', mobileMenuOverlay.className);
    }
}

// Initialiser le menu mobile à plusieurs moments pour s'assurer qu'il fonctionne
document.addEventListener('DOMContentLoaded', initMobileMenu);

// Aussi l'initialiser quand la navbar est chargée
document.addEventListener('navbarLoaded', initMobileMenu);

// Et aussi l'initialiser si le DOM est déjà chargé
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMobileMenu);
} else {
    initMobileMenu();
}

// Une seule vérification tardive sans délai excessif
setTimeout(() => {
    if (!document.getElementById('mobile-menu-button')?.hasAttribute('data-navbar-js-initialized')) {
        console.log('Initialisation de rattrapage du menu mobile...');
        initMobileMenu();
    }
}, 200);

// Initialize navbar auth integration
window.navbarAuth = new NavbarAuth();

// Add setActivePage function to global Certicam object
if (!window.Certicam) window.Certicam = {};
window.Certicam.setActivePage = function(pageName) {
    // Remove active class from all navigation links
    document.querySelectorAll('.nav-link, .mobile-nav-item a').forEach(link => {
        link.classList.remove('active');
    });
    
    // Find and activate the correct link based on page name
    const pageMap = {
        'index.html': ['dashboard', 'accueil', 'home'],
        'admin.html': ['admin', 'administration'],
        'transactions.html': ['transactions'],
        'settings.html': ['settings', 'paramètres'],
        'support.html': ['support', 'aide'],
        'checker.html': ['checker', 'vérification'],
        'checker-dashboard.html': ['agent']
    };
    
    const keywords = pageMap[pageName] || [pageName.replace('.html', '')];
    
    keywords.forEach(keyword => {
        const links = document.querySelectorAll(`[href*="${keyword}"], [data-page="${keyword}"]`);
        links.forEach(link => link.classList.add('active'));
    });
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { NavbarAuth };
}
