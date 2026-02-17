#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 Diagnostic du Club Blockchain Epitech Website');
console.log('================================================\n');

// Vérifier la structure des fichiers
const checks = [
  {
    name: 'Fichier tailwind.config.js',
    path: 'frontend/tailwind.config.js',
    required: true
  },
  {
    name: 'Fichier index.css avec TailwindCSS',
    path: 'frontend/src/index.css',
    required: true,
    checkContent: '@import "tailwindcss"'
  },
  {
    name: 'Fichier vite.config.js',
    path: 'frontend/vite.config.js',
    required: true,
    checkContent: 'tailwindcss'
  },
  {
    name: 'Fichier package.json frontend',
    path: 'frontend/package.json',
    required: true,
    checkContent: '@tailwindcss/vite'
  },
  {
    name: 'Fichier main.jsx',
    path: 'frontend/src/main.jsx',
    required: true,
    checkContent: "import './index.css'"
  },
  {
    name: 'Dossier node_modules frontend',
    path: 'frontend/node_modules',
    required: false
  },
  {
    name: 'Fichier .env frontend',
    path: 'frontend/.env',
    required: false
  },
  {
    name: 'Fichier .env backend',
    path: 'backend/.env',
    required: false
  }
];

let allGood = true;

checks.forEach(check => {
  const fullPath = path.join(process.cwd(), check.path);
  const exists = fs.existsSync(fullPath);
  
  if (check.required && !exists) {
    console.log(`❌ ${check.name}: MANQUANT`);
    allGood = false;
  } else if (exists) {
    console.log(`✅ ${check.name}: OK`);
    
    // Vérifier le contenu si spécifié
    if (check.checkContent) {
      try {
        const content = fs.readFileSync(fullPath, 'utf8');
        if (content.includes(check.checkContent)) {
          console.log(`   ✅ Contenu correct: "${check.checkContent}"`);
        } else {
          console.log(`   ❌ Contenu manquant: "${check.checkContent}"`);
          allGood = false;
        }
      } catch (error) {
        console.log(`   ⚠️  Erreur de lecture: ${error.message}`);
      }
    }
  } else {
    console.log(`⚠️  ${check.name}: OPTIONNEL`);
  }
});

console.log('\n📋 Résumé:');
if (allGood) {
  console.log('✅ Tous les fichiers requis sont présents et corrects !');
  console.log('\n🚀 Pour démarrer le projet:');
  console.log('1. cd frontend && npm install');
  console.log('2. cd ../backend && npm install');
  console.log('3. npm run dev');
} else {
  console.log('❌ Des problèmes ont été détectés. Consultez le guide de dépannage.');
  console.log('\n📚 Documentation:');
  console.log('- docs/TROUBLESHOOTING.md');
  console.log('- README.md');
}

// Vérifier les versions
console.log('\n🔧 Versions:');
try {
  const nodeVersion = process.version;
  console.log(`Node.js: ${nodeVersion}`);
  
  // Vérifier npm
  const { execSync } = require('child_process');
  try {
    const npmVersion = execSync('npm --version', { encoding: 'utf8' }).trim();
    console.log(`npm: ${npmVersion}`);
  } catch (error) {
    console.log('npm: NON INSTALLÉ');
  }
} catch (error) {
  console.log('Erreur lors de la vérification des versions');
}

console.log('\n💡 Conseils:');
console.log('- Si TailwindCSS ne fonctionne pas, ouvrez frontend/test-tailwind.html dans votre navigateur');
console.log('- Vérifiez la console du navigateur (F12) pour les erreurs');
console.log('- Assurez-vous que Node.js 18+ est installé');
console.log('- Redémarrez le serveur de développement après les modifications');
