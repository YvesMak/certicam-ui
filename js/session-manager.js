// ===== SESSION MANAGER =====
class SessionManager {
    static SESSION_KEY = 'certicam_session';
    static TEMP_SESSION_KEY = 'certicam_temp_session';

    constructor() {
        this.initializeSession();
        this.setupSessionHandlers();
    }

    static initializeSession() {
        // Check for existing session on page load
        const session = this.getSession();
        if (session) {
            window.CerticamUser = session.user;
            this.updateLastActivity();
        }
    }

    static setupSessionHandlers() {
        // Update activity on user interactions
        const events = ['click', 'keypress', 'scroll', 'mousemove'];
        events.forEach(event => {
            document.addEventListener(event, this.throttle(() => {
                if (this.isAuthenticated()) {
                    this.updateLastActivity();
                }
            }, 30000)); // Update every 30 seconds max
        });

        // Check session validity periodically
        setInterval(() => {
            this.validateSession();
        }, 60000); // Check every minute

        // Handle storage changes (multi-tab support)
        window.addEventListener('storage', (e) => {
            if (e.key === this.SESSION_KEY || e.key === this.TEMP_SESSION_KEY) {
                this.handleStorageChange(e);
            }
        });

        // Handle page visibility changes
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden && this.isAuthenticated()) {
                this.validateSession();
            }
        });
    }

    static createSession(user, remember = false, options = {}) {
        const now = Date.now();
        const sessionData = {
            user: {
                id: user.id || this.generateUserId(),
                email: user.email,
                role: user.role,
                permissions: user.permissions || [],
                profile: user.profile || {},
                preferences: user.preferences || {}
            },
            metadata: {
                loginTime: now,
                lastActivity: now,
                ipAddress: options.ipAddress || null,
                userAgent: navigator.userAgent,
                sessionId: this.generateSessionId(),
                remember: remember
            },
            expires: remember 
                ? now + (30 * 24 * 60 * 60 * 1000) // 30 days
                : now + (24 * 60 * 60 * 1000), // 24 hours
            settings: {
                autoLogout: options.autoLogout !== false,
                inactivityTimeout: options.inactivityTimeout || (remember ? 7200000 : 3600000) // 2h/1h
            }
        };

        // Store session
        const storageKey = remember ? this.SESSION_KEY : this.TEMP_SESSION_KEY;
        const storage = remember ? localStorage : sessionStorage;
        
        try {
            storage.setItem(storageKey, JSON.stringify(sessionData));
            
            // Set global user context
            window.CerticamUser = sessionData.user;
            
            // Log session creation
            this.logSessionEvent('session_created', {
                userId: sessionData.user.id,
                role: sessionData.user.role,
                remember: remember
            });

            return sessionData;
        } catch (error) {
            console.error('Failed to create session:', error);
            throw new Error('Unable to create user session');
        }
    }

    static getSession() {
        // Try persistent storage first, then temporary
        let session = this.getStoredSession(localStorage, this.SESSION_KEY);
        if (!session) {
            session = this.getStoredSession(sessionStorage, this.TEMP_SESSION_KEY);
        }

        if (session && this.isValidSession(session)) {
            return session;
        }

        // Clean up invalid session
        if (session) {
            this.clearSession();
        }

        return null;
    }

    static getStoredSession(storage, key) {
        try {
            const stored = storage.getItem(key);
            return stored ? JSON.parse(stored) : null;
        } catch (error) {
            console.error('Error parsing session data:', error);
            storage.removeItem(key);
            return null;
        }
    }

    static isValidSession(session) {
        if (!session || !session.user || !session.metadata) {
            return false;
        }

        const now = Date.now();

        // Check expiration
        if (now > session.expires) {
            this.logSessionEvent('session_expired', {
                userId: session.user.id,
                expiredAt: session.expires
            });
            return false;
        }

        // Check inactivity timeout
        if (session.settings.autoLogout) {
            const inactivityLimit = session.metadata.lastActivity + session.settings.inactivityTimeout;
            if (now > inactivityLimit) {
                this.logSessionEvent('session_inactive', {
                    userId: session.user.id,
                    lastActivity: session.metadata.lastActivity
                });
                return false;
            }
        }

        return true;
    }

    static updateSession(updates) {
        const session = this.getSession();
        if (!session) return false;

        // Update session data
        Object.assign(session, updates);
        session.metadata.lastActivity = Date.now();

        // Save updated session
        const storageKey = session.metadata.remember ? this.SESSION_KEY : this.TEMP_SESSION_KEY;
        const storage = session.metadata.remember ? localStorage : sessionStorage;
        
        try {
            storage.setItem(storageKey, JSON.stringify(session));
            
            // Update global context
            if (updates.user) {
                window.CerticamUser = session.user;
            }
            
            return true;
        } catch (error) {
            console.error('Failed to update session:', error);
            return false;
        }
    }

    static updateLastActivity() {
        const session = this.getSession();
        if (!session) return;

        session.metadata.lastActivity = Date.now();
        const storageKey = session.metadata.remember ? this.SESSION_KEY : this.TEMP_SESSION_KEY;
        const storage = session.metadata.remember ? localStorage : sessionStorage;
        
        try {
            storage.setItem(storageKey, JSON.stringify(session));
        } catch (error) {
            console.error('Failed to update last activity:', error);
        }
    }

    static validateSession() {
        const session = this.getSession();
        
        if (!session) {
            this.handleSessionExpired();
            return false;
        }

        if (!this.isValidSession(session)) {
            this.handleSessionExpired();
            return false;
        }

        return true;
    }

    static extendSession(additionalTime = 3600000) { // 1 hour default
        const session = this.getSession();
        if (!session) return false;

        session.expires = Math.min(
            session.expires + additionalTime,
            Date.now() + (30 * 24 * 60 * 60 * 1000) // Max 30 days
        );

        return this.updateSession(session);
    }

    static clearSession() {
        const session = this.getSession();
        
        if (session) {
            this.logSessionEvent('session_cleared', {
                userId: session.user.id,
                sessionDuration: Date.now() - session.metadata.loginTime
            });
        }

        // Clear all session storage
        localStorage.removeItem(this.SESSION_KEY);
        sessionStorage.removeItem(this.TEMP_SESSION_KEY);
        
        // Clear global context
        delete window.CerticamUser;
        
        // Clear any cached data
        this.clearUserCache();
        
        return true;
    }

    static logout(redirectUrl = 'auth.html') {
        const session = this.getSession();
        
        if (session) {
            this.logSessionEvent('user_logout', {
                userId: session.user.id,
                sessionDuration: Date.now() - session.metadata.loginTime
            });
        }

        this.clearSession();
        
        // Redirect to login
        if (redirectUrl && !window.location.href.includes(redirectUrl)) {
            window.location.href = redirectUrl;
        }
    }

    static handleStorageChange(event) {
        if (event.key === this.SESSION_KEY || event.key === this.TEMP_SESSION_KEY) {
            if (!event.newValue) {
                // Session was cleared in another tab
                this.handleSessionExpired('Session ended in another tab');
            } else {
                // Session was updated in another tab
                try {
                    const newSession = JSON.parse(event.newValue);
                    window.CerticamUser = newSession.user;
                } catch (error) {
                    console.error('Error syncing session across tabs:', error);
                }
            }
        }
    }

    static handleSessionExpired(reason = 'Session expired') {
        // Clear session data
        this.clearSession();
        
        // Show notification if user is on an authenticated page
        if (!window.location.href.includes('auth.html')) {
            this.showSessionExpiredNotification(reason);
            
            // Redirect after showing notification
            setTimeout(() => {
                this.logout();
            }, 3000);
        }
    }

    static clearUserCache() {
        // Clear any user-specific cached data
        const keysToRemove = [];
        
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && (key.startsWith('user_') || key.startsWith('cache_'))) {
                keysToRemove.push(key);
            }
        }
        
        keysToRemove.forEach(key => localStorage.removeItem(key));
    }

    // User and Permission Methods
    static getCurrentUser() {
        const session = this.getSession();
        return session ? session.user : null;
    }

    static getUserRole() {
        const user = this.getCurrentUser();
        return user ? user.role : null;
    }

    static getUserPermissions() {
        const user = this.getCurrentUser();
        return user ? user.permissions : [];
    }

    static hasPermission(permission) {
        const permissions = this.getUserPermissions();
        return permissions.includes(permission) || permissions.includes('full_access');
    }

    static hasAnyPermission(permissionList) {
        return permissionList.some(permission => this.hasPermission(permission));
    }

    static hasRole(role) {
        return this.getUserRole() === role;
    }

    static hasAnyRole(roleList) {
        const userRole = this.getUserRole();
        return roleList.includes(userRole);
    }

    static isAuthenticated() {
        return this.getSession() !== null;
    }

    static requireAuth(redirectUrl = 'auth.html') {
        if (!this.isAuthenticated()) {
            window.location.href = redirectUrl;
            return false;
        }
        return true;
    }

    static requirePermission(permission, showError = true) {
        if (!this.hasPermission(permission)) {
            if (showError) {
                this.showPermissionDeniedNotification(permission);
            }
            return false;
        }
        return true;
    }

    static requireRole(role, showError = true) {
        if (!this.hasRole(role)) {
            if (showError) {
                this.showRoleDeniedNotification(role);
            }
            return false;
        }
        return true;
    }

    // Utility Methods
    static generateUserId() {
        return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    static generateSessionId() {
        return 'sess_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    static throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    static logSessionEvent(event, data = {}) {
        const logData = {
            event,
            timestamp: Date.now(),
            url: window.location.href,
            ...data
        };
        
        console.log('Session Event:', logData);
        
        // In production, send to analytics
        // this.sendToAnalytics(logData);
    }

    static showSessionExpiredNotification(reason) {
        this.showNotification(`Session expirée: ${reason}`, 'warning');
    }

    static showPermissionDeniedNotification(permission) {
        this.showNotification(`Accès refusé. Permission requise: ${permission}`, 'error');
    }

    static showRoleDeniedNotification(role) {
        this.showNotification(`Accès refusé. Rôle requis: ${role}`, 'error');
    }

    static showNotification(message, type = 'info') {
        // Create notification
        const notification = document.createElement('div');
        notification.className = `session-notification session-notification-${type}`;
        notification.innerHTML = `
            <div class="session-notification-content">
                <i class="fi fi-rr-${this.getNotificationIcon(type)}"></i>
                <span>${message}</span>
                <button class="session-notification-close">&times;</button>
            </div>
        `;

        // Add styles
        this.ensureNotificationStyles();

        // Add to page
        document.body.appendChild(notification);

        // Close button
        notification.querySelector('.session-notification-close').addEventListener('click', () => {
            this.removeNotification(notification);
        });

        // Auto-remove
        setTimeout(() => {
            this.removeNotification(notification);
        }, 5000);

        // Animate in
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
    }

    static removeNotification(notification) {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }

    static getNotificationIcon(type) {
        const icons = {
            success: 'check-circle',
            error: 'exclamation-circle',
            warning: 'exclamation-triangle',
            info: 'info-circle'
        };
        return icons[type] || 'info-circle';
    }

    static ensureNotificationStyles() {
        if (document.getElementById('session-notification-styles')) return;

        const styles = document.createElement('style');
        styles.id = 'session-notification-styles';
        styles.textContent = `
            .session-notification {
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 16px;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                z-index: 10001;
                transform: translateX(100%);
                opacity: 0;
                transition: all 0.3s ease;
                max-width: 400px;
                min-width: 300px;
            }
            .session-notification.show {
                transform: translateX(0);
                opacity: 1;
            }
            .session-notification-content {
                display: flex;
                align-items: center;
                gap: 12px;
                color: white;
                font-weight: 500;
            }
            .session-notification-close {
                margin-left: auto;
                background: none;
                border: none;
                color: white;
                font-size: 18px;
                cursor: pointer;
                padding: 4px;
                border-radius: 4px;
                opacity: 0.8;
                transition: opacity 0.2s;
            }
            .session-notification-close:hover {
                opacity: 1;
                background: rgba(255,255,255,0.1);
            }
            .session-notification-success { background: #10B981; }
            .session-notification-error { background: #EF4444; }
            .session-notification-warning { background: #F59E0B; }
            .session-notification-info { background: #3B82F6; }
        `;
        document.head.appendChild(styles);
    }

    // Session Statistics
    static getSessionStats() {
        const session = this.getSession();
        if (!session) return null;

        const now = Date.now();
        return {
            userId: session.user.id,
            role: session.user.role,
            loginTime: session.metadata.loginTime,
            lastActivity: session.metadata.lastActivity,
            sessionDuration: now - session.metadata.loginTime,
            timeSinceActivity: now - session.metadata.lastActivity,
            expiresIn: session.expires - now,
            isRemembered: session.metadata.remember
        };
    }

    static getInactivityWarningTime() {
        const session = this.getSession();
        if (!session || !session.settings.autoLogout) return null;

        const warningTime = session.metadata.lastActivity + session.settings.inactivityTimeout - 300000; // 5 min warning
        return Math.max(0, warningTime - Date.now());
    }
}

// Initialize session management on page load
document.addEventListener('DOMContentLoaded', () => {
    SessionManager.initializeSession();
    SessionManager.setupSessionHandlers();
});

// Global access
window.SessionManager = SessionManager;
