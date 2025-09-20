// Variables globales pour la pagination des transactions
let transactionCurrentPage = 1;
let transactionRowsPerPage = 8;
let transactionAllRows = [];

// Données de transactions correspondant au screenshot
const transactionData = {
    '5423': {
        number: '5423',
        date: '12 Mai 2025',
        product: 'Relevé bancaire',
        category: 'Banque',
        institution: 'Banque XYZ',
        paymentType: 'Orange Money',
        amount: '1500 FCFA',
        status: 'valid'
    },
    '6534': {
        number: '6534',
        date: '12 Mai 2025',
        product: 'CNI',
        category: 'Identité',
        institution: 'DGSN',
        paymentType: 'Orange Money',
        amount: '1000 FCFA',
        status: 'pending'
    },
    '9823': {
        number: '9823',
        date: '12 Mai 2025',
        product: 'CNI',
        category: 'Identité',
        institution: 'DGSN',
        paymentType: 'Orange Money',
        amount: '1000 FCFA',
        status: 'failed'
    },
    '8734': {
        number: '8734',
        date: '12 Mai 2025',
        product: 'CNI',
        category: 'Identité',
        institution: 'DGSN',
        paymentType: 'Orange Money',
        amount: '1000 FCFA',
        status: 'valid'
    },
    '5143': {
        number: '5143',
        date: '12 Mai 2025',
        product: 'CNI',
        category: 'Identité',
        institution: 'DGSN',
        paymentType: 'Orange Money',
        amount: '1000 FCFA',
        status: 'valid'
    },
    '9082': {
        number: '9082',
        date: '12 Mai 2025',
        product: 'Passeport',
        category: 'Identité',
        institution: 'DGSN',
        paymentType: 'MTN MoMo',
        amount: '2500 FCFA',
        status: 'pending'
    },
    '6237': {
        number: '6237',
        date: '12 Mai 2025',
        product: 'Relevé bancaire',
        category: 'Banque',
        institution: 'Banque ABC',
        paymentType: 'Orange Money',
        amount: '1500 FCFA',
        status: 'failed'
    },
    '4502': {
        number: '4502',
        date: '12 Mai 2025',
        product: 'CNI',
        category: 'Identité',
        institution: 'DGSN',
        paymentType: 'MTN MoMo',
        amount: '1000 FCFA',
        status: 'valid'
    }
};
        product: 'CNI',
        category: 'Identité',
        institution: 'DGSN',
        paymentType: 'Orange Money',
        amount: '1000 FCFA',
        status: 'valid'
    },
    '9082': {
        number: '9082',
        date: '12 Mai 2025',
        product: 'CNI',
        category: 'Identité',
        institution: 'DGSN',
        paymentType: 'Orange Money',
        amount: '1000 FCFA',
        status: 'valid'
    },
    '6237': {
        number: '6237',
        date: '12 Mai 2025',
        product: 'CNI',
        category: 'Identité',
        institution: 'DGSN',
        paymentType: 'Orange Money',
        amount: '1000 FCFA',
        status: 'valid'
    },
    '4502': {
        number: '4502',
        date: '12 Mai 2025',
        product: 'CNI',
        category: 'Identité',
        institution: 'DGSN',
        paymentType: 'Orange Money',
        amount: '1000 FCFA',
        status: 'valid'
    }
};

// Gestion du sélecteur de documents par page
function initTransactionRowsPerPageSelector() {
    const selectorWrapper = document.querySelector('.selector-wrapper');
    const currentSelection = document.querySelector('.current-selection');
    const dropdownItems = document.querySelectorAll('.dropdown-item');

    if (!selectorWrapper || !currentSelection || !dropdownItems.length) {
        console.log('Éléments du sélecteur de transactions introuvables');
        return;
    }

    // Toggle du dropdown au clic sur le sélecteur
    selectorWrapper.addEventListener('click', function(e) {
        e.stopPropagation();
        selectorWrapper.classList.toggle('active');
    });

    // Fermer le dropdown quand on clique ailleurs
    document.addEventListener('click', function(e) {
        if (!selectorWrapper.contains(e.target)) {
            selectorWrapper.classList.remove('active');
        }
    });

    // Gérer la sélection d'un élément
    dropdownItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.stopPropagation();
            const value = this.getAttribute('data-value');
            const text = this.textContent;
            
            currentSelection.textContent = text;
            selectorWrapper.classList.remove('active');
            
            // Mettre à jour le nombre de lignes par page
            transactionRowsPerPage = parseInt(value);
            
            // Réafficher les transactions avec le nouveau nombre
            displayTransactionPage(transactionCurrentPage);
        });
    });
}

// Gestion des filtres
function initTransactionFilters() {
    const filterToggle = document.getElementById('transaction-filter-toggle');
    const filterPanel = document.getElementById('transaction-filter-panel');
    const filterClose = document.getElementById('transaction-filter-close');
    const applyFilters = document.getElementById('transaction-apply-filters');
    const resetFilters = document.getElementById('transaction-reset-filters');

    if (!filterToggle || !filterPanel) return;

    // Ouvrir le panneau de filtres
    filterToggle.addEventListener('click', function() {
        filterPanel.classList.add('active');
    });

    // Fermer le panneau de filtres
    if (filterClose) {
        filterClose.addEventListener('click', function() {
            filterPanel.classList.remove('active');
        });
    }

    // Appliquer les filtres
    if (applyFilters) {
        applyFilters.addEventListener('click', function() {
            applyTransactionFilters();
            filterPanel.classList.remove('active');
        });
    }

    // Réinitialiser les filtres
    if (resetFilters) {
        resetFilters.addEventListener('click', function() {
            resetTransactionFilters();
        });
    }

    // Fermer en cliquant en dehors
    filterPanel.addEventListener('click', function(e) {
        if (e.target === filterPanel) {
            filterPanel.classList.remove('active');
        }
    });
}

// Appliquer les filtres
function applyTransactionFilters() {
    const statusFilter = document.querySelector('input[name="transaction-status-filter"]:checked')?.value || 'all';
    const paymentFilter = document.querySelector('input[name="transaction-payment-filter"]:checked')?.value || 'all';
    const categoryFilter = document.querySelector('input[name="transaction-category-filter"]:checked')?.value || 'all';

    const rows = document.querySelectorAll('.transactions-table tbody tr');
    
    rows.forEach(row => {
        let showRow = true;
        
        // Filtre par statut
        if (statusFilter !== 'all') {
            const status = row.querySelector('.status');
            const statusClass = status.className.split(' ').find(cls => ['valid', 'pending', 'failed'].includes(cls));
            if (statusClass !== statusFilter) {
                showRow = false;
            }
        }

        // Filtre par type de paiement
        if (paymentFilter !== 'all') {
            const paymentType = row.querySelector('.payment-type').textContent.toLowerCase().replace(' ', '-');
            if (!paymentType.includes(paymentFilter.replace('-', ' '))) {
                showRow = false;
            }
        }

        // Filtre par catégorie
        if (categoryFilter !== 'all') {
            const category = row.querySelector('.document-category').textContent;
            if (category !== categoryFilter) {
                showRow = false;
            }
        }

        row.style.display = showRow ? '' : 'none';
    });
}

// Réinitialiser les filtres
function resetTransactionFilters() {
    // Réinitialiser tous les boutons radio
    document.querySelectorAll('input[name^="transaction-"][value="all"]').forEach(radio => {
        radio.checked = true;
    });

    // Afficher toutes les lignes
    document.querySelectorAll('.transactions-table tbody tr').forEach(row => {
        row.style.display = '';
    });
}

// Gestion de la recherche
function initRealTimeFilters() {
    const searchInput = document.getElementById('transaction-search');
    const clearButton = document.getElementById('transaction-search-clear');

    if (!searchInput) return;

    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        const rows = document.querySelectorAll('.transactions-table tbody tr');

        rows.forEach(row => {
            const text = row.textContent.toLowerCase();
            row.style.display = text.includes(searchTerm) ? '' : 'none';
        });

        // Afficher/masquer le bouton de suppression
        if (clearButton) {
            clearButton.style.display = searchTerm ? 'block' : 'none';
        }
    });

    // Vider la recherche
    if (clearButton) {
        clearButton.addEventListener('click', function() {
            searchInput.value = '';
            searchInput.dispatchEvent(new Event('input'));
        });
    }
}

// Gestion du menu mobile
function initTransactionMobileMenu() {
    const menuButton = document.querySelector('.menu-button');
    const mobileMenuOverlay = document.querySelector('.mobile-menu-overlay');
    const mobileMenuClose = document.querySelector('.mobile-menu-close');

    if (!menuButton || !mobileMenuOverlay) return;

    // Ouvrir le menu
    menuButton.addEventListener('click', function() {
        mobileMenuOverlay.classList.add('active');
    });

    // Fermer le menu
    if (mobileMenuClose) {
        mobileMenuClose.addEventListener('click', function() {
            mobileMenuOverlay.classList.remove('active');
        });
    }

    // Fermer en cliquant sur l'overlay
    mobileMenuOverlay.addEventListener('click', function(e) {
        if (e.target === mobileMenuOverlay) {
            mobileMenuOverlay.classList.remove('active');
        }
    });
}

// Gestion de la pagination
function initTransactionPagination() {
    const table = document.querySelector('.transactions-table tbody');
    if (!table) return;

    transactionAllRows = Array.from(table.querySelectorAll('tr'));
    displayTransactionPage(1);
}

function displayTransactionPage(page) {
    const startIndex = (page - 1) * transactionRowsPerPage;
    const endIndex = startIndex + transactionRowsPerPage;

    transactionAllRows.forEach((row, index) => {
        row.style.display = (index >= startIndex && index < endIndex) ? '' : 'none';
    });

    transactionCurrentPage = page;
    updateTransactionPaginationInfo();
}

function updateTransactionPaginationInfo() {
    const totalRows = transactionAllRows.length;
    const startIndex = (transactionCurrentPage - 1) * transactionRowsPerPage + 1;
    const endIndex = Math.min(transactionCurrentPage * transactionRowsPerPage, totalRows);

    const infoElement = document.querySelector('.pagination-info span');
    if (infoElement) {
        infoElement.textContent = `Affichage de ${startIndex}-${endIndex} sur ${totalRows} transactions`;
    }
}

// Gestion des boutons de pagination
function initTransactionPaginationButtons() {
    const prevButton = document.querySelector('.prev-button');
    const nextButton = document.querySelector('.next-button');
    const pageNumbers = document.querySelectorAll('.page-numbers span');

    if (prevButton) {
        prevButton.addEventListener('click', function() {
            if (transactionCurrentPage > 1) {
                displayTransactionPage(transactionCurrentPage - 1);
                updatePageNumbers();
            }
        });
    }

    if (nextButton) {
        nextButton.addEventListener('click', function() {
            const totalPages = Math.ceil(transactionAllRows.length / transactionRowsPerPage);
            if (transactionCurrentPage < totalPages) {
                displayTransactionPage(transactionCurrentPage + 1);
                updatePageNumbers();
            }
        });
    }

    pageNumbers.forEach(pageSpan => {
        if (!pageSpan.classList.contains('dots')) {
            pageSpan.addEventListener('click', function() {
                const pageNum = parseInt(this.textContent);
                if (!isNaN(pageNum)) {
                    displayTransactionPage(pageNum);
                    updatePageNumbers();
                }
            });
        }
    });
}

function updatePageNumbers() {
    const pageNumbers = document.querySelectorAll('.page-numbers span');
    pageNumbers.forEach(span => {
        if (!span.classList.contains('dots')) {
            span.classList.remove('active');
            if (parseInt(span.textContent) === transactionCurrentPage) {
                span.classList.add('active');
            }
        }
    });
}

// Gestion des actions de transaction avec dropdowns intégrés
function attachTransactionButtonEvents() {
    // Gestion des clics sur les boutons dropdown
    document.addEventListener('click', function(e) {
        // Fermer tous les dropdowns ouverts
        document.querySelectorAll('.dropdown-menu.active').forEach(menu => {
            menu.classList.remove('active');
        });

        // Si on a cliqué sur un bouton dropdown
        if (e.target.closest('.dropdown-toggle') || e.target.closest('.action-button')) {
            e.preventDefault();
            e.stopPropagation();
            
            const button = e.target.closest('.dropdown-toggle') || e.target.closest('.action-button');
            const dropdown = button.closest('.dropdown');
            const menu = dropdown.querySelector('.dropdown-menu');
            
            if (menu) {
                menu.classList.add('active');
            }
        }
        
        // Gestion des actions dans les dropdowns
        if (e.target.closest('.dropdown-item')) {
            console.log('Clic détecté sur action dropdown');
            e.preventDefault();
            e.stopPropagation();
            
            const item = e.target.closest('.dropdown-item');
            const dropdown = item.closest('.dropdown');
            const button = dropdown.querySelector('.dropdown-toggle') || dropdown.querySelector('.action-button');
            const transactionId = button.getAttribute('data-transaction');
            const transaction = transactionData[transactionId];
            
            console.log(`Action: ${item.className}, ID: ${transactionId}, Transaction trouvée: ${transaction ? 'OUI' : 'NON'}`);
            
            console.log('Action clicked:', item.className);
            console.log('Transaction ID:', transactionId);
            console.log('Transaction data:', transaction);
            
            // Fermer le dropdown
            dropdown.querySelector('.dropdown-menu').classList.remove('active');
            
            if (item.classList.contains('view-receipt')) {
                console.log('Action "Voir facture" déclenchée');
                console.log('Calling showTransactionReceipt');
                showTransactionReceipt(transaction);
            } else if (item.classList.contains('download-receipt')) {
                downloadReceipt(transaction);
            } else if (item.classList.contains('retry-payment')) {
                showRetryPaymentModal(transaction);
            } else if (item.classList.contains('cancel-transaction')) {
                showCancelTransactionModal(transaction);
            } else if (item.classList.contains('contact-support')) {
                contactSupport(transaction);
            }
        }
    });
}

// Afficher la modale de reçu
function showTransactionReceipt(transaction) {
    console.log('showTransactionReceipt called with:', transaction);
    
    if (!transaction) {
        console.error('Erreur: Aucune donnée de transaction fournie');
        return;
    }
    
    const modal = document.getElementById('receiptModal');
    console.log('Modal element:', modal);
    
    if (!modal) {
        console.error('Erreur: Modal receiptModal non trouvée');
        return;
    }
    
    try {
        // Remplir les données
        document.getElementById('receiptNumber').textContent = `TXN-${transaction.number}`;
        document.getElementById('receiptDate').textContent = transaction.date;
        document.getElementById('receiptService').textContent = transaction.product;
        document.getElementById('receiptInstitution').textContent = transaction.institution;
        document.getElementById('receiptPayment').textContent = transaction.paymentType;
        document.getElementById('receiptAmount').textContent = transaction.amount;
        
        // Statut avec style approprié
        const statusElement = document.getElementById('receiptStatus');
        const statusClass = getStatusClass(transaction.status);
        const statusText = getStatusText(transaction.status);
        statusElement.innerHTML = `<span class="status ${statusClass}">${statusText}</span>`;
        
        console.log('Adding active class to modal');
        // Afficher la modale
        modal.classList.add('active');
        console.log('Modal classes after adding active:', modal.className);
        
        console.log('Modal devrait maintenant être visible');
    } catch (error) {
        console.error('Erreur lors du remplissage de la modal:', error.message);
    }
}

// Fermer la modale de reçu
function closeReceiptModal() {
    const modal = document.getElementById('receiptModal');
    modal.classList.remove('active');
}

// Télécharger le reçu
function downloadReceipt(transaction) {
    // Simulation du téléchargement
    const fileName = `Facture_${transaction.number}_${transaction.date.replace(/ /g, '_')}.pdf`;
    
    // Créer un blob simulé (en production, cela viendrait du serveur)
    const content = generateReceiptContent(transaction);
    const blob = new Blob([content], { type: 'application/pdf' });
    
    // Créer un lien de téléchargement
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = fileName;
    
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
    
    // Notification de succès
    showNotification('Téléchargement du reçu en cours...', 'success');
}

// Générer le contenu du reçu (simulation)
function generateReceiptContent(transaction) {
    return `Reçu de paiement Certicam
Transaction: ${transaction.number}
Date: ${transaction.date}
Service: ${transaction.product}
Institution: ${transaction.institution}
Mode de paiement: ${transaction.paymentType}
Montant: ${transaction.amount}
Statut: ${getStatusText(transaction.status)}

Merci d'avoir utilisé Certicam !`;
}

// Afficher la modale de confirmation d'action
function showActionModal(title, message, actionCallback) {
    const modal = document.getElementById('actionModal');
    document.getElementById('actionModalTitle').textContent = title;
    document.getElementById('actionModalMessage').textContent = message;
    
    // Stocker le callback pour l'utiliser lors de la confirmation
    modal.actionCallback = actionCallback;
    
    modal.classList.add('active');
}

// Relancer un paiement échoué
function showRetryPaymentModal(transaction) {
    showActionModal(
        'Relancer le paiement', 
        `Voulez-vous relancer le paiement pour la transaction ${transaction.number} ?`,
        () => retryPayment(transaction)
    );
}

function retryPayment(transaction) {
    // Simulation du relancement
    showNotification(`Relancement du paiement pour la transaction ${transaction.number}...`, 'info');
    
    // En production, faire appel à l'API
    setTimeout(() => {
        showNotification('Le paiement a été relancé avec succès !', 'success');
        // Actualiser le statut dans l'interface
        updateTransactionStatus(transaction.number, 'pending');
    }, 2000);
}

// Annuler une transaction en cours
function showCancelTransactionModal(transaction) {
    showActionModal(
        'Annuler la transaction', 
        `Êtes-vous sûr de vouloir annuler la transaction ${transaction.number} ?`,
        () => cancelTransaction(transaction)
    );
}

function cancelTransaction(transaction) {
    showNotification(`Annulation de la transaction ${transaction.number}...`, 'info');
    
    setTimeout(() => {
        showNotification('Transaction annulée avec succès !', 'success');
        updateTransactionStatus(transaction.number, 'failed');
    }, 1500);
}

// Contacter le support
function contactSupport(transaction) {
    const subject = encodeURIComponent(`Support - Transaction ${transaction.number}`);
    const body = encodeURIComponent(`Bonjour,\n\nJ'ai besoin d'aide concernant la transaction ${transaction.number} du ${transaction.date}.\n\nCordialement`);
    
    window.open(`mailto:support@certicam.com?subject=${subject}&body=${body}`);
    showNotification('Ouverture de votre client email...', 'info');
}

// Utilitaires pour les statuts
function getStatusClass(status) {
    const statusMap = {
        'valid': 'valid',
        'pending': 'pending', 
        'failed': 'failed',
        'not-valid': 'not-valid'
    };
    return statusMap[status] || 'pending';
}

function getStatusText(status) {
    const statusMap = {
        'valid': 'Réussite',
        'pending': 'En cours',
        'failed': 'Échec',
        'not-valid': 'Échec'
    };
    return statusMap[status] || 'En cours';
}

// Mettre à jour le statut d'une transaction dans l'interface
function updateTransactionStatus(transactionNumber, newStatus) {
    // Mettre à jour dans les données
    if (transactionData[transactionNumber]) {
        transactionData[transactionNumber].status = newStatus;
    }
    
    // Mettre à jour dans l'interface
    const button = document.querySelector(`[data-transaction="${transactionNumber}"]`);
    if (button) {
        const row = button.closest('tr');
        const statusCell = row.querySelector('.status');
        if (statusCell) {
            const statusClass = getStatusClass(newStatus);
            const statusText = getStatusText(newStatus);
            statusCell.className = `status ${statusClass}`;
            statusCell.textContent = statusText;
        }
    }
}

// Afficher une notification
function showNotification(message, type = 'info') {
    // Créer la notification
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fi fi-rr-${type === 'success' ? 'check' : type === 'error' ? 'cross' : 'info'}"></i>
        <span>${message}</span>
    `;
    
    // Ajouter au DOM
    document.body.appendChild(notification);
    
    // Animation d'entrée
    setTimeout(() => notification.classList.add('show'), 100);
    
    // Suppression automatique
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => document.body.removeChild(notification), 300);
    }, 4000);
}

// Afficher les détails d'une transaction
function showTransactionDetails(transaction) {
    if (!transaction) return;
    
    const modal = document.getElementById('action-modal');
    const title = document.getElementById('modal-title');
    const message = document.getElementById('modal-message');
    const confirmBtn = document.getElementById('modal-confirm');
    const cancelBtn = document.getElementById('modal-cancel');
    
    if (!modal) {
        alert(`Détails de la transaction ${transaction.number}:\n\nProduit: ${transaction.product}\nInstitution: ${transaction.institution}\nDate: ${transaction.date}\nMontant: ${transaction.amount}\nMode de paiement: ${transaction.paymentType}\nStatut: ${getStatusLabel(transaction.status)}`);
        return;
    }
    
    title.textContent = `Transaction ${transaction.number}`;
    message.innerHTML = `
        <div style="text-align: left;">
            <p><strong>Produit:</strong> ${transaction.product}</p>
            <p><strong>Institution:</strong> ${transaction.institution}</p>
            <p><strong>Date:</strong> ${transaction.date}</p>
            <p><strong>Montant:</strong> ${transaction.amount}</p>
            <p><strong>Mode de paiement:</strong> ${transaction.paymentType}</p>
            <p><strong>Statut:</strong> ${getStatusLabel(transaction.status)}</p>
        </div>
    `;
    
    confirmBtn.textContent = 'Fermer';
    confirmBtn.onclick = () => modal.classList.remove('active');
    cancelBtn.style.display = 'none';
    
    modal.classList.add('active');
}

// Télécharger le reçu
function downloadReceipt(transaction) {
    if (!transaction) return;
    
    const modal = document.getElementById('action-modal');
    if (!modal) {
        alert(`Téléchargement du reçu pour la transaction ${transaction.number} en cours...`);
        return;
    }
    
    const title = document.getElementById('modal-title');
    const message = document.getElementById('modal-message');
    const confirmBtn = document.getElementById('modal-confirm');
    const cancelBtn = document.getElementById('modal-cancel');
    
    title.textContent = 'Télécharger le reçu';
    message.textContent = `Voulez-vous télécharger le reçu de la transaction ${transaction.number} ?`;
    
    confirmBtn.textContent = 'Télécharger';
    confirmBtn.onclick = () => {
        alert(`Téléchargement du reçu pour la transaction ${transaction.number} en cours...`);
        modal.classList.remove('active');
    };
    
    cancelBtn.style.display = 'inline-block';
    cancelBtn.onclick = () => modal.classList.remove('active');
    
    modal.classList.add('active');
}

// Réessayer le paiement
function retryPayment(transaction) {
    if (!transaction) return;
    
    const modal = document.getElementById('action-modal');
    if (!modal) {
        alert(`Relance du paiement pour la transaction ${transaction.number}...`);
        return;
    }
    
    const title = document.getElementById('modal-title');
    const message = document.getElementById('modal-message');
    const confirmBtn = document.getElementById('modal-confirm');
    const cancelBtn = document.getElementById('modal-cancel');
    
    title.textContent = 'Réessayer le paiement';
    message.textContent = `Voulez-vous relancer le paiement pour la transaction ${transaction.number} ?`;
    
    confirmBtn.textContent = 'Réessayer';
    confirmBtn.onclick = () => {
        alert(`Relance du paiement pour la transaction ${transaction.number}...`);
        modal.classList.remove('active');
    };
    
    cancelBtn.style.display = 'inline-block';
    cancelBtn.onclick = () => modal.classList.remove('active');
    
    modal.classList.add('active');
}

// Obtenir le libellé du statut
function getStatusLabel(status) {
    const labels = {
        'valid': 'Réussite',
        'pending': 'En cours',
        'failed': 'Échec',
        'not-valid': 'Non valide'
    };
    return labels[status] || status;
}

// Initialiser tout au chargement de la page
document.addEventListener('DOMContentLoaded', () => {
    console.log('Initialisation de la page transactions...');
    initTransactionPagination();
    initTransactionFilters();
    initRealTimeFilters();
    initTransactionMobileMenu();
    initTransactionRowsPerPageSelector();
    initTransactionPaginationButtons();
    initModals();
    attachTransactionButtonEvents();
    console.log('Page transactions initialisée');
});

// Initialiser les modales
function initModals() {
    // Modale de reçu
    const receiptModal = document.getElementById('receiptModal');
    const receiptModalClose = document.getElementById('receiptModalClose');
    const closeReceiptModalBtn = document.getElementById('closeReceiptModal');
    const downloadReceiptBtn = document.getElementById('downloadReceipt');
    
    // Modale d'action
    const actionModal = document.getElementById('actionModal');
    const actionModalClose = document.getElementById('actionModalClose');
    const cancelActionBtn = document.getElementById('cancelAction');
    const confirmActionBtn = document.getElementById('confirmAction');
    
    // Fermeture de la modale de reçu
    if (receiptModalClose) {
        receiptModalClose.addEventListener('click', closeReceiptModal);
    }
    if (closeReceiptModalBtn) {
        closeReceiptModalBtn.addEventListener('click', closeReceiptModal);
    }
    
    // Téléchargement depuis la modale
    if (downloadReceiptBtn) {
        downloadReceiptBtn.addEventListener('click', function() {
            const transactionNumber = document.getElementById('receiptNumber').textContent.replace('TXN-', '');
            const transaction = transactionData[transactionNumber];
            if (transaction) {
                downloadReceipt(transaction);
            }
        });
    }
    
    // Fermeture de la modale d'action
    if (actionModalClose) {
        actionModalClose.addEventListener('click', closeActionModal);
    }
    if (cancelActionBtn) {
        cancelActionBtn.addEventListener('click', closeActionModal);
    }
    
    // Confirmation d'action
    if (confirmActionBtn) {
        confirmActionBtn.addEventListener('click', function() {
            if (actionModal.actionCallback) {
                actionModal.actionCallback();
                closeActionModal();
            }
        });
    }
    
    // Fermeture au clic sur l'overlay
    receiptModal.addEventListener('click', function(e) {
        if (e.target === receiptModal) {
            closeReceiptModal();
        }
    });
    
    actionModal.addEventListener('click', function(e) {
        if (e.target === actionModal) {
            closeActionModal();
        }
    });
}

// Fermer la modale d'action
function closeActionModal() {
    const modal = document.getElementById('actionModal');
    modal.classList.remove('active');
    modal.actionCallback = null;
}
