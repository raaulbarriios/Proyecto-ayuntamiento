# Documentación de Mejoras de Interacción UI

Este documento explica las nuevas funcionalidades de interfaz de usuario (UI) implementadas en el proyecto del Mapa Interactivo de Eventos.

## Objetivos Cumplidos

Se han añadido dos componentes interactivos principales siguiendo una arquitectura limpia y manteniendo la compatibilidad total con el código existente:

1.  **Modal Centrado (Ventana Emergente)**: Al interactuar con un elemento en el mapa, ahora se abre una ventana elegante y centrada con información detallada.
2.  **Dropdown de Búsqueda (Desplegable Móvil)**: El icono de lupa en el móvil ahora despliega un panel de búsqueda justo debajo, mejorando la usabilidad.
3.  **Botón de Mapa Institucional**: Un acceso directo a Google Maps con el estilo unificado del buscador para facilitar la navegación externa.
4.  **Iconos de Acción Sincronizados**: Los botones de la cabecera móvil (búsqueda y mapa) ahora comparten el mismo lenguaje visual (blanco por defecto, azul al estar activos).

---

## 1. Modal de Información Centrado

### Comportamiento
- **Activación**: Se activa automáticamente al hacer clic o pulsar (en móviles) sobre cualquier punto de interés del mapa SVG.
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
    - Campo de entrada de texto para buscar elementos.
    - **Sugerencias Rápidas**: Incluye botones ("chips") con los nombres de los elementos para una selección inmediata sin necesidad de escribir.
- **Cierre**:
    - Al pulsar de nuevo el icono de lupa (Toggle).
    - Al realizar una búsqueda exitosa.
    - Al hacer clic fuera del desplegable.
    - Tecla **ESC**.

---

## 4. Botón de Acceso al Mapa (Google Maps)

### Comportamiento
- **Acceso Directo**: Permite al usuario abrir la ubicación exacta del evento en Google Maps en una nueva pestaña.
- **Diferenciación Responsive**: 
    - En **Escritorio**, se muestra como una acción secundaria debajo del buscador con el texto "Ver en el mapa".
    - En **Móvil**, se integra en la cabecera principal con el texto "Mapa" para optimizar el espacio táctil.
- **Feedback Visual**: Hereda las animaciones de elevación y escala del sistema de búsqueda institucional.

---

## 5. Iconos de Acción Sincronizados (Toggle)

### Comportamiento
- **Uniformidad**: Se ha unificado el estilo de los botones de la cabecera móvil para que la curva de aprendizaje del usuario sea mínima.
- **Estados de Color**:
    - **Inactivo (Fondo Blanco / Icono Azul)**: Estado de reposo que mantiene la limpieza visual.
    - **Activo (Fondo Azul Oscuro / Icono Blanco)**: Indica que la funcionalidad está siendo utilizada o seleccionada.
- **Animación**: Transición suave de 0.3s que proporciona una sensación de fluidez y modernidad.

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
