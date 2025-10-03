console.log('transactions.js loaded');

// Données de transactions
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

// Variables globales pour le système de filtrage
let originalTransactionRowsOrder = [];

// Fonctions de gestion de l'ordre original des transactions
function storeOriginalTransactionOrder() {
    const rows = document.querySelectorAll('#transactions-table tbody tr');
    originalTransactionRowsOrder = Array.from(rows);
    console.log('🏠 Ordre original des transactions sauvegardé:', originalTransactionRowsOrder.length, 'lignes');
}

function restoreOriginalTransactionOrder() {
    const tbody = document.querySelector('#transactions-table tbody');
    if (tbody && originalTransactionRowsOrder.length > 0) {
        console.log('🔄 Restauration de l\'ordre original des transactions');
        originalTransactionRowsOrder.forEach(row => {
            tbody.appendChild(row);
        });
    }
}

// Fonction de filtrage des transactions
function applyTransactionFilters(searchTerm = '') {
    const statusFilter = document.querySelector('input[name="transaction-status-filter"]:checked')?.value || 'all';
    const paymentFilter = document.querySelector('input[name="transaction-payment-filter"]:checked')?.value || 'all';
    const categoryFilter = document.querySelector('input[name="transaction-category-filter"]:checked')?.value || 'all';
    
    const rows = document.querySelectorAll('#transactions-table tbody tr');
    let hasFilters = statusFilter !== 'all' || paymentFilter !== 'all' || categoryFilter !== 'all' || searchTerm.length > 0;
    
    console.log('🔍 Application des filtres transactions:', {
        statut: statusFilter,
        paiement: paymentFilter,
        categorie: categoryFilter,
        recherche: searchTerm,
        hasFilters
    });
    
    rows.forEach((row, index) => {
        let show = true;
        
        // Filtre par recherche textuelle
        if (searchTerm.length > 0) {
            const text = row.textContent.toLowerCase();
            show = text.includes(searchTerm.toLowerCase());
            if (!show) {
                row.style.display = 'none';
                return;
            }
        }
        
        // Filtre par statut
        if (statusFilter !== 'all' && show) {
            const statusElement = row.querySelector('.status');
            if (statusElement) {
                const statusText = statusElement.textContent.trim().toLowerCase();
                
                if (statusFilter === 'valid') {
                    show = statusText === 'réussite' || statusText === 'réussi';
                } else if (statusFilter === 'pending') {
                    show = statusText === 'en cours' || statusText === 'en attente';
                } else if (statusFilter === 'failed') {
                    show = statusText === 'échec';
                }
            }
        }
        
        // Filtre par type de paiement
        if (paymentFilter !== 'all' && show) {
            const paymentCell = row.querySelector('.payment-type');
            if (paymentCell) {
                const paymentText = paymentCell.textContent.toLowerCase();
                
                if (paymentFilter === 'orange-money') {
                    show = paymentText.includes('orange money');
                } else if (paymentFilter === 'mtn-momo') {
                    show = paymentText.includes('mtn momo');
                }
            }
        }
        
        // Filtre par catégorie
        if (categoryFilter !== 'all' && show) {
            const categoryElement = row.querySelector('.document-category');
            if (categoryElement) {
                const categoryText = categoryElement.textContent.trim().toLowerCase();
                show = categoryText === categoryFilter.toLowerCase();
            }
        }
        
        row.style.display = show ? 'table-row' : 'none';
    });
    
    // Mettre à jour le bouton filtre
    const filterToggle = document.getElementById('transaction-filter-toggle');
    if (filterToggle) {
        if (hasFilters) {
            filterToggle.classList.add('has-filters');
        } else {
            filterToggle.classList.remove('has-filters');
        }
    }
    
    // Ne pas trier si aucun filtre n'est appliqué, garder l'ordre original
    if (!hasFilters) {
        console.log('🏠 Aucun filtre actif - ordre original préservé');
        restoreOriginalTransactionOrder();
    } else {
        console.log('🔄 Filtres actifs - ordre filtré maintenu');
    }
}

// Fonction pour réinitialiser tous les filtres des transactions
function resetTransactionFilters() {
    console.log('🔄 Réinitialisation des filtres transactions');
    
    // Réinitialiser tous les filtres radio
    document.querySelectorAll('input[name="transaction-status-filter"]').forEach(input => {
        input.checked = input.value === 'all';
    });
    
    document.querySelectorAll('input[name="transaction-payment-filter"]').forEach(input => {
        input.checked = input.value === 'all';
    });
    
    document.querySelectorAll('input[name="transaction-category-filter"]').forEach(input => {
        input.checked = input.value === 'all';
    });
    
    // Vider la barre de recherche
    const searchInput = document.getElementById('transaction-search');
    if (searchInput) {
        searchInput.value = '';
    }
    
    // Restaurer l'ordre original et afficher toutes les lignes
    restoreOriginalTransactionOrder();
    const rows = document.querySelectorAll('#transactions-table tbody tr');
    rows.forEach(row => row.style.display = 'table-row');
    
    // Retirer l'indicateur de filtres actifs
    const filterToggle = document.getElementById('transaction-filter-toggle');
    if (filterToggle) {
        filterToggle.classList.remove('has-filters');
    }
    
    console.log('✅ Filtres transactions réinitialisés');
}

// Fonctions utilitaires
function getStatusClass(status) {
    switch (status) {
        case 'valid': return 'success';
        case 'pending': return 'warning';  
        case 'failed': return 'error';
        default: return 'neutral';
    }
}

function getStatusText(status) {
    switch (status) {
        case 'valid': return 'Réussi';
        case 'pending': return 'En attente';
        case 'failed': return 'Échec';
        default: return status;
    }
}

// Fonction principale pour afficher la modal
function showTransactionReceipt(transaction) {
    console.log('Ouverture modal pour transaction:', transaction);
    
    if (!transaction) {
        console.error('Aucune donnée de transaction');
        return;
    }
    
    const modal = document.getElementById('receiptModal');
    if (!modal) {
        console.error('Modal receiptModal non trouvée dans le DOM');
        return;
    }
    
    try {
        // Remplir les données de la modal
        const receiptNumber = document.getElementById('receiptNumber');
        const receiptDate = document.getElementById('receiptDate');
        const receiptService = document.getElementById('receiptService');
        const receiptInstitution = document.getElementById('receiptInstitution');
        const receiptPayment = document.getElementById('receiptPayment');
        const receiptAmount = document.getElementById('receiptAmount');
        const receiptStatus = document.getElementById('receiptStatus');
        
        if (receiptNumber) receiptNumber.textContent = `TXN-${transaction.number}`;
        if (receiptDate) receiptDate.textContent = transaction.date;
        if (receiptService) receiptService.textContent = transaction.product;
        if (receiptInstitution) receiptInstitution.textContent = transaction.institution;
        if (receiptPayment) receiptPayment.textContent = transaction.paymentType;
        if (receiptAmount) receiptAmount.textContent = transaction.amount;
        
        // Statut avec style approprié
        if (receiptStatus) {
            const statusClass = getStatusClass(transaction.status);
            const statusText = getStatusText(transaction.status);
            receiptStatus.innerHTML = `<span class="status ${statusClass}">${statusText}</span>`;
        }
        
        // Afficher la modal
        modal.classList.add('active');
        console.log('Modal ouverte avec succès');
        
    } catch (error) {
        console.error('Erreur lors du remplissage de la modal:', error);
    }
}

// Gestion des événements
function attachTransactionButtonEvents() {
    console.log('Initialisation des événements...');
    
    document.addEventListener('click', function(e) {
        // Fermer dropdowns si clic ailleurs
        if (!e.target.closest('.dropdown')) {
            document.querySelectorAll('.dropdown-menu.active').forEach(menu => {
                menu.classList.remove('active');
            });
        }
        
        // Ouvrir/fermer dropdown
        if (e.target.closest('.dropdown-toggle')) {
            e.preventDefault();
            e.stopPropagation();
            
            const button = e.target.closest('.dropdown-toggle');
            const dropdown = button.closest('.dropdown');
            const menu = dropdown.querySelector('.dropdown-menu');
            
            // Fermer autres menus
            document.querySelectorAll('.dropdown-menu.active').forEach(otherMenu => {
                if (otherMenu !== menu) {
                    otherMenu.classList.remove('active');
                }
            });
            
            // Toggle menu actuel
            if (menu) {
                menu.classList.toggle('active');
            }
        }
        
        // Actions dans dropdown
        if (e.target.closest('.dropdown-item')) {
            e.preventDefault();
            e.stopPropagation();
            
            const item = e.target.closest('.dropdown-item');
            const dropdown = item.closest('.dropdown');
            const button = dropdown.querySelector('.dropdown-toggle');
            const transactionId = button.getAttribute('data-transaction');
            const transaction = transactionData[transactionId];
            
            console.log('Action sélectionnée. Classes:', item.className);
            console.log('ID transaction:', transactionId);
            console.log('Données transaction:', transaction);
            
            // Fermer dropdown
            dropdown.querySelector('.dropdown-menu').classList.remove('active');
            
            if (item.classList.contains('view-receipt')) {
                console.log('Déclenchement "Voir facture"');
                showTransactionReceipt(transaction);
            } else if (item.classList.contains('download-receipt')) {
                console.log('Déclenchement "Télécharger facture"');
                downloadReceipt(transaction);
            } else if (item.classList.contains('retry-payment')) {
                console.log('Déclenchement "Relancer paiement"');
                retryPayment(transaction);
            } else if (item.classList.contains('cancel-transaction')) {
                console.log('Déclenchement "Annuler transaction"');
                cancelTransaction(transaction);
            } else if (item.classList.contains('contact-support')) {
                console.log('Redirection vers support');
                window.location.href = '/support.html';
            }
        }
    });
}

// Fonction pour télécharger la facture
function downloadReceipt(transaction) {
    console.log('Téléchargement de la facture pour transaction:', transaction.number);
    
    showNotification('Génération de la facture en cours...', 'info');
    
    // Générer un vrai PDF avec jsPDF
    setTimeout(() => {
        try {
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();
            
            // Configuration des couleurs
            const primaryColor = [0, 195, 108]; // Vert Certicam
            const darkColor = [16, 24, 40];
            const grayColor = [102, 112, 133];
            const redColor = [244, 33, 47];
            const orangeColor = [255, 159, 28];
            
            // En-tête avec fond vert
            doc.setFillColor(...primaryColor);
            doc.rect(0, 0, 210, 50, 'F');
            
            // Logo et titre
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(28);
            doc.setFont(undefined, 'bold');
            doc.text('CERTICAM', 20, 25);
            
            doc.setFontSize(14);
            doc.setFont(undefined, 'normal');
            doc.text('Facture de Transaction', 20, 38);
            
            // Numéro de facture en haut à droite
            doc.setFontSize(10);
            doc.text(`Facture N° TXN-${transaction.number}`, 150, 25, { align: 'right' });
            doc.text(`Date: ${transaction.date}`, 150, 32, { align: 'right' });
            
            // Ligne de séparation
            doc.setDrawColor(...primaryColor);
            doc.setLineWidth(1);
            doc.line(20, 55, 190, 55);
            
            // Informations de la transaction
            let yPos = 70;
            doc.setTextColor(...darkColor);
            doc.setFontSize(16);
            doc.setFont(undefined, 'bold');
            doc.text('Détails de la transaction', 20, yPos);
            
            yPos += 15;
            doc.setFontSize(11);
            doc.setFont(undefined, 'normal');
            
            // Détails
            const details = [
                { label: 'Produit/Service', value: transaction.product },
                { label: 'Institution', value: transaction.institution },
                { label: 'Catégorie', value: transaction.category },
                { label: 'Méthode de paiement', value: transaction.paymentMethod || 'Mobile Money' },
                { label: 'Date de transaction', value: transaction.date },
                { label: 'Heure', value: new Date().toLocaleTimeString('fr-FR') }
            ];
            
            details.forEach(detail => {
                doc.setTextColor(...grayColor);
                doc.text(detail.label + ':', 20, yPos);
                doc.setTextColor(...darkColor);
                doc.setFont(undefined, 'bold');
                doc.text(detail.value, 90, yPos);
                doc.setFont(undefined, 'normal');
                yPos += 10;
            });
            
            // Cadre pour le montant
            yPos += 10;
            doc.setFillColor(248, 250, 252);
            doc.roundedRect(20, yPos, 170, 30, 3, 3, 'F');
            
            yPos += 12;
            doc.setTextColor(...grayColor);
            doc.setFontSize(12);
            doc.text('Montant total', 25, yPos);
            
            doc.setTextColor(...primaryColor);
            doc.setFontSize(24);
            doc.setFont(undefined, 'bold');
            doc.text(transaction.amount, 185, yPos + 5, { align: 'right' });
            
            // Statut de la transaction
            yPos += 25;
            doc.setFontSize(12);
            doc.setFont(undefined, 'bold');
            doc.setTextColor(...darkColor);
            doc.text('Statut:', 20, yPos);
            
            // Couleur selon le statut
            let statusColor = grayColor;
            let statusText = transaction.status;
            if (transaction.status === 'valid' || transaction.status === 'Réussie') {
                statusColor = primaryColor;
                statusText = '✓ Réussie';
            } else if (transaction.status === 'failed' || transaction.status === 'Échouée') {
                statusColor = redColor;
                statusText = '✗ Échouée';
            } else if (transaction.status === 'pending' || transaction.status === 'En attente') {
                statusColor = orangeColor;
                statusText = '◷ En attente';
            }
            
            doc.setTextColor(...statusColor);
            doc.text(statusText, 50, yPos);
            
            // Cadre de certification
            yPos += 15;
            doc.setDrawColor(...primaryColor);
            doc.setLineWidth(1);
            doc.roundedRect(20, yPos, 170, 45, 3, 3, 'S');
            
            yPos += 12;
            doc.setTextColor(...primaryColor);
            doc.setFontSize(14);
            doc.setFont(undefined, 'bold');
            doc.text('✓ Transaction Certifiée', 25, yPos);
            
            yPos += 10;
            doc.setTextColor(...grayColor);
            doc.setFontSize(10);
            doc.setFont(undefined, 'normal');
            doc.text('Cette facture est un document officiel émis par Certicam.', 25, yPos);
            yPos += 6;
            doc.text('Elle peut être utilisée comme justificatif de paiement.', 25, yPos);
            yPos += 6;
            doc.text(`Code de vérification: CERT-TXN-${transaction.number}-${Date.now().toString(36).toUpperCase()}`, 25, yPos);
            
            // Pied de page
            yPos = 260;
            doc.setDrawColor(...grayColor);
            doc.setLineWidth(0.3);
            doc.line(20, yPos, 190, yPos);
            
            yPos += 8;
            doc.setTextColor(...grayColor);
            doc.setFontSize(9);
            doc.text(`Facture générée le ${new Date().toLocaleDateString('fr-FR')} à ${new Date().toLocaleTimeString('fr-FR')}`, 20, yPos);
            
            yPos += 5;
            doc.text('Certicam - Plateforme de certification de documents et de transactions', 20, yPos);
            
            yPos += 5;
            doc.text('Pour toute question, contactez notre support: support@certicam.cm', 20, yPos);
            
            // Sauvegarder le PDF
            const fileName = `Facture_TXN_${transaction.number}_${transaction.date.replace(/[\/\s:]/g, '_')}.pdf`;
            doc.save(fileName);
            
            showNotification(`Facture TXN-${transaction.number} téléchargée avec succès!`, 'success');
        } catch (error) {
            console.error('Erreur lors de la génération du PDF:', error);
            showNotification('Erreur lors de la génération de la facture', 'error');
        }
    }, 500);
}

// Fonction pour relancer un paiement
function retryPayment(transaction) {
    console.log('Relance du paiement pour transaction:', transaction.number);
    
    // Préparer les paramètres de paiement
    const paymentParams = new URLSearchParams({
        retry: 'true',
        transactionId: transaction.number,
        product: transaction.product,
        amount: transaction.amount.replace(' FCFA', ''),
        institution: transaction.institution,
        category: transaction.category
    });
    
    showNotification('Redirection vers la page de paiement...', 'info');
    
    // Redirection vers la page de paiement avec les paramètres
    setTimeout(() => {
        window.location.href = `/payment.html?${paymentParams.toString()}`;
    }, 1000);
}

// Fonction pour annuler une transaction (seulement si applicable)
function cancelTransaction(transaction) {
    console.log('Tentative d\'annulation pour transaction:', transaction.number, 'Statut:', transaction.status);
    
    // Vérifier si l'annulation est possible
    if (transaction.status === 'pending') {
        showNotification('Impossible d\'annuler une transaction en attente. Veuillez patienter ou contacter le support.', 'warning');
        return;
    }
    
    if (transaction.status === 'valid') {
        showNotification('Impossible d\'annuler une transaction réussie. Contactez le support pour un remboursement.', 'warning');
        return;
    }
    
    // Pour les transactions échouées, on peut proposer d'autres actions
    if (transaction.status === 'failed') {
        showNotification('Transaction déjà échouée. Utilisez "Relancer le paiement" pour réessayer.', 'info');
        return;
    }
}

// Fonction pour afficher les notifications
function showNotification(message, type = 'info', duration = 5000) {
    // Créer l'élément de notification
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">
                <i class="fi fi-rr-cross-small"></i>
            </button>
        </div>
    `;
    
    // Ajouter au conteneur de notifications
    let container = document.getElementById('notification-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'notification-container';
        container.className = 'notification-container';
        document.body.appendChild(container);
    }
    
    container.appendChild(notification);
    
    // Animation d'entrée
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Suppression automatique
    setTimeout(() => {
        if (notification.parentElement) {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentElement) {
                    notification.remove();
                }
            }, 300);
        }
    }, duration);
}

// Fonction utilitaire pour récupérer une transaction par son numéro
function getTransactionByNumber(number) {
    return Object.values(transactionData).find(transaction => transaction.number === number);
}

// Fermeture des modals
function initModalClosing() {
    // Boutons de fermeture génériques
    document.querySelectorAll('.modal-close').forEach(closeBtn => {
        closeBtn.addEventListener('click', function() {
            const modal = this.closest('.modal-overlay') || this.closest('.modal');
            if (modal) {
                modal.classList.remove('active');
            }
        });
    });
    
    // Boutons de fermeture spécifiques
    const closeReceiptModal = document.getElementById('closeReceiptModal');
    if (closeReceiptModal) {
        closeReceiptModal.addEventListener('click', function() {
            const modal = document.getElementById('receiptModal');
            if (modal) {
                modal.classList.remove('active');
            }
        });
    }
    
    // Bouton de téléchargement spécifique
    const downloadReceiptBtn = document.getElementById('downloadReceipt');
    if (downloadReceiptBtn) {
        downloadReceiptBtn.addEventListener('click', function() {
            // Récupérer les données de la transaction actuelle
            const receiptNumber = document.getElementById('receiptNumber').textContent.replace('TXN-', '');
            const transactionData = getTransactionByNumber(receiptNumber);
            if (transactionData) {
                downloadReceipt(transactionData);
            }
        });
    }
    
    // Clic sur overlay
    document.querySelectorAll('.modal-overlay').forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                this.classList.remove('active');
            }
        });
    });
    
    // Touche Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            document.querySelectorAll('.modal-overlay.active, .modal.active').forEach(modal => {
                modal.classList.remove('active');
            });
        }
    });
}

// Initialisation du système de filtrage
function initTransactionFiltering() {
    console.log('🔧 Initialisation du système de filtrage des transactions');
    
    // Gestion du bouton toggle des filtres
    const filterToggle = document.getElementById('transaction-filter-toggle');
    const filterPanel = document.getElementById('transaction-filter-panel');
    const filterClose = document.getElementById('transaction-filter-close');
    
    console.log('🔍 Éléments trouvés:', {
        filterToggle: !!filterToggle,
        filterPanel: !!filterPanel,
        filterClose: !!filterClose
    });
    
    if (filterToggle && filterPanel) {
        console.log('✅ Ajout des event listeners pour toggle et panel');
        filterToggle.addEventListener('click', () => {
            console.log('🖱️ Clic sur bouton filtres');
            filterPanel.classList.toggle('active');
            filterToggle.classList.toggle('active');
            console.log('📊 Panel classe active:', filterPanel.classList.contains('active'));
        });
    } else {
        console.error('❌ Éléments filterToggle ou filterPanel non trouvés');
    }
    
    if (filterClose) {
        filterClose.addEventListener('click', () => {
            console.log('🖱️ Clic sur fermer filtres');
            filterPanel.classList.remove('active');
            filterToggle.classList.remove('active');
        });
    }
    
    // Gestion de la barre de recherche
    const searchInput = document.getElementById('transaction-search');
    const searchClear = document.getElementById('transaction-search-clear');
    
    if (searchInput) {
        // Recherche en temps réel avec debounce
        let searchTimeout;
        searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                applyTransactionFilters(e.target.value.trim());
            }, 300);
        });
        
        // Gestion du bouton clear
        if (searchClear) {
            searchClear.addEventListener('click', () => {
                searchInput.value = '';
                applyTransactionFilters('');
            });
        }
    }
    
    // Gestion des boutons d'application et de réinitialisation
    const applyButton = document.getElementById('transaction-apply-filters');
    const resetButton = document.getElementById('transaction-reset-filters');
    
    if (applyButton) {
        applyButton.addEventListener('click', () => {
            const searchTerm = searchInput ? searchInput.value.trim() : '';
            applyTransactionFilters(searchTerm);
            
            // Fermer le panel après application
            if (filterPanel) {
                filterPanel.classList.remove('active');
                filterToggle.classList.remove('active');
            }
        });
    }
    
    if (resetButton) {
        resetButton.addEventListener('click', () => {
            resetTransactionFilters();
        });
    }
    
    // Event listeners pour les changements de filtres en temps réel
    const filterInputs = document.querySelectorAll(
        'input[name="transaction-status-filter"], ' +
        'input[name="transaction-payment-filter"], ' +
        'input[name="transaction-category-filter"]'
    );
    
    filterInputs.forEach(input => {
        input.addEventListener('change', () => {
            const searchTerm = searchInput ? searchInput.value.trim() : '';
            applyTransactionFilters(searchTerm);
        });
    });
    
    console.log('✅ Système de filtrage des transactions initialisé');
}

// Initialisation de la page
function initTransactionsPage() {
    console.log('Initialisation de la page transactions...');
    
    // Sauvegarder l'ordre original des lignes
    storeOriginalTransactionOrder();
    
    // Initialiser les event listeners pour le système de filtrage
    initTransactionFiltering();
    
    // Initialiser les autres fonctionnalités
    attachTransactionButtonEvents();
    initModalClosing();
    
    console.log('Page transactions initialisée avec succès');
}

// Démarrage automatique
document.addEventListener('DOMContentLoaded', initTransactionsPage);
