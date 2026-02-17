import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Mail, User, Phone, FileText, Send, CheckCircle } from 'lucide-react';
import { ROUTES } from '../../utils/constants';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';

const MembershipRequest = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      await api.post('/membership-requests', data);
      setIsSubmitted(true);
      toast.success('Demande d\'adhésion soumise avec succès !');
    } catch (error) {
      console.error('Erreur lors de la soumission de la demande:', error);
      toast.error('Erreur lors de la soumission de la demande. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="mx-auto h-16 w-16 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center mb-6">
              <CheckCircle className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-3xl font-extrabold text-white mb-4">
              Demande soumise !
            </h2>
            <p className="text-gray-300 mb-8">
              Votre demande d'adhésion a été soumise avec succès. 
              Nos administrateurs l'examineront et vous contacteront bientôt.
            </p>
            <Link
              to={ROUTES.HOME}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200"
            >
              Retour à l'accueil
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto h-12 w-12 bg-gradient-to-r from-green-500 to-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">E</span>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
            Demande d'adhésion
          </h2>
          <p className="mt-2 text-center text-sm text-gray-300">
            Rejoignez le Club Blockchain Epitech Bénin
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            {/* First Name */}
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-300">
                Prénom
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  {...register('firstName', {
                    required: 'Le prénom est requis',
                    minLength: {
                      value: 2,
                      message: 'Le prénom doit contenir au moins 2 caractères'
                    },
                    maxLength: {
                      value: 50,
                      message: 'Le prénom ne doit pas dépasser 50 caractères'
                    }
                  })}
                  type="text"
                  className="appearance-none rounded-md relative block w-full pl-10 pr-3 py-2 border border-gray-600 bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                  placeholder="Votre prénom"
                />
              </div>
              {errors.firstName && (
                <p className="mt-1 text-sm text-red-400">{errors.firstName.message}</p>
              )}
            </div>

            {/* Last Name */}
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-300">
                Nom
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  {...register('lastName', {
                    required: 'Le nom est requis',
                    minLength: {
                      value: 2,
                      message: 'Le nom doit contenir au moins 2 caractères'
                    },
                    maxLength: {
                      value: 50,
                      message: 'Le nom ne doit pas dépasser 50 caractères'
                    }
                  })}
                  type="text"
                  className="appearance-none rounded-md relative block w-full pl-10 pr-3 py-2 border border-gray-600 bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                  placeholder="Votre nom"
                />
              </div>
              {errors.lastName && (
                <p className="mt-1 text-sm text-red-400">{errors.lastName.message}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                Adresse email
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  {...register('email', {
                    required: 'L\'email est requis',
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: 'Format d\'email invalide'
                    }
                  })}
                  type="email"
                  className="appearance-none rounded-md relative block w-full pl-10 pr-3 py-2 border border-gray-600 bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                  placeholder="votre@email.com"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-400">{errors.email.message}</p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-300">
                Téléphone (optionnel)
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  {...register('phone', {
                    pattern: {
                      value: /^(\+229|229)?[0-9]{8}$/,
                      message: 'Format de téléphone invalide'
                    }
                  })}
                  type="tel"
                  className="appearance-none rounded-md relative block w-full pl-10 pr-3 py-2 border border-gray-600 bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                  placeholder="+229 XX XX XX XX"
                />
              </div>
              {errors.phone && (
                <p className="mt-1 text-sm text-red-400">{errors.phone.message}</p>
              )}
            </div>

            {/* Student ID */}
            <div>
              <label htmlFor="studentId" className="block text-sm font-medium text-gray-300">
                Identifiant étudiant (optionnel)
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  {...register('studentId', {
                    minLength: {
                      value: 3,
                      message: 'L\'identifiant doit contenir au moins 3 caractères'
                    },
                    maxLength: {
                      value: 20,
                      message: 'L\'identifiant ne doit pas dépasser 20 caractères'
                    }
                  })}
                  type="text"
                  className="appearance-none rounded-md relative block w-full pl-10 pr-3 py-2 border border-gray-600 bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                  placeholder="Votre identifiant étudiant"
                />
              </div>
              {errors.studentId && (
                <p className="mt-1 text-sm text-red-400">{errors.studentId.message}</p>
              )}
            </div>

            {/* Motivation */}
            <div>
              <label htmlFor="motivation" className="block text-sm font-medium text-gray-300">
                Motivation (optionnel)
              </label>
              <div className="mt-1 relative">
                <div className="absolute top-3 left-3 pointer-events-none">
                  <FileText className="h-5 w-5 text-gray-400" />
                </div>
                <textarea
                  {...register('motivation', {
                    maxLength: {
                      value: 1000,
                      message: 'La motivation ne doit pas dépasser 1000 caractères'
                    }
                  })}
                  rows={4}
                  className="appearance-none rounded-md relative block w-full pl-10 pr-3 py-2 border border-gray-600 bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm resize-none"
                  placeholder="Pourquoi souhaitez-vous rejoindre le Club Blockchain Epitech ?"
                />
              </div>
              {errors.motivation && (
                <p className="mt-1 text-sm text-red-400">{errors.motivation.message}</p>
              )}
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {isSubmitting ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <>
                  <Send className="h-5 w-5 mr-2" />
                  Soumettre la demande
                </>
              )}
            </button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-400">
              Déjà membre ?{' '}
              <Link
                to={ROUTES.LOGIN}
                className="font-medium text-green-400 hover:text-green-300"
              >
                Se connecter
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MembershipRequest;
