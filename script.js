/**
 * script.js
 * 
 * Lógica funcional del Mapa de la Feria Real.
 */

document.addEventListener('DOMContentLoaded', () => {
    // Referencias
    const mapItems = document.querySelectorAll('.mapItem');
    const infoOverlay = document.getElementById('infoOverlay');
    const closePanelBtn = document.getElementById('closePanelBtn');
    const displayName = document.getElementById('displayName');
    const displayLocation = document.getElementById('displayLocation');

    // Manejo de clicks en casetas
    mapItems.forEach(item => {
        item.addEventListener('click', () => {
            const name = item.getAttribute('data-name');
            const street = item.getAttribute('data-street');
            
            // Actualizar panel
            displayName.textContent = name;
            displayLocation.textContent = `Ubicación: ${street}`;
            
            // Mostrar panel
            infoOverlay.classList.add('active');
            infoOverlay.setAttribute('aria-hidden', 'false');
        });
    });

    // Cerrar panel
    if (closePanelBtn) {
        closePanelBtn.addEventListener('click', () => {
            infoOverlay.classList.remove('active');
            infoOverlay.setAttribute('aria-hidden', 'true');
        });
    }

    // Buscador manual
    const searchTrigger = document.getElementById('searchTrigger');
    const manualSearch = document.getElementById('manualSearch');

    if (searchTrigger) {
        searchTrigger.addEventListener('click', () => {
            const query = manualSearch.value.toLowerCase();
            console.log("Buscando caseta:", query);
            // Aquí iría la lógica de búsqueda en el mapa
        });
    }

    // Toggle buscador móvil
    const toggleMobileSearch = document.getElementById('toggleMobileSearch');
    const mobileSearchRow = document.getElementById('mobileSearchRow');
    const mobileSearchInput = document.getElementById('mobileSearchInput');

    if (toggleMobileSearch && mobileSearchRow) {
        // Toggle desde el botón
        toggleMobileSearch.addEventListener('click', (e) => {
            e.stopPropagation(); // Evitar que el clic cierre inmediatamente
            mobileSearchRow.classList.toggle('active');
            toggleMobileSearch.classList.toggle('active');
            
            const isExpanded = mobileSearchRow.classList.contains('active');
            toggleMobileSearch.setAttribute('aria-expanded', isExpanded);
            mobileSearchRow.setAttribute('aria-hidden', !isExpanded);

            if (isExpanded && mobileSearchInput) {
                // Pequeño delay para enfocar tras iniciar la animación
                setTimeout(() => mobileSearchInput.focus(), 100);
            }
        });

        // Cerrar al hacer clic fuera (perder foco)
        document.addEventListener('click', (e) => {
            if (mobileSearchRow.classList.contains('active')) {
                const isClickInsideSearch = mobileSearchRow.contains(e.target);
                const isClickOnToggle = toggleMobileSearch.contains(e.target);
                
                if (!isClickInsideSearch && !isClickOnToggle) {
                    mobileSearchRow.classList.remove('active');
                    toggleMobileSearch.classList.remove('active');
                    toggleMobileSearch.setAttribute('aria-expanded', 'false');
                    mobileSearchRow.setAttribute('aria-hidden', 'true');
                }
            }
        });

        // Evitar que clics dentro del buscador se propaguen al document
        mobileSearchRow.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    }

    console.log("Lógica del mapa interactivo inicializada.");
});
