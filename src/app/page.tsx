import Link from "next/link";
import theme from "./landing.module.scss";

export default function Home() {
  return (
    <div className={theme.page}>
      <header className={theme.header}>
        <div className="container">
          <div className={theme.nav}>
            <div className={theme.logo}>
              <h2>💰 FinanzasPro</h2>
            </div>
            <div className={theme.navLinks}>
              <Link href="/login" className={`btn btn-outline`}>
                Iniciar Sesión
              </Link>
              <Link href="/register" className={`btn btn-primary`}>
                Registrarse
              </Link>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}
