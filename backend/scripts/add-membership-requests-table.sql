-- Script pour ajouter la table des demandes d'adhésion
-- À exécuter sur la base de données existante

USE epitech_blockchain_club;

-- Créer la table des demandes d'adhésion
CREATE TABLE IF NOT EXISTS membership_requests (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    student_id VARCHAR(50),
    motivation TEXT,
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    reviewed_by INT,
    reviewed_at DATETIME,
    rejection_reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (reviewed_by) REFERENCES users(id) ON DELETE SET NULL
);

-- Ajouter un index sur l'email pour les performances
CREATE INDEX idx_membership_requests_email ON membership_requests(email);

-- Ajouter un index sur le statut pour les requêtes d'administration
CREATE INDEX idx_membership_requests_status ON membership_requests(status);

-- Ajouter un index sur la date de création pour le tri
CREATE INDEX idx_membership_requests_created_at ON membership_requests(created_at);

-- Insérer un utilisateur admin par défaut si aucun n'existe
INSERT IGNORE INTO users (email, password, first_name, last_name, role, is_active, is_verified) 
VALUES (
    'admin@epitech-blockchain.bj', 
    '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/8KzKz2a', -- password: admin123
    'Admin', 
    'Club Blockchain', 
    'admin', 
    true, 
    true
);

-- Afficher un message de confirmation
SELECT 'Table membership_requests créée avec succès!' as message;
SELECT 'Utilisateur admin par défaut créé (email: admin@epitech-blockchain.bj, password: admin123)' as admin_info;
