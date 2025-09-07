'use client'

import { useState, useEffect } from 'react'
import { User } from '@supabase/supabase-js'
import { UserProfile, upsertProfile, uploadAvatar, deleteAvatar } from '@/lib/profiles'
import { Camera } from 'lucide-react'

interface ProfileEditModalProps {
    user: User | null
    profile: UserProfile | null
    isOpen: boolean
    onClose?: () => void
    onProfileUpdate: (profile: UserProfile) => void
    className?: {
        modalOverlay?: string
        modal?: string
        profileModal?: string
        modalHeader?: string
        modalClose?: string
        modalContent?: string
        errorMessage?: string
        formGroup?: string
        avatarSection?: string
        avatarUpload?: string
        avatarPreview?: string
        avatarImage?: string
        avatarPlaceholder?: string
        avatarInput?: string
        avatarButton?: string
        disabled?: string
        modalActions?: string
    }
}

export default function ProfileEditModal({
    user,
    profile,
    isOpen,
    onClose,
    onProfileUpdate,
    className: theme = {},
}: ProfileEditModalProps) {
    const [formData, setFormData] = useState({
        full_name: '',
        phone: '',
    })
    const [avatarFile, setAvatarFile] = useState<File | null>(null)
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    // Load profile data when modal opens
    useEffect(() => {
        if (profile && isOpen) {
            setFormData({
                full_name: profile.full_name || '',
                phone: profile.phone || '',
            })
            setAvatarPreview(profile.avatar_url)
        }
    }, [profile, isOpen])

    // Handle avatar file selection
    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            if (!file.type.startsWith('image/')) {
                setError('Por favor selecciona un archivo de imagen válido')
                return
            }

            // Max size 2MB
            if (file.size > 2 * 1024 * 1024) {
                setError('La imagen debe ser menor a 2MB')
                return
            }

            setAvatarFile(file)
            setError(null)

            // Create preview
            const reader = new FileReader()
            reader.onload = (e) => {
                setAvatarPreview(e.target?.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!user) return

        setLoading(true)
        setError(null)

        try {
            let avatarUrl = profile?.avatar_url

            if (avatarFile) {
                // Delete previous avatar if exists
                if (profile?.avatar_url) {
                    await deleteAvatar(profile.avatar_url)
                }

                const { data: uploadedUrl, error: uploadError } = await uploadAvatar(avatarFile, user.id)
                if (uploadError) {
                    throw new Error('Error al subir la imagen')
                }
                avatarUrl = uploadedUrl
            }

            // Update Profile
            const profileUpdate = {
                user_id: user.id,
                full_name: formData.full_name.trim() || null,
                phone: formData.phone.trim() || null,
                avatar_url: avatarUrl
            }

            const { data, error: updateError } = await upsertProfile(profileUpdate)

            if (updateError) {
                throw updateError
            }

            if (data) {
                onProfileUpdate(data)
                onClose?.()
                setAvatarFile(null)
                setAvatarPreview(null)
            }
        } catch (err: any) {
            setError(err.message || 'Error al actualizar el perfil')
        } finally {
            setLoading(false)
        }
    }

    if (!isOpen) return null

    return (
        <div className={theme?.modalOverlay}>
            <div className={`${theme.modal} ${theme.profileModal}`}>
                <div className={theme?.modalHeader}>
                    <h2>Editar Perfil</h2>
                    <button
                        className={theme?.modalClose}
                        onClick={onClose}
                        disabled={loading}
                    >
                        ×
                    </button>
                </div>

                <form onSubmit={handleSubmit} className={theme.modalContent}>
                    {error && (
                        <div className={theme.errorMessage}>
                            {error}
                        </div>
                    )}
                    <div className={`${theme.formGroup} ${theme.avatarSection}`}>
                        <label>Foto de Perfil</label>
                        <div className={theme.avatarUpload}>
                            <div className={theme.avatarPreview}>
                                {avatarPreview ? (
                                    <img src={avatarPreview} alt="Avatar" className={theme.avatarImage} />
                                ) : (
                                    <div className={theme.avatarPlaceholder}>
                                        <Camera size={24} />
                                    </div>
                                )}
                            </div>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleAvatarChange}
                                className={theme.avatarInput}
                                id="avatar-upload"
                            />
                            <label htmlFor="avatar-upload" className={theme.avatarButton}>
                                Cambiar Foto
                            </label>
                        </div>
                    </div>

                    <div className={theme.formGroup}>
                        <label>Nombre Completo</label>
                        <input
                            type="text"
                            value={formData.full_name}
                            onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                            placeholder="Tu nombre completo"
                            maxLength={100}
                        />
                    </div>

                    <div className={theme.formGroup}>
                        <label>Teléfono</label>
                        <input
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            placeholder="Tu número de teléfono"
                            maxLength={20}
                        />
                    </div>

                    <div className={theme.formGroup}>
                        <label>Email (no editable)</label>
                        <input
                            type="email"
                            value={user?.email || ''}
                            disabled
                            className={theme.disabled}
                        />
                    </div>

                    <div className={theme.modalActions}>
                        <button
                            type="button"
                            className={`btn btn-outline`}
                            onClick={onClose}
                            disabled={loading}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className={`btn btn-primary`}
                            disabled={loading}
                        >
                            {loading ? 'Guardando...' : 'Guardar Cambios'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}