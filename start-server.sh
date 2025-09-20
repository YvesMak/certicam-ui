#!/bin/bash
# Script pour démarrer un serveur local et éviter les erreurs CORS

echo "🚀 Démarrage du serveur local pour Certicam..."

# Vérifier si Python 3 est disponible
if command -v python3 &> /dev/null
then
    echo "📡 Utilisation de Python 3..."
    cd "$(dirname "$0")"
    echo "📂 Dossier: $(pwd)"
    echo "🌐 Ouvrir http://localhost:8000/index.html dans votre navigateur"
    python3 -m http.server 8000
elif command -v python &> /dev/null
then
    echo "📡 Utilisation de Python 2..."
    cd "$(dirname "$0")"
    echo "📂 Dossier: $(pwd)"
    echo "🌐 Ouvrir http://localhost:8000/index.html dans votre navigateur"
    python -m SimpleHTTPServer 8000
else
    echo "❌ Python non trouvé. Installez Python pour utiliser ce serveur."
    echo "💡 Alternative: utilisez Live Server dans VS Code ou un autre serveur local."
fi
