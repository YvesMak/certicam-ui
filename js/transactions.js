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
    
    // Simuler le téléchargement d'un PDF
    showNotification('Téléchargement de la facture en cours...', 'info');
    
    // Dans un vrai cas, on ferait un appel API pour générer/télécharger le PDF
    setTimeout(() => {
        showNotification(`Facture TXN-${transaction.number} téléchargée avec succès!`, 'success');
        
        // Simulation du téléchargement
        const link = document.createElement('a');
        link.href = '#'; // URL réelle du PDF
        link.download = `Facture-TXN-${transaction.number}.pdf`;
        // link.click(); // Décommenter pour vraiment télécharger
    }, 1500);
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

// Initialisation de la page
function initTransactionsPage() {
    console.log('Initialisation de la page transactions...');
    attachTransactionButtonEvents();
    initModalClosing();
    console.log('Page transactions initialisée avec succès');
}

// Démarrage automatique
document.addEventListener('DOMContentLoaded', initTransactionsPage);
