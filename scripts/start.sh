#!/bin/bash

# Script de démarrage pour le Club Blockchain Epitech Website
# Ce script démarre le serveur de développement

echo "🚀 Démarrage du Club Blockchain Epitech Website"
echo "==============================================="

# Vérifier si les dépendances sont installées
if [ ! -d "backend/node_modules" ]; then
    echo "❌ Dépendances du backend non installées. Exécutez d'abord: npm run install"
    exit 1
fi

if [ ! -d "frontend/node_modules" ]; then
    echo "❌ Dépendances du frontend non installées. Exécutez d'abord: npm run install"
    exit 1
fi

# Vérifier si les fichiers .env existent
if [ ! -f "backend/.env" ]; then
    echo "❌ Fichier backend/.env non trouvé. Copiez backend/.env.example vers backend/.env et configurez-le."
    exit 1
fi

if [ ! -f "frontend/.env" ]; then
    echo "❌ Fichier frontend/.env non trouvé. Copiez frontend/.env.example vers frontend/.env et configurez-le."
    exit 1
fi

echo "✅ Vérifications préliminaires terminées"

# Fonction pour nettoyer les processus en arrière-plan
cleanup() {
    echo ""
    echo "🛑 Arrêt des serveurs..."
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    exit 0
}

# Capturer les signaux d'arrêt
trap cleanup SIGINT SIGTERM

echo "🔧 Démarrage du serveur backend..."
cd backend
npm run dev &
BACKEND_PID=$!

echo "⏳ Attente du démarrage du backend..."
sleep 3

echo "🎨 Démarrage du serveur frontend..."
cd ../frontend
npm run dev &
FRONTEND_PID=$!

echo ""
echo "🎉 Serveurs démarrés avec succès !"
echo ""
echo "📱 Frontend: http://localhost:5173"
echo "🔧 Backend API: http://localhost:5000"
echo "📊 API Health: http://localhost:5000/health"
echo ""
echo "Appuyez sur Ctrl+C pour arrêter les serveurs"
echo ""

# Attendre que les processus se terminent
wait
