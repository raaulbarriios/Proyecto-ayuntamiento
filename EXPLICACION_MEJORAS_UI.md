# Documentación de Mejoras de Interacción UI

Este documento explica las nuevas funcionalidades de interfaz de usuario (UI) implementadas en el proyecto del Mapa Interactivo de la Feria Real de Algeciras 2026.

## Objetivos Cumplidos

Se han añadido dos componentes interactivos principales siguiendo una arquitectura limpia y manteniendo la compatibilidad total con el código existente:

1.  **Modal Centrado (Ventana Emergente)**: Al interactuar con una caseta en el mapa, ahora se abre una ventana elegante y centrada con información detallada.
2.  **Dropdown de Búsqueda (Desplegable Móvil)**: El icono de lupa en el móvil ahora despliega un panel de búsqueda justo debajo, mejorando la usabilidad.

---

## 1. Modal de Información Centrado

### Comportamiento
- **Activación**: Se activa automáticamente al hacer clic o pulsar (en móviles) sobre cualquier caseta del mapa SVG.
- **Visual**: Aparece con una animación suave de escalado y opacidad (fade + scale).
- **Fondo**: Bloquea el contenido trasero mediante un overlay oscuro con desenfoque (backdrop-filter), centrando la atención en la información.
- **Cierre**:
    - Botón de cierre (X) en la esquina superior derecha.
    - Clic fuera del área del modal (en el fondo oscuro).
    - Tecla **ESC** para usuarios de teclado.

### Estructura y Estilo
- Utiliza los colores institucionales de Algeciras (gradientes azules).
- Implementa un diseño de tarjetas ("info-cards") para organizar el nombre y la ubicación de forma clara.
- **Accesibilidad**: Incluye trampa de foco (focus trap) para que la navegación por TAB no salga del modal mientras esté abierto.

---

## 2. Dropdown de Búsqueda Móvil

### Comportamiento
- **Activación**: Al pulsar el icono de lupa (`#toggleMobileSearch`) en la cabecera.
- **Visual**: Despliega un panel blanco con sombra suave directamente debajo del icono, con una pequeña flecha indicadora.
- **Funcionalidad**:
    - Campo de entrada de texto para buscar casetas.
    - **Sugerencias Rápidas**: Incluye botones ("chips") con los nombres de las casetas para una selección inmediata sin necesidad de escribir.
- **Cierre**:
    - Al pulsar de nuevo el icono de lupa (Toggle).
    - Al realizar una búsqueda exitosa.
    - Al hacer clic fuera del desplegable.
    - Tecla **ESC**.

---

## 3. Implementación Técnica

Para mantener el código limpio y profesional, se han seguido estas reglas:

- **Consolidación**: Todo el estilo se ha integrado en `style.css` (Secciones 10, 11 y 12) y la lógica en `script.js` (Section 5, 6 y 11), eliminando archivos temporales.
- **Sin Redundancia**: Se ha reutilizado la lógica de búsqueda existente para evitar duplicidad de código.
- **Nombres de Clase Seguros**: Se utiliza el prefijo `uic-` (UI Component) para evitar conflictos con estilos globales.
- **Comentarios**: Cada línea de código nueva ha sido comentada detalladamente para facilitar su mantenimiento por personas no técnicas.
- **Responsividad**: Ambos componentes están optimizados para dispositivos móviles, tablets y escritorio.

### Archivos Modificados:
- `style.css`: Inclusión de tokens de diseño (z-index) y estilos de componentes.
- `script.js`: Inclusión de lógica de construcción dinámica del DOM y manejo de eventos.
- `index.html`: Estructura mantenida limpia, sin llamadas a archivos externos adicionales.

---
*Ayuntamiento de Algeciras - Mayo 2026*
