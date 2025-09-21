// Agent Dashboard functionality
class AgentDashboard {
    constructor() {
        this.users = [];
        this.checkers = [];
        this.alerts = [];
        this.init();
    }

    init() {
        // Require agent role
        AuthGuard.requireRole('agent');
        
        this.loadData();
        this.loadUsers();
        this.loadCheckers();
        this.loadAlerts();
        this.startRealTimeUpdates();
    }

    loadData() {
        // Simulate real-time data updates
        this.updateMetrics();
    }

    updateMetrics() {
        // Simulate API calls for metrics
        const metrics = {
            totalUsers: 1247 + Math.floor(Math.random() * 10),
            activeToday: 342 + Math.floor(Math.random() * 20),
            newUsers: 89 + Math.floor(Math.random() * 5),
            pendingVerifications: 127 - Math.floor(Math.random() * 10),
            completedToday: 89 + Math.floor(Math.random() * 15),
            approvalRate: (92.4 + Math.random() * 2).toFixed(1),
            revenueToday: (2847 + Math.random() * 500).toFixed(0),
            revenueMonth: (45230 + Math.random() * 1000).toFixed(0),
            avgRevenue: (36.30 + Math.random() * 5).toFixed(2)
        };

        // Update DOM
        Object.keys(metrics).forEach(key => {
            const element = document.getElementById(key.replace(/([A-Z])/g, '-$1').toLowerCase());
            if (element) {
                if (key.includes('revenue') || key.includes('avg')) {
                    element.textContent = metrics[key] + (key.includes('avg') ? '€' : '€');
                } else if (key.includes('rate')) {
                    element.textContent = metrics[key] + '%';
                } else {
                    element.textContent = metrics[key];
                }
            }
        });
    }

    loadUsers() {
        // Simulate user data
        this.users = [
            {
                id: 'user_001',
                name: 'Marie Dubois',
                email: 'marie.dubois@email.com',
                status: 'active',
                lastActive: '2024-01-15T11:30:00Z',
                verifications: 12
            },
            {
                id: 'user_002',
                name: 'Jean Martin',
                email: 'jean.martin@email.com',
                status: 'active',
                lastActive: '2024-01-15T10:15:00Z',
                verifications: 8
            },
            {
                id: 'user_003',
                name: 'Sophie Lambert',
                email: 'sophie.lambert@email.com',
                status: 'inactive',
                lastActive: '2024-01-14T16:45:00Z',
                verifications: 3
            },
            {
                id: 'user_004',
                name: 'Pierre Durand',
                email: 'pierre.durand@email.com',
                status: 'suspended',
                lastActive: '2024-01-13T14:20:00Z',
                verifications: 0
            }
        ];

        this.renderUsers();
    }

    loadCheckers() {
        // Simulate checker data
        this.checkers = [
            {
                id: 'checker_001',
                name: 'Alice Robert',
                email: 'alice.robert@certicam.com',
                status: 'active',
                verificationsToday: 15,
                approvalRate: 94.2
            },
            {
                id: 'checker_002',
                name: 'Bob Moreau',
                email: 'bob.moreau@certicam.com',
                status: 'active',
                verificationsToday: 12,
                approvalRate: 91.8
            },
            {
                id: 'checker_003',
                name: 'Claire Petit',
                email: 'claire.petit@certicam.com',
                status: 'inactive',
                verificationsToday: 0,
                approvalRate: 96.1
            }
        ];

        this.renderCheckers();
    }

    loadAlerts() {
        // Simulate alerts
        this.alerts = [
            {
                id: 'alert_001',
                type: 'error',
                title: 'Erreur de connexion base de données',
                message: 'Connexion intermittente détectée à 11:45',
                time: '2024-01-15T11:45:00Z'
            },
            {
                id: 'alert_002',
                type: 'warning',
                title: 'File de vérification surchargée',
                message: 'Plus de 150 documents en attente',
                time: '2024-01-15T11:30:00Z'
            },
            {
                id: 'alert_003',
                type: 'info',
                title: 'Nouveau vérificateur connecté',
                message: 'Alice Robert a commencé sa session',
                time: '2024-01-15T11:00:00Z'
            }
        ];

        this.renderAlerts();
    }

    renderUsers() {
        const container = document.getElementById('user-list');
        container.innerHTML = '';

        this.users.forEach(user => {
            const userItem = this.createUserItem(user);
            container.appendChild(userItem);
        });
    }

    createUserItem(user) {
        const div = document.createElement('div');
        div.className = 'user-item';
        
        const initials = user.name.split(' ').map(n => n[0]).join('');
        const lastActive = this.getTimeAgo(user.lastActive);

        div.innerHTML = `
            <div class="user-info">
                <div class="user-avatar">${initials}</div>
                <div class="user-details">
                    <h5>${user.name}</h5>
                    <p>${user.email} • ${user.verifications} vérifications</p>
                </div>
            </div>
            <div>
                <span class="user-status status-${user.status}">
                    ${user.status === 'active' ? 'Actif' : 
                      user.status === 'inactive' ? 'Inactif' : 'Suspendu'}
                </span>
            </div>
        `;

        div.addEventListener('click', () => this.viewUserDetails(user.id));
        return div;
    }

    renderCheckers() {
        const container = document.getElementById('checker-list');
        container.innerHTML = '';

        this.checkers.forEach(checker => {
            const checkerItem = this.createCheckerItem(checker);
            container.appendChild(checkerItem);
        });
    }

    createCheckerItem(checker) {
        const div = document.createElement('div');
        div.className = 'checker-item';
        
        const initials = checker.name.split(' ').map(n => n[0]).join('');

        div.innerHTML = `
            <div class="user-info">
                <div class="user-avatar">${initials}</div>
                <div class="user-details">
                    <h5>${checker.name}</h5>
                    <p>${checker.verificationsToday} vérifications • ${checker.approvalRate}% approbation</p>
                </div>
            </div>
            <div>
                <span class="user-status status-${checker.status}">
                    ${checker.status === 'active' ? 'En ligne' : 'Hors ligne'}
                </span>
            </div>
        `;

        div.addEventListener('click', () => this.viewCheckerDetails(checker.id));
        return div;
    }

    renderAlerts() {
        const container = document.getElementById('alerts-container');
        container.innerHTML = '';

        if (this.alerts.length === 0) {
            container.innerHTML = '<p style="color: var(--text-color-muted); text-align: center;">Aucune alerte active</p>';
            return;
        }

        this.alerts.forEach(alert => {
            const alertItem = this.createAlertItem(alert);
            container.appendChild(alertItem);
        });
    }

    createAlertItem(alert) {
        const div = document.createElement('div');
        div.className = `alert-item ${alert.type}`;
        
        const icons = {
            error: '⚠️',
            warning: '⚡',
            info: 'ℹ️'
        };

        div.innerHTML = `
            <div class="alert-icon">${icons[alert.type]}</div>
            <div>
                <h5>${alert.title}</h5>
                <p>${alert.message}</p>
                <small style="color: var(--text-color-muted);">${this.getTimeAgo(alert.time)}</small>
            </div>
        `;

        return div;
    }

    viewUserDetails(userId) {
        // Simulate opening user details modal
        SessionManager.showNotification('Ouverture des détails utilisateur...', 'info');
    }

    viewCheckerDetails(checkerId) {
        // Simulate opening checker details
        SessionManager.showNotification('Ouverture des détails vérificateur...', 'info');
    }

    getTimeAgo(dateString) {
        const diff = Date.now() - new Date(dateString).getTime();
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        
        if (days > 0) return `il y a ${days}j`;
        if (hours > 0) return `il y a ${hours}h`;
        return `il y a ${minutes}min`;
    }

    startRealTimeUpdates() {
        // Update metrics every 30 seconds
        setInterval(() => {
            this.updateMetrics();
        }, 30000);

        // Reload data every 5 minutes
        setInterval(() => {
            this.loadUsers();
            this.loadCheckers();
            this.loadAlerts();
        }, 300000);
    }
}

// Global functions
function openUserManagement() {
    window.location.href = 'admin-users.html';
}

function manageCheckers() {
    window.location.href = 'admin-checkers.html';
}

function generateReport() {
    SessionManager.showNotification('Génération du rapport en cours...', 'info');
}

function manageSettings() {
    window.location.href = 'admin-settings.html';
}

function viewLogs() {
    SessionManager.showNotification('Ouverture des journaux système...', 'info');
}

function backupData() {
    if (confirm('Lancer une sauvegarde complète des données ?')) {
        SessionManager.showNotification('Sauvegarde en cours...', 'info');
        // Simulate backup process
        setTimeout(() => {
            SessionManager.showNotification('Sauvegarde terminée avec succès', 'success');
        }, 3000);
    }
}

// Initialize dashboard
let agentDashboard;
document.addEventListener('DOMContentLoaded', () => {
    agentDashboard = new AgentDashboard();
});