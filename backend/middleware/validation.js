import { body, validationResult } from 'express-validator';

// Middleware de validation des résultats
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Données invalides',
      errors: errors.array()
    });
  }
  next();
};

// Règles de validation pour l'authentification
export const validateLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Email invalide'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Le mot de passe doit contenir au moins 6 caractères'),
  handleValidationErrors
];

export const validateRegister = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Email invalide'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Le mot de passe doit contenir au moins 6 caractères'),
  body('firstName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Le prénom doit contenir entre 2 et 50 caractères'),
  body('lastName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Le nom doit contenir entre 2 et 50 caractères'),
  body('phone')
    .optional()
    .isMobilePhone()
    .withMessage('Numéro de téléphone invalide'),
  handleValidationErrors
];

// Règles de validation pour les activités
export const validateActivity = [
  body('title')
    .trim()
    .isLength({ min: 5, max: 255 })
    .withMessage('Le titre doit contenir entre 5 et 255 caractères'),
  body('description')
    .trim()
    .isLength({ min: 10 })
    .withMessage('La description doit contenir au moins 10 caractères'),
  body('type')
    .isIn(['seminar', 'conference', 'workshop', 'meeting', 'exam', 'other'])
    .withMessage('Type d\'activité invalide'),
  body('startDate')
    .isISO8601()
    .withMessage('Date de début invalide'),
  body('endDate')
    .isISO8601()
    .withMessage('Date de fin invalide'),
  body('maxParticipants')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Le nombre maximum de participants doit être un entier positif'),
  handleValidationErrors
];

// Règles de validation pour les examens
export const validateExam = [
  body('title')
    .trim()
    .isLength({ min: 5, max: 255 })
    .withMessage('Le titre doit contenir entre 5 et 255 caractères'),
  body('description')
    .optional()
    .trim()
    .isLength({ min: 10 })
    .withMessage('La description doit contenir au moins 10 caractères'),
  body('durationMinutes')
    .isInt({ min: 1, max: 480 })
    .withMessage('La durée doit être entre 1 et 480 minutes'),
  body('maxAttempts')
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage('Le nombre maximum de tentatives doit être entre 1 et 5'),
  body('passingScore')
    .optional()
    .isInt({ min: 0, max: 100 })
    .withMessage('Le score de passage doit être entre 0 et 100'),
  handleValidationErrors
];

// Règles de validation pour les demandes d'adhésion
export const validateMembershipRequest = [
  body('firstName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Le prénom doit contenir entre 2 et 50 caractères'),
  body('lastName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Le nom doit contenir entre 2 et 50 caractères'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Email invalide'),
  body('phone')
    .optional()
    .isMobilePhone()
    .withMessage('Numéro de téléphone invalide'),
  body('studentId')
    .optional()
    .trim()
    .isLength({ min: 3, max: 20 })
    .withMessage('L\'identifiant étudiant doit contenir entre 3 et 20 caractères'),
  body('motivation')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('La motivation ne doit pas dépasser 1000 caractères'),
  handleValidationErrors
];

export const validateMembershipApplication = [
  body('firstName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Le prénom doit contenir entre 2 et 50 caractères'),
  body('lastName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Le nom doit contenir entre 2 et 50 caractères'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Email invalide'),
  body('phone')
    .optional()
    .isMobilePhone()
    .withMessage('Numéro de téléphone invalide'),
  body('studentId')
    .optional()
    .trim()
    .isLength({ min: 3, max: 20 })
    .withMessage('L\'identifiant étudiant doit contenir entre 3 et 20 caractères'),
  body('motivation')
    .trim()
    .isLength({ min: 50, max: 1000 })
    .withMessage('La motivation doit contenir entre 50 et 1000 caractères'),
  body('experience')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('L\'expérience ne doit pas dépasser 500 caractères'),
  body('interests')
    .optional()
    .trim()
    .isLength({ max: 300 })
    .withMessage('Les intérêts ne doivent pas dépasser 300 caractères'),
  handleValidationErrors
];

// Règles de validation pour les messages de contact
export const validateContactMessage = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Le nom doit contenir entre 2 et 100 caractères'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Email invalide'),
  body('subject')
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage('Le sujet doit contenir entre 5 et 200 caractères'),
  body('message')
    .trim()
    .isLength({ min: 20, max: 1000 })
    .withMessage('Le message doit contenir entre 20 et 1000 caractères'),
  handleValidationErrors
];
