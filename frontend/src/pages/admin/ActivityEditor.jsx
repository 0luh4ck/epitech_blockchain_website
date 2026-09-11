import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export const ActivityEditor = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "Atelier Pratique : Déploiement de Smart Contracts Solidity",
    type: "workshop",
    startDate: "2026-09-15T14:00",
    endDate: "2026-09-15T17:00",
    location: "Epitech Bénin - Lab 301 / En ligne",
    onlineLink: "https://meet.jit.si/epitech-blockchain-workshop",
    maxParticipants: 40,
    isPublic: true,
    image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=1000&auto=format&fit=crop",
    description: "Rejoignez-nous pour une session intensive de code ! Nous allons concevoir, tester et déployer un Smart Contract ERC-20 complet en utilisant Hardhat et Remix IDE.",
    requirements: "Avoir un ordinateur portable avec Node.js (v18+) et VS Code installés. Connaissances de base en JavaScript recommandées."
  });

  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMessage('');

    try {
      // Simuler l'enregistrement via API
      setTimeout(() => {
        setSaving(false);
        setSuccessMessage('Activité enregistrée et publiée avec succès !');
      }, 600);
    } catch (err) {
      setSaving(false);
    }
  };

  return (
    <div style={{
      maxWidth: '1400px',
      margin: '0 auto',
      padding: '32px 20px',
      color: '#f8fafc',
      fontFamily: 'Inter, sans-serif'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '28px',
        borderBottom: '1px solid #1e293b',
        paddingBottom: '16px'
      }}>
        <div>
          <Link to="/admin" style={{ color: '#818cf8', textDecoration: 'none', fontSize: '13px', fontWeight: 'bold' }}>
            ← Retour au panneau d'administration
          </Link>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: '8px 0 0 0', color: '#ffffff' }}>
            Éditeur d'Activité avec Aperçu Membre Temps Réel
          </h1>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          style={{
            background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
            color: '#ffffff',
            border: 'none',
            padding: '12px 28px',
            borderRadius: '10px',
            fontWeight: 'bold',
            fontSize: '14px',
            cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(99, 102, 241, 0.4)'
          }}
        >
          {saving ? 'Enregistrement...' : '💾 Publier l\'activité'}
        </button>
      </div>

      {successMessage && (
        <div style={{
          background: 'rgba(16, 185, 129, 0.15)',
          border: '1px solid #10b981',
          color: '#34d399',
          padding: '14px',
          borderRadius: '10px',
          marginBottom: '24px',
          fontSize: '14px'
        }}>
          ✅ {successMessage}
        </div>
      )}

      {/* Grid Scindée : Éditeur (Gauche) / Aperçu Membre (Droite) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '32px',
        alignItems: 'start'
      }}>
        {/* Formulaire Éditeur (Gauche) */}
        <div style={{
          background: '#0f172a',
          border: '1px solid #1e293b',
          borderRadius: '20px',
          padding: '28px',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.4)'
        }}>
          <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#6366f1', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            ✏️ Configuration de l'activité
          </h2>

          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', color: '#cbd5e1', marginBottom: '6px' }}>Titre de l'activité</label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '12px',
                  background: '#1e293b',
                  border: '1px solid #334155',
                  borderRadius: '8px',
                  color: '#ffffff',
                  fontSize: '14px'
                }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', color: '#cbd5e1', marginBottom: '6px' }}>Type d'activité</label>
                <select
                  name="type"
                  value={form.type}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: '#1e293b',
                    border: '1px solid #334155',
                    borderRadius: '8px',
                    color: '#ffffff',
                    fontSize: '14px'
                  }}
                >
                  <option value="workshop">Atelier (Workshop)</option>
                  <option value="seminar">Séminaire</option>
                  <option value="conference">Conférence</option>
                  <option value="exam">Examen / Évaluation</option>
                  <option value="meeting">Réunion Club</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', color: '#cbd5e1', marginBottom: '6px' }}>Places max</label>
                <input
                  type="number"
                  name="maxParticipants"
                  value={form.maxParticipants}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: '#1e293b',
                    border: '1px solid #334155',
                    borderRadius: '8px',
                    color: '#ffffff',
                    fontSize: '14px'
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', color: '#cbd5e1', marginBottom: '6px' }}>Date & Heure de début</label>
                <input
                  type="datetime-local"
                  name="startDate"
                  value={form.startDate}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: '#1e293b',
                    border: '1px solid #334155',
                    borderRadius: '8px',
                    color: '#ffffff',
                    fontSize: '14px'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', color: '#cbd5e1', marginBottom: '6px' }}>Date & Heure de fin</label>
                <input
                  type="datetime-local"
                  name="endDate"
                  value={form.endDate}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: '#1e293b',
                    border: '1px solid #334155',
                    borderRadius: '8px',
                    color: '#ffffff',
                    fontSize: '14px'
                  }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', color: '#cbd5e1', marginBottom: '6px' }}>Lieu physique</label>
              <input
                type="text"
                name="location"
                value={form.location}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '12px',
                  background: '#1e293b',
                  border: '1px solid #334155',
                  borderRadius: '8px',
                  color: '#ffffff',
                  fontSize: '14px'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', color: '#cbd5e1', marginBottom: '6px' }}>URL de l'image de couverture</label>
              <input
                type="text"
                name="image"
                value={form.image}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '12px',
                  background: '#1e293b',
                  border: '1px solid #334155',
                  borderRadius: '8px',
                  color: '#ffffff',
                  fontSize: '14px'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', color: '#cbd5e1', marginBottom: '6px' }}>Description détaillée</label>
              <textarea
                name="description"
                rows="4"
                value={form.description}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '12px',
                  background: '#1e293b',
                  border: '1px solid #334155',
                  borderRadius: '8px',
                  color: '#ffffff',
                  fontSize: '14px',
                  resize: 'vertical'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', color: '#cbd5e1', marginBottom: '6px' }}>Prérequis techniques</label>
              <input
                type="text"
                name="requirements"
                value={form.requirements}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '12px',
                  background: '#1e293b',
                  border: '1px solid #334155',
                  borderRadius: '8px',
                  color: '#ffffff',
                  fontSize: '14px'
                }}
              />
            </div>
          </form>
        </div>

        {/* Composant Aperçu Membre (Droite - Mis à jour en temps réel) */}
        <div>
          <div style={{
            position: 'sticky',
            top: '20px'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '12px'
            }}>
              <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '6px' }}>
                👁️ Aperçu Membre (Rendu en temps réel)
              </span>
              <span style={{
                background: 'rgba(56, 189, 248, 0.1)',
                border: '1px solid rgba(56, 189, 248, 0.3)',
                color: '#38bdf8',
                fontSize: '11px',
                padding: '4px 10px',
                borderRadius: '12px'
              }}>
                Vue Étudiant
              </span>
            </div>

            {/* Carte de rendu type composant Membre */}
            <div style={{
              background: '#0f172a',
              border: '1px solid #334155',
              borderRadius: '20px',
              overflow: 'hidden',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.6)'
            }}>
              {/* Image d'illustration */}
              <div style={{
                height: '200px',
                width: '100%',
                backgroundImage: `url(${form.image || 'https://via.placeholder.com/800x400'})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                position: 'relative'
              }}>
                <div style={{
                  position: 'absolute',
                  top: '16px',
                  left: '16px',
                  background: 'rgba(15, 23, 42, 0.85)',
                  backdropFilter: 'blur(8px)',
                  padding: '6px 14px',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  color: '#818cf8',
                  border: '1px solid rgba(129, 140, 248, 0.3)'
                }}>
                  {form.type.toUpperCase()}
                </div>
              </div>

              {/* Contenu Carte */}
              <div style={{ padding: '24px' }}>
                <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#ffffff', margin: '0 0 12px 0', lineHeight: '1.4' }}>
                  {form.title || "Titre de l'activité"}
                </h3>

                <p style={{ fontSize: '14px', color: '#94a3b8', lineHeight: '1.6', margin: '0 0 20px 0' }}>
                  {form.description || "Description de l'activité..."}
                </p>

                {/* Métadonnées */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px', color: '#cbd5e1', marginBottom: '24px', background: '#1e293b', padding: '16px', borderRadius: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span>📅</span>
                    <span>{form.startDate ? new Date(form.startDate).toLocaleString('fr-FR') : "Date non définie"}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span>📍</span>
                    <span>{form.location || "Lieu non précisé"}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span>👥</span>
                    <span>Capacité : <strong>{form.maxParticipants || 0} participants max</strong></span>
                  </div>
                  {form.requirements && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#f59e0b' }}>
                      <span>⚠️</span>
                      <span><strong>Prérequis :</strong> {form.requirements}</span>
                    </div>
                  )}
                </div>

                <button
                  style={{
                    width: '100%',
                    padding: '14px',
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '12px',
                    fontWeight: 'bold',
                    fontSize: '15px',
                    cursor: 'pointer',
                    boxShadow: '0 4px 14px rgba(16, 185, 129, 0.4)'
                  }}
                >
                  S'inscrire à l'activité
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityEditor;
