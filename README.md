# 🐾 Adopta-Patitas — Estándares del Proyecto

Este documento define los estándares técnicos, de diseño, arquitectura y buenas prácticas aplicadas al proyecto **Adopta-Patitas Perú**.

---

# 🧩 1. Estándares de Lenguaje (TypeScript + React + Next.js)
✅ Buenas prácticas aplicadas

### ✔ Tipado estático con TypeScript (.ts / .tsx)
Permite detectar errores en tiempo de desarrollo antes de ejecutar código.

### ✔ Componentes modulares y reutilizables
Cada página (page.tsx) y componente (HeroSlider, NavBar, etc.) está encapsulado.

### ✔ Funciones puras + async/await
Uso correcto para operaciones con Prisma y Fetch API.

### ✔ Uso de Server Actions ("use server")
Estandariza la lógica del lado del servidor en Next.js 15.

### ✔ Separación de lógica y presentación
- /app/admin/donations/page.tsx → interfaz
- /app/admin/donations/actions.ts → operaciones CRUD

### ✔ Convenciones de nombres
- camelCase → variables (photoUrl, createdAt)
- PascalCase → componentes (HeroSlider, NavBar)

---

# 🎨 2. Estándares de Diseño y Frontend (Tailwind CSS + UI)
✅ Buenas prácticas aplicadas

### ✔ Tailwind CSS eficiente
- Clases utilitarias limpias
- Diseño responsive-first
- Breakpoints como md:grid-cols-2, sm:hidden

### ✔ Consistencia visual
Colores, espaciados y tipografía uniforme.

### ✔ Accesibilidad
Uso de:
- `<button>`
- `<label>`
- `<input>`
- textos alternativos `alt=""`

---

# 🧱 3. Estructura de Carpetas (Next.js 15 — App Router)
app/
├─ admin/
│ ├─ donations/
│ ├─ pets/
│ ├─ events/
│ └─ images/
├─ adopta/
├─ api/
├─ components/
├─ lib/
│ ├─ prisma.ts
│ └─ upload.ts
├─ layout.tsx
├─ globals.css
└─ page.tsx


### ✔ Ventajas
- Rutas automáticas según carpetas
- Separación clara frontend/backend
- Escalable y mantenible

---

# ⚙️ 4. Estándares de Base de Datos (Prisma ORM)
✅ Buenas prácticas aplicadas

### ✔ Migraciones versionadas
Ubicadas en: prisma/migrations/

### ✔ Modelos y enums tipados
enum Role {
ADMIN
USER
}

### ✔ Índices y claves
- @id
- @unique
- @@index

### ✔ Campos automáticos
- @default(now())
- @updatedAt

### ✔ Relaciones

### ✔ Base de datos lista para GitHub
- Usa SQLite (archivo local dev.db)
- No se sube porque está en .gitignore
- `DATABASE_URL="file:./dev.db"` en `.env`

Esto permite que el repositorio esté limpio sin exponer datos sensibles.

---

# 🛡️ 5. Estándares de Seguridad

### ✔ Variables sensibles en .env
- DATABASE_URL  
- NEXTAUTH_SECRET  

### ✔ Roles
- ADMIN  
- USER  

### ✔ Uploads seguros
Manejo desde `/lib/upload.ts`.

### ✔ Autenticación
Gestionada con NextAuth.

---

# 🧰 6. Control de Versiones (Git/GitHub)

### ✔ .gitignore incluye:
- .env
- .next/
- node_modules/
- *.db
- logs/

### ✔ Commits siguiendo convención

---

# 📐 7. Estilo de Código (Linter + Prettier)

### ✔ ESLint configurado
Archivo: eslint.config.mjs

### ✔ Formateo automático
Consistencia en:
- indentación
- comillas
- saltos de línea

---

# 🧠 8. Buenas prácticas UX/UI

### ✔ Accesibilidad
- `<label>` en formularios  
- Mensajes claros  
- Imágenes con `alt=""`

### ✔ Mensajes amigables
Ejemplo:
> “No hay mascotas publicadas 🐾”

---

# 🧾 Resumen rápido

| Categoría | Estándar / Tecnología |
|----------|------------------------|
| Lenguaje | TypeScript (JS moderno) |
| Framework | Next.js 15 (App Router) |
| UI | React 19 + Tailwind CSS |
| ORM / BD | **Prisma ORM + SQLite (listo para subir a GitHub sin exponer datos sensibles)** |
| Seguridad | NextAuth + Roles |
| Arquitectura | App Router + Server Actions |
| Versionado | Git + GitHub |

---

# ✔ Proyecto listo para desarrollo y despliegue
El código es escalable, ordenado, seguro y compatible con buenas prácticas modernas de Next.js 15 y Prisma ORM.

