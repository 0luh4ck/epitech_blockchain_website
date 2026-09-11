import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const MOCK_QUESTIONS = [
  {
    id: 1,
    question: "Quel mécanisme de consensus est utilisé par Ethereum 2.0 (Proof of Stake) ?",
    options: [
      "Proof of Work (PoW)",
      "Proof of Stake (PoS)",
      "Delegated Proof of Stake (DPoS)",
      "Proof of Authority (PoA)"
    ],
    correct: 1
  },
  {
    id: 2,
    question: "Qu'est-ce qu'un Smart Contract ?",
    options: [
      "Un contrat juridique papier numérisé en PDF",
      "Un programme autonome exécuté sur une blockchain",
      "Un protocole réseau pour accélérer le Wi-Fi",
      "Une clé privée de chiffrement RSA"
    ],
    correct: 1
  },
  {
    id: 3,
    question: "Quel est le langage de programmation principal utilisé pour rédiger des Smart Contracts sur Ethereum ?",
    options: ["Solidity", "Python", "C++", "Ruby"],
    correct: 0
  },
  {
    id: 4,
    question: "Quelle est la taille maximale usuelle d'un bloc Bitcoin d'origine ?",
    options: ["1 MB", "10 MB", "100 KB", "1 GB"],
    correct: 0
  },
  {
    id: 5,
    question: "Qu'est-ce qu'une fonction de hachage cryptographique comme SHA-256 ?",
    options: ["Une fonction réversible de compression de fichiers", "Une fonction unidirectionnelle transformant toute donnée en une empreinte de taille fixe", "Un algorithme de hachage de mots de passe pour Windows", "Un protocole de routage IP"],
    correct: 1
  }
];

export const ExamImmersive = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const draftKey = `exam_draft_${id || '1'}`;

  // 45 minutes = 2700 secondes
  const [timeLeft, setTimeLeft] = useState(2700);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  // Sauvegarde automatique locale : restaure les réponses après déconnexion/rechargement
  const [answers, setAnswers] = useState(() => {
    try {
      const saved = localStorage.getItem(draftKey);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });
  const [restored, setRestored] = useState(() => {
    try {
      return !!localStorage.getItem(draftKey);
    } catch {
      return false;
    }
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const timerRef = useRef(null);

  // Compte à rebours 45:00
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, []);

  // Persiste chaque réponse localement à chaque modification
  useEffect(() => {
    try {
      localStorage.setItem(draftKey, JSON.stringify(answers));
    } catch {
      // Stockage indisponible : l'examen reste utilisable en mémoire
    }
  }, [answers, draftKey]);

  const handleSelectOption = (questionId, optionIndex) => {
    setAnswers(prev => ({ ...prev, [questionId]: optionIndex }));
    setRestored(false);
  };

  const calculateScore = () => {
    let score = 0;
    MOCK_QUESTIONS.forEach(q => {
      if (answers[q.id] === q.correct) {
        score += 1;
      }
    });
    return score;
  };

  const submitExam = () => {
    setIsSubmitting(true);
    const score = calculateScore();
    const total = MOCK_QUESTIONS.length;
    const percentage = Math.round((score / total) * 100);

    const resultData = {
      examId: id || '1',
      title: "Évaluation Fondamentaux Web3 & Smart Contracts",
      score,
      total,
      percentage,
      timeTaken: Math.round((2700 - timeLeft) / 60),
      answers,
      questions: MOCK_QUESTIONS,
      date: new Date().toLocaleDateString('fr-FR')
    };

    localStorage.setItem(`exam_result_${id || '1'}`, JSON.stringify(resultData));
    // Brouillon consommé : on le supprime après soumission
    try {
      localStorage.removeItem(draftKey);
    } catch {
      // Ignoré
    }

    setTimeout(() => {
      navigate(`/exams/${id || '1'}/result`);
    }, 800);
  };

  const handleAutoSubmit = () => {
    submitExam();
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const answeredCount = Object.keys(answers).length;
  const progressPercent = Math.round((answeredCount / MOCK_QUESTIONS.length) * 100);

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#070b14',
      color: '#f8fafc',
      fontFamily: 'Inter, sans-serif',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Barre supérieure d'examen immersif */}
      <header style={{
        backgroundColor: '#0f172a',
        borderBottom: '1px solid #1e293b',
        padding: '16px 32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            background: 'linear-gradient(135deg, #6366f1 0%, #3b82f6 100%)',
            padding: '8px 14px',
            borderRadius: '8px',
            fontWeight: 'bold',
            fontSize: '14px'
          }}>
            ⚡ MODE EXAMEN
          </div>
          <div>
            <h1 style={{ fontSize: '18px', fontWeight: 'bold', margin: 0, color: '#ffffff' }}>
              Évaluation Fondamentaux Web3 & Smart Contracts
            </h1>
            <p style={{ fontSize: '12px', color: '#94a3b8', margin: '2px 0 0 0' }}>
              Questions répondues : <strong style={{ color: '#38bdf8' }}>{answeredCount} / {MOCK_QUESTIONS.length}</strong>
            </p>
          </div>
        </div>

        {/* Chronomètre immersif 45:00 */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          background: timeLeft < 300 ? 'rgba(239, 68, 68, 0.15)' : '#1e293b',
          border: timeLeft < 300 ? '1px solid #ef4444' : '1px solid #334155',
          padding: '8px 20px',
          borderRadius: '30px'
        }}>
          <span style={{ fontSize: '18px' }}>⏱️</span>
          <span style={{
            fontSize: '22px',
            fontWeight: 'bold',
            fontFamily: 'monospace',
            color: timeLeft < 300 ? '#f87171' : '#38bdf8'
          }}>
            {formatTime(timeLeft)}
          </span>
        </div>
      </header>

      {/* Barre de progression globale */}
      <div style={{ width: '100%', height: '4px', backgroundColor: '#1e293b' }}>
        <div style={{
          height: '100%',
          width: `${progressPercent}%`,
          background: 'linear-gradient(90deg, #6366f1 0%, #38bdf8 100%)',
          transition: 'width 0.3s ease'
        }} />
      </div>

      {/* Brouillon restauré après interruption (sauvegarde locale auto) */}
      {restored && answeredCount > 0 && (
        <div role="status" style={{
          margin: '12px auto 0',
          maxWidth: '1100px',
          width: 'calc(100% - 40px)',
          background: 'rgba(16, 185, 129, 0.12)',
          border: '1px solid #10b981',
          color: '#a7f3d0',
          padding: '10px 16px',
          borderRadius: '12px',
          fontSize: '13px'
        }}>
          💾 Vos {answeredCount} réponse{answeredCount > 1 ? 's' : ''} précédente{answeredCount > 1 ? 's' : ''} ont été restaurées automatiquement.
        </div>
      )}

      {/* Contenu principal */}
      <div style={{
        flex: 1,
        maxWidth: '1100px',
        width: '100%',
        margin: '0 auto',
        padding: 'clamp(16px, 4vw, 32px) clamp(12px, 3vw, 20px)',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))',
        gap: 'clamp(16px, 4vw, 32px)'
      }}>
        {/* Carte Question courante */}
        <main>
          <div style={{
            background: '#0f172a',
            border: '1px solid #1e293b',
            borderRadius: '16px',
            padding: '32px',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '20px'
            }}>
              <span style={{
                background: '#1e293b',
                color: '#818cf8',
                padding: '6px 14px',
                borderRadius: '20px',
                fontSize: '13px',
                fontWeight: 'bold'
              }}>
                Question {currentQuestion + 1} sur {MOCK_QUESTIONS.length}
              </span>
              <span style={{ fontSize: '13px', color: '#64748b' }}>1 point</span>
            </div>

            <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#ffffff', marginBottom: '28px', lineHeight: '1.5' }}>
              {MOCK_QUESTIONS[currentQuestion].question}
            </h2>

            {/* Options QCM */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {MOCK_QUESTIONS[currentQuestion].options.map((opt, idx) => {
                const isSelected = answers[MOCK_QUESTIONS[currentQuestion].id] === idx;
                return (
                  <div
                    key={idx}
                    onClick={() => handleSelectOption(MOCK_QUESTIONS[currentQuestion].id, idx)}
                    style={{
                      padding: '16px 20px',
                      borderRadius: '12px',
                      background: isSelected ? 'rgba(99, 102, 241, 0.15)' : '#1e293b',
                      border: isSelected ? '2px solid #6366f1' : '1px solid #334155',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '16px',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <div style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      background: isSelected ? '#6366f1' : '#0f172a',
                      border: isSelected ? 'none' : '1px solid #475569',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#ffffff',
                      fontSize: '13px',
                      fontWeight: 'bold'
                    }}>
                      {String.fromCharCode(65 + idx)}
                    </div>
                    <span style={{ fontSize: '15px', color: isSelected ? '#ffffff' : '#cbd5e1' }}>
                      {opt}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Boutons de Navigation */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: '36px',
              paddingTop: '24px',
              borderTop: '1px solid #1e293b'
            }}>
              <button
                disabled={currentQuestion === 0}
                onClick={() => setCurrentQuestion(prev => prev - 1)}
                style={{
                  padding: '10px 20px',
                  borderRadius: '8px',
                  background: '#1e293b',
                  border: '1px solid #334155',
                  color: currentQuestion === 0 ? '#475569' : '#ffffff',
                  cursor: currentQuestion === 0 ? 'not-allowed' : 'pointer'
                }}
              >
                ← Question précédente
              </button>

              {currentQuestion < MOCK_QUESTIONS.length - 1 ? (
                <button
                  onClick={() => setCurrentQuestion(prev => prev + 1)}
                  style={{
                    padding: '10px 24px',
                    borderRadius: '8px',
                    background: '#6366f1',
                    border: 'none',
                    color: '#ffffff',
                    fontWeight: 'bold',
                    cursor: 'pointer'
                  }}
                >
                  Question suivante →
                </button>
              ) : (
                <button
                  onClick={() => setShowConfirmModal(true)}
                  style={{
                    padding: '10px 24px',
                    borderRadius: '8px',
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    border: 'none',
                    color: '#ffffff',
                    fontWeight: 'bold',
                    cursor: 'pointer'
                  }}
                >
                  Terminer et soumettre
                </button>
              )}
            </div>
          </div>
        </main>

        {/* Palette latérale des questions */}
        <aside>
          <div style={{
            background: '#0f172a',
            border: '1px solid #1e293b',
            borderRadius: '16px',
            padding: '24px',
            position: 'sticky',
            top: '100px'
          }}>
            <h3 style={{ fontSize: '15px', fontWeight: 'bold', margin: '0 0 16px 0', color: '#cbd5e1' }}>
              Aperçu des questions
            </h3>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(5, 1fr)',
              gap: '10px',
              marginBottom: '24px'
            }}>
              {MOCK_QUESTIONS.map((q, idx) => {
                const isAnswered = answers[q.id] !== undefined;
                const isCurrent = currentQuestion === idx;
                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentQuestion(idx)}
                    style={{
                      height: '40px',
                      borderRadius: '8px',
                      background: isCurrent ? '#6366f1' : isAnswered ? 'rgba(16, 185, 129, 0.2)' : '#1e293b',
                      border: isCurrent ? '2px solid #818cf8' : isAnswered ? '1px solid #10b981' : '1px solid #334155',
                      color: isCurrent ? '#ffffff' : isAnswered ? '#34d399' : '#94a3b8',
                      fontWeight: 'bold',
                      cursor: 'pointer'
                    }}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setShowConfirmModal(true)}
              style={{
                width: '100%',
                padding: '12px',
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                border: 'none',
                borderRadius: '8px',
                color: '#ffffff',
                fontWeight: 'bold',
                fontSize: '14px',
                cursor: 'pointer'
              }}
            >
              Soumettre l'examen
            </button>
          </div>
        </aside>
      </div>

      {/* Modal de confirmation de soumission */}
      {showConfirmModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 999
        }}>
          <div style={{
            background: '#0f172a',
            border: '1px solid #334155',
            borderRadius: '16px',
            padding: '28px',
            maxWidth: '420px',
            width: '100%',
            textAlign: 'center'
          }}>
            <h3 style={{ fontSize: '20px', fontWeight: 'bold', margin: '0 0 12px 0', color: '#ffffff' }}>
              Soumettre votre examen ?
            </h3>
            <p style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '24px' }}>
              Vous avez répondu à <strong>{answeredCount}</strong> sur <strong>{MOCK_QUESTIONS.length}</strong> questions.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button
                onClick={() => setShowConfirmModal(false)}
                style={{
                  padding: '10px 20px',
                  borderRadius: '8px',
                  background: '#1e293b',
                  border: '1px solid #475569',
                  color: '#ffffff',
                  cursor: 'pointer'
                }}
              >
                Continuer l'examen
              </button>
              <button
                onClick={submitExam}
                disabled={isSubmitting}
                style={{
                  padding: '10px 24px',
                  borderRadius: '8px',
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  border: 'none',
                  color: '#ffffff',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                {isSubmitting ? 'Validation...' : 'Confirmer et Soumettre'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExamImmersive;
