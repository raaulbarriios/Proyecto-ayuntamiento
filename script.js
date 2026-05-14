/**
 * script.js
 * 
 * Lógica funcional del Mapa de Eventos.
 * Refactorizado para ser genérico y escalable.
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Configuración Centralizada (Escalabilidad)
    const CONFIG = {
        selectors: {
            mapItems: '.mapItem',
            infoOverlay: '#infoOverlay',
            closePanelBtn: '#closePanelBtn',
            displayName: '#displayName',
            displayLocation: '#displayLocation',
            searchTrigger: '#searchTrigger',
            manualSearch: '#manualSearch',
            toggleMobileSearch: '#toggleMobileSearch',
            mobileSearchRow: '#mobileSearchRow',
            mobileSearchInput: '#mobileSearchInput',
            mapLinkMobile: '#mapLinkMobile',
            mapLinkDesktop: '#mapLinkDesktop'
        },
        classes: {
            active: 'active',
            hidden: 'aria-hidden'
        }
    };

    // 2. Estado de la Aplicación
    const appState = {
        selectedItem: null,
        isSearchOpen: false
    };

    // 3. Referencias al DOM
    const elements = {
        mapItems: document.querySelectorAll(CONFIG.selectors.mapItems),
        infoOverlay: document.querySelector(CONFIG.selectors.infoOverlay),
        closePanelBtn: document.querySelector(CONFIG.selectors.closePanelBtn),
        displayName: document.querySelector(CONFIG.selectors.displayName),
        displayLocation: document.querySelector(CONFIG.selectors.displayLocation),
        searchTrigger: document.querySelector(CONFIG.selectors.searchTrigger),
        manualSearch: document.querySelector(CONFIG.selectors.manualSearch),
        toggleMobileSearch: document.querySelector(CONFIG.selectors.toggleMobileSearch),
        mobileSearchRow: document.querySelector(CONFIG.selectors.mobileSearchRow),
        mobileSearchInput: document.querySelector(CONFIG.selectors.mobileSearchInput),
        mapLinkMobile: document.querySelector(CONFIG.selectors.mapLinkMobile),
        mapLinkDesktop: document.querySelector(CONFIG.selectors.mapLinkDesktop)
    };

    // 4. Funciones de Lógica
    
    /**
     * Actualiza y muestra el panel de información del elemento seleccionado.
     * @param {HTMLElement} item - El elemento del mapa interactuado.
     */
    const updateInfoPanel = (item) => {
        const name = item.getAttribute('data-name') || 'Elemento sin nombre';
        const location = item.getAttribute('data-location') || 'Ubicación no especificada';

        // Actualizar contenido
        if (elements.displayName) elements.displayName.textContent = name;
        if (elements.displayLocation) elements.displayLocation.textContent = `Ubicación: ${location}`;

        // Mostrar panel
        if (elements.infoOverlay) {
            elements.infoOverlay.classList.add(CONFIG.classes.active);
            elements.infoOverlay.setAttribute('aria-hidden', 'false');
        }
        
        appState.selectedItem = item;
    };

    /**
     * Cierra el panel de información.
     */
    const closeInfoPanel = () => {
        if (elements.infoOverlay) {
            elements.infoOverlay.classList.remove(CONFIG.classes.active);
            elements.infoOverlay.setAttribute('aria-hidden', 'true');
        }
        appState.selectedItem = null;
    };

    /**
     * Ejecuta la búsqueda de elementos por nombre.
     * @param {string} query - Término de búsqueda.
     */
    const executeSearch = (query) => {
        if (!query) return;
        
        console.log("Buscando elemento:", query);
        
        // Lógica de búsqueda (ejemplo de filtrado simple)
        let found = false;
        elements.mapItems.forEach(item => {
            const name = (item.getAttribute('data-name') || '').toLowerCase();
            if (name.includes(query.toLowerCase())) {
                updateInfoPanel(item);
                found = true;
            }
        });

        if (!found) {
            console.log("No se encontraron coincidencias para:", query);
        }
    };

    // 5. Inicialización de Eventos

    // Clic en elementos del mapa
    elements.mapItems.forEach(item => {
        item.addEventListener('click', () => updateInfoPanel(item));
    });

    // Cerrar panel
    if (elements.closePanelBtn) {
        elements.closePanelBtn.addEventListener('click', closeInfoPanel);
    }

    // Buscador manual (Desktop)
    if (elements.searchTrigger && elements.manualSearch) {
        elements.searchTrigger.addEventListener('click', () => {
            executeSearch(elements.manualSearch.value);
        });
        
        elements.manualSearch.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') executeSearch(elements.manualSearch.value);
        });
    }

    // Buscador móvil (Toggle)
    if (elements.toggleMobileSearch && elements.mobileSearchRow) {
        elements.toggleMobileSearch.addEventListener('click', (e) => {
            e.stopPropagation();
            const isActive = elements.mobileSearchRow.classList.toggle(CONFIG.classes.active);
            elements.toggleMobileSearch.classList.toggle(CONFIG.classes.active);
            
            elements.toggleMobileSearch.setAttribute('aria-expanded', isActive);
            elements.mobileSearchRow.setAttribute('aria-hidden', !isActive);

            if (isActive && elements.mobileSearchInput) {
                setTimeout(() => elements.mobileSearchInput.focus(), 100);
            }
        });

        // Cerrar al clicar fuera
        document.addEventListener('click', (e) => {
            if (elements.mobileSearchRow.classList.contains(CONFIG.classes.active)) {
                if (!elements.mobileSearchRow.contains(e.target) && !elements.toggleMobileSearch.contains(e.target)) {
                    elements.mobileSearchRow.classList.remove(CONFIG.classes.active);
                    elements.toggleMobileSearch.classList.remove(CONFIG.classes.active);
                    elements.toggleMobileSearch.setAttribute('aria-expanded', 'false');
                    elements.mobileSearchRow.setAttribute('aria-hidden', 'true');
                }
            }
        });

        elements.mobileSearchRow.addEventListener('click', (e) => e.stopPropagation());
    }

    // Toggle Botón Mapa (Móvil y Desktop)
    const toggleMapActive = (element) => {
        if (element) {
            element.addEventListener('click', () => {
                element.classList.toggle(CONFIG.classes.active);
            });
        }
    };

    toggleMapActive(elements.mapLinkMobile);
    toggleMapActive(elements.mapLinkDesktop);

    console.log("Lógica del mapa interactivo (versión genérica) inicializada.");
});
