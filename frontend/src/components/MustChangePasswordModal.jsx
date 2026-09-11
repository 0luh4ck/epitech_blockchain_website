import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const MustChangePasswordModal = () => {
  const { user, changePassword, setUser } = useAuth();
  const { showToast } = useToast();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [focused, setFocused] = useState(null);

  // Ne pas afficher la modale si l'utilisateur n'a pas le flag mustChangePassword
  if (!user || !user.mustChangePassword) {
    return null;
  }

  // Vérification de concordance en temps réel
  const isMatch = newPassword && confirmPassword && newPassword === confirmPassword;
  const isMismatch = confirmPassword && newPassword !== confirmPassword;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!currentPassword) {
      setError('Veuillez saisir votre mot de passe actuel.');
      return;
    }

    if (newPassword.length < 8) {
      setError('Le nouveau mot de passe doit contenir au moins 8 caractères.');
      return;
    }

    if (isMismatch) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }

    setLoading(true);

    try {
      const res = await changePassword(currentPassword, newPassword);
      if (res.success) {
        showToast('Mot de passe mis à jour avec succès !', 'success');
        // Mettre à jour l'utilisateur localement pour fermer la modale bloquante
        if (setUser) {
          setUser(prev => ({ ...prev, mustChangePassword: false }));
        }
      } else {
        setError(res.message || 'Erreur lors de la mise à jour du mot de passe.');
      }
    } catch (err) {
      setError('Une erreur est survenue lors de la réinitialisation.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: 'rgba(5, 8, 16, 0.95)',
      backdropFilter: 'blur(12px)',
      zIndex: 999999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '12px',
      overflowY: 'auto'
    }}>
      <div style={{
        background: '#0f172a',
        border: '1px solid #334155',
        borderRadius: '16px',
        padding: 'clamp(20px, 4vw, 32px)',
        maxHeight: '90vh',
        overflowY: 'auto',
        maxWidth: '480px',
        width: '100%',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 30px rgba(99, 102, 241, 0.2)',
        color: '#f8fafc'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
            fontSize: '28px'
          }}>
            🔒
          </div>
          <h2 style={{ fontSize: '22px', fontWeight: 'bold', margin: '0 0 8px 0', color: '#ffffff' }}>
            Changement de mot de passe obligatoire
          </h2>
          <p style={{ fontSize: '14px', color: '#94a3b8', margin: 0, lineHeight: '1.5' }}>
            Compte Superadmin (<strong style={{ color: '#6366f1' }}>{user.email}</strong>). Pour des raisons de sécurité, vous devez définir un nouveau mot de passe personnalisé avant d'accéder à l'application.
          </p>
        </div>

        {error && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid #f87171',
            color: '#fca5a5',
            padding: '12px',
            borderRadius: '8px',
            fontSize: '13px',
            marginBottom: '20px'
          }}>
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '13px', color: '#cbd5e1', marginBottom: '6px' }}>
              Mot de passe actuel (Initial : 12345678)
            </label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              onFocus={() => setFocused('current')}
              onBlur={() => setFocused(null)}
              required
              disabled={loading}
              placeholder="••••••••"
              aria-label="Mot de passe actuel"
              style={{
                width: '100%',
                padding: '12px 14px',
                background: '#1e293b',
                border: `1px solid ${focused === 'current' ? '#818cf8' : '#475569'}`,
                boxShadow: focused === 'current' ? '0 0 0 3px rgba(129,140,248,0.35)' : 'none',
                borderRadius: '8px',
                color: '#ffffff',
                fontSize: '14px',
                outline: 'none'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', color: '#cbd5e1', marginBottom: '6px' }}>
              Nouveau mot de passe
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              onFocus={() => setFocused('new')}
              onBlur={() => setFocused(null)}
              required
              disabled={loading}
              placeholder="••••••••"
              aria-label="Nouveau mot de passe"
              style={{
                width: '100%',
                padding: '12px 14px',
                background: '#1e293b',
                border: focused === 'new'
                  ? '1px solid #818cf8'
                  : isMismatch ? '1px solid #ef4444' : isMatch ? '1px solid #10b981' : '1px solid #475569',
                boxShadow: focused === 'new' ? '0 0 0 3px rgba(129,140,248,0.35)' : 'none',
                borderRadius: '8px',
                color: '#ffffff',
                fontSize: '14px',
                outline: 'none'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', color: '#cbd5e1', marginBottom: '6px' }}>
              Confirmer le nouveau mot de passe
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              onFocus={() => setFocused('confirm')}
              onBlur={() => setFocused(null)}
              required
              disabled={loading}
              placeholder="••••••••"
              aria-label="Confirmer le nouveau mot de passe"
              style={{
                width: '100%',
                padding: '12px 14px',
                background: '#1e293b',
                border: focused === 'confirm'
                  ? '1px solid #818cf8'
                  : isMismatch ? '1px solid #ef4444' : isMatch ? '1px solid #10b981' : '1px solid #475569',
                boxShadow: focused === 'confirm' ? '0 0 0 3px rgba(129,140,248,0.35)' : 'none',
                borderRadius: '8px',
                color: '#ffffff',
                fontSize: '14px',
                outline: 'none'
              }}
            />

            {/* Contrôle de concordance en temps réel */}
            {isMismatch && (
              <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '6px', margin: '6px 0 0 0' }}>
                ✖ Les mots de passe ne correspondent pas.
              </p>
            )}
            {isMatch && (
              <p style={{ color: '#10b981', fontSize: '12px', marginTop: '6px', margin: '6px 0 0 0' }}>
                ✔ Les mots de passe correspondent parfaitement.
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || isMismatch || !newPassword || !currentPassword}
            style={{
              marginTop: '12px',
              padding: '14px',
              background: (loading || isMismatch || !newPassword)
                ? '#475569'
                : 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 'bold',
              fontSize: '15px',
              cursor: (loading || isMismatch || !newPassword) ? 'not-allowed' : 'pointer',
              boxShadow: '0 4px 14px rgba(99, 102, 241, 0.4)'
            }}
          >
            {loading ? (
              <>
                <span className="btn-spinner" aria-hidden="true" />
                Mise à jour en cours…
              </>
            ) : 'Définir mon nouveau mot de passe'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default MustChangePasswordModal;
