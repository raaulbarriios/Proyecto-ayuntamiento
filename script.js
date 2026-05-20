// ============================================================================
// 1. IMPORTACIÓN DE MÓDULOS (Firebase)
// ============================================================================
// Importación de las funciones oficiales de Firebase necesarias para 
// la gestión de Firestore y la autenticación de usuarios.
import { app, db, auth } from './firebase-config.js';
import { doc, getDoc, setDoc, updateDoc, deleteField, collection, getDocs } from "firebase/firestore";
import { signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import { initializeApp } from "firebase/app";

// ============================================================================
// 2. CONFIGURACIÓN INICIAL
// ============================================================================
// Instancia secundaria de Firebase App para permitir la creación de nuevos
// usuarios sin alterar la sesión activa del administrador actual.
const secondaryAuth = getAuth(initializeApp(app.options, "SecondaryAdminApp"));

// Helper para selección ágil de elementos del DOM por su ID.
const $ = id => document.getElementById(id);

// Función utilitaria para normalizar el ID de la caseta ("p01", "p02").
const normalizeId = n => 'p' + n.toLowerCase().trim().replace(/^p/, '').padStart(2, '0');

// ============================================================================
// 3. CONTROLADOR PRINCIPAL
// ============================================================================
document.addEventListener('DOMContentLoaded', () => {
    
    // Referencias a los contenedores principales de la interfaz.
    const [loginSec, panelSec, errorBox, statusBox] = ['loginSection', 'panelSection', 'errorBox', 'statusBox'].map($);
    
    // Referencias a los inputs del formulario de gestión.
    const [numIn, nomIn, corIn, passIn] = ['numCaseta', 'nombreCaseta', 'correo', 'password'].map($);

    // ------------------------------------------------------------------------
    // CONTROL DE VISTAS (Gestor de Estado UI)
    // ------------------------------------------------------------------------
    const toggleView = (isPanel) => {
        loginSec.style.setProperty('display', isPanel ? 'none' : 'flex', 'important');
        panelSec.style.setProperty('display', isPanel ? 'flex' : 'none', 'important');
        if (!isPanel) $('userInput').value = $('passInput').value = ''; // Limpieza de campos por seguridad
    };

    // Función para renderizar notificaciones de estado en la UI.
    const showStatus = (msg, type) => {
        statusBox.textContent = msg;
        statusBox.className = `statusNotif ${type}`;
        statusBox.style.display = 'block';
        setTimeout(() => statusBox.style.display = 'none', 3000); // Auto-ocultado en 3s
    };

    // Validación de sesión activa almacenada en LocalStorage.
    const checkSession = () => localStorage.getItem('adminSession') === 'true';
    toggleView(checkSession());

    // ------------------------------------------------------------------------
    // AUTENTICACIÓN ADMINISTRATIVA
    // ------------------------------------------------------------------------
    $('adminLoginForm')?.addEventListener('submit', async (e) => {
        e.preventDefault(); 
        errorBox.style.display = 'none';
        
        const [email, pass] = [$('userInput').value.trim(), $('passInput').value.trim()];
        const btn = e.target.querySelector('.btnSubmit');
        const orig = btn.innerHTML;
        
        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> VERIFICANDO...';

        try {
            // Intento de autenticación.
            const user = (await signInWithEmailAndPassword(auth, email, pass)).user;
            
            // Validación de rol estricta (Solo administrador autorizado).
            if (user.email === 'administrador@gmail.com') {
                localStorage.setItem('adminSession', 'true');
                toggleView(true);
            } else {
                await signOut(auth); // Revocación inmediata si el usuario no es admin.
                throw new Error('denied');
            }
        } catch (err) {
            // Proceso de inicialización automática en caso de cuenta inexistente.
            if (email === 'administrador@gmail.com' && ['auth/user-not-found', 'auth/invalid-credential'].includes(err.code)) {
                try {
                    await createUserWithEmailAndPassword(auth, email, pass);
                    localStorage.setItem('adminSession', 'true');
                    return toggleView(true);
                } catch (ce) {}
            }
            errorBox.innerHTML = `<i class="fas fa-exclamation-triangle"></i> Acceso denegado.`;
            errorBox.style.display = 'block';
        } finally {
            btn.disabled = false;
            btn.innerHTML = orig;
        }
    });

    // ------------------------------------------------------------------------
    // BUSCADOR EN TIEMPO REAL
    // ------------------------------------------------------------------------
    // Listener que dispara la consulta a Firestore basado en el ID introducido.
    numIn.addEventListener('input', async () => {
        if (!checkSession()) return toggleView(false); 
        
        const num = numIn.value.trim();
        if (!num) return nomIn.value = corIn.value = passIn.value = ''; // Reset UI si está vacío

        try {
            // Consulta del documento en Firestore.
            const snap = await getDoc(doc(db, "feria", normalizeId(num)));
            
            if (snap.exists()) {
                const d = snap.data();
                nomIn.value = d.nombre || '';
                const oid = d.ownerId || '';
                
                // Formateo del input según el tipo de ownerId almacenado.
                if (oid && !oid.includes('@')) {
                    corIn.value = '';
                    corIn.placeholder = `ID: ${oid} - Reasigna email real`;
                } else {
                    corIn.value = oid;
                    corIn.placeholder = "ejemplo@correo.com";
                }
                passIn.value = ''; // Bloqueo de exposición de contraseñas por seguridad.
            } else {
                nomIn.value = corIn.value = passIn.value = '';
            }
        } catch (e) {} // Captura silenciosa para evitar bloqueos por entradas parciales
    });

    // ------------------------------------------------------------------------
    // ACCIÓN: GUARDAR O ACTUALIZAR DATOS
    // ------------------------------------------------------------------------
    $('saveAction').addEventListener('click', async () => {
        if (!checkSession()) return toggleView(false);
        
        const [num, nom, cor, pass] = [numIn, nomIn, corIn, passIn].map(i => i.value.trim());
        if (!num || !nom || !cor) return showStatus("Completa los campos requeridos", "error");

        try {
            // Si se provee contraseña, se ejecuta actualización/creación de cuenta en Auth.
            if (pass) {
                try {
                    await createUserWithEmailAndPassword(secondaryAuth, cor, pass);
                    await signOut(secondaryAuth);
                } catch (e) { 
                    // Bypass del error si el usuario ya existe previamente.
                    if (e.code !== 'auth/email-already-in-use') throw e; 
                }
            }
            
            // Persistencia de los metadatos de la caseta en Firestore (Merge mode).
            await setDoc(doc(db, "feria", normalizeId(num)), { nombre: nom, ownerId: cor, status: 'active' }, { merge: true });
            
            showStatus("Datos guardados con éxito", "success");
            passIn.value = ''; // Limpieza de credenciales en UI.
        } catch (e) { 
            showStatus("Error: " + e.message, "error"); 
        }
    });

    // ------------------------------------------------------------------------
    // ACCIÓN: ELIMINACIÓN LÓGICA (SOFT DELETE)
    // ------------------------------------------------------------------------
    $('deleteAction').addEventListener('click', async () => {
        if (!checkSession()) return toggleView(false);
        
        const num = numIn.value.trim();
        if (!num) return showStatus("Especifique un número de caseta válido", "error");
        
        // Confirmación requerida para prevenir acciones accidentales.
        if (confirm(`¿Proceder con la baja lógica de la caseta Nº ${num}?`)) {
            try {
                // Actualización de estado en lugar de borrado físico del registro.
                await setDoc(doc(db, "feria", normalizeId(num)), { status: 'disabled' }, { merge: true });
                
                nomIn.value = corIn.value = passIn.value = numIn.value = '';
                showStatus("Caseta deshabilitada correctamente", "success");
            } catch (e) { 
                showStatus("Error durante el proceso de deshabilitación", "error"); 
            }
        }
    });

    // ------------------------------------------------------------------------
    // ACCIÓN: CIERRE DE SESIÓN
    // ------------------------------------------------------------------------
    $('logoutBtn').addEventListener('click', async () => {
        await signOut(auth); // Cierre de sesión en Firebase
        localStorage.removeItem('adminSession'); // Limpieza de estado local
        toggleView(false); // Retorno a la pantalla de autenticación
    });

    // ============================================================================
    // HERRAMIENTA DE MANTENIMIENTO: NORMALIZACIÓN DE ESQUEMA DE DATOS
    // ============================================================================
    // Script utilitario para estandarizar todos los documentos de la colección
    // "feria", eliminando campos deprecados y garantizando la presencia de los requeridos.
    window.normalizeDatabase = async () => {
        if (!checkSession()) return console.error("Acceso denegado: Sesión requerida");
        try {
            const snaps = await getDocs(collection(db, "feria"));
            let c = 0; // Contador de documentos actualizados
            
            for (const s of snaps.docs) {
                const d = s.data(), u = {};
                
                // 1. Inserción de propiedades base faltantes
                if (d.status === undefined) u.status = 'active';
                if (d.descripcion === undefined) u.descripcion = '';
                if (d.horario === undefined) u.horario = '';
                if (d.nombre === undefined) u.nombre = '';
                if (d.ownerId === undefined) u.ownerId = '';
                if (d.programacion === undefined) u.programacion = [];
                
                // 2. Eliminación de metadata redundante o no permitida
                ['email', 'updatedAt', 'deletedAt', 'deleteAt', 'updateAt', 'password'].forEach(f => {
                    if (d[f] !== undefined) u[f] = deleteField();
                });
                
                // Ejecución condicional del update
                if (Object.keys(u).length > 0) { await updateDoc(s.ref, u); c++; }
            }
            console.log(`Normalización completada. Total de casetas corregidas: ${c}.`);
            alert(`Proceso finalizado. Casetas normalizadas: ${c}.`);
        } catch (e) { console.error("Fallo durante la normalización de la DB:", e); }
    };
});
