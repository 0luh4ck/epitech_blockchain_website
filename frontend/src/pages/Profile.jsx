import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Phone, MapPin, Save, Edit3, Lock, Eye, EyeOff, Shield, Award } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import BlockchainCard from '../components/BlockchainCard';
import BlockchainButton from '../components/BlockchainButton';

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
    <div className="min-h-screen bg-[#050505] text-white pt-24 pb-12">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center justify-between gap-6"
        >
          <div>
            <h1 className="text-3xl md:text-4xl font-black mb-2 tracking-tight">
              Mon <span className="text-gradient-web3">Profil</span>
            </h1>
            <p className="text-gray-400 font-medium">
              Gérez vos informations personnelles et votre sécurité.
            </p>
          </div>
          <BlockchainButton
            onClick={() => setIsEditing(!isEditing)}
            className="w-full md:w-auto"
          >
            <Edit3 className="w-4 h-4 mr-2" />
            {isEditing ? 'Annuler' : 'Modifier le Profil'}
          </BlockchainButton>
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Profile Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-4"
          >
            <BlockchainCard className="text-center group sticky top-28">
              <div className="relative inline-block mb-6">
                <div className="w-28 h-28 bg-primary-500/10 rounded-2xl flex items-center justify-center border border-primary-500/20 group-hover:border-primary-500/50 transition-colors">
                  <User className="w-14 h-14 text-primary-400 group-hover:text-primary-300 transition-colors" />
                </div>
                <div className="absolute -bottom-2 -right-2 bg-secondary-500 rounded-lg p-2 border-2 border-[#050505]">
                  <Shield className="w-4 h-4 text-white" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-white mb-1">
                {user?.firstName} {user?.lastName}
              </h2>
              <div className="flex items-center justify-center gap-2 mb-4">
                <span className="px-3 py-1 text-xs font-bold rounded-full bg-primary-500/10 text-primary-400 border border-primary-500/30">
                  {user?.role?.toUpperCase()}
                </span>
                {user?.position && (
                  <span className="px-3 py-1 text-xs font-bold rounded-full bg-secondary-500/10 text-secondary-400 border border-secondary-500/30">
                    {user?.position}
                  </span>
                )}
              </div>
              <div className="pt-6 border-t border-white/5 space-y-4">
                <div className="flex items-center justify-center gap-2 text-sm text-gray-400 font-medium">
                  <Award className="w-4 h-4 text-secondary-500" />
                  Membre depuis {new Date(user?.createdAt).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long' })}
                </div>
              </div>
            </BlockchainCard>
          </motion.div>

          {/* Main Content */}
          <div className="lg:col-span-8 space-y-8">
            {/* Info Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <BlockchainCard>
                <h3 className="text-xl font-bold text-gradient-web3 mb-8 flex items-center">
                  <User className="w-5 h-5 mr-3" />
                  Informations Personnelles
                </h3>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2 pl-1">Prénom</label>
                      <input
                        {...register('firstName', { required: 'Requis' })}
                        disabled={!isEditing}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:border-primary-500/50 outline-none transition-all disabled:opacity-50"
                      />
                      {errors.firstName && <p className="text-red-400 text-xs mt-1 pl-1">{errors.firstName.message}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2 pl-1">Nom</label>
                      <input
                        {...register('lastName', { required: 'Requis' })}
                        disabled={!isEditing}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:border-primary-500/50 outline-none transition-all disabled:opacity-50"
                      />
                      {errors.lastName && <p className="text-red-400 text-xs mt-1 pl-1">{errors.lastName.message}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2 pl-1">Email (Non modifiable)</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Mail className="h-4 w-4 text-gray-600" />
                      </div>
                      <input
                        type="email"
                        value={user?.email || ''}
                        disabled
                        className="w-full pl-11 pr-4 py-3 bg-white/[0.02] border border-white/5 rounded-xl text-gray-500 cursor-not-allowed"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2 pl-1">Téléphone</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Phone className="h-4 w-4 text-gray-600" />
                      </div>
                      <input
                        {...register('phone')}
                        disabled={!isEditing}
                        className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:border-primary-500/50 outline-none transition-all disabled:opacity-50"
                        placeholder="+229 XX XX XX XX"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2 pl-1">Bio</label>
                    <textarea
                      {...register('bio')}
                      rows={4}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:border-primary-500/50 outline-none transition-all disabled:opacity-50 resize-none"
                      placeholder="Parlez-nous de vous..."
                    />
                  </div>

                  {isEditing && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex justify-end pt-4"
                    >
                      <BlockchainButton
                        type="submit"
                        primary
                        disabled={isSubmitting}
                      >
                        <Save className="w-4 h-4 mr-2" />
                        {isSubmitting ? 'Sauvegarde...' : 'Sauvegarder les modifications'}
                      </BlockchainButton>
                    </motion.div>
                  )}
                </form>
              </BlockchainCard>
            </motion.div>

            {/* Password Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <BlockchainCard>
                <h3 className="text-xl font-bold text-gradient-web3 mb-8 flex items-center">
                  <Lock className="w-5 h-5 mr-3" />
                  Sécurité du Compte
                </h3>

                <form onSubmit={handleSubmitPassword(onChangePassword)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2 pl-1">Mot de passe actuel</label>
                      <div className="relative">
                        <input
                          {...registerPassword('currentPassword', { required: 'Requis' })}
                          type={showCurrentPassword ? 'text' : 'password'}
                          className="w-full pr-12 pl-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:border-secondary-500/50 outline-none transition-all"
                          placeholder="••••••••"
                        />
                        <button
                          type="button"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          className="absolute right-4 top-3.5 text-gray-600 hover:text-gray-400 transition-colors"
                        >
                          {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      {passwordErrors.currentPassword && <p className="text-red-400 text-xs mt-1 pl-1">{passwordErrors.currentPassword.message}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2 pl-1">Nouveau mot de passe</label>
                      <div className="relative">
                        <input
                          {...registerPassword('newPassword', {
                            required: 'Requis',
                            minLength: { value: 6, message: '6 caractères min' }
                          })}
                          type={showNewPassword ? 'text' : 'password'}
                          className="w-full pr-12 pl-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:border-secondary-500/50 outline-none transition-all"
                          placeholder="••••••••"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-4 top-3.5 text-gray-600 hover:text-gray-400 transition-colors"
                        >
                          {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      {passwordErrors.newPassword && <p className="text-red-400 text-xs mt-1 pl-1">{passwordErrors.newPassword.message}</p>}
                    </div>
                  </div>

                  <div className="flex justify-end pt-4">
                    <BlockchainButton
                      type="submit"
                      disabled={isSubmittingPassword}
                    >
                      Mettre à jour le mot de passe
                    </BlockchainButton>
                  </div>
                </form>
              </BlockchainCard>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
