-- ============================================================================
-- PURGE / ANONYMISATION des anciens comptes membres (TiDB Cloud)
-- ----------------------------------------------------------------------------
-- Cible : TOUS les comptes SAUF le Superadmin epiblockchain@epitech.eu
-- (y compris les autres admins/executives : ils seront désactivés !)
--
-- PRÉREQUIS : déployer d'abord le backend (migrate.js ajoute la colonne
-- `is_anonymized` automatiquement au boot), ou exécuter l'étape 0 ci-dessous.
--
-- EXÉCUTION : copier ce script dans la console SQL TiDB Cloud.
-- Les contrôles AVANT/APRÈS permettent de vérifier avant COMMIT.
-- En cas de doute après l'UPDATE : ROLLBACK au lieu de COMMIT.
-- ============================================================================

-- ÉTAPE 0 : garantir la colonne de marquage (TiDB supporte IF NOT EXISTS)
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_anonymized BOOLEAN DEFAULT FALSE;

START TRANSACTION;

-- ÉTAPE 1 : CONTRÔLES AVANT (à examiner avant de continuer) ------------------
-- Le Superadmin doit exister et être le seul préservé :
SELECT id, email, role, is_active
FROM users
WHERE email = 'epiblockchain@epitech.eu';

-- Nombre de comptes qui vont être anonymisés :
SELECT COUNT(*) AS will_be_anonymized
FROM users
WHERE email != 'epiblockchain@epitech.eu'
  AND (is_anonymized IS NULL OR is_anonymized = FALSE);

-- ÉTAPE 2 : ANONYMISATION ----------------------------------------------------
-- NOTE schéma réel : pas de colonne `status` sur `users` (marquage via
-- `is_anonymized`), pas de valeur de rôle 'superadmin' (le Superadmin a
-- role = 'admin' : seule la clause email le protège, elle est STRICTE).
UPDATE users
SET
  first_name = 'Anonyme',
  last_name = CONCAT('User_', id),
  email = CONCAT('archived_user_', id, '@deleted.local'),
  phone = NULL,
  student_id = NULL,
  bio = NULL,
  avatar = NULL,
  verification_token = NULL,
  reset_password_token = NULL,
  reset_password_expires = NULL,
  -- Mot de passe inexploitable (ne correspond à aucune chaîne saisissable) :
  password = CONCAT('$UNUSABLE$', SHA2(CONCAT(UUID(), id, RAND()), 256)),
  is_active = FALSE,
  is_verified = FALSE,
  must_change_password = FALSE,
  is_anonymized = TRUE,
  updated_at = NOW()
WHERE email != 'epiblockchain@epitech.eu'
  AND role != 'superadmin'
  AND (is_anonymized IS NULL OR is_anonymized = FALSE);

-- ÉTAPE 3 : CONTRÔLES APRÈS (doivent tous être cohérents avant COMMIT) -------
-- a) Le Superadmin est intact (email d'origine, actif) :
SELECT id, email, role, is_active, is_anonymized
FROM users
WHERE email = 'epiblockchain@epitech.eu';

-- b) Zéro compte actif non-superadmin restant :
SELECT COUNT(*) AS remaining_active_non_superadmin
FROM users
WHERE email != 'epiblockchain@epitech.eu'
  AND is_active = TRUE;

-- c) Tous les anonymisés ont un email fictif unique et un accès coupé :
SELECT COUNT(*) AS anonymized_total FROM users WHERE is_anonymized = TRUE;
SELECT COUNT(*) AS anonymized_bad
FROM users
WHERE is_anonymized = TRUE
  AND (email NOT LIKE 'archived_user_%@deleted.local'
       OR is_active = TRUE
       OR password NOT LIKE '$UNUSABLE$%');

-- ÉTAPE 4 : valider (ou ROLLBACK en cas d'anomalie) ---------------------------
COMMIT;
