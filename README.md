# 📋 Certicam - Interface de Gestion de Documents

Interface utilisateur moderne pour la consultation et gestion des documents administratifs avec système de filtres avancés et pagination intelligente.

## ✨ Fonctionnalités

### 🔍 **Recherche et Filtres**
- Recherche textuelle en temps réel
- Filtres par statut (Validé/Pas validé)
- Filtres par type (Diplôme/Certificat/Banque)
- Interface avec chips modernes
- Pagination intelligente avec points de suspension

### 📱 **Interface Responsive**
- Design adaptatif mobile/desktop
- Menu burger avec navigation latérale
- Modales modernes avec backdrop blur
- Système de design tokens cohérent

### ⚙️ **Gestion des Paramètres**
- Onglets de préférences (Langue, Fuseau horaire)
- Gestion des notifications
- Sécurité (Mot de passe, 2FA)
- Profil utilisateur
- Facturation et moyens de paiement

### 💬 **Support Client**
- Chat en temps réel avec agents
- Système de tickets par email
- Support téléphonique
- Interface illustrée moderne

### 🎨 **Design System**
- Palette de couleurs Certicam
- Typographie Outfit
- Variables CSS centralisées
- Arrondis et espacements standardisés

## 🛠️ Technologies

- **HTML5** - Structure sémantique
- **CSS3** - Styling avec custom properties
- **JavaScript Vanilla** - Interactions et logique
- **Flaticon** - Icônes cohérentes

## 🚀 Installation

1. Clonez le repository :
```bash
git clone https://github.com/[votre-username]/certicam-ui.git
```

2. Naviguez dans le dossier :
```bash
cd certicam-ui
```

3. Ouvrez `index.html` dans votre navigateur ou utilisez un serveur local.

## 📁 Structure du Projet

```
certicam-ui/
├── index.html              # Page d'accueil principale
├── settings.html           # Page de paramètres utilisateur
├── support.html           # Page de support client
├── transactions.html      # Historique des transactions
├── edit.html             # Formulaire d'édition
├── payment.html          # Page de paiement
├── css/
│   ├── style.css         # Styles principaux
│   ├── tokens.css        # Design tokens
│   ├── settings.css      # Styles des paramètres
│   ├── support.css       # Styles du support
│   ├── animations.css    # Animations et transitions
│   ├── transactions.css  # Styles des transactions
│   ├── edit.css         # Styles du formulaire
│   └── payment.css      # Styles de paiement
├── js/
│   ├── main.js          # JavaScript principal
│   ├── settings.js      # Logique des paramètres
│   ├── support.js       # Gestion du support
│   ├── transactions.js  # Logique des transactions
│   ├── edit.js         # Logique du formulaire
│   └── payment.js      # Gestion des paiements
├── img/
│   ├── certicam-main-logo.png
│   ├── coco-profile.jpg
│   ├── orange-logo.png
│   └── mtn-logo.png
└── README.md
├── index.html          # Page principale
├── edit.html           # Page d'édition (WIP)
├── payment.html        # Page de paiement (WIP)
├── css/
│   ├── style.css       # Styles principaux
│   ├── tokens.css      # Design tokens
│   ├── edit.css        # Styles édition
│   └── payment.css     # Styles paiement
├── js/
│   ├── main.js         # Logique principale
│   ├── edit.js         # Logique édition
│   └── payment.js      # Logique paiement
└── img/
    ├── certicam-main-logo.png
    ├── coco-profile.jpg
    └── autres assets...
```

## 🎯 Fonctionnalités Implémentées

### ✅ Système de Filtres
- [x] Filtres par statut et type
- [x] Recherche textuelle
- [x] Interface avec chips radio
- [x] Logique de filtrage dual-column

### ✅ Pagination Intelligente
- [x] Masquage automatique si ≤1 page
- [x] Points de suspension pour +7 pages
- [x] Navigation adaptative

### ✅ Menu Mobile
- [x] Navigation latérale avec slide
- [x] Profil utilisateur intégré
- [x] États actifs et hover
- [x] Fermeture multi-méthodes

### ✅ Modales
- [x] Design moderne avec backdrop blur
- [x] Boutons contextuels (télécharger/payer)
- [x] Responsive et accessible

## 🎨 Design System

### Couleurs
- **Vert Certicam** : `#00c36c`
- **Jaune** : `#ffd427` 
- **Rouge** : `#f4212f`
- **Palette grise** : 50 à 950

### Typographie
- **Font** : Outfit (Google Fonts)
- **Poids** : 500 (regular), 600 (medium), 700 (bold)

### Espacements
- **XS** : 8px
- **SM** : 12px  
- **MD** : 16px
- **LG** : 20px
- **XL** : 24px

## 🔧 Développement

Pour modifier le projet :

1. Les styles principaux sont dans `css/style.css`
2. Les tokens de design dans `css/tokens.css`
3. La logique JavaScript dans `js/main.js`
4. Utilisez un serveur local pour tester les changements

## 📱 Responsive Breakpoints

- **Mobile** : < 768px
- **Tablet** : 768px - 1024px
- **Desktop** : > 1024px

## 🚀 Déploiement

Le projet est entièrement statique et peut être déployé sur :
- GitHub Pages
- Netlify
- Vercel
- Tout serveur web statique

---

**Développé avec ❤️ pour Certicam**
