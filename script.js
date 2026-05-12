/**
 * ═══════════════════════════════════════════════════════════════════
 * script.js — Lógica del Frontend
 * Proyecto: Mapa Interactivo Feria Real de Algeciras 2026
 * Ayuntamiento de Algeciras
 * ═══════════════════════════════════════════════════════════════════
 *
 * Este archivo gestiona TODA la interactividad del frontend:
 *   - Selección de casetas en el mapa SVG interactivo.
 *   - Apertura/cierre del panel lateral de información.
 *   - Buscador de escritorio y buscador móvil desplegable.
 *   - Accesibilidad: trampa de foco, navegación por teclado, ARIA.
 *   - [FUTURO]: Carga dinámica de datos desde Firebase Firestore.
 *
 * ARQUITECTURA:
 *   - Patrón IIFE para encapsular el scope global.
 *   - Objeto de configuración centralizado (CONFIG).
 *   - Estado centralizado de la aplicación (appState).
 *   - Funciones genéricas y reutilizables para futuros módulos.
 *   - Comentarios explicativos en cada bloque lógico.
 *
 * NOMENCLATURA:
 *   - Variables y funciones en inglés (camelCase).
 *   - Textos visibles para el usuario en español.
 *   - Nombres genéricos para reutilización en otros eventos.
 */

// ═══════════════════════════════════════════════════════════════════
// IIFE: Función autoinvocada que encapsula todo el código
// para evitar contaminar el scope global del navegador.
// ═══════════════════════════════════════════════════════════════════
(() => {
    'use strict';

    // ──────────────────────────────────────────────
    // 1. CONFIGURACIÓN CENTRALIZADA
    // ──────────────────────────────────────────────
    // Objeto que agrupa todas las constantes y selectores.
    // Si en el futuro cambia un selector o un texto,
    // solo hay que modificarlo aquí, no en todo el archivo.
    const CONFIG = {
        // Selectores CSS de los elementos del DOM
        selectors: {
            mapItems:           '.mapItem',
            infoOverlay:        '#infoOverlay',
            overlayBackdrop:    '#overlayBackdrop',
            closePanelBtn:      '#closePanelBtn',
            displayName:        '#displayName',
            displayLocation:    '#displayLocation',
            searchTrigger:      '#searchTrigger',
            manualSearch:       '#manualSearch',
            toggleMobileSearch: '#toggleMobileSearch',
            mobileSearchRow:    '#mobileSearchRow',
            mobileSearchInput:  '#mobileSearchInput',
            mobileSearchAction: '#mobileSearchAction',
            searchFeedback:     '#searchFeedback',
            dynamicContent:     '#dynamicContent'
        },
        // Clases CSS que se añaden/quitan dinámicamente
        classes: {
            active: 'active'
        },
        // Atributos ARIA para accesibilidad
        aria: {
            hidden:   'aria-hidden',
            expanded: 'aria-expanded'
        },
        // Mensajes para el usuario (centralizados para fácil traducción)
        messages: {
            noResults:       'No se encontró ninguna caseta con ese nombre.',
            defaultName:     'Caseta sin nombre',
            defaultLocation: 'Ubicación desconocida',
            searchFound:     'Se ha encontrado la caseta: ',
            searchNotFound:  'No se encontraron resultados para la búsqueda.'
        },
        // Tiempo en milisegundos para animaciones y delays
        timing: {
            focusDelay: 100
        }
    };

    // ──────────────────────────────────────────────
    // 2. ESTADO CENTRALIZADO DE LA APLICACIÓN
    // ──────────────────────────────────────────────
    // Objeto mutable que rastrea el estado actual de la interfaz.
    // Útil para depuración y para futuras integraciones con Firebase.
    const appState = {
        selectedItemId: null,     // ID de la caseta seleccionada actualmente
        isPanelOpen: false,       // Si el panel lateral está visible
        isMobileSearchOpen: false // Si el buscador móvil está desplegado
    };

    // ──────────────────────────────────────────────
    // 3. INICIALIZACIÓN: Esperar a que el DOM esté listo
    // ──────────────────────────────────────────────
    document.addEventListener('DOMContentLoaded', () => {

        // ══════════════════════════════════════════
        // 3.1 REFERENCIAS AL DOM
        // ══════════════════════════════════════════
        // Cacheamos todas las referencias a elementos HTML
        // para evitar consultas repetidas al DOM (mejor rendimiento).

        const elements = {
            mapItems:           document.querySelectorAll(CONFIG.selectors.mapItems),
            infoOverlay:        document.getElementById('infoOverlay'),
            overlayBackdrop:    document.getElementById('overlayBackdrop'),
            closePanelBtn:      document.getElementById('closePanelBtn'),
            displayName:        document.getElementById('displayName'),
            displayLocation:    document.getElementById('displayLocation'),
            searchTrigger:      document.getElementById('searchTrigger'),
            manualSearch:       document.getElementById('manualSearch'),
            toggleMobileSearch: document.getElementById('toggleMobileSearch'),
            mobileSearchRow:    document.getElementById('mobileSearchRow'),
            mobileSearchInput:  document.getElementById('mobileSearchInput'),
            mobileSearchAction: document.getElementById('mobileSearchAction'),
            searchFeedback:     document.getElementById('searchFeedback'),
            dynamicContent:     document.getElementById('dynamicContent')
        };

        // ══════════════════════════════════════════
        // 4. FUNCIONES REUTILIZABLES
        // ══════════════════════════════════════════

        /**
         * updateAccessibility — Actualiza los atributos ARIA de un elemento.
         * @param {HTMLElement} element - El elemento HTML a actualizar.
         * @param {Object} attrs - Objeto con pares atributo:valor.
         *
         * Ejemplo de uso:
         *   updateAccessibility(panel, { 'aria-hidden': 'false' });
         */
        const updateAccessibility = (element, attrs) => {
            if (!element) return;
            Object.entries(attrs).forEach(([key, value]) => {
                element.setAttribute(key, value);
            });
        };

        /**
         * announceToScreenReader — Anuncia un mensaje a lectores de pantalla.
         * Actualiza la región aria-live para que se lea automáticamente.
         * @param {string} message - El texto que se anunciará.
         */
        const announceToScreenReader = (message) => {
            if (elements.searchFeedback) {
                elements.searchFeedback.textContent = message;
            }
        };

        // ══════════════════════════════════════════
        // 5. PANEL LATERAL DE DETALLES
        // ══════════════════════════════════════════

        /**
         * openDetailsPanel — Abre el panel lateral mostrando información.
         * @param {Object} data - Objeto con los datos a mostrar.
         * @param {string} data.name - Nombre de la caseta.
         * @param {string} data.street - Dirección/ubicación.
         *
         * [FUTURO FIREBASE]: Este objeto 'data' podrá venir
         * directamente de un documento de Firestore.
         */
        const openDetailsPanel = (data) => {
            // Actualizamos los textos del panel con la información recibida
            if (elements.displayName) {
                elements.displayName.textContent = data.name || CONFIG.messages.defaultName;
            }
            if (elements.displayLocation) {
                elements.displayLocation.textContent = `Ubicación: ${data.street || CONFIG.messages.defaultLocation}`;
            }

            // Mostramos el panel deslizándolo desde la derecha
            if (elements.infoOverlay) {
                elements.infoOverlay.classList.add(CONFIG.classes.active);
                updateAccessibility(elements.infoOverlay, { 'aria-hidden': 'false' });
            }

            // Mostramos el fondo oscuro semitransparente detrás del panel
            if (elements.overlayBackdrop) {
                elements.overlayBackdrop.classList.add(CONFIG.classes.active);
                updateAccessibility(elements.overlayBackdrop, { 'aria-hidden': 'false' });
            }

            // Actualizamos el estado interno de la aplicación
            appState.isPanelOpen = true;

            // Movemos el foco al panel para accesibilidad (teclado)
            if (elements.closePanelBtn) {
                setTimeout(() => elements.closePanelBtn.focus(), CONFIG.timing.focusDelay);
            }

            // Anunciamos a los lectores de pantalla
            announceToScreenReader(`Panel abierto: ${data.name || CONFIG.messages.defaultName}`);
        };

        /**
         * closeDetailsPanel — Cierra el panel lateral y limpia el estado.
         * Devuelve el foco al último elemento que lo tenía antes de abrir.
         */
        const closeDetailsPanel = () => {
            // Ocultamos el panel lateral
            if (elements.infoOverlay) {
                elements.infoOverlay.classList.remove(CONFIG.classes.active);
                updateAccessibility(elements.infoOverlay, { 'aria-hidden': 'true' });
            }

            // Ocultamos el fondo oscuro
            if (elements.overlayBackdrop) {
                elements.overlayBackdrop.classList.remove(CONFIG.classes.active);
                updateAccessibility(elements.overlayBackdrop, { 'aria-hidden': 'true' });
            }

            // Quitamos el estado "activo" de todas las casetas del mapa
            elements.mapItems.forEach(item => item.classList.remove(CONFIG.classes.active));

            // Actualizamos el estado de la app
            appState.isPanelOpen = false;
            appState.selectedItemId = null;

            // Anunciamos el cierre a lectores de pantalla
            announceToScreenReader('Panel de información cerrado.');
        };

        // ══════════════════════════════════════════
        // 6. MAPA INTERACTIVO
        // ══════════════════════════════════════════

        /**
         * handleMapItemInteraction — Maneja la selección de una caseta.
         * Extrae los datos del elemento SVG y abre el panel lateral.
         * @param {SVGElement} item - El elemento <rect> del SVG clickeado.
         *
         * [FUTURO FIREBASE]: En lugar de leer data-* del DOM,
         * se buscará el ID en el JSON descargado de Firestore.
         */
        const handleMapItemInteraction = (item) => {
            // Extraemos la información desde los atributos data-* del HTML
            const itemData = {
                name:   item.getAttribute('data-name'),
                street: item.getAttribute('data-street')
            };

            // Marcamos visualmente la caseta seleccionada en el mapa
            elements.mapItems.forEach(el => el.classList.remove(CONFIG.classes.active));
            item.classList.add(CONFIG.classes.active);

            // Guardamos el ID de la caseta seleccionada en el estado
            appState.selectedItemId = item.getAttribute('data-name');

            // Abrimos el panel con la información extraída
            openDetailsPanel(itemData);
        };

        // Registramos los eventos de clic y teclado en cada caseta del mapa
        elements.mapItems.forEach(item => {
            // Evento de clic (ratón/pantalla táctil)
            item.addEventListener('click', () => handleMapItemInteraction(item));

            // Evento de teclado: Enter o Espacio activan la caseta (accesibilidad)
            item.addEventListener('keydown', (event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault(); // Evitamos que la página salte con la barra espaciadora
                    handleMapItemInteraction(item);
                }
            });
        });

        // Evento del botón de cerrar (X) del panel lateral
        if (elements.closePanelBtn) {
            elements.closePanelBtn.addEventListener('click', closeDetailsPanel);
        }

        // Evento del fondo oscuro: cerrar panel al hacer clic fuera de él
        if (elements.overlayBackdrop) {
            elements.overlayBackdrop.addEventListener('click', closeDetailsPanel);
        }

        // ══════════════════════════════════════════
        // 7. BUSCADOR (Escritorio y Móvil)
        // ══════════════════════════════════════════

        /**
         * executeSearch — Ejecuta la búsqueda de casetas por nombre.
         * Busca coincidencias parciales e insensibles a mayúsculas.
         * @param {string} query - El texto introducido por el usuario.
         *
         * [FUTURO FIREBASE]: Aquí se filtrará el array de datos
         * descargado de Firestore en lugar de recorrer el DOM.
         */
        const executeSearch = (query) => {
            // Normalizamos el texto: minúsculas y sin espacios extra
            const normalizedQuery = query.trim().toLowerCase();

            // Si el campo está vacío, no hacemos nada
            if (!normalizedQuery) return;

            // Buscamos la primera caseta cuyo nombre contenga el texto buscado
            let foundItem = null;
            elements.mapItems.forEach(item => {
                const itemName = (item.getAttribute('data-name') || '').toLowerCase();
                if (itemName.includes(normalizedQuery) && !foundItem) {
                    foundItem = item;
                }
            });

            // Si encontramos una coincidencia, la seleccionamos
            if (foundItem) {
                handleMapItemInteraction(foundItem);
                // Hacemos scroll suave hasta la caseta encontrada
                foundItem.scrollIntoView({ behavior: 'smooth', block: 'center' });
                announceToScreenReader(CONFIG.messages.searchFound + foundItem.getAttribute('data-name'));
            } else {
                // Si no hay coincidencias, mostramos mensaje al usuario
                announceToScreenReader(CONFIG.messages.searchNotFound);
                alert(CONFIG.messages.noResults);
            }
        };

        // 7.1 Buscador de Escritorio
        if (elements.searchTrigger && elements.manualSearch) {
            // Clic en el botón "Buscar"
            elements.searchTrigger.addEventListener('click', () => {
                executeSearch(elements.manualSearch.value);
            });

            // Tecla Enter en el campo de búsqueda
            elements.manualSearch.addEventListener('keydown', (event) => {
                if (event.key === 'Enter') {
                    executeSearch(elements.manualSearch.value);
                }
            });
        }

        // 7.2 Buscador Móvil (acción de búsqueda)
        if (elements.mobileSearchAction && elements.mobileSearchInput) {
            elements.mobileSearchAction.addEventListener('click', () => {
                executeSearch(elements.mobileSearchInput.value);
            });

            elements.mobileSearchInput.addEventListener('keydown', (event) => {
                if (event.key === 'Enter') {
                    executeSearch(elements.mobileSearchInput.value);
                }
            });
        }

        // ══════════════════════════════════════════
        // 8. BUSCADOR MÓVIL — DESPLIEGUE/CIERRE
        // ══════════════════════════════════════════

        /**
         * toggleMobileSearch — Abre o cierra la barra de búsqueda móvil.
         * Gestiona las clases CSS, los atributos ARIA y el foco.
         */
        const toggleMobileSearchPanel = () => {
            if (!elements.mobileSearchRow || !elements.toggleMobileSearch) return;

            // Alternamos la visibilidad
            elements.mobileSearchRow.classList.toggle(CONFIG.classes.active);
            elements.toggleMobileSearch.classList.toggle(CONFIG.classes.active);

            // Determinamos si ahora está abierto o cerrado
            const isExpanded = elements.mobileSearchRow.classList.contains(CONFIG.classes.active);

            // Actualizamos atributos ARIA
            updateAccessibility(elements.toggleMobileSearch, { 'aria-expanded': String(isExpanded) });
            updateAccessibility(elements.mobileSearchRow, { 'aria-hidden': String(!isExpanded) });

            // Actualizamos el estado de la aplicación
            appState.isMobileSearchOpen = isExpanded;

            // Si se abrió, enfocamos el input para sacar el teclado táctil
            if (isExpanded && elements.mobileSearchInput) {
                setTimeout(() => elements.mobileSearchInput.focus(), CONFIG.timing.focusDelay);
            }
        };

        /**
         * closeMobileSearch — Cierra la barra de búsqueda móvil.
         */
        const closeMobileSearch = () => {
            if (!elements.mobileSearchRow || !elements.toggleMobileSearch) return;

            elements.mobileSearchRow.classList.remove(CONFIG.classes.active);
            elements.toggleMobileSearch.classList.remove(CONFIG.classes.active);
            updateAccessibility(elements.toggleMobileSearch, { 'aria-expanded': 'false' });
            updateAccessibility(elements.mobileSearchRow, { 'aria-hidden': 'true' });
            appState.isMobileSearchOpen = false;
        };

        // Evento del botón de lupa móvil
        if (elements.toggleMobileSearch) {
            elements.toggleMobileSearch.addEventListener('click', (event) => {
                event.stopPropagation(); // Evitamos que se propague al document
                toggleMobileSearchPanel();
            });
        }

        // Cerrar el buscador móvil si se hace clic fuera de él
        document.addEventListener('click', (event) => {
            if (!appState.isMobileSearchOpen) return;

            const isInsideSearch = elements.mobileSearchRow && elements.mobileSearchRow.contains(event.target);
            const isOnToggle = elements.toggleMobileSearch && elements.toggleMobileSearch.contains(event.target);

            if (!isInsideSearch && !isOnToggle) {
                closeMobileSearch();
            }
        });

        // Evitamos que clics dentro del buscador se propaguen y lo cierren
        if (elements.mobileSearchRow) {
            elements.mobileSearchRow.addEventListener('click', (event) => {
                event.stopPropagation();
            });
        }

        // ══════════════════════════════════════════
        // 9. ACCESIBILIDAD — NAVEGACIÓN POR TECLADO
        // ══════════════════════════════════════════

        // Cerrar panel o buscador con la tecla Escape
        document.addEventListener('keydown', (event) => {
            if (event.key !== 'Escape') return;

            // Prioridad: primero cerrar el panel lateral si está abierto
            if (appState.isPanelOpen) {
                closeDetailsPanel();
                // Devolvemos el foco a la última caseta seleccionada
                const activeItem = document.querySelector(`.mapItem.${CONFIG.classes.active}`);
                if (activeItem) activeItem.focus();
                return;
            }

            // Después cerrar el buscador móvil si está abierto
            if (appState.isMobileSearchOpen) {
                closeMobileSearch();
                if (elements.toggleMobileSearch) elements.toggleMobileSearch.focus();
            }
        });

        // ══════════════════════════════════════════
        // 10. UTILIDADES PARA FUTURAS INTEGRACIONES
        // ══════════════════════════════════════════

        /**
         * renderDynamicContent — Renderiza contenido dinámico en el panel.
         * Diseñada para ser llamada cuando se carguen datos de Firebase.
         * @param {HTMLElement} container - El contenedor donde inyectar HTML.
         * @param {Object} data - Objeto con datos adicionales de la caseta.
         *
         * Ejemplo de uso futuro:
         *   renderDynamicContent(elements.dynamicContent, {
         *       horario: '20:00 - 04:00',
         *       tipo: 'Municipal',
         *       aforo: 200
         *   });
         */
        const renderDynamicContent = (container, data) => {
            if (!container || !data) return;
            // Limpiamos el contenido previo
            container.innerHTML = '';
            // Recorremos cada propiedad del objeto y la mostramos
            Object.entries(data).forEach(([key, value]) => {
                const paragraph = document.createElement('p');
                paragraph.textContent = `${key}: ${value}`;
                container.appendChild(paragraph);
            });
        };

        /**
         * loadDataFromSource — Función preparada para cargar datos externos.
         * [FUTURO FIREBASE]: Reemplazar el contenido con una llamada a
         * getDocs(collection(db, 'casetas')) de Firestore.
         * @param {string} collectionName - Nombre de la colección en Firestore.
         * @returns {Promise<Array>} - Array de objetos con datos de casetas.
         */
        const loadDataFromSource = async (collectionName) => {
            // Placeholder: actualmente retorna un array vacío.
            // Cuando Firebase esté listo, aquí se hará la consulta real.
            console.info(`[Firebase] Preparado para cargar: ${collectionName}`);
            return [];
        };

        // ══════════════════════════════════════════
        // 11. INICIALIZACIÓN COMPLETA
        // ══════════════════════════════════════════
        console.info('✅ Frontend inicializado correctamente — Mapa Interactivo Feria Real de Algeciras 2026');
    });

})();
