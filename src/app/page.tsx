import Link from "next/link";
import theme from "./landing.module.scss";

export default function Home() {
  return (
    <div className={theme.page}>
      <header className={theme.header}>
        <div className={'container'}>
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

      <section className={theme.hero}>
        <div className={`container ${theme.container}`}>
          <div className={theme.heroContent}>
            <h1 className={theme.heroTitle}>
              Toma el control de tus
              <span className={theme.highlight}> finanzas personales</span>
            </h1>
            <p className={theme.heroDescription}>
              Gestiona tus ingresos, gastos y metas financieras de manera inteligente.
              Visualiza tu progreso con gráficas detalladas y toma decisiones informadas.
            </p>
            <div className={theme.heroActions}>
              <Link href="/signup" className={`btn btn-primary btn-large`}>
                Comenzar Gratis
              </Link>
              <Link href="#features" className={`btn btn-outline btn-large`}>
                Ver Características
              </Link>
            </div>
          </div>
          <div className={theme.heroVisual}>
            <div className={theme.dashboardPreview}>
              <div className={theme.chartPlaceholder}>
                <div className={theme.chartBar} style={{ height: '60%' }}></div>
                <div className={theme.chartBar} style={{ height: '80%' }}></div>
                <div className={theme.chartBar} style={{ height: '45%' }}></div>
                <div className={theme.chartBar} style={{ height: '90%' }}></div>
                <div className={theme.chartBar} style={{ height: '70%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
