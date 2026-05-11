/**
 * @file admin.js
 * @description Panel de administración: permite a los propietarios cargar,
 * editar y guardar los datos de su caseta en Firebase usando su ownerId.
 */

// Importa la conexión a Firestore configurada en firebase-config.js
import { db } from './firebase-config.js';

// Importa las funciones de Firestore: collection (colección), query (consulta con filtros),
// where (condición de filtro), getDocs (ejecuta la consulta), doc (referencia a documento),
// updateDoc (actualiza campos de un documento existente)
import { collection, query, where, getDocs, doc, updateDoc } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

// Botón "Cargar Caseta": el propietario lo pulsa para buscar su caseta en Firebase
const loadBtn         = document.getElementById('load-btn');
// Botón "Guardar Cambios": envía los datos editados a Firebase
const saveBtn         = document.getElementById('save-btn');
// Campo donde el propietario escribe su identificador único (ownerId)
const ownerIdInput    = document.getElementById('owner-id-input');
// Formulario de edición; permanece oculto hasta que se cargue una caseta válida
const editForm        = document.getElementById('edit-form');
// Campo editable con el nombre de la caseta
const editNombre      = document.getElementById('edit-nombre');
// Campo editable (textarea) con la descripción de la caseta
const editDescripcion = document.getElementById('edit-descripcion');
// Campo editable con el horario general de apertura
const editHorario     = document.getElementById('edit-horario');
// Contenedor donde se insertan/eliminan dinámicamente las filas de programación
const progContainer   = document.getElementById('prog-container');
// Botón "+ Añadir Nueva Actividad": inserta una fila vacía en la programación
const addActBtn       = document.getElementById('add-act-btn');

// Almacena el ID del documento de Firestore actualmente en edición.
// Es null al inicio; se asigna tras una carga exitosa y se usa al guardar.
let currentDocId = null;

/**
 * Crea e inserta una fila de actividad (hora + descripción + botón borrar).
 * @param {string} hora      - Valor inicial del campo hora; vacío por defecto
 * @param {string} actividad - Valor inicial del campo actividad; vacío por defecto
 */
function crearProgItem(hora = '', actividad = '') {
    const div = document.createElement('div');    // Crea el contenedor <div> que agrupa los tres elementos de la fila
    div.className = 'prog-item';                  // Aplica la clase CSS de estilo de fila de programación

    const timeInput = document.createElement('input'); // Crea el campo de texto para la hora
    timeInput.type        = 'text';                    // Tipo texto libre
    timeInput.className   = 'time-input';              // Clase CSS del campo de hora
    timeInput.placeholder = 'Ej: 14:00';               // Texto de ayuda cuando el campo está vacío
    timeInput.value       = hora;                      // Rellena con el valor recibido (puede ser vacío)

    const actInput = document.createElement('input'); // Crea el campo de texto para la actividad
    actInput.type        = 'text';                    // Tipo texto libre
    actInput.className   = 'act-input';               // Clase CSS del campo de actividad
    actInput.placeholder = 'Ej: Presentación...';     // Texto de ayuda cuando el campo está vacío
    actInput.value       = actividad;                 // Rellena con el valor recibido (puede ser vacío)

    const deleteBtn = document.createElement('button'); // Crea el botón de eliminación de esta fila
    deleteBtn.type        = 'button';                   // type="button" evita envíos accidentales del formulario padre
    deleteBtn.className   = 'btn-danger';               // Clase CSS de botón rojo (acción destructiva)
    deleteBtn.textContent = 'X';                        // Texto visible del botón

    deleteBtn.addEventListener('click', () => { // Escucha el clic en el botón X
        div.remove(); // Elimina del DOM toda la fila completa (hora + actividad + botón X)
    });

    div.appendChild(timeInput);      // Añade el campo hora dentro de la fila
    div.appendChild(actInput);       // Añade el campo actividad dentro de la fila
    div.appendChild(deleteBtn);      // Añade el botón X dentro de la fila
    progContainer.appendChild(div); // Inserta la fila completa al final del contenedor de programación
}

// Escucha el clic en "+ Añadir Nueva Actividad" y crea una fila en blanco
addActBtn.addEventListener('click', () => {
    crearProgItem('', ''); // Llama a crearProgItem con valores vacíos para obtener una fila en blanco
});

// Escucha el clic en "Cargar Caseta"; async porque espera respuesta de Firebase
loadBtn.addEventListener('click', async () => {
    const ownerId = ownerIdInput.value.trim(); // Lee el ownerId escrito y elimina espacios sobrantes

    if (!ownerId) { // Si el campo está vacío, no lanza la búsqueda
        alert("Por favor, ingresa tu ownerId."); // Avisa al usuario
        return; // Detiene la ejecución
    }

    const originalText  = loadBtn.textContent; // Guarda el texto original del botón para restaurarlo después
    loadBtn.textContent = "Buscando...";        // Feedback visual: indica que está procesando
    loadBtn.disabled    = true;                 // Desactiva el botón para evitar clics múltiples

    try { // Intenta ejecutar la búsqueda en Firebase
        // Consulta filtrada: documentos de "feria" donde el campo ownerId coincide con el valor introducido
        const q             = query(collection(db, "feria"), where("ownerId", "==", ownerId));
        const querySnapshot = await getDocs(q); // Ejecuta la consulta; await pausa hasta recibir respuesta

        if (querySnapshot.empty) { // Si no se encontró ningún documento...
            alert("No se encontró ninguna caseta con ese ownerId. Revisa mayúsculas/minúsculas.");
            currentDocId = null;              // Resetea el ID porque no hay caseta válida
            editForm.classList.add('hidden'); // Oculta el formulario
        } else { // Si se encontró al menos un documento...
            const docSnap = querySnapshot.docs[0]; // Toma el primero (se asume una caseta por propietario)
            currentDocId  = docSnap.id;            // Guarda el ID del documento para usarlo al guardar
            const data    = docSnap.data();        // Extrae los campos del documento de Firebase

            editNombre.value      = data.nombre      || ''; // Rellena nombre; si no existe en BD usa vacío
            editDescripcion.value = data.descripcion || ''; // Rellena descripción; si no existe usa vacío
            editHorario.value     = data.horario     || ''; // Rellena horario; si no existe usa vacío

            progContainer.innerHTML = ''; // Limpia filas anteriores para no duplicar al recargar
            if (data.programacion && Array.isArray(data.programacion)) { // Comprueba que sea un array válido
                data.programacion.forEach(item => {          // Recorre cada actividad guardada en Firebase
                    crearProgItem(item.hora, item.actividad); // Crea la fila visual con los valores de Firebase
                });
            }

            editForm.classList.remove('hidden'); // Hace visible el formulario eliminando la clase "hidden"
        }
    } catch (error) { // Captura errores de red, permisos, etc.
        console.error("Error obteniendo documento de Firestore:", error); // Log técnico en consola
        alert("Error al conectar con la base de datos.");                 // Mensaje amigable al usuario
    } finally { // Siempre se ejecuta, haya error o no
        loadBtn.textContent = originalText; // Restaura el texto original del botón
        loadBtn.disabled    = false;        // Reactiva el botón
    }
});

// Escucha el clic en "Guardar Cambios"; async porque espera respuesta de Firebase
saveBtn.addEventListener('click', async () => {
    if (!currentDocId) { // Comprueba que haya una caseta cargada antes de intentar guardar
        alert("Primero debes cargar una caseta.");
        return; // Detiene la ejecución si no hay caseta cargada
    }

    saveBtn.textContent = "Guardando..."; // Feedback visual durante el guardado
    saveBtn.disabled    = true;           // Desactiva el botón para evitar guardados dobles

    const programacionGuardar = [];                                     // Array donde se acumularán las actividades a persistir
    const progItems = progContainer.querySelectorAll('.prog-item');      // Selecciona todas las filas visibles en el DOM

    progItems.forEach(item => { // Recorre cada fila de actividad
        const hora      = item.querySelector('.time-input').value.trim(); // Lee y limpia el campo de hora
        const actividad = item.querySelector('.act-input').value.trim();  // Lee y limpia el campo de actividad

        if (hora || actividad) { // Solo guarda si al menos uno de los campos tiene contenido (evita filas en blanco)
            programacionGuardar.push({ hora, actividad }); // Añade el par { hora, actividad } al array
        }
    });

    try { // Intenta actualizar el documento en Firebase
        const docRef = doc(db, "feria", currentDocId); // Referencia directa al documento que se va a actualizar

        await updateDoc(docRef, {            // Actualiza solo los campos indicados (no borra el resto)
            nombre:       editNombre.value,  // Nuevo valor del nombre
            descripcion:  editDescripcion.value, // Nuevo valor de la descripción
            horario:      editHorario.value,     // Nuevo valor del horario
            programacion: programacionGuardar    // Array de actividades recogido del DOM
        });

        alert("¡Datos guardados en Firebase! La página se va a recargar."); // Confirma éxito al usuario
        window.location.reload(); // Recarga la página para reflejar los cambios en el mapa público
    } catch (error) { // Captura errores de red o de permisos al escribir en Firebase
        console.error("Error guardando datos:", error);      // Log técnico en consola
        alert("Error al guardar: " + error.message);         // Mensaje de error al usuario

        saveBtn.textContent = "Guardar Cambios y Actualizar Mapa"; // Restaura texto original del botón
        saveBtn.disabled    = false;                               // Reactiva el botón para un nuevo intento
    }
});
