import { db } from './casetero/firebase-config.js';
import { doc, getDoc, setDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

document.addEventListener('DOMContentLoaded', () => {
    // Referencias a las secciones
    const loginSection = document.getElementById('loginSection');
    const panelSection = document.getElementById('panelSection');

    // Referencias Login
    const loginForm = document.getElementById('adminLoginForm');
    const userInput = document.getElementById('userInput');
    const passInput = document.getElementById('passInput');
    const errorBox = document.getElementById('errorBox');

    // Referencias Panel
    const numCasetaInput = document.getElementById('numCaseta');
    const nombreInput = document.getElementById('nombreCaseta');
    const correoInput = document.getElementById('correo');
    const passwordInput = document.getElementById('password');
    const saveAction = document.getElementById('saveAction');
    const deleteAction = document.getElementById('deleteAction');
    const statusBox = document.getElementById('statusBox');
    const logoutBtn = document.getElementById('logoutBtn');

    /**
     * Gestión de estados de visibilidad
     */
    const showPanel = () => {
        loginSection.classList.add('hidden');
        panelSection.classList.remove('hidden');
    };

    const showLogin = () => {
        loginSection.classList.remove('hidden');
        panelSection.classList.add('hidden');
    };

    // Verificar sesión al cargar
    if (localStorage.getItem('adminSession') === 'true') {
        showPanel();
    } else {
        showLogin();
    }

    // --- LÓGICA DE LOGIN ---
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            // Verificación admin/admin fija solicitada
            if (userInput.value.trim() === 'admin' && passInput.value.trim() === 'admin') {
                localStorage.setItem('adminSession', 'true');
                showPanel();
                errorBox.style.display = 'none';
            } else {
                errorBox.style.display = 'block';
            }
        });
    }

    // --- LÓGICA DEL PANEL ---
    
    // Búsqueda automática al escribir el número
    numCasetaInput.addEventListener('input', async () => {
        const num = numCasetaInput.value.trim();
        if (!num) {
            clearFields();
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
                clearFields();
            }
        } catch (error) {
            // Manejo silencioso en frontend optimizado
        }
    });

    // Guardar / Actualizar
    saveAction.addEventListener('click', async () => {
        const num = numCasetaInput.value.trim();
        const nombre = nombreInput.value.trim();
        const correo = correoInput.value.trim();
        const pass = passwordInput.value.trim();

        if (!num || !nombre || !correo || !pass) {
            showStatus("Por favor, completa todos los campos", "error");
            return;
        }

        try {
            await setDoc(doc(db, "casetas", num), {
                numeroCaseta: num,
                nombreCaseta: nombre,
                correo: correo,
                password: pass
            });
            showStatus("¡Datos guardados con éxito!", "success");
        } catch (error) {
            showStatus("Error de conexión con Firebase", "error");
        }
    });

    // Eliminar
    deleteAction.addEventListener('click', async () => {
        const num = numCasetaInput.value.trim();
        if (!num) {
            showStatus("Escribe un número de caseta para eliminar", "error");
            return;
        }

        if (confirm(`¿Estás seguro de que quieres eliminar la caseta Nº ${num}?`)) {
            try {
                await deleteDoc(doc(db, "casetas", num));
                clearFields();
                numCasetaInput.value = '';
                showStatus("Caseta eliminada correctamente", "success");
            } catch (error) {
                showStatus("No se pudo eliminar el registro", "error");
            }
        }
    });

    // Logout
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('adminSession');
        showLogin();
    });

    const clearFields = () => {
        nombreInput.value = '';
        correoInput.value = '';
        passwordInput.value = '';
    };

    const showStatus = (msg, type) => {
        statusBox.textContent = msg;
        statusBox.className = `statusNotif ${type}`;
        statusBox.style.display = 'block';
        setTimeout(() => { statusBox.style.display = 'none'; }, 3000);
    };
});
