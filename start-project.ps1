# Script de démarrage du projet Club Blockchain Epitech (PowerShell)
# Usage: .\start-project.ps1

Write-Host "🚀 Démarrage du Club Blockchain Epitech Website" -ForegroundColor Green
Write-Host "==============================================" -ForegroundColor Green

# Vérifier si Node.js est installé
try {
    $nodeVersion = node -v
    Write-Host "✅ Node.js $nodeVersion détecté" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js n'est pas installé. Veuillez installer Node.js 18+ depuis https://nodejs.org" -ForegroundColor Red
    exit 1
}

# Vérifier si npm est installé
try {
    $npmVersion = npm -v
    Write-Host "✅ npm $npmVersion détecté" -ForegroundColor Green
} catch {
    Write-Host "❌ npm n'est pas installé" -ForegroundColor Red
    exit 1
}

# Vérifier les fichiers de configuration
if (-not (Test-Path "frontend\.env")) {
    Write-Host "⚠️  Fichier frontend\.env manquant" -ForegroundColor Yellow
    if (Test-Path "frontend\env.example") {
        Write-Host "📋 Copie de env.example vers .env" -ForegroundColor Blue
        Copy-Item "frontend\env.example" "frontend\.env"
        Write-Host "✅ Fichier frontend\.env créé. Veuillez le configurer." -ForegroundColor Green
    } else {
        Write-Host "❌ Fichier frontend\env.example manquant" -ForegroundColor Red
        exit 1
    }
}

if (-not (Test-Path "backend\.env")) {
    Write-Host "⚠️  Fichier backend\.env manquant" -ForegroundColor Yellow
    if (Test-Path "backend\env.example") {
        Write-Host "📋 Copie de env.example vers .env" -ForegroundColor Blue
        Copy-Item "backend\env.example" "backend\.env"
        Write-Host "✅ Fichier backend\.env créé. Veuillez le configurer." -ForegroundColor Green
    } else {
        Write-Host "❌ Fichier backend\env.example manquant" -ForegroundColor Red
        exit 1
    }
}

# Installer les dépendances si nécessaire
if (-not (Test-Path "frontend\node_modules")) {
    Write-Host "📦 Installation des dépendances frontend..." -ForegroundColor Blue
    Set-Location frontend
    npm install
    Set-Location ..
}

if (-not (Test-Path "backend\node_modules")) {
    Write-Host "📦 Installation des dépendances backend..." -ForegroundColor Blue
    Set-Location backend
    npm install
    Set-Location ..
}

# Vérifier la base de données
Write-Host "🗄️  Vérification de la base de données..." -ForegroundColor Blue
Set-Location backend
try {
    npm run migrate
    Write-Host "✅ Base de données configurée" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Erreur lors de la configuration de la base de données" -ForegroundColor Yellow
    Write-Host "📋 Veuillez vérifier votre configuration dans backend\.env" -ForegroundColor Blue
}
Set-Location ..

# Démarrer les serveurs
Write-Host "🚀 Démarrage des serveurs..." -ForegroundColor Green

# Démarrer le backend en arrière-plan
Write-Host "🔧 Démarrage du backend (port 5000)..." -ForegroundColor Blue
Set-Location backend
Start-Process -NoNewWindow -FilePath "npm" -ArgumentList "run", "dev"
Set-Location ..

# Attendre que le backend démarre
Start-Sleep -Seconds 3

# Démarrer le frontend
Write-Host "🎨 Démarrage du frontend (port 5173)..." -ForegroundColor Blue
Set-Location frontend
Start-Process -NoNewWindow -FilePath "npm" -ArgumentList "run", "dev"
Set-Location ..

Write-Host ""
Write-Host "🎉 Serveurs démarrés avec succès !" -ForegroundColor Green
Write-Host "==================================" -ForegroundColor Green
Write-Host "🌐 Frontend: http://localhost:5173" -ForegroundColor Cyan
Write-Host "🔌 Backend API: http://localhost:5000" -ForegroundColor Cyan
Write-Host "📊 API Health: http://localhost:5000/health" -ForegroundColor Cyan
Write-Host ""
Write-Host "📋 Pour arrêter les serveurs, fermez cette fenêtre ou appuyez sur Ctrl+C" -ForegroundColor Yellow
Write-Host ""

# Attendre une entrée utilisateur
Write-Host "Appuyez sur une touche pour arrêter les serveurs..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

Write-Host ""
Write-Host "🛑 Arrêt des serveurs..." -ForegroundColor Red

# Arrêter les processus npm
Get-Process -Name "node" -ErrorAction SilentlyContinue | Where-Object { $_.CommandLine -like "*npm*" } | Stop-Process -Force

Write-Host "✅ Serveurs arrêtés" -ForegroundColor Green
