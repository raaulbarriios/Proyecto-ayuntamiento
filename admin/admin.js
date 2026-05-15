import { db } from '../firebase-config.js';
import { collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

const authForm = document.getElementById('authForm');
const userInput = document.getElementById('userInput');
const passwordInput = document.getElementById('passwordInput');
const errorBox = document.getElementById('errorBox');

authForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const user = userInput.value.trim();
    const pass = passwordInput.value.trim();

    errorBox.style.display = 'none';

    // 1. Verificación ADMINISTRADOR (Datos fijos)
    if (user === 'admin' && pass === 'admin') {
        localStorage.setItem('adminSession', 'admin');
        window.location.href = 'admin-panel.html';
        return;
    }

    // 2. Verificación CASETERO (Consulta real en Firebase)
    try {
        const casetasRef = collection(db, "casetas");
        // Buscamos coincidencia de correo y contraseña en la colección de casetas
        const q = query(casetasRef, where("correo", "==", user), where("password", "==", pass));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            // Guardamos los datos de la caseta en sesión para el panel del casetero
            const casetaData = querySnapshot.docs[0].data();
            localStorage.setItem('caseteroSession', JSON.stringify(casetaData));
            window.location.href = 'casetero.html';
        } else {
            errorBox.textContent = "Error: Credenciales no válidas";
            errorBox.style.display = 'block';
        }
    } catch (error) {
        console.error("Error en la autenticación:", error);
        errorBox.textContent = "Error de conexión con el servidor";
        errorBox.style.display = 'block';
    }
});
