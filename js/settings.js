// Gestion des paramètres
document.addEventListener('DOMContentLoaded', function() {
    initSettingsTabs();
    initToggleButtons();
    initPasswordVisibility();
    initPaymentMethods();
    initMobileMenu(); // Ajout de la gestion du menu mobile
    initAvatarUpload(); // Ajout de la gestion du changement d'avatar
});

// Initialize mobile menu
function initMobileMenu() {
    const menuButton = document.querySelector('.menu-button');
    const menuOverlay = document.querySelector('.mobile-menu-overlay');
    const menuClose = document.querySelector('.mobile-menu-close');
    const menuLinks = document.querySelectorAll('.mobile-menu-link');

    if (menuButton && menuOverlay) {
        menuButton.addEventListener('click', () => {
            menuOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }

    if (menuClose && menuOverlay) {
        menuClose.addEventListener('click', () => {
            menuOverlay.classList.remove('active');
            document.body.style.overflow = '';
        });
    }

    if (menuOverlay) {
        menuOverlay.addEventListener('click', (e) => {
            if (e.target === menuOverlay) {
                menuOverlay.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    // Fermer le menu lors de la navigation
    menuLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (menuOverlay) {
                menuOverlay.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    });
}

// Gestion des onglets
function initSettingsTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');
            
            // Retirer la classe active de tous les boutons et contenus
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Ajouter la classe active au bouton cliqué et au contenu correspondant
            this.classList.add('active');
            document.getElementById(targetTab).classList.add('active');
        });
    });
}

// Gestion des boutons toggle
function initToggleButtons() {
    // Toggle pour la langue
    const langButtons = document.querySelectorAll('.lang-btn');
    langButtons.forEach(button => {
        button.addEventListener('click', function() {
            langButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Toggle pour les notifications et 2FA
    const toggleGroups = document.querySelectorAll('.toggle-switch');
    toggleGroups.forEach(group => {
        const buttons = group.querySelectorAll('.toggle-btn');
        buttons.forEach(button => {
            button.addEventListener('click', function() {
                buttons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
            });
        });
    });
}

// Gestion de la visibilité des mots de passe
function initPasswordVisibility() {
    const toggleButtons = document.querySelectorAll('.toggle-visibility');
    
    toggleButtons.forEach(button => {
        button.addEventListener('click', function() {
            const input = this.parentNode.querySelector('input');
            const icon = this.querySelector('i');
            
            if (input.type === 'password') {
                input.type = 'text';
                icon.className = 'fi fi-rr-eye-crossed';
            } else {
                input.type = 'password';
                icon.className = 'fi fi-rr-eye';
            }
        });
    });
}

// Gestion des méthodes de paiement
function initPaymentMethods() {
    const paymentOptions = document.querySelectorAll('.payment-option');
    
    paymentOptions.forEach(option => {
        option.addEventListener('click', function() {
            paymentOptions.forEach(opt => opt.classList.remove('active'));
            this.classList.add('active');
            
            // Mettre à jour le label du champ selon le choix
            const logoImg = this.querySelector('.payment-logo');
            const input = document.querySelector('.payment-form input');
            const label = document.querySelector('.payment-form .form-label');
            
            if (logoImg.alt.includes('Orange')) {
                label.textContent = 'Numéro Orange Money';
                input.placeholder = 'Ex: 699009900';
            } else if (logoImg.alt.includes('MTN')) {
                label.textContent = 'Numéro MTN Mobile Money';
                input.placeholder = 'Ex: 677123456';
            }
        });
    });

    // Gestion de l'ajout de méthode de paiement
    const addButton = document.querySelector('.payment-actions .btn-primary');
    const cancelButton = document.querySelector('.payment-actions .btn-secondary');
    const phoneInput = document.querySelector('.payment-form input');

    addButton?.addEventListener('click', function() {
        const phoneNumber = phoneInput.value.trim();
        if (phoneNumber) {
            addPaymentMethod(phoneNumber);
            phoneInput.value = '';
        }
    });

    cancelButton?.addEventListener('click', function() {
        phoneInput.value = '';
    });
}

// Ajouter une méthode de paiement
function addPaymentMethod(phoneNumber) {
    const container = document.querySelector('.saved-payment-methods');
    const existingItems = container.querySelectorAll('.payment-method-item');
    
    // Créer le nouvel élément
    const newItem = document.createElement('div');
    newItem.className = 'payment-method-item';
    newItem.innerHTML = `
        <div class="payment-method-info">
            <i class="fi fi-rr-smartphone"></i>
            <span>+237 ${phoneNumber}</span>
        </div>
        <button class="btn-delete">
            <i class="fi fi-rr-trash"></i>
        </button>
    `;
    
    // Ajouter l'événement de suppression
    const deleteBtn = newItem.querySelector('.btn-delete');
    deleteBtn.addEventListener('click', function() {
        newItem.remove();
        
        // Si c'était le dernier élément, cacher le titre
        const remainingItems = container.querySelectorAll('.payment-method-item');
        if (remainingItems.length === 0) {
            const title = container.querySelector('h3');
            title.style.display = 'none';
        }
    });
    
    // Afficher le titre si c'est le premier élément
    if (existingItems.length === 0) {
        const title = container.querySelector('h3');
        title.style.display = 'block';
    }
    
    // Ajouter à la liste
    container.appendChild(newItem);
}

// Gestion de la sauvegarde des formulaires
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('btn-primary') && e.target.textContent.trim() === 'Enregistrer') {
        e.preventDefault();
        
        // Simuler la sauvegarde
        const originalText = e.target.textContent;
        e.target.textContent = 'Sauvegardé !';
        e.target.style.background = '#00c36c';
        
        setTimeout(() => {
            e.target.textContent = originalText;
            e.target.style.background = '';
        }, 2000);
    }
});

// Gestion du sélecteur de fuseau horaire
const timezoneSelect = document.querySelector('.timezone-select');
const timezoneBadge = document.querySelector('.timezone-badge');

timezoneSelect?.addEventListener('change', function() {
    const selectedOption = this.options[this.selectedIndex];
    timezoneBadge.textContent = selectedOption.textContent;
});

// Gestion du changement d'avatar
function initAvatarUpload() {
    const changeAvatarBtn = document.getElementById('change-avatar-btn');
    const avatarInput = document.getElementById('profile-avatar-input');
    const avatarImg = document.getElementById('profile-avatar-img');
    
    if (changeAvatarBtn && avatarInput && avatarImg) {
        // Ouvrir le sélecteur de fichier au clic sur le bouton
        changeAvatarBtn.addEventListener('click', function(e) {
            e.preventDefault();
            avatarInput.click();
        });
        
        // Gérer le changement d'image
        avatarInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            
            if (file) {
                // Vérifier que c'est bien une image
                if (!file.type.startsWith('image/')) {
                    alert('Veuillez sélectionner une image valide');
                    return;
                }
                
                // Vérifier la taille du fichier (max 5MB)
                const maxSize = 5 * 1024 * 1024; // 5MB en bytes
                if (file.size > maxSize) {
                    alert('La taille de l\'image ne doit pas dépasser 5 MB');
                    return;
                }
                
                // Lire et afficher l'image
                const reader = new FileReader();
                
                reader.onload = function(event) {
                    avatarImg.src = event.target.result;
                    
                    // Animation de confirmation
                    avatarImg.style.opacity = '0';
                    setTimeout(() => {
                        avatarImg.style.transition = 'opacity 0.3s ease';
                        avatarImg.style.opacity = '1';
                    }, 100);
                    
                    // Afficher un message de succès
                    showSuccessMessage('Photo de profil mise à jour !');
                };
                
                reader.onerror = function() {
                    alert('Erreur lors du chargement de l\'image');
                };
                
                reader.readAsDataURL(file);
            }
        });
    }
}

// Fonction pour afficher un message de succès
function showSuccessMessage(message) {
    // Vérifier si un message existe déjà
    let existingMessage = document.querySelector('.success-message-toast');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    const toast = document.createElement('div');
    toast.className = 'success-message-toast';
    toast.innerHTML = `
        <i class="fi fi-rr-check-circle"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(toast);
    
    // Animer l'apparition
    setTimeout(() => {
        toast.classList.add('show');
    }, 100);
    
    // Retirer après 3 secondes
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 3000);
}
