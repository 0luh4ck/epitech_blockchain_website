import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const OFFICIAL_SENDER = 'moktar.vodounnon@epitech.eu';

// Configurer le transporteur Nodemailer
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER || OFFICIAL_SENDER,
    pass: process.env.SMTP_PASS || 'app_password_placeholder'
  }
});

/**
 * Génère un mot de passe temporaire aléatoire et sécurisé de 12 caractères
 */
export const generateTemporaryPassword = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
  let password = '';
  for (let i = 0; i < 12; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
};

/**
 * Envoie un e-mail d'approbation d'adhésion avec les identifiants et le mot de passe temporaire
 */
export const sendApprovalEmail = async ({ email, firstName, lastName, tempPassword }) => {
  const loginUrl = process.env.FRONTEND_URL || 'http://localhost:5173/login';

  const mailOptions = {
    from: `"Club Blockchain Epitech" <${OFFICIAL_SENDER}>`,
    to: email,
    subject: '🎉 Demande d\'adhésion approuvée - Club Blockchain Epitech Bénin',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0b0f19; color: #ffffff; padding: 24px; border-radius: 12px; border: 1px solid #1e293b;">
        <div style="text-align: center; margin-bottom: 24px;">
          <h2 style="color: #6366f1; margin-bottom: 8px;">Club Blockchain Epitech Bénin</h2>
          <p style="color: #94a3b8; font-size: 14px;">Bienvenue dans notre communauté Web3</p>
        </div>

        <div style="background: #1e293b; padding: 20px; border-radius: 8px; margin-bottom: 24px;">
          <h3 style="color: #38bdf8; margin-top: 0;">Félicitations ${firstName} !</h3>
          <p style="color: #cbd5e1; line-height: 1.6;">
            Votre demande d'adhésion au Club Blockchain d'Epitech Bénin a été validée avec succès par le Bureau Exécutif.
          </p>

          <p style="color: #cbd5e1; font-weight: bold; margin-top: 16px;">Voici vos identifiants de connexion :</p>
          <div style="background: #0f172a; padding: 16px; border-radius: 6px; border-left: 4px solid #6366f1; margin: 12px 0;">
            <p style="margin: 4px 0; color: #94a3b8;"><strong>Email :</strong> <span style="color: #ffffff;">${email}</span></p>
            <p style="margin: 4px 0; color: #94a3b8;"><strong>Mot de passe temporaire :</strong> <span style="color: #38bdf8; font-family: monospace; font-size: 16px; font-weight: bold;">${tempPassword}</span></p>
          </div>

          <p style="color: #94a3b8; font-size: 13px;">
            Vous pouvez vous connecter directement à la plateforme avec ce mot de passe.
          </p>
        </div>

        <div style="text-align: center; margin-bottom: 24px;">
          <a href="${loginUrl}" style="background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%); color: #ffffff; text-decoration: none; padding: 12px 28px; border-radius: 8px; font-weight: bold; display: inline-block;">
            Se connecter à la plateforme
          </a>
        </div>

        <hr style="border: 0; border-top: 1px solid #334155; margin: 24px 0;" />
        <p style="color: #64748b; font-size: 12px; text-align: center; margin: 0;">
          Expédié par : <strong>${OFFICIAL_SENDER}</strong> — Club Blockchain Epitech Bénin
        </p>
      </div>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`✉️ Email d'approbation envoyé avec succès à ${email}: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(`⚠️ Erreur d'envoi mail (SMTP standard, mode simulation actif) pour ${email}:`, error.message);
    // Simulation fallback so process never blocks if local SMTP server is not set up
    console.log(`[SIMULATION MAIL ADHÉSION] Destinataire: ${email} | MDP Généré: ${tempPassword}`);
    return { success: true, simulated: true, tempPassword };
  }
};

/**
 * Envoie un e-mail de notification de rejet
 */
export const sendRejectionEmail = async ({ email, firstName, rejectionReason }) => {
  const mailOptions = {
    from: `"Club Blockchain Epitech" <${OFFICIAL_SENDER}>`,
    to: email,
    subject: 'Mise à jour concernant votre demande d\'adhésion - Club Blockchain Epitech',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0b0f19; color: #ffffff; padding: 24px; border-radius: 12px; border: 1px solid #1e293b;">
        <h3 style="color: #ef4444;">Information relative à votre candidature</h3>
        <p style="color: #cbd5e1;">Bonjour ${firstName},</p>
        <p style="color: #cbd5e1; line-height: 1.6;">
          Après examen par le Bureau Exécutif, nous le regrettons mais votre demande d'adhésion n'a pas pu être retenue pour le moment.
        </p>
        ${rejectionReason ? `<div style="background: #1e293b; padding: 12px; border-radius: 6px; color: #f87171; margin: 12px 0;"><strong>Motif :</strong> ${rejectionReason}</div>` : ''}
        <p style="color: #94a3b8; font-size: 13px;">Vous pouvez contacter l'équipe pour plus d'informations ou renouveler votre candidature lors de la prochaine session.</p>
        <hr style="border: 0; border-top: 1px solid #334155; margin: 24px 0;" />
        <p style="color: #64748b; font-size: 12px; text-align: center;">Expédié par ${OFFICIAL_SENDER}</p>
      </div>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(`⚠️ Erreur d'envoi mail rejet (simulation) pour ${email}:`, error.message);
    return { success: true, simulated: true };
  }
};

export default {
  generateTemporaryPassword,
  sendApprovalEmail,
  sendRejectionEmail
};
