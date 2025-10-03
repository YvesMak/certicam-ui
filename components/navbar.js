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
            <div class="logout-modal" role="dialog" aria-modal="true" aria-labelledby="logout-title">
                <div class="logout-modal-content">
                    <h3 id="logout-title">Êtes-vous sûr de vouloir vous déconnecter ?</h3>
                </div>
                <div class="logout-modal-actions">
                    <button class="logout-cancel-btn" type="button">Annuler</button>
                    <button class="logout-confirm-btn" type="button">OK</button>
                </div>
            </div>
        `;

        // Add styles if not already present
        if (!document.getElementById('logout-modal-styles')) {
            const styles = document.createElement('style');
            styles.id = 'logout-modal-styles';
            styles.textContent = `
                /* Logout Modal - iOS Style Minimal */
                .logout-modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100vw;
                    height: 100vh;
                    background: rgba(0, 0, 0, 0.4);
                    backdrop-filter: blur(20px);
                    -webkit-backdrop-filter: blur(20px);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 10000;
                    padding: var(--spacing-xl);
                    animation: fadeIn 0.2s ease;
                }

                .logout-modal {
                    background: rgba(255, 255, 255, 0.95);
                    border-radius: 14px;
                    max-width: 270px;
                    width: 100%;
                    overflow: hidden;
                    animation: scaleIn 0.25s cubic-bezier(0.36, 0.66, 0.04, 1);
                    box-shadow: 0 0 1px rgba(0, 0, 0, 0.04), 
                                0 2px 6px rgba(0, 0, 0, 0.04), 
                                0 10px 20px rgba(0, 0, 0, 0.1);
                }

                .logout-modal-content {
                    padding: 20px 16px;
                    text-align: center;
                }

                .logout-modal-content h3 {
                    margin: 0;
                    font-size: 17px;
                    font-weight: var(--font-weight-semibold);
                    color: #000000;
                    line-height: 1.4;
                    letter-spacing: -0.4px;
                }

                .logout-modal-actions {
                    display: flex;
                    border-top: 0.5px solid rgba(60, 60, 67, 0.29);
                }

                .logout-cancel-btn,
                .logout-confirm-btn {
                    flex: 1;
                    padding: 11px 8px;
                    border: none;
                    background: transparent;
                    font-size: 17px;
                    font-weight: var(--font-weight-regular);
                    font-family: var(--font-family);
                    cursor: pointer;
                    transition: background 0.15s ease;
                    outline: none;
                }

                .logout-cancel-btn {
                    color: #007AFF;
                    border-right: 0.5px solid rgba(60, 60, 67, 0.29);
                }

                .logout-cancel-btn:active {
                    background: rgba(0, 0, 0, 0.05);
                }

                .logout-confirm-btn {
                    color: #007AFF;
                    font-weight: var(--font-weight-semibold);
                }

                .logout-confirm-btn:active {
                    background: rgba(0, 0, 0, 0.05);
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
                        transform: scale(1.15);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1);
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
                    animation: fadeOut 0.15s ease forwards;
                }

                .logout-modal-overlay.closing .logout-modal {
                    animation: scaleOut 0.15s ease forwards;
                }

                /* Responsive */
                @media (max-width: 640px) {
                    .logout-modal {
                        max-width: 270px;
                    }
                }

                @media (prefers-color-scheme: dark) {
                    .logout-modal {
                        background: rgba(44, 44, 46, 0.95);
                    }

                    .logout-modal-content h3 {
                        color: #FFFFFF;
                    }

                    .logout-modal-actions {
                        border-top-color: rgba(84, 84, 88, 0.65);
                    }

                    .logout-cancel-btn {
                        border-right-color: rgba(84, 84, 88, 0.65);
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
