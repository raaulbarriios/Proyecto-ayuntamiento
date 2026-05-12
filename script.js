/**
 * script.js
 * 
 * Lógica funcional del Mapa de la Feria Real - Ayuntamiento de Algeciras.
 * 
 * Este archivo gestiona la interactividad del frontend, incluyendo:
 * - La funcionalidad del mapa interactivo (casetas).
 * - La visualización del panel de detalles de información.
 * - El comportamiento del buscador móvil desplegable y accesible.
 * - [FUTURO]: Conexión con Firebase para alimentar datos dinámicamente.
 */

// Utilizamos un patrón IIFE (Immediately Invoked Function Expression)
// para evitar contaminar el scope global y mantener las variables seguras.
(() => {
    'use strict';

    // ==========================================
    // 1. INICIALIZACIÓN Y REFERENCIAS DEL DOM
    // ==========================================

    // Esperamos a que el HTML del documento esté completamente cargado.
    document.addEventListener('DOMContentLoaded', () => {
        
        // Referencias a los elementos del mapa interactivo (Casetas/SVG rects)
        const mapItems = document.querySelectorAll('.mapItem');
        
        // Referencias al panel lateral de detalles (Aside)
        const infoOverlay = document.getElementById('infoOverlay');
        const closePanelBtn = document.getElementById('closePanelBtn');
        const displayName = document.getElementById('displayName');
        const displayLocation = document.getElementById('displayLocation');

        // Referencias al buscador de escritorio
        const searchTrigger = document.getElementById('searchTrigger');
        const manualSearch = document.getElementById('manualSearch');

        // Referencias al buscador móvil
        const toggleMobileSearch = document.getElementById('toggleMobileSearch');
        const mobileSearchRow = document.getElementById('mobileSearchRow');
        const mobileSearchInput = document.getElementById('mobileSearchInput');

        // ==========================================
        // 2. LÓGICA DEL MAPA INTERACTIVO Y PANEL
        // ==========================================

        /**
         * Manejador para abrir el panel de información de una caseta.
         * Extrae los datos desde los atributos 'data-*' del elemento clickeado.
         * [FUTURO FIREBASE]: En el futuro, aquí en lugar de leer 'data-*', 
         * se buscará el ID de la caseta en el JSON recuperado de Firebase.
         */
        const handleMapItemClick = (item) => {
            // Extraemos la información básica incrustada en el HTML
            const name = item.getAttribute('data-name');
            const street = item.getAttribute('data-street');
            
            // Actualizamos los textos dentro del panel lateral
            if (displayName && displayLocation) {
                displayName.textContent = name || 'Caseta sin nombre';
                displayLocation.textContent = `Ubicación: ${street || 'Desconocida'}`;
            }
            
            // Mostramos el panel lateral añadiendo la clase 'active'
            if (infoOverlay) {
                infoOverlay.classList.add('active');
                // Actualizamos atributos ARIA para accesibilidad (WCAG)
                infoOverlay.setAttribute('aria-hidden', 'false');
            }
        };

        // Recorremos todos los elementos interactivos del mapa (casetas)
        mapItems.forEach(item => {
            // Soporte para interacción con el ratón/táctil
            item.addEventListener('click', () => handleMapItemClick(item));
            
            // Soporte para accesibilidad (interacción con teclado: Enter o Espacio)
            item.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault(); // Evitamos que la pantalla salte con el espacio
                    handleMapItemClick(item);
                }
            });
        });

        // Lógica para cerrar el panel lateral
        if (closePanelBtn && infoOverlay) {
            closePanelBtn.addEventListener('click', () => {
                infoOverlay.classList.remove('active');
                infoOverlay.setAttribute('aria-hidden', 'true');
            });
        }

        // ==========================================
        // 3. LÓGICA DEL BUSCADOR DE ESCRITORIO
        // ==========================================

        if (searchTrigger && manualSearch) {
            searchTrigger.addEventListener('click', () => {
                const query = manualSearch.value.trim().toLowerCase();
                console.log("Buscando en escritorio:", query);
                // [FUTURO FIREBASE]: Aquí se filtrará el array de casetas devuelto por Firebase
            });

            // Permitir búsqueda presionando "Enter" en el input
            manualSearch.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    searchTrigger.click();
                }
            });
        }

        // ==========================================
        // 4. LÓGICA DEL BUSCADOR MÓVIL (DESPLEGABLE)
        // ==========================================

        if (toggleMobileSearch && mobileSearchRow && mobileSearchInput) {
            
            // Evento principal para abrir/cerrar el buscador al tocar la lupa
            toggleMobileSearch.addEventListener('click', (e) => {
                // Evita que el clic se propague al 'document' y dispare la función de cierre inmediatamente
                e.stopPropagation(); 
                
                // Alternamos las clases para animar el despliegue
                mobileSearchRow.classList.toggle('active');
                toggleMobileSearch.classList.toggle('active');
                
                // Comprobamos si ahora está abierto o cerrado
                const isExpanded = mobileSearchRow.classList.contains('active');
                
                // Actualizamos atributos ARIA para los lectores de pantalla
                toggleMobileSearch.setAttribute('aria-expanded', isExpanded);
                mobileSearchRow.setAttribute('aria-hidden', !isExpanded);

                // Si se ha abierto, enfocamos el input automáticamente para sacar el teclado táctil
                if (isExpanded) {
                    // Usamos setTimeout para dar tiempo a que la animación CSS comience antes de enfocar
                    setTimeout(() => mobileSearchInput.focus(), 100);
                }
            });

            // Evento para cerrar el buscador móvil si se hace clic/toque fuera de él
            document.addEventListener('click', (e) => {
                // Solo nos importa revisar si el buscador está actualmente abierto
                if (mobileSearchRow.classList.contains('active')) {
                    // Comprobamos si el clic ocurrió dentro del buscador o en el botón de la lupa
                    const isClickInsideSearch = mobileSearchRow.contains(e.target);
                    const isClickOnToggle = toggleMobileSearch.contains(e.target);
                    
                    // Si el clic fue FUERA de ambos elementos, cerramos el buscador
                    if (!isClickInsideSearch && !isClickOnToggle) {
                        mobileSearchRow.classList.remove('active');
                        toggleMobileSearch.classList.remove('active');
                        toggleMobileSearch.setAttribute('aria-expanded', 'false');
                        mobileSearchRow.setAttribute('aria-hidden', 'true');
                    }
                }
            });

            // Evitamos que clics dentro del propio buscador se propagen al 'document' y lo cierren
            mobileSearchRow.addEventListener('click', (e) => {
                e.stopPropagation();
            });
            
            // Accesibilidad para cerrar el buscador con la tecla 'Escape'
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && mobileSearchRow.classList.contains('active')) {
                    mobileSearchRow.classList.remove('active');
                    toggleMobileSearch.classList.remove('active');
                    toggleMobileSearch.setAttribute('aria-expanded', 'false');
                    mobileSearchRow.setAttribute('aria-hidden', 'true');
                    toggleMobileSearch.focus(); // Devolvemos el foco al botón de la lupa
                }
            });
        }

        console.info("Lógica del mapa interactivo inicializada correctamente.");
    });

})();
