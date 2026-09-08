# Comunidad Cristiana — Sucre

Sitio de la iglesia con agenda de eventos por sector (Niños, Adolescentes, Jóvenes y Matrimonios), panel administrador y despliegue pensado para **Vercel + Firebase + Cloudinary**.

La identidad visual parte de `landing.html` (logo institucional: manos + arcoíris, paleta teal y acentos por sector).

## Qué incluye

- Landing con presentación, sectores, feed de eventos próximos y horarios
- Subpáginas por sector, con color propio y redes (Comunidad Juvenil ya tiene enlaces)
- Ficha de cada evento con enlace compartible (`/eventos/[id]`)
- Botón **Compartir**: en el celular usa el share nativo (con flyer si hay); en escritorio arma una tarjeta descargable y permite copiar enlace o texto
- Panel `/admin` con usuario y contraseña: alta, edición, baja, lista y calendario
- Cada evento tiene título, descripción, fecha y hora, lugar, sector e imagen/flyer (imágenes en Cloudinary)

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
3. Creá **Firestore** (modo producción).
4. Registrá una app web y copiá las claves a `.env.local` (y después a Vercel).
5. Publicá las reglas:

```bash
npx firebase-tools login
npx firebase-tools use --add
npx firebase-tools deploy --only firestore:rules
```

Colección de Firestore: `events`, con `title`, `description`, `startsAt`, `location`, `sector` (`ninos` | `adolescentes` | `jovenes` | `matrimonios`) e `imageUrl` (URL de Cloudinary).

## Cloudinary (imágenes / flyers)

1. Creá una cuenta en [Cloudinary](https://cloudinary.com).
2. En **Settings → Product environment credentials** copiá el **Cloud name**.
3. En **Settings → Upload → Upload presets**, creá un preset:
   - **Signing mode**: Unsigned
   - (Opcional) **Folder**: `events`
4. En `.env.local` (y en Vercel) cargá:

```bash
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=tu_cloud_name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=tu_preset_unsigned
```

## Vercel

1. Importá el repo en Vercel.
2. Cargá las variables `NEXT_PUBLIC_FIREBASE_*` y `NEXT_PUBLIC_CLOUDINARY_*`.
3. Deploy. El hosting queda en Vercel; Auth/datos en Firebase; imágenes en Cloudinary.

## Pendientes de contenido

Textos, fotos y logos definitivos de Niños, Adolescentes y Matrimonios se pueden sumar después en `lib/sectors.ts` y en el panel, sin cambiar la estructura del sitio.
