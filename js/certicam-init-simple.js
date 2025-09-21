/**
 * Script d'initialisation simplifié Certicam
 * Charge automatiquement la navbar sur les pages appropriées
 */

(function() {
    'use strict';
    
    console.log('🚀 Certicam Init simplifié démarré');
    
    // Pages qui ne doivent PAS avoir de navbar
    const PAGES_SANS_NAVBAR = [
        'login.html', 
        'register.html', 
        'auth.html', 
        'payment.html', 
        'document-upload.html', 
        'niu-entry.html', 
        'edit.html',
        'two-factor.html',
        'email-verification.html',
        'complete-registration.html'
    ];
    
    // Obtenir le nom de la page actuelle
    function getCurrentPage() {
        return window.location.pathname.split('/').pop() || 'index.html';
    }
    
    // Vérifier si la navbar doit être chargée
    function shouldLoadNavbar() {
        const currentPage = getCurrentPage();
        const shouldLoad = !PAGES_SANS_NAVBAR.includes(currentPage);
        console.log('📋 Page actuelle:', currentPage, 'Charger navbar:', shouldLoad);
        return shouldLoad;
    }
    
    // Charger la navbar HTML
    async function loadNavbarHTML() {
        try {
            console.log('📡 Chargement de components/navbar.html...');
            const response = await fetch('components/navbar.html');
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            const html = await response.text();
            console.log('✅ HTML navbar chargé:', html.length, 'caractères');
            return html;
        } catch (error) {
            console.error('❌ Erreur chargement navbar HTML:', error);
            // Navbar de fallback très simple
            return `
                <header>
                    <div class="header-content">
                        <div class="header-left">
                            <button class="menu-button">☰</button>
                        </div>
                        <div class="header-right">
                            <div class="logo">
                                <img src="img/certicam-main-logo.png" alt="Certicam Logo">
                            </div>
                        </div>
                    </div>
                </header>
            `;
        }
    }
    
    // Injecter la navbar dans la page
    function injectNavbar(html) {
        console.log('💉 Injection de la navbar...');
        
        // Chercher le conteneur navbar
        let container = document.querySelector('#navbar-container');
        
        if (container) {
            console.log('🎯 Injection dans #navbar-container');
            container.innerHTML = html;
        } else {
            console.log('🎯 Injection au début du body');
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = html;
            while (tempDiv.firstChild) {
                document.body.insertBefore(tempDiv.firstChild, document.body.firstChild);
            }
        }
        
        // Marquer comme chargé
        window.navbarLoaded = true;
        console.log('✅ Navbar injectée avec succès');
        
        // Déclencher l'événement
        document.dispatchEvent(new CustomEvent('navbarLoaded'));
    }
    
    // Initialiser les événements de base de la navbar
    function initNavbarEvents() {
        console.log('🎯 Initialisation des événements navbar...');
        
        // Event listener pour le bouton menu
        const menuButton = document.querySelector('.menu-button, #mobile-menu-button');
        if (menuButton) {
            menuButton.addEventListener('click', function() {
                console.log('🔘 Menu cliqué');
                const overlay = document.querySelector('.mobile-menu-overlay');
                if (overlay) {
                    overlay.classList.add('active');
                }
            });
        }
        
        // Event listener pour fermer le menu
        const closeButton = document.querySelector('#mobile-menu-close');
        const overlay = document.querySelector('.mobile-menu-overlay');
        
        if (closeButton && overlay) {
            closeButton.addEventListener('click', function() {
                console.log('❌ Menu fermé');
                overlay.classList.remove('active');
            });
        }
        
        if (overlay) {
            overlay.addEventListener('click', function(e) {
                if (e.target === overlay) {
                    console.log('❌ Menu fermé (clic overlay)');
                    overlay.classList.remove('active');
                }
            });
        }
    }
    
    // Fonction principale d'initialisation
    async function init() {
        console.log('🔄 Initialisation de la navbar...');
        
        // Vérifier si on doit charger la navbar
        if (!shouldLoadNavbar()) {
            console.log('⏭️ Navbar ignorée pour cette page');
            return;
        }
        
        // Vérifier si déjà chargée
        if (document.querySelector('header') || window.navbarLoaded) {
            console.log('⏭️ Navbar déjà présente');
            return;
        }
        
        try {
            // Charger et injecter la navbar
            const navbarHTML = await loadNavbarHTML();
            injectNavbar(navbarHTML);
            
            // Attendre un peu puis initialiser les événements
            setTimeout(initNavbarEvents, 100);
            
            console.log('🎉 Navbar initialisée avec succès !');
        } catch (error) {
            console.error('💥 Erreur lors de l\'initialisation:', error);
        }
    }
    
    // Démarrer l'initialisation quand le DOM est prêt
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
    // Exposer quelques fonctions utiles
    window.Certicam = {
        reloadNavbar: init,
        getCurrentPage: getCurrentPage
    };
    
    console.log('📱 Certicam Init simplifié prêt');
})();