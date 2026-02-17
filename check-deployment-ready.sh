#!/bin/bash

# Script de vérification avant déploiement
# Club Blockchain Epitech Bénin

echo -e "\033[1;36m🔍 Vérification de la préparation au déploiement...\033[0m"
echo ""

errors=0
warnings=0

# Vérifier Git
echo -e "\033[1;33m📦 Vérification Git...\033[0m"
if [ -d ".git" ]; then
    echo -e "  \033[0;32m✅ Repository Git trouvé\033[0m"
    
    # Vérifier les changements non commités
    if [ -n "$(git status --porcelain)" ]; then
        echo -e "  \033[0;33m⚠️  Changements non commités détectés\033[0m"
        ((warnings++))
    else
        echo -e "  \033[0;32m✅ Tous les changements sont commités\033[0m"
    fi
else
    echo -e "  \033[0;31m❌ Repository Git non trouvé\033[0m"
    ((errors++))
fi

echo ""

# Vérifier les fichiers de configuration
echo -e "\033[1;33m⚙️  Vérification des fichiers de configuration...\033[0m"

config_files=(
    "render.yaml"
    "vercel.json"
    "backend/.env.example"
    "frontend/.env.example"
    "backend/scripts/planetscale-schema.sql"
)

for file in "${config_files[@]}"; do
    if [ -f "$file" ]; then
        echo -e "  \033[0;32m✅ $file\033[0m"
    else
        echo -e "  \033[0;31m❌ $file manquant\033[0m"
        ((errors++))
    fi
done

echo ""

# Vérifier les dépendances Backend
echo -e "\033[1;33m📦 Vérification Backend...\033[0m"
if [ -f "backend/package.json" ]; then
    echo -e "  \033[0;32m✅ package.json trouvé\033[0m"
    
    if [ -d "backend/node_modules" ]; then
        echo -e "  \033[0;32m✅ node_modules installé\033[0m"
    else
        echo -e "  \033[0;33m⚠️  node_modules non installé (exécuter: cd backend && npm install)\033[0m"
        ((warnings++))
    fi
else
    echo -e "  \033[0;31m❌ package.json non trouvé\033[0m"
    ((errors++))
fi

echo ""

# Vérifier les dépendances Frontend
echo -e "\033[1;33m🎨 Vérification Frontend...\033[0m"
if [ -f "frontend/package.json" ]; then
    echo -e "  \033[0;32m✅ package.json trouvé\033[0m"
    
    if [ -d "frontend/node_modules" ]; then
        echo -e "  \033[0;32m✅ node_modules installé\033[0m"
    else
        echo -e "  \033[0;33m⚠️  node_modules non installé (exécuter: cd frontend && npm install)\033[0m"
        ((warnings++))
    fi
else
    echo -e "  \033[0;31m❌ package.json non trouvé\033[0m"
    ((errors++))
fi

echo ""

# Vérifier les fichiers .env
echo -e "\033[1;33m🔐 Vérification des variables d'environnement...\033[0m"

if [ -f "backend/.env" ]; then
    echo -e "  \033[0;32m✅ backend/.env existe\033[0m"
else
    echo -e "  \033[0;33m⚠️  backend/.env non trouvé (copier depuis .env.example)\033[0m"
    ((warnings++))
fi

if [ -f "frontend/.env" ]; then
    echo -e "  \033[0;32m✅ frontend/.env existe\033[0m"
else
    echo -e "  \033[0;33m⚠️  frontend/.env non trouvé (copier depuis .env.example)\033[0m"
    ((warnings++))
fi

echo ""

# Vérifier .gitignore
echo -e "\033[1;33m🚫 Vérification .gitignore...\033[0m"
if [ -f ".gitignore" ]; then
    if grep -q "\.env" ".gitignore"; then
        echo -e "  \033[0;32m✅ .env dans .gitignore\033[0m"
    else
        echo -e "  \033[0;31m❌ .env non ignoré par Git (SÉCURITÉ!)\033[0m"
        ((errors++))
    fi
    
    if grep -q "node_modules" ".gitignore"; then
        echo -e "  \033[0;32m✅ node_modules dans .gitignore\033[0m"
    else
        echo -e "  \033[0;33m⚠️  node_modules non ignoré par Git\033[0m"
        ((warnings++))
    fi
else
    echo -e "  \033[0;31m❌ .gitignore non trouvé\033[0m"
    ((errors++))
fi

echo ""

# Vérifier la documentation
echo -e "\033[1;33m📚 Vérification de la documentation...\033[0m"

doc_files=(
    "DEPLOYMENT-GUIDE.md"
    "QUICK-DEPLOY.md"
    "DEPLOYMENT-CHECKLIST.md"
    "DEPLOYMENT-SUMMARY.md"
)

for file in "${doc_files[@]}"; do
    if [ -f "$file" ]; then
        echo -e "  \033[0;32m✅ $file\033[0m"
    else
        echo -e "  \033[0;33m⚠️  $file manquant\033[0m"
        ((warnings++))
    fi
done

echo ""
echo -e "\033[1;36m═══════════════════════════════════════════════════════\033[0m"
echo ""

# Résumé
if [ $errors -eq 0 ] && [ $warnings -eq 0 ]; then
    echo -e "\033[1;32m🎉 Parfait ! Votre projet est prêt pour le déploiement !\033[0m"
    echo ""
    echo -e "\033[1;36m📋 Prochaines étapes:\033[0m"
    echo -e "  1. Lire QUICK-DEPLOY.md pour un guide rapide (15 min)"
    echo -e "  2. Créer une base de données sur PlanetScale"
    echo -e "  3. Déployer le backend sur Render.com"
    echo -e "  4. Déployer le frontend sur Vercel"
    echo -e "  5. Tester et finaliser"
elif [ $errors -eq 0 ]; then
    echo -e "\033[1;33m⚠️  Prêt avec quelques avertissements ($warnings)\033[0m"
    echo -e "\033[0;33mVous pouvez continuer, mais vérifiez les points ci-dessus.\033[0m"
else
    echo -e "\033[1;31m❌ Erreurs détectées ($errors erreurs, $warnings avertissements)\033[0m"
    echo -e "\033[0;31mVeuillez corriger les erreurs avant de déployer.\033[0m"
fi

echo ""
echo -e "\033[1;36m═══════════════════════════════════════════════════════\033[0m"
echo ""

# Afficher les commandes utiles
echo -e "\033[1;36m💡 Commandes utiles:\033[0m"
echo -e "  • Installer les dépendances backend:  cd backend && npm install"
echo -e "  • Installer les dépendances frontend: cd frontend && npm install"
echo -e "  • Démarrer le backend:                cd backend && npm run dev"
echo -e "  • Démarrer le frontend:               cd frontend && npm run dev"
echo -e "  • Commiter les changements:           git add . && git commit -m 'message' && git push"
echo ""

# Retourner le code d'erreur
if [ $errors -gt 0 ]; then
    exit 1
else
    exit 0
fi
