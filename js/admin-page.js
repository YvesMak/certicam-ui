// Admin.html JavaScript
// Marquer la page admin comme active quand la navbar est chargée
document.addEventListener('navbarLoaded', () => {
    if (window.Certicam) {
        window.Certicam.setActivePage('admin.html');
    }
});