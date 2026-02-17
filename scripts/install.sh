#!/bin/bash

# Script d'installation pour le Club Blockchain Epitech Website
# Ce script installe toutes les dépendances nécessaires

echo "🚀 Installation du Club Blockchain Epitech Website"
echo "=================================================="

# Vérifier si Node.js est installé
if ! command -v node &> /dev/null; then
    echo "❌ Node.js n'est pas installé. Veuillez installer Node.js 18+ avant de continuer."
    exit 1
fi

# Vérifier la version de Node.js
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ requis. Version actuelle: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) détecté"

# Installer les dépendances du backend
echo "📦 Installation des dépendances du backend..."
cd backend
if [ ! -f package.json ]; then
    echo "❌ Fichier package.json non trouvé dans le dossier backend"
    exit 1
fi

npm install
if [ $? -ne 0 ]; then
    echo "❌ Erreur lors de l'installation des dépendances du backend"
    exit 1
fi

echo "✅ Dépendances du backend installées"

# Installer les dépendances du frontend
echo "📦 Installation des dépendances du frontend..."
cd ../frontend
if [ ! -f package.json ]; then
    echo "❌ Fichier package.json non trouvé dans le dossier frontend"
    exit 1
fi

npm install
if [ $? -ne 0 ]; then
    echo "❌ Erreur lors de l'installation des dépendances du frontend"
    exit 1
fi

echo "✅ Dépendances du frontend installées"

# Créer les fichiers .env s'ils n'existent pas
echo "⚙️  Configuration des fichiers d'environnement..."

cd ../backend
if [ ! -f .env ]; then
    if [ -f .env.example ]; then
        cp .env.example .env
        echo "✅ Fichier .env créé à partir de .env.example"
        echo "⚠️  N'oubliez pas de configurer vos variables d'environnement dans backend/.env"
    else
        echo "⚠️  Fichier .env.example non trouvé dans le backend"
    fi
else
    echo "✅ Fichier .env du backend existe déjà"
fi

cd ../frontend
if [ ! -f .env ]; then
    if [ -f .env.example ]; then
        cp .env.example .env
        echo "✅ Fichier .env créé à partir de .env.example"
        echo "⚠️  N'oubliez pas de configurer vos variables d'environnement dans frontend/.env"
    else
        echo "⚠️  Fichier .env.example non trouvé dans le frontend"
    fi
else
    echo "✅ Fichier .env du frontend existe déjà"
fi

cd ..

echo ""
echo "🎉 Installation terminée avec succès !"
echo ""
echo "📋 Prochaines étapes :"
echo "1. Configurez vos variables d'environnement dans backend/.env et frontend/.env"
echo "2. Configurez votre base de données PostgreSQL"
echo "3. Exécutez le script de migration de la base de données :"
echo "   cd backend && npm run migrate"
echo "4. Démarrez le serveur de développement :"
echo "   npm run dev"
echo ""
echo "📚 Documentation complète disponible dans README.md"
echo "🌐 Site web du Club Blockchain Epitech Bénin"
