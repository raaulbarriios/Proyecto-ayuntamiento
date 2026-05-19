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
            mobileSearchInput: '#mobileSearchInput'
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
        mobileSearchInput: document.querySelector(CONFIG.selectors.mobileSearchInput)
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



    // === COMPONENTE: DESPLEGABLE DE CASETAS ===
    const casetasState = {
        isOpenMobile: false,
        isOpenDesktop: false,
        casetasData: [] // Estructura dinámica de Casetas
    };

    const casetasElements = {
        triggerMobile: document.querySelector('#casetasTriggerMobile'),
        menuMobile: document.querySelector('#casetasDropdownMobile'),
        containerMobile: document.querySelector('#casetasContainerMobile'),

        triggerDesktop: document.querySelector('#casetasTriggerDesktop'),
        menuDesktop: document.querySelector('#casetasDropdownDesktop'),
        containerDesktop: document.querySelector('#casetasContainerDesktop')
    };

    /**
     * Cierra un dropdown de Casetas específico.
     */
    const closeCasetasDropdown = (type) => {
        const trigger = type === 'mobile' ? casetasElements.triggerMobile : casetasElements.triggerDesktop;
        const menu = type === 'mobile' ? casetasElements.menuMobile : casetasElements.menuDesktop;
        
        if (!trigger || !menu) return;
        
        menu.classList.remove('active');
        trigger.classList.remove('active');
        trigger.setAttribute('aria-expanded', 'false');
        menu.setAttribute('aria-hidden', 'true');
        
        if (type === 'mobile') casetasState.isOpenMobile = false;
        else casetasState.isOpenDesktop = false;
    };

    /**
     * Abre un dropdown de Casetas específico.
     */
    const openCasetasDropdown = (type) => {
        const trigger = type === 'mobile' ? casetasElements.triggerMobile : casetasElements.triggerDesktop;
        const menu = type === 'mobile' ? casetasElements.menuMobile : casetasElements.menuDesktop;
        
        if (!trigger || !menu) return;
        
        // Cerrar el otro primero para evitar duplicidad
        closeCasetasDropdown(type === 'mobile' ? 'desktop' : 'mobile');

        menu.classList.add('active');
        trigger.classList.add('active');
        trigger.setAttribute('aria-expanded', 'true');
        menu.setAttribute('aria-hidden', 'false');
        
        if (type === 'mobile') casetasState.isOpenMobile = true;
        else casetasState.isOpenDesktop = true;

        // Foco accesible
        const firstItem = menu.querySelector('.casetas-dropdown-item');
        if (firstItem && !firstItem.classList.contains('casetas-dropdown-placeholder')) {
            firstItem.focus();
        }
    };

    /**
     * Renderiza dinámicamente las casetas en el menú correspondiente.
     */
    const renderCasetas = (menuElement, data = []) => {
        if (!menuElement) return;
        menuElement.innerHTML = '';

        // Manejo seguro de listas vacías / asincronía
        if (!data || data.length === 0) {
            const placeholder = document.createElement('div');
            placeholder.className = 'casetas-dropdown-placeholder';
            placeholder.textContent = 'Cargando casetas...';
            placeholder.setAttribute('role', 'status');
            menuElement.appendChild(placeholder);
            return;
        }

        // Renderizado dinámico utilizando .map() para generar los nodos del DOM
        const itemElements = data.map((caseta, index) => {
            const button = document.createElement('button');
            button.className = 'casetas-dropdown-item';
            button.type = 'button';
            button.role = 'menuitem';
            button.tabIndex = 0;

            const icon = document.createElement('i');
            icon.className = 'fas fa-store-alt dropdown-item-icon';
            button.appendChild(icon);

            const name = document.createElement('span');
            name.textContent = caseta.nombre || `Caseta ${caseta.numero || index + 1}`;
            button.appendChild(name);

            button.addEventListener('click', () => {
                console.log(`Seleccionada caseta: ${caseta.nombre}`);
                if (typeof caseta.action === 'function') {
                    caseta.action();
                }
                closeCasetasDropdown('mobile');
                closeCasetasDropdown('desktop');
            });

            return button;
        });

        // Adjuntar elementos renderizados
        itemElements.forEach(el => menuElement.appendChild(el));
    };

    // Inicializar eventos para Móvil
    if (casetasElements.triggerMobile) {
        casetasElements.triggerMobile.addEventListener('click', (e) => {
            e.stopPropagation();
            if (casetasState.isOpenMobile) {
                closeCasetasDropdown('mobile');
            } else {
                openCasetasDropdown('mobile');
            }
        });
    }

    // Inicializar eventos para Desktop
    if (casetasElements.triggerDesktop) {
        casetasElements.triggerDesktop.addEventListener('click', (e) => {
            e.stopPropagation();
            if (casetasState.isOpenDesktop) {
                closeCasetasDropdown('desktop');
            } else {
                openCasetasDropdown('desktop');
            }
        });
    }

    // Cerrar al pulsar Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (casetasState.isOpenMobile) {
                closeCasetasDropdown('mobile');
                casetasElements.triggerMobile.focus();
            }
            if (casetasState.isOpenDesktop) {
                closeCasetasDropdown('desktop');
                casetasElements.triggerDesktop.focus();
            }
        }
    });

    // Cerrar al hacer clic fuera
    document.addEventListener('click', (e) => {
        if (casetasState.isOpenMobile && casetasElements.containerMobile && !casetasElements.containerMobile.contains(e.target)) {
            closeCasetasDropdown('mobile');
        }
        if (casetasState.isOpenDesktop && casetasElements.containerDesktop && !casetasElements.containerDesktop.contains(e.target)) {
            closeCasetasDropdown('desktop');
        }
    });

    // Carga asíncrona de datos desde base de datos
    const loadCasetasFromDB = () => {
        // Renderizamos estado de carga/vacío primero
        renderCasetas(casetasElements.menuMobile, []);
        renderCasetas(casetasElements.menuDesktop, []);

        return new Promise((resolve) => {
            setTimeout(() => {
                resolve([
                    { nombre: 'Caseta El Pregonero', numero: 1, action: () => alert('Ubicando Caseta El Pregonero...') },
                    { nombre: 'Caseta La Favorita', numero: 2, action: () => alert('Ubicando Caseta La Favorita...') },
                    { nombre: 'Caseta Los Duendes', numero: 3, action: () => alert('Ubicando Caseta Los Duendes...') }
                ]);
            }, 1500); // Latencia simulada
        });
    };

    loadCasetasFromDB()
        .then(data => {
            casetasState.casetasData = data;
            renderCasetas(casetasElements.menuMobile, casetasState.casetasData);
            renderCasetas(casetasElements.menuDesktop, casetasState.casetasData);
        })
        .catch(err => {
            console.error("Error al cargar casetas:", err);
            renderCasetas(casetasElements.menuMobile, []);
            renderCasetas(casetasElements.menuDesktop, []);
        });

    console.log("Lógica del mapa interactivo (versión genérica) inicializada.");
});
