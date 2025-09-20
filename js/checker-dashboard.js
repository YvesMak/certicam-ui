// Checker Dashboard JavaScript

document.addEventListener('DOMContentLoaded', function() {
    initCheckerDashboard();
});

let checkerDashboard = {
    activities: []
};

function initCheckerDashboard() {
    // Vérifier l'authentification
    if (typeof AuthGuard !== 'undefined') {
        AuthGuard.requireRole('checker');
    }
    
    // Charger les données d'activité
    loadUserActivity();
    
    // Attacher les événements
    attachEventListeners();
    
    // Mettre à jour le nom d'utilisateur si disponible
    updateUserName();
}

function attachEventListeners() {
    const addDocumentBtn = document.getElementById('add-document-btn');
    
    if (addDocumentBtn) {
        addDocumentBtn.addEventListener('click', handleAddDocument);
    }
}

function updateUserName() {
    // Récupérer les informations utilisateur depuis le sessionStorage ou localStorage
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser') || localStorage.getItem('currentUser') || '{}');
    
    if (currentUser && currentUser.profile) {
        const firstName = currentUser.profile.firstName || 'Martin';
        const welcomeTitle = document.querySelector('.welcome-title');
        
        if (welcomeTitle) {
            welcomeTitle.textContent = `Hello ${firstName}, Bienvenu(e) sur Certicam.`;
        }
    }
}

function handleAddDocument() {
    // Rediriger vers la page d'ajout de document ou ouvrir un modal
    console.log('Redirection vers la page d\'ajout de document...');
    
    // Pour l'instant, rediriger vers upload-document.html
    if (window.location.pathname.includes('checker-dashboard.html')) {
        window.location.href = 'upload-document.html';
    } else {
        // Si on est dans un autre contexte, afficher un message
        showNotification('Fonctionnalité d\'ajout de document à venir', 'info');
    }
}

function loadUserActivity() {
    // Simuler le chargement des activités utilisateur
    checkerDashboard.activities = [
        {
            id: 1,
            title: 'Martin Bineli s\'est connecté sur Certicam',
            description: '',
            time: 'à l\'instant',
            type: 'login'
        },
        {
            id: 2,
            title: 'Martin Bineli s\'est déconnecté',
            description: '',
            time: 'il y a 20 minutes',
            type: 'logout'
        },
        {
            id: 3,
            title: 'Martin Bineli a ajouté Relevé bancaire Josette Sicac.pdf au portefeuille de Josette Sicac',
            description: '',
            time: 'il y a 23 minutes',
            type: 'document_upload'
        },
        {
            id: 4,
            title: 'Martin Bineli s\'est connecté sur Certicam',
            description: '',
            time: 'il y a 25 minutes',
            type: 'login'
        }
    ];
    
    renderActivityList();
}

function renderActivityList() {
    const activityList = document.getElementById('activity-list');
    
    if (!activityList) return;
    
    if (checkerDashboard.activities.length === 0) {
        activityList.innerHTML = `
            <div class="activity-empty">
                <div class="activity-empty-icon">📋</div>
                <div class="activity-empty-text">Aucune activité récente</div>
            </div>
        `;
        return;
    }
    
    activityList.innerHTML = checkerDashboard.activities.map(activity => `
        <div class="activity-item" data-activity-id="${activity.id}">
            <div class="activity-content">
                <div class="activity-title">${activity.title}</div>
                ${activity.description ? `<div class="activity-description">${activity.description}</div>` : ''}
            </div>
            <div class="activity-time">${activity.time}</div>
        </div>
    `).join('');
}

function showNotification(message, type = 'info') {
    // Créer une notification simple si le système de notifications n'est pas disponible
    if (typeof showNotificationSystem === 'function') {
        showNotificationSystem(message, type);
        return;
    }
    
    // Notification basique
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#059669' : type === 'error' ? '#dc3545' : '#6c757d'};
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        z-index: 10000;
        font-size: 14px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        max-width: 300px;
        word-wrap: break-word;
    `;
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Supprimer la notification après 3 secondes
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 3000);
}

// Fonctions utilitaires pour les activités
function addActivity(title, description = '', type = 'general') {
    const newActivity = {
        id: Date.now(),
        title,
        description,
        time: 'à l\'instant',
        type
    };
    
    checkerDashboard.activities.unshift(newActivity);
    
    // Limiter à 10 activités pour éviter une liste trop longue
    if (checkerDashboard.activities.length > 10) {
        checkerDashboard.activities = checkerDashboard.activities.slice(0, 10);
    }
    
    renderActivityList();
}

function refreshActivity() {
    loadUserActivity();
}

// Exposer les fonctions pour usage externe si nécessaire
window.checkerDashboard = {
    addActivity,
    refreshActivity,
    showNotification
};