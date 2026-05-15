import { db } from '../firebase-config.js';
import { doc, getDoc, setDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

// SEGURIDAD: Solo permite entrar si hay sesión de admin
if (localStorage.getItem('adminSession') !== 'admin') {
    window.location.href = 'admin.html';
}

// Referencias al DOM
const numCasetaInput = document.getElementById('numCaseta');
const nombreInput = document.getElementById('nombreCaseta');
const correoInput = document.getElementById('correo');
const passwordInput = document.getElementById('password');
const saveActionBtn = document.getElementById('saveAction');
const deleteActionBtn = document.getElementById('deleteAction');
const statusBox = document.getElementById('statusBox');
const logoutBtn = document.getElementById('logoutBtn');

/**
 * Notifica el resultado de una acción
 */
const notify = (msg, type) => {
    statusBox.textContent = msg;
    statusBox.className = `statusNotification ${type === 'success' ? 'statusSuccess' : 'statusError'}`;
    statusBox.style.display = 'block';
    setTimeout(() => { statusBox.style.display = 'none'; }, 3000);
};

/**
 * BÚSQUEDA AUTOMÁTICA EN TIEMPO REAL
 * Al escribir el número de caseta, busca en Firestore
 */
numCasetaInput.addEventListener('input', async () => {
    const num = numCasetaInput.value.trim();
    
    if (!num) {
        clearForm();
        return;
    }

    try {
        const docRef = doc(db, "casetas", num);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const data = docSnap.data();
            nombreInput.value = data.nombreCaseta || '';
            correoInput.value = data.correo || '';
            passwordInput.value = data.password || '';
        } else {
            // Si no existe, dejamos los campos vacíos para creación nueva
            nombreInput.value = '';
            correoInput.value = '';
            passwordInput.value = '';
        }
    } catch (error) {
        console.error("Error al consultar Firebase:", error);
    }
});

/**
 * GUARDAR O ACTUALIZAR
 */
saveActionBtn.addEventListener('click', async () => {
    const num = numCasetaInput.value.trim();
    const nombre = nombreInput.value.trim();
    const correo = correoInput.value.trim();
    const pass = passwordInput.value.trim();

    if (!num || !nombre || !correo || !pass) {
        notify("Todos los campos son necesarios", "error");
        return;
    }

    try {
        await setDoc(doc(db, "casetas", num), {
            numeroCaseta: num,
            nombreCaseta: nombre,
            correo: correo,
            password: pass
        });
        notify("Base de datos actualizada con éxito", "success");
    } catch (error) {
        console.error("Error al guardar:", error);
        notify("Error al conectar con la base de datos", "error");
    }
});

/**
 * ELIMINAR CASETA
 */
deleteActionBtn.addEventListener('click', async () => {
    const num = numCasetaInput.value.trim();
    
    if (!num) {
        notify("Escribe un número de caseta para eliminar", "error");
        return;
    }

    if (!confirm(`¿Eliminar definitivamente la caseta Nº ${num}?`)) return;

    try {
        await deleteDoc(doc(db, "casetas", num));
        clearForm();
        numCasetaInput.value = '';
        notify("Caseta eliminada de la base de datos", "success");
    } catch (error) {
        console.error("Error al eliminar:", error);
        notify("No se pudo eliminar la caseta", "error");
    }
});

const clearForm = () => {
    nombreInput.value = '';
    correoInput.value = '';
    passwordInput.value = '';
};

// CERRAR SESIÓN
logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('adminSession');
    window.location.href = 'admin.html';
});
