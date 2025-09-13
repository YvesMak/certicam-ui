// Support Page Enhanced JavaScript
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Support.js - DOM chargé, initialisation...');
    initSupportPage();
    initChatModal();
    initEmailModal();
    initAnimations();
    initMobileMenu(); // Ajout de la gestion du menu mobile
    console.log('✅ Support.js - Initialisation terminée');
});

// Initialize mobile menu - copié depuis main.js
function initMobileMenu() {
    console.log('🔧 Initialisation du menu mobile...');
    
    const menuButton = document.querySelector('.menu-button');
    const menuOverlay = document.querySelector('.mobile-menu-overlay');
    const menuClose = document.querySelector('.mobile-menu-close');
    const menuLinks = document.querySelectorAll('.mobile-menu-link');

    console.log('📱 Éléments trouvés:', {
        menuButton: !!menuButton,
        menuOverlay: !!menuOverlay,
        menuClose: !!menuClose,
        menuLinksCount: menuLinks.length
    });

    if (!menuButton || !menuOverlay || !menuClose) {
        console.log('❌ Éléments du menu mobile introuvables');
        return;
    }

    console.log('✅ Tous les éléments trouvés, ajout des écouteurs...');

    // Ouvrir le menu
    menuButton.addEventListener('click', () => {
        console.log('🔴 Clic sur bouton menu!');
        menuOverlay.classList.add('active');
        menuButton.classList.add('active');
        document.body.style.overflow = 'hidden'; // Empêcher le scroll
    });

    // Fermer le menu avec le bouton X
    menuClose.addEventListener('click', () => {
        console.log('🔴 Clic sur fermeture menu!');
        closeMenu();
    });

    // Fermer le menu en cliquant sur l'overlay
    menuOverlay.addEventListener('click', (e) => {
        if (e.target === menuOverlay) {
            console.log('🔴 Clic sur overlay!');
            closeMenu();
        }
    });

    // Fermer le menu avec la touche Échap
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && menuOverlay.classList.contains('active')) {
            console.log('🔴 Touche Escape!');
            closeMenu();
        }
    });

    // Gérer les clics sur les liens du menu
    menuLinks.forEach((link, index) => {
        link.addEventListener('click', (e) => {
            console.log(`🔴 Clic sur lien ${index}!`);
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
        console.log('🔒 Fermeture du menu');
        menuOverlay.classList.remove('active');
        menuButton.classList.remove('active');
        document.body.style.overflow = ''; // Restaurer le scroll
    }

    console.log('✅ Menu mobile complètement initialisé');
}

// Initialize support page features
function initSupportPage() {
    initSupportOptions();
    initStatusUpdates();
    initFAQInteractions();
}

// Initialize support options with enhanced UX
function initSupportOptions() {
    const launchChatBtn = document.getElementById('launch-chat');
    const sendEmailBtn = document.getElementById('send-email');
    const makeCallBtn = document.getElementById('make-call');

    // Enhanced chat launch with loading state
    launchChatBtn?.addEventListener('click', function() {
        this.innerHTML = '<i class="fi fi-rr-spinner"></i> Connexion...';
        this.style.pointerEvents = 'none';
        
        setTimeout(() => {
            openChatModal();
            this.innerHTML = '<i class="fi fi-rr-comment-alt"></i> Démarrer le chat';
            this.style.pointerEvents = 'auto';
        }, 1200);
    });

    sendEmailBtn?.addEventListener('click', function() {
        openEmailModal();
    });

    makeCallBtn?.addEventListener('click', function() {
        showCallModal();
    });
}

// Animation and interaction enhancements
function initAnimations() {
    // Stagger animation for support options
    const supportOptions = document.querySelectorAll('.support-option');
    supportOptions.forEach((option, index) => {
        option.style.opacity = '0';
        option.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            option.style.transition = 'all 0.6s ease';
            option.style.opacity = '1';
            option.style.transform = 'translateY(0)';
        }, index * 150 + 500);
    });
    
    // FAQ items animation
    const faqItems = document.querySelectorAll('.faq-item');
    
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'slideInUp 0.6s ease-out forwards';
            }
        });
    }, observerOptions);
    
    faqItems.forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(30px)';
        observer.observe(item);
    });
    
    // Add CSS for animations
    if (!document.getElementById('support-animations')) {
        const animationStyles = document.createElement('style');
        animationStyles.id = 'support-animations';
        animationStyles.textContent = `
            @keyframes slideInUp {
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            
            @keyframes fadeOut {
                from { opacity: 1; }
                to { opacity: 0; }
            }
            
            .support-btn:active {
                transform: scale(0.95);
            }
            
            .chat-action-btn:active {
                transform: scale(0.9);
            }
            
            .message {
                opacity: 0;
                transform: translateY(10px);
                transition: all 0.3s ease;
            }
            
            .message.show {
                opacity: 1;
                transform: translateY(0);
            }
        `;
        document.head.appendChild(animationStyles);
    }
    
    // Add smooth scroll behavior
    document.documentElement.style.scrollBehavior = 'smooth';
    
    // Enhance button interactions
    const buttons = document.querySelectorAll('.support-btn, .chat-action-btn');
    buttons.forEach(btn => {
        btn.addEventListener('mousedown', function() {
            this.style.transform = 'scale(0.95)';
        });
        
        btn.addEventListener('mouseup', function() {
            this.style.transform = '';
        });
        
        btn.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
    });
}

// Enhanced status updates with more realistic behavior
function initStatusUpdates() {
    const statusDot = document.querySelector('.status-dot.online');
    const statusText = document.querySelector('.status-text');
    const responseTime = document.querySelector('.response-time span');
    
    if (statusDot && statusText && responseTime) {
        let currentStatus = 'online';
        let responseTimeValue = 2;
        
        // Realistic status simulation
        setInterval(() => {
            // 95% chance to stay online, 5% to go offline briefly
            if (currentStatus === 'online' && Math.random() < 0.05) {
                // Brief offline period
                currentStatus = 'busy';
                statusDot.classList.remove('online');
                statusDot.style.background = '#ffa500';
                statusText.textContent = 'Équipe support occupée';
                
                // Back online after 30-60 seconds
                setTimeout(() => {
                    currentStatus = 'online';
                    statusDot.classList.add('online');
                    statusDot.style.background = '';
                    statusText.textContent = 'Équipe support disponible';
                }, Math.random() * 30000 + 30000);
            }
            
            // Vary response time realistically (1-4 minutes)
            responseTimeValue = Math.floor(Math.random() * 4) + 1;
            responseTime.textContent = `Temps de réponse moyen : ${responseTimeValue} min`;
            
        }, 60000); // Check every minute
    }
}

// FAQ interactions
function initFAQInteractions() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        item.addEventListener('click', function() {
            // Add click interaction for FAQ items
            this.style.transform = 'scale(0.98)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
            
            // Could expand to show more detailed answers
            console.log('FAQ item clicked:', this.querySelector('h4').textContent);
        });
    });
}

// Enhanced call modal
function showCallModal() {
    const modal = document.createElement('div');
    modal.className = 'call-modal-overlay';
    modal.innerHTML = `
        <div class="call-modal">
            <div class="call-header">
                <h3><i class="fi fi-rr-phone-call"></i> Appel Support Certicam</h3>
                <button class="call-close">&times;</button>
            </div>
            <div class="call-content">
                <div class="call-info">
                    <div class="call-icon">📞</div>
                    <h4>Numéro du support</h4>
                    <p class="phone-number">+237 6 XX XX XX XX</p>
                    <div class="call-hours">
                        <p><strong>Heures d'ouverture :</strong></p>
                        <p>Lun - Ven : 8h00 - 20h00</p>
                        <p>Sam - Dim : 9h00 - 17h00</p>
                    </div>
                    <div class="call-note">
                        <i class="fi fi-rr-info"></i>
                        <p>Pour les urgences critiques uniquement. Pour les questions générales, préférez le chat ou l'e-mail.</p>
                    </div>
                </div>
                <div class="call-actions">
                    <a href="tel:+33100000000" class="btn-call">
                        <i class="fi fi-rr-phone-call"></i>
                        Appeler maintenant
                    </a>
                    <button class="btn-cancel">Annuler</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Add styles for call modal
    const style = document.createElement('style');
    style.textContent = `
        .call-modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.7);
            backdrop-filter: blur(4px);
            z-index: 2000;
            display: flex;
            align-items: center;
            justify-content: center;
            animation: fadeIn 0.3s ease-out;
        }
        
        .call-modal {
            background: white;
            border-radius: var(--radius-lg);
            max-width: 400px;
            width: 90%;
            overflow: hidden;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            animation: slideUp 0.3s ease-out;
        }
        
        .call-header {
            background: var(--color-red);
            color: white;
            padding: var(--spacing-xl);
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .call-close {
            background: rgba(255, 255, 255, 0.2);
            border: none;
            color: white;
            border-radius: 50%;
            width: 32px;
            height: 32px;
            cursor: pointer;
            font-size: 18px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .call-content {
            padding: var(--spacing-2xl);
            text-align: center;
        }
        
        .call-icon {
            font-size: 48px;
            margin-bottom: var(--spacing-md);
        }
        
        .phone-number {
            font-size: var(--font-size-heading-sm);
            font-weight: var(--font-weight-bold);
            color: var(--color-red);
            margin: var(--spacing-md) 0;
            letter-spacing: 1px;
        }
        
        .call-hours {
            background: var(--color-gray-50);
            padding: var(--spacing-lg);
            border-radius: var(--radius-md);
            margin: var(--spacing-lg) 0;
            font-size: var(--font-size-body-sm);
        }
        
        .call-note {
            background: #fff3cd;
            padding: var(--spacing-md);
            border-radius: var(--radius-md);
            margin: var(--spacing-lg) 0;
            display: flex;
            gap: var(--spacing-sm);
            align-items: flex-start;
            text-align: left;
        }
        
        .call-note i {
            color: #856404;
            margin-top: 2px;
        }
        
        .call-note p {
            font-size: var(--font-size-body-xs);
            color: #856404;
            margin: 0;
        }
        
        .call-actions {
            display: flex;
            flex-direction: column;
            gap: var(--spacing-md);
            margin-top: var(--spacing-xl);
        }
        
        .btn-call {
            background: var(--color-red);
            color: white;
            padding: var(--spacing-md) var(--spacing-xl);
            border-radius: var(--radius-md);
            text-decoration: none;
            font-weight: var(--font-weight-semibold);
            display: flex;
            align-items: center;
            justify-content: center;
            gap: var(--spacing-xs);
            transition: all 0.3s ease;
        }
        
        .btn-call:hover {
            background: #dc2626;
            transform: translateY(-1px);
        }
        
        .btn-cancel {
            background: var(--color-gray-100);
            border: none;
            padding: var(--spacing-md);
            border-radius: var(--radius-md);
            cursor: pointer;
            font-weight: var(--font-weight-medium);
            transition: all 0.3s ease;
        }
        
        .btn-cancel:hover {
            background: var(--color-gray-200);
        }
    `;
    document.head.appendChild(style);
    
    // Close modal events
    modal.querySelector('.call-close').addEventListener('click', () => closeCallModal(modal));
    modal.querySelector('.btn-cancel').addEventListener('click', () => closeCallModal(modal));
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeCallModal(modal);
    });
}

function closeCallModal(modal) {
    modal.style.animation = 'fadeOut 0.3s ease-out';
    setTimeout(() => {
        document.body.removeChild(modal);
    }, 300);
}

// Enhanced chat modal with better UX
function initChatModal() {
    const chatModal = document.getElementById('chat-modal');
    const chatClose = document.getElementById('chat-close');
    const chatInput = document.getElementById('chat-input');
    const chatSend = document.getElementById('chat-send');
    const chatMessages = document.getElementById('chat-messages');
    
    let isTyping = false;
    let messageCount = 0;

    // Enhanced close functionality
    chatClose?.addEventListener('click', function() {
        closeChatModal();
    });

    // Enhanced send functionality
    chatSend?.addEventListener('click', function() {
        sendChatMessage();
    });

    // Enhanced input handling with character counter
    chatInput?.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendChatMessage();
        }
    });
    
    // Auto-resize textarea and update counter
    chatInput?.addEventListener('input', function() {
        // Auto-resize
        this.style.height = 'auto';
        this.style.height = Math.min(this.scrollHeight, 120) + 'px';
        
        // Update character counter
        const charCount = this.value.length;
        const maxChars = parseInt(this.getAttribute('maxlength')) || 1000;
        const counter = document.getElementById('char-counter');
        if (counter) {
            counter.textContent = `${charCount}/${maxChars}`;
            counter.style.color = charCount > maxChars * 0.9 ? 'var(--color-red)' : 'var(--color-text-secondary)';
        }
        
        // Update send button state
        const isEmpty = this.value.trim() === '';
        const sendBtn = document.getElementById('chat-send');
        if (sendBtn) {
            sendBtn.disabled = isEmpty || charCount > maxChars;
        }
    });

    // Le chat ne se ferme PAS automatiquement - seulement via le bouton de fermeture
    // Suppression des événements de fermeture automatique

    function sendChatMessage() {
        const message = chatInput.value.trim();
        if (!message || isTyping) return;

        messageCount++;
        
        // Add user message
        addChatMessage(message, 'user');
        
        // Reset input field
        chatInput.value = '';
        chatInput.style.height = 'auto';
        
        // Update character counter
        const counter = document.getElementById('char-counter');
        if (counter) {
            counter.textContent = '0/1000';
            counter.style.color = 'var(--color-text-secondary)';
        }
        
        // Reset send button
        const sendBtn = document.getElementById('chat-send');
        if (sendBtn) {
            sendBtn.disabled = true;
        }

        // Show typing indicator
        showTypingIndicator();
        
        // Simulate agent response
        setTimeout(() => {
            hideTypingIndicator();
            
            const responses = getContextualResponse(message, messageCount);
            const selectedResponse = responses[Math.floor(Math.random() * responses.length)];
            
            addChatMessage(selectedResponse, 'agent');
        }, Math.random() * 2000 + 1000); // 1-3 seconds
    }
    
    function getContextualResponse(message, count) {
        const lowerMessage = message.toLowerCase();
        
        if (lowerMessage.includes('bonjour') || lowerMessage.includes('salut') || count === 1) {
            return [
                "Bonjour ! Je suis Mireille, votre conseillère support. Comment puis-je vous aider aujourd'hui ?",
                "Salut ! Ravi de vous aider. Quel est le problème que vous rencontrez ?",
                "Bonjour et bienvenue sur le support Certicam ! En quoi puis-je vous assister ?"
            ];
        }
        
        if (lowerMessage.includes('problème') || lowerMessage.includes('bug') || lowerMessage.includes('erreur')) {
            return [
                "Je comprends que vous rencontrez un problème. Pouvez-vous me donner plus de détails sur ce qui se passe ?",
                "D'accord, décrivez-moi exactement ce qui ne fonctionne pas. Je vais vous aider à résoudre cela.",
                "Merci de me signaler ce problème. Pouvez-vous me dire quand cela a commencé ?"
            ];
        }
        
        if (lowerMessage.includes('document') || lowerMessage.includes('télécharg') || lowerMessage.includes('fichier')) {
            return [
                "Pour les questions liées aux documents, je peux vous guider. De quel type de document s'agit-il ?",
                "Les problèmes de téléchargement peuvent avoir plusieurs causes. Quel format de fichier essayez-vous de télécharger ?",
                "Je vais vous aider avec vos documents. Pouvez-vous me dire quelle action vous essayez d'effectuer ?"
            ];
        }
        
        if (lowerMessage.includes('merci') || lowerMessage.includes('parfait') || lowerMessage.includes('ok')) {
            return [
                "De rien ! N'hésitez pas si vous avez d'autres questions.",
                "Parfait ! Je suis là si vous avez besoin d'aide supplémentaire.",
                "Avec plaisir ! Y a-t-il autre chose que je puisse faire pour vous ?"
            ];
        }
        
        // Default responses
        return [
            "Je vois. Pouvez-vous me donner plus d'informations sur votre situation ?",
            "D'accord, je prends note. Comment puis-je vous aider davantage ?",
            "Merci pour ces détails. Laissez-moi voir comment je peux vous assister.",
            "Je comprends. Avez-vous essayé de redémarrer l'application ?",
            "Intéressant. Pouvez-vous me dire sur quel appareil vous utilisez Certicam ?"
        ];
    }

    function showTypingIndicator() {
        isTyping = true;
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message agent-message typing-indicator';
        typingDiv.id = 'typing-indicator';
        typingDiv.innerHTML = `
            <div class="message-avatar">
                <div class="agent-tag">Mireille</div>
            </div>
            <div class="message-content typing">
                <div class="typing-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        `;
        
        chatMessages.appendChild(typingDiv);
        scrollToBottom();
        
        // Add typing animation styles
        if (!document.getElementById('typing-styles')) {
            const style = document.createElement('style');
            style.id = 'typing-styles';
            style.textContent = `
                .typing-dots {
                    display: flex;
                    gap: 4px;
                    align-items: center;
                }
                .typing-dots span {
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                    background: var(--color-gray-400);
                    animation: typingBounce 1.4s infinite;
                }
                .typing-dots span:nth-child(2) { animation-delay: 0.2s; }
                .typing-dots span:nth-child(3) { animation-delay: 0.4s; }
                
                @keyframes typingBounce {
                    0%, 60%, 100% { transform: translateY(0); }
                    30% { transform: translateY(-10px); }
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    function hideTypingIndicator() {
        isTyping = false;
        const typingIndicator = document.getElementById('typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    function addChatMessage(message, sender, options = {}) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;
        
        const currentTime = new Date().toLocaleTimeString('fr-FR', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });

        if (sender === 'agent') {
            messageDiv.innerHTML = `
                <div class="message-avatar">
                    <div class="generic-avatar">
                        <i class="fi fi-rr-headset"></i>
                    </div>
                </div>
                <div class="message-content">
                    <div class="message-header">
                        <span class="sender-name">Conseiller Certicam</span>
                        <span class="message-time">${currentTime}</span>
                    </div>
                    <p>${message}</p>
                </div>
            `;
        } else {
            let attachmentHtml = '';
            if (options.type === 'attachment') {
                attachmentHtml = `
                    <div class="message-attachment">
                        <div class="attachment-preview">
                            <div class="attachment-icon">
                                <i class="${options.fileType}"></i>
                            </div>
                            <div class="attachment-info">
                                <span class="attachment-name">${options.fileName}</span>
                                <span class="attachment-size">${options.fileSize}</span>
                            </div>
                        </div>
                    </div>
                `;
            }
            
            messageDiv.innerHTML = `
                <div class="message-content">
                    <div class="message-header">
                        <span class="message-time">${currentTime}</span>
                    </div>
                    <p>${message}</p>
                    ${attachmentHtml}
                </div>
            `;
        }

        chatMessages.appendChild(messageDiv);
        
        // Add entrance animation
        setTimeout(() => {
            messageDiv.style.opacity = '1';
            messageDiv.style.transform = 'translateY(0)';
        }, 50);
        
        // Scroll to bottom after animation
        scrollToBottom();
    }
    
    function scrollToBottom() {
        const chatMessages = document.getElementById('chat-messages');
        if (chatMessages) {
            setTimeout(() => {
                chatMessages.scrollTop = chatMessages.scrollHeight;
            }, 150);
        }
    }
}

// Gestion de l'email modal
function initEmailModal() {
    const emailModal = document.getElementById('email-modal');
    const emailClose = document.getElementById('email-close');
    const emailCancel = document.getElementById('email-cancel');
    const emailForm = document.querySelector('.email-form');
    const fileInput = document.getElementById('email-attachment');
    const fileText = document.querySelector('.file-upload-text');

    emailClose?.addEventListener('click', function() {
        closeEmailModal();
    });

    emailCancel?.addEventListener('click', function() {
        closeEmailModal();
    });

    // Fermer l'email modal si on clique à l'extérieur
    emailModal?.addEventListener('click', function(e) {
        if (e.target === emailModal) {
            closeEmailModal();
        }
    });

    // Gestion du fichier joint
    fileInput?.addEventListener('change', function() {
        if (this.files && this.files[0]) {
            fileText.textContent = this.files[0].name;
        } else {
            fileText.textContent = 'Choisir un fichier';
        }
    });

    // Gestion de la soumission du formulaire
    emailForm?.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const subject = document.getElementById('email-subject').value.trim();
        const category = document.getElementById('email-category').value;
        const message = document.getElementById('email-message').value.trim();

        if (!subject || !message) {
            alert('Veuillez remplir tous les champs obligatoires.');
            return;
        }

        // Simuler l'envoi
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Envoi en cours...';
        submitBtn.disabled = true;

        setTimeout(() => {
            alert('Votre message a été envoyé avec succès !\n\nNous vous répondrons dans les plus brefs délais.');
            closeEmailModal();
            resetEmailForm();
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }, 2000);
    });

    function resetEmailForm() {
        emailForm.reset();
        fileText.textContent = 'Choisir un fichier';
    }
}

// Enhanced modal functions with animations
function openChatModal() {
    const chatModal = document.getElementById('chat-modal');
    if (chatModal) {
        chatModal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Toujours masquer le scroll quand le chat est ouvert
        
        // Focus on input avec délai pour une meilleure UX
        setTimeout(() => {
            const chatInput = document.getElementById('chat-input');
            if (chatInput) {
                chatInput.focus();
            }
        }, 400);
        
        // Toujours ajouter le message d'accueil au début de chaque session
        setTimeout(() => {
            addWelcomeMessage();
        }, 600);
        
        // Scroll vers le bas pour afficher le message d'accueil
        setTimeout(() => {
            const chatMessages = document.getElementById('chat-messages');
            if (chatMessages) {
                chatMessages.scrollTop = chatMessages.scrollHeight;
            }
        }, 800);
    }
}

function closeChatModal() {
    const chatModal = document.getElementById('chat-modal');
    if (chatModal) {
        // Animation de fermeture
        chatModal.style.animation = 'slideOutToRight 0.3s ease-out forwards';
        
        setTimeout(() => {
            chatModal.classList.remove('active');
            chatModal.style.animation = '';
            document.body.style.overflow = 'auto';
            
            // Nettoyer les messages de la session (sauf le système)
            const chatMessages = document.getElementById('chat-messages');
            if (chatMessages) {
                const systemMessage = chatMessages.querySelector('.system-message');
                chatMessages.innerHTML = '';
                if (systemMessage) {
                    chatMessages.appendChild(systemMessage);
                }
            }
            
            // Nettoyer les indicateurs de saisie
            const typingIndicator = document.getElementById('typing-indicator');
            if (typingIndicator) {
                typingIndicator.remove();
            }
            
            // Réinitialiser le compteur de caractères
            const chatInput = document.getElementById('chat-input');
            const charCounter = document.getElementById('char-counter');
            if (chatInput && charCounter) {
                chatInput.value = '';
                chatInput.style.height = 'auto';
                charCounter.textContent = '0/1000';
                charCounter.style.color = 'var(--color-text-secondary)';
            }
        }, 300);
    }
}

function addWelcomeMessage() {
    const chatMessages = document.getElementById('chat-messages');
    if (chatMessages) {
        // Vérifier s'il n'y a que le message système
        const hasOnlySystemMessage = chatMessages.children.length === 1 && 
                                   chatMessages.querySelector('.system-message');
        
        if (hasOnlySystemMessage) {
            const welcomeMsg = document.createElement('div');
            welcomeMsg.className = 'message agent-message';
            welcomeMsg.innerHTML = `
                <div class="message-avatar">
                    <div class="generic-avatar">
                        <i class="fi fi-rr-headset"></i>
                    </div>
                </div>
                <div class="message-content">
                    <div class="message-header">
                        <span class="sender-name">Conseiller Certicam</span>
                        <span class="message-time">${getCurrentTime()}</span>
                    </div>
                    <p>Bonjour et bienvenue sur Certicam ! 👋</p>
                    <p>Je suis là pour vous aider avec vos actes certifiés et démarches administratives. Comment puis-je vous assister ?</p>
                </div>
            `;
            chatMessages.appendChild(welcomeMsg);
            
            // Animation d'apparition
            setTimeout(() => {
                welcomeMsg.classList.add('show');
                chatMessages.scrollTop = chatMessages.scrollHeight;
            }, 100);
        }
    }
}

// Fonction utilitaire pour obtenir l'heure actuelle
function getCurrentTime() {
    const now = new Date();
    return now.getHours().toString().padStart(2, '0') + ':' + 
           now.getMinutes().toString().padStart(2, '0');
}

function openEmailModal() {
    const emailModal = document.getElementById('email-modal');
    emailModal?.classList.add('active');
}

function closeEmailModal() {
    const emailModal = document.getElementById('email-modal');
    emailModal?.classList.remove('active');
}

// Gestion de l'état de connexion de l'agent (simulation)
function updateAgentStatus() {
    const statusElement = document.querySelector('.agent-status');
    const statusText = document.querySelector('.agent-status-text');
    
    // Simuler un changement d'état aléatoire
    const isOnline = Math.random() > 0.2; // 80% de chance d'être en ligne
    
    if (isOnline) {
        statusElement?.classList.add('online');
        statusText.textContent = 'En ligne';
    } else {
        statusElement?.classList.remove('online');
        statusText.textContent = 'Absent';
    }
}

// Mettre à jour le statut de l'agent périodiquement
setInterval(updateAgentStatus, 30000); // Toutes les 30 secondes

// Animation d'écriture pour simuler que l'agent tape
function showTypingIndicator() {
    const chatMessages = document.getElementById('chat-messages');
    const typingDiv = document.createElement('div');
    typingDiv.className = 'message agent-message typing-indicator';
    typingDiv.innerHTML = `
        <div class="message-avatar">
            <div class="agent-tag">Mireille</div>
        </div>
        <div class="message-content">
            <div class="typing-dots">
                <span></span>
                <span></span>
                <span></span>
            </div>
        </div>
    `;
    
    chatMessages.appendChild(typingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    return typingDiv;
}

function removeTypingIndicator(typingDiv) {
    if (typingDiv && typingDiv.parentNode) {
        typingDiv.parentNode.removeChild(typingDiv);
    }
}

// Ajouter des styles pour l'indicateur de frappe si pas déjà présents
function addTypingStyles() {
    if (!document.getElementById('typing-styles')) {
        const style = document.createElement('style');
        style.id = 'typing-styles';
        style.textContent = `
            .typing-indicator .message-content {
                background: var(--color-gray-100);
                padding: var(--spacing-sm) var(--spacing-md);
            }
            .typing-dots {
                display: flex;
                gap: 4px;
                align-items: center;
            }
            .typing-dots span {
                width: 6px;
                height: 6px;
                background: var(--color-gray-500);
                border-radius: 50%;
                animation: typingBounce 1.4s infinite;
            }
            .typing-dots span:nth-child(2) { animation-delay: 0.2s; }
            .typing-dots span:nth-child(3) { animation-delay: 0.4s; }
            @keyframes typingBounce {
                0%, 60%, 100% { transform: translateY(0); }
                30% { transform: translateY(-6px); }
            }
        `;
        document.head.appendChild(style);
    }
}

// Initialiser les styles au chargement
addTypingStyles();

// File attachment functionality
    const attachBtn = document.getElementById('attach-file');
    const emojiBtn = document.getElementById('add-emoji');
    
    attachBtn?.addEventListener('click', function() {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = '.jpg,.jpeg,.png,.pdf,.doc,.docx,.txt';
        fileInput.style.display = 'none';
        
        fileInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                handleFileAttachment(file);
            }
        });
        
        document.body.appendChild(fileInput);
        fileInput.click();
        document.body.removeChild(fileInput);
    });
    
    emojiBtn?.addEventListener('click', function() {
        showEmojiPicker();
    });
    
    function handleFileAttachment(file) {
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
            showToast('Fichier trop volumineux (max 5MB)', 'error');
            return;
        }
        
        // Create attachment preview message
        const attachmentMessage = `Fichier joint : ${file.name}`;
        addChatMessage(attachmentMessage, 'user', {
            type: 'attachment',
            fileName: file.name,
            fileSize: formatFileSize(file.size),
            fileType: getFileIcon(file.name)
        });
        
        // Simulate upload and response
        setTimeout(() => {
            const response = "Merci pour le fichier ! Je l'examine et reviens vers vous dans quelques instants.";
            addChatMessage(response, 'agent');
        }, 1500);
    }
    
    function showEmojiPicker() {
        const emojis = ['😊', '👍', '👎', '❤️', '😂', '😮', '😢', '🎉', '✅', '❌', '📎', '📋'];
        const emojiPicker = document.createElement('div');
        emojiPicker.className = 'emoji-picker';
        emojiPicker.innerHTML = `
            <div class="emoji-grid">
                ${emojis.map(emoji => `<button class="emoji-btn" data-emoji="${emoji}">${emoji}</button>`).join('')}
            </div>
        `;
        
        // Position near emoji button
        const rect = emojiBtn.getBoundingClientRect();
        emojiPicker.style.position = 'absolute';
        emojiPicker.style.bottom = '60px';
        emojiPicker.style.left = '60px';
        
        document.querySelector('.chat-input-container').appendChild(emojiPicker);
        
        // Handle emoji selection
        emojiPicker.addEventListener('click', function(e) {
            if (e.target.classList.contains('emoji-btn')) {
                const emoji = e.target.dataset.emoji;
                chatInput.value += emoji;
                chatInput.dispatchEvent(new Event('input'));
                chatInput.focus();
                emojiPicker.remove();
            }
        });
        
        // Close on outside click
        setTimeout(() => {
            document.addEventListener('click', function closeEmojiPicker(e) {
                if (!emojiPicker.contains(e.target) && e.target !== emojiBtn) {
                    emojiPicker.remove();
                    document.removeEventListener('click', closeEmojiPicker);
                }
            });
        }, 100);
    }
    
    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
    }
    
    function getFileIcon(fileName) {
        const ext = fileName.split('.').pop().toLowerCase();
        const iconMap = {
            'pdf': 'fi-rr-file-pdf',
            'doc': 'fi-rr-file-word',
            'docx': 'fi-rr-file-word',
            'jpg': 'fi-rr-picture',
            'jpeg': 'fi-rr-picture',
            'png': 'fi-rr-picture',
            'txt': 'fi-rr-document'
        };
        return iconMap[ext] || 'fi-rr-clip';
    }
    
    function showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        
        // Add toast styles if not exist
        if (!document.getElementById('toast-styles')) {
            const toastStyles = document.createElement('style');
            toastStyles.id = 'toast-styles';
            toastStyles.textContent = `
                .toast {
                    position: fixed;
                    top: var(--spacing-xl);
                    right: var(--spacing-xl);
                    background: var(--color-surface-primary);
                    border: 2px solid var(--color-gray-200);
                    border-radius: var(--radius-md);
                    padding: var(--spacing-md) var(--spacing-lg);
                    font-size: var(--font-size-body-sm);
                    z-index: 2000;
                    animation: slideInRight 0.3s ease-out;
                }
                .toast-error { border-color: var(--color-red); color: var(--color-red); }
                .toast-success { border-color: var(--color-green); color: var(--color-green); }
                
                @keyframes slideInRight {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
            `;
            document.head.appendChild(toastStyles);
        }
        
        document.body.appendChild(toast);
        setTimeout(() => {
            toast.style.animation = 'slideInRight 0.3s ease-out reverse';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
