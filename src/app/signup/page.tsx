'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { auth } from '@/lib/supabase'
import { ArrowLeft } from "lucide-react"
import theme from '../login/auth.module.scss'

export default function SignupPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')
        setSuccess(false)

        if (password !== confirmPassword) {
            setError('Las contraseñas no coinciden')
            setLoading(false)
            return
        }

        if (password.length < 6) {
            setError('La contraseña debe tener al menos 6 carácteres')
            setLoading(false)
            return
        }

        try {
            const { data, error } = await auth.signUp(email, password)

            if (error) {
                setError(error.message)
            } else if (data.user) {
                setSuccess(true)
                setTimeout(() => {
                    router.push('/dashboard')
                }, 2000)
            }
        } catch (error) {
            setError('Error inesperado. Por favor intenta de nuevo.')
        } finally {
            setLoading(false)
        }
    }

    if (success) {
        return (
            <div className={theme.authPage}>
                <div className={theme.authContainer}>
                    <div className={theme.authFormContainer}>
                        <div className={theme.authForm}>
                            <div className={theme.successMessage}>
                                <h2>¡Registro Exitoso! 🎉</h2>
                                <p>Tu cuenta ha sido creada correctamente. Serás redirigido al dashboard...</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className={theme.authPage}>
            <div className={theme.authContainer}>
                <div className={theme.authHeader}>
                    <Link href="/" className={theme.backLink}>
                        <ArrowLeft size={16} />
                        Volver al inicio
                    </Link>
                    <h1>💰 FinanzasPro</h1>
                </div>

                <div className={theme.authFormContainer}>
                    <div className={theme.authForm}>
                        <h2>Crear cuenta</h2>
                        <p className={theme.authSubtitle}>
                            Únete a FinanzasPro y toma control de tus finanzas
                        </p>

                        {error && (
                            <div className={theme.errorMessage}>
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit}>
                            <div className={theme.formGroup}>
                                <label htmlFor="email">Correo electrónico</label>
                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    placeholder="tu@email.com"
                                    disabled={loading}
                                />
                            </div>

                            <div className={theme.formGroup}>
                                <label htmlFor="password">Contraseña</label>
                                <input
                                    type="password"
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    placeholder="Mínimo 6 caracteres"
                                    minLength={6}
                                    disabled={loading}
                                />
                            </div>

                            <div className={theme.formGroup}>
                                <label htmlFor="confirmPassword">Confirmar Contraseña</label>
                                <input
                                    type="password"
                                    id="confirmPassword"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                    placeholder="Repite tu contraseña"
                                    disabled={loading}
                                />
                            </div>

                            <button
                                type="submit"
                                className={`btn btn-primary w-full ${theme.btn}`}
                                disabled={loading}
                            >
                                {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
                            </button>
                        </form>

                        <div className={theme.authFooter}>
                            <p>
                                ¿Ya tienes una cuenta?{' '}
                                <Link href="/login" className={theme.authLink}>
                                    Inicia sesión aquí
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
