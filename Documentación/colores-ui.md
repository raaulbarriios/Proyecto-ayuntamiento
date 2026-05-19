# Documentación del Sistema de Colores UI

Este documento contiene la paleta de colores oficial utilizada en el desarrollo y la interfaz de usuario del portal y sus subsistemas (como el panel de caseteros). Sirve como guía de referencia para mantener una identidad visual consistente a lo largo del proyecto.

## 1. Colores Principales (Institucionales)

### Azul Institucional (Gradiente Base)
**Código HEX:** `#0B63A5`

**Dónde se usa:**
- Cabecera principal (`.mainHeader`)
- Pie de página (`.mainFooter`)
- Título de evento (`.eventTitle`)
- Textos destacados en tarjetas informativas.

### Azul Acento (Botones Base Anteriores)
**Código HEX:** `#0B63A5` (Comparte valor con el institucional)

**Dónde se usa:**
- Trazos al pasar por encima del mapa (Hover outline)
- Botones secundarios de acción
- Iconos del panel privado de caseteros
- Anillos de "focus" de inputs.

### Azul Oscuro (Variante Activa Antigua / Botones Clásicos)
**Código HEX:** `#084D82`

**Dónde se usa:**
- Títulos del panel de caseteros (`.loginTitle`, `.panelTitle`)
- Texto descriptivo destacado (`.infoCardText h3`)
- Bordes o estados activos en otras áreas de interacción secundaria.

---

## 2. Nueva Navegación (Botones Principales)

### Botón Normal (Azul Marino Menos Oscuro)
**Código HEX:** `#084D82`

**Dónde se usa:**
- Estado **por defecto** (normal) de los botones de navegación.
- Clases afectadas: `.mobileBtn`, `.map-link-mobile`, `.map-link`, `.searchBtn`, `.mobileSearchActionBtn`.
- Proporciona un color de base profundo pero más brillante y menos oscuro que el negro/azul medianoche, mejorando la integración con la paleta de Algeciras.

### Hover de Botón (Azul Aclarado Medio)
**Código HEX:** `#0A5A99`

**Dónde se usa:**
- Exclusivo para el estado `:hover` y `:focus-visible` de los botones de navegación.
- Se aclara ligeramente para indicar interactividad de forma fluida, SIN recurrir al amarillo.

### Botón Activo / Pulsado (Amarillo Oficial)
**Código HEX:** `#FFB500`

**Dónde se usa:**
- Fondo de botones de navegación cuando reciben **únicamente** los eventos de presión activa (`:active` o la clase `.active`).
- **IMPORTANTE:** Este color NO debe usarse para `:hover` genéricos ni dejar "atascado" el botón. SOLO se muestra mientras el usuario está haciendo click, presionando la pantalla, o si el elemento representa la página/sección actual en un menú activo.

### Texto / Iconos en Botón Activo
**Código HEX:** `#084D82` (Azul Marino)

**Dónde se usa:**
- Color de los iconos de navegación y texto interior cuando el botón adopta el fondo amarillo.
- Garantiza contraste visual perfecto y evita que el icono original blanco desaparezca sobre el fondo `#FFB500`.

---

## 3. Escala de Grises y Neutros

### Blanco Puro
**Código HEX:** `#FFFFFF`

**Dónde se usa:**
- Fondos de paneles y modales (`.loginContainer`, `.panelContainer`, `.privateCard`, `.searchContainer`).
- Texto interior de cabecera y pie de página.
- Iconos iniciales sobre fondos azules (`#084D82`).

### Gris Claro (Fondo App)
**Código HEX:** `#F5F5F5`

**Dónde se usa:**
- Color de fondo general de la aplicación (`body`).
- Fondos de áreas de tarjetas.

### Gris Azulado (Fondo Específico Privado)
**Código HEX:** `#F3F6F9`

**Dónde se usa:**
- Fondo exclusivo de la zona de Caseteros para diferenciarlo sutilmente de la web pública.
- Fondos inactivos de inputs.

### Texto Base
**Código HEX:** `#333333`

**Dónde se usa:**
- Cuerpo principal del texto y color de etiquetas.

### Texto Secundario
**Código HEX:** `#64748B` / `#94A3B8`

**Dónde se usa:**
- Textos secundarios explicativos.
- Estados deshabilitados de inputs.

---

## 4. Colores Semánticos (Feedback y Alertas)

### Éxito (Success)
**Texto/Borde:** `#0F5132` / `#BADBCC` | **Fondo:** `#D1E7DD`

**Dónde se usa:**
- Mensajes de guardado exitoso.

### Error (Danger)
**Texto/Borde:** `#842029` / `#F5C2C7` | **Fondo:** `#F8D7DA`
**Botones de Peligro:** `#D93025` / `#B3261E` (Hover)

**Dónde se usa:**
- Mensajes de error en login o conexión.
- Botón principal de "Cerrar Sesión".
