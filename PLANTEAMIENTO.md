# Planteamiento del Proyecto: Mapa Interactivo Feria Algeciras

Este documento describe la arquitectura y el enfoque de diseño para la página oficial del Mapa de la Feria de Algeciras.

## 1. Arquitectura de Archivos
El proyecto se dividirá en cuatro archivos fundamentales para mantener la modularidad y facilidad de mantenimiento:
*   **index.html**: Contendrá la estructura semántica y la carga de recursos.
*   **style.css**: Implementará el sistema de diseño "Algeciras Town Hall", priorizando la adaptabilidad móvil (Responsive Design).
*   **script.js**: Gestionará la lógica de interacción, búsqueda y sincronización de datos.
*   **firebase-config.js**: Archivo dedicado exclusivamente a la configuración de la base de datos para facilitar el intercambio de credenciales.

## 2. Especificaciones de Diseño
*   **Tipografía**: Se utilizará "Inter Medium" como fuente principal, siguiendo la normativa municipal.
*   **Identidad Visual**: Cabecera en color azul institucional con el logo a la izquierda y buscador integrado a la derecha (según boceto).
*   **Interactividad**: Mapa basado en SVG para permitir zoom, pan y resaltado de elementos individuales.
*   **Mobile-First**: La interfaz se diseñará primero para pantallas pequeñas (360px - 480px) y se expandirá mediante Media Queries para escritorio.

## 3. Estándares de Programación
*   **Nomenclatura**: Variables en inglés con formato camelCase (ej: `boothList`, `searchHandler`).
*   **Reusabilidad**: Los nombres de funciones y variables serán genéricos (ej: `appData`, `eventMap`) para permitir el uso del código en otros eventos municipales.
*   **Contenido**: Todos los textos visibles para el usuario estarán íntegramente en español.

## 4. Funcionalidades Clave
*   **Buscador Manual**: Campo de texto que filtra la lista de casetas y dispara una animación de resaltado en el mapa SVG.
*   **Panel Informativo**: Al interactuar con una caseta, aparecerá una pestaña emergente (overlay) con los detalles cargados desde Firebase.
*   **Conectividad**: Integración con Firestore para la persistencia de datos.

---
**Documentación de Desarrollo - Ayuntamiento de Algeciras**
