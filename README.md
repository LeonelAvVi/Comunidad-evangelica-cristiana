# Comunidad Cristiana — Sucre

Sitio de la iglesia con agenda de eventos por sector (Niños, Adolescentes, Jóvenes y Matrimonios), panel administrador y despliegue pensado para **Vercel + Firebase**.

La identidad visual parte de `landing.html` (logo institucional: manos + arcoíris, paleta teal y acentos por sector).

## Qué incluye

- Landing con presentación, sectores, feed de eventos próximos y horarios
- Subpáginas por sector, con color propio y redes (Comunidad Juvenil ya tiene enlaces)
- Ficha de cada evento con enlace compartible (`/eventos/[id]`)
- Botón **Compartir**: en el celular usa el share nativo (con flyer si hay); en escritorio arma una tarjeta descargable y permite copiar enlace o texto
- Panel `/admin` con usuario y contraseña: alta, edición, baja, lista y calendario
- Cada evento tiene título, descripción, fecha y hora, lugar, sector e imagen/flyer

Sin Firebase configurado, la landing muestra eventos de ejemplo para poder diseñar y navegar. El panel admin pide las claves reales.

## Desarrollo local

```bash
npm install
cp .env.example .env.local
npm run dev
```

Abrí [http://localhost:3000](http://localhost:3000).

## Firebase

1. Creá un proyecto en [Firebase Console](https://console.firebase.google.com).
2. Habilitá **Authentication** → correo y contraseña, y creá el usuario (o los usuarios) del panel.
3. Creá **Firestore** (modo producción) y **Storage**.
4. Registrá una app web y copiá las claves a `.env.local` (y después a Vercel).
5. Publicá las reglas:

```bash
npx firebase-tools login
npx firebase-tools use --add
npx firebase-tools deploy --only firestore:rules,storage
```

Opcional, para que el botón de compartir pueda leer el flyer desde el navegador:

```bash
npx firebase-tools storage:cors set cors.json
```

Colección de Firestore: `events`, con `title`, `description`, `startsAt`, `location`, `sector` (`ninos` | `adolescentes` | `jovenes` | `matrimonios`) e `imageUrl`.

## Vercel

1. Importá el repo en Vercel.
2. Cargá las mismas variables `NEXT_PUBLIC_FIREBASE_*`.
3. Deploy. El hosting del sitio queda en Vercel; los datos, el login y las imágenes quedan en Firebase.

## Pendientes de contenido

Textos, fotos y logos definitivos de Niños, Adolescentes y Matrimonios se pueden sumar después en `lib/sectors.ts` y en el panel, sin cambiar la estructura del sitio.
