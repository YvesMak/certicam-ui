document.addEventListener('DOMContentLoaded', function() {
    // Load billing info from sessionStorage and update the display
    loadBillingInfo();

    // Éléments du DOM
    const modifyButton = document.querySelector('.modify-button');
    const paymentOptions = document.querySelectorAll('.payment-option');
    const paymentForm = document.querySelector('.payment-form');
    const phoneInput = document.querySelector('.phone-input');
    const payButton = document.querySelector('.pay-button');
    let selectedMethod = null;

    // Gestion du bouton modifier
    modifyButton.addEventListener('click', () => {
        window.location.href = 'edit.html';
    });

    // Gestion des options de paiement
    paymentOptions.forEach(option => {
        option.addEventListener('click', () => {
            // Retirer la sélection de toutes les options
            paymentOptions.forEach(opt => opt.classList.remove('selected'));
            // Sélectionner l'option cliquée
            option.classList.add('selected');
            // Stocker la méthode sélectionnée
            selectedMethod = option.dataset.method;
            // Afficher le formulaire
            paymentForm.style.display = 'block';
            // Mettre à jour l'interface selon la méthode
            updatePaymentInterface(selectedMethod);
        });
    });

    // Mise à jour de l'interface selon la méthode
    function updatePaymentInterface(method) {
        // Pré-remplir avec le numéro de téléphone des données de facturation
        const billingInfo = JSON.parse(sessionStorage.getItem('billingInfo') || '{}');
        if (billingInfo.telephone) {
            phoneInput.value = billingInfo.telephone;
        }
    }

    // Gestion du bouton de paiement
    payButton.addEventListener('click', () => {
        if (!phoneInput.value) {
            alert('Veuillez entrer un numéro de téléphone');
            return;
        }
        if (!selectedMethod) {
            alert('Veuillez sélectionner une méthode de paiement');
            return;
        }
        
        // Simuler le paiement
        alert('Demande de paiement envoyée. Vous allez recevoir un appel de fond.');
        
        // Nettoyer les données après paiement réussi
        sessionStorage.removeItem('billingInfo');
        sessionStorage.removeItem('selectedDocument');
        
        // Rediriger vers la page d'accueil
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 2000);
    });

    // Validation du numéro de téléphone
    phoneInput.addEventListener('input', (e) => {
        // Permettre uniquement les chiffres
        e.target.value = e.target.value.replace(/[^0-9]/g, '');
        // Limiter à 9 chiffres
        if (e.target.value.length > 9) {
            e.target.value = e.target.value.slice(0, 9);
        }
    });
});

function loadBillingInfo() {
    // Get stored data from sessionStorage
    const billingInfo = JSON.parse(sessionStorage.getItem('billingInfo') || '{}');
    const selectedDocument = JSON.parse(sessionStorage.getItem('selectedDocument') || '{}');

    // Update display with billing info
    if (billingInfo.nom) {
        document.getElementById('payment-nom').textContent = billingInfo.nom;
    }
    if (billingInfo.prenom) {
        document.getElementById('payment-prenom').textContent = billingInfo.prenom;
    }
    if (billingInfo.telephone) {
        document.getElementById('payment-telephone').textContent = billingInfo.telephone;
    }
    if (billingInfo.email) {
        document.getElementById('payment-email').textContent = billingInfo.email;
    }
    if (billingInfo.adresse) {
        document.getElementById('payment-adresse').textContent = billingInfo.adresse;
    }

    // Update product info
    if (billingInfo.produit && billingInfo.produit.text) {
        document.getElementById('payment-produit').textContent = billingInfo.produit.text;
        document.getElementById('payment-total').textContent = billingInfo.produit.price;
    } else if (selectedDocument.text) {
        document.getElementById('payment-produit').textContent = selectedDocument.text;
        document.getElementById('payment-total').textContent = selectedDocument.price;
    }
}
