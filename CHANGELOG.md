# CHANGELOG — Documentación de cambios en el código

> Este documento registra todos los cambios de documentación aplicados al código fuente del proyecto
> **Mapa Interactivo de Eventos / Panel de Administración**.
> Los cambios **no alteran el comportamiento funcional** del código: solo añaden comentarios y anotaciones.

---

## Versión 4.0 — 2026-05-11 · Comentario por línea en `style.css`

### Objetivo
Añadir un comentario explicativo en **cada línea de código** de `style.css`,
describiendo qué hace cada propiedad CSS y por qué se usa.

---

### `style.css`

| Sección | Líneas | Qué explican los comentarios |
|---|---|---|
| Variables globales (`:root`) | 1–12 | Para qué sirve cada variable de color y sombra |
| Reset universal (`*`) | 14–19 | Por qué se eliminan márgenes, paddings y qué hace `box-sizing` |
| `body` | 21–27 | Fondo, color de texto, altura mínima y disposición en columna |
| `.evento-header` | 30–34 | Fondo blanco, sombra inferior y z-index |
| `.header-top` | 36–42 | Flexbox de 3 columnas: logo / título / espaciador |
| `.logo` | 44–52 | Ancho fijo de 150px para equilibrar con `.spacer` |
| `.cabecera-title` | 54–60 | `flex:1` para ocupar el espacio central |
| `.spacer` | 62–64 | Elemento vacío de equilibrio visual |
| `.header-bottom` | 66–70 | Fila inferior de la cabecera con fondo diferente |
| `.evento-title` | 72–77 | `letter-spacing` negativo para aspecto compacto |
| `.map-section` | 80–86 | `flex:1` para ocupar todo el alto restante; fondo negro de seguridad |
| `#static-map-wrapper` | 88–96 | `position:relative` como referencia de hijos absolutos |
| `#map-image` | 98–105 | `object-fit:cover` para cubrir sin deformar |
| `#markers-container` | 107–119 | `pointer-events:none` en el contenedor; los hijos lo anulan |
| `.search-container` | 121–130 | `left:50%` + `translateX(-50%)` para centrar exactamente |
| `#search-input` | 132–144 | `border-radius:999px` = píldora; `backdrop-filter` = desenfoque |
| `#search-input:focus` | 146–150 | Sombra morada + elevación de 2px al enfocar |
| `.marker-btn` | 153–171 | `translate(-50%,-50%)` para centrar en las coordenadas de JS |
| `.marker-btn:hover` | 173–178 | `scale(1.15)` elástico con `cubic-bezier` personalizado |
| `@keyframes pulse-highlight` | 180–184 | Animación de halo expansivo en 3 fotogramas (0%, 70%, 100%) |
| `.marker-btn.highlighted` | 186–192 | Verde + pulso infinito; clase añadida por JS al buscar |
| `.modal-overlay` | 195–209 | `position:fixed` + `100vw/100vh` para cubrir toda la ventana |
| `.modal-overlay.hidden` | 211–215 | `opacity:0` + `visibility:hidden` + `pointer-events:none` |
| `.info-modal` | 217–229 | `overflow-y:auto` para scroll si el contenido es largo |
| `.modal-overlay.hidden .info-modal` | 231–233 | `scale(0.9)` al cerrarse para efecto de contracción |
| `.close-btn` | 236–252 | Botón circular absoluto en esquina superior derecha |
| `.modal-content` | 254–256 | Padding interior del modal |
| `.badge` | 258–268 | `text-transform:uppercase` + `display:inline-block` necesario en `<span>` |
| `.schedule` | 277–288 | `width:fit-content` para no ocupar todo el ancho |
| `.description` | 290–297 | `line-height:1.7` para legibilidad; `border-bottom` divisor |
| `.programacion-list li` | 310–318 | Cada actividad como tarjeta blanca con sombra sutil |
| `.prog-time` | 320–325 | `width:65px` + `flex-shrink:0` para columna de hora alineada |
| `.evento-footer` | 333–342 | `justify-content:space-between` separa texto y enlace |
| `.admin-link` / hover | 350–359 | Subrayado solo en hover |
| `.navbar` | 362–376 | Barra de admin; `z-index:1000` equivalente al header |
| `.navbar .logo` | 378–381 | `width:auto` sobrescribe el 150px genérico de `.logo` |
| `.admin-body` | 392–394 | Degradado lavanda→blanco exclusivo de admin.html |
| `.admin-container` | 396–402 | Centra la tarjeta vertical y horizontalmente |
| `.glass-card` / `.dashboard-card` | 404–416 | `max-width` diferente para login vs. formulario de caseta |
| `.form-group` / `label` / `input` / `textarea` | 425–451 | Sistema de campos del formulario |
| `input:focus` / `textarea:focus` | 453–458 | Halo morado de 4px al enfocar |
| `button` (base) | 460–463 | `width:100%` sobrescrito por `.btn-danger` con `width:auto` |
| `.btn-primary/success/secondary/danger` | 465–486 | Cuatro variantes de botón: colores y tamaños diferenciados |
| `.programacion-editor` | 488–498 | Fondo diferenciado para la sección de programación en admin |
| `.prog-item` | 500–504 | Fila flex: hora + actividad + botón X |
| `.time-input` | 506–508 | `!important` necesario para sobrescribir `width:100%` heredado |
| `.act-input` | 510–512 | `flex:1` ocupa todo el espacio sobrante de la fila |
| `.hidden` | 514–516 | `display:none !important` clase utilitaria de ocultación |

---

## Versión 3.0 — 2026-05-11 · Comentario por línea en todos los archivos

### Objetivo
Añadir un comentario explicativo en **cada línea de código** de los cinco archivos del proyecto,
de forma que cualquier persona pueda entender qué hace cada instrucción sin conocimientos previos de programación.

---

### `index.html`

| Línea(s) | Cambio |
|---|---|
| 1 | Explicación de la declaración DOCTYPE |
| 2 | Explicación del atributo `lang="es"` |
| 4–5 | Explicación de las metas de codificación y viewport |
| 7–8 | Explicación de la carga de CSS y Google Fonts |
| 10 | Explicación de la clase `public-body` |
| 11–23 | Comentarios en cada elemento del `<header>` (logo, título, espaciador) |
| 26–34 | Comentarios sobre el contenedor del mapa, el buscador flotante y la imagen |
| 34 | Explicación de `markers-container` como zona de inyección dinámica de JS |
| 37–52 | Comentarios del modal: overlay, cuadro blanco, botón cierre, campos de detalle |
| 48 | Nota sobre la inyección dinámica de actividades por parte de `app.js` |
| 57–60 | Explicación del footer y el enlace de acceso a administración |
| 62 | Explicación de `type="module"` y por qué el `<script>` va al final del body |

---

### `admin.html`

| Línea(s) | Cambio |
|---|---|
| 1–9 | Comentarios de cabecera idénticos a `index.html`; se señala la diferencia de pesos de fuente |
| 10 | Explicación de la clase `admin-body` como diferenciador de layout |
| 11–16 | Comentarios en cada elemento de la barra de navegación del panel |
| 18–20 | Explicación del `<main>` y la clase `admin-container` |
| 24–30 | Comentarios del bloque de identificación (ownerId): estilos inline, flex, botón de carga |
| 27 | Nota sobre quién lee este campo (`admin.js`) |
| 28 | Nota sobre el listener de clic de `admin.js` |
| 32 | Explicación de la clase `hidden` y cuándo la elimina `admin.js` |
| 33–44 | Comentarios de cada grupo de campo: nombre, descripción y horario |
| 46–52 | Comentarios del editor de programación: contenedor dinámico y botón de añadir |
| 49 | Nota sobre la inyección dinámica por `admin.js` |
| 54 | Explicación del botón de guardado y su listener |
| 60 | Explicación de `type="module"` y posición del script |

---

### `firebase-config.js`

| Línea(s) | Cambio |
|---|---|
| 1–4 | Explicación de cada `import`: qué servicio de Firebase activa |
| 6–15 | Comentario en cada propiedad del objeto `firebaseConfig` (apiKey, authDomain, etc.) |
| 17 | Explicación de `initializeApp` y lo que devuelve |
| 18 | Explicación de `getAnalytics` y su función de seguimiento |
| 19 | Explicación de `getFirestore` como base de datos principal del proyecto |
| 20 | Explicación de `getAuth` y su uso potencial futuro |
| 22 | Explicación de `export` y cómo lo usan otros archivos |

---

### `app.js`

| Línea(s) | Cambio |
|---|---|
| 1–2 | Comentarios de los dos `import`: conexión a Firebase y funciones de Firestore |
| 5–13 | Comentario en cada constante del DOM explicando qué elemento HTML controla |
| 16 | Explicación del array `puntosData` y para qué sirve en el buscador |
| 19–21 | Comentario del listener de cierre del modal por botón |
| 24–28 | Comentario del listener de cierre por clic en el overlay |
| 31–55 | Comentarios en cada línea de `cargarDatos`: `onSnapshot`, limpieza del estado, iteración de documentos, manejo de errores |
| 57–78 | Comentarios en cada línea de `renderizarBoton`: creación del botón, posicionado CSS, etiqueta numérica, listener, registro en `puntosData` |
| 81–98 | Comentarios del buscador: lectura del input, limpieza de resaltados, lógica de inclusión/exclusión |
| 100–122 | Comentarios de `mostrarInfoPunto`: relleno de campos, limpieza de la lista, renderizado de actividades y mensaje de fallback |
| 125 | Explicación de `DOMContentLoaded` y por qué es necesario |

---

### `admin.js`

| Línea(s) | Cambio |
|---|---|
| 1–2 | Comentarios de los dos `import`: conexión a Firebase y funciones específicas de Firestore |
| 5–14 | Comentario en cada constante del DOM explicando qué elemento controla |
| 17–19 | Explicación de `currentDocId`: cuándo es `null`, cuándo se asigna y para qué sirve |
| 22–48 | Comentarios de `crearProgItem`: creación del contenedor, los dos inputs y el botón X; listener de borrado; `appendChild` de cada elemento |
| 51–53 | Comentario del listener de `addActBtn` |
| 56–84 | Comentarios del listener de `loadBtn`: validación de ownerId, feedback visual, construcción de la query, manejo de resultados vacíos y exitosos, relleno del formulario, inyección de la programación |
| 87–112 | Comentarios del listener de `saveBtn`: validación de `currentDocId`, recogida de actividades del DOM, filtrado de filas vacías, `updateDoc`, recarga de página, manejo de error |

---

## Versión 2.0 — 2026-05-11 · Comentarios JSDoc por sección

### Objetivo
Añadir comentarios profesionales al estilo **JSDoc** en los tres archivos JavaScript,
organizados por secciones con cabeceras, `@param`, `@returns`, `@type` y `@listens`.
Orientado a que una herramienta de documentación automática (como JSDoc o Docusaurus) pueda generar documentación web a partir del código.

#### Archivos modificados
- `firebase-config.js` — Cabecera `@file`, `@exports`, `@property` en cada campo del config
- `app.js` — Cabecera `@file`, `@module`, JSDoc en las tres funciones y en los dos listeners
- `admin.js` — Cabecera `@file` con flujo de uso en 4 pasos, JSDoc en `crearProgItem` con `@sideeffect`, JSDoc en los dos listeners con `@async` y `@returns`

---

## Versión 1.0 — 2026-05-11 · Comentarios descriptivos iniciales

### Objetivo
Primera ronda de comentarios en lenguaje natural en español, orientados a que
cualquier persona sin conocimientos técnicos pueda entender el código al leerlo.

#### Archivos modificados
- `admin.js` — Secciones marcadas con bloques `// ===`, explicaciones de `import`, `try/catch/finally`, `async/await`, referencias DOM

---

> **Nota:** Ninguno de los cambios listados en este documento modifica la lógica ni el comportamiento del sistema.
> El código funciona exactamente igual antes y después de estos cambios.
