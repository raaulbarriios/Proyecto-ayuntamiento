/**
 * @file app.js
 * @description Lógica principal del mapa público. Carga casetas desde Firebase en tiempo real,
 * renderiza marcadores sobre el plano, gestiona el modal de detalle y el buscador.
 */

// Importa la conexión a la base de datos Firestore configurada en firebase-config.js
import { db } from './firebase-config.js';

// Importa "collection" (para referenciar una colección de documentos) y
// "onSnapshot" (para escuchar cambios en tiempo real sin recargar la página)
import { collection, onSnapshot } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

// ── Referencias al DOM ────────────────────────────────────────────────────────

// Contenedor <div> donde se insertan los botones numéricos (marcadores) sobre la imagen del mapa
const markersContainer  = document.getElementById('markers-container');

// Capa oscura semitransparente que cubre la pantalla cuando el modal está abierto
const modalOverlay      = document.getElementById('modal-overlay');

// Botón "×" situado en la esquina del modal; al pulsarlo cierra la ventana emergente
const closeModalBtn     = document.getElementById('close-modal');

// Elemento <span> que muestra la categoría del punto seleccionado (ej: "Caseta municipal")
const puntoTipo         = document.getElementById('punto-tipo');

// Elemento <h2> que muestra el nombre de la caseta dentro del modal
const puntoNombre       = document.getElementById('punto-nombre');

// Elemento <p> que muestra el horario general de apertura de la caseta
const puntoHorario      = document.getElementById('punto-horario');

// Elemento <p> que muestra la descripción de la caseta
const puntoDescripcion  = document.getElementById('punto-descripcion');

// Elemento <ul> donde se insertan los ítems de la programación diaria de actividades
const puntoProgramacion = document.getElementById('punto-programacion');

// Campo <input> del buscador; el usuario escribe aquí para filtrar marcadores por nombre
const searchInput       = document.getElementById('search-input');

// ── Estado del módulo ─────────────────────────────────────────────────────────

// Array que almacena objetos { nombre, elemento } de cada marcador creado;
// se usa para iterar sobre ellos en el buscador sin tener que consultar el DOM cada vez
let puntosData = [];

// ── Gestión del modal ─────────────────────────────────────────────────────────

// Escucha el clic en el botón "×" y añade la clase "hidden" para ocultar el modal
closeModalBtn.addEventListener('click', () => {
    modalOverlay.classList.add('hidden'); // Oculta la capa oscura y el contenido del modal
});

// Escucha clics sobre la capa oscura del modal (el fondo)
modalOverlay.addEventListener('click', (e) => {
    // Comprueba que el clic fue directamente sobre el overlay y no sobre el contenido interior
    if (e.target === modalOverlay) {
        modalOverlay.classList.add('hidden'); // Cierra el modal solo si se clicó fuera del cuadro blanco
    }
});

// ── Carga de datos desde Firebase ─────────────────────────────────────────────

/**
 * Establece una escucha en tiempo real sobre la colección "feria" de Firestore.
 * Se vuelve a ejecutar automáticamente cada vez que los datos cambian en la base de datos.
 */
function cargarDatos() {
    try { // Intenta ejecutar el bloque; si algo falla irá al catch
        // onSnapshot mantiene abierta una conexión en tiempo real con la colección "feria"
        onSnapshot(collection(db, "feria"), (snapshot) => {
            markersContainer.innerHTML = ''; // Borra todos los marcadores existentes antes de redibujar
            puntosData = []; // Vacía el array de referencias para evitar duplicados

            if (snapshot.empty) { // Si no hay ningún documento en la colección...
                console.warn("No hay datos en Firebase."); // Avisa en la consola del navegador (sin mostrar error al usuario)
                return; // Sale de la función sin hacer nada más
            }

            let index = 0; // Contador para numerar los marcadores (0, 1, 2…)
            snapshot.forEach((doc) => { // Recorre cada documento devuelto por Firebase
                const punto = doc.data(); // Extrae los datos del documento (nombre, descripcion, posicion…)
                punto.id = doc.id; // Añade al objeto el ID del documento de Firestore (útil para operaciones futuras)
                renderizarBoton(punto, index); // Crea y añade el marcador de este punto al mapa
                index++; // Incrementa el contador para el siguiente marcador
            });
        }, (error) => { // Callback de error del onSnapshot (problemas de conexión, permisos…)
            console.error("Error al conectarse a Firebase.", error); // Registra el error técnico en la consola
        });
    } catch (e) { // Captura errores síncronos al inicializar (muy poco habitual, pero por seguridad)
        console.error("Error inicializando Firebase:", e); // Registra el error en la consola
    }
}

/**
 * Crea un botón marcador posicionado sobre el mapa y lo añade al DOM.
 * @param {Object} punto - Datos del documento Firestore (nombre, posicion, tipo…)
 * @param {number} index - Índice 0-based para la etiqueta numérica del botón
 */
function renderizarBoton(punto, index) {
    const btn = document.createElement('button'); // Crea un elemento <button> en memoria (aún no está en la página)
    btn.className = 'marker-btn'; // Asigna la clase CSS que le da el aspecto de pin circular

    if (punto.posicion) { // Comprueba si el documento tiene coordenadas de posición definidas
        btn.style.top  = punto.posicion.top;  // Posiciona el botón verticalmente sobre el mapa (valor en % o px)
        btn.style.left = punto.posicion.left; // Posiciona el botón horizontalmente sobre el mapa
    }

    btn.textContent = index + 1;                   // Muestra el número de orden (1-based) como texto del botón
    btn.title       = punto.nombre || 'Sin nombre'; // Texto emergente (tooltip) al pasar el ratón por encima

    btn.addEventListener('click', () => { // Escucha el clic en este marcador
        mostrarInfoPunto(punto); // Al hacer clic, abre el modal con la información de esta caseta
    });

    markersContainer.appendChild(btn); // Inserta el botón en el contenedor del mapa para que sea visible

    puntosData.push({ // Registra este punto en el array global para que el buscador pueda acceder a él
        nombre:   (punto.nombre || '').toLowerCase(), // Guarda el nombre en minúsculas para búsquedas insensibles a mayúsculas
        elemento: btn // Guarda la referencia al botón para poder añadir/quitar clases desde el buscador
    });
}

// ── Buscador en tiempo real ───────────────────────────────────────────────────

// Escucha cada pulsación de tecla en el campo de búsqueda
searchInput.addEventListener('input', (e) => {
    const terminoBusqueda = e.target.value.toLowerCase().trim(); // Lee el texto escrito, lo pasa a minúsculas y elimina espacios sobrantes

    if (terminoBusqueda === '') { // Si el campo de búsqueda está vacío...
        puntosData.forEach(punto => { // Recorre todos los marcadores registrados
            punto.elemento.classList.remove('highlighted'); // Elimina el resaltado visual de cada uno
        });
        return; // Sale sin hacer más comprobaciones
    }

    puntosData.forEach(punto => { // Recorre todos los marcadores registrados
        if (punto.nombre.includes(terminoBusqueda)) { // Si el nombre del marcador contiene el texto buscado...
            punto.elemento.classList.add('highlighted'); // Añade resaltado visual (CSS lo estiliza en color distinto)
        } else { // Si el nombre NO coincide con la búsqueda...
            punto.elemento.classList.remove('highlighted'); // Elimina cualquier resaltado previo
        }
    });
});

// ── Modal de detalle ──────────────────────────────────────────────────────────

/**
 * Rellena el modal con los datos del punto seleccionado y lo hace visible.
 * @param {Object} punto - Datos del documento Firestore del punto seleccionado
 */
function mostrarInfoPunto(punto) {
    puntoTipo.textContent        = punto.tipo        || 'Sin tipo';                  // Escribe la categoría; si no existe en BD usa "Sin tipo"
    puntoNombre.textContent      = punto.nombre      || 'Sin nombre';                // Escribe el nombre; si no existe usa "Sin nombre"
    puntoHorario.innerHTML       = `🕒 ${punto.horario || 'No disponible'}`;         // Escribe el horario precedido del icono de reloj
    puntoDescripcion.textContent = punto.descripcion || 'Sin descripción disponible.'; // Escribe la descripción; si no existe usa texto por defecto

    puntoProgramacion.innerHTML = ''; // Limpia la lista de actividades antes de repintarla (evita duplicados)

    if (punto.programacion && punto.programacion.length > 0) { // Comprueba que exista la lista de actividades y que no esté vacía
        punto.programacion.forEach(item => { // Recorre cada actividad de la programación
            const li = document.createElement('li'); // Crea un elemento de lista <li> para esta actividad
            li.innerHTML = `
                <span class="prog-time">${item.hora}</span>      
                <span class="prog-act">${item.actividad}</span>  
            `; // Inserta la hora y la descripción de la actividad dentro del <li>
            puntoProgramacion.appendChild(li); // Añade el <li> a la lista visible en el modal
        });
    } else { // Si no hay actividades programadas...
        puntoProgramacion.innerHTML = '<li><span class="prog-act" style="color: #6B7280;">No hay actividades programadas para hoy.</span></li>'; // Muestra un mensaje informativo en gris
    }

    modalOverlay.classList.remove('hidden'); // Hace visible el modal eliminando la clase "hidden"
}

// ── Punto de entrada ──────────────────────────────────────────────────────────

// Espera a que el navegador termine de construir la página (DOM listo) antes de ejecutar cargarDatos()
// Esto evita errores de "elemento no encontrado" si el script se ejecutara antes de que el HTML estuviera listo
document.addEventListener('DOMContentLoaded', cargarDatos);
