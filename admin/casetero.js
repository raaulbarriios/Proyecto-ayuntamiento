import { db } from '../firebase-config.js';
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

// SEGURIDAD: Solo permite entrar si hay sesión de casetero
const sessionData = localStorage.getItem('caseteroSession');
if (!sessionData) {
    window.location.href = 'admin.html';
}

const casetaData = JSON.parse(sessionData);

// Referencias al DOM
const casetaIdInput = document.getElementById('casetaId');
const casetaEmailInput = document.getElementById('casetaEmail');
const casetaNameInput = document.getElementById('casetaName');
const casetaPassInput = document.getElementById('casetaPass');
const caseteroForm = document.getElementById('caseteroForm');
const msgBox = document.getElementById('msgBox');
const logoutTrigger = document.getElementById('logoutTrigger');

// Cargar datos iniciales de la sesión
casetaIdInput.value = casetaData.numeroCaseta || '';
casetaEmailInput.value = casetaData.correo || '';
casetaNameInput.value = casetaData.nombreCaseta || '';
casetaPassInput.value = casetaData.password || '';

/**
 * ACTUALIZACIÓN DE DATOS
 */
caseteroForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const newName = casetaNameInput.value.trim();
    const newPass = casetaPassInput.value.trim();

    if (!newName || !newPass) {
        alert("Por favor, rellena todos los campos");
        return;
    }

    try {
        await setDoc(doc(db, "casetas", casetaData.numeroCaseta), {
            numeroCaseta: casetaData.numeroCaseta,
            nombreCaseta: newName,
            correo: casetaData.correo,
            password: newPass
        });

        // Actualizamos la sesión local con los nuevos datos
        casetaData.nombreCaseta = newName;
        casetaData.password = newPass;
        localStorage.setItem('caseteroSession', JSON.stringify(casetaData));

        // Notificar éxito
        msgBox.textContent = "¡Datos actualizados con éxito!";
        msgBox.className = "notifyBox notifySuccess";
        msgBox.style.display = "block";
        setTimeout(() => { msgBox.style.display = "none"; }, 3000);

    } catch (error) {
        console.error("Error al actualizar datos:", error);
        alert("Hubo un error al intentar guardar los cambios.");
    }
});

// CERRAR SESIÓN
logoutTrigger.addEventListener('click', () => {
    localStorage.removeItem('caseteroSession');
    window.location.href = 'admin.html';
});
