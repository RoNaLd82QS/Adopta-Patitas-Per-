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

