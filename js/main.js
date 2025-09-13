// Variables globales pour la pagination
let currentPage = 1;
let rowsPerPage = 8;
let allRows = [];

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
    
    // Trier les lignes visibles par date (du plus récent au plus ancien)
    sortRowsByDate();
    
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
    attachButtonEvents();
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

// Gestion des notifications
const notificationIcon = document.querySelector('.notification-icon');
notificationIcon.addEventListener('click', () => {
    alert('Aucune nouvelle notification');
});

// Fonction pour télécharger un document
function downloadDocument(documentData) {
    // Créer un nom de fichier basé sur le document
    const fileName = `${documentData.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_${documentData.institution.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`;
    
    // Simuler le téléchargement (dans un vrai système, ceci ferait appel à une API)
    // Pour la démo, on crée un fichier PDF simulé
    const pdfContent = generateDocumentPDF(documentData);
    
    // Créer un blob pour le téléchargement
    const blob = new Blob([pdfContent], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    
    // Créer un lien de téléchargement temporaire
    const downloadLink = document.createElement('a');
    downloadLink.href = url;
    downloadLink.download = fileName;
    downloadLink.style.display = 'none';
    
    // Ajouter au DOM, cliquer, puis supprimer
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    
    // Nettoyer l'URL
    URL.revokeObjectURL(url);
    
    // Afficher une notification de succès
    showDownloadNotification(documentData.name);
    
    // Fermer le modal
    closeDocumentPreview();
}

// Fonction pour générer un contenu PDF simulé
function generateDocumentPDF(documentData) {
    // Dans un vrai système, ceci générerait un vrai PDF avec les données du document
    // Pour la démo, on retourne un contenu texte simple
    return `
CERTICAM - Document Certifié
============================

Document: ${documentData.name}
Type: ${documentData.type}
Institution émettrice: ${documentData.institution}
Date de validité: ${documentData.validityDate}
Date de mise en ligne: ${documentData.uploadDate}
Statut: ${documentData.status}

Ce document a été certifié par Certicam et peut être vérifié en ligne.

Document téléchargé le: ${new Date().toLocaleDateString('fr-FR')}
    `.trim();
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

// Fonction pour initialiser tous les événements des boutons
function initializeButtonEvents() {
    // Réinitialiser les événements pour les boutons de paiement
    document.querySelectorAll('.action-button.pay').forEach(button => {
        // Supprimer les anciens événements
        button.replaceWith(button.cloneNode(true));
    });
    
    // Réinitialiser les événements pour les boutons de téléchargement
    document.querySelectorAll('.action-button.download').forEach(button => {
        // Supprimer les anciens événements
        button.replaceWith(button.cloneNode(true));
    });
    
    // Réinitialiser les événements pour les boutons de visualisation
    document.querySelectorAll('.action-button.view').forEach(button => {
        // Supprimer les anciens événements
        button.replaceWith(button.cloneNode(true));
    });
    
    // Réattacher les nouveaux événements
    attachButtonEvents();
}

// Fonction pour attacher les événements aux boutons
function attachButtonEvents() {
    // Gestion des boutons de paiement
    document.querySelectorAll('.action-button.pay').forEach(button => {
        button.addEventListener('click', function(e) {
            const row = e.target.closest('tr');
            const documentName = row.querySelector('.document-name').textContent;
            const documentType = row.cells[1].textContent;
            const institution = row.cells[2].textContent;
            const validityDate = row.cells[3].textContent;
            const status = row.querySelector('.status').textContent;
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
            const row = e.target.closest('tr');
            const documentName = row.querySelector('.document-name').textContent;
            const documentType = row.cells[1].textContent;
            const institution = row.cells[2].textContent;
            const validityDate = row.cells[3].textContent;
            const status = row.querySelector('.status').textContent;
            const uploadDate = row.querySelector('.document-date').textContent.replace('Mis en ligne le ', '');
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
    
    // Gestion des boutons de visualisation
    document.querySelectorAll('.action-button.view').forEach(button => {
        button.addEventListener('click', function(e) {
            const row = e.target.closest('tr');
            const documentName = row.querySelector('.document-name').textContent;
            const documentType = row.cells[1].textContent;
            const institution = row.cells[2].textContent;
            const validityDate = row.cells[3].textContent;
            const status = row.querySelector('.status').textContent.trim();
            const uploadDate = row.querySelector('.document-date').textContent.replace('Mis en ligne le ', '');
            const documentPrice = getDocumentPrice(documentName, documentType);
            
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
            
            // Réafficher tous les documents
            showAllDocuments();
            filterToggle.classList.remove('has-filters');
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
    const rows = document.querySelectorAll('tbody tr');
    rows.forEach(row => {
        row.style.display = 'table-row';
    });
    updateVisibleRowsAfterFilter();
}

function updateVisibleRowsAfterFilter() {
    const visibleRows = Array.from(document.querySelectorAll('tbody tr:not([style*="display: none"])'));
    allRows = visibleRows;
    currentPage = 1;
    showPage(1);
    updatePaginationButtons();
    attachButtonEvents();
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
    console.log('Initialisation de la page index...');
    sortRowsByDate(); // Trier dès le chargement
    initPagination();
    attachButtonEvents();
    initFilters();
    initModal();
    initMobileMenu(); // Restauré pour la compatibilité
    initRowsPerPageSelector();
    console.log('Page index initialisée');
});
