/**
 * LÓGICA DEL PANEL DE CASETEROS
 * Este archivo gestiona el inicio de sesión, carga y guardado de datos en Firebase.
 */
import { db, auth, storage } from './firebase-config.js';
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { collection, query, where, getDocs, doc, getDoc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

// --- 1. REFERENCIAS AL DOM (Interfaz) ---
const $ = id => document.getElementById(id); // Función corta para obtener elementos

const views = { login: $('loginView'), panel: $('panelView') };
const form = {
    login: $('loginForm'), mail: $('loginCorreo'), pass: $('loginPassword'), btn: $('loginSubmitBtn'), err: $('loginErrorMsg'),
    edit: $('editForm'), num: $('panelNumero'), nom: $('panelNombre'), hor: $('panelHorario'), desc: $('panelDescripcion'),
    img: $('panelImagen'), imgPrev: $('imagenPreview'), tags: $('panelEtiquetas'), save: $('panelSaveBtn'), msg: $('panelStatusMsg')
};

// --- 2. CONTROL DE VISTAS ---
// Muestra el Panel o el Login dependiendo del estado de la sesión
const show = (view) => {
    views.login.classList.toggle('active', view === 'login');
    views.panel.classList.toggle('active', view === 'panel');
};

// Muestra mensajes flotantes (éxito/error) durante 4 segundos
const showMsg = (txt, ok) => {
    form.msg.innerHTML = `<i class="fas fa-${ok ? 'check' : 'exclamation'}-circle"></i> ${txt}`;
    form.msg.className = `statusMsg ${ok ? 'success' : 'error'}`;
    form.msg.style.display = 'block';
    setTimeout(() => form.msg.style.display = 'none', 4000);
};

// --- 3. INICIO DE SESIÓN ---
// Al enviar el formulario de login, verifica en Firebase Auth y Firestore
form.login.onsubmit = async e => {
    e.preventDefault();
    form.err.style.display = 'none';
    form.btn.disabled = true;
    form.btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Verificando...';

    const [mail, pass] = [form.mail.value.trim(), form.pass.value.trim()];

    try {
        // Modo demostración por cortesía (Usuario de prueba)
        if (mail === 'caseta@algeciras.es' && pass === '123456') {
            localStorage.setItem('casetaId', 'demo_caseta_001');
            return init(); // Carga la vista
        }

        // 1. Autentica al usuario en Firebase
        const user = (await signInWithEmailAndPassword(auth, mail, pass)).user;
        
        // 2. Busca su caseta en Firestore por su email
        const snap = await getDocs(query(collection(db, "feria"), where("ownerId", "==", user.email)));
        
        if (!snap.empty) {
            localStorage.setItem('casetaId', snap.docs[0].id); // Guarda el ID de la caseta
            init(); // Carga el panel
        } else {
            throw new Error("Sin caseta asignada");
        }
    } catch (err) {
        form.err.style.display = 'block'; // Muestra error si falla
        await signOut(auth); // Cierra sesión de seguridad por precaución
    } finally {
        form.btn.disabled = false;
        form.btn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Entrar al Panel';
    }
};

// --- 4. CARGA DE DATOS ---
// Obtiene la información de la caseta desde Firebase Firestore
const loadData = async (id) => {
    const inputs = [form.num, form.nom, form.hor, form.desc, form.img, form.tags];

    // Carga modo Demo (si es el caso)
    if (id === 'demo_caseta_001') {
        [form.num.value, form.nom.value, form.hor.value, form.desc.value, form.tags.value] = 
        ['001 (Demo)', 'Caseta de Prueba', '10:00 - 04:00', 'Descripción genérica', 'Restaurante'];
        form.imgPrev.src = 'https://via.placeholder.com/300x200?text=Imagen+Demo';
        form.imgPrev.style.display = 'block';
        inputs.forEach(i => i.classList.remove('skeleton')); // Quita efecto de carga
        return showMsg("Modo Demo Activo", true);
    }

    try {
        // Lee documento de Firebase
        const snap = await getDoc(doc(db, "feria", id));
        if (snap.exists()) {
            const d = snap.data();
            form.num.value = snap.id;
            form.nom.value = d.nombre || '';
            form.hor.value = d.horario || '';
            form.desc.value = d.descripcion || '';
            
            // Carga etiquetas (Array) como texto separado por comas
            form.tags.value = Array.isArray(d.etiquetas) ? d.etiquetas.join(', ') : (d.etiqueta || '');
            
            // Muestra imagen si existe
            if (d.imagen) {
                form.imgPrev.src = d.imagen;
                form.imgPrev.style.display = 'block';
            }
        } else {
            throw new Error("Datos no encontrados");
        }
    } catch (e) {
        showMsg("Error de conexión", false);
    } finally {
        inputs.forEach(i => i.classList.remove('skeleton')); // Quita efecto de carga
    }
};

// --- 5. SUBIR IMAGEN ---
// Previsualiza la imagen seleccionada desde el ordenador antes de guardar
form.img.onchange = e => {
    if (e.target.files[0]) {
        const reader = new FileReader();
        reader.onload = evt => { form.imgPrev.src = evt.target.result; form.imgPrev.style.display = 'block'; };
        reader.readAsDataURL(e.target.files[0]);
    }
};

// --- 6. GUARDAR DATOS ---
// Guarda los cambios realizados en el formulario hacia Firebase Firestore y Storage
form.edit.onsubmit = async e => {
    e.preventDefault();
    const id = localStorage.getItem('casetaId');
    if (!id) return init();

    form.save.disabled = true;
    form.save.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Guardando...';

    try {
        if (id === 'demo_caseta_001') return showMsg("Datos de demostración actualizados", true);

        // Preparamos datos a guardar
        const data = {
            nombre: form.nom.value.trim(),
            horario: form.hor.value.trim(),
            descripcion: form.desc.value.trim(),
            // Convierte texto de etiquetas en un Array limpio
            etiquetas: form.tags.value.split(',').map(s => s.trim()).filter(s => s) 
        };

        // Si se seleccionó una imagen nueva, se sube a Firebase Storage
        const file = form.img.files[0];
        if (file) {
            const r = ref(storage, `casetas/${id}/${file.name}`);
            data.imagen = await getDownloadURL((await uploadBytes(r, file)).ref); // Obtiene el link público
        }

        // Actualizamos en la base de datos
        await updateDoc(doc(db, "feria", id), data);
        showMsg("Datos actualizados correctamente", true);

    } catch (e) {
        showMsg("Error al guardar cambios", false);
    } finally {
        form.save.disabled = false;
        form.save.innerHTML = '<i class="fas fa-save"></i> Guardar Cambios Oficiales';
    }
};

// --- 7. CERRAR SESIÓN ---
$('logoutBtn').onclick = () => {
    signOut(auth);
    localStorage.removeItem('casetaId');
    init(); // Recarga la vista al login
};

// --- 8. INICIALIZACIÓN ---
// Comprueba al cargar la página si el usuario ya inició sesión
const init = () => {
    // Alerta para problemas locales de carga (file://)
    if (window.location.protocol === 'file:') {
        const warn = $('corsWarningMsg');
        if(warn) warn.style.display = 'block';
    }

    const id = localStorage.getItem('casetaId');
    if (id) {
        show('panel');
        loadData(id);
    } else {
        show('login');
        form.login.reset();
    }
};

init(); // Ejecutar al inicio
