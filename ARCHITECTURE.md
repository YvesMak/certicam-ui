# 📚 Guide d'Architecture Certicam

## 🏗️ Vue d'ensemble

Ce projet utilise une architecture simple et directe basée sur du JavaScript vanilla avec des fichiers dédiés par page.

### 📁 Structure du projet

```
Certicam/
├── css/                    # Feuilles de style
│   ├── tokens.css         # Variables CSS (couleurs, espacements, etc.)
│   ├── style.css          # Styles principaux
│   ├── admin.css          # Styles spécifiques à l'admin
│   ├── payment.css        # Styles du module de paiement
│   ├── transactions.css   # Styles des transactions
│   └── edit.css           # Styles de la page d'édition
├── js/                    # Scripts JavaScript
│   ├── main.js           # Script principal (index.html)
│   ├── admin.js          # Gestion des utilisateurs (admin.html)
│   ├── transactions.js   # Historique des transactions (transactions.html)
│   ├── settings.js       # Paramètres utilisateur (settings.html)
│   ├── support.js        # Page de support (support.html)
│   ├── payment.js        # Module de paiement (payment.html)
│   └── edit.js           # Page d'édition (edit.html)
├── img/                  # Images et assets
├── *.html               # Pages de l'application
└── netlify.toml         # Configuration de déploiement
```

### 🎯 Architecture par page

Chaque page HTML a son propre fichier JavaScript correspondant :

- **`index.html`** → **`js/main.js`** : Page d'accueil avec dashboard et filtres
- **`admin.html`** → **`js/admin.js`** : Interface d'administration des utilisateurs
- **`transactions.html`** → **`js/transactions.js`** : Historique et gestion des transactions
- **`settings.html`** → **`js/settings.js`** : Page de paramètres utilisateur
- **`support.html`** → **`js/support.js`** : Page de support et aide
- **`payment.html`** → **`js/payment.js`** : Interface de paiement
- **`edit.html`** → **`js/edit.js`** : Page d'édition de documents

3. **Pages** (HTML avec attributs data-module)
   - Chaque page charge les modules nécessaires
   - Auto-découverte des composants via attributs

## 🚀 Utilisation

### Créer un nouveau composant

```javascript
class MonComposant extends Component {
    get defaultOptions() {
        return {
            option1: 'valeur',
            option2: true
        };
    }

    beforeMount() {
        this.state = {
            data: [],
            isLoading: false
        };
    }

    attachEvents() {
        this.addEventListener('.mon-bouton', 'click', () => {
            this.handleClick();
        });
    }

    handleClick() {
        this.setState({ isLoading: true });
        this.emit('buttonClicked', { data: 'example' });
    }
}

// Enregistrer le composant
moduleManager.register('MonComposant', () => ({
    init(element, options) {
        return new MonComposant(element, options);
    }
}));
```

### Utiliser un composant dans le HTML

```html
<div data-module="MonComposant" data-options='{"option1": "nouvelle-valeur"}'>
    <!-- Contenu du composant -->
</div>
```

### Gestion d'état global

```javascript
// Définir des données
globalState.setState('user.name', 'Coco');
globalState.setState('documents.list', []);

// Lire des données
const userName = globalState.get('user.name');

// Souscrire aux changements
const unsubscribe = globalState.subscribe((state, prevState) => {
    if (state.user !== prevState.user) {
        console.log('Utilisateur modifié:', state.user);
    }
});
```

### Routage (pour futures évolutions SPA)

```javascript
// Ajouter des routes
router.addRoute('/', () => console.log('Page d\'accueil'));
router.addRoute('/transactions/:id', (context) => {
    console.log('Transaction ID:', context.params.id);
});

// Navigation programmatique
router.navigate('/transactions/123');
```

## 📦 Structure des Modules

### Module de base

```javascript
moduleManager.register('MonModule', ['Dependency1', 'Dependency2'], (deps) => ({
    init(element, options) {
        // Initialisation du module
        console.log('Module initialisé avec:', deps);
    },
    
    destroy() {
        // Nettoyage
    }
}));
```

### Chargement des modules

```javascript
// Charger un module
const module = await moduleManager.load('MonModule');

// Charger plusieurs modules
await moduleManager.loadModules(['Module1', 'Module2']);

// Auto-découverte et initialisation
await moduleManager.autoInit();
```

## 🔧 Configuration par page

### Page Index
- Modules : Navigation, DocumentManager, Pagination, Filters
- Composants : MobileMenu, Pagination, Filters
- Fonctionnalités : Recherche, filtres, pagination des documents

### Page Transactions
- Modules : Navigation, TransactionManager, Pagination, Filters
- Composants : MobileMenu, Pagination, Filters
- Fonctionnalités : Historique des transactions avec filtres avancés

### Page Support
- Modules : Navigation, SupportManager
- Composants : MobileMenu
- Fonctionnalités : Centre d'aide et support client

### Page Settings
- Modules : Navigation, SettingsManager
- Composants : MobileMenu
- Fonctionnalités : Configuration utilisateur

## 🎯 Bonnes pratiques

### 1. Composants
- Hériter de la classe `Component`
- Définir un état initial dans `beforeMount()`
- Utiliser `setState()` pour les changements d'état
- Nettoyer dans `beforeDestroy()`

### 2. État global
- Utiliser pour les données partagées entre composants
- Préfixer les clés par module (ex: `user.name`, `documents.list`)
- Souscrire aux changements pour la réactivité

### 3. Modules
- Un module = une responsabilité
- Déclarer les dépendances explicitement
- Fournir une méthode `destroy()` pour le nettoyage

### 4. Événements
- Utiliser `emit()` pour communiquer vers l'extérieur
- Préfixer les événements (ex: `certicam:ready`)
- Nettoyer les listeners dans `destroy()`

## 🐛 Debug

En mode développement (localhost), plusieurs outils sont disponibles :

```javascript
// Informations de debug
console.log(window.debug());

// Recharger l'application
app.reload();

// État actuel
console.log(globalState.getState());

// Modules chargés
console.log(moduleManager.getLoadedModules());
```

## 🔄 Migration depuis l'ancien code

### Étapes de migration

1. **Identifier les fonctionnalités** à convertir en composants
2. **Créer la classe** héritant de `Component`
3. **Déplacer la logique** dans les méthodes appropriées
4. **Ajouter les attributs** data-module dans le HTML
5. **Enregistrer le module** dans le ModuleManager
6. **Tester** la fonctionnalité

### Exemple de migration

**Ancien code (menu.js):**
```javascript
function initMobileMenu() {
    const button = document.querySelector('.menu-button');
    button.addEventListener('click', () => {
        // Logique d'ouverture
    });
}
```

**Nouveau code (MobileMenu.js):**
```javascript
class MobileMenuComponent extends Component {
    attachEvents() {
        this.addEventListener('.menu-button', 'click', () => {
            this.toggle();
        });
    }
    
    toggle() {
        this.setState({ isOpen: !this.state.isOpen });
    }
}
```

## 🚀 Extensions futures

Cette architecture permet facilement :
- **Single Page Application** (SPA) avec le routeur
- **Components lazy loading** via le ModuleManager
- **State persistence** (localStorage/sessionStorage)
- **API integration** avec des modules dédiés
- **Testing** unitaire des composants
- **Hot reloading** en développement

## 📞 Support

Pour toute question sur l'architecture :
1. Consulter ce guide
2. Vérifier les exemples dans `/js/components/`
3. Utiliser les outils de debug en développement
