import { db } from '../firebase-config.js';
import { doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

// Verificación de seguridad: Impedir acceso sin login
if (localStorage.getItem('caseteroAuth') !== 'true') {
    window.location.href = 'login-casetero.html';
}

const casetaId = localStorage.getItem('casetaId');
const statusMsg = document.getElementById('statusMsg');

function showMessage(msg, isSuccess) {
    statusMsg.textContent = msg;
    statusMsg.className = 'statusMsg ' + (isSuccess ? 'success' : 'error');
    setTimeout(() => {
        statusMsg.style.display = 'none';
        statusMsg.className = 'statusMsg';
    }, 4000);
}

// Cargar datos de la base de datos
async function cargarDatos() {
    try {
        const docRef = doc(db, "casetas", casetaId);
        const docSnap = await getDoc(docRef);

        const inputs = [
            document.getElementById('numeroCaseta'),
            document.getElementById('nombreCaseta'),
            document.getElementById('correo'),
            document.getElementById('password')
        ];

        if (docSnap.exists()) {
            const data = docSnap.data();
            inputs[0].value = data.numeroCaseta || '';
            inputs[1].value = data.nombreCaseta || '';
            inputs[2].value = data.correo || '';
            inputs[3].value = data.password || '';
            
            // Remover skeleton
            inputs.forEach(input => input.classList.remove('skeleton'));
        } else {
            console.error("No se encontró el documento de la caseta");
            showMessage("Error: No se encontraron los datos de la caseta.", false);
        }
    } catch (error) {
        console.error("Error al cargar los datos:", error);
        showMessage("Error de conexión al cargar datos.", false);
    }
}

// Actualizar datos
document.getElementById('editForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const saveBtn = document.getElementById('saveBtn');
    
    saveBtn.disabled = true;
    saveBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Guardando...';

    const nombreCaseta = document.getElementById('nombreCaseta').value.trim();
    const correo = document.getElementById('correo').value.trim();
    const password = document.getElementById('password').value.trim();

    try {
        const docRef = doc(db, "casetas", casetaId);
        await updateDoc(docRef, {
            nombreCaseta: nombreCaseta,
            correo: correo,
            password: password
        });

        showMessage("Datos actualizados correctamente.", true);
    } catch (error) {
        console.error("Error al actualizar:", error);
        showMessage("Error al guardar los cambios.", false);
    } finally {
        saveBtn.disabled = false;
        saveBtn.innerHTML = '<i class="fas fa-save"></i> Guardar Cambios';
    }
});

// Cerrar sesión
document.getElementById('logoutBtn').addEventListener('click', () => {
    localStorage.removeItem('caseteroAuth');
    localStorage.removeItem('casetaId');
    window.location.href = 'login-casetero.html';
});

// Inicializar la carga de datos
cargarDatos();
