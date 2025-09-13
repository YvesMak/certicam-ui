// Edit page functionality
document.addEventListener('DOMContentLoaded', function() {
    // Load document info from sessionStorage
    const documentInfo = JSON.parse(sessionStorage.getItem('selectedDocument') || '{}');
    const productSelect = document.getElementById('produit');
    
    // Set default selection based on document info
    if (documentInfo.name) {
        const productName = documentInfo.name.toLowerCase();
        
        // Sélectionner le bon produit selon le document
        if (productName.includes('relevé') || productName.includes('releve')) {
            productSelect.value = 'releve-1000';
        } else if (productName.includes('cni') || productName.includes('carte nationale')) {
            productSelect.value = 'cni-2000';
        } else if (productName.includes('passeport')) {
            productSelect.value = 'passeport-15000';
        } else if (productName.includes('casier') || productName.includes('judiciaire')) {
            productSelect.value = 'casier-1500';
        } else if (productName.includes('certificat') && productName.includes('scolarité')) {
            productSelect.value = 'certificat-scolarite-500';
        } else if (productName.includes('bulletin') && productName.includes('salaire')) {
            productSelect.value = 'bulletin-salaire-800';
        } else if (productName.includes('acte') && productName.includes('naissance')) {
            productSelect.value = 'acte-naissance-300';
        } else if (productName.includes('permis') && productName.includes('conduire')) {
            productSelect.value = 'permis-conduire-5000';
        } else if (productName.includes('diplôme') || productName.includes('diplome') || productName.includes('baccalauréat')) {
            productSelect.value = 'diplome-1200';
        } else if (productName.includes('attestation')) {
            productSelect.value = 'attestation-400';
        } else if (productName.includes('certificat') && productName.includes('résidence')) {
            productSelect.value = 'certificat-residence-600';
        } else if (productName.includes('titre') && productName.includes('foncier')) {
            productSelect.value = 'titre-foncier-25000';
        } else if (productName.includes('registre') && productName.includes('commerce')) {
            productSelect.value = 'registre-commerce-8000';
        } else if (productName.includes('autorisation')) {
            productSelect.value = 'autorisation-3000';
        } else if (productName.includes('licence')) {
            productSelect.value = 'licence-10000';
        }
        
        console.log('Document sélectionné:', documentInfo);
        console.log('Produit sélectionné:', productSelect.value);
    }

    // Handle product selection change
    productSelect.addEventListener('change', function(e) {
        const selectedOption = e.target.options[e.target.selectedIndex];
        const productData = {
            value: selectedOption.value,
            text: selectedOption.text,
            name: selectedOption.text.split(' - ')[0],
            price: selectedOption.text.split(' - ')[1]
        };
        sessionStorage.setItem('selectedProduct', JSON.stringify(productData));
    });

    const form = document.querySelector('.edit-form');

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get selected product info
        const selectedOption = productSelect.options[productSelect.selectedIndex];
        const productInfo = {
            value: selectedOption.value,
            text: selectedOption.text,
            name: selectedOption.text.split(' - ')[0],
            price: selectedOption.text.split(' - ')[1]
        };
        
        // Collect form data
        const formData = {
            nom: document.getElementById('nom').value,
            prenom: document.getElementById('prenom').value,
            email: document.getElementById('email').value,
            adresse: document.getElementById('adresse').value,
            telephone: document.getElementById('telephone').value,
            produit: productInfo
        };

        // Store form data and product info for payment page
        sessionStorage.setItem('billingInfo', JSON.stringify(formData));
        sessionStorage.setItem('selectedDocument', JSON.stringify(productInfo));
        
        // Redirect to payment page
        window.location.href = 'payment.html';
    });
});
