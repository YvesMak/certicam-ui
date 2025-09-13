// Admin Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    initAdminPage();
    initUserModal();
    initSearch();
});

// Variables globales
let users = [
    {
        id: 1,
        name: 'Rico Tangana',
        email: 'ricotangana@banquexyz.com',
        address: '123 Rue de la Banque, Yaoundé',
        password: '********',
        access: 'admin',
        lastActivity: '16 Juin 2025 - 12:34',
        dateAdded: '11 Mai 2025',
        avatar: 'img/coco-profile.jpg'
    },
    {
        id: 2,
        name: 'Raphael Onana',
        email: 'raphael.onana@banquexyz.com',
        address: '456 Avenue des Finances, Douala',
        password: '********',
        access: 'agent',
        lastActivity: '16 Juin 2025 - 17:25',
        dateAdded: '11 Mai 2025',
        avatar: 'img/coco-profile.jpg'
    },
    {
        id: 3,
        name: 'Joel Benini',
        email: 'joel.benini@banquexyz.com',
        address: '789 Boulevard du Commerce, Bafoussam',
        password: '********',
        access: 'agent',
        lastActivity: '16 Juin 2025 - 15:03',
        dateAdded: '11 Mai 2025',
        avatar: 'img/coco-profile.jpg'
    },
    {
        id: 4,
        name: 'Henriette Kong',
        email: 'henriette.kong@banquexyz.com',
        address: '321 Place des Affaires, Garoua',
        password: '********',
        access: 'agent',
        lastActivity: '16 Juin 2025 - 12:40',
        dateAdded: '11 Mai 2025',
        avatar: 'img/coco-profile.jpg'
    }
];

let filteredUsers = [...users];
let editingUserId = null;
let currentSort = { column: null, direction: 'asc' };

// Initialiser la page admin
function initAdminPage() {
    renderUsersTable();
    updateStats();
    attachEventListeners();
    initSorting();
}

// Attacher les écouteurs d'événements
function attachEventListeners() {
    const addUserBtn = document.getElementById('add-user');
    if (addUserBtn) {
        addUserBtn.addEventListener('click', () => {
            openUserModal();
        });
    }

    // Bouton filtres (pour l'instant juste un placeholder)
    const filtersBtn = document.getElementById('admin-filters');
    if (filtersBtn) {
        filtersBtn.addEventListener('click', () => {
            alert('Fonctionnalité de filtres à venir...');
        });
    }
}

// Affichage du tableau
function renderUsersTable() {
    const tbody = document.querySelector('.admin-table tbody');
    if (!tbody) return;

    tbody.innerHTML = filteredUsers.map(user => `
        <tr>
            <td>
                <div class="user-info">
                    <img src="${user.avatar}" alt="${user.name}" class="user-avatar">
                    <div class="user-details">
                        <h4>${user.name}</h4>
                        <p class="user-email">${user.email}</p>
                    </div>
                </div>
            </td>
            <td>
                <span class="access-badge ${user.access}">${user.access === 'admin' ? 'Admin' : 'Agent'}</span>
            </td>
            <td>${user.lastActivity}</td>
            <td>${user.dateAdded}</td>
            <td class="actions">
                <div class="table-actions">
                    <button class="action-btn edit" onclick="editUser(${user.id})" title="Modifier">
                        <i class="fi fi-rr-edit"></i>
                    </button>
                    ${user.access !== 'admin' ? `<button class="action-btn delete" onclick="confirmDelete(${user.id})" title="Supprimer">
                        <i class="fi fi-rr-trash"></i>
                    </button>` : ''}
                </div>
            </td>
        </tr>
    `).join('');
}

// Mettre à jour les statistiques
function updateStats() {
    const statsElement = document.querySelector('.stats-text');
    if (statsElement) {
        const totalUsers = users.length;
        const adminCount = users.filter(u => u.access === 'admin').length;
        const agentCount = users.filter(u => u.access === 'agent').length;
        
        statsElement.textContent = `${totalUsers.toString().padStart(2, '0')} Utilisateurs (${adminCount.toString().padStart(2, '0')} Admin, ${agentCount.toString().padStart(2, '0')} agents)`;
    }
}

// Recherche
function initSearch() {
    const searchInput = document.getElementById('admin-search');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase().trim();
            
            if (searchTerm === '') {
                filteredUsers = [...users];
            } else {
                filteredUsers = users.filter(user => 
                    user.name.toLowerCase().includes(searchTerm) ||
                    user.email.toLowerCase().includes(searchTerm)
                );
            }
            
            renderUsersTable();
            updateStats();
        });
    }
}

// Modal utilisateur
function initUserModal() {
    const modal = document.getElementById('user-modal');
    const closeBtn = document.getElementById('close-modal');
    const cancelBtn = document.getElementById('cancel-user');
    const saveBtn = document.getElementById('save-user');

    // Fermer le modal
    [closeBtn, cancelBtn].forEach(btn => {
        if (btn) {
            btn.addEventListener('click', closeUserModal);
        }
    });

    // Fermer en cliquant à l'extérieur
    modal?.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeUserModal();
        }
    });

    // Fermer avec la touche Échap
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.style.display === 'flex') {
            closeUserModal();
        }
    });

    // Sauvegarder
    saveBtn?.addEventListener('click', saveUser);
}

// Ouvrir le modal utilisateur
function openUserModal(userId = null) {
    const modal = document.getElementById('user-modal');
    const modalTitle = document.getElementById('modal-title');

    if (userId) {
        // Mode édition
        editingUserId = userId;
        const user = users.find(u => u.id === userId);
        if (user) {
            modalTitle.textContent = 'Modifier l\'utilisateur';
            document.getElementById('user-name').value = user.name;
            document.getElementById('user-email').value = user.email;
            document.getElementById('user-address').value = user.address;
            document.getElementById('user-password').value = user.password;
            document.getElementById('access-level').value = user.access;
        }
    } else {
        // Mode création
        editingUserId = null;
        modalTitle.textContent = 'Ajouter un utilisateur';
        resetForm();
    }

    modal.style.display = 'flex';
}

// Fermer le modal utilisateur
function closeUserModal() {
    const modal = document.getElementById('user-modal');
    modal.style.display = 'none';
    resetForm();
    editingUserId = null;
}

// Réinitialiser le formulaire
function resetForm() {
    const form = document.getElementById('user-form');
    if (form) {
        form.reset();
    }
}

// Sauvegarder l'utilisateur
function saveUser() {
    const name = document.getElementById('user-name').value.trim();
    const email = document.getElementById('user-email').value.trim();
    const address = document.getElementById('user-address').value.trim();
    const password = document.getElementById('user-password').value.trim();
    const access = document.getElementById('access-level').value;

    // Validation
    if (!name || !email || !address || !password || !access) {
        alert('Veuillez remplir tous les champs.');
        return;
    }

    // Validation email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('Veuillez entrer une adresse email valide.');
        return;
    }

    // Vérifier si l'email existe déjà
    const existingUser = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.id !== editingUserId);
    if (existingUser) {
        alert('Cette adresse email est déjà utilisée.');
        return;
    }

    if (editingUserId) {
        // Modifier l'utilisateur existant
        const userIndex = users.findIndex(u => u.id === editingUserId);
        if (userIndex !== -1) {
            users[userIndex] = {
                ...users[userIndex],
                name,
                email,
                address,
                password: password === '********' ? users[userIndex].password : password,
                access
            };
        }
    } else {
        // Ajouter un nouvel utilisateur
        const newUser = {
            id: Math.max(...users.map(u => u.id)) + 1,
            name,
            email,
            address,
            password,
            access,
            lastActivity: 'Jamais connecté',
            dateAdded: new Date().toLocaleDateString('fr-FR', {
                day: '2-digit',
                month: 'long',
                year: 'numeric'
            }),
            avatar: 'img/coco-profile.jpg'
        };
        users.push(newUser);
    }

    // Mettre à jour l'affichage
    filteredUsers = [...users];
    renderUsersTable();
    updateStats();
    closeUserModal();
    
    // Notification de succès
    showNotification(editingUserId ? 'Utilisateur modifié avec succès' : 'Utilisateur ajouté avec succès', 'success');
}

// Éditer un utilisateur
function editUser(userId) {
    openUserModal(userId);
}

// Confirmer la suppression
function confirmDelete(userId) {
    const user = users.find(u => u.id === userId);
    if (user && user.access === 'admin') {
        alert('Impossible de supprimer un administrateur.');
        return;
    }
    
    if (user && confirm(`Êtes-vous sûr de vouloir supprimer l'utilisateur "${user.name}" ?`)) {
        deleteUser(userId);
    }
}

// Supprimer un utilisateur
function deleteUser(userId) {
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex !== -1) {
        users.splice(userIndex, 1);
        filteredUsers = [...users];
        renderUsersTable();
        updateStats();
        showNotification('Utilisateur supprimé avec succès', 'success');
    }
}

// Afficher une notification
function showNotification(message, type = 'info') {
    // Supprimer les notifications existantes
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(n => n.remove());

    // Créer la notification
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Animation d'apparition
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Suppression automatique
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Initialiser le tri des colonnes
function initSorting() {
    const sortableHeaders = document.querySelectorAll('.admin-table th.sortable');
    
    sortableHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const column = header.getAttribute('data-column');
            sortTable(column);
        });
    });
}

// Trier le tableau
function sortTable(column) {
    // Déterminer la direction du tri
    let direction = 'asc';
    if (currentSort.column === column && currentSort.direction === 'asc') {
        direction = 'desc';
    }

    // Mettre à jour l'état du tri
    currentSort = { column, direction };

    // Trier les données
    filteredUsers.sort((a, b) => {
        let aValue = a[column];
        let bValue = b[column];

        // Traitement spécial pour les dates
        if (column === 'lastActivity' || column === 'dateAdded') {
            // Convertir les dates en objets Date pour la comparaison
            if (column === 'lastActivity') {
                if (aValue === 'Jamais connecté') aValue = new Date(0);
                else aValue = parseDate(aValue);
                
                if (bValue === 'Jamais connecté') bValue = new Date(0);
                else bValue = parseDate(bValue);
            } else if (column === 'dateAdded') {
                aValue = parseDate(aValue);
                bValue = parseDate(bValue);
            }
        } else if (column === 'name') {
            // Tri alphabétique pour les noms
            aValue = aValue.toLowerCase();
            bValue = bValue.toLowerCase();
        } else if (column === 'access') {
            // Tri pour les niveaux d'accès (admin avant agent)
            const accessOrder = { 'admin': 0, 'agent': 1 };
            aValue = accessOrder[aValue];
            bValue = accessOrder[bValue];
        }

        // Comparaison
        if (aValue < bValue) return direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return direction === 'asc' ? 1 : -1;
        return 0;
    });

    // Mettre à jour l'affichage des en-têtes
    updateSortingHeaders(column, direction);

    // Re-rendre le tableau
    renderUsersTable();
}

// Mettre à jour l'affichage des en-têtes de tri
function updateSortingHeaders(activeColumn, direction) {
    const sortableHeaders = document.querySelectorAll('.admin-table th.sortable');
    
    sortableHeaders.forEach(header => {
        const column = header.getAttribute('data-column');
        header.classList.remove('sorted-asc', 'sorted-desc');
        
        if (column === activeColumn) {
            header.classList.add(`sorted-${direction}`);
        }
    });
}

// Parser une date au format français
function parseDate(dateString) {
    if (!dateString || dateString === 'Jamais connecté') {
        return new Date(0);
    }

    // Format: "16 Juin 2025 - 12:34" ou "11 Mai 2025"
    const months = {
        'janvier': 0, 'février': 1, 'mars': 2, 'avril': 3, 'mai': 4, 'juin': 5,
        'juillet': 6, 'août': 7, 'septembre': 8, 'octobre': 9, 'novembre': 10, 'décembre': 11
    };

    let cleanDate = dateString.split(' - ')[0]; // Supprimer l'heure si présente
    const parts = cleanDate.split(' ');
    
    if (parts.length >= 3) {
        const day = parseInt(parts[0]);
        const month = months[parts[1].toLowerCase()];
        const year = parseInt(parts[2]);
        return new Date(year, month, day);
    }
    
    return new Date(0);
}
