# Mapa de la Feria Real - Ayuntamiento de Algeciras

Este proyecto es una aplicación frontend diseñada para ofrecer un mapa interactivo de la Feria Real de Algeciras. Permite a los usuarios explorar las distintas casetas, visualizar información detallada y realizar búsquedas de forma intuitiva tanto en dispositivos móviles como de escritorio.

El desarrollo está estrictamente regido por el **Manual de Identidad Visual Corporativa del Ayuntamiento de Algeciras**, garantizando una imagen limpia, profesional e institucional.

---

## 🏗️ Arquitectura y Tecnologías Usadas

El proyecto está desarrollado utilizando tecnologías estándar de la web para garantizar la máxima compatibilidad, velocidad y facilidad de integración con plataformas modernas:

- **HTML5**: Estructurado de forma semántica y altamente accesible (WCAG).
- **CSS3 Vanilla**: Hojas de estilo modulares (arquitectura tipo BEM adaptada), variables nativas y diseño *Mobile-First*.
- **JavaScript Vanilla (ES6+)**: Lógica limpia modular (patrón IIFE), comentada línea por línea y sin dependencias o frameworks externos.
- **Firebase**: (En preparación) Estructura lista para integrarse con Firebase Hosting, Authentication y Firestore/Realtime Database para cargar la información dinámicamente.

---

## 📂 Estructura de Archivos y Carpetas

La estructura del proyecto en la raíz es sencilla y fácil de mantener:

```text
/ (Raíz del Proyecto)
│
├── index.html           # Archivo principal de la interfaz web.
├── style.css            # Hoja de estilos principal refactorizada.
├── script.js            # Lógica interactiva del DOM.
├── firebase-config.js   # (Si existe) Archivo de inicialización para servicios de Google Firebase.
├── /fotos/              # Directorio de assets estáticos (logotipos, escudo, mapa base).
└── README.md            # Este documento.
```

### Explicación de Archivos Principales:
- **`index.html`**: Contiene la maquetación semántica. Está dividido en áreas lógicas: `<header>` institucional, `<section>` para el título, `<main>` para el mapa SVG y `<aside>` para el panel de detalles, terminando con un `<footer>` oficial.
- **`style.css`**: Centraliza toda la estética. Empieza definiendo variables institucionales basadas en valores Pantone, luego reglas globales, luego componentes específicos, terminando con *Media Queries* para gobernar el responsive.
- **`script.js`**: Controla el comportamiento al tocar botones, el cierre de menús al perder el foco, y la futura carga de eventos en el SVG del mapa interactivo.

---

## 📱 Responsive Design Implementado

El frontend ha sido programado con un enfoque **Mobile First**:
1. **Vista Móvil (Dispositivos pequeños)**: 
   - El panel lateral de información se expande al 100% de la pantalla.
   - Solo se muestra un botón minimalista de búsqueda (lupa) que despliega una barra adaptativa mediante suaves transiciones CSS.
2. **Vista Escritorio (Pantallas > 992px)**: 
   - La cabecera se amplía para darle mayor protagonismo al logotipo del Ayuntamiento.
   - El menú de navegación y la barra de búsqueda de escritorio aparecen integrados en la zona superior derecha.
   - El buscador móvil queda desactivado y oculto por completo para evitar colisiones lógicas.

---

## ♿ Accesibilidad (WCAG)

El proyecto incluye medidas vitales para garantizar el acceso universal a ciudadanos con capacidades diversas:
- **Lectores de Pantalla**: Inclusión masiva de atributos `aria-label`, `aria-hidden` y `aria-expanded` para narrar el estado dinámico de componentes como el buscador y el panel.
- **Roles HTML**: Uso de etiquetas ARIA como `role="search"`, `role="banner"`, `role="dialog"` y `role="application"` para definir el significado del contenido.
- **Navegación por Teclado**: 
  - Anillos de enfoque de alto contraste (Amarillo institucional `var(--focus-ring-color)`) utilizando el selector `:focus-visible`.
  - Atributo `tabindex="0"` en los elementos del mapa SVG.
  - Listeners en JS para activar componentes pulsando `Enter` o `Space` y poder cerrar menús con `Escape`.

---

## ✨ Mejoras y Cambios Realizados Respecto al Original

1. **Estructura CSS**: Se ha limpiado la redundancia, agrupado por bloques lógicos y añadido variables globales que extraen los valores exactos (Pantone) del Manual de Identidad de Algeciras.
2. **Botón de Búsqueda Móvil**: Rediseñado para ser completamente táctil, redondeado, con efecto hover y sin interferir en escritorio al girar el dispositivo.
3. **Optimización JS**: El código fue envuelto en una estructura IIFE que protege el scope global.
4. **Respeto Absoluto al Diseño**: No se alteraron los colores base, ni la jerarquía institucional existente en cabecera o footer, manteniéndolo intacto visualmente pero muy superior internamente.

---

## 🚀 Integración Prevista con Firebase

Actualmente, los datos de las casetas (nombre, calle) residen como atributos HTML (`data-name`, `data-street`).
**Próximos pasos recomendados:**
1. Inicializar `firebase-config.js` y conectar a Firestore o Realtime DB.
2. Descargar un JSON dinámico al cargar la página en `script.js`.
3. Modificar la función `handleMapItemClick()` para que, en lugar de leer el DOM, lea el JSON basándose en un ID de caseta (`data-id`).
4. Almacenar este proyecto estático en **Firebase Hosting**, lo que garantizará carga casi instantánea mediante su CDN global.

---

## 🛠️ Instrucciones de Mantenimiento para Futuros Desarrolladores

- **Alteraciones de Color**: Si el Ayuntamiento decide actualizar el "Azul Digital", no busques y reemplaces valores hexadecimales por todo el código. Simplemente dirígete a `style.css` y modifica la variable `:root { --color-azul-digital: ... }`.
- **Modificación de JavaScript**: El archivo `script.js` está minuciosamente documentado. Por favor, lee los bloques de comentarios antes de alterar los escuchadores de eventos y respeta el uso de `e.stopPropagation()` en los menús desplegables para no romper la funcionalidad de "cerrar al perder el foco".
- **SVG del Mapa**: Si el plano de la Feria cambia, debes subir el nuevo archivo JPG/PNG a `/fotos` y actualizar las coordenadas `<rect>` en el HTML del mapa SVG (`index.html`). Asegúrate de que las nuevas formas SVG sigan teniendo `tabindex="0"` y `class="mapItem"`.
