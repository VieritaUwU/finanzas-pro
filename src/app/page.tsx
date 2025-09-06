import Link from "next/link";
import { BarChart3, User, Shield, Smartphone } from "lucide-react";
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
              <Link href="/login" className={`btn btn-outline ${theme.btn}`}>
                Iniciar Sesión
              </Link>
              <Link href="/register" className={`btn btn-primary ${theme.btn}`}>
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

      <section id="features" className={theme.features}>
        <div className={`container`}>
          <h2 className={theme.sectionTitle}>Características Principales</h2>
          <div className={theme.featuresGrid}>
            <div className={theme.featureCard}>
              <div className={theme.featureIcon}>
                <BarChart3 size={32} color={`var(--primary-color)`} />
              </div>
              <h3>Gráficas Detalladas</h3>
              <p>Visualiza tus finanzas con gráficas interactivas y descarga reportes en PDF</p>
            </div>
            <div className={theme.featureCard}>
              <div className={theme.featureIcon}>
                <User size={32} color={`var(--primary-color)`} />
              </div>
              <h3>Perfil Personalizable</h3>
              <p>Edita tu perfil y personaliza tu experiencia según tus necesidades</p>
            </div>
            <div className={theme.featureCard}>
              <div className={theme.featureIcon}>
                <Shield size={32} color={`var(--primary-color)`} />
              </div>
              <h3>Seguridad Total</h3>
              <p>Tus datos están protegidos con la mejor tecnología de seguridad</p>
            </div>
            <div className={theme.featureCard}>
              <div className={theme.featureIcon}>
                <Smartphone size={32} color={`var(--primary-color)`} />
              </div>
              <h3>Acceso Multiplataforma</h3>
              <p>Accede desde cualquier dispositivo, en cualquier momento</p>
            </div>
          </div>
        </div>
      </section>

      <section className={theme.cta}>
        <div className={`container`}>
          <div className={theme.ctaContent}>
            <h2>¿Listo para transformar tus finanzas?</h2>
            <p>Únete a miles de usuarios que ya están tomando el control de su futuro financiero</p>
            <Link href="/signup" className={`btn btn-primary btn-large`}>
              Crear Cuenta Gratuita
            </Link>
          </div>
        </div>
      </section>

      <footer className={theme.footer}>
        <div className={`container`}>
          <div className={theme.footerContent}>
            <div className={theme.footerBrand}>
              <h3>💰 FinanzasPro</h3>
              <p>Tu compañero en el camino hacia la libertad financiera</p>
            </div>
            <div className={theme.footerLinks}>
              <div className={theme.footerColumn}>
                <h4>Producto</h4>
                <Link href="#features">Características</Link>
                <Link href="/pricing">Precios</Link>
              </div>
              <div className={theme.footerColumn}>
                <h4>Soporte</h4>
                <Link href="/help">Ayuda</Link>
                <Link href="/contact">Contacto</Link>
              </div>
            </div>
          </div>
          <div className={theme.footerBottom}>
            <p>&copy; 2025 FinanzasPro. Todos los derechos reservados.</p>
            <p className={theme.developerCredit}>Desarrollado por Alberto Viera</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
