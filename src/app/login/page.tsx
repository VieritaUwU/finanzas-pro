'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { auth } from '@/lib/supabase'
import { ArrowLeft } from "lucide-react";
import Link from "next/link"
import theme from "./auth.module.scss";

export default function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        try {
            const { data, error } = await auth.signIn(email, password)

            if (error) {
                setError(error.message)
            } else if (data.user) {
                router.push('/dashboard')
            }
        } catch (err) {
            setError('Error inesperado. Por favor intenta de nuevo.')
        } finally {
            setLoading(false)
        }
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
                        <h2>Iniciar Sesión</h2>
                        <p className={theme.authSubtitle}>
                            Accede a tu cuenta para gestionar tus finanzas
                        </p>

                        {error && (
                            <div className={theme.errorMessage}>
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit}>
                            <div className={theme.formGroup}>
                                <label htmlFor="email">Correo Electrónico</label>
                                <input
                                    type="email"
                                    id="email"
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
                                    placeholder="Tu contraseña"
                                    disabled={loading}
                                />
                            </div>

                            <button
                                type="submit"
                                className={`btn btn-primary w-full ${theme.btn}`}
                                disabled={loading}
                            >
                                {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                            </button>
                        </form>

                        <div className={theme.authFooter}>
                            <p>
                                ¿No tienes una cuenta?{' '}
                                <Link href="/signup" className={theme.authLink}>
                                    Regístrate aquí
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}