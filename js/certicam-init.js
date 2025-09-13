/**
 * Script d'initialisation universel Certicam
 * À inclure sur toutes les pages pour charger automatiquement la navbar
 * Détecte intelligemment si la navbar est déjà présente pour éviter les conflits
 */

(function() {
    'use strict';
    
    // Configuration globale
    window.CerticamConfig = {
        navbarEnabled: true,
        authPages: ['login.html', 'register.html', 'auth.html'],
        debug: false // Rétabli à false
    };
    
    // Fonction utilitaire pour débugger
    function log(message, type = 'info') {
        if (window.CerticamConfig.debug) {
            console.log(`[Certicam ${type.toUpperCase()}] ${message}`);
        }
    }
    
    // Vérifier si on est sur une page d'auth
    function isAuthPage() {
        const currentPage = window.location.pathname.split('/').pop();
        return window.CerticamConfig.authPages.includes(currentPage);
    }
    
    // Vérifier si la navbar existe déjà  
    function hasNavbar() {
        // Vérifier si on a déjà une navbar chargée via le système
        if (window.navbarLoaded || document.querySelector('.certicam-header, #navbar-container')) {
            return true;
        }
        return false;
    }
    
    // Charger le loader de navbar
    function loadNavbarLoader() {
        return new Promise((resolve, reject) => {
            // Vérifier si le loader est déjà chargé
            if (window.NavbarLoader) {
                resolve();
                return;
            }
            
            const script = document.createElement('script');
            script.src = 'components/navbar-loader.js';
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }
    
    // Initialiser la navbar si nécessaire
    async function initNavbar() {
        log(`Page courante: ${window.location.pathname}`);
        log(`Est page auth: ${isAuthPage()}`);
        log(`A navbar: ${hasNavbar()}`);
        log(`Navbar activée: ${window.CerticamConfig.navbarEnabled}`);
        
        // Skip si page d'auth
        if (isAuthPage()) {
            log('Page d\'authentification détectée, navbar ignorée');
            return;
        }
        
        // Skip si navbar déjà présente
        if (hasNavbar()) {
            log('Navbar déjà présente, chargement ignoré');
            return;
        }
        
        // Skip si désactivée
        if (!window.CerticamConfig.navbarEnabled) {
            log('Navbar désactivée par configuration');
            return;
        }
        
        try {
            log('Chargement du navbar-loader...');
            await loadNavbarLoader();
            log('Navbar-loader chargé avec succès');
            
            // Le NavbarLoader s'initialise automatiquement via autoInit
            log('NavbarLoader initialisé automatiquement');
            
        } catch (error) {
            console.error('Erreur lors du chargement de la navbar:', error);
        }
    }
    
    // Initialiser dès que le DOM est prêt
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initNavbar);
    } else {
        initNavbar();
    }
    
    // Exposer des fonctions utiles globalement
    window.Certicam = {
        reloadNavbar: function() {
            if (window.navbarLoader) {
                return window.navbarLoader.reloadNavbar();
            }
        },
        
        updateUserInfo: function(userData) {
            if (window.navbarLoader) {
                window.navbarLoader.updateUserInfo(userData);
            }
        },
        
        setActivePage: function(page) {
            if (window.navbarLoader) {
                window.navbarLoader.setActiveMenuItem(page);
            }
        },
        
        enableDebug: function() {
            window.CerticamConfig.debug = true;
        }
    };
    
    log('Script universel Certicam initialisé');
})();
