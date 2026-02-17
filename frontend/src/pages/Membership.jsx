import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { CheckCircle, Users, Calendar, Award, Globe } from 'lucide-react';
import { membershipService } from '../services/membership';
import toast from 'react-hot-toast';

const Membership = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm();

  const benefits = [
    {
      icon: Users,
      title: 'Communauté Active',
      description: 'Rejoignez une communauté de plus de 30 étudiants passionnés par la blockchain'
    },
    {
      icon: Calendar,
      title: 'Événements Exclusifs',
      description: 'Accès prioritaire à nos séminaires, conférences et ateliers'
    },
    {
      icon: Award,
      title: 'Certifications',
      description: 'Obtenez des certifications reconnues et validez vos compétences'
    },
    {
      icon: Globe,
      title: 'Réseau Professionnel',
      description: 'Connectez-vous avec des professionnels et des experts du secteur'
    }
  ];

  const onSubmit = async (data) => {
    try {
      await membershipService.submitApplication(data);
      setIsSubmitted(true);
      toast.success('Demande d\'adhésion soumise avec succès !');
    } catch (error) {
      toast.error('Erreur lors de la soumission de votre demande');
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Demande Soumise avec Succès !
            </h1>
            <p className="text-lg text-gray-600 mb-6">
              Merci pour votre intérêt à rejoindre le Club Blockchain d'Epitech Bénin. 
              Votre demande d'adhésion a été transmise à notre équipe.
            </p>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <p className="text-green-800">
                <strong>Prochaines étapes :</strong><br />
                • Notre équipe examinera votre demande dans les 48h<br />
                • Vous recevrez un email de confirmation<br />
                • Si approuvée, vous recevrez vos identifiants de connexion
              </p>
            </div>
            <button
              onClick={() => setIsSubmitted(false)}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              Soumettre une autre demande
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Rejoindre le Club Blockchain
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Devenez membre de notre communauté et participez à la révolution blockchain au Bénin
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Benefits */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Pourquoi Rejoindre Notre Club ?
            </h2>
            <div className="space-y-6">
              {benefits.map((benefit, index) => {
                const Icon = benefit.icon;
                return (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {benefit.title}
                      </h3>
                      <p className="text-gray-600">
                        {benefit.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">
                Conditions d'Adhésion
              </h3>
              <ul className="text-blue-800 space-y-1">
                <li>• Être étudiant d'Epitech Bénin ou partenaire</li>
                <li>• Avoir un intérêt pour la blockchain et les technologies émergentes</li>
                <li>• S'engager à participer activement aux activités du club</li>
                <li>• Respecter les valeurs et l'éthique du club</li>
              </ul>
            </div>
          </div>

          {/* Application Form */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Formulaire d'Adhésion
            </h2>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Personal Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Prénom *
                  </label>
                  <input
                    {...register('firstName', {
                      required: 'Le prénom est requis',
                      minLength: { value: 2, message: 'Minimum 2 caractères' }
                    })}
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Votre prénom"
                  />
                  {errors.firstName && (
                    <p className="text-red-600 text-sm mt-1">{errors.firstName.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nom *
                  </label>
                  <input
                    {...register('lastName', {
                      required: 'Le nom est requis',
                      minLength: { value: 2, message: 'Minimum 2 caractères' }
                    })}
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Votre nom"
                  />
                  {errors.lastName && (
                    <p className="text-red-600 text-sm mt-1">{errors.lastName.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  {...register('email', {
                    required: 'L\'email est requis',
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: 'Format d\'email invalide'
                    }
                  })}
                  type="email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="votre@email.com"
                />
                {errors.email && (
                  <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Téléphone
                  </label>
                  <input
                    {...register('phone', {
                      pattern: {
                        value: /^(\+229|229)?[0-9]{8}$/,
                        message: 'Format de téléphone invalide'
                      }
                    })}
                    type="tel"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="+229 XX XX XX XX"
                  />
                  {errors.phone && (
                    <p className="text-red-600 text-sm mt-1">{errors.phone.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Identifiant Étudiant(Promotion)
                  </label>
                  <input
                    {...register('studentId', {
                      minLength: { value: 3, message: 'Minimum 3 caractères' }
                    })}
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Votre identifiant"
                  />
                  {errors.studentId && (
                    <p className="text-red-600 text-sm mt-1">{errors.studentId.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Motivation *
                </label>
                <textarea
                  {...register('motivation', {
                    required: 'La motivation est requise',
                    minLength: { value: 50, message: 'Minimum 50 caractères' },
                    maxLength: { value: 1000, message: 'Maximum 1000 caractères' }
                  })}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Expliquez pourquoi vous souhaitez rejoindre le club et ce que vous espérez y apporter..."
                />
                {errors.motivation && (
                  <p className="text-red-600 text-sm mt-1">{errors.motivation.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Expérience (optionnel)
                </label>
                <textarea
                  {...register('experience', {
                    maxLength: { value: 500, message: 'Maximum 500 caractères' }
                  })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Décrivez votre expérience en blockchain, programmation ou technologies émergentes..."
                />
                {errors.experience && (
                  <p className="text-red-600 text-sm mt-1">{errors.experience.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Centres d'Intérêt (optionnel)
                </label>
                <textarea
                  {...register('interests', {
                    maxLength: { value: 300, message: 'Maximum 300 caractères' }
                  })}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Quels aspects de la blockchain vous intéressent le plus ? (DeFi, NFT, Smart Contracts, etc.)"
                />
                {errors.interests && (
                  <p className="text-red-600 text-sm mt-1">{errors.interests.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? 'Soumission en cours...' : 'Soumettre ma Demande'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Membership;
