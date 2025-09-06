'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft } from "lucide-react"
import theme from '../login/auth.module.scss'

export default function SignupPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        console.log("Registro exitoso")
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
                                />
                            </div>

                            <button
                                type="submit"
                                className={`btn btn-primary w-full ${theme.btn}`}
                            >
                                Crear Cuenta
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
