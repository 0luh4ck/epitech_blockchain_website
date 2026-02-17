# Script de vérification avant déploiement
# Club Blockchain Epitech Bénin

Write-Host "🔍 Vérification de la préparation au déploiement..." -ForegroundColor Cyan
Write-Host ""

$errors = 0
$warnings = 0

# Vérifier Git
Write-Host "📦 Vérification Git..." -ForegroundColor Yellow
if (Test-Path ".git") {
    Write-Host "  ✅ Repository Git trouvé" -ForegroundColor Green
    
    # Vérifier les changements non commités
    $gitStatus = git status --porcelain
    if ($gitStatus) {
        Write-Host "  ⚠️  Changements non commités détectés" -ForegroundColor Yellow
        $warnings++
    } else {
        Write-Host "  ✅ Tous les changements sont commités" -ForegroundColor Green
    }
} else {
    Write-Host "  ❌ Repository Git non trouvé" -ForegroundColor Red
    $errors++
}

Write-Host ""

# Vérifier les fichiers de configuration
Write-Host "⚙️  Vérification des fichiers de configuration..." -ForegroundColor Yellow

$configFiles = @(
    "render.yaml",
    "vercel.json",
    "backend/.env.example",
    "frontend/.env.example",
    "backend/scripts/planetscale-schema.sql"
)

foreach ($file in $configFiles) {
    if (Test-Path $file) {
        Write-Host "  ✅ $file" -ForegroundColor Green
    } else {
        Write-Host "  ❌ $file manquant" -ForegroundColor Red
        $errors++
    }
}

Write-Host ""

# Vérifier les dépendances Backend
Write-Host "📦 Vérification Backend..." -ForegroundColor Yellow
if (Test-Path "backend/package.json") {
    Write-Host "  ✅ package.json trouvé" -ForegroundColor Green
    
    if (Test-Path "backend/node_modules") {
        Write-Host "  ✅ node_modules installé" -ForegroundColor Green
    } else {
        Write-Host "  ⚠️  node_modules non installé (exécuter: cd backend && npm install)" -ForegroundColor Yellow
        $warnings++
    }
} else {
    Write-Host "  ❌ package.json non trouvé" -ForegroundColor Red
    $errors++
}

Write-Host ""

# Vérifier les dépendances Frontend
Write-Host "🎨 Vérification Frontend..." -ForegroundColor Yellow
if (Test-Path "frontend/package.json") {
    Write-Host "  ✅ package.json trouvé" -ForegroundColor Green
    
    if (Test-Path "frontend/node_modules") {
        Write-Host "  ✅ node_modules installé" -ForegroundColor Green
    } else {
        Write-Host "  ⚠️  node_modules non installé (exécuter: cd frontend && npm install)" -ForegroundColor Yellow
        $warnings++
    }
} else {
    Write-Host "  ❌ package.json non trouvé" -ForegroundColor Red
    $errors++
}

Write-Host ""

# Vérifier les fichiers .env
Write-Host "🔐 Vérification des variables d'environnement..." -ForegroundColor Yellow

if (Test-Path "backend/.env") {
    Write-Host "  ✅ backend/.env existe" -ForegroundColor Green
} else {
    Write-Host "  ⚠️  backend/.env non trouvé (copier depuis .env.example)" -ForegroundColor Yellow
    $warnings++
}

if (Test-Path "frontend/.env") {
    Write-Host "  ✅ frontend/.env existe" -ForegroundColor Green
} else {
    Write-Host "  ⚠️  frontend/.env non trouvé (copier depuis .env.example)" -ForegroundColor Yellow
    $warnings++
}

Write-Host ""

# Vérifier .gitignore
Write-Host "🚫 Vérification .gitignore..." -ForegroundColor Yellow
if (Test-Path ".gitignore") {
    $gitignoreContent = Get-Content ".gitignore" -Raw
    
    if ($gitignoreContent -match "\.env") {
        Write-Host "  ✅ .env dans .gitignore" -ForegroundColor Green
    } else {
        Write-Host "  ❌ .env non ignoré par Git (SÉCURITÉ!)" -ForegroundColor Red
        $errors++
    }
    
    if ($gitignoreContent -match "node_modules") {
        Write-Host "  ✅ node_modules dans .gitignore" -ForegroundColor Green
    } else {
        Write-Host "  ⚠️  node_modules non ignoré par Git" -ForegroundColor Yellow
        $warnings++
    }
} else {
    Write-Host "  ❌ .gitignore non trouvé" -ForegroundColor Red
    $errors++
}

Write-Host ""

# Vérifier la documentation
Write-Host "📚 Vérification de la documentation..." -ForegroundColor Yellow

$docFiles = @(
    "DEPLOYMENT-GUIDE.md",
    "QUICK-DEPLOY.md",
    "DEPLOYMENT-CHECKLIST.md",
    "DEPLOYMENT-SUMMARY.md"
)

foreach ($file in $docFiles) {
    if (Test-Path $file) {
        Write-Host "  ✅ $file" -ForegroundColor Green
    } else {
        Write-Host "  ⚠️  $file manquant" -ForegroundColor Yellow
        $warnings++
    }
}

Write-Host ""
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

# Résumé
if ($errors -eq 0 -and $warnings -eq 0) {
    Write-Host "🎉 Parfait ! Votre projet est prêt pour le déploiement !" -ForegroundColor Green
    Write-Host ""
    Write-Host "📋 Prochaines étapes:" -ForegroundColor Cyan
    Write-Host "  1. Lire QUICK-DEPLOY.md pour un guide rapide (15 min)" -ForegroundColor White
    Write-Host "  2. Créer une base de données sur PlanetScale" -ForegroundColor White
    Write-Host "  3. Déployer le backend sur Render.com" -ForegroundColor White
    Write-Host "  4. Déployer le frontend sur Vercel" -ForegroundColor White
    Write-Host "  5. Tester et finaliser" -ForegroundColor White
} elseif ($errors -eq 0) {
    Write-Host "⚠️  Prêt avec quelques avertissements ($warnings)" -ForegroundColor Yellow
    Write-Host "Vous pouvez continuer, mais vérifiez les points ci-dessus." -ForegroundColor Yellow
} else {
    Write-Host "❌ Erreurs détectées ($errors erreurs, $warnings avertissements)" -ForegroundColor Red
    Write-Host "Veuillez corriger les erreurs avant de déployer." -ForegroundColor Red
}

Write-Host ""
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

# Afficher les commandes utiles
Write-Host "💡 Commandes utiles:" -ForegroundColor Cyan
Write-Host "  • Installer les dépendances backend:  cd backend && npm install" -ForegroundColor White
Write-Host "  • Installer les dépendances frontend: cd frontend && npm install" -ForegroundColor White
Write-Host "  • Démarrer le backend:                cd backend && npm run dev" -ForegroundColor White
Write-Host "  • Démarrer le frontend:               cd frontend && npm run dev" -ForegroundColor White
Write-Host "  • Commiter les changements:           git add . && git commit -m 'message' && git push" -ForegroundColor White
Write-Host ""

# Retourner le code d'erreur
if ($errors -gt 0) {
    exit 1
} else {
    exit 0
}
