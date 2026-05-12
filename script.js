/**
 * script.js
 * 
<<<<<<< Updated upstream
<<<<<<< Updated upstream
 * Lógica para la aplicación del Mapa de Eventos de Algeciras.
 * Desarrollado con nombres de variables en inglés para reusabilidad, pero con contenido en español para los usuarios.
=======
 * Lógica de interacción institucional: Búsqueda Interactiva.
>>>>>>> Stashed changes
 */

// Importar la configuración compartida de Firebase
import { db } from './firebase-config.js';

// Estado de la Aplicación
const appState = {
    selectedItemId: null,
    isPanelVisible: false
};

// Referencias al DOM
const manualSearchInput = document.getElementById('manualSearch');
const searchTriggerBtn = document.getElementById('searchTrigger');
const mapItems = document.querySelectorAll('.mapItem');
const infoOverlay = document.getElementById('infoOverlay');
const closePanelBtn = document.getElementById('closePanelBtn');
const displayName = document.getElementById('displayName');
const displayLocation = document.getElementById('displayLocation');

/**
 * Actualiza el panel de información con los datos del elemento seleccionado
 * @param {Element} element - El elemento del mapa seleccionado
 */
const updateDetailsPanel = (element) => {
    const itemName = element.dataset.name || "Sin nombre";
    const ownerId = element.dataset.ownerId || "No disponible"; // Ejemplo de camelCase solicitado

    displayName.textContent = itemName;
    displayLocation.textContent = `Identificador: ${ownerId}`;

    infoOverlay.classList.add('visible');
    infoOverlay.setAttribute('aria-hidden', 'false');

    // Limpiar estados activos previos
    mapItems.forEach(item => item.classList.remove('active'));
    element.classList.add('active');
};

/**
 * Maneja la lógica de búsqueda manual para resaltar elementos
 */
const executeManualSearch = () => {
    const query = manualSearchInput.value.toLowerCase().trim();
    if (!query) return;

    let foundItem = null;
    mapItems.forEach(item => {
        const itemName = (item.dataset.name || "").toLowerCase();
        if (itemName.includes(query)) {
            foundItem = item;
        }
    });

    if (foundItem) {
        updateDetailsPanel(foundItem);
        foundItem.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
        alert("No se encontró ninguna caseta con ese nombre.");
    }
};

/**
 * Cierra el panel de información desplegable
 */
const closeDetailsPanel = () => {
    infoOverlay.classList.remove('visible');
    infoOverlay.setAttribute('aria-hidden', 'true');
    mapItems.forEach(item => item.classList.remove('active'));
};

// Escuchadores de Eventos
searchTriggerBtn.addEventListener('click', executeManualSearch);

manualSearchInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        executeManualSearch();
    }
});

mapItems.forEach(item => {
    item.addEventListener('click', () => updateDetailsPanel(item));

    // Soporte para accesibilidad
    item.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            updateDetailsPanel(item);
        }
    });
});

closePanelBtn.addEventListener('click', closeDetailsPanel);

// Inicializar la persistencia con Firebase (Configuración genérica)
const initializeAppPersistence = () => {
    // Nota: La inicialización real ocurre en firebase-config.js
    console.log("Módulo de persistencia listo.");
};

// Inicio de la aplicación
document.addEventListener('DOMContentLoaded', () => {
    initializeAppPersistence();
=======
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

    if (toggleMobileSearch && mobileSearchRow) {
        toggleMobileSearch.addEventListener('click', () => {
            mobileSearchRow.classList.toggle('active');
            toggleMobileSearch.classList.toggle('active');
            const isExpanded = mobileSearchRow.classList.contains('active');
            toggleMobileSearch.setAttribute('aria-expanded', isExpanded);
            mobileSearchRow.setAttribute('aria-hidden', !isExpanded);
        });
    }

    console.log("Lógica del mapa interactivo inicializada.");
>>>>>>> Stashed changes
});
