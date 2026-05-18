# Documentación del Estilo: Panel de Administración

Este documento explica la estructura, convenciones y paleta de colores del archivo centralizado de estilos del panel de administración (`admin-style.css`), diseñado para asegurar consistencia visual con la página pública, pero manteniendo un entorno privado, aislado y seguro.

## 1. Arquitectura del CSS

El archivo principal de estilos se encuentra en:
`/admin/assets/css/admin-style.css`

Este archivo es único y gestiona todas las vistas relacionadas con el área administrativa. El código está organizado de manera modular mediante comentarios:

1. **VARIABLES**: Se definen todos los "Design Tokens" (colores, sombras, radios) en `:root` bajo el namespace `--admin-*`.
2. **LAYOUT BASE**: Configuración del `body` (background global, flexbox base, tipografía Inter).
3. **SECCIÓN LOGIN (AUTH)**: Estilos para la tarjeta de autenticación (`.authBody`, `.authCard`).
4. **HEADER DEL PANEL**: Barra de navegación superior del área privada (`.adminHeader`).
5. **PANEL MAIN & CARDS**: Contenedores de gestión de la base de datos (`.panelMain`, `.adminCard`).
6. **FORMULARIOS Y INPUTS**: Disposición en grilla de los controles de entrada y sus estados (`focus`, `disabled`).
7. **BOTONES**: Reutilización de clases para todas las acciones primarias, guardado y eliminación (`.btn`, `.btnSubmit`, `.btnSave`, `.btnDelete`).
8. **ALERTAS Y ESTADOS**: Mensajes modales, notificaciones de éxito y error con animaciones (`.statusNotif`, `.success`, `.errorMsg`).
9. **RESPONSIVE**: Media queries que colapsan la estructura de grid a formato lineal en dispositivos con pantallas < 650px.

---

## 2. Paleta de Colores (Namespace `--admin`)

El sistema de diseño hereda conceptualmente los tonos de la web pública (como el azul institucional), pero los implementa bajo nombres de variables locales para no sobrescribir nada de `style.css`.

### Colores Base e Identidad
* **`--admin-primary`** (`#0B63A5`): El Azul Institucional. Se usa en botones de login e iconos principales.
* **`--admin-primary-hover`** (`#0A5A99`): Estado hover de los botones primarios.
* **`--admin-dark`** (`#042A4A`): Azul Marino. Se utiliza en el Header del panel y en los títulos, igual que en el hover normal de la botonera pública.
* **`--admin-active`** (`#FFB500`): El **Amarillo Oficial**. Se dispara *únicamente* cuando se pulsa un botón (`:active`), unificando la experiencia táctil en toda la web.

### Superficies y Textos
* **`--admin-bg`** (`#F3F6F9`): Un gris azulado súper suave que da la sensación de interfaz de sistema cerrado (backend).
* **`--admin-surface`** (`#FFFFFF`): Blanco puro reservado para tarjetas modales y contenedores que deban resaltar con sombras.
* **`--admin-text`** (`#333333`): Texto genérico de alta legibilidad.
* **`--admin-text-muted`** (`#64748B`): Texto secundario, subtítulos y estados deshabilitados.
* **`--admin-border`** (`#E2E8F0`): Bordes de inputs inactivos.

### Colores de Acción (Semánticos)
* **Éxito (Save/Update)**:
  * Botón/Texto: `#10B981` (Hover: `#059669`)
  * Fondo Notificación: `#D1E7DD`
* **Peligro/Cerrar Sesión (Delete/Logout)**:
  * Botón/Texto: `#D93025` (Hover: `#B3261E`)
  * Fondo Notificación: `#F8D7DA`

---

## 3. Tipografía y Componentes

### Fuentes
Se utiliza **Inter**, heredada directamente de Google Fonts. El peso estándar para el panel es `500` (Medium), subiendo a `700/800` para títulos y llamadas a la acción, tal y como se hace en el frontend público.

### Botones y Estados Interactivos
Todos los botones de admin comparten comportamiento interactivo:
1. **Normal**: Colores sólidos, padding amplio, bordes redondeados a `10px`.
2. **Hover**: Transición suave (0.3s) que oscurece el tono base y eleva el botón (`translateY(-2px)`) ampliando su sombra.
3. **Active/Pressed**: Se contrae ligeramente (`scale(0.98)`), cambia su color de fondo a la variable amarillo brillante (`--admin-active`) y ajusta la sombra para proveer un feedback físico contundente.

### Inputs (Campos de formulario)
Los campos de texto utilizan bordes transparentes y un fondo gris suave (`#F8FAFC`). Al recibir el "focus", el fondo se blanquea, el borde se vuelve `--admin-primary`, y reciben un anillo (`box-shadow`) semi-transparente del color institucional para que la navegación por teclado sea sumamente clara y accesible.

---

## 4. Buenas Prácticas de Mantenimiento

* **Aislamiento**: Todo el CSS de admin está fuertemente acoplado a selectores de su propio layout (`.authCard`, `.adminCard`, `.formGrid`).
* **NO usar `!important`**: Salvo en la clase de utilidad `.hidden`, la cascada natural del CSS permite modificar los comportamientos.
* **Extensibilidad**: Para crear un nuevo botón, basta añadir la clase `.btn` junto con un modificador de color (ej. `.btnWarning` asignándole un color base y respetando el `:active` amarillo general).
* **Ausencia de dependencias en línea**: Todo el HTML del panel debe mantener su atributo `style=""` libre para no forzar especificidad ni violar CSP.
