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
    },
    '7891': {
        number: '7891',
        date: '13 Mai 2025',
        product: 'Acte de naissance',
        category: 'État Civil',
        institution: 'Mairie',
        paymentType: 'Orange Money',
        amount: '500 FCFA',
        status: 'valid'
    },
    '3456': {
        number: '3456',
        date: '13 Mai 2025',
        product: 'Casier judiciaire',
        category: 'Justice',
        institution: 'Tribunal',
        paymentType: 'MTN MoMo',
        amount: '2000 FCFA',
        status: 'pending'
    },
    '8902': {
        number: '8902',
        date: '14 Mai 2025',
        product: 'Relevé bancaire',
        category: 'Banque',
        institution: 'Banque XYZ',
        paymentType: 'Orange Money',
        amount: '1500 FCFA',
        status: 'valid'
    },
    '1234': {
        number: '1234',
        date: '14 Mai 2025',
        product: 'Passeport',
        category: 'Identité',
        institution: 'DGSN',
        paymentType: 'MTN MoMo',
        amount: '2500 FCFA',
        status: 'failed'
    },
    '5678': {
        number: '5678',
        date: '15 Mai 2025',
        product: 'Certificat de résidence',
        category: 'Administration',
        institution: 'Mairie',
        paymentType: 'Orange Money',
        amount: '800 FCFA',
        status: 'valid'
    },
    '9012': {
        number: '9012',
        date: '15 Mai 2025',
        product: 'CNI',
        category: 'Identité',
        institution: 'DGSN',
        paymentType: 'MTN MoMo',
        amount: '1000 FCFA',
        status: 'valid'
    },
    '3457': {
        number: '3457',
        date: '16 Mai 2025',
        product: 'Attestation de travail',
        category: 'Emploi',
        institution: 'Entreprise ABC',
        paymentType: 'Orange Money',
        amount: '1200 FCFA',
        status: 'pending'
    },
    '6789': {
        number: '6789',
        date: '16 Mai 2025',
        product: 'Relevé bancaire',
        category: 'Banque',
        institution: 'Banque DEF',
        paymentType: 'MTN MoMo',
        amount: '1500 FCFA',
        status: 'valid'
    },
    '2345': {
        number: '2345',
        date: '17 Mai 2025',
        product: 'Extrait de naissance',
        category: 'État Civil',
        institution: 'Mairie',
        paymentType: 'Orange Money',
        amount: '500 FCFA',
        status: 'valid'
    },
    '7890': {
        number: '7890',
        date: '17 Mai 2025',
        product: 'Casier judiciaire',
        category: 'Justice',
        institution: 'Tribunal',
        paymentType: 'MTN MoMo',
        amount: '2000 FCFA',
        status: 'failed'
    },
    '4568': {
        number: '4568',
        date: '18 Mai 2025',
        product: 'CNI',
        category: 'Identité',
        institution: 'DGSN',
        paymentType: 'Orange Money',
        amount: '1000 FCFA',
        status: 'valid'
    },
    '1235': {
        number: '1235',
        date: '18 Mai 2025',
        product: 'Passeport',
        category: 'Identité',
        institution: 'DGSN',
        paymentType: 'MTN MoMo',
        amount: '2500 FCFA',
        status: 'pending'
    },
    '8903': {
        number: '8903',
        date: '19 Mai 2025',
        product: 'Relevé bancaire',
        category: 'Banque',
        institution: 'Banque GHI',
        paymentType: 'Orange Money',
        amount: '1500 FCFA',
        status: 'valid'
    },
    '5679': {
        number: '5679',
        date: '19 Mai 2025',
        product: 'Certificat de mariage',
        category: 'État Civil',
        institution: 'Mairie',
        paymentType: 'MTN MoMo',
        amount: '1000 FCFA',
        status: 'valid'
    },
    '2346': {
        number: '2346',
        date: '20 Mai 2025',
        product: 'CNI',
        category: 'Identité',
        institution: 'DGSN',
        paymentType: 'Orange Money',
        amount: '1000 FCFA',
        status: 'failed'
    },
    '6790': {
        number: '6790',
        date: '20 Mai 2025',
        product: 'Attestation de résidence',
        category: 'Administration',
        institution: 'Mairie',
        paymentType: 'MTN MoMo',
        amount: '800 FCFA',
        status: 'valid'
    },
    '9013': {
        number: '9013',
        date: '21 Mai 2025',
        product: 'Passeport',
        category: 'Identité',
        institution: 'DGSN',
        paymentType: 'Orange Money',
        amount: '2500 FCFA',
        status: 'pending'
    },
    '3458': {
        number: '3458',
        date: '21 Mai 2025',
        product: 'Relevé bancaire',
        category: 'Banque',
        institution: 'Banque JKL',
        paymentType: 'MTN MoMo',
        amount: '1500 FCFA',
        status: 'valid'
    },
    '7892': {
        number: '7892',
        date: '22 Mai 2025',
        product: 'CNI',
        category: 'Identité',
        institution: 'DGSN',
        paymentType: 'Orange Money',
        amount: '1000 FCFA',
        status: 'valid'
    },
    '4569': {
        number: '4569',
        date: '22 Mai 2025',
        product: 'Casier judiciaire',
        category: 'Justice',
        institution: 'Tribunal',
        paymentType: 'MTN MoMo',
        amount: '2000 FCFA',
        status: 'failed'
    },
    '1236': {
        number: '1236',
        date: '23 Mai 2025',
        product: 'Certificat de scolarité',
        category: 'Éducation',
        institution: 'Université',
        paymentType: 'Orange Money',
        amount: '1200 FCFA',
        status: 'valid'
    },
    '8904': {
        number: '8904',
        date: '23 Mai 2025',
        product: 'Relevé bancaire',
        category: 'Banque',
        institution: 'Banque MNO',
        paymentType: 'MTN MoMo',
        amount: '1500 FCFA',
        status: 'pending'
    },
    '5680': {
        number: '5680',
        date: '24 Mai 2025',
        product: 'CNI',
        category: 'Identité',
        institution: 'DGSN',
        paymentType: 'Orange Money',
        amount: '1000 FCFA',
        status: 'valid'
    }
};

// Variables globales pour le système de filtrage et pagination
let originalTransactionRowsOrder = [];
let currentPage = 1;
let rowsPerPage = 8;
let allTransactions = [];

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
    
    // Utiliser la délégation d'événements sur le tbody pour les boutons d'action
    const tbody = document.querySelector('#transactions-table tbody');
    if (tbody) {
        tbody.addEventListener('click', function(e) {
            // Gérer les boutons view-receipt
            if (e.target.closest('.view-receipt')) {
                e.preventDefault();
                const button = e.target.closest('.view-receipt');
                const transactionNumber = button.getAttribute('data-transaction');
                const transaction = transactionData[transactionNumber];
                if (transaction) {
                    console.log('Voir facture:', transactionNumber);
                    showTransactionReceipt(transaction);
                }
            }
            
            // Gérer les boutons retry-payment
            if (e.target.closest('.retry-payment')) {
                e.preventDefault();
                const button = e.target.closest('.retry-payment');
                const transactionNumber = button.getAttribute('data-transaction');
                const transaction = transactionData[transactionNumber];
                if (transaction) {
                    console.log('Relancer paiement:', transactionNumber);
                    retryPayment(transaction);
                }
            }
        });
        console.log('✅ Événements des boutons d\'action attachés au tbody');
    }
    
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
            } else if (item.classList.contains('view-transaction')) {
                console.log('Déclenchement "Voir la transaction"');
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
                window.location.href = 'support.html';
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

// Gestion du sélecteur de transactions par page
function initRowsPerPageSelector() {
    const selectorWrapper = document.querySelector('.selector-wrapper');
    const currentSelection = document.querySelector('.current-selection');
    const dropdownItems = document.querySelectorAll('.dropdown-item');

    if (!selectorWrapper || !currentSelection || !dropdownItems.length) {
        console.log('⚠️ Éléments du sélecteur de pagination introuvables');
        return;
    }

    console.log('🔧 Initialisation du sélecteur de transactions par page');

    // Toggle du dropdown au clic sur le sélecteur
    selectorWrapper.addEventListener('click', function(e) {
        e.stopPropagation();
        selectorWrapper.classList.toggle('active');
        console.log('📊 Sélecteur toggled:', selectorWrapper.classList.contains('active'));
    });

    // Fermer le dropdown quand on clique ailleurs sur la page
    document.addEventListener('click', function(e) {
        if (!selectorWrapper.contains(e.target)) {
            selectorWrapper.classList.remove('active');
        }
    });

    // Gestion de la sélection d'un nombre de transactions par page
    dropdownItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.stopPropagation();
            const value = parseInt(this.dataset.value);
            
            // Mettre à jour l'affichage avec "transactions"
            currentSelection.textContent = `${value} transactions`;
            selectorWrapper.classList.remove('active');
            
            console.log(`📊 Nombre de transactions par page: ${value}`);
            
            // Mettre à jour le nombre de lignes par page et réafficher
            rowsPerPage = value;
            currentPage = 1; // Retour à la première page
            renderTransactionsPage();
        });
    });

    console.log('✅ Sélecteur de pagination initialisé');
}

// Fonction pour convertir transactionData en array
function getTransactionsArray() {
    return Object.values(transactionData);
}

// Fonction pour rendre les transactions dans le tableau
function renderTransactionsPage() {
    const tbody = document.querySelector('#transactions-table tbody');
    if (!tbody) {
        console.error('❌ Table tbody introuvable');
        return;
    }

    // Obtenir toutes les transactions
    allTransactions = getTransactionsArray();
    const totalTransactions = allTransactions.length;
    const totalPages = Math.ceil(totalTransactions / rowsPerPage);

    // S'assurer que currentPage est valide
    if (currentPage > totalPages) currentPage = totalPages;
    if (currentPage < 1) currentPage = 1;

    // Calculer les indices de début et fin
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = Math.min(startIndex + rowsPerPage, totalTransactions);

    // Effacer le tbody
    tbody.innerHTML = '';

    // Afficher les transactions de la page actuelle
    const transactionsToShow = allTransactions.slice(startIndex, endIndex);
    
    transactionsToShow.forEach(transaction => {
        const row = createTransactionRow(transaction);
        tbody.appendChild(row);
    });

    // Mettre à jour les contrôles de pagination
    updatePaginationControls(totalPages, totalTransactions);

    console.log(`📄 Page ${currentPage}/${totalPages} - Affichage de ${transactionsToShow.length} transactions (${startIndex + 1}-${endIndex} sur ${totalTransactions})`);
}

// Fonction pour créer une ligne de transaction
function createTransactionRow(transaction) {
    const tr = document.createElement('tr');
    
    // Déterminer la classe de statut
    let statusClass = '';
    let statusText = '';
    if (transaction.status === 'valid') {
        statusClass = 'success';
        statusText = 'Réussite';
    } else if (transaction.status === 'pending') {
        statusClass = 'pending';
        statusText = 'En attente';
    } else if (transaction.status === 'failed') {
        statusClass = 'error';
        statusText = 'Échec';
    }

    // Déterminer le logo de paiement
    const paymentLogo = transaction.paymentType.includes('Orange') 
        ? '<img src="img/orange-logo.png" alt="Orange Money" class="payment-logo">'
        : '<img src="img/mtn-logo.png" alt="MTN MoMo" class="payment-logo">';

    // Créer le menu contextuel selon le statut
    let dropdownMenuContent = '';
    
    if (transaction.status === 'valid') {
        // Transaction réussie - Options: Voir la transaction, Télécharger le reçu, Contacter le support
        dropdownMenuContent = `
            <button class="dropdown-item view-transaction" data-transaction="${transaction.number}">
                <i class="fi fi-rr-eye"></i>
                <span>Voir la transaction</span>
            </button>
            <button class="dropdown-item download-receipt" data-transaction="${transaction.number}">
                <i class="fi fi-rr-download"></i>
                <span>Télécharger le reçu</span>
            </button>
            <button class="dropdown-item contact-support" data-transaction="${transaction.number}">
                <i class="fi fi-rr-envelope"></i>
                <span>Contacter le support</span>
            </button>
        `;
    } else if (transaction.status === 'pending') {
        // Transaction en attente - Options: Voir la transaction, Annuler la transaction, Contacter le support
        dropdownMenuContent = `
            <button class="dropdown-item view-transaction" data-transaction="${transaction.number}">
                <i class="fi fi-rr-eye"></i>
                <span>Voir la transaction</span>
            </button>
            <button class="dropdown-item cancel-transaction" data-transaction="${transaction.number}" style="color: var(--color-green);">
                <i class="fi fi-rr-cross-circle" style="color: var(--color-green);"></i>
                <span>Annuler la transaction</span>
            </button>
            <button class="dropdown-item contact-support" data-transaction="${transaction.number}">
                <i class="fi fi-rr-envelope"></i>
                <span>Contacter le support</span>
            </button>
        `;
    } else if (transaction.status === 'failed') {
        // Transaction échouée - Options: Voir la transaction, Relancer le paiement, Contacter le support
        dropdownMenuContent = `
            <button class="dropdown-item view-transaction" data-transaction="${transaction.number}">
                <i class="fi fi-rr-eye"></i>
                <span>Voir la transaction</span>
            </button>
            <button class="dropdown-item retry-payment" data-transaction="${transaction.number}">
                <i class="fi fi-rr-refresh"></i>
                <span>Relancer le paiement</span>
            </button>
            <button class="dropdown-item contact-support" data-transaction="${transaction.number}">
                <i class="fi fi-rr-envelope"></i>
                <span>Contacter le support</span>
            </button>
        `;
    }

    tr.innerHTML = `
        <td>
            <div class="transaction-info">
                <span class="transaction-number">TXN-${transaction.number}</span>
                <span class="transaction-date">${transaction.date}</span>
            </div>
        </td>
        <td>
            <div class="transaction-info">
                <span class="transaction-number">${transaction.product}</span>
                <span class="transaction-date">${transaction.category}</span>
            </div>
        </td>
        <td>${transaction.institution}</td>
        <td>
            <div class="payment-type">
                ${paymentLogo}
                <span>${transaction.paymentType}</span>
            </div>
        </td>
        <td><strong class="amount">${transaction.amount}</strong></td>
        <td><span class="status ${statusClass}">${statusText}</span></td>
        <td>
            <div class="actions">
                <div class="dropdown">
                    <button class="dropdown-toggle action-button" aria-label="Actions" data-status="${transaction.status}">
                        <i class="fi fi-rr-menu-dots-vertical"></i>
                    </button>
                    <div class="dropdown-menu">
                        ${dropdownMenuContent}
                    </div>
                </div>
            </div>
        </td>
    `;

    return tr;
}

// Fonction pour mettre à jour les contrôles de pagination
function updatePaginationControls(totalPages, totalTransactions) {
    // Mettre à jour les numéros de page
    const pageNumbersContainer = document.querySelector('.page-numbers');
    if (pageNumbersContainer) {
        pageNumbersContainer.innerHTML = '';
        
        // Logique d'affichage des numéros de pages
        if (totalPages <= 7) {
            // Afficher toutes les pages si 7 ou moins
            for (let i = 1; i <= totalPages; i++) {
                const span = document.createElement('span');
                span.textContent = i;
                if (i === currentPage) span.classList.add('active');
                span.addEventListener('click', () => goToPage(i));
                pageNumbersContainer.appendChild(span);
            }
        } else {
            // Afficher avec ellipses
            // Toujours afficher page 1
            const span1 = document.createElement('span');
            span1.textContent = '1';
            if (currentPage === 1) span1.classList.add('active');
            span1.addEventListener('click', () => goToPage(1));
            pageNumbersContainer.appendChild(span1);

            // Si currentPage > 3, ajouter ellipse
            if (currentPage > 3) {
                const dots = document.createElement('span');
                dots.textContent = '...';
                dots.classList.add('dots');
                pageNumbersContainer.appendChild(dots);
            }

            // Pages autour de currentPage
            const startPage = Math.max(2, currentPage - 1);
            const endPage = Math.min(totalPages - 1, currentPage + 1);
            
            for (let i = startPage; i <= endPage; i++) {
                const span = document.createElement('span');
                span.textContent = i;
                if (i === currentPage) span.classList.add('active');
                span.addEventListener('click', () => goToPage(i));
                pageNumbersContainer.appendChild(span);
            }

            // Si currentPage < totalPages - 2, ajouter ellipse
            if (currentPage < totalPages - 2) {
                const dots = document.createElement('span');
                dots.textContent = '...';
                dots.classList.add('dots');
                pageNumbersContainer.appendChild(dots);
            }

            // Toujours afficher dernière page
            const spanLast = document.createElement('span');
            spanLast.textContent = totalPages;
            if (currentPage === totalPages) spanLast.classList.add('active');
            spanLast.addEventListener('click', () => goToPage(totalPages));
            pageNumbersContainer.appendChild(spanLast);
        }
    }

    // Mettre à jour les boutons précédent/suivant
    const prevButton = document.querySelector('.prev-button');
    const nextButton = document.querySelector('.next-button');

    if (prevButton) {
        if (currentPage === 1) {
            prevButton.classList.add('disabled');
            prevButton.disabled = true;
        } else {
            prevButton.classList.remove('disabled');
            prevButton.disabled = false;
        }
    }

    if (nextButton) {
        if (currentPage === totalPages) {
            nextButton.classList.add('disabled');
            nextButton.disabled = true;
        } else {
            nextButton.classList.remove('disabled');
            nextButton.disabled = false;
        }
    }

    console.log(`📊 Pagination mise à jour: Page ${currentPage}/${totalPages}`);
}

// Fonction pour aller à une page spécifique
function goToPage(pageNumber) {
    currentPage = pageNumber;
    renderTransactionsPage();
}

// Initialiser les boutons de navigation
function initPaginationButtons() {
    const prevButton = document.querySelector('.prev-button');
    const nextButton = document.querySelector('.next-button');

    if (prevButton) {
        prevButton.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                renderTransactionsPage();
            }
        });
    }

    if (nextButton) {
        nextButton.addEventListener('click', () => {
            const totalPages = Math.ceil(allTransactions.length / rowsPerPage);
            if (currentPage < totalPages) {
                currentPage++;
                renderTransactionsPage();
            }
        });
    }

    console.log('✅ Boutons de pagination initialisés');
}

// Initialisation de la page
function initTransactionsPage() {
    console.log('Initialisation de la page transactions...');
    
    // Rendre les transactions avec pagination
    renderTransactionsPage();
    
    // Sauvegarder l'ordre original des lignes (après le rendu initial)
    setTimeout(() => {
        storeOriginalTransactionOrder();
    }, 100);
    
    // Initialiser les event listeners pour le système de filtrage
    initTransactionFiltering();
    
    // Initialiser le sélecteur de pagination
    initRowsPerPageSelector();
    
    // Initialiser les boutons de pagination
    initPaginationButtons();
    
    // Initialiser les autres fonctionnalités
    attachTransactionButtonEvents();
    initModalClosing();
    
    console.log('Page transactions initialisée avec succès');
}

// Démarrage automatique
document.addEventListener('DOMContentLoaded', initTransactionsPage);
