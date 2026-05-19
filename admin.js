import { db } from './firebase-config.js';
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

    // --- LÓGICA DE LOGIN CON CONEXIÓN A FIRESTORE ---
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            errorBox.style.display = 'none';
            
            const usernameVal = userInput.value.trim();
            const passwordVal = passInput.value.trim();
            
            const submitBtn = loginForm.querySelector('.btnSubmit');
            const originalText = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> VERIFICANDO...';
            
            try {
                // Intentar validar las credenciales contra la base de datos Firestore
                const adminRef = doc(db, "admin", "credenciales");
                const adminSnap = await getDoc(adminRef);
                
                if (adminSnap.exists()) {
                    const adminData = adminSnap.data();
                    if (usernameVal === adminData.usuario && passwordVal === adminData.password) {
                        localStorage.setItem('adminSession', 'true');
                        showPanel();
                        return;
                    }
                }
                
                // Fallback para pruebas o si el documento no está creado en la base de datos
                if (usernameVal === 'admin' && passwordVal === 'admin') {
                    localStorage.setItem('adminSession', 'true');
                    showPanel();
                } else {
                    errorBox.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Credenciales incorrectas.';
                    errorBox.style.display = 'block';
                }
            } catch (err) {
                console.error("Error al validar con Firestore:", err);
                // Fallback de contingencia (sin conexión o error de CORS local)
                if (usernameVal === 'admin' && passwordVal === 'admin') {
                    localStorage.setItem('adminSession', 'true');
                    showPanel();
                } else {
                    errorBox.innerHTML = '<i class="fas fa-wifi"></i> Error de conexión. <br><small>Tip: Puedes usar admin/admin en modo local.</small>';
                    errorBox.style.display = 'block';
                }
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
        if (localStorage.getItem('adminSession') !== 'true') {
            showLogin();
            return;
        }

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
