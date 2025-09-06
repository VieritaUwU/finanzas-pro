'use client'

import Link from "next/link"
import { ArrowLeft } from "lucide-react";
import theme from "./auth.module.scss";

export default function LoginPage() {

    const handleSubmit = () => {
        console.log('Iniciar sesión')
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

                        <form onSubmit={handleSubmit}>
                            <div className={theme.formGroup}>
                                <label htmlFor="email">Correo Electrónico</label>
                                <input
                                    type="email"
                                    id="email"
                                    required
                                    placeholder="tu@email.com"
                                />
                            </div>

                            <div className={theme.formGroup}>
                                <label htmlFor="password">Contraseña</label>
                                <input
                                    type="password"
                                    id="password"
                                    required
                                    placeholder="Tu contraseña"
                                />
                            </div>

                            <button
                                type="submit"
                                className={`btn btn-primary w-full`}
                            >
                                Iniciar Sesión
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