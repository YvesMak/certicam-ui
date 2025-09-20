// Admin Page JavaScript - Modern Design
document.addEventListener('DOMContentLoaded', function() {
    initAdminPage();
    initUserModal();
    initSearch();
    initSorting();
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

let currentSortColumn = 'lastActivity';
let currentSortDirection = 'desc';
let isEditMode = false;
let editingUserId = null;

// Initialisation de la page admin
function initAdminPage() {
    console.log('Initialisation de la page admin moderne...');
    renderUsersTable();
    updatePageStats();
    
    // Initialiser l'état du tri par défaut
    updateSortIcon('lastActivity');
    
    // Event listeners pour les boutons
    const addUserBtn = document.getElementById('add-user');
    if (addUserBtn) {
        addUserBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('Add user button clicked');
            openAddUserModal();
        });
        console.log('✅ Add user button event listener attached');
    } else {
        console.error('❌ Add user button not found!');
    }
    
    // Event listener pour le bouton filtres
    const filtersBtn = document.getElementById('admin-filters');
    if (filtersBtn) {
        filtersBtn.addEventListener('click', toggleFilters);
    }
    
    // Event listener pour le bouton exporter
    const exportBtn = document.querySelector('.export-btn');
    if (exportBtn) {
        exportBtn.addEventListener('click', exportUsers);
    }
}

// Initialisation du modal utilisateur
function initUserModal() {
    const modal = document.getElementById('userModal');
    if (!modal) return;
    
    const closeBtn = document.getElementById('close-modal');
    if (closeBtn) {
        closeBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            closeUserModal();
        });
    }
    
    const cancelBtn = document.getElementById('cancel-user');
    if (cancelBtn) {
        cancelBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            closeUserModal();
        });
    }
    
    // Fermer en cliquant sur l'overlay (mais pas sur le contenu)
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeUserModal();
        }
    });
    
    // Empêcher la fermeture en cliquant sur le contenu du modal
    const modalContainer = modal.querySelector('.modal-container');
    if (modalContainer) {
        modalContainer.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    }
    
    const saveBtn = document.getElementById('save-user');
    if (saveBtn) {
        saveBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('💾 Bouton Enregistrer cliqué');
            console.log('Mode édition:', isEditMode);
            console.log('ID édition:', editingUserId);
            
            if (isEditMode) {
                updateUser();
            } else {
                saveUser();
            }
        });
    }
}

// Initialisation de la recherche
function initSearch() {
    const searchInput = document.getElementById('admin-search');
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            const searchTerm = e.target.value.toLowerCase();
            filterUsers(searchTerm);
        });
    }
}

// Initialisation du tri
function initSorting() {
    const sortableHeaders = document.querySelectorAll('.sortable');
    sortableHeaders.forEach(header => {
        header.addEventListener('click', function() {
            const column = this.classList.contains('col-activity') ? 'lastActivity' : 'name';
            sortUsers(column);
        });
    });
}

// Rendre le tableau des utilisateurs
function renderUsersTable() {
    const tbody = document.querySelector('.data-table tbody');
    if (!tbody) return;

    tbody.innerHTML = '';
    
    users.forEach(user => {
        const row = createUserRow(user);
        tbody.appendChild(row);
    });
}

// Créer une ligne utilisateur
function createUserRow(user) {
    const row = document.createElement('tr');
    row.className = 'table-row';
    
    // Séparer la date et l'heure de l'activité
    const activityParts = user.lastActivity.split(' - ');
    const activityDate = activityParts[0] || user.lastActivity;
    const activityTime = activityParts[1] || '';
    
    row.innerHTML = `
        <td class="user-cell">
            <div class="user-profile">
                <div class="user-avatar">
                    <img src="${user.avatar}" alt="${user.name}">
                </div>
                <div class="user-info">
                    <div class="user-name">${user.name}</div>
                    <div class="user-email">${user.email}</div>
                </div>
            </div>
        </td>
        <td class="access-cell">
            <span class="access-chip ${user.access}-chip">${user.access === 'admin' ? 'Admin' : 'Agent'}</span>
        </td>
        <td class="activity-cell">
            <div class="activity-info">
                <span class="activity-date">${activityDate}</span>
                ${activityTime ? `<span class="activity-time">${activityTime}</span>` : ''}
            </div>
        </td>
        <td class="date-cell">${user.dateAdded}</td>
        <td class="actions-cell">
            <div class="table-actions">
                <button class="action-btn edit-action" title="Modifier" onclick="editUser(${user.id})">
                    <i class="fi fi-rr-edit"></i>
                </button>
                <button class="action-btn delete-action" title="Supprimer" onclick="deleteUser(${user.id})">
                    <i class="fi fi-rr-trash"></i>
                </button>
            </div>
        </td>
    `;
    
    return row;
}

// Filtrer les utilisateurs
function filterUsers(searchTerm) {
    const rows = document.querySelectorAll('.table-row');
    
    rows.forEach(row => {
        const userName = row.querySelector('.user-name').textContent.toLowerCase();
        const userEmail = row.querySelector('.user-email').textContent.toLowerCase();
        
        if (userName.includes(searchTerm) || userEmail.includes(searchTerm)) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

// Trier les utilisateurs
function sortUsers(column) {
    // Changer la direction si on clique sur la même colonne
    if (currentSortColumn === column) {
        currentSortDirection = currentSortDirection === 'asc' ? 'desc' : 'asc';
    } else {
        currentSortColumn = column;
        currentSortDirection = 'asc';
    }
    
    users.sort((a, b) => {
        let aValue = a[column];
        let bValue = b[column];
        
        if (column === 'lastActivity' || column === 'dateAdded') {
            aValue = parseDate(aValue);
            bValue = parseDate(bValue);
        } else if (column === 'name') {
            aValue = aValue.toLowerCase();
            bValue = bValue.toLowerCase();
        }
        
        if (aValue < bValue) return currentSortDirection === 'asc' ? -1 : 1;
        if (aValue > bValue) return currentSortDirection === 'asc' ? 1 : -1;
        return 0;
    });
    
    updateSortIcon(column);
    renderUsersTable();
}

// Mettre à jour l'icône de tri
function updateSortIcon(column) {
    const headers = document.querySelectorAll('.sortable');
    
    headers.forEach(header => {
        const icon = header.querySelector('.sort-icon');
        
        // Retirer la classe active de tous les headers
        header.classList.remove('active');
        
        if (icon) {
            if (header.classList.contains('col-activity') && column === 'lastActivity') {
                // Ajouter la classe active
                header.classList.add('active');
                icon.className = currentSortDirection === 'asc' ? 'fi fi-rr-arrow-small-up sort-icon' : 'fi fi-rr-arrow-small-down sort-icon';
            } else {
                icon.className = 'fi fi-rr-arrow-small-down sort-icon';
            }
        }
    });
}

// Parser une date française
function parseDate(dateString) {
    if (!dateString || dateString === 'Jamais connecté') {
        return new Date(0);
    }
    
    const months = {
        'janvier': 0, 'février': 1, 'mars': 2, 'avril': 3, 'mai': 4, 'juin': 5,
        'juillet': 6, 'août': 7, 'septembre': 8, 'octobre': 9, 'novembre': 10, 'décembre': 11
    };
    
    let cleanDate = dateString.split(' - ')[0];
    const parts = cleanDate.split(' ');
    
    if (parts.length >= 3) {
        const day = parseInt(parts[0]);
        const month = months[parts[1].toLowerCase()];
        const year = parseInt(parts[2]);
        return new Date(year, month, day);
    }
    
    return new Date(0);
}

// Ouvrir le modal d'ajout d'utilisateur
function openAddUserModal() {
    console.log('🚀 Opening add user modal...');
    isEditMode = false;
    editingUserId = null;
    
    const modal = document.getElementById('userModal');
    const modalTitle = document.getElementById('modal-title');
    const form = document.getElementById('user-form');
    
    if (modalTitle) {
        modalTitle.textContent = 'Ajouter un utilisateur';
    }
    
    if (form) {
        form.reset();
    }
    
    if (modal) {
        // Supprimer d'abord toute classe ou style existant
        modal.classList.remove('show');
        modal.style.display = 'none';
        
        // Forcer le recalcul de style
        modal.offsetHeight;
        
        // Ajouter un petit délai pour éviter les conflits d'événements
        setTimeout(() => {
            // Ajouter la classe et le style
            modal.classList.add('show');
            modal.style.display = 'flex';
            modal.style.position = 'fixed';
            modal.style.top = '0';
            modal.style.left = '0';
            modal.style.width = '100%';
            modal.style.height = '100%';
            modal.style.zIndex = '99999';
            modal.style.backgroundColor = 'rgba(0, 0, 0, 0.6)';
            
            console.log('✅ Modal should be visible now');
            console.log('Modal classList:', modal.classList.toString());
            console.log('Modal computed style:', window.getComputedStyle(modal).display);
        }, 50);
    } else {
        console.error('❌ Modal element not found!');
    }
}

// Modifier un utilisateur
function editUser(userId) {
    isEditMode = true;
    editingUserId = userId;
    
    const user = users.find(u => u.id === userId);
    if (!user) return;
    
    const modal = document.getElementById('userModal');
    const modalTitle = document.getElementById('modal-title');
    
    if (modalTitle) {
        modalTitle.textContent = 'Modifier l\'utilisateur';
    }
    
    // Pré-remplir le formulaire
    document.getElementById('user-name').value = user.name;
    document.getElementById('user-email').value = user.email;
    document.getElementById('user-address').value = user.address;
    document.getElementById('user-password').value = '';
    document.getElementById('access-level').value = user.access;
    
    if (modal) {
        modal.classList.add('show');
        modal.style.display = 'flex';
    }
}

// Supprimer un utilisateur
function deleteUser(userId) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
        users = users.filter(u => u.id !== userId);
        renderUsersTable();
        updatePageStats();
        
        // Afficher notification
        showNotification('Utilisateur supprimé avec succès', 'success');
    }
}

// Fermer le modal
function closeUserModal() {
    const modal = document.getElementById('userModal');
    if (modal) {
        modal.classList.remove('show');
        modal.style.display = 'none';
    }
}

// Sauvegarder un utilisateur
function saveUser() {
    console.log('💾 Sauvegarde utilisateur...');
    const form = document.getElementById('user-form');
    if (!form) {
        console.error('❌ Formulaire non trouvé');
        return;
    }
    
    const formData = new FormData(form);
    
    const userData = {
        name: formData.get('name'),
        email: formData.get('email'),
        address: formData.get('address'),
        password: formData.get('password'),
        access: formData.get('access')
    };
    
    console.log('📝 Données du formulaire:', userData);
    
    // Validation basique
    if (!userData.name || !userData.email || !userData.address || !userData.access) {
        alert('Veuillez remplir tous les champs obligatoires');
        return;
    }
    
    if (!userData.password && !isEditMode) {
        alert('Le mot de passe est requis pour un nouvel utilisateur');
        return;
    }
    
    const currentDate = new Date();
    const dateString = `${currentDate.getDate()} ${getMonthName(currentDate.getMonth())} ${currentDate.getFullYear()}`;
    
    // Ajouter un nouvel utilisateur
    const newUser = {
        id: Math.max(...users.map(u => u.id)) + 1,
        ...userData,
        lastActivity: 'Jamais connecté',
        dateAdded: dateString,
        avatar: 'img/coco-profile.jpg'
    };
    
    users.push(newUser);
    console.log('✅ Nouvel utilisateur ajouté:', newUser);
    
    renderUsersTable();
    updatePageStats();
    showNotification('Utilisateur ajouté avec succès', 'success');
    closeUserModal();
}

// Mettre à jour un utilisateur existant
function updateUser() {
    console.log('📝 Mise à jour utilisateur...');
    console.log('ID en cours d\'édition:', editingUserId);
    
    const form = document.getElementById('user-form');
    if (!form) {
        console.error('❌ Formulaire non trouvé');
        return;
    }
    
    const formData = new FormData(form);
    
    const userData = {
        name: formData.get('name'),
        email: formData.get('email'),
        address: formData.get('address'),
        password: formData.get('password'),
        access: formData.get('access')
    };
    
    console.log('📝 Données de mise à jour:', userData);
    
    // Validation basique
    if (!userData.name || !userData.email || !userData.address || !userData.access) {
        alert('Veuillez remplir tous les champs obligatoires');
        return;
    }
    
    // Trouver et mettre à jour l'utilisateur
    const userIndex = users.findIndex(u => u.id === editingUserId);
    if (userIndex !== -1) {
        const existingUser = users[userIndex];
        users[userIndex] = {
            ...existingUser,
            ...userData,
            password: userData.password || existingUser.password
        };
        
        console.log('✅ Utilisateur mis à jour:', users[userIndex]);
        
        renderUsersTable();
        updatePageStats();
        showNotification('Utilisateur modifié avec succès', 'success');
        closeUserModal();
    } else {
        console.error('❌ Utilisateur non trouvé pour mise à jour');
        alert('Erreur: Utilisateur non trouvé');
    }
}

// Obtenir le nom du mois
function getMonthName(monthIndex) {
    const months = [
        'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
        'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
    ];
    return months[monthIndex];
}

// Mettre à jour les statistiques de la page
function updatePageStats() {
    const totalUsers = users.length;
    const adminCount = users.filter(u => u.access === 'admin').length;
    const agentCount = users.filter(u => u.access === 'agent').length;
    
    // Mettre à jour les chiffres dans l'en-tête
    const statNumbers = document.querySelectorAll('.stat-number');
    if (statNumbers.length >= 3) {
        statNumbers[0].textContent = totalUsers.toString().padStart(2, '0');
        statNumbers[1].textContent = adminCount.toString().padStart(2, '0');
        statNumbers[2].textContent = agentCount.toString().padStart(2, '0');
    }
}

// Afficher une notification
function showNotification(message, type = 'info') {
    // Utiliser le système de notification existant s'il est disponible
    if (window.Certicam && window.Certicam.showNotification) {
        window.Certicam.showNotification(message, type);
    } else {
        // Fallback simple
        alert(message);
    }
}

// Fonction pour basculer les filtres
function toggleFilters() {
    // Créer un modal de filtres simple
    const existingFilterModal = document.getElementById('filterModal');
    if (existingFilterModal) {
        existingFilterModal.classList.add('show');
        existingFilterModal.style.display = 'flex';
        return;
    }
    
    // Créer le modal de filtres
    const filterModal = document.createElement('div');
    filterModal.id = 'filterModal';
    filterModal.className = 'modal-overlay';
    filterModal.innerHTML = `
        <div class="modal-container" style="max-width: 400px;">
            <div class="modal-header">
                <div class="modal-title">
                    <h3>Filtres avancés</h3>
                    <p class="modal-subtitle">Filtrer les utilisateurs</p>
                </div>
                <button class="modal-close">
                    <i class="fi fi-rr-cross"></i>
                </button>
            </div>
            
            <div class="modal-content">
                <div class="input-group">
                    <label class="input-label">Niveau d'accès</label>
                    <select id="filter-access" class="form-select">
                        <option value="">Tous les niveaux</option>
                        <option value="admin">Administrateurs</option>
                        <option value="agent">Agents</option>
                    </select>
                </div>
                
                <div class="input-group">
                    <label class="input-label">Dernière activité</label>
                    <select id="filter-activity" class="form-select">
                        <option value="">Toutes les activités</option>
                        <option value="today">Aujourd'hui</option>
                        <option value="week">Cette semaine</option>
                        <option value="month">Ce mois</option>
                        <option value="never">Jamais connecté</option>
                    </select>
                </div>
            </div>
            
            <div class="modal-footer">
                <button class="btn-secondary">
                    <span>Réinitialiser</span>
                </button>
                <button class="btn-primary">
                    <i class="fi fi-rr-check"></i>
                    <span>Appliquer</span>
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(filterModal);
    
    // Attacher les événements aux boutons du modal
    const closeBtn = filterModal.querySelector('.modal-close');
    const resetBtn = filterModal.querySelector('.btn-secondary');
    const applyBtn = filterModal.querySelector('.btn-primary');
    
    if (closeBtn) {
        closeBtn.addEventListener('click', closeFilterModal);
    }
    if (resetBtn) {
        resetBtn.addEventListener('click', resetFilters);
    }
    if (applyBtn) {
        applyBtn.addEventListener('click', applyFilters);
    }
    
    // Fermer en cliquant à l'extérieur
    filterModal.addEventListener('click', function(e) {
        if (e.target === filterModal) {
            closeFilterModal();
        }
    });
    
    // Afficher le modal
    setTimeout(() => {
        filterModal.classList.add('show');
        filterModal.style.display = 'flex';
    }, 10);
}

// Fermer le modal de filtres
function closeFilterModal() {
    const filterModal = document.getElementById('filterModal');
    if (filterModal) {
        filterModal.classList.remove('show');
        filterModal.style.display = 'none';
    }
}

// Réinitialiser les filtres
function resetFilters() {
    document.getElementById('filter-access').value = '';
    document.getElementById('filter-activity').value = '';
    
    // Réafficher toutes les lignes
    const rows = document.querySelectorAll('.table-row');
    rows.forEach(row => row.style.display = '');
    
    showNotification('Filtres réinitialisés', 'success');
    closeFilterModal();
}

// Appliquer les filtres
function applyFilters() {
    const accessFilter = document.getElementById('filter-access').value;
    const activityFilter = document.getElementById('filter-activity').value;
    
    const rows = document.querySelectorAll('.table-row');
    let visibleCount = 0;
    
    rows.forEach(row => {
        let showRow = true;
        
        // Filtre par niveau d'accès
        if (accessFilter) {
            const accessChip = row.querySelector('.access-chip');
            const userAccess = accessChip.textContent.toLowerCase();
            if (!userAccess.includes(accessFilter)) {
                showRow = false;
            }
        }
        
        // Filtre par activité (simplifié pour demo)
        if (activityFilter && showRow) {
            const activityText = row.querySelector('.activity-date').textContent;
            if (activityFilter === 'never' && !activityText.includes('Jamais')) {
                showRow = false;
            } else if (activityFilter === 'today' && !activityText.includes('16 Juin 2025')) {
                showRow = false;
            }
        }
        
        row.style.display = showRow ? '' : 'none';
        if (showRow) visibleCount++;
    });
    
    showNotification(`Filtres appliqués - ${visibleCount} utilisateur(s) affiché(s)`, 'success');
    closeFilterModal();
}

// Fonction d'export des utilisateurs
function exportUsers() {
    // Préparer les données à exporter
    const exportData = users.map(user => ({
        'Nom': user.name,
        'Email': user.email,
        'Adresse': user.address,
        'Niveau d\'accès': user.access === 'admin' ? 'Administrateur' : 'Agent',
        'Dernière activité': user.lastActivity,
        'Date d\'ajout': user.dateAdded
    }));
    
    // Créer le contenu CSV
    const headers = Object.keys(exportData[0]);
    const csvContent = [
        headers.join(','),
        ...exportData.map(row => 
            headers.map(header => `"${row[header]}"`).join(',')
        )
    ].join('\n');
    
    // Créer et déclencher le téléchargement
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `certicam-utilisateurs-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showNotification('Export des utilisateurs réussi', 'success');
}

// Améliorer la fonction editUser pour une meilleure UX
function editUser(userId) {
    isEditMode = true;
    editingUserId = userId;
    
    const user = users.find(u => u.id === userId);
    if (!user) {
        showNotification('Utilisateur non trouvé', 'error');
        return;
    }
    
    const modal = document.getElementById('userModal');
    const modalTitle = document.getElementById('modal-title');
    
    if (modalTitle) {
        modalTitle.textContent = `Modifier ${user.name}`;
    }
    
    // Pré-remplir le formulaire avec animation
    setTimeout(() => {
        document.getElementById('user-name').value = user.name;
        document.getElementById('user-email').value = user.email;
        document.getElementById('user-address').value = user.address;
        document.getElementById('user-password').value = '';
        document.getElementById('user-password').placeholder = 'Laisser vide pour conserver le mot de passe actuel';
        document.getElementById('access-level').value = user.access;
    }, 50);
    
    if (modal) {
        modal.classList.add('show');
        modal.style.display = 'flex';
    }
}