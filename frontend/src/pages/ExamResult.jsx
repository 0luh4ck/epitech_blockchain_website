import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';

export const ExamResult = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [result, setResult] = useState(null);
  const [showCertificate, setShowCertificate] = useState(false);

  useEffect(() => {
    const data = localStorage.getItem(`exam_result_${id || '1'}`);
    if (data) {
      setResult(JSON.parse(data));
    } else {
      // Fallback result for demonstration
      setResult({
        examId: id || '1',
        title: "Évaluation Fondamentaux Web3 & Smart Contracts",
        score: 4,
        total: 5,
        percentage: 80,
        timeTaken: 28,
        date: new Date().toLocaleDateString('fr-FR'),
        questions: [
          {
            id: 1,
            question: "Quel mécanisme de consensus est utilisé par Ethereum 2.0 (Proof of Stake) ?",
            options: ["Proof of Work (PoW)", "Proof of Stake (PoS)", "Delegated Proof of Stake (DPoS)", "Proof of Authority (PoA)"],
            correct: 1
          },
          {
            id: 2,
            question: "Qu'est-ce qu'un Smart Contract ?",
            options: ["Un contrat juridique papier numérisé en PDF", "Un programme autonome exécuté sur une blockchain", "Un protocole réseau pour accélérer le Wi-Fi", "Une clé privée de chiffrement RSA"],
            correct: 1
          }
        ],
        answers: { 1: 1, 2: 1 }
      });
    }
  }, [id]);

  if (!result) {
    return (
      <div style={{ padding: '60px', textAlign: 'center', color: '#94a3b8' }}>
        Chargement des résultats...
      </div>
    );
  }

  const isPassed = result.percentage >= 60;

  // Calcul SVG pour la jauge circulaire
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (result.percentage / 100) * circumference;

  return (
    <div style={{
      maxWidth: '1000px',
      margin: '0 auto',
      padding: '40px 20px',
      color: '#f8fafc',
      fontFamily: 'Inter, sans-serif'
    }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <Link to="/dashboard" style={{ color: '#818cf8', textDecoration: 'none', fontSize: '14px', fontWeight: 'bold' }}>
          ← Retour au tableau de bord
        </Link>
        <h1 style={{ fontSize: '26px', fontWeight: 'bold', margin: '12px 0 4px 0', color: '#ffffff' }}>
          Résultats d'évaluation : {result.title}
        </h1>
        <p style={{ fontSize: '14px', color: '#94a3b8', margin: 0 }}>
          Session complétée le {result.date} en {result.timeTaken} minutes
        </p>
      </div>

      {/* Grid Supérieure : Jauge circulaire & Résumé */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '320px 1fr',
        gap: '24px',
        marginBottom: '36px'
      }}>
        {/* Carte Jauge Circulaire */}
        <div style={{
          background: '#0f172a',
          border: '1px solid #1e293b',
          borderRadius: '20px',
          padding: '32px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.4)'
        }}>
          {/* Jauge Circulaire SVG */}
          <div style={{ position: 'relative', width: '180px', height: '180px', marginBottom: '16px' }}>
            <svg width="180" height="180" viewBox="0 0 180 180" style={{ transform: 'rotate(-90deg)' }}>
              <circle
                cx="90"
                cy="90"
                r={radius}
                stroke="#1e293b"
                strokeWidth="14"
                fill="transparent"
              />
              <circle
                cx="90"
                cy="90"
                r={radius}
                stroke={isPassed ? '#10b981' : '#ef4444'}
                strokeWidth="14"
                fill="transparent"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                style={{ transition: 'stroke-dashoffset 1s ease-in-out' }}
              />
            </svg>

            <div style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <span style={{ fontSize: '36px', fontWeight: 'bold', color: '#ffffff' }}>
                {result.percentage}%
              </span>
              <span style={{ fontSize: '13px', color: '#94a3b8', marginTop: '-4px' }}>
                {result.score} / {result.total} pts
              </span>
            </div>
          </div>

          <div style={{
            background: isPassed ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
            border: isPassed ? '1px solid #10b981' : '1px solid #ef4444',
            color: isPassed ? '#34d399' : '#f87171',
            padding: '8px 20px',
            borderRadius: '20px',
            fontWeight: 'bold',
            fontSize: '14px'
          }}>
            {isPassed ? '✔ Examen Réussi' : '✖ Non Validé'}
          </div>
        </div>

        {/* Détails du Score & Attestation */}
        <div style={{
          background: '#0f172a',
          border: '1px solid #1e293b',
          borderRadius: '20px',
          padding: '32px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#ffffff', margin: '0 0 12px 0' }}>
              Synthèse globale de la session
            </h2>
            <p style={{ fontSize: '14px', color: '#cbd5e1', lineHeight: '1.6', margin: 0 }}>
              {isPassed
                ? "Bravo ! Vous avez obtenu le score requis pour valider ce module. Votre attestation officielle du Club Blockchain Epitech Bénin est disponible ci-dessous."
                : "Vous n'avez pas atteint le seuil minimum de réussite de 60%. Vous pouvez réviser le cours et retenter l'examen ultérieurement."}
            </p>
          </div>

          {isPassed && (
            <div style={{ marginTop: '24px' }}>
              <button
                onClick={() => setShowCertificate(!showCertificate)}
                style={{
                  background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                  color: '#ffffff',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '10px',
                  fontWeight: 'bold',
                  fontSize: '14px',
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(99, 102, 241, 0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}
              >
                <span>📜</span> {showCertificate ? "Masquer l'attestation" : "Afficher l'attestation de réussite"}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Attestation de Réussite Générée */}
      {showCertificate && isPassed && (
        <div style={{
          background: '#ffffff',
          color: '#0f172a',
          borderRadius: '16px',
          padding: '40px',
          marginBottom: '36px',
          border: '8px double #6366f1',
          textAlign: 'center',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.6)'
        }}>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#4f46e5', margin: '0 0 8px 0', letterSpacing: '1px' }}>
            ATTESTATION DE RÉUSSITE WEBS3
          </h2>
          <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>Club Blockchain Epitech Bénin</p>

          <div style={{ margin: '32px 0' }}>
            <p style={{ fontSize: '15px', color: '#334155' }}>Ceci certifie que le membre a validé l'évaluation :</p>
            <h3 style={{ fontSize: '22px', fontWeight: 'bold', color: '#0f172a', margin: '8px 0' }}>
              {result.title}
            </h3>
            <p style={{ fontSize: '15px', color: '#334155' }}>
              Score obtenu : <strong style={{ color: '#10b981' }}>{result.percentage}%</strong> ({result.score}/{result.total})
            </p>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '40px', paddingTop: '20px', borderTop: '1px solid #e2e8f0', fontSize: '12px', color: '#64748b' }}>
            <div>Date d'émission : {result.date}</div>
            <div>Signé par : <strong>Le Bureau Exécutif</strong></div>
          </div>
        </div>
      )}

      {/* Correction Détillée des Questions */}
      <div style={{
        background: '#0f172a',
        border: '1px solid #1e293b',
        borderRadius: '20px',
        padding: '32px'
      }}>
        <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#ffffff', marginBottom: '24px' }}>
          Correction détaillée
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {result.questions && result.questions.map((q, idx) => {
            const userAnswer = result.answers[q.id];
            const isCorrect = userAnswer === q.correct;

            return (
              <div
                key={q.id}
                style={{
                  background: '#1e293b',
                  border: isCorrect ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid rgba(239, 68, 68, 0.4)',
                  borderRadius: '12px',
                  padding: '20px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <span style={{ fontWeight: 'bold', fontSize: '15px', color: '#ffffff' }}>
                    Question {idx + 1} : {q.question}
                  </span>
                  <span style={{
                    padding: '4px 12px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    background: isCorrect ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                    color: isCorrect ? '#34d399' : '#f87171'
                  }}>
                    {isCorrect ? '✔ Correct (+1 point)' : '✖ Incorrect (0 point)'}
                  </span>
                </div>

                <div style={{ fontSize: '14px', color: '#cbd5e1', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div>
                    <strong>Votre réponse : </strong>
                    <span style={{ color: isCorrect ? '#34d399' : '#f87171' }}>
                      {userAnswer !== undefined ? q.options[userAnswer] : "Pas de réponse"}
                    </span>
                  </div>
                  {!isCorrect && (
                    <div>
                      <strong>Bonne réponse : </strong>
                      <span style={{ color: '#34d399' }}>{q.options[q.correct]}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ExamResult;
