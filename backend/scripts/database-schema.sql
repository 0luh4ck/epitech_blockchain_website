-- Script de création de la base de données pour le Club Blockchain Epitech
-- Base de données: MySQL/PostgreSQL

-- Création de la base de données (si nécessaire)
CREATE DATABASE IF NOT EXISTS epitech_blockchain_club;

USE epitech_blockchain_club;

-- Table des utilisateurs (membres et administrateurs)
CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    student_id VARCHAR(50),
    role ENUM('admin', 'member', 'executive') DEFAULT 'member',
    position VARCHAR(100),
    bio TEXT,
    avatar VARCHAR(255),
    is_active BOOLEAN DEFAULT true,
    is_verified BOOLEAN DEFAULT false,
    verification_token VARCHAR(255),
    reset_password_token VARCHAR(255),
    reset_password_expires DATETIME,
    last_login DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Table des demandes d'adhésion
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

-- Table des partenaires
CREATE TABLE IF NOT EXISTS partners (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    website VARCHAR(255),
    logo VARCHAR(255),
    contact_email VARCHAR(255),
    contact_phone VARCHAR(20),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Table des activités/événements
CREATE TABLE IF NOT EXISTS activities (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    type ENUM('seminar', 'conference', 'workshop', 'meeting', 'exam', 'other') NOT NULL,
    status ENUM('draft', 'published', 'cancelled', 'completed') DEFAULT 'draft',
    is_public BOOLEAN DEFAULT false,
    max_participants INT,
    current_participants INT DEFAULT 0,
    start_date DATETIME NOT NULL,
    end_date DATETIME NOT NULL,
    location VARCHAR(255),
    online_link VARCHAR(255),
    image VARCHAR(255),
    requirements TEXT,
    created_by INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE
);

-- Table des inscriptions aux activités
CREATE TABLE IF NOT EXISTS activity_registrations (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    activity_id INT NOT NULL,
    status ENUM('registered', 'confirmed', 'cancelled', 'completed') DEFAULT 'registered',
    registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    notes TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (activity_id) REFERENCES activities(id) ON DELETE CASCADE,
    UNIQUE KEY unique_registration (user_id, activity_id)
);

-- Table de présence
CREATE TABLE IF NOT EXISTS attendance (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    activity_id INT NOT NULL,
    status ENUM('present', 'absent', 'late', 'excused') NOT NULL,
    check_in_time DATETIME,
    notes TEXT,
    marked_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (activity_id) REFERENCES activities(id) ON DELETE CASCADE,
    FOREIGN KEY (marked_by) REFERENCES users(id) ON DELETE SET NULL,
    UNIQUE KEY unique_attendance (user_id, activity_id)
);

-- Table des examens
CREATE TABLE IF NOT EXISTS exams (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    instructions TEXT,
    duration_minutes INT NOT NULL,
    max_attempts INT DEFAULT 1,
    passing_score INT DEFAULT 60,
    is_active BOOLEAN DEFAULT true,
    start_date DATETIME,
    end_date DATETIME,
    created_by INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE
);

-- Table des questions d'examen
CREATE TABLE IF NOT EXISTS exam_questions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    exam_id INT NOT NULL,
    question_text TEXT NOT NULL,
    question_type ENUM('multiple_choice', 'true_false', 'short_answer', 'essay') NOT NULL,
    options JSON,
    correct_answer TEXT,
    points INT DEFAULT 1,
    order_index INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (exam_id) REFERENCES exams(id) ON DELETE CASCADE
);

-- Table des résultats d'examen
CREATE TABLE IF NOT EXISTS exam_results (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    exam_id INT NOT NULL,
    score INT,
    total_points INT,
    percentage DECIMAL(5,2),
    status ENUM('in_progress', 'completed', 'failed', 'passed') DEFAULT 'in_progress',
    started_at DATETIME,
    completed_at DATETIME,
    time_taken_minutes INT,
    attempt_number INT DEFAULT 1,
    answers JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (exam_id) REFERENCES exams(id) ON DELETE CASCADE,
    UNIQUE KEY unique_exam_attempt (user_id, exam_id, attempt_number)
);

-- Table des demandes d'adhésion
CREATE TABLE IF NOT EXISTS membership_applications (
    id INT PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    student_id VARCHAR(50),
    motivation TEXT NOT NULL,
    experience TEXT,
    interests TEXT,
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    reviewed_by INT,
    reviewed_at DATETIME,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (reviewed_by) REFERENCES users(id) ON DELETE SET NULL
);

-- Table des actualités/annonces
CREATE TABLE IF NOT EXISTS announcements (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    type ENUM('general', 'activity', 'exam', 'important') DEFAULT 'general',
    is_public BOOLEAN DEFAULT true,
    is_pinned BOOLEAN DEFAULT false,
    image VARCHAR(255),
    created_by INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE
);

-- Table des contacts/messages
CREATE TABLE IF NOT EXISTS contact_messages (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    status ENUM('new', 'read', 'replied', 'archived') DEFAULT 'new',
    replied_by INT,
    replied_at DATETIME,
    reply_message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (replied_by) REFERENCES users(id) ON DELETE SET NULL
);

-- Insertion des données initiales

-- Utilisateurs administrateurs par défaut
INSERT INTO users (email, password, first_name, last_name, role, position, is_active, is_verified) VALUES
('samuel.soglohoun@epitech.eu', '$2b$10$rQZ8K9mN2pL3vX7wE5tYCO8fG1hI2jK4lM6nO9pQ7rS3tU5vW8xY1zA4bC6dE', 'Samuel', 'SOGLOHOUN', 'admin', 'Coordinateur du Bureau Exécutif', true, true),
('brouhane.boni-gomina@epitech.eu', '$2b$10$rQZ8K9mN2pL3vX7wE5tYCO8fG1hI2jK4lM6nO9pQ7rS3tU5vW8xY1zA4bC6dE', 'Brouhane', 'BONI GOMINA', 'admin', 'Président', true, true);

-- Partenaires
INSERT INTO partners (name, description, website, contact_email, is_active) VALUES
('Epitech Bénin', 'École d\'informatique et d\'innovation technologique', 'https://epitech.bj/', 'contact@epitech.bj', true),
('Future Studio', 'Studio d\'innovation et de développement technologique', 'https://www.futurestudio.bj/', 'info@futurestudio.bj', true),
('Africa Blockchain Institute', 'Institut de formation et de recherche en blockchain', 'https://africablockchain.institute/', 'contact@africablockchain.institute', true);

-- Membres du Bureau Exécutif 2025-2026
INSERT INTO users (email, password, first_name, last_name, role, position, is_active, is_verified) VALUES
('estelle.gossou@epitech.eu', '$2b$10$rQZ8K9mN2pL3vX7wE5tYCO8fG1hI2jK4lM6nO9pQ7rS3tU5vW8xY1zA4bC6dE', 'Estelle', 'GOSSOU', 'executive', 'Secrétaire', true, true),
('divine.azanmassou@epitech.eu', '$2b$10$rQZ8K9mN2pL3vX7wE5tYCO8fG1hI2jK4lM6nO9pQ7rS3tU5vW8xY1zA4bC6dE', 'Divine', 'AZANMASSO', 'executive', 'Trésorière', true, true),
('christopher.guidibi@epitech.eu', '$2b$10$rQZ8K9mN2pL3vX7wE5tYCO8fG1hI2jK4lM6nO9pQ7rS3tU5vW8xY1zA4bC6dE', 'Christopher', 'GUIDIBI', 'executive', 'Chargé du Pôle Evènements et Partenariats', true, true),
('stella.gbaguidi@epitech.eu', '$2b$10$rQZ8K9mN2pL3vX7wE5tYCO8fG1hI2jK4lM6nO9pQ7rS3tU5vW8xY1zA4bC6dE', 'Stella', 'GBAGUIDI', 'executive', 'Adjoint chargé des Evènements et Partenariats', true, true),
('moktar.vodounnon@epitech.eu', '$2b$10$rQZ8K9mN2pL3vX7wE5tYCO8fG1hI2jK4lM6nO9pQ7rS3tU5vW8xY1zA4bC6dE', 'Moktar', 'VODOUNNON', 'executive', 'Lead du Pôle Tech', true, true),
('imane.philippe@epitech.eu', '$2b$10$rQZ8K9mN2pL3vX7wE5tYCO8fG1hI2jK4lM6nO9pQ7rS3tU5vW8xY1zA4bC6dE', 'Imane', 'PHILIPPE', 'executive', 'Lead du Pôle Communication', true, true),
('morayo.elegbede@epitech.eu', '$2b$10$rQZ8K9mN2pL3vX7wE5tYCO8fG1hI2jK4lM6nO9pQ7rS3tU5vW8xY1zA4bC6dE', 'Morayo', 'ELEGBEDE', 'executive', 'Adjoint Chargé Pôle Communication', true, true),
('christian.abiala@epitech.eu', '$2b$10$rQZ8K9mN2pL3vX7wE5tYCO8fG1hI2jK4lM6nO9pQ7rS3tU5vW8xY1zA4bC6dE', 'Christian', 'ABIALA', 'executive', 'Chargé du Pôle Pédago', true, true),
('eunice.gossou-bah@epitech.eu', '$2b$10$rQZ8K9mN2pL3vX7wE5tYCO8fG1hI2jK4lM6nO9pQ7rS3tU5vW8xY1zA4bC6dE', 'Eunice', 'GOSSOU BAH', 'executive', 'Lead Pôle Ressources Humaines', true, true),
('jimmy.bachabi@epitech.eu', '$2b$10$rQZ8K9mN2pL3vX7wE5tYCO8fG1hI2jK4lM6nO9pQ7rS3tU5vW8xY1zA4bC6dE', 'Jimmy', 'BACHABI', 'executive', 'Adjoint Pôle Ressources Humaines', true, true),
('farid.adoi@epitech.eu', '$2b$10$rQZ8K9mN2pL3vX7wE5tYCO8fG1hI2jK4lM6nO9pQ7rS3tU5vW8xY1zA4bC6dE', 'Farid', 'ADOI', 'executive', 'Conseiller Pôle Tech et Pédago', true, true);

-- Annonce de bienvenue
INSERT INTO announcements (title, content, type, is_public, is_pinned, created_by) VALUES
('Bienvenue au Club Blockchain d\'Epitech Bénin !', 'Nous sommes ravis de vous accueillir sur notre nouvelle plateforme. Le Club Blockchain d\'Epitech Bénin est né de la collaboration entre Epitech Bénin, Future Studio et l\'Africa Blockchain Institute. Rejoignez-nous pour explorer l\'univers passionnant de la blockchain !', 'important', true, true, 1);

-- Index pour optimiser les performances
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_activities_start_date ON activities(start_date);
CREATE INDEX idx_activities_status ON activities(status);
CREATE INDEX idx_activity_registrations_user_id ON activity_registrations(user_id);
CREATE INDEX idx_activity_registrations_activity_id ON activity_registrations(activity_id);
CREATE INDEX idx_attendance_user_id ON attendance(user_id);
CREATE INDEX idx_attendance_activity_id ON attendance(activity_id);
CREATE INDEX idx_exam_results_user_id ON exam_results(user_id);
CREATE INDEX idx_exam_results_exam_id ON exam_results(exam_id);
CREATE INDEX idx_membership_applications_status ON membership_applications(status);
CREATE INDEX idx_announcements_created_at ON announcements(created_at);
CREATE INDEX idx_contact_messages_status ON contact_messages(status);
