'use client'

import { Camera } from 'lucide-react'

interface ProfileEditModalProps {
    isOpen: boolean
    onClose?: () => void
    className?: {
        modalOverlay?: string
        modal?: string
        modalHeader?: string
        modalClose?: string
        modalContent?: string
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
    isOpen,
    onClose,
    className: theme = {},
}: ProfileEditModalProps) {

    if (!isOpen) return null

    return (
        <div className={theme?.modalOverlay}>
            <div className={`${theme.modal} ${theme.profileModal}`}>
                <div className={theme?.modalHeader}>
                    <h2>Editar Perfil</h2>
                    <button
                        type="button"
                        className={theme?.modalClose}
                        onClick={onClose}
                    >
                        ×
                    </button>
                </div>

                <form className={theme.modalContent}>

                    {/* Avatar Section */}
                    <div className={`${theme.formGroup} ${theme.avatarSection}`}>
                        <label>Foto de Perfil</label>
                        <div className={theme.avatarUpload}>
                            <div className={theme.avatarPreview}>
                                <div className={theme.avatarPlaceholder}>
                                    <Camera size={24} />
                                </div>
                            </div>
                            <input
                                type="file"
                                accept="image/*"
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
                            placeholder="Tu nombre completo"
                            maxLength={100}
                        />
                    </div>

                    <div className={theme.formGroup}>
                        <label>Teléfono</label>
                        <input
                            type="tel"
                            placeholder="Tu número de teléfono"
                            maxLength={20}
                        />
                    </div>

                    <div className={theme.formGroup}>
                        <label>Email (no editable)</label>
                        <input
                            type="email"
                            disabled
                            className={theme.disabled}
                        />
                    </div>

                    <div className={theme.modalActions}>
                        <button
                            type="button"
                            className={`btn btn-outline`}
                            onClick={onClose}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className={`btn btn-primary`}
                            onClick={(e) => {
                                e.preventDefault()
                                console.log('Guardando cambios del perfil')
                                onClose?.()
                            }}
                        >
                            Guardar Cambios
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}