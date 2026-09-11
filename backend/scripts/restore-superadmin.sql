-- ============================================================================
-- RESTAURATION D'URGENCE du Superadmin (incident 401 généralisé / TiDB Cloud)
-- ----------------------------------------------------------------------------
-- Contexte : après l'anonymisation de masse, le compte Superadmin peut être
-- retrouvé bloqué (is_active = FALSE), anonymisé, ou avec un hash inconnu.
-- Ce script le restaure en 1 passage : flags + mot de passe initial.
--
-- Hash ci-dessous = bcrypt('12345678', cost 10), généré côté backend.
-- Après restauration, le Superadmin se connecte avec `12345678` puis la
-- modale `must_change_password` impose un nouveau mot de passe.
--
-- EXÉCUTION : console SQL TiDB Cloud. Vérifier les SELECT avant COMMIT.
-- ============================================================================

START TRANSACTION;

-- ÉTAPE 1 : ÉTAT AVANT (constat) ---------------------------------------------
SELECT id, email, role, is_active, is_verified, must_change_password,
       LEFT(password, 7) AS hash_prefix, LENGTH(password) AS hash_len
FROM users
WHERE email = 'epiblockchain@epitech.eu';

-- ÉTAPE 2 : RESTAURATION (strictement limitée au Superadmin) ------------------
UPDATE users
SET
  password = '$2a$10$ChLAYr1OoAt./mGg8tzxne1TrDeNM/32NHhylzAzXudciaGeyXgOW',
  role = 'admin',
  position = 'Superadmin System',
  is_active = TRUE,
  is_verified = TRUE,
  must_change_password = TRUE,
  updated_at = NOW()
WHERE email = 'epiblockchain@epitech.eu';

-- Remet aussi le flag d'anonymisation si la colonne existe déjà.
-- Si erreur 1054 (Unknown column), ignorez-la et continuez : le backend
-- (migrate.js → ensureUserColumns) crée la colonne automatiquement au boot.
UPDATE users
SET is_anonymized = FALSE
WHERE email = 'epiblockchain@epitech.eu';

-- ÉTAPE 3 : VÉRIFICATION (doit retourner exactement 1 ligne conforme) ---------
SELECT id, email, role, is_active, is_verified, must_change_password,
       LEFT(password, 7) AS hash_prefix
FROM users
WHERE email = 'epiblockchain@epitech.eu'
  AND is_active = TRUE
  AND is_verified = TRUE;

COMMIT;
