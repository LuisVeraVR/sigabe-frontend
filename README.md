# SIGABE - Sistema de Gestión de Biblioteca

![SIGABE Logo](https://img.shields.io/badge/SIGABE-Sistema%20de%20Gestión%20de%20Biblioteca-blue)
![Next.js](https://img.shields.io/badge/Next.js-13.5.2-black)
![React](https://img.shields.io/badge/React-18.2.0-61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-5.2.2-3178C6)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.3.3-38B2AC)

SIGABE es una moderna aplicación web para la gestión integral de bibliotecas, que permite administrar libros, préstamos, devoluciones y multas de manera eficiente y organizada.
# [SIGABE DEMO](https://sigabe-frontend.vercel.app/) ![Captura de pantalla 2025-05-21 142500](https://github.com/user-attachments/assets/c0cc6082-8b82-42f8-9364-0e77f9992f88)

## 📋 Índice

1. [Características](#características)
2. [Tecnologías](#tecnologías)
3. [Estructura del Proyecto](#estructura-del-proyecto)
4. [Requisitos Previos](#requisitos-previos)
5. [Instalación y Configuración](#instalación-y-configuración)
6. [Uso](#uso)
7. [API y Backend](#api-y-backend)
8. [Documentación Adicional](#documentación-adicional)
9. [Licencia](#licencia)
10. [Contacto](#contacto)

## ✨ Características

- **Gestión de Libros**: Añadir, editar, eliminar y buscar libros. Cada libro tiene información como título, autor, año, editorial, tipo y disponibilidad.
- **Sistema de Préstamos**: Registrar préstamos de libros a usuarios con fechas de vencimiento personalizables.
- **Devoluciones**: Facilita el proceso de devolución y calcula automáticamente multas por retrasos.
- **Control de Multas**: Gestión y seguimiento de multas por retrasos en la devolución de libros.
- **Dashboard**: Panel de control con estadísticas y resumen de la actividad de la biblioteca.
- **Autenticación y Autorización**: Sistema de registro e inicio de sesión con roles de usuario y administrador.
- **Diseño Responsivo**: Interfaz adaptable a dispositivos móviles, tablets y escritorio.
- **Navegación Intuitiva**: Barra lateral configurable para fácil acceso a todas las secciones.
- **Búsqueda y Filtros**: Potentes herramientas de búsqueda y filtrado para libros, préstamos y multas.

## 🛠️ Tecnologías

- **Frontend**:
  - [Next.js 13](https://nextjs.org/) (App Router)
  - [React 18](https://reactjs.org/)
  - [TypeScript](https://www.typescriptlang.org/)
  - [TailwindCSS](https://tailwindcss.com/) para estilos
  - [Lucide React](https://lucide.dev/guide/packages/lucide-react) para iconos
  - [React Hook Form](https://react-hook-form.com/) para manejo de formularios
  - [Zod](https://github.com/colinhacks/zod) para validaciones
  - [date-fns](https://date-fns.org/) para manipulación de fechas
  - [React Toastify](https://fkhadra.github.io/react-toastify/) para notificaciones

- **Backend** (API conectada):
  - RESTful API
  - JWT para autenticación
  - Axios para peticiones HTTP

## 📁 Estructura del Proyecto

```
sigabe-frontend/
├── public/           # Archivos estáticos
├── src/              # Código fuente
│   ├── app/          # Componentes y páginas (Next.js App Router)
│   │   ├── (auth)/   # Rutas de autenticación (login, registro)
│   │   ├── (protected)/ # Rutas protegidas (dashboard, libros, préstamos)
│   │   └── layout.tsx # Layout principal
│   ├── components/   # Componentes React reutilizables
│   │   ├── auth/     # Componentes de autenticación
│   │   ├── books/    # Componentes para gestión de libros
│   │   ├── loans/    # Componentes para préstamos
│   │   ├── fines/    # Componentes para multas
│   │   ├── layout/   # Componentes de layout (Navbar, Sidebar, Footer)
│   │   └── ui/       # Componentes UI genéricos
│   ├── context/      # Contextos React (Auth, Sidebar)
│   ├── lib/          # Utilidades y configuraciones
│   └── types/        # Definiciones de tipos TypeScript
├── .env.example      # Ejemplo de variables de entorno
├── next.config.js    # Configuración de Next.js
├── package.json      # Dependencias y scripts
├── tailwind.config.js # Configuración de TailwindCSS
└── tsconfig.json     # Configuración de TypeScript
```

## 📋 Requisitos Previos

- Node.js 18.x o superior
- npm o yarn
- API de backend de SIGABE (o configurar variables de entorno para conectar a su propia API)

## 🚀 Instalación y Configuración

1. **Clonar el repositorio**:

```bash
git clone https://github.com/tu-usuario/sigabe-frontend.git
cd sigabe-frontend
```

2. **Instalar dependencias**:

```bash
npm install
# o
yarn install
```

3. **Configurar variables de entorno**:

Copia el archivo `.env.example` a `.env.local` y actualiza las variables:

```bash
cp .env.example .env.local
```

Edita `.env.local` con la URL de tu API:

```
NEXT_PUBLIC_API_URL=http://tu-api.com/api
```

4. **Iniciar el servidor de desarrollo**:

```bash
npm run dev
# o
yarn dev
```

La aplicación estará disponible en `http://localhost:3000`.

## 💻 Uso

### Inicio de Sesión y Registro

- Accede a `/login` para iniciar sesión con un usuario existente
- Accede a `/register` para crear una nueva cuenta de usuario

### Gestión de Libros

- Visualiza todos los libros en `/books`
- Añade nuevos libros en `/books/create`
- Edita libros existentes en `/books/edit/[id]`

### Gestión de Préstamos

- Visualiza todos los préstamos en `/loans`
- Registra nuevos préstamos en `/loans/create`
- Gestiona devoluciones en `/loans/return/[id]`

### Gestión de Multas

- Visualiza y gestiona todas las multas en `/fines`

### Panel de Control

- Accede al dashboard con estadísticas y resumen en `/dashboard`

## 🔌 API y Backend

La aplicación frontend se conecta a una API RESTful. Por defecto, la URL base de la API se configura en la variable de entorno `NEXT_PUBLIC_API_URL`.

### Endpoints Principales

- **Autenticación**: `/api/auth/login`, `/api/auth/register`, `/api/auth/profile`
- **Libros**: `/api/books/getBooks`, `/api/books/createBook`, `/api/books/updateBook/[id]`, `/api/books/deleteBook/[id]`
- **Préstamos**: `/api/loans`, `/api/loans/[id]`, `/api/loans/[id]/return`
- **Multas**: `/api/fines`, `/api/fines/[id]/pay`

## 📄 Licencia

Este proyecto está licenciado bajo la Licencia MIT - consulta el archivo [LICENSE](LICENSE) para más detalles.


Desarrollado con ❤️ usando Next.js, React y TypeScript.
