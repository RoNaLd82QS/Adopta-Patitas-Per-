<div align="center">

# 🐾 **Adopta-Patitas Perú**
### Plataforma web para adopción responsable de mascotas  
Desarrollado con **Next.js 15**, **React 19**, **TypeScript**, **Prisma ORM** y **Tailwind CSS**.

---

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=nextdotjs)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=for-the-badge&logo=prisma)
![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-4-38B2AC?style=for-the-badge&logo=tailwindcss)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

</div>

---

## 📌 **Descripción del Proyecto**

**Adopta-Patitas Perú** es una plataforma web diseñada para:

- Publicar mascotas disponibles en adopción 🐶🐱  
- Facilitar el registro de postulantes  
- Gestionar solicitudes desde un panel de administrador  
- Garantizar un proceso de adopción **responsable y transparente**

El sistema incluye:

- Autenticación de usuarios  
- Gestión de mascotas  
- Solicitudes de adopción  
- Carga de imágenes  
- Roles (**ADMIN** / **USER**)  
- Arquitectura moderna con Server Actions

---

# 🧩 1. **Estándares de Lenguaje (TypeScript + React + Next.js)**

### ✔ Tipado estático con TypeScript  
Evita errores antes de ejecutar el código.

### ✔ Componentes modulares y reutilizables  
Páginas y componentes totalmente encapsulados.

### ✔ Server Actions (`"use server"`)  
Lógica del servidor de forma segura y optimizada.

### ✔ Separación de lógica y UI  
- `/page.tsx` → interfaz  
- `/actions.ts` → lógica (CRUD)

### ✔ Convenciones de nombres  
- camelCase (photoUrl, createdAt)  
- PascalCase (HeroSlider, NavBar)

---

# 🎨 2. **Estándares de Diseño (Tailwind CSS + UX)**

### ✔ Diseño responsive-first  
Compatible con móviles, tablet y desktops.

### ✔ Estilo visual consistente  
Colores, espaciado, tipografía y proporciones.

### ✔ Accesibilidad  
- Labels visibles  
- Textos alternativos `alt=""`  
- Inputs descriptivos  

### ✔ Buenas prácticas UX  
Mensajes claros, botones accesibles, feedback visual.

# 🧱 3. **Estructura del Proyecto (Next.js App Router)**

La arquitectura del proyecto sigue las convenciones oficiales de **Next.js 15**, utilizando el App Router para obtener rutas automáticas, server components, server actions y una separación clara entre frontend, backend y lógica compartida.
app/
 ├─ (public)/
 │   └─ layout.tsx          # Layout visible para todos los usuarios
 │
 ├─ adopta/                 # Sección pública para adopciones
 │   ├─ page.tsx            # Página principal de adopciones
 │   └─ [id]/               # Vista de cada mascota en detalle
 │       └─ page.tsx
 │
 ├─ admin/                  # Panel administrativo (requiere rol ADMIN)
 │   ├─ layout.tsx          # Layout privado para administradores
 │   ├─ pets/               # Gestión de mascotas
 │   │   ├─ page.tsx
 │   │   ├─ actions.ts      # CRUD server actions
 │   │   └─ new/            # Crear nueva mascota
 │   │       └─ page.tsx
 │   │
 │   ├─ donations/          # Gestión de donaciones
 │   │   ├─ page.tsx
 │   │   └─ actions.ts
 │   │
 │   ├─ events/             # Gestión de eventos
 │   │   └─ page.tsx
 │   │
 │   └─ images/             # Gestión de recursos multimedia
 │       └─ page.tsx
 │
 ├─ api/                    # Endpoints (Route Handlers)
 │   ├─ upload/
 │   │   └─ route.ts        # Subida de imágenes
 │   └─ auth/
 │       └─ [...nextauth]   # API de autenticación NextAuth
 │
 ├─ components/             # Componentes UI reutilizables
 │   ├─ NavBar.tsx
 │   ├─ Footer.tsx
 │   ├─ HeroSlider.tsx
 │   └─ PetCard.tsx
 │
 ├─ lib/                    # Lógica compartida entre backend/frontend
 │   ├─ prisma.ts           # Cliente Prisma (singleton)
 │   ├─ upload.ts           # Función para manejar imágenes
 │   ├─ auth.ts             # Configuración de NextAuth
 │   └─ utils.ts            # Funciones auxiliares
 │
 ├─ globals.css             # Estilos globales (Tailwind incluido)
 ├─ layout.tsx              # Layout raíz del proyecto
 └─ page.tsx                # Página principal (Landing Page)

# ⚙️ 4. **Base de Datos (Prisma ORM + SQLite)**

### ✔ Modelos tipados  
Incluye enums, relaciones y validaciones.

### ✔ Migraciones versionadas  
Carpeta: `prisma/migrations/`.

### ✔ Campos automáticos  
- `@default(now())`  
- `@updatedAt`

### ✔ Relaciones seguras  
`onDelete: Cascade`

### ✔ Base de datos apta para GitHub  
- SQLite (`dev.db`) → **NO se sube**  
- Configuración segura en `.env`:

- # 🛡️ 5. **Estándares de Seguridad**

✔ Variables sensibles en `.env`  
✔ Roles: `ADMIN` / `USER`  
✔ Subidas de imagen seguras desde el servidor  
✔ Sesiones y autenticación con NextAuth  
✔ Sanitización de datos  

---
feat: añadir módulo de adopciones
fix: corregir validación de formulario
chore: actualizar dependencias
docs: mejorar README
# 🧰 6. **Control de Versiones (Git + GitHub)**

### `.gitignore` incluye:
- `.env`
- `node_modules/`
- `.next/`
- `dev.db`
- `logs/`
