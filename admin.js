import { db, auth } from './firebase-config.js';
import { doc, getDoc, setDoc, deleteDoc } from "firebase/firestore";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";

const normalizeId = (num) => {
    let docId = num.toLowerCase().trim();
    if (!docId) return '';
    if (docId.startsWith('p')) {
        docId = docId.substring(1);
    }
    // Rellenar con ceros a la izquierda para tener siempre formato pXX
    return 'p' + docId.padStart(2, '0');
};

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
     * Gestión de estados de visibilidad libres de parpadeos
     */
    const showPanel = () => {
        loginSection.style.setProperty('display', 'none', 'important');
        panelSection.style.setProperty('display', 'flex', 'important');
    };

    const showLogin = () => {
        loginSection.style.setProperty('display', 'flex', 'important');
        panelSection.style.setProperty('display', 'none', 'important');
        userInput.value = '';
        passInput.value = '';
    };

    // Verificar sesión de forma inmediata
    if (localStorage.getItem('adminSession') === 'true') {
        showPanel();
    } else {
        showLogin();
    }

    // --- LÓGICA DE LOGIN CON CONEXIÓN A FIREBASE AUTHENTICATION ---
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            errorBox.style.display = 'none';
            
            const emailVal = userInput.value.trim();
            const passwordVal = passInput.value.trim();
            
            const submitBtn = loginForm.querySelector('.btnSubmit');
            const originalText = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> VERIFICANDO...';
            
            try {
                // 1. Autenticar con Firebase Authentication
                const userCredential = await signInWithEmailAndPassword(auth, emailVal, passwordVal);
                const user = userCredential.user;

                // 2. Verificar que el usuario tenga el correo exacto del administrador
                if (user.email === 'administrador@gmail.com') {
                    localStorage.setItem('adminSession', 'true');
                    showPanel();
                } else {
                    // Si no es el administrador, cerrar sesión y mostrar error
                    await signOut(auth);
                    errorBox.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Acceso denegado. No tienes permisos de administrador.';
                    errorBox.style.display = 'block';
                }
            } catch (err) {
                console.error("Error al validar con Firebase Auth:", err);
                errorBox.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Credenciales incorrectas o error de conexión.';
                errorBox.style.display = 'block';
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;
            }
        });
    }

    // --- LÓGICA DEL PANEL (PROTEGIDA CON SESIÓN COMPLETA) ---
    
    // Búsqueda automática al escribir el número
    numCasetaInput.addEventListener('input', async () => {
        if (localStorage.getItem('adminSession') !== 'true') {
            showLogin();
            return;
        }

        const num = numCasetaInput.value.trim();
        if (!num) {
            clearFields();
            return;
        }

        const docId = normalizeId(num);

        try {
            const docRef = doc(db, "feria", docId);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const data = docSnap.data();
                nombreInput.value = data.nombre || '';
                correoInput.value = data.ownerId || data.email || '';
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
        if (localStorage.getItem('adminSession') !== 'true') {
            showLogin();
            return;
        }

        const num = numCasetaInput.value.trim();
        const nombre = nombreInput.value.trim();
        const correo = correoInput.value.trim();
        const pass = passwordInput.value.trim();

        if (!num || !nombre || !correo || !pass) {
            showStatus("Por favor, completa todos los campos", "error");
            return;
        }

        const docId = normalizeId(num);

        try {
            // Guardar usando merge: true para no borrar horario, descripcion ni programacion de la caseta
            await setDoc(doc(db, "feria", docId), {
                nombre: nombre,
                ownerId: correo,
                email: correo,
                password: pass
            }, { merge: true });
            
            showStatus("¡Datos guardados con éxito!", "success");
        } catch (error) {
            showStatus("Error de conexión con Firebase", "error");
        }
    });

    // Eliminar
    deleteAction.addEventListener('click', async () => {
        if (localStorage.getItem('adminSession') !== 'true') {
            showLogin();
            return;
        }

        const num = numCasetaInput.value.trim();
        if (!num) {
            showStatus("Escribe un número de caseta para eliminar", "error");
            return;
        }

        const docId = normalizeId(num);

        if (confirm(`¿Estás seguro de que quieres eliminar la caseta Nº ${num} (${docId})?`)) {
            try {
                await deleteDoc(doc(db, "feria", docId));
                clearFields();
                numCasetaInput.value = '';
                showStatus("Caseta eliminada correctamente", "success");
            } catch (error) {
                showStatus("No se pudo eliminar el registro", "error");
            }
        }
    });

    // Logout
    logoutBtn.addEventListener('click', async () => {
        try {
            await signOut(auth);
        } catch (error) {
            console.error("Error al cerrar sesión de Auth:", error);
        }
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
