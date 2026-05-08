# 📋 Documentación del Proyecto: Mapa Interactivo Feria Real de Algeciras 2026

**Versión:** 1.0  
**Fecha:** Mayo 2026  
**Organismo:** Ayuntamiento de Algeciras  
**Estado:** En desarrollo  

---

## 1. Descripción General

Este proyecto es una **aplicación web interactiva** orientada principalmente a dispositivos móviles que permite a los ciudadanos y visitantes de la Feria Real de Algeciras 2026 explorar el recinto ferial a través de un mapa interactivo. Los usuarios pueden hacer clic sobre las diferentes casetas del mapa para obtener información detallada sobre cada una de ellas.

La aplicación forma parte de la presencia digital del **Ayuntamiento de Algeciras** y sigue estrictamente las directrices de identidad visual institucional (colores, tipografía, logotipos y estructura de la web oficial del ayuntamiento).

---

## 2. Objetivo

- Proporcionar un **mapa del recinto ferial** accesible desde cualquier dispositivo móvil.
- Permitir la **búsqueda por nombre de caseta** para localizar de forma rápida un punto de interés.
- Mostrar **información detallada** de cada caseta al hacer clic sobre ella.
- Mantener la coherencia visual con la **imagen institucional del Ayuntamiento de Algeciras**.

---

## 3. Arquitectura del Proyecto

El proyecto sigue una arquitectura web sencilla y ligera, sin frameworks de JavaScript adicionales:

```
Proyecto-ayuntamiento/
├── index.html              → Estructura HTML de la página
├── style.css               → Todos los estilos visuales (diseño, responsive)
├── script.js               → Lógica de la aplicación (interactividad, búsqueda)
├── firebase-config.js      → Configuración y conexión con Firebase
├── fotos/                  → Recursos gráficos del proyecto
│   ├── Logo Algeciras color sin letras interiores.png    → Logo para cabecera
│   ├── Logo Algeciras 1 tinta fondos oscuros sin letras interiores.png → Logo para pie de página
│   └── mapa_evento.jpg     → Imagen del mapa real de la feria
└── PLANTEAMIENTO.md        → Notas de planteamiento inicial del proyecto
```

**Tecnologías utilizadas:**

| Tecnología | Uso |
|---|---|
| HTML5 | Estructura semántica de la página |
| CSS3 | Estilos, animaciones y diseño responsive |
| JavaScript (ES Modules) | Interactividad, búsqueda y conexión con Firebase |
| Firebase Firestore | Base de datos en tiempo real para datos de casetas |
| Firebase Analytics | Seguimiento de uso de la aplicación |
| Firebase Auth | Autenticación (preparada para uso futuro) |
| Google Fonts (Inter) | Tipografía institucional |

---

## 4. Estructura de la Página (Boceto de Secciones)

La página se divide en las siguientes secciones principales, siguiendo el boceto de diseño aprobado:

```
┌─────────────────────────────────────────────┐
│  1. CABECERA                                │
│  [Logo] Ayuntamiento de Algeciras  [Buscar] │
│                                 [Nav Links] │
├─────────────────────────────────────────────┤
│  2. TÍTULO DEL EVENTO                       │
│      FERIA REAL DE ALGECIRAS 2026           │
├─────────────────────────────────────────────┤
│  4. MAPA DEL RECINTO FERIAL                 │
│  ┌───────────────────────────────────────┐  │
│  │   [mapa_evento.jpg]                   │  │
│  │   [SVG interactivo superpuesto]       │  │
│  └───────────────────────────────────────┘  │
├─────────────────────────────────────────────┤
│  5. PANEL DE DETALLE (Aparece al pulsar     │
│     una caseta, se desliza desde abajo)     │
├─────────────────────────────────────────────┤
│  6. PIE DE PÁGINA                           │
│  [Logo blanco]  ayuntamientoalgeciras  [©]  │
└─────────────────────────────────────────────┘
```

---

## 5. Diseño Visual e Identidad Institucional

### Paleta de Colores

| Variable CSS | Color | Uso |
|---|---|---|
| `--primaryColor` | `#1a6abf` | Color azul principal del ayuntamiento |
| `--secondaryColor` | `#003a7a` | Azul oscuro para bordes y acentos |
| `--accentColor` | `#f0a500` | Dorado para elementos activos/destacados |
| `--white` | `#ffffff` | Fondos claros y texto en barras azules |
| `--lightGray` | `#f0f4f8` | Fondo general de la página |
| `--textColor` | `#2c3e50` | Color del texto principal |

### Gradiente Institucional

Las barras de cabecera y pie de página utilizan el degradado oficial:
```css
background: linear-gradient(to right, #00599f, #2989d8, #00599f);
```

### Tipografía

- **Fuente principal:** Inter (Google Fonts, peso 500 - Medium)
- La fuente Inter se carga de forma asíncrona para evitar retrasos en la carga.

### Logotipos

- **Cabecera:** `Logo Algeciras color sin letras interiores.png` (logo a color sobre fondo azul)
- **Pie de página:** `Logo Algeciras 1 tinta fondos oscuros sin letras interiores.png` (logo en tinta blanca)

---

## 6. Diseño Responsive (Mobile First)

La aplicación está diseñada prioritariamente para **dispositivos móviles**. La estrategia de diseño es Mobile First:

### Breakpoints

| Viewport | Comportamiento |
|---|---|
| `max-width: 600px` | **Móvil:** Cabecera compacta, fuentes reducidas, barra de búsqueda ajustada |
| `min-width: 768px` | **Escritorio:** Cabecera expandida (100px de alto), mapa con más espacio |

### Comportamiento en Móvil (< 600px)

- La cabecera muestra el **logo grande (55px)** y el texto del ayuntamiento a la izquierda.
- A la derecha se muestran la **caja de búsqueda** y los **enlaces de navegación** en tamaño micro.
- El pie de página es una barra ultracompacta con el logo pequeño y el copyright.
- El **footer siempre aparece al final de la página**, garantizado por `body { display: flex; flex-direction: column; min-height: 100vh; }`.

---

## 7. Funcionalidades

### 7.1 Mapa Interactivo

- Se muestra la imagen `fotos/mapa_evento.jpg` como capa base del mapa.
- Sobre la imagen se superpone un SVG transparente con elementos clicables (`.mapItem`) que representan las casetas.
- Al hacer clic en una caseta, se muestra el **Panel de Detalle** con información de esa caseta.

### 7.2 Búsqueda de Casetas

- El usuario puede escribir el nombre de una caseta en el buscador de la cabecera.
- Al pulsar "Buscar" o la tecla Enter, se localiza la caseta en el mapa y se muestra su información.

### 7.3 Panel de Detalle

- Panel deslizante que aparece desde la parte inferior de la pantalla.
- Muestra el nombre de la caseta y su identificador.
- Se cierra pulsando el botón ✕.
- Diseñado para no cubrir toda la pantalla, permitiendo ver el mapa detrás.

### 7.4 Integración con Firebase

- La aplicación está conectada a **Firebase Firestore** para cargar datos de casetas en tiempo real.
- **Firebase Analytics** registra el uso de la aplicación.
- **Firebase Auth** está inicializado para una futura implementación de acceso restringido (por ejemplo, para gestión del ayuntamiento).

---

## 8. Archivos de Recursos (Carpeta `fotos/`)

| Archivo | Descripción |
|---|---|
| `Logo Algeciras color sin letras interiores.png` | Escudo oficial del Ayuntamiento en color, usado en la cabecera |
| `Logo Algeciras 1 tinta fondos oscuros sin letras interiores.png` | Escudo en tinta blanca, usado en el pie de página |
| `mapa_evento.jpg` | Fotografía/imagen del mapa del recinto de la Feria Real |

---

## 9. Dependencias Externas

| Dependencia | URL | Versión |
|---|---|---|
| Firebase App | `firebase.googleapis.com` | 10.11.0 |
| Firebase Firestore | `firebase.googleapis.com` | 10.11.0 |
| Firebase Analytics | `firebase.googleapis.com` | 10.11.0 |
| Firebase Auth | `firebase.googleapis.com` | 10.11.0 |
| Google Fonts (Inter) | `fonts.googleapis.com` | — |

> **Nota:** Todas las dependencias se cargan desde CDN. No se requiere instalación de paquetes locales (sin `npm`, sin `node_modules`).

---

## 10. Próximos Pasos Recomendados

- [ ] **Mapear las casetas reales** sobre la imagen del mapa definiendo las coordenadas correctas en los elementos SVG.
- [ ] **Conectar Firestore** con los `data-id` de cada caseta para cargar nombre, propietario, horarios, etc.
- [ ] **Implementar filtrado** por categoría de caseta (peñas, municipales, privadas...).
- [ ] **Añadir accesibilidad** (etiquetas ARIA, navegación por teclado en el mapa).
- [ ] **Optimizar las imágenes** (convertir logos a SVG o WebP para mayor rendimiento).
- [ ] **Probar en dispositivos reales** (Android/iOS) antes del lanzamiento oficial.

---

*Documento generado para el proyecto Mapa Interactivo Feria Real de Algeciras 2026.*  
*Ayuntamiento de Algeciras — Área de Innovación y Tecnología*
