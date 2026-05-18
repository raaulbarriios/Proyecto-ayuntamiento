import { db } from '../firebase-config.js';
import { collection, query, where, getDocs, doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

// DOM Elements
const loginView = document.getElementById('loginView');
const panelView = document.getElementById('panelView');

const loginForm = document.getElementById('loginForm');
const loginCorreo = document.getElementById('loginCorreo');
const loginPassword = document.getElementById('loginPassword');
const loginSubmitBtn = document.getElementById('loginSubmitBtn');
const loginErrorMsg = document.getElementById('loginErrorMsg');

const editForm = document.getElementById('editForm');
const panelNumero = document.getElementById('panelNumero');
const panelNombre = document.getElementById('panelNombre');
const panelCorreo = document.getElementById('panelCorreo');
const panelPassword = document.getElementById('panelPassword');
const panelSaveBtn = document.getElementById('panelSaveBtn');
const panelStatusMsg = document.getElementById('panelStatusMsg');
const logoutBtn = document.getElementById('logoutBtn');

// Auth State Management
function checkAuthState() {
    // Verificar si se está abriendo por file:// (CORS block de módulos)
    if (window.location.protocol === 'file:') {
        const corsWarning = document.getElementById('corsWarningMsg');
        if (corsWarning) corsWarning.style.display = 'block';
    }

    const isAuth = localStorage.getItem('caseteroAuth') === 'true';
    if (isAuth) {
        showPanel();
    } else {
        showLogin();
    }
}

function showLogin() {
    loginView.classList.add('active');
    panelView.classList.remove('active');
    loginForm.reset();
}

function showPanel() {
    loginView.classList.remove('active');
    panelView.classList.add('active');
    loadCasetaData();
}

// Mensajes del Panel
function showPanelMessage(msg, isSuccess) {
    panelStatusMsg.innerHTML = isSuccess ? `<i class="fas fa-check-circle"></i> ${msg}` : `<i class="fas fa-exclamation-circle"></i> ${msg}`;
    panelStatusMsg.className = 'statusMsg ' + (isSuccess ? 'success' : 'error');
    setTimeout(() => {
        panelStatusMsg.style.display = 'none';
        panelStatusMsg.className = 'statusMsg';
    }, 4000);
}

// ---------------- LOGIN (CON FALLBACK DE DEMOSTRACIÓN) ----------------
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    loginErrorMsg.style.display = 'none';
    loginSubmitBtn.disabled = true;
    loginSubmitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Verificando...';

    const correoVal = loginCorreo.value.trim();
    const passwordVal = loginPassword.value.trim();

    try {
        const casetasRef = collection(db, "casetas");
        const q = query(casetasRef, where("correo", "==", correoVal), where("password", "==", passwordVal));
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
            let casetaId = null;
            querySnapshot.forEach((doc) => {
                casetaId = doc.id;
            });
            
            localStorage.setItem('caseteroAuth', 'true');
            localStorage.setItem('casetaId', casetaId);
            showPanel();
        } else if (correoVal === 'caseta@algeciras.es' && passwordVal === '123456') {
            // FALLBACK DE CORTESÍA / MODO DEMOSTRACIÓN OFICIAL
            // Permite al usuario probar el panel inmediatamente si su Firestore aún no tiene casetas registradas
            console.warn("Firestore vacío o sin coincidencia. Iniciando en Modo Demostración Oficial.");
            localStorage.setItem('caseteroAuth', 'true');
            localStorage.setItem('casetaId', 'demo_caseta_001');
            showPanel();
        } else {
            loginErrorMsg.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Credenciales incorrectas. <br><small>Tip: Usa <b>caseta@algeciras.es</b> / <b>123456</b> para modo demostración.</small>';
            loginErrorMsg.style.display = 'block';
        }
    } catch (error) {
        console.error("Error en login Firestore:", error);
        // Fallback en caso de fallo de red o permisos de Firestore
        if (correoVal === 'caseta@algeciras.es' && passwordVal === '123456') {
            localStorage.setItem('caseteroAuth', 'true');
            localStorage.setItem('casetaId', 'demo_caseta_001');
            showPanel();
        } else {
            loginErrorMsg.innerHTML = '<i class="fas fa-wifi"></i> Error de conexión con Firebase. <br><small>Tip: Usa <b>caseta@algeciras.es</b> / <b>123456</b> para entrar sin red.</small>';
            loginErrorMsg.style.display = 'block';
        }
    } finally {
        loginSubmitBtn.disabled = false;
        loginSubmitBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Entrar al Panel';
    }
});

// ---------------- PANEL: Cargar Datos ----------------
async function loadCasetaData() {
    const casetaId = localStorage.getItem('casetaId');
    if (!casetaId) return showLogin();

    const inputs = [panelNumero, panelNombre, panelCorreo, panelPassword];

    // Modo Demostración de Cortesía
    if (casetaId === 'demo_caseta_001') {
        inputs[0].value = '001 (Modo Demo)';
        inputs[1].value = 'Caseta de Pruebas';
        inputs[2].value = 'caseta@algeciras.es';
        inputs[3].value = '123456';
        inputs.forEach(input => input.classList.remove('skeleton'));
        showPanelMessage("Modo Demostración Activo", true);
        return;
    }

    try {
        const docRef = doc(db, "casetas", casetaId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const data = docSnap.data();
            inputs[0].value = data.numeroCaseta || '';
            inputs[1].value = data.nombreCaseta || '';
            inputs[2].value = data.correo || '';
            inputs[3].value = data.password || '';
        } else {
            showPanelMessage("Datos no encontrados en el servidor", false);
        }
    } catch (error) {
        console.error("Error cargando panel:", error);
        showPanelMessage("Error de conexión", false);
    } finally {
        inputs.forEach(input => input.classList.remove('skeleton'));
    }
}

// ---------------- PANEL: Guardar Datos ----------------
editForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const casetaId = localStorage.getItem('casetaId');
    if (!casetaId) return showLogin();

    panelSaveBtn.disabled = true;
    panelSaveBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Guardando...';

    try {
        const docRef = doc(db, "casetas", casetaId);
        await updateDoc(docRef, {
            nombreCaseta: panelNombre.value.trim(),
            correo: panelCorreo.value.trim(),
            password: panelPassword.value.trim()
        });

        showPanelMessage("Datos actualizados correctamente", true);
    } catch (error) {
        console.error("Error actualizando:", error);
        showPanelMessage("Error al guardar", false);
    } finally {
        panelSaveBtn.disabled = false;
        panelSaveBtn.innerHTML = '<i class="fas fa-save"></i> Guardar Cambios';
    }
});

// ---------------- CERRAR SESIÓN ----------------
logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('caseteroAuth');
    localStorage.removeItem('casetaId');
    showLogin();
});

// Inicialización de la vista
checkAuthState();
