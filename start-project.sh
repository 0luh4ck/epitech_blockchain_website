#!/bin/bash

# Script de démarrage du projet Club Blockchain Epitech
# Usage: ./start-project.sh

echo "🚀 Démarrage du Club Blockchain Epitech Website"
echo "=============================================="

# Vérifier si Node.js est installé
if ! command -v node &> /dev/null; then
    echo "❌ Node.js n'est pas installé. Veuillez installer Node.js 18+ depuis https://nodejs.org"
    exit 1
fi

# Vérifier la version de Node.js
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ requis. Version actuelle: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) détecté"

# Vérifier si npm est installé
if ! command -v npm &> /dev/null; then
    echo "❌ npm n'est pas installé"
    exit 1
fi

echo "✅ npm $(npm -v) détecté"

# Vérifier les fichiers de configuration
if [ ! -f "frontend/.env" ]; then
    echo "⚠️  Fichier frontend/.env manquant"
    if [ -f "frontend/env.example" ]; then
        echo "📋 Copie de env.example vers .env"
        cp frontend/env.example frontend/.env
        echo "✅ Fichier frontend/.env créé. Veuillez le configurer."
    else
        echo "❌ Fichier frontend/env.example manquant"
        exit 1
    fi
fi

if [ ! -f "backend/.env" ]; then
    echo "⚠️  Fichier backend/.env manquant"
    if [ -f "backend/env.example" ]; then
        echo "📋 Copie de env.example vers .env"
        cp backend/env.example backend/.env
        echo "✅ Fichier backend/.env créé. Veuillez le configurer."
    else
        echo "❌ Fichier backend/env.example manquant"
        exit 1
    fi
fi

# Installer les dépendances si nécessaire
if [ ! -d "frontend/node_modules" ]; then
    echo "📦 Installation des dépendances frontend..."
    cd frontend && npm install
    cd ..
fi

if [ ! -d "backend/node_modules" ]; then
    echo "📦 Installation des dépendances backend..."
    cd backend && npm install
    cd ..
fi

# Vérifier la base de données
echo "🗄️  Vérification de la base de données..."
cd backend
if npm run migrate 2>/dev/null; then
    echo "✅ Base de données configurée"
else
    echo "⚠️  Erreur lors de la configuration de la base de données"
    echo "📋 Veuillez vérifier votre configuration dans backend/.env"
fi
cd ..

# Démarrer les serveurs
echo "🚀 Démarrage des serveurs..."

# Démarrer le backend en arrière-plan
echo "🔧 Démarrage du backend (port 5000)..."
cd backend && npm run dev &
BACKEND_PID=$!
cd ..

# Attendre que le backend démarre
sleep 3

# Démarrer le frontend
echo "🎨 Démarrage du frontend (port 5173)..."
cd frontend && npm run dev &
FRONTEND_PID=$!
cd ..

echo ""
echo "🎉 Serveurs démarrés avec succès !"
echo "=================================="
echo "🌐 Frontend: http://localhost:5173"
echo "🔌 Backend API: http://localhost:5000"
echo "📊 API Health: http://localhost:5000/health"
echo ""
echo "📋 Pour arrêter les serveurs, appuyez sur Ctrl+C"
echo ""

# Fonction de nettoyage
cleanup() {
    echo ""
    echo "🛑 Arrêt des serveurs..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    echo "✅ Serveurs arrêtés"
    exit 0
}

# Capturer Ctrl+C
trap cleanup SIGINT

# Attendre que les processus se terminent
wait
