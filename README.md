🧩 1. Estándares de Lenguaje (TypeScript + React + Next.js)
✅ Buenas prácticas aplicadas

Tipado estático con TypeScript (.ts / .tsx)
Permite detectar errores antes de ejecutar el código.

Componentes modulares y reutilizables
Cada página (page.tsx) y componente (HeroSlider, NavBar, etc.) está encapsulado.

Funciones puras y async/await para operaciones con Prisma y Fetch API.

Uso de Server Actions ("use server")
Estandariza las funciones del lado del servidor según Next.js 15.

Separación de lógica y presentación
(Por ejemplo: /app/admin/donations/page.tsx muestra, /app/admin/donations/actions.ts procesa).

Convenciones de nombres camelCase / PascalCase

Archivos: createPet.ts, page.tsx

Componentes: HeroSlider, NavBar

Variables: bankName, photoUrl, createdAt

🎨 2. Estándares de Diseño y Frontend (Tailwind CSS + UI)
✅ Buenas prácticas

Uso de Tailwind CSS, que promueve:

Clases utilitarias concisas.

Consistencia visual.

Responsividad integrada (md:grid-cols-2, sm:hidden, etc.).

Diseño responsive-first compatible con móviles y desktop.

Colores y tipografía coherentes con la identidad visual del proyecto.

Uso de componentes accesibles (<button>, <label>, <input> con atributos name y placeholder).

🧱 3. Estructura de Carpetas Estandarizada (Next.js App Router)
app/
 ├─ admin/
 │   ├─ donations/
 │   ├─ pets/
 │   ├─ events/
 │   └─ images/
 ├─ adopta/
 ├─ api/
 ├─ components/
 ├─ lib/
 │   ├─ prisma.ts
 │   └─ upload.ts
 ├─ layout.tsx
 ├─ globals.css
 └─ page.tsx


Ventajas:

Rutas automáticas por carpeta (/admin/pets, /adopta).

Separación clara entre backend (/lib, /api) y frontend (/app, /components).

Código limpio, mantenible y escalable.

⚙️ 4. Estándares de Base de Datos (Prisma ORM)
✅ Buenas prácticas

Migraciones versionadas (prisma/migrations/).

Enums y modelos tipados para evitar errores (ej: enum Role { ADMIN USER }).

Índices y claves únicas (@id, @unique, @@index).

Campos automáticos:
@default(now()), @updatedAt garantizan trazabilidad.

Relaciones entre modelos:
@relation(fields: [petId], references: [id], onDelete: Cascade).

🛡️ 5. Estándares de Seguridad

Variables sensibles (como DATABASE_URL, NEXTAUTH_SECRET) están en .env y nunca en el código.

Formularios protegidos con CSRF mediante NextAuth.

Uploads gestionados desde el servidor (saveImage en /lib/upload.ts).

Roles definidos: ADMIN, USER (control de acceso).

🧰 6. Control de Versiones (Git/GitHub)

Repositorio limpio con .gitignore que excluye:

node_modules, .next, .env, logs, etc.

Commits descriptivos:

feat: añadir módulo de donaciones

fix: corregir error en upload de imagen

chore: actualizar dependencias

📐 7. Estilo de Código (Linter y Formateador)

ESLint (archivo eslint.config.mjs).

Prettier o formateo automático de código con Visual Studio Code.

Consistencia en espacios, comillas, indentación y saltos de línea.

🧠 8. Buenas prácticas UX/UI

Botones y formularios accesibles y descriptivos.

Mensajes de error claros (“No hay mascotas publicadas 🐾”).

Textos alternativos (alt) en imágenes.

Diseño visual coherente con el branding de AdoptaPatitas.

🧾 Resumen rápido
Categoría	Estándar / Tecnología
Lenguaje principal	TypeScript (JS moderno)
Framework	Next.js 15 (App Router)
Librería UI	React 19 + Tailwind CSS
ORM / BD	Prisma ORM + SQLite
Control de versiones	Git / GitHub
Seguridad	NextAuth + Variables .env
Código limpio	ESLint + Prettier
Arquitectura	Basada en rutas y roles (admin/usuario)
