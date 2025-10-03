// Variables globales pour la pagination
let currentPage = 1;
let rowsPerPage = 8;
let allRows = [];
let originalRowsOrder = []; // Stocker l'ordre original

// Variables globales pour la gestion des gestionnaires d'événements
let documentClickHandler = null;
let filterClickHandler = null;
let documentsPerPage = 10;
let filteredDocuments = [];
let isInitialized = false;

// Fonction pour parser les dates en français (format: "DD Mois YYYY")
function parseFrenchDate(dateString) {
    if (!dateString || dateString === 'Permanent') return null;
    
    const months = {
        'janvier': 0, 'jan': 0,
        'février': 1, 'fév': 1, 'fevrier': 1, 'fev': 1,
        'mars': 2, 'mar': 2,
        'avril': 3, 'avr': 3,
        'mai': 4,
        'juin': 5, 'jun': 5,
        'juillet': 6, 'juil': 6, 'jul': 6,
        'août': 7, 'aout': 7, 'aoû': 7, 'aug': 7,
        'septembre': 8, 'sept': 8, 'sep': 8,
        'octobre': 9, 'oct': 9,
        'novembre': 10, 'nov': 10,
        'décembre': 11, 'déc': 11, 'decembre': 11, 'dec': 11
    };
    
    // Regex pour capturer "DD Mois YYYY"
    const match = dateString.match(/(\d{1,2})\s+(\w+)\s+(\d{4})/i);
    if (!match) return null;
    
    const day = parseInt(match[1]);
    const monthName = match[2].toLowerCase();
    const year = parseInt(match[3]);
    
    const monthIndex = months[monthName];
    if (monthIndex === undefined) return null;
    
    return new Date(year, monthIndex, day);
}

// Fonction pour trier les lignes du tableau par date (du plus récent au plus ancien)
function sortRowsByDate() {
    const tbody = document.querySelector('tbody');
    if (!tbody) return;
    
    const rows = Array.from(tbody.querySelectorAll('tr')).filter(row => 
        row.style.display !== 'none'
    );
    
    rows.sort((a, b) => {
        // Récupérer les dates de validité
        const dateA = a.cells[3]?.textContent.trim();
        const dateB = b.cells[3]?.textContent.trim();
        
        const parsedDateA = parseFrenchDate(dateA);
        const parsedDateB = parseFrenchDate(dateB);
        
        // Gérer les cas spéciaux
        if (dateA === 'Permanent' && dateB === 'Permanent') return 0;
        if (dateA === 'Permanent') return -1; // Permanent en premier
        if (dateB === 'Permanent') return 1;
        
        if (!parsedDateA && !parsedDateB) return 0;
        if (!parsedDateA) return 1;
        if (!parsedDateB) return -1;
        
        // Tri du plus récent au plus ancien (ordre décroissant)
        return parsedDateB - parsedDateA;
    });
    
    // Réinsérer les lignes triées
    rows.forEach(row => tbody.appendChild(row));
}

// Fonction pour stocker l'ordre original des lignes
function storeOriginalOrder() {
    const tbody = document.querySelector('tbody');
    if (!tbody) return;
    
    originalRowsOrder = Array.from(tbody.querySelectorAll('tr'));
    console.log('✅ Ordre original du tableau stocké (' + originalRowsOrder.length + ' éléments)');
    
    // Debug: afficher les 3 premiers noms de documents
    const firstThree = originalRowsOrder.slice(0, 3).map(row => {
        const nameElement = row.querySelector('.document-name');
        return nameElement ? nameElement.textContent.trim() : 'N/A';
    });
    console.log('🎯 3 premiers documents stockés:', firstThree);
}

// Fonction pour restaurer l'ordre original des lignes
function restoreOriginalOrder() {
    const tbody = document.querySelector('tbody');
    if (!tbody || originalRowsOrder.length === 0) {
        console.log('⚠️ Impossible de restaurer l\'ordre original');
        return;
    }
    
    // Debug: afficher les 3 premiers noms avant restauration
    const currentFirst = Array.from(tbody.querySelectorAll('tr')).slice(0, 3).map(row => {
        const nameElement = row.querySelector('.document-name');
        return nameElement ? nameElement.textContent.trim() : 'N/A';
    });
    console.log('🔍 3 premiers documents AVANT restauration:', currentFirst);
    
    // Restaurer l'ordre original en réinsérant les lignes
    originalRowsOrder.forEach(row => {
        tbody.appendChild(row);
    });
    
    // Debug: afficher les 3 premiers noms après restauration
    const restoredFirst = Array.from(tbody.querySelectorAll('tr')).slice(0, 3).map(row => {
        const nameElement = row.querySelector('.document-name');
        return nameElement ? nameElement.textContent.trim() : 'N/A';
    });
    console.log('🎯 3 premiers documents APRÈS restauration:', restoredFirst);
    
    console.log('✅ Ordre original restauré');
}

// Gestion du sélecteur de documents par page
function initRowsPerPageSelector() {
    const selectorWrapper = document.querySelector('.selector-wrapper');
    const currentSelection = document.querySelector('.current-selection');
    const dropdownItems = document.querySelectorAll('.dropdown-item');

    if (!selectorWrapper || !currentSelection || !dropdownItems.length) {
        console.log('Éléments du sélecteur introuvables');
        return;
    }

    // Toggle du dropdown au clic sur le sélecteur
    selectorWrapper.addEventListener('click', function(e) {
        e.stopPropagation();
        selectorWrapper.classList.toggle('active');
    });

    // Fermer le dropdown quand on clique ailleurs sur la page
    document.addEventListener('click', function(e) {
        if (!selectorWrapper.contains(e.target)) {
            selectorWrapper.classList.remove('active');
        }
    });

    // Gestion de la sélection d'un nombre de documents par page
    dropdownItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.stopPropagation();
            const value = parseInt(this.dataset.value);
            
            // Mettre à jour l'affichage
            currentSelection.textContent = `${value} documents`;
            selectorWrapper.classList.remove('active');
            
            // Mettre à jour la variable globale
            rowsPerPage = value;
            
            // Recalculer la pagination avec le nouveau nombre par page
            currentPage = 1;
            showPage(1);
            updatePaginationButtons();
            
            console.log(`Documents par page mis à jour: ${rowsPerPage}`);
        });
    });
}

// Fonction principale d'initialisation avec protection contre les doubles appels
function initializePageComponents() {
    if (isInitialized) {
        console.log('⚠️ Page déjà initialisée, éviter la double initialisation');
        return;
    }
    
    console.log('🚀 Initialisation des composants de la page...');
    
    try {
        initializeButtonEvents();
        console.log('✅ Initialisation terminée avec succès');
        isInitialized = true;
    } catch (error) {
        console.error('❌ Erreur lors de l\'initialisation:', error);
    }
}

// Cette fonction n'est plus nécessaire - supprimée

// Gestion de la recherche
const searchInput = document.getElementById('search-input');
const searchClear = document.getElementById('search-clear');

searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    
    // Afficher/masquer le bouton d'effacement
    if (searchTerm.length > 0) {
        searchClear.style.display = 'flex';
    } else {
        searchClear.style.display = 'none';
    }
    
    applySearchAndFilters(searchTerm);
});

// Bouton d'effacement de recherche
searchClear.addEventListener('click', () => {
    searchInput.value = '';
    searchClear.style.display = 'none';
    applySearchAndFilters('');
});

function applySearchAndFilters(searchTerm) {
    const statusFilter = document.querySelector('input[name="status-filter"]:checked')?.value || 'all';
    const typeFilter = document.querySelector('input[name="type-filter"]:checked')?.value || 'all';
    
    // Utiliser le nouveau système de sélection de dates
    const dateRange = window.getSelectedDateRange ? window.getSelectedDateRange() : { start: null, end: null, range: 0 };
    const dateFrom = dateRange.start;
    const dateTo = dateRange.end;
    const rangeDays = parseInt(dateRange.range) || 0;
    
    const rows = document.querySelectorAll('tbody tr');
    let hasFilters = statusFilter !== 'all' || typeFilter !== 'all' || searchTerm.length > 0 || dateFrom || dateTo;
    
    rows.forEach((row, index) => {
        let show = true;
        
        // Filtre par recherche textuelle (priorité sur tout)
        if (searchTerm.length > 0) {
            const text = row.textContent.toLowerCase();
            show = text.includes(searchTerm);
            if (!show) {
                row.style.display = 'none';
                return;
            }
        }
        
        // Filtre par statut
        if (statusFilter !== 'all' && show) {
            const statusElement = row.querySelector('.status');
            if (statusElement) {
                const statusText = statusElement.textContent.trim();
                
                if (statusFilter === 'valid') {
                    show = statusText === 'Validé';
                } else if (statusFilter === 'not-valid') {
                    show = statusText === 'Pas validé';
                }
            }
        }
        
        // Filtre par type (chercher dans le nom du document ET la colonne type)
        if (typeFilter !== 'all' && show) {
            // Chercher dans le nom du document (première colonne)
            const documentNameElement = row.querySelector('.document-name');
            const typeCell = row.cells[1]; // Colonne type
            
            let documentName = '';
            let typeText = '';
            
            if (documentNameElement) {
                documentName = documentNameElement.textContent.toLowerCase();
            }
            if (typeCell) {
                typeText = typeCell.textContent.toLowerCase();
            }
            
            if (typeFilter === 'diplome') {
                show = documentName.includes('diplôme') || typeText.includes('éducation') || typeText.includes('formation');
            } else if (typeFilter === 'certificat') {
                show = documentName.includes('certificat');
            } else if (typeFilter === 'banque') {
                show = typeText.includes('banque') || documentName.includes('bancaire');
            }
        }
        
        // Filtre par date de validité avec support du range
        if ((dateFrom || dateTo) && show) {
            const validityCell = row.cells[3]; // Colonne "Date de validité"
            if (validityCell) {
                const validityText = validityCell.textContent.trim();
                
                // Parser la date de validité (format: "DD Mois YYYY")
                const dateObj = parseFrenchDate(validityText);
                
                if (dateObj) {
                    let isInRange = true;
                    
                    // Vérifier la date de début
                    if (dateFrom) {
                        const fromDate = new Date(dateFrom);
                        fromDate.setHours(0, 0, 0, 0);
                        
                        // Appliquer le range (soustraire les jours pour élargir la plage vers le passé)
                        if (rangeDays > 0) {
                            fromDate.setDate(fromDate.getDate() - rangeDays);
                        }
                        
                        if (dateObj < fromDate) {
                            isInRange = false;
                        }
                    }
                    
                    // Vérifier la date de fin
                    if (dateTo && isInRange) {
                        const toDate = new Date(dateTo);
                        toDate.setHours(23, 59, 59, 999);
                        
                        // Appliquer le range (ajouter les jours pour élargir la plage vers le futur)
                        if (rangeDays > 0) {
                            toDate.setDate(toDate.getDate() + rangeDays);
                        }
                        
                        if (dateObj > toDate) {
                            isInRange = false;
                        }
                    }
                    
                    if (!isInRange) {
                        show = false;
                    }
                } else if (validityText !== 'Permanent') {
                    // Si on ne peut pas parser la date et que ce n'est pas "Permanent", on masque
                    show = false;
                }
            }
        }
        
        row.style.display = show ? 'table-row' : 'none';
    });
    
    // Mettre à jour le bouton
    const filterToggle = document.getElementById('filter-toggle');
    if (hasFilters) {
        filterToggle.classList.add('has-filters');
    } else {
        filterToggle.classList.remove('has-filters');
    }
    
    // Trier seulement s'il y a des filtres actifs, sinon garder l'ordre original
    if (hasFilters) {
        console.log('🔄 Filtres actifs détectés - tri par date appliqué');
        sortRowsByDate();
    } else {
        console.log('🏠 Aucun filtre actif - ordre original préservé');
        // Pas de tri, on garde l'ordre original
    }
    
    // Recalculer pagination
    updateVisibleRowsAfterFilter();
}

// Cette fonction est maintenant gérée par la fonction filterDocuments principale plus bas

// Gestion de la pagination
// Variables déclarées en haut du fichier

// Initialisation de la pagination
function initPagination() {
    allRows = Array.from(document.querySelectorAll('tbody tr'));
    showPage(1);
    updatePaginationButtons();
}

// Afficher une page spécifique
function showPage(pageNumber) {
    const totalPages = Math.ceil(allRows.length / rowsPerPage);
    
    // S'assurer que le numéro de page est valide
    if (pageNumber < 1) {
        pageNumber = 1;
    } else if (pageNumber > totalPages) {
        pageNumber = totalPages;
    }
    
    currentPage = pageNumber;
    const startIndex = (pageNumber - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    
    // Masquer toutes les lignes du tableau
    const allTableRows = document.querySelectorAll('tbody tr');
    allTableRows.forEach(row => {
        row.style.display = 'none';
    });
    
    // Afficher seulement les lignes de la page courante
    for (let i = startIndex; i < endIndex && i < allRows.length; i++) {
        if (allRows[i]) {
            allRows[i].style.display = 'table-row';
        }
    }
    
    updatePaginationButtons();
    
    // Réattacher les événements après changement de page
    initializeButtonEvents();
}

// Mettre à jour l'état des boutons de pagination
function updatePaginationButtons() {
    const totalPages = Math.ceil(allRows.length / rowsPerPage);
    const pageNumbersContainer = document.querySelector('.page-numbers');
    
    // Si pas assez de documents pour plusieurs pages, masquer la pagination
    if (totalPages <= 1) {
        pageNumbersContainer.style.display = 'none';
        const prevButton = document.querySelector('.prev-button');
        const nextButton = document.querySelector('.next-button');
        if (prevButton) prevButton.style.display = 'none';
        if (nextButton) nextButton.style.display = 'none';
        return;
    }
    
    // Afficher la pagination
    pageNumbersContainer.style.display = 'flex';
    const prevButton = document.querySelector('.prev-button');
    const nextButton = document.querySelector('.next-button');
    if (prevButton) prevButton.style.display = 'flex';
    if (nextButton) nextButton.style.display = 'flex';
    
    // Générer la pagination intelligente
    generateSmartPagination(totalPages);
    
    // Mettre à jour les boutons précédent/suivant
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
}

function generateSmartPagination(totalPages) {
    const pageNumbersContainer = document.querySelector('.page-numbers');
    pageNumbersContainer.innerHTML = '';
    
    // Si 7 pages ou moins, afficher toutes les pages
    if (totalPages <= 7) {
        for (let i = 1; i <= totalPages; i++) {
            const span = createPageSpan(i, i === currentPage);
            pageNumbersContainer.appendChild(span);
        }
        return;
    }
    
    // Logique pour plus de 7 pages : 1 2 ... 8 9 10 ... 15 16
    const pages = [];
    
    // Toujours inclure les 2 premières pages
    pages.push(1, 2);
    
    // Ajouter les points de suspension si nécessaire
    if (currentPage > 4) {
        pages.push('...');
    }
    
    // Pages autour de la page courante
    let start = Math.max(3, currentPage - 1);
    let end = Math.min(totalPages - 2, currentPage + 1);
    
    // Ajuster si on est proche du début ou de la fin
    if (currentPage <= 4) {
        start = 3;
        end = Math.min(totalPages - 2, 5);
    }
    if (currentPage >= totalPages - 3) {
        start = Math.max(3, totalPages - 4);
        end = totalPages - 2;
    }
    
    for (let i = start; i <= end; i++) {
        if (i > 2 && i < totalPages - 1) {
            pages.push(i);
        }
    }
    
    // Ajouter les points de suspension si nécessaire
    if (currentPage < totalPages - 3) {
        pages.push('...');
    }
    
    // Toujours inclure les 2 dernières pages
    if (totalPages > 2) {
        pages.push(totalPages - 1, totalPages);
    }
    
    // Supprimer les doublons en gardant l'ordre
    const uniquePages = [];
    for (const page of pages) {
        if (uniquePages.indexOf(page) === -1) {
            uniquePages.push(page);
        }
    }
    
    // Créer les éléments DOM
    uniquePages.forEach(page => {
        const span = createPageSpan(page, page === currentPage);
        pageNumbersContainer.appendChild(span);
    });
}

function createPageSpan(pageNumber, isActive) {
    const span = document.createElement('span');
    span.textContent = pageNumber;
    
    if (pageNumber === '...') {
        span.classList.add('ellipsis');
        span.style.cursor = 'default';
    } else {
        if (isActive) {
            span.classList.add('active');
        }
        span.addEventListener('click', () => {
            if (pageNumber !== '...') {
                showPage(pageNumber);
            }
        });
    }
    
    return span;
}

// Les clics sur les numéros de pages sont maintenant gérés dans generateSmartPagination()

// Gestion du bouton précédent
const prevButton = document.querySelector('.prev-button');
if (prevButton) {
    prevButton.addEventListener('click', () => {
        if (currentPage > 1) {
            showPage(currentPage - 1);
        }
    });
}

// Gestion du bouton suivant
const nextButton = document.querySelector('.next-button');
if (nextButton) {
    nextButton.addEventListener('click', () => {
        const totalPages = Math.ceil(allRows.length / rowsPerPage);
        if (currentPage < totalPages) {
            showPage(currentPage + 1);
        }
    });
}

// Fonction pour déterminer le prix selon le type de document
function getDocumentPrice(documentName, documentType) {
    const docName = documentName.toLowerCase();
    const docType = documentType.toLowerCase();
    
    // Prix selon le type de document
    if (docName.includes('relevé') || docName.includes('releve') || docType.includes('banque')) {
        return '1000 FCFA';
    } else if (docName.includes('cni') || docName.includes('carte nationale') || docName.includes('identité')) {
        return '2000 FCFA';
    } else if (docName.includes('passeport')) {
        return '15000 FCFA';
    } else if (docName.includes('casier') || docName.includes('judiciaire')) {
        return '1500 FCFA';
    } else if (docName.includes('certificat') && (docName.includes('scolarité') || docName.includes('scolaire'))) {
        return '500 FCFA';
    } else if (docName.includes('bulletin') && docName.includes('salaire')) {
        return '800 FCFA';
    } else if (docName.includes('acte') && docName.includes('naissance')) {
        return '300 FCFA';
    } else if (docName.includes('permis') && docName.includes('conduire')) {
        return '5000 FCFA';
    } else if (docName.includes('diplôme') || docName.includes('diplome') || docName.includes('baccalauréat')) {
        return '1200 FCFA';
    } else if (docName.includes('attestation')) {
        return '400 FCFA';
    } else if (docName.includes('certificat') && docName.includes('résidence')) {
        return '600 FCFA';
    } else if (docName.includes('titre') && docName.includes('foncier')) {
        return '25000 FCFA';
    } else if (docName.includes('registre') && docName.includes('commerce')) {
        return '8000 FCFA';
    } else if (docName.includes('autorisation')) {
        return '3000 FCFA';
    } else if (docName.includes('licence')) {
        return '10000 FCFA';
    } else {
        return '1000 FCFA'; // Prix par défaut
    }
}



// Fonction pour ouvrir le modal d'aperçu
function openDocumentPreview(documentData) {
    const modal = document.getElementById('document-preview-modal');
    
    // Remplir les données du modal
    document.getElementById('preview-document-name').textContent = documentData.name;
    document.getElementById('preview-document-type').textContent = documentData.type;
    document.getElementById('preview-institution').textContent = documentData.institution;
    document.getElementById('preview-validity').textContent = documentData.validityDate;
    document.getElementById('preview-upload-date').textContent = documentData.uploadDate;
    document.getElementById('preview-price').textContent = documentData.price;
    
    // Mettre à jour le statut avec la bonne classe
    const statusElement = document.getElementById('preview-document-status');
    statusElement.textContent = documentData.status;
    statusElement.className = 'document-status';
    
    // Vérifier le statut de manière plus précise
    const statusLower = documentData.status.toLowerCase().trim();
    const isValidated = statusLower === 'validé' || statusLower === 'valide';
    const isNotValidated = statusLower === 'pas validé' || statusLower === 'non validé';
    
    console.log('Document status:', documentData.status, 'Is validated:', isValidated, 'Is not validated:', isNotValidated); // Debug
    
    if (isValidated) {
        statusElement.classList.add('valid');
    } else {
        statusElement.classList.add('not-valid');
    }
    
    // Mettre à jour le texte de l'aperçu selon le statut
    const previewTextElement = document.getElementById('preview-document-text');
    if (previewTextElement) {
        if (isValidated) {
            previewTextElement.textContent = 'Aperçu du document certifié';
        } else {
            previewTextElement.textContent = 'Aperçu du document';
        }
    }
    
    // Gérer l'affichage des boutons selon le statut
    const payButton = document.getElementById('pay-from-preview');
    const downloadButton = document.getElementById('download-from-preview');
    
    if (isValidated) {
        // Document validé - afficher le bouton de téléchargement
        payButton.style.display = 'none';
        downloadButton.style.display = 'inline-flex';
        downloadButton.innerHTML = '<i class="fi fi-rr-download"></i>Télécharger';
        downloadButton.className = 'btn-download';
    } else {
        // Document non validé - afficher le bouton de paiement  
        payButton.style.display = 'inline-flex';
        downloadButton.style.display = 'none';
        payButton.innerHTML = 'Payer maintenant';
        payButton.className = 'btn-pay';
    }
    
    // Stocker les données pour les actions
    sessionStorage.setItem('previewDocument', JSON.stringify(documentData));
    
    // Afficher le modal
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Fonction pour fermer le modal
function closeDocumentPreview() {
    const modal = document.getElementById('document-preview-modal');
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

// Initialiser les événements du modal
function initModal() {
    const modal = document.getElementById('document-preview-modal');
    const closeBtn = document.querySelector('.modal-close');
    const closePreviewBtn = document.getElementById('close-preview');
    const payFromPreviewBtn = document.getElementById('pay-from-preview');
    
    if (closeBtn) closeBtn.addEventListener('click', closeDocumentPreview);
    if (closePreviewBtn) closePreviewBtn.addEventListener('click', closeDocumentPreview);
    
    // Fermer en cliquant sur l'overlay
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeDocumentPreview();
            }
        });
    }
    
    // Fermer avec la touche Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
            closeDocumentPreview();
        }
    });
    
    // Bouton "Payer maintenant" depuis l'aperçu
    if (payFromPreviewBtn) {
        payFromPreviewBtn.addEventListener('click', () => {
            const documentData = JSON.parse(sessionStorage.getItem('previewDocument') || '{}');
            sessionStorage.setItem('selectedDocument', JSON.stringify(documentData));
            window.location.href = 'edit.html';
        });
    }
    
    // Bouton "Télécharger" depuis l'aperçu
    const downloadFromPreviewBtn = document.getElementById('download-from-preview');
    if (downloadFromPreviewBtn) {
        downloadFromPreviewBtn.addEventListener('click', () => {
            const documentData = JSON.parse(sessionStorage.getItem('previewDocument') || '{}');
            downloadDocument(documentData);
        });
    }
}

// Gestion des notifications (avec vérification d'existence)
const notificationIcon = document.querySelector('.notification-icon');
if (notificationIcon) {
    notificationIcon.addEventListener('click', () => {
        alert('Aucune nouvelle notification');
    });
} else {
    console.log('⚠️ Élément .notification-icon non trouvé - ignoré');
}

// Fonction pour télécharger un document
function downloadDocument(documentData) {
    // Créer un nom de fichier basé sur le document
    const fileName = `${documentData.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_${documentData.institution.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`;
    
    // Générer un vrai PDF
    generateDocumentPDF(documentData, fileName);
    
    // Afficher une notification de succès
    showDownloadNotification(documentData.name);
    
    // Fermer le modal
    closeDocumentPreview();
}

// Fonction pour générer un vrai document PDF
function generateDocumentPDF(documentData, fileName) {
    // Utiliser jsPDF pour créer un vrai PDF
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    // Configuration des couleurs
    const primaryColor = [0, 195, 108]; // Vert Certicam
    const darkColor = [16, 24, 40];
    const grayColor = [102, 112, 133];
    
    // En-tête avec logo et titre
    doc.setFillColor(...primaryColor);
    doc.rect(0, 0, 210, 40, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont(undefined, 'bold');
    doc.text('CERTICAM', 20, 20);
    
    doc.setFontSize(12);
    doc.setFont(undefined, 'normal');
    doc.text('Document Certifié', 20, 30);
    
    // Ligne de séparation
    doc.setDrawColor(...primaryColor);
    doc.setLineWidth(0.5);
    doc.line(20, 45, 190, 45);
    
    // Informations du document
    let yPos = 60;
    doc.setTextColor(...darkColor);
    doc.setFontSize(16);
    doc.setFont(undefined, 'bold');
    doc.text('Informations du document', 20, yPos);
    
    yPos += 15;
    doc.setFontSize(11);
    doc.setFont(undefined, 'normal');
    
    // Détails du document
    const details = [
        { label: 'Nom du document', value: documentData.name },
        { label: 'Type', value: documentData.type },
        { label: 'Institution émettrice', value: documentData.institution },
        { label: 'Date de validité', value: documentData.validityDate },
        { label: 'Date de mise en ligne', value: documentData.uploadDate },
        { label: 'Statut', value: documentData.status }
    ];
    
    details.forEach(detail => {
        doc.setTextColor(...grayColor);
        doc.text(detail.label + ':', 20, yPos);
        doc.setTextColor(...darkColor);
        doc.setFont(undefined, 'bold');
        doc.text(detail.value, 80, yPos);
        doc.setFont(undefined, 'normal');
        yPos += 10;
    });
    
    // Cadre de certification
    yPos += 10;
    doc.setDrawColor(...primaryColor);
    doc.setLineWidth(1);
    doc.roundedRect(20, yPos, 170, 40, 3, 3, 'S');
    
    yPos += 10;
    doc.setTextColor(...primaryColor);
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text('✓ Document Certifié', 25, yPos);
    
    yPos += 10;
    doc.setTextColor(...grayColor);
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    doc.text('Ce document a été certifié par Certicam et peut être vérifié', 25, yPos);
    yPos += 6;
    doc.text('en ligne sur notre plateforme.', 25, yPos);
    
    // Pied de page
    yPos = 260;
    doc.setDrawColor(...grayColor);
    doc.setLineWidth(0.3);
    doc.line(20, yPos, 190, yPos);
    
    yPos += 8;
    doc.setTextColor(...grayColor);
    doc.setFontSize(9);
    doc.text(`Document téléchargé le ${new Date().toLocaleDateString('fr-FR')} à ${new Date().toLocaleTimeString('fr-FR')}`, 20, yPos);
    
    yPos += 6;
    doc.text('Certicam - Plateforme de certification de documents', 20, yPos);
    
    // QR Code ou code de vérification (simulé)
    doc.setFontSize(8);
    doc.text(`Code de vérification: CERT-${Date.now().toString(36).toUpperCase()}`, 20, yPos + 6);
    
    // Sauvegarder le PDF
    doc.save(fileName);
}

// Fonction pour afficher une notification de téléchargement
function showDownloadNotification(documentName) {
    // Créer l'élément de notification
    const notification = document.createElement('div');
    notification.className = 'download-notification';
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fi fi-rr-check-circle"></i>
            <div class="notification-text">
                <strong>Téléchargement réussi</strong>
                <p>${documentName} a été téléchargé avec succès</p>
            </div>
        </div>
    `;
    
    // Ajouter au body
    document.body.appendChild(notification);
    
    // Afficher avec animation
    setTimeout(() => notification.classList.add('show'), 100);
    
    // Supprimer après 4 secondes
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 4000);
}

// Fonction pour attacher les événements aux boutons avec gestion des conflits
function initializeButtonEvents() {
    console.log('🔧 Initialisation des événements de boutons...');
    
    // Nettoyer les anciens gestionnaires d'événements pour éviter les doublons
    const allButtons = document.querySelectorAll('.action-button');
    allButtons.forEach(button => {
        const newButton = button.cloneNode(true);
        button.parentNode.replaceChild(newButton, button);
    });
    
    setTimeout(() => {
        // Gestion des boutons de paiement
        document.querySelectorAll('.action-button.pay').forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                const row = e.target.closest('tr');
                if (!row) return;
                
                const documentName = row.querySelector('.document-name')?.textContent;
                const documentType = row.cells[1]?.textContent;
                const institution = row.cells[2]?.textContent;
                const validityDate = row.cells[3]?.textContent;
                const statusElement = row.querySelector('.status');
                const status = statusElement ? statusElement.textContent : 'Inconnu';
                const documentPrice = getDocumentPrice(documentName, documentType);
                
                sessionStorage.setItem('selectedDocument', JSON.stringify({
                    name: documentName,
                    type: documentType,
                    institution: institution,
                    validityDate: validityDate,
                    status: status,
                    price: documentPrice
                }));
                
                window.location.href = 'edit.html';
            });
        });

        // Gestion des boutons de téléchargement
        document.querySelectorAll('.action-button.download').forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                const row = e.target.closest('tr');
                if (!row) return;
                
                const documentName = row.querySelector('.document-name')?.textContent;
                const documentType = row.cells[1]?.textContent;
                const institution = row.cells[2]?.textContent;
                const validityDate = row.cells[3]?.textContent;
                const statusElement = row.querySelector('.status');
                const status = statusElement ? statusElement.textContent : 'Inconnu';
                const uploadDate = row.querySelector('.document-date')?.textContent.replace('Mis en ligne le ', '');
                const documentPrice = getDocumentPrice(documentName, documentType);
                
                const documentData = {
                    name: documentName,
                    type: documentType,
                    institution: institution,
                    validityDate: validityDate,
                    status: status,
                    uploadDate: uploadDate,
                    price: documentPrice
                };
                
                downloadDocument(documentData);
            });
        });

        // Gestion des boutons de visualisation avec protection contre les conflits
        document.querySelectorAll('.action-button.view').forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                console.log('🔍 Clic sur bouton d\'aperçu détecté');
                
                const row = e.target.closest('tr');
                if (!row) {
                    console.error('❌ Impossible de trouver la ligne du document');
                    return;
                }
                
                const documentName = row.querySelector('.document-name')?.textContent;
                const documentType = row.cells[1]?.textContent;
                const institution = row.cells[2]?.textContent;
                const validityDate = row.cells[3]?.textContent;
                const statusElement = row.querySelector('.status');
                const status = statusElement ? statusElement.textContent.trim() : 'Inconnu';
                const uploadDate = row.querySelector('.document-date')?.textContent.replace('Mis en ligne le ', '');
                const documentPrice = getDocumentPrice(documentName, documentType);
                
                console.log('📄 Données du document:', {
                    name: documentName,
                    type: documentType,
                    institution: institution,
                    status: status
                });
                
                openDocumentPreview({
                    name: documentName,
                    type: documentType,
                    institution: institution,
                    validityDate: validityDate,
                    status: status,
                    uploadDate: uploadDate,
                    price: documentPrice
                });
            });
        });
        
        console.log('✅ Événements de boutons initialisés');
    }, 50);
}

// Gestion simple des filtres
function initFilters() {
    // Panel toggle
    const filterToggle = document.getElementById('filter-toggle');
    const filterPanel = document.getElementById('filter-panel');
    
    if (filterToggle && filterPanel) {
        filterToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            filterPanel.classList.toggle('active');
        });

        // Fermer en cliquant ailleurs
        document.addEventListener('click', function(e) {
            if (!filterPanel.contains(e.target) && !filterToggle.contains(e.target)) {
                filterPanel.classList.remove('active');
            }
        });

        // Bouton fermer
        const closeBtn = document.getElementById('filter-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                filterPanel.classList.remove('active');
            });
        }
    }

    // Bouton Appliquer
    const applyBtn = document.getElementById('apply-filters');
    if (applyBtn) {
        applyBtn.addEventListener('click', function() {
            filterDocuments();
            filterPanel.classList.remove('active');
        });
    }

    // Bouton Réinitialiser
    const resetBtn = document.getElementById('reset-filters');
    if (resetBtn) {
        resetBtn.addEventListener('click', function() {
            console.log('🔄 Réinitialisation des filtres...');
            
            // Reset radio buttons
            document.querySelectorAll('input[name="status-filter"]').forEach(radio => {
                radio.checked = radio.value === 'all';
            });
            document.querySelectorAll('input[name="type-filter"]').forEach(radio => {
                radio.checked = radio.value === 'all';
            });
            
            // Reset dates - utiliser la fonction de réinitialisation du picker avancé
            if (window.resetDateRangePicker) {
                window.resetDateRangePicker();
            }
            
            // Reset de la barre de recherche
            const searchInput = document.getElementById('search-input');
            const searchClear = document.getElementById('search-clear');
            if (searchInput) {
                searchInput.value = '';
            }
            if (searchClear) {
                searchClear.style.display = 'none';
            }
            
            // Réafficher tous les documents dans l'ordre d'origine
            showAllDocuments();
            filterToggle.classList.remove('has-filters');
            
            console.log('✅ Filtres réinitialisés, ordre chronologique restauré');
        });
    }

    // Initialiser le date range picker
    initDateRangePicker();
}

function initDateRangePicker() {
    const rangeInput = document.getElementById('date-range-input');
    const advancedPicker = document.getElementById('advanced-date-picker');
    const closeBtn = document.querySelector('.date-picker-close');
    const clearBtn = document.querySelector('.date-picker-clear');
    const applyBtn = document.querySelector('.date-picker-apply');
    
    // Variables pour stocker les dates sélectionnées
    let selectedStartDate = null;
    let selectedEndDate = null;
    let currentViewDate = new Date(2025, 8, 10); // 10 septembre 2025
    let activeTab = 'dates';
    let selectedRange = 'exact';

    if (!rangeInput || !advancedPicker) return;

    // Initialiser le calendrier
    initCalendar();
    initTabs();
    initQuickOptions();
    initFlexibleOptions();
    initMonthSelector();

    // Ouvrir/fermer le picker
    rangeInput.addEventListener('click', function(e) {
        e.stopPropagation();
        const isVisible = advancedPicker.style.display === 'block';
        advancedPicker.style.display = isVisible ? 'none' : 'block';
        if (!isVisible) {
            generateCalendar();
        }
    });

    // Mettre à jour l'affichage initial
    updateRangeDisplay();

    // Fermer le picker
    function closePicker() {
        advancedPicker.style.display = 'none';
    }

    closeBtn?.addEventListener('click', closePicker);

    // Fermer le picker si on clique ailleurs
    document.addEventListener('click', function(e) {
        if (!advancedPicker.contains(e.target) && !rangeInput.contains(e.target)) {
            closePicker();
        }
    });

    // Empêcher la fermeture lors des clics à l'intérieur du picker
    advancedPicker.addEventListener('click', function(e) {
        e.stopPropagation();
    });

    // Gestion des onglets
    function initTabs() {
        const tabButtons = document.querySelectorAll('.tab-button');
        const tabContents = document.querySelectorAll('.tab-content');

        tabButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.stopPropagation();
                const tabId = this.getAttribute('data-tab');
                
                // Mettre à jour les boutons
                tabButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                
                // Mettre à jour le contenu
                tabContents.forEach(content => content.classList.remove('active'));
                document.getElementById(tabId + '-tab')?.classList.add('active');
                
                activeTab = tabId;
            });
        });
    }

    // Initialiser le calendrier
    function initCalendar() {
        const prevBtn = document.getElementById('prev-month');
        const nextBtn = document.getElementById('next-month');

        prevBtn?.addEventListener('click', function(e) {
            e.stopPropagation();
            currentViewDate.setMonth(currentViewDate.getMonth() - 1);
            generateCalendar();
        });

        nextBtn?.addEventListener('click', function(e) {
            e.stopPropagation();
            currentViewDate.setMonth(currentViewDate.getMonth() + 1);
            generateCalendar();
        });
    }

    // Générer le calendrier
    function generateCalendar() {
        const calendarBody = document.getElementById('calendar-body');
        const monthYear = document.getElementById('current-month');
        
        if (!calendarBody || !monthYear) return;

        const year = currentViewDate.getFullYear();
        const month = currentViewDate.getMonth();
        
        const monthNames = [
            'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
            'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
        ];

        monthYear.textContent = `${monthNames[month]} ${year}`;

        // Calculer le premier jour du mois et le nombre de jours
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const startDate = new Date(firstDay);
        startDate.setDate(startDate.getDate() - (firstDay.getDay() + 6) % 7);

        calendarBody.innerHTML = '';

        // Générer 6 semaines (42 jours)
        for (let i = 0; i < 42; i++) {
            const currentDate = new Date(startDate);
            currentDate.setDate(startDate.getDate() + i);

            const dayElement = document.createElement('div');
            dayElement.className = 'calendar-day';
            dayElement.textContent = currentDate.getDate();

            // Classes pour styling
            if (currentDate.getMonth() !== month) {
                dayElement.classList.add('other-month');
            }

            const today = new Date(2025, 8, 10); // 10 septembre 2025
            if (currentDate.toDateString() === today.toDateString()) {
                dayElement.classList.add('today');
            }

            // Vérifier si la date est sélectionnée
            if (selectedStartDate && currentDate.toDateString() === selectedStartDate.toDateString()) {
                dayElement.classList.add('selected');
            }
            if (selectedEndDate && currentDate.toDateString() === selectedEndDate.toDateString()) {
                dayElement.classList.add('selected');
            }

            // Vérifier si la date est dans la plage
            if (selectedStartDate && selectedEndDate) {
                if (currentDate > selectedStartDate && currentDate < selectedEndDate) {
                    dayElement.classList.add('in-range');
                }
            }

            // Gestionnaire de clic
            dayElement.addEventListener('click', function(e) {
                e.stopPropagation();
                selectDate(currentDate);
            });

            calendarBody.appendChild(dayElement);
        }
    }

    // Sélectionner une date
    function selectDate(date) {
        if (!selectedStartDate || (selectedStartDate && selectedEndDate)) {
            // Première sélection ou reset
            selectedStartDate = new Date(date);
            selectedEndDate = null;
        } else {
            // Deuxième sélection
            if (date < selectedStartDate) {
                selectedEndDate = selectedStartDate;
                selectedStartDate = new Date(date);
            } else {
                selectedEndDate = new Date(date);
            }
        }
        generateCalendar();
    }

    // Options rapides
    function initQuickOptions() {
        const quickOptions = document.querySelectorAll('.quick-option');
        
        quickOptions.forEach(option => {
            option.addEventListener('click', function(e) {
                e.stopPropagation();
                quickOptions.forEach(opt => opt.classList.remove('active'));
                this.classList.add('active');
                selectedRange = this.getAttribute('data-range');
            });
        });
    }

    // Sélecteur de mois
    function initMonthSelector() {
        const monthItems = document.querySelectorAll('.month-item');
        
        monthItems.forEach(item => {
            item.addEventListener('click', function(e) {
                e.stopPropagation();
                const monthIndex = parseInt(this.getAttribute('data-month'));
                const currentYear = new Date().getFullYear();
                
                selectedStartDate = new Date(currentYear, monthIndex, 1);
                selectedEndDate = new Date(currentYear, monthIndex + 1, 0);
                
                monthItems.forEach(m => m.classList.remove('active'));
                this.classList.add('active');
                
                updateRangeDisplay();
            });
        });
    }

    // Options flexibles
    function initFlexibleOptions() {
        const flexibleItems = document.querySelectorAll('.flexible-item');
        
        flexibleItems.forEach(item => {
            item.addEventListener('click', function(e) {
                e.stopPropagation();
                const period = this.getAttribute('data-period');
                const today = new Date(2025, 8, 10); // 10 septembre 2025
                
                flexibleItems.forEach(f => f.classList.remove('active'));
                this.classList.add('active');
                
                switch(period) {
                    case 'today':
                        selectedStartDate = new Date(today);
                        selectedEndDate = new Date(today);
                        break;
                    case 'week':
                        selectedStartDate = new Date(today);
                        selectedStartDate.setDate(today.getDate() - today.getDay() + 1);
                        selectedEndDate = new Date(selectedStartDate);
                        selectedEndDate.setDate(selectedStartDate.getDate() + 6);
                        break;
                    case 'month':
                        selectedStartDate = new Date(today.getFullYear(), today.getMonth(), 1);
                        selectedEndDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
                        break;
                    case 'next-month':
                        selectedStartDate = new Date(today.getFullYear(), today.getMonth() + 1, 1);
                        selectedEndDate = new Date(today.getFullYear(), today.getMonth() + 2, 0);
                        break;
                    case 'next-3months':
                        selectedStartDate = new Date(today);
                        selectedEndDate = new Date(today);
                        selectedEndDate.setMonth(today.getMonth() + 3);
                        break;
                    case 'next-6months':
                        selectedStartDate = new Date(today);
                        selectedEndDate = new Date(today);
                        selectedEndDate.setMonth(today.getMonth() + 6);
                        break;
                }
                
                updateRangeDisplay();
            });
        });
    }

    // Bouton Effacer
    clearBtn?.addEventListener('click', function(e) {
        e.stopPropagation();
        selectedStartDate = null;
        selectedEndDate = null;
        selectedRange = 'exact';
        
        // Reset des sélections actives
        document.querySelectorAll('.quick-option').forEach(opt => opt.classList.remove('active'));
        document.querySelector('.quick-option[data-range="exact"]')?.classList.add('active');
        document.querySelectorAll('.month-item').forEach(m => m.classList.remove('active'));
        document.querySelectorAll('.flexible-item').forEach(f => f.classList.remove('active'));
        
        updateRangeDisplay();
        generateCalendar();
        closePicker();
        
        const searchTerm = document.getElementById('search-input')?.value.toLowerCase() || '';
        applySearchAndFilters(searchTerm);
    });

    // Bouton Appliquer
    applyBtn?.addEventListener('click', function(e) {
        e.stopPropagation();
        updateRangeDisplay();
        closePicker();
        
        const searchTerm = document.getElementById('search-input')?.value.toLowerCase() || '';
        applySearchAndFilters(searchTerm);
    });

    // Mettre à jour l'affichage de la plage
    function updateRangeDisplay() {
        const textElement = rangeInput.querySelector('.date-range-text');
        
        if (selectedStartDate && selectedEndDate) {
            const startStr = formatDisplayDateShort(selectedStartDate);
            const endStr = formatDisplayDateShort(selectedEndDate);
            
            if (selectedStartDate.toDateString() === selectedEndDate.toDateString()) {
                textElement.textContent = startStr;
            } else {
                textElement.textContent = `${startStr} - ${endStr}`;
            }
            
            textElement.classList.remove('placeholder');
            
            if (selectedRange && selectedRange !== 'exact') {
                textElement.textContent += ` (±${selectedRange}j)`;
            }
        } else if (selectedStartDate) {
            textElement.textContent = `À partir du ${formatDisplayDateShort(selectedStartDate)}`;
            textElement.classList.remove('placeholder');
        } else {
            textElement.textContent = 'Sélectionner une période';
            textElement.classList.add('placeholder');
        }
    }

    function formatDisplayDateShort(date) {
        const days = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
        const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];
        
        const dayName = days[date.getDay()];
        const day = date.getDate();
        const month = months[date.getMonth()];
        const year = date.getFullYear();
        
        return `${dayName} ${day} ${month} ${year}`;
    }

    // Fonction pour obtenir les dates sélectionnées (utilisée par le système de filtrage)
    window.getSelectedDateRange = function() {
        return {
            start: selectedStartDate,
            end: selectedEndDate,
            range: selectedRange !== 'exact' ? parseInt(selectedRange) : 0
        };
    };

    // Fonction pour réinitialiser le picker (utilisée par le bouton réinitialiser)
    window.resetDateRangePicker = function() {
        selectedStartDate = null;
        selectedEndDate = null;
        selectedRange = 'exact';
        
        // Reset des sélections actives
        document.querySelectorAll('.quick-option').forEach(opt => opt.classList.remove('active'));
        document.querySelector('.quick-option[data-range="exact"]')?.classList.add('active');
        document.querySelectorAll('.month-item').forEach(m => m.classList.remove('active'));
        document.querySelectorAll('.flexible-item').forEach(f => f.classList.remove('active'));
        
        updateRangeDisplay();
        if (typeof generateCalendar === 'function') {
            generateCalendar();
        }
    };
}

function filterDocuments() {
    const searchTerm = document.getElementById('search-input')?.value.toLowerCase() || '';
    applySearchAndFilters(searchTerm);
}

function showAllDocuments() {
    console.log('🔄 Réinitialisation: affichage de tous les documents...');
    
    // D'abord, afficher toutes les lignes
    const rows = document.querySelectorAll('tbody tr');
    rows.forEach(row => {
        row.style.display = 'table-row';
    });
    
    // Restaurer l'ordre original au lieu de trier par date
    console.log('📅 Restauration de l\'ordre original du tableau...');
    restoreOriginalOrder();
    
    // Puis mettre à jour la pagination
    updateVisibleRowsAfterFilter();
    
    console.log('✅ Tous les documents affichés dans l\'ordre d\'origine');
}

function updateVisibleRowsAfterFilter() {
    console.log('🔄 Mise à jour des lignes visibles après filtrage...');
    const visibleRows = Array.from(document.querySelectorAll('tbody tr:not([style*="display: none"])'));
    allRows = visibleRows;
    currentPage = 1;
    showPage(1);
    updatePaginationButtons();
    
    // Réattacher les événements avec notre fonction améliorée
    setTimeout(() => {
        initializeButtonEvents();
        console.log('✅ Événements réattachés après filtrage');
    }, 100);
}

// Gestion du menu mobile
function initMobileMenu() {
    const menuButton = document.querySelector('.menu-button');
    const menuOverlay = document.querySelector('.mobile-menu-overlay');
    const menuClose = document.querySelector('.mobile-menu-close');
    const menuLinks = document.querySelectorAll('.mobile-menu-link');

    if (!menuButton || !menuOverlay || !menuClose) {
        console.log('Éléments du menu mobile introuvables');
        return;
    }

    // Ouvrir le menu
    menuButton.addEventListener('click', () => {
        menuOverlay.classList.add('active');
        menuButton.classList.add('active');
        document.body.style.overflow = 'hidden'; // Empêcher le scroll
    });

    // Fermer le menu avec le bouton X
    menuClose.addEventListener('click', () => {
        closeMenu();
    });

    // Fermer le menu en cliquant sur l'overlay
    menuOverlay.addEventListener('click', (e) => {
        if (e.target === menuOverlay) {
            closeMenu();
        }
    });

    // Fermer le menu avec la touche Échap
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && menuOverlay.classList.contains('active')) {
            closeMenu();
        }
    });

    // Gérer les clics sur les liens du menu
    menuLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            
            // Si le lien est juste "#", empêcher la navigation par défaut
            if (href === '#') {
                e.preventDefault();
            }
            
            // Supprimer la classe active de tous les éléments
            document.querySelectorAll('.mobile-menu-item').forEach(item => {
                item.classList.remove('active');
            });
            
            // Ajouter la classe active au parent du lien cliqué
            const parentItem = link.closest('.mobile-menu-item');
            if (parentItem) {
                parentItem.classList.add('active');
            }
            
            // Fermer le menu après un petit délai pour voir la sélection
            setTimeout(() => {
                closeMenu();
            }, 200);
            
            // Si c'est un vrai lien (pas "#"), permettre la navigation
            if (href && href !== '#') {
                // Le navigateur suivra le lien naturellement
                return;
            }
        });
    });

    function closeMenu() {
        menuOverlay.classList.remove('active');
        menuButton.classList.remove('active');
        document.body.style.overflow = ''; // Restaurer le scroll
    }
}

// Initialiser la pagination et les événements au chargement de la page
document.addEventListener('DOMContentLoaded', () => {
    console.log('📄 DOM chargé, lancement de l\'initialisation...');
    
    // Petit délai pour s'assurer que tous les éléments sont prêts
    setTimeout(() => {
        console.log('🚀 Initialisation des composants...');
        
        // Stocker l'ordre original AVANT toute manipulation
        storeOriginalOrder();
        
        // Utiliser notre nouvelle fonction d'initialisation
        initializePageComponents();
        
        // Ne PAS trier au chargement pour préserver l'ordre original
        // sortRowsByDate(); // Commenté pour préserver l'ordre HTML
        initPagination();
        initFilters();
        initModal();
        initMobileMenu(); // Restauré pour la compatibilité
        initRowsPerPageSelector();
        
        console.log('✅ Page index initialisée avec ordre original préservé');
    }, 100);
});
