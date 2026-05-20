import { app, db, auth } from './firebase-config.js';
import { doc, getDoc, setDoc, updateDoc, deleteField, collection, getDocs } from "firebase/firestore";
import { signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import { initializeApp } from "firebase/app";

const secondaryAuth = getAuth(initializeApp(app.options, "SecondaryAdminApp"));
const $ = id => document.getElementById(id);
const normalizeId = n => 'p' + n.toLowerCase().trim().replace(/^p/, '').padStart(2, '0');

document.addEventListener('DOMContentLoaded', () => {
    const [loginSec, panelSec, errorBox, statusBox] = ['loginSection', 'panelSection', 'errorBox', 'statusBox'].map($);
    const [numIn, nomIn, corIn, passIn] = ['numCaseta', 'nombreCaseta', 'correo', 'password'].map($);

    const toggleView = (isPanel) => {
        loginSec.style.setProperty('display', isPanel ? 'none' : 'flex', 'important');
        panelSec.style.setProperty('display', isPanel ? 'flex' : 'none', 'important');
        if (!isPanel) $('userInput').value = $('passInput').value = '';
    };

    const showStatus = (msg, type) => {
        statusBox.textContent = msg;
        statusBox.className = `statusNotif ${type}`;
        statusBox.style.display = 'block';
        setTimeout(() => statusBox.style.display = 'none', 3000);
    };

    const checkSession = () => localStorage.getItem('adminSession') === 'true';
    toggleView(checkSession());

    $('adminLoginForm')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        errorBox.style.display = 'none';
        const [email, pass] = [$('userInput').value.trim(), $('passInput').value.trim()];
        const btn = e.target.querySelector('.btnSubmit');
        const orig = btn.innerHTML;
        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> VERIFICANDO...';

        try {
            const user = (await signInWithEmailAndPassword(auth, email, pass)).user;
            if (user.email === 'administrador@gmail.com') {
                localStorage.setItem('adminSession', 'true');
                toggleView(true);
            } else {
                await signOut(auth);
                throw new Error('denied');
            }
        } catch (err) {
            if (email === 'administrador@gmail.com' && ['auth/user-not-found', 'auth/invalid-credential'].includes(err.code)) {
                try {
                    await createUserWithEmailAndPassword(auth, email, pass);
                    localStorage.setItem('adminSession', 'true');
                    return toggleView(true);
                } catch (ce) { err = ce; }
            }
            errorBox.innerHTML = `<i class="fas fa-exclamation-triangle"></i> Acceso denegado o credenciales incorrectas.`;
            errorBox.style.display = 'block';
        } finally {
            btn.disabled = false;
            btn.innerHTML = orig;
        }
    });

    numIn.addEventListener('input', async () => {
        if (!checkSession()) return toggleView(false);
        const num = numIn.value.trim();
        if (!num) return nomIn.value = corIn.value = passIn.value = '';

        try {
            const snap = await getDoc(doc(db, "feria", normalizeId(num)));
            if (snap.exists()) {
                const d = snap.data();
                nomIn.value = d.nombre || '';
                const oid = d.ownerId || '';
                if (oid && !oid.includes('@')) {
                    corIn.value = '';
                    corIn.placeholder = `ID: ${oid} - Reasigna email real`;
                } else {
                    corIn.value = oid;
                    corIn.placeholder = "ejemplo@correo.com";
                }
                passIn.value = '';
            } else nomIn.value = corIn.value = passIn.value = '';
        } catch (e) {}
    });

    $('saveAction').addEventListener('click', async () => {
        if (!checkSession()) return toggleView(false);
        const [num, nom, cor, pass] = [numIn, nomIn, corIn, passIn].map(i => i.value.trim());
        if (!num || !nom || !cor) return showStatus("Completa los campos", "error");

        try {
            if (pass) {
                try {
                    await createUserWithEmailAndPassword(secondaryAuth, cor, pass);
                    await signOut(secondaryAuth);
                } catch (e) { if (e.code !== 'auth/email-already-in-use') throw e; }
            }
            await setDoc(doc(db, "feria", normalizeId(num)), { nombre: nom, ownerId: cor, status: 'active' }, { merge: true });
            showStatus("¡Datos guardados con éxito!", "success");
            passIn.value = '';
        } catch (e) { showStatus("Error: " + e.message, "error"); }
    });

    $('deleteAction').addEventListener('click', async () => {
        if (!checkSession()) return toggleView(false);
        const num = numIn.value.trim();
        if (!num) return showStatus("Escribe un número de caseta", "error");
        
        if (confirm(`¿Dar de baja la caseta Nº ${num}?`)) {
            try {
                await setDoc(doc(db, "feria", normalizeId(num)), { status: 'disabled' }, { merge: true });
                nomIn.value = corIn.value = passIn.value = numIn.value = '';
                showStatus("Caseta deshabilitada correctamente", "success");
            } catch (e) { showStatus("Error al deshabilitar", "error"); }
        }
    });

    $('logoutBtn').addEventListener('click', async () => {
        await signOut(auth);
        localStorage.removeItem('adminSession');
        toggleView(false);
    });

    window.normalizeDatabase = async () => {
        if (!checkSession()) return console.error("Sesión requerida");
        try {
            const snaps = await getDocs(collection(db, "feria"));
            let c = 0;
            for (const s of snaps.docs) {
                const d = s.data(), u = {};
                if (d.status === undefined) u.status = 'active';
                if (d.descripcion === undefined) u.descripcion = '';
                if (d.horario === undefined) u.horario = '';
                if (d.nombre === undefined) u.nombre = '';
                if (d.ownerId === undefined) u.ownerId = '';
                if (d.programacion === undefined) u.programacion = [];
                ['email', 'updatedAt', 'deletedAt', 'deleteAt', 'updateAt', 'password'].forEach(f => {
                    if (d[f] !== undefined) u[f] = deleteField();
                });
                if (Object.keys(u).length > 0) { await updateDoc(s.ref, u); c++; }
            }
            alert(`¡Completado! Estructura normalizada en ${c} casetas.`);
        } catch (e) { console.error("Error al normalizar:", e); }
    };
});
