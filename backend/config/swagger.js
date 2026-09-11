import swaggerJsdocPkg from 'swagger-jsdoc';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// swagger-jsdoc est CommonJS : l'import ESM peut exposer .default
const swaggerJsdoc =
  swaggerJsdocPkg && swaggerJsdocPkg.default ? swaggerJsdocPkg.default : swaggerJsdocPkg;

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Club Blockchain Epitech — API',
      version: '1.0.0',
      description:
        "API du site web du Club Blockchain d'Epitech Bénin : authentification (espaces Membre / Bureau / Admin), demandes d'adhésion, activités, examens/QCM, présences et partenaires.",
    },
    servers: [
      {
        url: process.env.API_PUBLIC_URL || 'http://localhost:5000/api',
        description: 'Serveur API',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: "Token JWT obtenu via POST /auth/login (en-tête : Authorization: Bearer <token>)",
        },
      },
      schemas: {
        ApiSuccess: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string', example: 'Opération réussie' },
          },
        },
        ApiError: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string', example: "Email ou mot de passe incorrect" },
            code: { type: 'string', example: 'CURRENT_PASSWORD_MISMATCH' },
          },
        },
        LoginRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', format: 'email', example: 'membre@epitech.eu' },
            password: { type: 'string', format: 'password', example: 'motdepasse123' },
            space: {
              type: 'string',
              enum: ['member', 'executive', 'admin'],
              description:
                "Espace de connexion : doit correspondre au rôle en BDD (member, executive). 'admin' réservé à la route d'administration confidentielle.",
              example: 'member',
            },
          },
        },
        AuthUser: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            email: { type: 'string', example: 'membre@epitech.eu' },
            firstName: { type: 'string', example: 'Ada' },
            lastName: { type: 'string', example: 'Lovelace' },
            role: { type: 'string', enum: ['admin', 'member', 'executive'], example: 'member' },
            isVerified: { type: 'boolean', example: true },
            mustChangePassword: { type: 'boolean', example: false },
          },
        },
        ChangePasswordRequest: {
          type: 'object',
          required: ['currentPassword', 'newPassword'],
          properties: {
            currentPassword: { type: 'string', format: 'password' },
            newPassword: { type: 'string', format: 'password', minLength: 6 },
          },
        },
        MembershipRequestInput: {
          type: 'object',
          required: ['firstName', 'lastName', 'email'],
          properties: {
            firstName: { type: 'string', example: 'Ada' },
            lastName: { type: 'string', example: 'Lovelace' },
            email: { type: 'string', format: 'email', example: 'candidat@epitech.eu' },
            phone: { type: 'string', example: '+22997000000' },
            studentId: { type: 'string', example: 'EPITECH-2024-001' },
            motivation: { type: 'string', example: "Je souhaite contribuer aux ateliers Web3 du club." },
          },
        },
      },
    },
    tags: [
      { name: 'Auth', description: 'Authentification, profil et mot de passe' },
      { name: 'MembershipRequests', description: "Demandes d'adhésion (publique + Bureau)" },
      { name: 'Membership', description: 'Adhésions et candidatures' },
      { name: 'Users', description: 'Gestion des membres' },
      { name: 'Activities', description: 'Activités et inscriptions' },
      { name: 'Exams', description: 'Examens / QCM' },
      { name: 'Attendance', description: 'Présences' },
      { name: 'Partners', description: 'Partenaires' },
      { name: 'Stats', description: 'Statistiques publiques' },
    ],
  },
  // Annotations OpenAPI dans les routeurs Express
  apis: [path.join(__dirname, '../routes/*.js')],
};

export const swaggerSpec = swaggerJsdoc(options);
export default swaggerSpec;
