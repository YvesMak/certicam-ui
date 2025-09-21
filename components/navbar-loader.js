// Navbar Loader - Système de navigation modulaire optimisé pour Certicam
console.log('🧩 Navbar Loader optimisé chargé');

class NavbarLoader {
    constructor(options = {}) {
        this.navbarHtml = '';
        this.isLoaded = false;
        this.authIntegrated = false;
        this.options = {
            autoInit: true,
            excludePages: ['login.html', 'register.html', 'auth.html', 'payment.html', 'document-upload.html', 'niu-entry.html', 'edit.html'], // Pages sans navbar
            publicPages: ['checker-dashboard.html'], // Pages publiques avec navbar mais sans auth
            loadCSS: true,
            loadJS: true,
            ...options
        };
        
        // Auto-initialisation si nécessaire
        console.log('🎯 NavbarLoader constructor:', {
            autoInit: this.options.autoInit,
            shouldLoad: this.shouldLoadNavbar(),
            currentPage: window.location.pathname.split('/').pop()
        });
        
        if (this.options.autoInit && this.shouldLoadNavbar()) {
            this.init();
        }
    }
    
    checkExistingNavbar() {
        // Vérifier si la navbar est déjà chargée par notre système
        const hasLoadedNavbar = window.navbarLoaded || document.querySelector('.certicam-header');
        console.log('🔍 Vérification navbar existante:', {
            navbarLoaded: !!window.navbarLoaded,
            headerExists: !!document.querySelector('.certicam-header'),
            containerExists: !!document.querySelector('#navbar-container'),
            result: !!hasLoadedNavbar
        });
        return !!hasLoadedNavbar;
    }
    
    shouldLoadNavbar() {
        const currentPage = window.location.pathname.split('/').pop();
        const shouldLoad = !this.options.excludePages.includes(currentPage);
        console.log('🔍 shouldLoadNavbar check:', {
            currentPage,
            excludePages: this.options.excludePages,
            shouldLoad
        });
        return shouldLoad;
    }
    
    async init() {
        console.log('🚀 Init NavbarLoader démarré');
        
        // Vérifier au moment de l'initialisation
        if (this.checkExistingNavbar()) {
            console.log('ℹ️ Navbar déjà présente lors de l\'init, arrêt du processus');
            return;
        }
        
        try {
            // Charger les dépendances CSS si nécessaire
            if (this.options.loadCSS) {
                console.log('📄 Chargement CSS...');
                await this.loadRequiredCSS();
            }
            
            console.log('🏠 Chargement navbar HTML...');
            await this.loadNavbar();
            
            console.log('💉 Injection de la navbar...');
            this.injectNavbar();
            
            // Attendre que le DOM soit mis à jour
            await new Promise(resolve => setTimeout(resolve, 100));
            
            console.log('🔐 Initialisation authentification...');
            await this.initAuthIntegration();
            
            console.log('🎯 Initialisation événements...');
            this.initNavbarEvents();
            
            // Charger le JS de la navbar si nécessaire
            if (this.options.loadJS) {
                console.log('📜 Chargement navbar JS...');
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
        
        console.log('📄 Vérification des CSS requis...');
        
        for (const cssFile of requiredCSS) {
            const existingLink = document.querySelector(`link[href="${cssFile}"]`);
            if (!existingLink) {
                console.log(`📥 Chargement CSS: ${cssFile}`);
                await this.loadCSS(cssFile);
            } else {
                console.log(`✅ CSS déjà chargé: ${cssFile}`);
            }
        }
        
        console.log('📄 Vérification finale des styles...');
        
        // Attendre un peu que les CSS soient appliqués
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Vérifier que les variables CSS sont bien définies
        const testElement = document.createElement('div');
        testElement.style.position = 'absolute';
        testElement.style.visibility = 'hidden';
        testElement.style.color = 'var(--color-surface-primary)';
        document.body.appendChild(testElement);
        
        const computedStyle = getComputedStyle(testElement);
        const hasTokens = computedStyle.color !== 'var(--color-surface-primary)';
        
        document.body.removeChild(testElement);
        
        console.log('🎨 Tokens CSS disponibles:', hasTokens);
        
        return hasTokens;
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
            console.log('📡 Tentative de fetch components/navbar.html...');
            const response = await fetch('components/navbar.html');
            console.log('📡 Réponse reçue, statut:', response.status);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            this.navbarHtml = await response.text();
            console.log('📡 HTML reçu, longueur:', this.navbarHtml.length, 'caractères');
            console.log('📡 Début du HTML:', this.navbarHtml.substring(0, 200) + '...');
        } catch (error) {
            console.warn('⚠️ Impossible de charger navbar.html, création d\'une navbar par défaut');
            console.error('Erreur:', error);
            this.createDefaultNavbar();
        }
    }
    
    createDefaultNavbar() {
        console.log('🏗️ Création navbar par défaut (simplifiée)...');
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
                            <span>Historique</span>
                        </a>
                        <a href="support.html" class="mobile-menu-link">
                            <i class="fi fi-rr-life-ring"></i>
                            <span>Support</span>
                        </a>
                        <a href="settings.html" class="mobile-menu-link">
                            <i class="fi fi-rr-settings"></i>
                            <span>Paramètres</span>
                        </a>
                    </nav>
                    
                    <div class="mobile-menu-footer">
                        <div class="mobile-menu-user">
                            <img src="img/coco-profile.jpg" alt="Photo de profil" class="profile-pic" data-user="avatar">
                            <div class="user-details">
                                <span class="user-name" data-user="name">Utilisateur</span>
                                <span class="user-role" data-user="role">user</span>
                            </div>
                        </div>
                        <button class="mobile-menu-logout" id="mobile-menu-logout">
                            <i class="fi fi-rr-sign-out-alt"></i>
                            <span>Se déconnecter</span>
                        </button>
                    </div>
                </div>
            </div>
        `;
        console.log('✅ Navbar par défaut créée');
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
        console.log('💉 Début d\'injection de la navbar...');
        console.log('📋 HTML disponible:', !!this.navbarHtml);
        console.log('📏 Longueur HTML:', this.navbarHtml ? this.navbarHtml.length : 0);
        
        if (!this.navbarHtml) {
            console.error('❌ Aucun HTML à injecter !');
            return;
        }
        
        // Vérifier à nouveau au moment de l'injection
        if (this.checkExistingNavbar()) {
            console.log('ℹ️ Navbar déjà présente, injection ignorée');
            return;
        }
        
        // Chercher le conteneur navbar
        let targetContainer = document.querySelector('#navbar-container');
        
        if (targetContainer) {
            // Injecter dans le conteneur prévu
            console.log('🎯 Injection dans #navbar-container');
            targetContainer.innerHTML = this.navbarHtml;
        } else {
            // Fallback: injecter au début du body
            console.log('🎯 Fallback: injection au début du body');
            const firstChild = document.body.firstChild;
            const navbarContainer = document.createElement('div');
            navbarContainer.innerHTML = this.navbarHtml;
            
            // Insérer chaque élément au début du body
            const elementsToInsert = Array.from(navbarContainer.children);
            console.log('🚀 Insertion de', elementsToInsert.length, 'éléments...');
            
            for (let i = 0; i < elementsToInsert.length; i++) {
                const element = elementsToInsert[i];
                console.log(`📍 Insertion élément ${i + 1}:`, element.tagName, element.className);
                document.body.insertBefore(element, firstChild);
            }
        }
        
        this.isLoaded = true;
        window.navbarLoaded = true; // Flag global
        
        console.log('✅ Navbar injectée dans le DOM');
        console.log('🔍 Header présent:', !!document.querySelector('header'));
        console.log('🔍 Menu overlay présent:', !!document.querySelector('.mobile-menu-overlay'));
        
        // Notifier que la navbar a été injectée
        document.dispatchEvent(new CustomEvent('navbarLoaded', {
            detail: { loader: this }
        }));
    }
    
    initNavbarEvents() {
        console.log('🎯 Initialisation des événements navbar...');
        
        // Éviter les conflits avec les event listeners existants
        this.cleanupExistingEvents();
        
        // Gestion du menu mobile
        const menuButton = document.getElementById('mobile-menu-button');
        const menuOverlay = document.getElementById('mobile-menu-overlay');
        const menuClose = document.getElementById('mobile-menu-close');
        
        console.log('🔍 Éléments trouvés:', {
            menuButton: !!menuButton,
            menuOverlay: !!menuOverlay,
            menuClose: !!menuClose
        });
        
        if (menuButton && menuOverlay) {
            this.mobileMenuHandler = () => {
                console.log('🍔 Menu burger cliqué !');
                menuOverlay.classList.add('active');
                document.body.style.overflow = 'hidden';
            };
            menuButton.addEventListener('click', this.mobileMenuHandler);
            console.log('✅ Event listener menu burger ajouté');
        } else {
            console.error('❌ Impossible d\'attacher les événements menu:', { menuButton, menuOverlay });
        }
        
        if (menuClose && menuOverlay) {
            this.closeMenuHandler = () => {
                console.log('❌ Bouton fermeture cliqué !');
                menuOverlay.classList.remove('active');
                document.body.style.overflow = '';
            };
            menuClose.addEventListener('click', this.closeMenuHandler);
            
            // Fermer en cliquant sur l'overlay
            this.overlayClickHandler = (e) => {
                if (e.target === menuOverlay) {
                    console.log('🔲 Overlay cliqué !');
                    menuOverlay.classList.remove('active');
                    document.body.style.overflow = '';
                }
            };
            menuOverlay.addEventListener('click', this.overlayClickHandler);
            console.log('✅ Event listeners fermeture ajoutés');
        }
        
        // Fermer avec Escape
        this.escapeHandler = (e) => {
            if (e.key === 'Escape' && menuOverlay && menuOverlay.classList.contains('active')) {
                console.log('⌨️ Touche Escape pressée !');
                menuOverlay.classList.remove('active');
                document.body.style.overflow = '';
            }
        };
        document.addEventListener('keydown', this.escapeHandler);
        
        console.log('🎯 Événements navbar initialisés avec succès');
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
        // Vérifier si c'est une page publique
        const currentPage = window.location.pathname.split('/').pop();
        if (this.options.publicPages && this.options.publicPages.includes(currentPage)) {
            console.log('ℹ️ Page publique détectée, pas d\'intégration auth requise');
            return;
        }
        
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
function initGlobalNavbar() {
    // Éviter l'initialisation sur les pages d'auth ou si déjà présente
    if (!window.navbarLoader) {
        window.navbarLoader = new NavbarLoader();
    }
}

// Initialiser immédiatement si DOM prêt, sinon attendre
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGlobalNavbar);
} else {
    // DOM déjà prêt, initialiser maintenant
    initGlobalNavbar();
}

// Export pour utilisation modulaire
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { NavbarLoader };
}
