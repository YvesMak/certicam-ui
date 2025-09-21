// Index.html JavaScript
// Marquer la page d'accueil comme active quand la navbar est chargée
document.addEventListener('navbarLoaded', () => {
    if (window.Certicam) {
        window.Certicam.setActivePage('index.html');
    }
});