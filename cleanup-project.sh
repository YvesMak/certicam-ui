#!/bin/bash

# Script de nettoyage sécurisé pour le projet Certicam
# Supprime les fichiers obsolètes avec sauvegarde automatique

set -e  # Arrêter en cas d'erreur

echo "🧹 === NETTOYAGE SÉCURISÉ DU PROJET CERTICAM ==="
echo "$(date)"
echo ""

# Configuration
BACKUP_DIR="./backup_$(date +%Y%m%d_%H%M%S)"
CLEANUP_LOG="./cleanup.log"

# Couleurs pour l'affichage
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Fonction de log
log() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') - $1" | tee -a "$CLEANUP_LOG"
}

# Fonction de sauvegarde
backup_file() {
    local file="$1"
    if [ -f "$file" ]; then
        mkdir -p "$BACKUP_DIR/$(dirname "$file")"
        cp "$file" "$BACKUP_DIR/$file"
        log "💾 Sauvegardé: $file"
    fi
}

# Fonction de suppression sécurisée
safe_remove() {
    local file="$1"
    local reason="$2"
    
    if [ -f "$file" ]; then
        backup_file "$file"
        rm "$file"
        echo -e "${GREEN}✅ Supprimé: $file${NC} ($reason)"
        log "🗑️  Supprimé: $file - $reason"
    else
        echo -e "${YELLOW}⚠️  Fichier déjà absent: $file${NC}"
        log "⚠️  Fichier déjà absent: $file"
    fi
}

# Créer le répertoire de sauvegarde
echo -e "${YELLOW}📦 Création du répertoire de sauvegarde: $BACKUP_DIR${NC}"
mkdir -p "$BACKUP_DIR"
log "📦 Répertoire de sauvegarde créé: $BACKUP_DIR"

echo ""
echo "🔍 === PHASE 1: SUPPRESSION DES FICHIERS OBSOLÈTES ==="

# Anciennes versions
echo "🏷️  Suppression des anciennes versions..."
safe_remove "admin-old.html" "Ancienne version d'admin"
safe_remove "css/admin-old.css" "Styles ancienne admin"
safe_remove "js/admin-old.js" "Scripts ancienne admin"

# Versions alternatives/tests
echo "🏷️  Suppression des versions alternatives..."
safe_remove "login_clean.html" "Version alternative login"
safe_remove "css/login-clean.css" "Styles login alternatifs"
safe_remove "css/register-clean.css" "Styles register alternatifs"
safe_remove "navbar-inline-styles.html" "Version test navbar inline"

# Fichiers de test temporaires
echo "🏷️  Suppression des fichiers de test..."
safe_remove "test-reset.js" "Script de test temporaire"
safe_remove "diagnostic-index.html" "Page diagnostic obsolète"

# Scripts redondants/obsolètes
echo "🏷️  Suppression des scripts obsolètes..."
safe_remove "js/transactions-backup.js" "Sauvegarde obsolète"
safe_remove "js/anti-conflict-fix.js" "Fix temporaire obsolète"
safe_remove "js/certicam-session-light.js" "Version allégée redondante"
safe_remove "js/modal-direct.js" "Système modal obsolète"
safe_remove "components/navbar-loader-new.js" "Version devenue principale"
safe_remove "components/navbar-simple.html" "Version simplifiée obsolète"

# CSS redondants
echo "🏷️  Suppression des CSS redondants..."
safe_remove "css/modals.css" "Fichier CSS vide"
safe_remove "css/index-fixes.css" "Fixes temporaires intégrés"
safe_remove "css/navbar-modern.css" "Redondant avec style.css"

# Documentation obsolète
echo "🏷️  Suppression de la documentation obsolète..."
safe_remove "CLEANUP_REPORT.md" "Fichier vide"
safe_remove "VERIFICATION_REPORT.md" "Fichier vide"
safe_remove "verify-project.sh" "Script vide"

echo ""
echo "🔍 === PHASE 2: VÉRIFICATION DES RÉFÉRENCES ==="

# Vérifier que les fichiers importants existent encore
critical_files=(
    "index.html"
    "auth.html"
    "admin.html"
    "checker-dashboard.html"
    "css/style.css"
    "css/tokens.css"
    "js/session-manager.js"
    "components/navbar-loader.js"
)

echo "🔬 Vérification des fichiers critiques..."
all_good=true

for file in "${critical_files[@]}"; do
    if [ -f "$file" ]; then
        echo -e "${GREEN}✅ $file${NC}"
    else
        echo -e "${RED}❌ MANQUANT: $file${NC}"
        all_good=false
    fi
done

if [ "$all_good" = false ]; then
    echo -e "${RED}🚨 ERREUR: Certains fichiers critiques sont manquants!${NC}"
    echo "🔙 Restauration à partir de la sauvegarde..."
    cp -r "$BACKUP_DIR"/* ./
    echo "✅ Restauration terminée"
    exit 1
fi

echo ""
echo -e "${GREEN}🎉 === NETTOYAGE TERMINÉ AVEC SUCCÈS ===${NC}"
echo "📊 Statistiques:"
echo "   - Sauvegarde: $BACKUP_DIR"
echo "   - Log: $CLEANUP_LOG"
echo ""
echo "🔄 Pour annuler le nettoyage:"
echo "   cp -r $BACKUP_DIR/* ./"
echo ""
echo "🗑️  Pour supprimer la sauvegarde (une fois sûr):"
echo "   rm -rf $BACKUP_DIR"

log "✅ Nettoyage terminé avec succès"