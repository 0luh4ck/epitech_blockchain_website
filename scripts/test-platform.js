import http from 'http';

/**
 * Script de Test de Fonctionnement de la Plateforme
 * Ce script vérifie la santé du backend, de la base de données et des endpoints clés.
 */

const CONFIG = {
    baseUrl: process.argv[2] || 'http://localhost:5000',
    timeout: 5000
};

const colors = {
    reset: "\x1b[0m",
    bright: "\x1b[1m",
    green: "\x1b[32m",
    red: "\x1b[31m",
    yellow: "\x1b[33m",
    blue: "\x1b[34m",
    magenta: "\x1b[35m",
    cyan: "\x1b[36m"
};

async function testEndpoint(endpoint, descriptiveName) {
    const url = `${CONFIG.baseUrl}${endpoint}`;
    console.log(`${colors.blue}🔍 Test de ${descriptiveName}...${colors.reset}`);

    try {
        const startTime = Date.now();
        const response = await fetch(url);
        const duration = Date.now() - startTime;

        if (response.ok) {
            const data = await response.json();
            console.log(`✅ ${colors.green}${descriptiveName} : OK (${duration}ms)${colors.reset}`);
            return { success: true, data };
        } else {
            console.log(`❌ ${colors.red}${descriptiveName} : ÉCHEC (Status ${response.status})${colors.reset}`);
            return { success: false, status: response.status };
        }
    } catch (error) {
        console.log(`❌ ${colors.red}${descriptiveName} : ERREUR (${error.message})${colors.reset}`);
        return { success: false, error: error.message };
    }
}

async function runTests() {
    console.log(`\n${colors.bright}${colors.magenta}🚀 DÉMARRAGE DES TESTS DE LA PLATEFORME${colors.reset}`);
    console.log(`${colors.cyan}URL de base : ${CONFIG.baseUrl}${colors.reset}\n`);

    const results = [];

    // 1. Health Check & Database
    const health = await testEndpoint('/api/health', 'Santé de l\'API & Base de données');
    results.push({ name: 'Santé de l\'API', ...health });

    if (health.success) {
        console.log(`   └─ Environnement : ${health.data.environment || 'N/A'}`);
        console.log(`   └─ Base de données : ${health.data.status === 'OK' ? colors.green + 'Connectée' : colors.red + 'Déconnectée'}${colors.reset}`);
    }

    // 2. Endpoints Publics
    const activities = await testEndpoint('/api/activities', 'Endpoint Activités');
    results.push({ name: 'Activités', ...activities });

    const partners = await testEndpoint('/api/partners', 'Endpoint Partenaires');
    results.push({ name: 'Partenaires', ...partners });

    // 3. Info API
    const info = await testEndpoint('/api', 'Informations Générales API');
    results.push({ name: 'Info API', ...info });

    // Résumé
    console.log(`\n${colors.bright}📋 RÉSUMÉ DES TESTS${colors.reset}`);
    console.log("====================");

    const total = results.length;
    const passed = results.filter(r => r.success).length;
    const failed = total - passed;

    results.forEach(r => {
        const icon = r.success ? '✅' : '❌';
        const statusText = r.success ? `${colors.green}PASS${colors.reset}` : `${colors.red}FAIL${colors.reset}`;
        console.log(`${icon} ${r.name.padEnd(30)} : ${statusText}`);
    });

    console.log("\n====================");
    if (failed === 0) {
        console.log(`${colors.bright}${colors.green}🎉 TOUS LES TESTS SONT RÉUSSIS !${colors.reset}`);
    } else {
        console.log(`${colors.bright}${colors.red}⚠️  ${failed} TEST(S) ONT ÉCHOUÉ.${colors.reset}`);
    }
    console.log(`\n${colors.yellow}Note: Assurez-vous que le backend est lancé.${colors.reset}\n`);
}

runTests().catch(err => {
    console.error("Erreur fatale lors des tests:", err);
    process.exit(1);
});
