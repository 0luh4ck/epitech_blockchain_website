// Constantes de l'application

export const APP_CONFIG = {
  name: 'Club Blockchain Epitech',
  version: '1.0.0',
  description: 'Site web du Club Blockchain d\'Epitech Bénin',
  contact: {
    email: 'contact@epitech-blockchain.bj',
    phone: '+229 XX XX XX XX',
    address: 'Epitech Bénin, Cotonou, Bénin'
  },
  social: {
    facebook: 'https://facebook.com/epitech-blockchain-benin',
    instagram: 'https://instagram.com/epitech_blockchain_benin',
    linkedin: 'https://linkedin.com/company/epitech-blockchain-benin',
    twitter: 'https://twitter.com/epitech_blockchain_benin'
  }
};

export const USER_ROLES = {
  ADMIN: 'admin',
  EXECUTIVE: 'executive',
  MEMBER: 'member'
};

export const ACTIVITY_TYPES = {
  SEMINAR: 'seminar',
  CONFERENCE: 'conference',
  WORKSHOP: 'workshop',
  MEETING: 'meeting',
  EXAM: 'exam',
  OTHER: 'other'
};

export const ACTIVITY_STATUS = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
  CANCELLED: 'cancelled',
  COMPLETED: 'completed'
};

export const EXAM_TYPES = {
  MULTIPLE_CHOICE: 'multiple_choice',
  TRUE_FALSE: 'true_false',
  SHORT_ANSWER: 'short_answer',
  ESSAY: 'essay'
};

export const ATTENDANCE_STATUS = {
  PRESENT: 'present',
  ABSENT: 'absent',
  LATE: 'late',
  EXCUSED: 'excused'
};

export const MEMBERSHIP_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected'
};

export const ROUTES = {
  HOME: '/',
  ABOUT: '/about',
  EXECUTIVE_BOARD: '/executive-board',
  PARTNERS: '/partners',
  ACTIVITIES: '/activities',
  MEMBERSHIP: '/membership',
  CONTACT: '/contact',
  LOGIN: '/login',
  REGISTER: '/register',
  MEMBERSHIP_REQUEST: '/membership-request',
  DASHBOARD: '/dashboard',
  PROFILE: '/profile',
  ADMIN: '/admin'
};

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    PROFILE: '/auth/me',
    REFRESH: '/auth/refresh'
  },
  USERS: '/users',
  ACTIVITIES: '/activities',
  EXAMS: '/exams',
  ATTENDANCE: '/attendance',
  MEMBERSHIP: '/membership',
  MEMBERSHIP_REQUESTS: '/membership-requests',
  PARTNERS: '/partners'
};

export const STORAGE_KEYS = {
  TOKEN: 'token',
  USER: 'user',
  THEME: 'theme',
  LANGUAGE: 'language'
};

export const VALIDATION_RULES = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^(\+229|229)?[0-9]{8}$/,
  PASSWORD_MIN_LENGTH: 6,
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 50,
  BIO_MAX_LENGTH: 500,
  DESCRIPTION_MAX_LENGTH: 1000
};

export const DATE_FORMATS = {
  DISPLAY: 'dd/MM/yyyy',
  DISPLAY_WITH_TIME: 'dd/MM/yyyy HH:mm',
  API: 'yyyy-MM-dd',
  API_WITH_TIME: 'yyyy-MM-dd HH:mm:ss'
};

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  LIMITS: [5, 10, 20, 50]
};

export const FILE_UPLOAD = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  ALLOWED_EXTENSIONS: ['.jpg', '.jpeg', '.png', '.gif', '.webp']
};

export const EXAM_CONFIG = {
  DEFAULT_DURATION: 60, // minutes
  DEFAULT_MAX_ATTEMPTS: 1,
  DEFAULT_PASSING_SCORE: 60,
  MAX_DURATION: 480, // 8 hours
  MAX_ATTEMPTS: 5
};
