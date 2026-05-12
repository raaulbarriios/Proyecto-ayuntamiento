# 🏛️ Mapa Interactivo — Feria Real de Algeciras 2026

**Proyecto institucional del Ayuntamiento de Algeciras**  
**Versión:** 2.0 — Refactorizado  
**Fecha:** Mayo 2026  
**Estado:** En desarrollo activo

---

## 📋 Descripción General

Aplicación web institucional que ofrece un **mapa interactivo** del recinto de la Feria Real de Algeciras 2026. Los ciudadanos y visitantes pueden explorar las casetas del recinto, buscar por nombre y consultar información detallada de cada punto de interés.

El proyecto sigue estrictamente el **Manual de Identidad Visual Corporativa del Ayuntamiento de Algeciras**, garantizando coherencia visual con la imagen institucional oficial.

---

## 🏗️ Tecnologías Utilizadas

| Tecnología | Versión | Uso |
|---|---|---|
| HTML5 | — | Estructura semántica accesible |
| CSS3 (Vanilla) | — | Diseño responsive Mobile-First con Custom Properties |
| JavaScript ES6+ | — | Interactividad, patrón IIFE, módulos |
| Firebase | 10.11.0 | Firestore, Analytics, Auth, Hosting |
| Google Fonts (Inter) | — | Tipografía institucional |
| Font Awesome | 5.15.4 | Iconografía vectorial |
| GitHub | — | Control de versiones |
| Jira | — | Gestión de tareas |

---

## 📂 Estructura del Proyecto

```text
Proyecto-ayuntamiento/
│
├── index.html              → Página principal (estructura HTML semántica)
├── style.css               → Hoja de estilos completa (design tokens + responsive)
├── script.js               → Lógica de interactividad (documentada línea por línea)
├── firebase-config.js      → Configuración y conexión con servicios Firebase
├── README.md               → Este documento
├── PLANTEAMIENTO.md         → Notas de planteamiento inicial
├── DOCUMENTACION_CODIGO.md  → Documentación técnica detallada del código
├── DOCUMENTACION_PROYECTO.md → Documentación funcional del proyecto
│
└── fotos/                   → Recursos gráficos institucionales
    ├── Logo algeciras color blanco texto derecha.png  → Logo cabecera
    ├── Logo Algeciras 1 tinta fondos oscuros sin letras interiores.png → Logo footer
    ├── mapa_evento.jpg      → Imagen base del mapa del recinto ferial
    └── [otros logos]        → Variantes del escudo oficial
```

### Explicación de Archivos Principales

| Archivo | Responsabilidad |
|---|---|
| `index.html` | Maquetación semántica: `<header>` institucional, `<main>` con título y mapa SVG interactivo, `<aside>` panel deslizante, `<footer>` oficial. Incluye skip-link, aria-live region y backdrop overlay. |
| `style.css` | Sistema de diseño completo con 30+ Custom Properties (design tokens). Layout fullscreen sin scrollbar visible. Responsive con 3 breakpoints. Queries de accesibilidad (`prefers-reduced-motion`, `forced-colors`). |
| `script.js` | Lógica encapsulada en IIFE. Objeto CONFIG centralizado. Estado de app (appState). Funciones genéricas reutilizables. Trampa de foco. Búsqueda unificada escritorio/móvil. Preparado para Firebase. |
| `firebase-config.js` | Inicializa Firebase App, Firestore, Analytics y Auth. Exporta instancias como módulos ES6. |

---

## 📱 Responsive Design (Mobile-First)

El frontend utiliza un enfoque **Mobile-First** con tres breakpoints:

| Breakpoint | Dispositivo | Comportamiento |
|---|---|---|
| Base (< 480px) | Móvil pequeño | Panel ocupa 100% ancho. Título reducido. Buscador móvil (lupa). |
| `≥ 768px` | Tablet | Panel lateral 380px. Mapa con más espacio. |
| `≥ 992px` | Escritorio | Cabecera expandida (90px). Navegación + buscador desktop visibles. Lupa móvil oculta. |

### Diseño Fullscreen
- El `body` tiene `overflow: hidden` — **no hay scrollbar vertical visible**.
- El contenido principal (`<main>`) tiene scroll interno con scrollbar oculta.
- Header y footer permanecen fijos/visibles en todo momento.

---

## ♿ Accesibilidad (WCAG)

### Criterios Implementados

| Criterio | Implementación |
|---|---|
| Skip Link | Enlace oculto que aparece con Tab, permite saltar al contenido principal |
| Roles ARIA | `role="banner"`, `role="main"`, `role="dialog"`, `role="search"`, `role="contentinfo"` |
| aria-live | Región `aria-live="polite"` anuncia resultados de búsqueda y apertura/cierre de paneles |
| aria-modal | Panel lateral marcado como `aria-modal="true"` |
| Navegación por teclado | Casetas del mapa con `tabindex="0"`, activables con Enter/Espacio |
| Tecla Escape | Cierra panel lateral y buscador móvil con prioridad lógica |
| Focus visible | Anillo de foco amarillo institucional (`#ffc72c`) con `outline-offset: 2px` |
| Tamaños táctiles | Botones mínimo 44×44px (WCAG 2.5.5) |
| `prefers-reduced-motion` | Desactiva animaciones si el usuario lo solicita en su sistema |
| `forced-colors` | Compatibilidad con modo de alto contraste de Windows |
| Textos alternativos | Todas las imágenes con `alt` descriptivo |
| SVG accesible | `<title>` y `<desc>` dentro del SVG del mapa |

---

## ✨ Mejoras Realizadas (v2.0)

### HTML
- ✅ Añadido `<meta name="description">` para SEO
- ✅ Añadido `<meta name="theme-color">` para navegadores móviles
- ✅ Añadido skip-link de accesibilidad
- ✅ Añadido `aria-live` region para anuncios a lectores de pantalla
- ✅ Añadido `aria-modal="true"` al panel lateral
- ✅ Añadido backdrop overlay para cerrar panel al clicar fuera
- ✅ Añadido contenedor `#dynamicContent` para datos futuros de Firebase
- ✅ Añadido `<title>` y `<desc>` al SVG del mapa
- ✅ Envuelto contenido en `<main>` con scroll interno (fullscreen)

### CSS
- ✅ **30+ Custom Properties** (design tokens) para colores, espaciados, tipografía, sombras, bordes, transiciones y z-index
- ✅ Layout fullscreen: `overflow: hidden` en body, scroll interno en main
- ✅ Scrollbar oculta en Firefox, Chrome/Safari y Edge
- ✅ Breakpoint tablet añadido (768px)
- ✅ Skip-link y `.srOnly` estilos de accesibilidad
- ✅ Overlay backdrop con transición
- ✅ Estado `.active` para casetas seleccionadas en el mapa
- ✅ `prefers-reduced-motion` y `forced-colors` queries
- ✅ Botón cerrar panel con tamaño táctil mínimo (44×44px)

### JavaScript
- ✅ Objeto **CONFIG** centralizado con todos los selectores, clases y mensajes
- ✅ Objeto **appState** para rastreo de estado de la aplicación
- ✅ Función `updateAccessibility()` genérica reutilizable
- ✅ Función `announceToScreenReader()` para aria-live
- ✅ Función `executeSearch()` unificada (escritorio + móvil)
- ✅ Función `renderDynamicContent()` preparada para Firebase
- ✅ Función `loadDataFromSource()` placeholder para Firestore
- ✅ Cierre por backdrop overlay
- ✅ Foco automático en panel al abrir
- ✅ Escape con prioridad lógica (panel > buscador)
- ✅ Documentación exhaustiva en cada función y bloque

---

## 🔥 Integración con Firebase

### Estado Actual
El archivo `firebase-config.js` inicializa los siguientes servicios:

| Servicio | Variable | Estado |
|---|---|---|
| Firebase App | `app` | ✅ Inicializado |
| Firestore | `db` | ✅ Inicializado, sin consultas activas |
| Analytics | `analytics` | ✅ Activo |
| Auth | `auth` | ✅ Inicializado, sin uso activo |

### Pasos para Integración Completa

1. **Crear colección `casetas`** en Firestore con documentos que contengan: `name`, `street`, `coordinates`, `type`, `schedule`, `capacity`.
2. **En `script.js`**: Reemplazar el contenido de `loadDataFromSource()` con una llamada real a `getDocs(collection(db, 'casetas'))`.
3. **En `handleMapItemInteraction()`**: Buscar el documento de Firestore por `data-id` en lugar de leer `data-*` del DOM.
4. **Usar `renderDynamicContent()`** para inyectar los datos adicionales de Firebase en el panel lateral.
5. **Desplegar en Firebase Hosting**: `firebase deploy --only hosting`.

---

## 🔧 Variables JavaScript Reutilizables

### CONFIG (Configuración)
```javascript
CONFIG.selectors    // Todos los selectores CSS del DOM
CONFIG.classes      // Clases CSS que se manipulan dinámicamente
CONFIG.aria         // Nombres de atributos ARIA
CONFIG.messages     // Textos del usuario (fácil de traducir)
CONFIG.timing       // Tiempos de animación/delay
```

### appState (Estado)
```javascript
appState.selectedItemId    // ID de la caseta seleccionada
appState.isPanelOpen       // Boolean: panel lateral abierto
appState.isMobileSearchOpen // Boolean: buscador móvil abierto
```

### Funciones Reutilizables
| Función | Propósito | Reutilizable para |
|---|---|---|
| `updateAccessibility()` | Actualiza atributos ARIA | Cualquier componente interactivo |
| `announceToScreenReader()` | Anuncia a lectores de pantalla | Cualquier acción del usuario |
| `openDetailsPanel()` | Muestra panel con datos | Cualquier tipo de contenido |
| `closeDetailsPanel()` | Oculta panel y limpia | — |
| `executeSearch()` | Busca por nombre | Cualquier colección de datos |
| `renderDynamicContent()` | Renderiza datos en panel | Datos de Firebase/JSON |
| `loadDataFromSource()` | Carga datos externos | Cualquier colección Firestore |

---

## 🛠️ Instrucciones de Mantenimiento

### Cambiar Colores Institucionales
Editar las variables en `:root` de `style.css`. **No buscar/reemplazar** valores hex por todo el código.

### Añadir Nuevas Casetas al Mapa
1. Abrir `index.html`.
2. Dentro del `<svg id="eventMap">`, añadir un nuevo `<rect>` con:
   - Coordenadas `x`, `y`, `width`, `height` correctas.
   - `class="mapItem"`, `tabindex="0"`, `role="button"`.
   - `aria-label` descriptivo, `data-name` y `data-street`.
3. El JavaScript detectará automáticamente los nuevos elementos.

### Modificar Textos del Usuario
Editar el objeto `CONFIG.messages` en `script.js`. Todos los textos están centralizados ahí.

### Cambiar Breakpoints Responsive
Buscar la sección `8. MEDIA QUERIES` en `style.css`. Los breakpoints son: `480px`, `768px`, `992px`.

### Actualizar el Mapa (nueva imagen)
1. Reemplazar `fotos/mapa_evento.jpg` con la nueva imagen.
2. Ajustar las coordenadas de los `<rect>` en el SVG si el plano cambió.
3. Mantener el `viewBox="0 0 800 600"` o ajustarlo a las proporciones de la nueva imagen.

---

## 📋 Instrucciones para Futuros Desarrolladores

1. **Leer primero** `DOCUMENTACION_CODIGO.md` para entender la arquitectura técnica.
2. **No modificar** visualmente el header ni el footer — están aprobados institucionalmente.
3. **Respetar** el patrón IIFE en JavaScript y el objeto CONFIG centralizado.
4. **Usar** las Custom Properties de CSS para cualquier nuevo estilo.
5. **Documentar** todo nuevo código con comentarios claros en español.
6. **Probar** en móvil, tablet y escritorio antes de cada despliegue.
7. **Probar accesibilidad** con teclado (Tab, Enter, Escape) y lectores de pantalla.
8. **Desplegar** siempre a Firebase Hosting: `firebase deploy --only hosting`.

---

## 🚀 Recomendaciones para Futuras Ampliaciones

- [ ] Mapear casetas reales con coordenadas SVG exactas sobre el plano oficial.
- [ ] Conectar Firestore con `loadDataFromSource()` para datos dinámicos.
- [ ] Implementar filtrado por categoría (peñas, municipales, privadas).
- [ ] Añadir geolocalización del usuario sobre el mapa.
- [ ] Convertir logos PNG a SVG o WebP para mejor rendimiento.
- [ ] Implementar Service Worker para funcionamiento offline.
- [ ] Añadir modo oscuro respetando la paleta institucional.
- [ ] Internacionalización (i18n) para turistas (inglés, francés).
- [ ] Probar en dispositivos reales Android/iOS antes del lanzamiento.

---

*Documento generado para el proyecto Mapa Interactivo Feria Real de Algeciras 2026.*  
*Ayuntamiento de Algeciras — Área de Innovación y Tecnología*
