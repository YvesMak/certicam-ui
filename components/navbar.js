// ===== NAVBAR MODERNE AVEC AUTH SYSTEM =====

class NavbarAuth {
    constructor() {
        this.profileDropdownOpen = false;
        this.init();
    }

    init() {
        // Initialisation optimisée sans délais
        this.setupAuthState();
        this.initProfileDropdown();
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
            <div class="logout-modal">
                <div class="logout-modal-header">
                    <i class="fi fi-rr-sign-out-alt logout-icon"></i>
                    <h3>Déconnexion</h3>
                </div>
                <div class="logout-modal-body">
                    <p>Êtes-vous sûr de vouloir vous déconnecter ?</p>
                    <p class="logout-modal-subtitle">Vous serez redirigé vers la page de connexion.</p>
                </div>
                <div class="logout-modal-actions">
                    <button class="logout-cancel-btn" type="button">
                        <i class="fi fi-rr-cross-small"></i>
                        Annuler
                    </button>
                    <button class="logout-confirm-btn" type="button">
                        <i class="fi fi-rr-sign-out-alt"></i>
                        Se déconnecter
                    </button>
                </div>
            </div>
        `;

        // Add styles if not already present
        if (!document.getElementById('logout-modal-styles')) {
            const styles = document.createElement('style');
            styles.id = 'logout-modal-styles';
            styles.textContent = `
                .logout-modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100vw;
                    height: 100vh;
                    background: rgba(0, 0, 0, 0.5);
                    backdrop-filter: blur(4px);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 10000;
                    animation: fadeIn 0.2s ease;
                }

                .logout-modal {
                    background: var(--color-white);
                    border-radius: var(--radius-lg);
                    box-shadow: var(--shadow-2xl);
                    max-width: 400px;
                    width: calc(100% - var(--spacing-lg));
                    animation: slideUp 0.3s ease;
                }

                .logout-modal-header {
                    padding: var(--spacing-lg);
                    text-align: center;
                    border-bottom: 1px solid var(--color-gray-200);
                }

                .logout-icon {
                    font-size: 32px;
                    color: var(--color-text-interactive);
                    margin-bottom: var(--spacing-sm);
                }

                .logout-modal-header h3 {
                    margin: 0;
                    font-size: var(--font-size-heading-sm);
                    font-weight: var(--font-weight-semibold);
                    color: var(--color-text-primary);
                }

                .logout-modal-body {
                    padding: var(--spacing-lg);
                    text-align: center;
                }

                .logout-modal-body p {
                    margin: 0;
                    color: var(--color-text-primary);
                    font-size: var(--font-size-body-sm);
                }

                .logout-modal-subtitle {
                    margin-top: var(--spacing-sm) !important;
                    color: var(--color-text-secondary) !important;
                    font-size: var(--font-size-body-xs) !important;
                }

                .logout-modal-actions {
                    padding: var(--spacing-lg);
                    display: flex;
                    gap: var(--spacing-sm);
                    border-top: 1px solid var(--color-gray-200);
                }

                .logout-cancel-btn, .logout-confirm-btn {
                    flex: 1;
                    padding: var(--spacing-sm) var(--spacing-md);
                    border-radius: var(--radius-sm);
                    font-size: var(--font-size-body-sm);
                    font-weight: var(--font-weight-medium);
                    font-family: var(--font-family);
                    cursor: pointer;
                    transition: all 0.2s ease;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: var(--spacing-xs);
                    min-height: 40px;
                }

                .logout-cancel-btn {
                    background: var(--color-gray-100);
                    color: var(--color-text-secondary);
                    border: 1px solid var(--color-gray-200);
                }

                .logout-cancel-btn:hover {
                    background: var(--color-gray-200);
                    color: var(--color-text-primary);
                }

                .logout-confirm-btn {
                    background: var(--color-button-bg-primary);
                    color: var(--color-button-label-primary);
                    border: none;
                }

                .logout-confirm-btn:hover {
                    background: var(--color-gray-700);
                    transform: translateY(-1px);
                }

                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }

                @keyframes slideUp {
                    from { 
                        opacity: 0; 
                        transform: translateY(20px); 
                    }
                    to { 
                        opacity: 1; 
                        transform: translateY(0); 
                    }
                }

                @media (max-width: 480px) {
                    .logout-modal {
                        max-width: none;
                        width: calc(100% - var(--spacing-md));
                    }
                    
                    .logout-modal-actions {
                        flex-direction: column;
                    }
                }
            `;
            document.head.appendChild(styles);
        }

        // Add event listeners
        const cancelBtn = overlay.querySelector('.logout-cancel-btn');
        const confirmBtn = overlay.querySelector('.logout-confirm-btn');

        cancelBtn.addEventListener('click', () => {
            overlay.remove();
        });

        confirmBtn.addEventListener('click', () => {
            overlay.remove();
            this.performLogout();
        });

        // Close on overlay click
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                overlay.remove();
            }
        });

        // Close on Escape key
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                overlay.remove();
                document.removeEventListener('keydown', handleEscape);
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

    // === NOUVELLES MÉTHODES POUR NAVBAR MODERNE ===
    
    initProfileDropdown() {
        const trigger = document.getElementById('profile-dropdown-trigger');
        const menu = document.getElementById('profile-dropdown-menu');
        const profileSettingsLink = document.getElementById('profile-settings-link');
        
        if (!trigger || !menu) return;
        
        // Toggle dropdown on click
        trigger.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleProfileDropdown();
        });
        
        // Handle profile click to go to settings#profile
        if (profileSettingsLink) {
            profileSettingsLink.addEventListener('click', (e) => {
                e.preventDefault();
                this.goToProfileSettings();
            });
        }
        
        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!trigger.contains(e.target) && !menu.contains(e.target)) {
                this.closeProfileDropdown();
            }
        });
        
        // Close on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.profileDropdownOpen) {
                this.closeProfileDropdown();
            }
        });
    }
    
    goToProfileSettings() {
        // Close dropdown first
        this.closeProfileDropdown();
        
        // Navigate to settings page with profile section
        window.location.href = 'settings.html#profile';
        
        // If already on settings page, just scroll to profile section
        if (window.location.pathname.includes('settings.html')) {
            setTimeout(() => {
                const profileSection = document.getElementById('profile-section') || 
                                     document.querySelector('[data-section="profile"]') ||
                                     document.querySelector('.profile-section');
                if (profileSection) {
                    profileSection.scrollIntoView({ behavior: 'smooth' });
                }
            }, 100);
        }
    }
    
    toggleProfileDropdown() {
        const trigger = document.getElementById('profile-dropdown-trigger');
        const menu = document.getElementById('profile-dropdown-menu');
        
        if (!trigger || !menu) return;
        
        if (this.profileDropdownOpen) {
            this.closeProfileDropdown();
        } else {
            this.openProfileDropdown();
        }
    }
    
    openProfileDropdown() {
        const trigger = document.getElementById('profile-dropdown-trigger');
        const menu = document.getElementById('profile-dropdown-menu');
        
        if (!trigger || !menu) return;
        
        trigger.setAttribute('aria-expanded', 'true');
        menu.classList.add('active');
        this.profileDropdownOpen = true;
    }
    
    closeProfileDropdown() {
        const trigger = document.getElementById('profile-dropdown-trigger');
        const menu = document.getElementById('profile-dropdown-menu');
        
        if (!trigger || !menu) return;
        
        trigger.setAttribute('aria-expanded', 'false');
        menu.classList.remove('active');
        this.profileDropdownOpen = false;
    }
    
    initLogoutButtons() {
        // Desktop logout button
        const desktopLogout = document.getElementById('desktop-logout-btn');
        if (desktopLogout) {
            desktopLogout.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleLogout();
            });
        }
        
        // Mobile logout button
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
        'agent-dashboard.html': ['agent']
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
