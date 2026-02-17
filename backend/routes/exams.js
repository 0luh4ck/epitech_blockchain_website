import express from 'express';
import { query } from '../config/database.js';
import { authenticateToken, requireExecutive } from '../middleware/auth.js';
import { validateExam, handleValidationErrors } from '../middleware/validation.js';

const router = express.Router();

// @route   GET /api/exams
// @desc    Obtenir la liste des examens
// @access  Private (Membres)
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 10, status = 'active' } = req.query;
    const offset = (page - 1) * limit;
    const userId = req.user.id;

    let whereClause = 'WHERE 1=1';
    let params = [];

    if (status === 'active') {
      whereClause += ' AND is_active = true AND (start_date IS NULL OR start_date <= NOW()) AND (end_date IS NULL OR end_date >= NOW())';
    }

    // Compter le total
    const countResult = await query(
      `SELECT COUNT(*) as total FROM exams ${whereClause}`,
      params
    );
    const total = countResult[0].total;

    // Récupérer les examens avec les résultats de l'utilisateur
    const exams = await query(
      `SELECT e.*, u.first_name as creator_first_name, u.last_name as creator_last_name,
              er.id as result_id, er.score, er.status as result_status, er.attempt_number, er.completed_at
       FROM exams e
       LEFT JOIN users u ON e.created_by = u.id
       LEFT JOIN exam_results er ON e.id = er.exam_id AND er.user_id = ?
       ${whereClause}
       ORDER BY e.created_at DESC
       LIMIT ? OFFSET ?`,
      [userId, ...params, parseInt(limit), offset]
    );

    res.json({
      success: true,
      data: {
        exams: exams.map(exam => ({
          id: exam.id,
          title: exam.title,
          description: exam.description,
          instructions: exam.instructions,
          durationMinutes: exam.duration_minutes,
          maxAttempts: exam.max_attempts,
          passingScore: exam.passing_score,
          isActive: exam.is_active,
          startDate: exam.start_date,
          endDate: exam.end_date,
          creator: {
            firstName: exam.creator_first_name,
            lastName: exam.creator_last_name
          },
          result: exam.result_id ? {
            id: exam.result_id,
            score: exam.score,
            status: exam.result_status,
            attemptNumber: exam.attempt_number,
            completedAt: exam.completed_at
          } : null,
          createdAt: exam.created_at,
          updatedAt: exam.updated_at
        })),
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des examens:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des examens'
    });
  }
});

// @route   GET /api/exams/:id
// @desc    Obtenir un examen par ID
// @access  Private (Membres)
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const exams = await query(
      'SELECT * FROM exams WHERE id = ? AND is_active = true',
      [id]
    );

    if (exams.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Examen non trouvé'
      });
    }

    const exam = exams[0];

    // Vérifier les dates
    if (exam.start_date && new Date(exam.start_date) > new Date()) {
      return res.status(400).json({
        success: false,
        message: 'Cet examen n\'est pas encore disponible'
      });
    }

    if (exam.end_date && new Date(exam.end_date) < new Date()) {
      return res.status(400).json({
        success: false,
        message: 'Cet examen n\'est plus disponible'
      });
    }

    // Récupérer les questions
    const questions = await query(
      'SELECT id, question_text, question_type, options, points, order_index FROM exam_questions WHERE exam_id = ? ORDER BY order_index ASC',
      [id]
    );

    // Récupérer les résultats existants
    const results = await query(
      'SELECT * FROM exam_results WHERE user_id = ? AND exam_id = ? ORDER BY attempt_number DESC',
      [userId, id]
    );

    // Vérifier le nombre de tentatives
    const canTakeExam = !exam.max_attempts || results.length < exam.max_attempts;
    const hasPassed = results.some(result => result.status === 'passed');

    res.json({
      success: true,
      data: {
        exam: {
          id: exam.id,
          title: exam.title,
          description: exam.description,
          instructions: exam.instructions,
          durationMinutes: exam.duration_minutes,
          maxAttempts: exam.max_attempts,
          passingScore: exam.passing_score,
          startDate: exam.start_date,
          endDate: exam.end_date,
          questions: questions.map(q => ({
            id: q.id,
            questionText: q.question_text,
            questionType: q.question_type,
            options: q.options ? JSON.parse(q.options) : null,
            points: q.points,
            orderIndex: q.order_index
          })),
          canTakeExam,
          hasPassed,
          attempts: results.map(r => ({
            id: r.id,
            score: r.score,
            percentage: r.percentage,
            status: r.status,
            attemptNumber: r.attempt_number,
            startedAt: r.started_at,
            completedAt: r.completed_at,
            timeTakenMinutes: r.time_taken_minutes
          }))
        }
      }
    });
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'examen:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération de l\'examen'
    });
  }
});

// @route   POST /api/exams
// @desc    Créer un nouvel examen
// @access  Private (Executive/Admin)
router.post('/', authenticateToken, requireExecutive, validateExam, async (req, res) => {
  try {
    const {
      title,
      description,
      instructions,
      durationMinutes,
      maxAttempts = 1,
      passingScore = 60,
      startDate,
      endDate,
      questions
    } = req.body;

    // Commencer une transaction
    const connection = await query('START TRANSACTION');

    try {
      // Créer l'examen
      const examResult = await query(
        `INSERT INTO exams (title, description, instructions, duration_minutes, max_attempts, passing_score, start_date, end_date, created_by)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [title, description, instructions, durationMinutes, maxAttempts, passingScore, startDate, endDate, req.user.id]
      );

      const examId = examResult.insertId;

      // Ajouter les questions
      if (questions && questions.length > 0) {
        for (let i = 0; i < questions.length; i++) {
          const question = questions[i];
          await query(
            `INSERT INTO exam_questions (exam_id, question_text, question_type, options, correct_answer, points, order_index)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
              examId,
              question.questionText,
              question.questionType,
              question.options ? JSON.stringify(question.options) : null,
              question.correctAnswer,
              question.points || 1,
              i + 1
            ]
          );
        }
      }

      await query('COMMIT');

      // Récupérer l'examen créé
      const newExam = await query('SELECT * FROM exams WHERE id = ?', [examId]);

      res.status(201).json({
        success: true,
        message: 'Examen créé avec succès',
        data: {
          exam: {
            id: newExam[0].id,
            title: newExam[0].title,
            description: newExam[0].description,
            instructions: newExam[0].instructions,
            durationMinutes: newExam[0].duration_minutes,
            maxAttempts: newExam[0].max_attempts,
            passingScore: newExam[0].passing_score,
            isActive: newExam[0].is_active,
            startDate: newExam[0].start_date,
            endDate: newExam[0].end_date,
            createdAt: newExam[0].created_at,
            updatedAt: newExam[0].updated_at
          }
        }
      });
    } catch (error) {
      await query('ROLLBACK');
      throw error;
    }
  } catch (error) {
    console.error('Erreur lors de la création de l\'examen:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création de l\'examen'
    });
  }
});

// @route   POST /api/exams/:id/start
// @desc    Commencer un examen
// @access  Private (Membres)
router.post('/:id/start', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Vérifier que l'examen existe et est actif
    const exam = await query(
      'SELECT * FROM exams WHERE id = ? AND is_active = true',
      [id]
    );

    if (exam.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Examen non trouvé'
      });
    }

    const examData = exam[0];

    // Vérifier les dates
    if (examData.start_date && new Date(examData.start_date) > new Date()) {
      return res.status(400).json({
        success: false,
        message: 'Cet examen n\'est pas encore disponible'
      });
    }

    if (examData.end_date && new Date(examData.end_date) < new Date()) {
      return res.status(400).json({
        success: false,
        message: 'Cet examen n\'est plus disponible'
      });
    }

    // Vérifier le nombre de tentatives
    const existingResults = await query(
      'SELECT COUNT(*) as count FROM exam_results WHERE user_id = ? AND exam_id = ?',
      [userId, id]
    );

    if (examData.max_attempts && existingResults[0].count >= examData.max_attempts) {
      return res.status(400).json({
        success: false,
        message: 'Vous avez atteint le nombre maximum de tentatives'
      });
    }

    // Vérifier s'il y a un examen en cours
    const inProgressResult = await query(
      'SELECT id FROM exam_results WHERE user_id = ? AND exam_id = ? AND status = "in_progress"',
      [userId, id]
    );

    if (inProgressResult.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Vous avez déjà un examen en cours'
      });
    }

    // Créer un nouveau résultat d'examen
    const attemptNumber = existingResults[0].count + 1;
    const result = await query(
      'INSERT INTO exam_results (user_id, exam_id, status, started_at, attempt_number) VALUES (?, ?, ?, NOW(), ?)',
      [userId, id, 'in_progress', attemptNumber]
    );

    res.status(201).json({
      success: true,
      message: 'Examen démarré avec succès',
      data: {
        resultId: result.insertId,
        attemptNumber,
        durationMinutes: examData.duration_minutes
      }
    });
  } catch (error) {
    console.error('Erreur lors du démarrage de l\'examen:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors du démarrage de l\'examen'
    });
  }
});

// @route   POST /api/exams/:id/submit
// @desc    Soumettre les réponses d'un examen
// @access  Private (Membres)
router.post('/:id/submit', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { answers, resultId } = req.body;
    const userId = req.user.id;

    // Vérifier que le résultat existe et appartient à l'utilisateur
    const result = await query(
      'SELECT * FROM exam_results WHERE id = ? AND user_id = ? AND exam_id = ? AND status = "in_progress"',
      [resultId, userId, id]
    );

    if (result.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Résultat d\'examen non trouvé ou déjà soumis'
      });
    }

    // Récupérer l'examen et les questions
    const exam = await query('SELECT * FROM exams WHERE id = ?', [id]);
    const questions = await query(
      'SELECT id, correct_answer, points FROM exam_questions WHERE exam_id = ?',
      [id]
    );

    // Calculer le score
    let totalScore = 0;
    let totalPoints = 0;
    const scoredAnswers = {};

    for (const question of questions) {
      totalPoints += question.points;
      const userAnswer = answers[question.id];
      
      if (userAnswer !== undefined) {
        scoredAnswers[question.id] = userAnswer;
        
        // Comparer avec la réponse correcte
        if (userAnswer === question.correct_answer) {
          totalScore += question.points;
        }
      }
    }

    const percentage = totalPoints > 0 ? (totalScore / totalPoints) * 100 : 0;
    const status = percentage >= exam[0].passing_score ? 'passed' : 'failed';

    // Calculer le temps pris
    const startTime = new Date(result[0].started_at);
    const endTime = new Date();
    const timeTakenMinutes = Math.round((endTime - startTime) / 60000);

    // Mettre à jour le résultat
    await query(
      `UPDATE exam_results SET 
       score = ?, total_points = ?, percentage = ?, status = ?, 
       completed_at = NOW(), time_taken_minutes = ?, answers = ?
       WHERE id = ?`,
      [totalScore, totalPoints, percentage, status, timeTakenMinutes, JSON.stringify(scoredAnswers), resultId]
    );

    res.json({
      success: true,
      message: 'Examen soumis avec succès',
      data: {
        score: totalScore,
        totalPoints,
        percentage: Math.round(percentage * 100) / 100,
        status,
        timeTakenMinutes
      }
    });
  } catch (error) {
    console.error('Erreur lors de la soumission de l\'examen:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la soumission de l\'examen'
    });
  }
});

// @route   GET /api/exams/:id/results
// @desc    Obtenir les résultats d'un examen
// @access  Private (Membres)
router.get('/:id/results', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const results = await query(
      'SELECT * FROM exam_results WHERE user_id = ? AND exam_id = ? ORDER BY attempt_number DESC',
      [userId, id]
    );

    if (results.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Aucun résultat trouvé pour cet examen'
      });
    }

    res.json({
      success: true,
      data: {
        results: results.map(result => ({
          id: result.id,
          score: result.score,
          totalPoints: result.total_points,
          percentage: result.percentage,
          status: result.status,
          attemptNumber: result.attempt_number,
          startedAt: result.started_at,
          completedAt: result.completed_at,
          timeTakenMinutes: result.time_taken_minutes,
          answers: result.answers ? JSON.parse(result.answers) : null
        }))
      }
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des résultats:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des résultats'
    });
  }
});

export default router;
