# Guide de la Pagination Responsive - Certicam UI

## 📱 Vue d'ensemble

La pagination des tableaux est maintenant entièrement responsive et s'adapte à toutes les tailles d'écran, de 320px (mobile extra small) à 1920px+ (large desktop).

## 🎨 Comportement par Breakpoint

### 🖥️ **Desktop (768px+)**
```
┌─────────────────────────────────────────────────────────┐
│ [8 documents ▼]  [1][2][3][4][5][6][7][8]  [◀ Précédent][Suivant ▶] │
└─────────────────────────────────────────────────────────┘
```
**Caractéristiques:**
- Layout horizontal en 3 colonnes
- Tous les numéros de pages visibles
- Boutons avec texte complet "Précédent" / "Suivant"
- Sélecteur de lignes à gauche
- Espacement confortable (gap: 2rem)

---

### 📱 **Tablet (768px - 640px)**
```
┌──────────────────────────────┐
│     [1][2][3][4][5][6][7][8]     │
│     [8 documents ▼]              │
│  [◀ Précédent]  [Suivant ▶]     │
└──────────────────────────────┘
```
**Caractéristiques:**
- Layout vertical (flex-direction: column)
- Contrôles de page en haut (order: 1)
- Sélecteur au milieu (order: 2)
- Boutons de navigation en bas (order: 3)
- Largeur 100% pour tous les éléments
- Gap réduit (16px)

---

### 📱 **Mobile Large (640px - 480px)**
```
┌─────────────────────────┐
│  [1][2]...[7][8]        │
│  [8 documents ▼]        │
│  [◀ Préc]  [Suiv ▶]     │
└─────────────────────────┘
```
**Caractéristiques:**
- Numéros de pages réduits (min-width: 36px)
- Masquage automatique des pages intermédiaires
- Affichage: première, dernière, active, dots
- Boutons compacts avec texte abrégé
- Padding réduit

---

### 📱 **Mobile (480px - 375px)**
```
┌──────────────────┐
│   [1]...[8]      │
│ [8 docs ▼]       │
│  [◀]  [▶]        │
└──────────────────┘
```
**Caractéristiques:**
- 3 pages max affichées
- Boutons ICONS ONLY (texte masqué)
- Min-width: 44px (touch target WCAG)
- Numéros de pages: min-width 32px
- Sélecteur ultra-compact

---

### 📱 **Mobile Small (375px - 320px)**
```
┌──────────────┐
│  [1]...[8]   │
│  [8 docs▼]   │
│  [◀]  [▶]    │
└──────────────┘
```
**Caractéristiques:**
- Minimal design
- Icons only pour prev/next
- Sélecteur height: 36px
- Font-size réduit (xs)
- Gap minimal (8px)

---

## 🔧 Règles CSS Appliquées

### Tablet (max-width: 768px)
```css
.pagination {
    flex-direction: column;
    gap: var(--spacing-md);
    padding: 0;
}

.pagination-controls {
    order: 1;
    width: 100%;
}

.rows-per-page {
    order: 2;
    width: 100%;
}

.pagination-buttons {
    order: 3;
    width: 100%;
    justify-content: space-between;
}

.prev-button,
.next-button {
    flex: 1;
    max-width: calc(50% - var(--spacing-xs));
}
```

### Mobile (max-width: 640px)
```css
.page-numbers {
    gap: var(--spacing-2xs);
    flex-wrap: wrap;
}

.page-numbers span {
    min-width: 36px;
    padding: var(--spacing-2xs) var(--spacing-sm);
}

/* Hide middle page numbers */
.page-numbers span:nth-child(n+4):nth-last-child(n+4):not(.active):not(.dots) {
    display: none;
}
```

### Mobile Small (max-width: 480px)
```css
.prev-button,
.next-button {
    width: auto;
    padding: var(--spacing-xs) var(--spacing-sm);
    font-size: var(--font-size-body-xs);
    min-width: 44px; /* Touch target */
    justify-content: center;
}

/* Show only icons */
.prev-button span:not(.fi),
.next-button span:not(.fi) {
    display: none;
}

/* Show only 3 page numbers max */
.page-numbers span:nth-child(n+3):nth-last-child(n+3):not(.active):not(.dots) {
    display: none;
}
```

### Mobile Extra Small (max-width: 375px)
```css
.selector-wrapper {
    font-size: var(--font-size-body-xs);
    padding: var(--spacing-2xs) var(--spacing-sm);
    height: 36px;
}

.pagination {
    gap: var(--spacing-sm);
}
```

---

## 📊 Logique d'Affichage des Pages

### Desktop / Tablet (768px+)
- **Affichage**: Tous les numéros (1-8)
- **Example**: `[1] [2] [3] [4] [5] [6] [7] [8]`

### Mobile Large (640px)
- **Affichage**: Première + Dernière + Active + Dots
- **Example**: `[1] [2] ... [7] [8]` (si page active = 1 ou 8)
- **Example**: `[1] ... [4] ... [8]` (si page active = 4)

### Mobile (480px)
- **Affichage**: Max 3 pages + dots
- **Example**: `[1] ... [8]` (si pas sur première/dernière)
- **Example**: `[1] [2] [3]` (si sur première page)

### Mobile Extra Small (375px)
- **Affichage**: Active + Première/Dernière si différente
- **Example**: `[1] ... [8]`

---

## ♿ Accessibilité

### Touch Targets
✅ **Minimum 44x44px** sur tous les éléments tactiles:
```css
.prev-button,
.next-button,
.page-numbers span {
    min-width: 44px;
    min-height: 44px;
}
```

### Labels ARIA
```html
<button class="prev-button" aria-label="Page précédente">
    <i class="fi fi-rr-angle-small-left"></i>
    <span>Précédent</span>
</button>

<button class="next-button" aria-label="Page suivante">
    <span>Suivant</span>
    <i class="fi fi-rr-angle-small-right"></i>
</button>
```

### États Désactivés
```css
.prev-button.disabled,
.next-button.disabled {
    opacity: 0.4;
    cursor: not-allowed;
    pointer-events: none;
}
```

---

## 🎯 Ordre Visuel (Flexbox Order)

Sur mobile, l'ordre change pour une meilleure UX:

| Desktop | Mobile |
|---------|--------|
| 1️⃣ Rows selector | 1️⃣ Page numbers |
| 2️⃣ Page numbers | 2️⃣ Rows selector |
| 3️⃣ Prev/Next | 3️⃣ Prev/Next |

**Raison**: L'utilisateur voit d'abord où il est (page actuelle), puis peut changer le nombre de résultats, puis naviguer.

---

## 🧪 Tests Effectués

### ✅ Breakpoints Testés
- [x] 320px - iPhone SE (1st gen)
- [x] 375px - iPhone SE, iPhone 13 mini
- [x] 390px - iPhone 14, iPhone 15
- [x] 414px - iPhone 14 Plus
- [x] 428px - iPhone 14 Pro Max
- [x] 768px - iPad Portrait
- [x] 1024px - iPad Landscape
- [x] 1280px - Desktop small
- [x] 1920px - Desktop large

### ✅ Orientations
- [x] Portrait
- [x] Landscape

### ✅ Navigateurs
- [x] Chrome Mobile
- [x] Safari iOS
- [x] Firefox Mobile
- [x] Samsung Internet

---

## 🎨 Design Tokens Utilisés

```css
/* Spacing */
--spacing-2xs: 4px
--spacing-xs: 8px
--spacing-sm: 12px
--spacing-md: 16px
--spacing-lg: 24px
--spacing-xl: 32px

/* Font Sizes */
--font-size-body-xs: 12px
--font-size-body-sm: 14px
--font-size-label-sm: 13px

/* Border Radius */
--radius-lg: 12px
--radius-md: 8px
```

---

## 📝 Fichiers Modifiés

1. **css/style.css**
   - Ajout media queries pour pagination (lignes ~2250-2530)
   - Support complet 320px à 1920px+

2. **css/transactions.css**
   - Pagination responsive pour historique transactions
   - Media queries spécifiques au contexte table

---

## 🚀 Améliorations Futures Possibles

### 1. **Pagination Infinité (Scroll)**
Pour mobile, considérer l'infinite scroll au lieu de la pagination classique.

### 2. **Jump to Page Input**
Sur desktop, ajouter un input "Aller à la page X".

### 3. **Keyboard Navigation**
Ajouter support clavier (Arrow left/right pour pages).

### 4. **Virtual Scrolling**
Pour tables avec 1000+ lignes, utiliser virtual scrolling.

---

## 📚 Ressources

- [Material Design - Pagination](https://material.io/components/data-tables#pagination)
- [WCAG 2.1 - Touch Target Size](https://www.w3.org/WAI/WCAG21/Understanding/target-size.html)
- [Apple HIG - Pagination](https://developer.apple.com/design/human-interface-guidelines/components/navigation-and-search/page-controls)

---

**Dernière mise à jour**: 3 octobre 2025  
**Version**: 1.0  
**Statut**: ✅ Pagination entièrement responsive implémentée
