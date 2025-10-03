// Gestion des paramètres
document.addEventListener('DOMContentLoaded', function() {
    initSettingsTabs();
    initToggleButtons();
    initPasswordVisibility();
    initPaymentMethods();
    initMobileMenu(); // Ajout de la gestion du menu mobile
    initAvatarUpload(); // Ajout de la gestion du changement d'avatar
    initProfileSave(); // Ajout de la sauvegarde du profil
    loadUserProfile(); // Charger le profil utilisateur depuis sessionStorage
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
                    
                    // Sauvegarder immédiatement l'avatar dans sessionStorage
                    const userProfile = getUserProfile();
                    userProfile.avatar = event.target.result;
                    saveUserProfile(userProfile);
                    
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

// Fonction pour charger le profil utilisateur
function loadUserProfile() {
    const userProfile = getUserProfile();
    
    if (userProfile) {
        // Charger les valeurs dans les champs
        const firstnameInput = document.getElementById('user-firstname');
        const lastnameInput = document.getElementById('user-lastname');
        const emailInput = document.getElementById('user-email');
        const phoneInput = document.getElementById('user-phone');
        const addressInput = document.getElementById('user-address');
        const niuInput = document.getElementById('user-niu');
        const avatarImg = document.getElementById('profile-avatar-img');
        
        if (firstnameInput && userProfile.firstname) firstnameInput.value = userProfile.firstname;
        if (lastnameInput && userProfile.lastname) lastnameInput.value = userProfile.lastname;
        if (emailInput && userProfile.email) emailInput.value = userProfile.email;
        if (phoneInput && userProfile.phone) phoneInput.value = userProfile.phone;
        if (addressInput && userProfile.address) addressInput.value = userProfile.address;
        if (niuInput && userProfile.niu) niuInput.value = userProfile.niu;
        if (avatarImg && userProfile.avatar) avatarImg.src = userProfile.avatar;
    }
}

// Fonction pour obtenir le profil utilisateur depuis sessionStorage
function getUserProfile() {
    const profileData = sessionStorage.getItem('user_profile');
    if (profileData) {
        return JSON.parse(profileData);
    }
    
    // Profil par défaut
    return {
        firstname: 'Coco',
        lastname: 'Cobango',
        email: 'cococobango@gmail.com',
        phone: '699009900',
        address: 'Bastos, Rue 1770, Yaoundé, Cameroun',
        niu: 'P01222567890987',
        avatar: 'img/coco-profile.jpg'
    };
}

// Fonction pour sauvegarder le profil utilisateur
function saveUserProfile(profile) {
    sessionStorage.setItem('user_profile', JSON.stringify(profile));
    
    // Déclencher un événement personnalisé pour notifier les autres composants
    window.dispatchEvent(new CustomEvent('userProfileUpdated', { 
        detail: profile 
    }));
}

// Fonction pour initialiser la sauvegarde du profil
function initProfileSave() {
    const saveBtn = document.getElementById('save-profile-btn');
    
    if (saveBtn) {
        saveBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Récupérer les valeurs des champs
            const firstname = document.getElementById('user-firstname').value.trim();
            const lastname = document.getElementById('user-lastname').value.trim();
            const email = document.getElementById('user-email').value.trim();
            const phone = document.getElementById('user-phone').value.trim();
            const address = document.getElementById('user-address').value.trim();
            const niu = document.getElementById('user-niu').value.trim();
            const avatar = document.getElementById('profile-avatar-img').src;
            
            // Validation basique
            if (!firstname || !lastname || !email) {
                alert('Veuillez remplir les champs obligatoires (Nom, Prénoms, Email)');
                return;
            }
            
            // Validation email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                alert('Veuillez entrer une adresse email valide');
                return;
            }
            
            // Créer l'objet profil
            const userProfile = {
                firstname,
                lastname,
                email,
                phone,
                address,
                niu,
                avatar
            };
            
            // Sauvegarder dans sessionStorage
            saveUserProfile(userProfile);
            
            // Animation du bouton
            const originalText = saveBtn.textContent;
            saveBtn.textContent = 'Sauvegardé !';
            saveBtn.style.background = 'var(--color-green)';
            saveBtn.disabled = true;
            
            setTimeout(() => {
                saveBtn.textContent = originalText;
                saveBtn.style.background = '';
                saveBtn.disabled = false;
            }, 2000);
            
            // Afficher un message de succès
            showSuccessMessage('Profil mis à jour avec succès !');
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
