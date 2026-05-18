import { db } from '../firebase-config.js';
import { collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

// Si ya está logueado, redirigir al panel
if (localStorage.getItem('caseteroAuth') === 'true') {
    window.location.href = 'panel-casetero.html';
}

document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const correo = document.getElementById('correo').value.trim();
    const password = document.getElementById('password').value.trim();
    const errorMsg = document.getElementById('errorMsg');
    const submitBtn = document.getElementById('submitBtn');
    
    errorMsg.style.display = 'none';
    submitBtn.disabled = true;
    submitBtn.textContent = 'Verificando...';

    try {
        const casetasRef = collection(db, "casetas");
        const q = query(casetasRef, where("correo", "==", correo), where("password", "==", password));
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
            let casetaId = null;
            
            querySnapshot.forEach((doc) => {
                casetaId = doc.id;
            });
            
            // Mantener sesión iniciada
            localStorage.setItem('caseteroAuth', 'true');
            localStorage.setItem('casetaId', casetaId);
            
            window.location.href = 'panel-casetero.html';
        } else {
            errorMsg.textContent = 'Correo o contraseña incorrectos.';
            errorMsg.style.display = 'block';
        }
    } catch (error) {
        console.error("Error validando login:", error);
        errorMsg.textContent = "Error de conexión. Inténtalo más tarde.";
        errorMsg.style.display = 'block';
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Iniciar Sesión';
    }
});
