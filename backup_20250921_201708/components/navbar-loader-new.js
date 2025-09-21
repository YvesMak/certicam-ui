// Navbar Loader - Système de navigation modulaire optimisé pour Certicam
console.log('🧩 Navbar Loader optimisé chargé');

class NavbarLoader {
    constructor(options = {}) {
        this.navbarHtml = '';
        this.isLoaded = false;
        this.authIntegrated = false;
        this.options = {
            autoInit: true,
            excludePages: ['login.html', 'register.html', 'auth.html'], // Pages sans navbar
            loadCSS: true,
            loadJS: true,
            ...options
        };
        
        // Éviter le double chargement sur les pages qui ont déjà une navbar
        this.hasExistingNavbar = this.checkExistingNavbar();
        
        if (this.options.autoInit && !this.hasExistingNavbar && this.shouldLoadNavbar()) {
            this.init();
        }
    }
    
    checkExistingNavbar() {
        // Vérifier si la page a déjà une navbar intégrée
        return document.querySelector('.certicam-header, header.certicam-header, .mobile-menu-overlay') !== null;
    }
    
    shouldLoadNavbar() {
        const currentPage = window.location.pathname.split('/').pop();
        return !this.options.excludePages.includes(currentPage);
    }
    
    async init() {
        try {
            // Charger les dépendances CSS si nécessaire
            if (this.options.loadCSS) {
                await this.loadRequiredCSS();
            }
            
            await this.loadNavbar();
            this.injectNavbar();
            await this.initAuthIntegration();
            this.initNavbarEvents();
            
            // Charger le JS de la navbar si nécessaire
            if (this.options.loadJS) {
                await this.loadNavbarJS();
            }
            
            console.log('✅ Navbar chargée avec authentification');
        } catch (error) {
            console.error('❌ Erreur lors du chargement de la navbar:', error);
            this.createFallbackNavbar();
        }
    }
    
    async loadRequiredCSS() {
        const requiredCSS = [
            'css/tokens.css',
            'css/style.css'
        ];
        
        for (const cssFile of requiredCSS) {
            if (!document.querySelector(`link[href="${cssFile}"]`)) {
                await this.loadCSS(cssFile);
            }
        }
    }
    
    loadCSS(href) {
        return new Promise((resolve, reject) => {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = href;
            link.onload = resolve;
            link.onerror = reject;
            document.head.appendChild(link);
        });
    }
    
    async loadNavbarJS() {
        // Charger navbar.js si pas déjà chargé et si pas de conflit
        if (!window.navbarAuth && !document.querySelector('script[src*="navbar.js"]')) {
            return new Promise((resolve, reject) => {
                const script = document.createElement('script');
                script.src = 'components/navbar.js';
                script.onload = resolve;
                script.onerror = reject;
                document.head.appendChild(script);
            });
        }
    }
    
    async loadNavbar() {
        try {
            const response = await fetch('components/navbar.html');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            this.navbarHtml = await response.text();
        } catch (error) {
            console.warn('Impossible de charger navbar.html, création d\'une navbar par défaut');
            this.createDefaultNavbar();
        }
    }
    
    createDefaultNavbar() {
        this.navbarHtml = `
            <header class="certicam-header">
                <div class="header-content">
                    <div class="header-left">
                        <button class="menu-button" id="mobile-menu-button">
                            <i class="fi fi-rr-menu-burger"></i>
                        </button>
                        <div class="user-profile">
                            <img src="img/coco-profile.jpg" alt="Photo de profil" class="profile-pic" data-user="avatar">
                        </div>
                        <span class="notification-icon">
                            <i class="fi fi-rr-bell"></i>
                        </span>
                    </div>
                    <div class="logo">
                        <img src="img/certicam-main-logo.png" alt="Certicam Logo">
                    </div>
                </div>
            </header>
            
            <!-- Menu Mobile -->
            <div class="mobile-menu-overlay" id="mobile-menu-overlay">
                <div class="mobile-menu">
                    <div class="mobile-menu-header">
                        <h3>Menu</h3>
                        <button class="mobile-menu-close" id="mobile-menu-close">
                            <i class="fi fi-br-cross-small"></i>
                        </button>
                    </div>
                    <nav class="mobile-menu-nav">
                        <a href="index.html" class="mobile-menu-link">
                            <i class="fi fi-rr-home"></i>
                            <span>Accueil</span>
                        </a>
                        <a href="transactions.html" class="mobile-menu-link">
                            <i class="fi fi-rr-time-past"></i>
                            <span>Transactions</span>
                        </a>
                        <a href="settings.html" class="mobile-menu-link">
                            <i class="fi fi-rr-settings"></i>
                            <span>Paramètres</span>
                        </a>
                        <a href="support.html" class="mobile-menu-link">
                            <i class="fi fi-rr-headset"></i>
                            <span>Support</span>
                        </a>
                        <div class="mobile-menu-divider"></div>
                        <button class="mobile-menu-link logout-btn" id="logout-button">
                            <i class="fi fi-rr-sign-out-alt"></i>
                            <span>Déconnexion</span>
                        </button>
                    </nav>
                </div>
            </div>
        `;
    }
    
    createFallbackNavbar() {
        // Navbar de secours ultra-simple
        this.navbarHtml = `
            <header style="background: #fff; padding: 1rem; border-bottom: 1px solid #ddd; display: flex; justify-content: space-between; align-items: center;">
                <div style="display: flex; align-items: center; gap: 1rem;">
                    <button id="mobile-menu-button" style="background: none; border: none; font-size: 1.2rem; cursor: pointer;">☰</button>
                    <span data-user="name">Utilisateur</span>
                </div>
                <img src="img/certicam-main-logo.png" alt="Certicam" style="height: 30px;">
            </header>
        `;
        this.injectNavbar();
    }
    
    injectNavbar() {
        // Éviter l'injection si une navbar existe déjà
        if (this.hasExistingNavbar) {
            console.log('ℹ️ Navbar déjà présente, injection ignorée');
            return;
        }
        
        // Injecter au début du body
        const firstChild = document.body.firstChild;
        const navbarContainer = document.createElement('div');
        navbarContainer.innerHTML = this.navbarHtml;
        
        // Insérer avant le premier enfant
        if (firstChild) {
            document.body.insertBefore(navbarContainer.firstElementChild, firstChild);
            
            // Si il y a d'autres éléments dans le container, les insérer aussi
            while (navbarContainer.children.length > 0) {
                document.body.insertBefore(navbarContainer.firstElementChild, firstChild);
            }
        } else {
            document.body.appendChild(navbarContainer.firstElementChild);
        }
        
        this.isLoaded = true;
        
        // Notifier que la navbar a été injectée
        document.dispatchEvent(new CustomEvent('navbarLoaded', {
            detail: { loader: this }
        }));
    }
    
    initNavbarEvents() {
        // Éviter les conflits avec les event listeners existants
        this.cleanupExistingEvents();
        
        // Gestion du menu mobile
        const menuButton = document.getElementById('mobile-menu-button');
        const menuOverlay = document.getElementById('mobile-menu-overlay');
        const menuClose = document.getElementById('mobile-menu-close');
        
        if (menuButton && menuOverlay) {
            this.mobileMenuHandler = () => {
                menuOverlay.style.display = 'flex';
                document.body.style.overflow = 'hidden';
            };
            menuButton.addEventListener('click', this.mobileMenuHandler);
        }
        
        if (menuClose && menuOverlay) {
            this.closeMenuHandler = () => {
                menuOverlay.style.display = 'none';
                document.body.style.overflow = '';
            };
            menuClose.addEventListener('click', this.closeMenuHandler);
            
            // Fermer en cliquant sur l'overlay
            this.overlayClickHandler = (e) => {
                if (e.target === menuOverlay) {
                    menuOverlay.style.display = 'none';
                    document.body.style.overflow = '';
                }
            };
            menuOverlay.addEventListener('click', this.overlayClickHandler);
        }
        
        // Fermer avec Escape
        this.escapeHandler = (e) => {
            if (e.key === 'Escape' && menuOverlay && menuOverlay.style.display === 'flex') {
                menuOverlay.style.display = 'none';
                document.body.style.overflow = '';
            }
        };
        document.addEventListener('keydown', this.escapeHandler);
    }
    
    cleanupExistingEvents() {
        // Nettoyer les event listeners précédents pour éviter les conflits
        if (this.mobileMenuHandler) {
            const menuButton = document.getElementById('mobile-menu-button');
            if (menuButton) menuButton.removeEventListener('click', this.mobileMenuHandler);
        }
        if (this.closeMenuHandler) {
            const menuClose = document.getElementById('mobile-menu-close');
            if (menuClose) menuClose.removeEventListener('click', this.closeMenuHandler);
        }
        if (this.overlayClickHandler) {
            const menuOverlay = document.getElementById('mobile-menu-overlay');
            if (menuOverlay) menuOverlay.removeEventListener('click', this.overlayClickHandler);
        }
        if (this.escapeHandler) {
            document.removeEventListener('keydown', this.escapeHandler);
        }
    }
    
    async initAuthIntegration() {
        // Attendre que les scripts d'authentification soient chargés
        await this.waitForAuthScripts();
        
        try {
            // Intégrer avec NavbarAuth si disponible
            if (window.NavbarAuth && !window.navbarAuth) {
                window.navbarAuth = new window.NavbarAuth();
                this.authIntegrated = true;
                console.log('✅ Intégration authentification réussie');
            }
        } catch (error) {
            console.warn('⚠️ Impossible d\'intégrer l\'authentification:', error);
        }
    }
    
    async waitForAuthScripts() {
        // Attendre que SessionManager soit disponible
        let attempts = 0;
        const maxAttempts = 50; // 5 secondes max
        
        while (attempts < maxAttempts && typeof window.SessionManager === 'undefined') {
            await new Promise(resolve => setTimeout(resolve, 100));
            attempts++;
        }
    }
    
    // API publique
    isNavbarLoaded() {
        return this.isLoaded;
    }
    
    async reloadNavbar() {
        // Supprimer l'ancienne navbar
        const existingHeader = document.querySelector('.certicam-header, header.certicam-header');
        const existingOverlay = document.querySelector('.mobile-menu-overlay');
        
        if (existingHeader) existingHeader.remove();
        if (existingOverlay) existingOverlay.remove();
        
        this.isLoaded = false;
        this.hasExistingNavbar = false;
        
        // Recharger
        await this.init();
    }
    
    updateUserInfo(userData) {
        const userNameElements = document.querySelectorAll('[data-user="name"]');
        const userEmailElements = document.querySelectorAll('[data-user="email"]');
        const userAvatarElements = document.querySelectorAll('[data-user="avatar"]');
        const userRoleElements = document.querySelectorAll('[data-user="role"]');
        
        userNameElements.forEach(el => el.textContent = userData.name || 'Utilisateur');
        userEmailElements.forEach(el => el.textContent = userData.email || '');
        userAvatarElements.forEach(el => {
            if (userData.avatar) el.src = userData.avatar;
        });
        userRoleElements.forEach(el => el.textContent = userData.role || 'user');
    }
    
    setActiveMenuItem(page) {
        // Retirer la classe active de tous les éléments
        document.querySelectorAll('.mobile-menu-link').forEach(link => {
            link.classList.remove('active');
        });
        
        // Ajouter la classe active au bon élément
        const activeLink = document.querySelector(`a[href="${page}"]`);
        if (activeLink) activeLink.classList.add('active');
    }
}

// Auto-initialisation globale avec gestion intelligente
document.addEventListener('DOMContentLoaded', () => {
    // Éviter l'initialisation sur les pages d'auth ou si déjà présente
    if (!window.navbarLoader) {
        window.navbarLoader = new NavbarLoader();
    }
});

// Export pour utilisation modulaire
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { NavbarLoader };
}
