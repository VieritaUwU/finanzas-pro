# 💰 FinanzasPro - Personal Finance Dashboard

Una aplicación web para el manejo de finanzas personales construida con Next.js, TypeScript, Supabase y SCSS.

## 🛠️ Tecnologías Utilizadas

- **Frontend**: Next.js 15, TypeScript, React
- **Estilos**: SCSS Modules
- **Base de Datos**: Supabase (PostgreSQL)
- **Autenticación**: Supabase Auth
- **Gráficos**: Chart.js, React-Chart.js-2
- **Íconos**: Lucide React
- **PDF**: html2canvas, jsPDF

## 📋 Prerrequisitos

- Node.js 18+ 
- npm, yarn, pnpm o bun
- Cuenta de Supabase

## ⚙️ Configuración de Supabase

### 1. Crear Proyecto en Supabase

1. Ve a [supabase.com](https://supabase.com) y crea una cuenta
2. Crea un nuevo proyecto
3. Espera a que se complete la configuración

### 2. Configurar Base de Datos

Ejecuta las siguientes consultas SQL en el editor SQL de Supabase:

```sql
-- Crear tabla de transacciones
CREATE TABLE transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  type VARCHAR(10) CHECK (type IN ('income', 'expense')) NOT NULL,
  category VARCHAR(50) NOT NULL,
  description TEXT,
  date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para optimizar consultas
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_date ON transactions(date);
CREATE INDEX idx_transactions_type ON transactions(type);

-- Habilitar RLS para transactions
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Políticas de seguridad para transactions
CREATE POLICY "Users can view own transactions" ON transactions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own transactions" ON transactions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own transactions" ON transactions
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own transactions" ON transactions
  FOR DELETE USING (auth.uid() = user_id);

-- Crear tabla de perfiles
CREATE TABLE profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índice para perfiles
CREATE INDEX profiles_user_id_idx ON profiles(user_id);

-- Habilitar RLS para profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Políticas de seguridad para profiles
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Función para crear perfil automáticamente
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para crear perfil automáticamente
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Crear bucket para avatares
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true);

-- Políticas de storage para avatares
CREATE POLICY "Avatar images are publicly accessible" ON storage.objects
  FOR SELECT USING (bucket_id = 'avatars');

-- Política para subir avatares (solo usuarios autenticados)
CREATE POLICY "Anyone can upload an avatar" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'avatars' AND auth.role() = 'authenticated');

-- Política para actualizar avatares (solo el propietario)
CREATE POLICY "Anyone can update their own avatar" ON storage.objects
  FOR UPDATE USING (auth.uid()::text = (storage.foldername(name))[1]);

-- Política para eliminar avatares (solo el propietario)
CREATE POLICY "Anyone can delete their own avatar" ON storage.objects
  FOR DELETE USING (auth.uid()::text = (storage.foldername(name))[1]);
```

### 3. Obtener Credenciales

1. Ve a **Project Overview** > **Project API**
2. Copia la `URL` del proyecto
3. Copia la `anon/public` key

## 🚀 Instalación y Configuración

### 1. Clonar el Repositorio

```bash
git clone https://github.com/VieritaUwU/finanzas-pro.git
cd finanzas-pro
```

### 2. Instalar Dependencias

```bash
npm install
# o
yarn install
# o
pnpm install
```

### 3. Configurar Variables de Entorno

Crea un archivo `.env.local` en la raíz del proyecto:

```env
NEXT_PUBLIC_SUPABASE_URL=tu_supabase_url_aqui
NEXT_PUBLIC_SUPABASE_KEY=tu_supabase_anon_key_aqui
```

### 3. Ejecutar el Proyecto

```bash
npm run dev
# o
yarn dev
# o
pnpm dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## 📊 Datos de Prueba (Opcional)

Puedes insertar datos de prueba ejecutando este SQL en Supabase:

```sql
-- Insertar transacciones de ejemplo (reemplaza YOUR_USER_ID con tu ID de usuario)
INSERT INTO transactions (user_id, amount, type, category, description, date) VALUES
-- Ingresos
('YOUR_USER_ID', 3000.00, 'income', 'Salario', 'Salario mensual', '2025-09-05'),
('YOUR_USER_ID', 500.00, 'income', 'Freelance', 'Proyecto web', '2025-09-30'),
('YOUR_USER_ID', 3200.00, 'income', 'Salario', 'Salario mensual', '2025-09-08'),
('YOUR_USER_ID', 300.00, 'income', 'Venta', 'Venta de artículos', '2025-09-03'),

-- Gastos
('YOUR_USER_ID', 800.00, 'expense', 'Alimentación', 'Supermercado y restaurantes', '2025-09-05'),
('YOUR_USER_ID', 400.00, 'expense', 'Transporte', 'Gasolina y transporte público', '2025-09-10'),
('YOUR_USER_ID', 300.00, 'expense', 'Entretenimiento', 'Cine y salidas', '2025-09-12'),
('YOUR_USER_ID', 600.00, 'expense', 'Servicios', 'Luz, agua, internet', '2025-09-15'),
('YOUR_USER_ID', 200.00, 'expense', 'Otros', 'Gastos varios', '2025-09-18'),

('YOUR_USER_ID', 850.00, 'expense', 'Alimentación', 'Supermercado y restaurantes', '2025-09-05'),
('YOUR_USER_ID', 420.00, 'expense', 'Transporte', 'Gasolina y transporte público', '2025-09-10'),
('YOUR_USER_ID', 250.00, 'expense', 'Entretenimiento', 'Cine y salidas', '2025-09-12'),
('YOUR_USER_ID', 580.00, 'expense', 'Servicios', 'Luz, agua, internet', '2025-09-15'),
('YOUR_USER_ID', 180.00, 'expense', 'Otros', 'Gastos varios', '2025-09-18');
```

## 🏗️ Estructura del Proyecto

```
src/
├── app/                    # App Router de Next.js
│   ├── dashboard/         # Página principal del dashboard
│   ├── login/            # Página de inicio de sesión
│   ├── signup/           # Página de registro
│   └── page.tsx          # Landing page
├── components/
│   └── dashboard/        # Componentes del dashboard
│       ├── ChartsSection.tsx
│       ├── OverviewSection.tsx
│       ├── ProfileEditModal.tsx
│       └── StatCard.tsx
└── lib/                  # Utilidades y configuración
    ├── database.ts       # Funciones de base de datos
    ├── profiles.ts       # Gestión de perfiles
    └── supabase.ts       # Configuración de Supabase
```

## 🎯 Funcionalidades Principales

### Dashboard
- Resumen financiero con métricas clave
- Gráficos interactivos de ingresos/gastos
- Visualización por categorías
- Comparación mensual con porcentajes de cambio

### Gestión de Perfil
- Edición de información personal
- Carga y actualización de avatar
- Validación de archivos de imagen

### Exportación
- Descarga de gráficos en PDF
- Cada gráfico en página separada
- Formato profesional con títulos

## 📝 Notas Técnicas

- **Autenticación**: Implementada con Supabase Auth
- **Seguridad**: Row Level Security (RLS) habilitado
- **Optimización**: Componentes optimizados con React.memo
- **Tipos**: TypeScript estricto para mayor seguridad
- **Estilos**: SCSS Modules para encapsulación de estilos

## 🤝 Contribución

Este proyecto fue desarrollado como parte de una entrevista técnica, demostrando:

- Arquitectura de aplicación moderna
- Integración con servicios externos (Supabase)
- Manejo de estado y efectos en React
- Implementación de autenticación segura
- Visualización de datos interactiva
- Diseño responsive y UX moderna (eso espero)

---

**Desarrollado con ❤️ usando Next.js y Supabase**

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
