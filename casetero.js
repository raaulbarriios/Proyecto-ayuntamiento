import { db, auth, storage } from './firebase-config.js';
import { signInWithEmailAndPassword, updatePassword, signOut } from "firebase/auth";
import { collection, query, where, getDocs, doc, getDoc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

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
const panelHorario = document.getElementById('panelHorario');
const panelDescripcion = document.getElementById('panelDescripcion');
const panelImagen = document.getElementById('panelImagen');
const imagenPreview = document.getElementById('imagenPreview');
const panelEtiqueta = document.getElementById('panelEtiqueta');
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
    const casetaId = localStorage.getItem('casetaId');
    
    if (isAuth && casetaId) {
        showPanel();
    } else {
        // Asegurar limpieza de cualquier estado corrupto o incompleto
        localStorage.removeItem('caseteroAuth');
        localStorage.removeItem('casetaId');
        showLogin();
    }
}

function showLogin() {
    panelView.classList.remove('active');
    loginView.classList.add('active');
    loginForm.reset();
}

function showPanel() {
    const casetaId = localStorage.getItem('casetaId');
    if (!casetaId) {
        showLogin();
        return;
    }
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
        if (correoVal === 'caseta@algeciras.es' && passwordVal === '123456') {
            // FALLBACK DE CORTESÍA / MODO DEMOSTRACIÓN OFICIAL
            console.warn("Iniciando en Modo Demostración Oficial.");
            localStorage.setItem('caseteroAuth', 'true');
            localStorage.setItem('casetaId', 'demo_caseta_001');
            showPanel();
        } else {
            // 1. Autenticar con Firebase Authentication
            const userCredential = await signInWithEmailAndPassword(auth, correoVal, passwordVal);
            const user = userCredential.user;

            // 2. Consultar la colección 'feria' de Firestore por ownerId
            const feriaRef = collection(db, "feria");
            const q = query(feriaRef, where("ownerId", "==", user.email));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                let casetaId = null;
                querySnapshot.forEach((doc) => {
                    casetaId = doc.id;
                });

                localStorage.setItem('caseteroAuth', 'true');
                localStorage.setItem('casetaId', casetaId);
                showPanel();
            } else {
                loginErrorMsg.innerHTML = '<i class="fas fa-exclamation-triangle"></i> No tienes ninguna caseta asignada en este evento.';
                loginErrorMsg.style.display = 'block';
                await signOut(auth);
            }
        }
    } catch (error) {
        console.error("Error en login Firestore:", error);
        loginErrorMsg.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Credenciales incorrectas o error de conexión.';
        loginErrorMsg.style.display = 'block';
    } finally {
        loginSubmitBtn.disabled = false;
        loginSubmitBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Entrar al Panel';
    }
});

// ---------------- PANEL: Cargar Datos ----------------
async function loadCasetaData() {
    const casetaId = localStorage.getItem('casetaId');
    if (!casetaId) return showLogin();

    const inputs = [panelNumero, panelNombre, panelHorario, panelDescripcion, panelImagen, panelEtiqueta];

    // Mostrar preview si ya hay imagen
    panelImagen.addEventListener('change', function(e) {
        if(e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = function(evt) {
                imagenPreview.src = evt.target.result;
                imagenPreview.style.display = 'block';
            }
            reader.readAsDataURL(e.target.files[0]);
        }
    });

    // Modo Demostración de Cortesía
    if (casetaId === 'demo_caseta_001') {
        inputs[0].value = '001 (Modo Demo)';
        inputs[1].value = 'Caseta de Pruebas';
        inputs[2].value = '10:00 - 04:00';
        inputs[3].value = 'Descripción genérica para la caseta de demostración.';
        inputs[5].value = 'Restaurante';
        imagenPreview.src = 'https://via.placeholder.com/300x200?text=Imagen+Demo';
        imagenPreview.style.display = 'block';
        inputs.forEach(input => input.classList.remove('skeleton'));
        showPanelMessage("Modo Demostración Activo", true);
        return;
    }

    try {
        const docRef = doc(db, "feria", casetaId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const data = docSnap.data();
            inputs[0].value = docSnap.id || '';
            inputs[1].value = data.nombre || '';
            inputs[2].value = data.horario || '';
            inputs[3].value = data.descripcion || '';
            inputs[5].value = data.etiqueta || '';
            
            if (data.imagen) {
                imagenPreview.src = data.imagen;
                imagenPreview.style.display = 'block';
            } else {
                imagenPreview.style.display = 'none';
            }
        } else {
            showPanelMessage("Datos no encontrados. Sesión expirada.", false);
            setTimeout(() => {
                localStorage.removeItem('caseteroAuth');
                localStorage.removeItem('casetaId');
                showLogin();
            }, 2000);
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
        if (casetaId === 'demo_caseta_001') {
            showPanelMessage("Datos de demostración actualizados", true);
        } else {
            const docRef = doc(db, "feria", casetaId);
            const updateData = {
                nombre: panelNombre.value.trim(),
                horario: panelHorario.value.trim(),
                descripcion: panelDescripcion.value.trim(),
                etiqueta: panelEtiqueta.value.trim()
            };

            // 2. Subir imagen a Firebase Storage si se seleccionó una
            const fileInput = panelImagen.files[0];
            if (fileInput) {
                const storageRef = ref(storage, `casetas/${casetaId}/${fileInput.name}`);
                const snapshot = await uploadBytes(storageRef, fileInput);
                const downloadURL = await getDownloadURL(snapshot.ref);
                updateData.imagen = downloadURL;
            }

            await updateDoc(docRef, updateData);

            showPanelMessage("Datos actualizados correctamente", true);
        }
    } catch (error) {
        console.error("Error actualizando:", error);
        showPanelMessage("Error al guardar cambios", false);
    } finally {
        panelSaveBtn.disabled = false;
        panelSaveBtn.innerHTML = '<i class="fas fa-save"></i> Guardar Cambios Oficiales';
    }
});

// ---------------- CERRAR SESIÓN ----------------
logoutBtn.addEventListener('click', async () => {
    try {
        await signOut(auth);
    } catch (error) {
        console.error("Error al cerrar sesión de Auth:", error);
    }
    localStorage.removeItem('caseteroAuth');
    localStorage.removeItem('casetaId');
    showLogin();
});

// Inicialización de la vista
checkAuthState();
