console.log('🧪 Test de réinitialisation des filtres'); 
function testResetFilters() {
    console.log('📋 Ordre avant test:', Array.from(document.querySelectorAll('tbody tr')).map(row => row.cells[0].textContent.trim()));
    
    // Simuler l'application d'un filtre
    document.querySelectorAll('tbody tr')[0].style.display = 'none';
    document.querySelectorAll('tbody tr')[2].style.display = 'none';
    console.log('🎯 Filtres appliqués (masqué quelques lignes)');
    
    // Réinitialiser
    if (typeof showAllDocuments === 'function') {
        showAllDocuments();
        console.log('📋 Ordre après reset:', Array.from(document.querySelectorAll('tbody tr')).map(row => row.cells[0].textContent.trim()));
        console.log('✅ Test terminé - vérifiez que l\'ordre est identique');
    } else {
        console.log('❌ Fonction showAllDocuments introuvable');
    }
}

window.testResetFilters = testResetFilters;
