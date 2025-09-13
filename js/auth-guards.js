// ===== AUTH GUARDS =====
class AuthGuard {
    constructor() {
        this.protectedRoutes = {
            // Pages requiring authentication
            'index.html': ['user', 'checker', 'agent', 'admin'],
            'dashboard.html': ['user', 'checker', 'agent', 'admin'],
            'transactions.html': ['user', 'checker', 'agent', 'admin'],
            'settings.html': ['user', 'checker', 'agent', 'admin'],
            'support.html': ['user', 'checker', 'agent', 'admin'],
            'payment.html': ['user'],
            'edit.html': ['user', 'checker', 'agent', 'admin'],
            
            // Role-specific pages
            'checker-dashboard.html': ['checker', 'agent', 'admin'],
            'agent-dashboard.html': ['agent', 'admin'],
            'admin.html': ['admin'],
            
            // Special permissions
            'admin-users.html': ['admin'],
            'admin-settings.html': ['admin'],
            'agent-analytics.html': ['agent', 'admin'],
            'checker-queue.html': ['checker', 'agent', 'admin']
        };

        this.publicRoutes = [
            'auth.html',
            'landing.html',
            'about.html',
            'contact.html',
            'terms.html',
            'privacy.html'
        ];

        this.init();
    }

    init() {
        // Check access on page load
        this.checkPageAccess();

        // Intercept navigation attempts
        this.setupNavigationGuards();
        
        // Setup automatic redirects
        this.setupAutoRedirects();
    }

    checkPageAccess() {
        const currentPage = this.getCurrentPage();
        const session = SessionManager.getSession();

        // If no session and page requires auth
        if (!session && this.requiresAuth(currentPage)) {
            this.redirectToAuth('Connexion requise');
            return;
        }

        // If authenticated but wrong role
        if (session && !this.hasPageAccess(currentPage, session.user.role)) {
            this.handleUnauthorizedAccess(currentPage, session.user.role);
            return;
        }

        // If authenticated and on auth page, redirect to dashboard
        if (session && this.isAuthPage(currentPage)) {
            this.redirectToDashboard(session.user.role);
            return;
        }

        // Page access is valid
        this.onAccessGranted(currentPage, session);
    }

    getCurrentPage() {
        const path = window.location.pathname;
        const filename = path.substring(path.lastIndexOf('/') + 1);
        return filename || 'index.html';
    }

    requiresAuth(page) {
        return this.protectedRoutes.hasOwnProperty(page);
    }

    isAuthPage(page) {
        return this.publicRoutes.includes(page) && page === 'auth.html';
    }

    hasPageAccess(page, userRole) {
        // Public pages are always accessible
        if (this.publicRoutes.includes(page)) {
            return true;
        }

        // Check if page requires specific roles
        const requiredRoles = this.protectedRoutes[page];
        if (!requiredRoles) {
            return true; // No restrictions
        }

        return requiredRoles.includes(userRole);
    }

    handleUnauthorizedAccess(page, userRole) {
        console.warn(`Unauthorized access attempt to ${page} by role ${userRole}`);
        
        // Log the attempt
        this.logAccessAttempt(page, userRole, false);

        // Redirect to appropriate dashboard
        this.redirectToDashboard(userRole, 'Accès non autorisé à cette page');
    }

    redirectToAuth(message = 'Connexion requise') {
        console.log('Redirecting to auth:', message);
        
        // Store intended destination
        if (window.location.pathname !== '/auth.html') {
            sessionStorage.setItem('certicam_intended_url', window.location.href);
        }

        // Show message and redirect
        if (message) {
            SessionManager.showNotification(message, 'warning');
        }

        setTimeout(() => {
            window.location.href = 'auth.html';
        }, 1000);
    }

    redirectToDashboard(userRole, message = null) {
        const dashboardUrl = this.getDashboardUrl(userRole);
        
        if (message) {
            SessionManager.showNotification(message, 'info');
        }

        setTimeout(() => {
            window.location.href = dashboardUrl;
        }, message ? 1000 : 0);
    }

    getDashboardUrl(userRole) {
        const dashboards = {
            user: 'index.html',
            checker: 'checker-dashboard.html',
            agent: 'agent-dashboard.html',
            admin: 'admin.html'
        };

        return dashboards[userRole] || 'index.html';
    }

    onAccessGranted(page, session) {
        if (session) {
            this.logAccessAttempt(page, session.user.role, true);
            this.updateUserContext(session.user, page);
        }

        // Check for intended URL redirect
        this.checkIntendedRedirect();
    }

    checkIntendedRedirect() {
        const intendedUrl = sessionStorage.getItem('certicam_intended_url');
        if (intendedUrl) {
            sessionStorage.removeItem('certicam_intended_url');
            
            // Only redirect if it's a different page
            if (!window.location.href.includes(intendedUrl)) {
                setTimeout(() => {
                    window.location.href = intendedUrl;
                }, 500);
            }
        }
    }

    updateUserContext(user, currentPage) {
        // Update global context
        window.CerticamUser = user;
        window.CerticamCurrentPage = currentPage;

        // Update page-specific elements
        this.updateUserInterface(user);
        
        // Setup role-based features
        this.setupRoleFeatures(user.role);
    }

    updateUserInterface(user) {
        // Update user name displays
        document.querySelectorAll('[data-user="name"]').forEach(el => {
            el.textContent = user.profile.firstName || user.email;
        });

        // Update user email displays
        document.querySelectorAll('[data-user="email"]').forEach(el => {
            el.textContent = user.email;
        });

        // Update profile images
        document.querySelectorAll('[data-user="avatar"]').forEach(el => {
            if (user.profile.avatar) {
                el.src = user.profile.avatar;
            }
        });

        // Update role-specific elements
        document.querySelectorAll('[data-user="role"]').forEach(el => {
            const roleConfig = this.getRoleConfig(user.role);
            el.textContent = roleConfig.title;
        });

        // Show/hide elements based on permissions
        this.updatePermissionBasedElements(user.permissions);
    }

    updatePermissionBasedElements(permissions) {
        document.querySelectorAll('[data-permission]').forEach(el => {
            const requiredPermission = el.dataset.permission;
            const hasPermission = permissions.includes(requiredPermission) || 
                                 permissions.includes('full_access');
            
            el.style.display = hasPermission ? '' : 'none';
        });

        document.querySelectorAll('[data-role]').forEach(el => {
            const requiredRoles = el.dataset.role.split(',');
            const userRole = SessionManager.getUserRole();
            const hasRole = requiredRoles.includes(userRole);
            
            el.style.display = hasRole ? '' : 'none';
        });
    }

    setupRoleFeatures(role) {
        // Remove existing role classes
        document.body.classList.remove('role-user', 'role-checker', 'role-agent', 'role-admin');
        
        // Add current role class
        document.body.classList.add(`role-${role}`);

        // Setup role-specific navigation
        this.setupRoleNavigation(role);
    }

    setupRoleNavigation(role) {
        const navItems = document.querySelectorAll('.mobile-menu-item a, .nav-item a');
        
        navItems.forEach(link => {
            const href = link.getAttribute('href');
            const page = href ? href.split('/').pop() : '';
            
            // Hide navigation items user can't access
            if (page && !this.hasPageAccess(page, role)) {
                link.closest('.mobile-menu-item, .nav-item')?.style.setProperty('display', 'none');
            }
        });
    }

    setupNavigationGuards() {
        // Intercept link clicks
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a');
            if (!link) return;

            const href = link.getAttribute('href');
            if (!href || href.startsWith('#') || href.startsWith('http')) return;

            const targetPage = href.split('/').pop();
            if (!this.canNavigateTo(targetPage)) {
                e.preventDefault();
                const userRole = SessionManager.getUserRole();
                this.handleUnauthorizedAccess(targetPage, userRole);
            }
        });

        // Intercept programmatic navigation
        const originalPushState = history.pushState;
        const originalReplaceState = history.replaceState;

        history.pushState = (...args) => {
            if (this.canNavigateToUrl(args[2])) {
                originalPushState.apply(history, args);
            }
        };

        history.replaceState = (...args) => {
            if (this.canNavigateToUrl(args[2])) {
                originalReplaceState.apply(history, args);
            }
        };
    }

    canNavigateTo(page) {
        const session = SessionManager.getSession();
        
        if (!session && this.requiresAuth(page)) {
            return false;
        }

        if (session && !this.hasPageAccess(page, session.user.role)) {
            return false;
        }

        return true;
    }

    canNavigateToUrl(url) {
        if (!url) return true;
        
        const page = url.split('/').pop().split('?')[0].split('#')[0];
        return this.canNavigateTo(page);
    }

    setupAutoRedirects() {
        // Handle session changes
        document.addEventListener('sessionChanged', (e) => {
            const { user, action } = e.detail;
            
            if (action === 'login') {
                this.redirectToDashboard(user.role, 'Connexion réussie');
            } else if (action === 'logout') {
                this.redirectToAuth('Déconnexion réussie');
            }
        });

        // Handle session expiration
        document.addEventListener('sessionExpired', () => {
            this.redirectToAuth('Session expirée');
        });
    }

    getRoleConfig(role) {
        const configs = {
            user: { title: 'Utilisateur', level: 1 },
            checker: { title: 'Vérificateur', level: 2 },
            agent: { title: 'Agent', level: 3 },
            admin: { title: 'Administrateur', level: 4 }
        };

        return configs[role] || configs.user;
    }

    logAccessAttempt(page, role, success) {
        const logData = {
            page,
            role,
            success,
            timestamp: Date.now(),
            userAgent: navigator.userAgent,
            ip: null // Would be filled server-side
        };

        console.log('Access attempt:', logData);

        // In production, send to analytics
        // this.sendAccessLog(logData);
    }

    // Public API methods
    static requireAuth() {
        return SessionManager.requireAuth();
    }

    static requirePermission(permission) {
        return SessionManager.requirePermission(permission);
    }

    static requireRole(role) {
        return SessionManager.requireRole(role);
    }

    static canAccess(page, role = null) {
        const guard = window.authGuardInstance;
        if (!guard) return false;

        const userRole = role || SessionManager.getUserRole();
        return guard.hasPageAccess(page, userRole);
    }

    static redirectTo(page) {
        const guard = window.authGuardInstance;
        if (!guard || !guard.canNavigateTo(page)) {
            SessionManager.showNotification('Accès non autorisé', 'error');
            return false;
        }

        window.location.href = page;
        return true;
    }
}

// Role-based UI utilities
class RoleBasedUI {
    static showForRole(selector, allowedRoles) {
        const userRole = SessionManager.getUserRole();
        const elements = document.querySelectorAll(selector);
        
        elements.forEach(el => {
            el.style.display = allowedRoles.includes(userRole) ? '' : 'none';
        });
    }

    static hideForRole(selector, hiddenRoles) {
        const userRole = SessionManager.getUserRole();
        const elements = document.querySelectorAll(selector);
        
        elements.forEach(el => {
            el.style.display = hiddenRoles.includes(userRole) ? 'none' : '';
        });
    }

    static showForPermission(selector, requiredPermissions) {
        const hasPermission = requiredPermissions.some(perm => 
            SessionManager.hasPermission(perm)
        );
        
        const elements = document.querySelectorAll(selector);
        elements.forEach(el => {
            el.style.display = hasPermission ? '' : 'none';
        });
    }

    static enableForRole(selector, allowedRoles) {
        const userRole = SessionManager.getUserRole();
        const elements = document.querySelectorAll(selector);
        
        elements.forEach(el => {
            el.disabled = !allowedRoles.includes(userRole);
        });
    }

    static setupRoleBasedElements() {
        // Process data-role attributes
        document.querySelectorAll('[data-show-for-role]').forEach(el => {
            const roles = el.dataset.showForRole.split(',');
            this.showForRole(el, roles);
        });

        document.querySelectorAll('[data-hide-for-role]').forEach(el => {
            const roles = el.dataset.hideForRole.split(',');
            this.hideForRole(el, roles);
        });

        document.querySelectorAll('[data-show-for-permission]').forEach(el => {
            const permissions = el.dataset.showForPermission.split(',');
            this.showForPermission(el, permissions);
        });

        document.querySelectorAll('[data-enable-for-role]').forEach(el => {
            const roles = el.dataset.enableForRole.split(',');
            this.enableForRole(el, roles);
        });
    }
}

// Initialize guards on page load
document.addEventListener('DOMContentLoaded', () => {
    window.authGuardInstance = new AuthGuard();
    
    // Setup role-based UI after a short delay to ensure DOM is ready
    setTimeout(() => {
        RoleBasedUI.setupRoleBasedElements();
    }, 100);
});

// Global access
window.AuthGuard = AuthGuard;
window.RoleBasedUI = RoleBasedUI;
