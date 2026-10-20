# MiA de Carvajal — Hub (página web)

Página HTML pura (sin instalar nada): carga → nombre → mapa con 4 portales → mundos.
Escritorio, lienzo fijo de 1920×1080 que se escala a la ventana.

## Abrirla en tu PC
Los navegadores bloquean algunas cosas si abres `index.html` con doble clic (videos y almacenamiento). Mejor un servidor local:

```
cd web
python -m http.server 8123
```
y abre http://localhost:8123 . (Con `npx serve` también sirve.)

Modo de pruebas: http://localhost:8123/?debug  → muestra botones "Completar 1–4" y "Reiniciar".

## Qué hay en cada carpeta
- `index.html` — estructura de las pantallas.
- `css/estilos.css` — todo el diseño.
- `js/datos.js` — **textos y posiciones de los 4 mundos** (títulos, subtítulos, emblemas, coordenadas leídas de layout.json).
- `js/estado.js` — progreso (nombre, mundos completados, estrellas). Se guarda en el navegador (localStorage).
- `js/iconos.js` — emblemas de los portales (SVG provisionales) y candado/check.
- `js/app.js` — lógica: carga, hub, desbloqueo en orden, hover, minimapa, corte, mundos.
- `assets/hub/` — capas renderizadas en Blender (fondo, portales, mascota).
- `assets/video/` — `hover_0N.webm` (ya están) y **`corte_0N.mp4`** (la mascota entrando al portal N).
- `assets/ui/` — logos oficiales.

## Pendiente de poner (la página funciona sin ellos, con reemplazos provisionales)
1. `assets/ui/logo_mia_carvajal.png` — logo "MiA de Carvajal" (PNG con fondo transparente).
2. `assets/ui/logo_carvajal.png` — isotipo de Carvajal para la bandera.
3. `assets/video/corte_01.mp4` … `corte_04.mp4` — salen del render de Blender (`out\`). Mientras no existan, la mascota hace un salto provisional hacia el portal.
4. El contenido de cada mundo (curso y preguntas): hoy cada mundo muestra una pantalla provisional.

## Publicar en GitHub Pages
1. Crea un repositorio y sube **el contenido de la carpeta `web/`** (que `index.html` quede en la raíz).
2. Settings → Pages → Source: *Deploy from a branch* → rama `main`, carpeta `/ (root)`.
3. A los minutos queda en `https://TU-USUARIO.github.io/NOMBRE-REPO/`.

Ojo: GitHub Pages gratis requiere repositorio **público** (el código y los archivos serán visibles). Confirma con tu jefe si eso es aceptable; si no, SharePoint u otro alojamiento interno.
Mantén el sitio por debajo de ~1 GB.
