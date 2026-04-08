import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Phone, MapPin, Save, Edit3, Lock, Eye, EyeOff } from 'lucide-react';
import { toast } from 'react-hot-toast';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm({
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      phone: user?.phone || '',
      bio: user?.bio || ''
    }
  });

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    reset: resetPassword,
    formState: { errors: passwordErrors, isSubmitting: isSubmittingPassword }
  } = useForm();

  const onSubmit = async (data) => {
    try {
      await updateProfile(data);
      setIsEditing(false);
      toast.success('Profil mis à jour avec succès');
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      toast.error('Erreur lors de la mise à jour du profil');
    }
  };

  const onChangePassword = async (data) => {
    try {
      const { authService } = await import('../services/auth');
      await authService.changePassword(data.currentPassword, data.newPassword);
      toast.success('Mot de passe modifié avec succès');
      resetPassword();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erreur lors du changement de mot de passe');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Mon Profil
              </h1>
              <p className="text-gray-600">
                Gérez vos informations personnelles
              </p>
            </div>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center"
            >
              <Edit3 className="w-4 h-4 mr-2" />
              {isEditing ? 'Annuler' : 'Modifier'}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-center">
                <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <User className="w-12 h-12 text-gray-400" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-1">
                  {user?.firstName} {user?.lastName}
                </h2>
                <p className="text-green-600 font-medium mb-2">
                  {user?.position || user?.role}
                </p>
                <p className="text-gray-600 text-sm">
                  Membre depuis {new Date(user?.createdAt).toLocaleDateString('fr-FR')}
                </p>
              </div>
            </div>
          </div>

          {/* Profile Form */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-lg shadow p-6">
              {/* Profile Form (unchanged structure) ... */}
              <h3 className="text-lg font-semibold text-gray-900 mb-6">
                Informations Personnelles
              </h3>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Prénom
                    </label>
                    <input
                      {...register('firstName', { required: 'Le prénom est requis' })}
                      type="text"
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-100"
                    />
                    {errors.firstName && (
                      <p className="text-red-600 text-sm mt-1">{errors.firstName.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nom
                    </label>
                    <input
                      {...register('lastName', { required: 'Le nom est requis' })}
                      type="text"
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-100"
                    />
                    {errors.lastName && (
                      <p className="text-red-600 text-sm mt-1">{errors.lastName.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={user?.email || ''}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-500"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    L'email ne peut pas être modifié
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Téléphone
                  </label>
                  <input
                    {...register('phone')}
                    type="tel"
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-100"
                    placeholder="+229 XX XX XX XX"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bio
                  </label>
                  <textarea
                    {...register('bio')}
                    rows={4}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-100"
                    placeholder="Parlez-nous de vous..."
                  />
                </div>

                {isEditing && (
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      {isSubmitting ? 'Sauvegarde...' : 'Sauvegarder'}
                    </button>
                  </div>
                )}
              </form>
            </div>

            {/* Change Password Section */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                <Lock className="w-5 h-5 mr-2 text-green-600" />
                Changer le mot de passe
              </h3>

              <form onSubmit={handleSubmitPassword(onChangePassword)} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mot de passe actuel
                  </label>
                  <div className="relative">
                    <input
                      {...registerPassword('currentPassword', { required: 'Requis' })}
                      type={showCurrentPassword ? 'text' : 'password'}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                    >
                      {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {passwordErrors.currentPassword && (
                    <p className="text-red-600 text-sm mt-1">{passwordErrors.currentPassword.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nouveau mot de passe
                  </label>
                  <div className="relative">
                    <input
                      {...registerPassword('newPassword', {
                        required: 'Requis',
                        minLength: { value: 6, message: 'Au moins 6 caractères' }
                      })}
                      type={showNewPassword ? 'text' : 'password'}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                    >
                      {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {passwordErrors.newPassword && (
                    <p className="text-red-600 text-sm mt-1">{passwordErrors.newPassword.message}</p>
                  )}
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={isSubmittingPassword}
                    className="bg-gray-800 text-white px-6 py-2 rounded-lg hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-800 focus:ring-offset-2 disabled:opacity-50 transition-colors"
                  >
                    {isSubmittingPassword ? 'Mise à jour...' : 'Mettre à jour le mot de passe'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
