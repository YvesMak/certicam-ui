// Script de diagnostic pour identifier les problèmes JavaScript

console.log('🔍 === DIAGNOSTIC DES CONFLITS JAVASCRIPT ===');

// 1. Vérifier si toutes les fonctions existent
const requiredFunctions = [
    'getDocumentPrice',
    'openDocumentPreview', 
    'downloadDocument',
    'closeDocumentPreview',
    'initializeButtonEvents',
    'filterDocuments',
    'showAllDocuments',
    'updateVisibleRowsAfterFilter'
];

console.log('📋 Vérification des fonctions requises :');
requiredFunctions.forEach(funcName => {
    if (typeof window[funcName] === 'function') {
        console.log(`✅ ${funcName} : OK`);
    } else {
        console.log(`❌ ${funcName} : MANQUANTE`);
    }
});

// 2. Vérifier si tous les éléments DOM requis existent
const requiredElements = [
    'document-preview-modal',
    'preview-document-name',
    'preview-document-type', 
    'preview-institution',
    'preview-validity',
    'preview-document-status',
    'preview-upload-date',
    'preview-price',
    'close-preview',
    'pay-from-preview',
    'download-from-preview'
];

console.log('\n🏗️ Vérification des éléments DOM requis :');
requiredElements.forEach(elementId => {
    const element = document.getElementById(elementId);
    if (element) {
        console.log(`✅ #${elementId} : OK`);
    } else {
        console.log(`❌ #${elementId} : MANQUANT`);
    }
});

// 3. Vérifier les boutons d'action
setTimeout(() => {
    console.log('\n🔘 Vérification des boutons d\'action :');
    const payButtons = document.querySelectorAll('.action-button.pay');
    const downloadButtons = document.querySelectorAll('.action-button.download');
    const viewButtons = document.querySelectorAll('.action-button.view');
    
    console.log(`🔴 Boutons "Payer" : ${payButtons.length}`);
    console.log(`⬇️ Boutons "Télécharger" : ${downloadButtons.length}`);
    console.log(`👁️ Boutons "Aperçu" : ${viewButtons.length}`);
    
    // 4. Tester un bouton d'aperçu si disponible
    if (viewButtons.length > 0) {
        console.log('\n🧪 Test du premier bouton d\'aperçu...');
        const firstViewButton = viewButtons[0];
        const row = firstViewButton.closest('tr');
        
        if (row) {
            const documentName = row.querySelector('.document-name')?.textContent;
            const documentType = row.cells[1]?.textContent;
            console.log(`📄 Document trouvé : ${documentName} (${documentType})`);
            
            // Ajouter un listener de test
            firstViewButton.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                console.log('🎯 CLIC DE TEST DÉTECTÉ sur bouton d\'aperçu !');
                
                try {
                    const documentData = {
                        name: documentName,
                        type: documentType,
                        status: 'Test',
                        institution: 'Test Institution',
                        validityDate: 'Test Date',
                        uploadDate: 'Test Upload',
                        price: '1000 FCFA'
                    };
                    
                    if (typeof openDocumentPreview === 'function') {
                        openDocumentPreview(documentData);
                        console.log('✅ openDocumentPreview appelée avec succès');
                    } else {
                        console.log('❌ openDocumentPreview n\'est pas une fonction');
                    }
                } catch (error) {
                    console.log('❌ Erreur lors du test :', error.message);
                }
            });
            
            console.log('✅ Listener de test ajouté au premier bouton');
        } else {
            console.log('❌ Impossible de trouver la ligne du tableau');
        }
    }
    
    // 5. Vérifier les filtres
    console.log('\n🎛️ Vérification des éléments de filtrage :');
    const filterToggle = document.getElementById('filter-toggle');
    const filterPanel = document.getElementById('filter-panel');
    const applyFilters = document.getElementById('apply-filters');
    
    console.log(`🎛️ Bouton filtre : ${filterToggle ? 'OK' : 'MANQUANT'}`);
    console.log(`📋 Panneau filtre : ${filterPanel ? 'OK' : 'MANQUANT'}`);
    console.log(`✅ Bouton appliquer : ${applyFilters ? 'OK' : 'MANQUANT'}`);
    
    console.log('\n🏁 === FIN DU DIAGNOSTIC ===');
    console.log('💡 Cliquez maintenant sur un bouton "Aperçu" pour tester !');
}, 1000);
