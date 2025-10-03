# Guide du Design Responsive - Certicam UI

## 📱 Breakpoints Standards

Le projet Certicam utilise une approche mobile-first avec les breakpoints suivants :

### Breakpoints Principaux

| Appareil | Breakpoint | Description |
|----------|-----------|-------------|
| 🖥️ **Large Desktop** | 1200px+ | Layout par défaut, grilles complètes |
| 💻 **Desktop** | 1024px - 1200px | Grilles ajustées, espacement réduit |
| 📱 **Tablet** | 768px - 1024px | Layout simplifié, colonnes réduites |
| 📱 **Tablet Small** | 640px - 768px | Grilles 1-2 colonnes, navigation compacte |
| 📱 **Mobile Large** | 480px - 640px | Single column, composants empilés |
| 📱 **Mobile** | 375px - 480px | Optimisation tactile, textes réduits |
| 📱 **Mobile Small** | 320px - 375px | Layout ultra-compact |

## 🎨 Stratégie Responsive

### 1. **Layout Adaptatif**

#### Desktop (1200px+)
```css
.documents-grid {
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: var(--spacing-xl);
}
```

#### Tablet (768px)
```css
.documents-grid {
    grid-template-columns: 1fr;
    gap: var(--spacing-md);
}
```

#### Mobile (480px)
```css
.documents-grid {
    grid-template-columns: 1fr;
    gap: var(--spacing-sm);
}
```

### 2. **Navigation**

- **Desktop** : Navbar horizontale complète
- **Tablet** : Menu hamburger avec overlay
- **Mobile** : Menu plein écran avec navigation tactile optimisée

### 3. **Modals**

- **Desktop** : Modals centrés avec largeur fixe (max 800px)
- **Tablet** : Modals 95% de la largeur d'écran
- **Mobile** : Modals plein écran (100% width/height)

### 4. **Forms**

- **Desktop** : Grilles 2-3 colonnes
- **Tablet** : 2 colonnes
- **Mobile** : 1 colonne, inputs empilés
- Touch targets minimum : **44px** (conformité WCAG)

### 5. **Tables**

- **Desktop** : Tables complètes
- **Tablet** : Scroll horizontal avec shadow indicators
- **Mobile** : Cards empilées (alternative recommandée)

## 📝 Fichiers avec Support Responsive Complet

### ✅ Pages Principales
- [x] `style.css` - Layout principal et composants globaux
- [x] `login.css` - Page de connexion
- [x] `register.css` - Page d'inscription
- [x] `transactions.css` - Historique transactions
- [x] `settings.css` - Paramètres utilisateur
- [x] `payment.css` - Page de paiement
- [x] `support.css` - Support client
- [x] `admin.css` - Dashboard admin
- [x] `agent-dashboard.css` - Dashboard agent
- [x] `checker-dashboard.css` - Dashboard checker
- [x] `document-upload.css` - Upload de documents
- [x] `email-verification.css` - Vérification email
- [x] `niu-entry.css` - Saisie NIU
- [x] `edit.css` - Édition de profil

### 🎯 Navbar & Navigation
- [x] `navbar-modern.css` - Menu mobile avec glassmorphism

## 🛠️ Bonnes Pratiques

### 1. **Utiliser les Design Tokens**

```css
/* ✅ Bon */
padding: var(--spacing-md);
font-size: var(--font-size-body-md);

/* ❌ Éviter */
padding: 16px;
font-size: 14px;
```

### 2. **Mobile-First Approach**

```css
/* ✅ Bon - Mobile d'abord */
.element {
    width: 100%;
    padding: var(--spacing-sm);
}

@media (min-width: 768px) {
    .element {
        width: 50%;
        padding: var(--spacing-lg);
    }
}
```

### 3. **Touch Targets**

```css
/* Minimum 44x44px pour les éléments interactifs */
.btn {
    min-height: 44px;
    min-width: 44px;
    padding: var(--spacing-sm) var(--spacing-md);
}
```

### 4. **Images Responsives**

```css
img {
    max-width: 100%;
    height: auto;
    display: block;
}
```

### 5. **Scroll Horizontal pour Tables**

```css
.table-wrapper {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
}

.table {
    min-width: 600px; /* Largeur minimale */
}
```

## ♿ Accessibilité

### 1. **Reduced Motion**

```css
@media (prefers-reduced-motion: reduce) {
    * {
        animation-duration: 0.01ms !important;
        transition-duration: 0.01ms !important;
    }
}
```

### 2. **High Contrast**

```css
@media (prefers-contrast: high) {
    .element {
        border-width: 2px;
    }
}
```

### 3. **Print Styles**

```css
@media print {
    .no-print {
        display: none !important;
    }
}
```

## 📐 Spacing System

| Token | Mobile | Tablet | Desktop |
|-------|--------|--------|---------|
| `--spacing-xs` | 4px | 4px | 4px |
| `--spacing-sm` | 8px | 8px | 8px |
| `--spacing-md` | 12px | 16px | 16px |
| `--spacing-lg` | 16px | 20px | 24px |
| `--spacing-xl` | 20px | 24px | 32px |
| `--spacing-2xl` | 24px | 32px | 40px |
| `--spacing-3xl` | 32px | 40px | 48px |

## 🎯 Checklist de Test Responsive

### Desktop (1920px, 1440px, 1366px)
- [ ] Layout complet visible
- [ ] Grilles optimales (3-4 colonnes)
- [ ] Navigation horizontale fonctionnelle
- [ ] Hover states actifs

### Tablet (1024px, 768px)
- [ ] Layout ajusté (2 colonnes)
- [ ] Menu hamburger fonctionnel
- [ ] Touch targets adéquats (44px min)
- [ ] Modals responsive

### Mobile (414px, 375px, 360px, 320px)
- [ ] Single column layout
- [ ] Navigation mobile optimisée
- [ ] Textes lisibles (min 16px)
- [ ] Forms utilisables
- [ ] Boutons accessibles
- [ ] Scroll fluide

### Landscape Mode
- [ ] Modals scrollables
- [ ] Navigation accessible
- [ ] Content visible

## 🔄 Tests Recommandés

1. **Chrome DevTools** : Tester tous les devices simulés
2. **Firefox Responsive Mode** : Vérifier les breakpoints
3. **Safari iOS** : Tester sur iPhone réel
4. **Android Chrome** : Tester sur Android réel
5. **Rotation d'écran** : Portrait et Landscape

## 📱 Appareils Cibles

### iOS
- iPhone SE (375px)
- iPhone 12/13/14 (390px)
- iPhone 14 Pro Max (430px)
- iPad (768px)
- iPad Pro (1024px)

### Android
- Small phones (360px)
- Medium phones (375px)
- Large phones (414px)
- Tablets (768px+)

## 🚀 Performance Mobile

### Optimisations Appliquées

1. **Touch-friendly** : Tous les boutons/liens ≥ 44px
2. **Smooth scrolling** : `-webkit-overflow-scrolling: touch`
3. **No horizontal scroll** : `overflow-x: hidden` sur body
4. **Reduced animations** : Support de `prefers-reduced-motion`
5. **Optimized images** : `max-width: 100%` + `height: auto`

## 📚 Ressources

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Material Design Breakpoints](https://material.io/design/layout/responsive-layout-grid.html)
- [iOS Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/)
- [Android Material Design](https://material.io/design)

---

**Dernière mise à jour** : 3 octobre 2025  
**Version** : 2.0  
**Statut** : ✅ Responsive complet implémenté
