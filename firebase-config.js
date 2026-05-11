/**
 * @file firebase-config.js
 * @description Inicialización y configuración central de Firebase.
 * Exporta las instancias de Firestore, Auth y Analytics para uso en el resto del proyecto.
 */

// Importa la función que inicializa la aplicación Firebase con nuestra configuración
import { initializeApp }  from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";

// Importa la función para activar Google Analytics dentro de Firebase
import { getAnalytics }   from "https://www.gstatic.com/firebasejs/10.11.0/firebase-analytics.js";

// Importa la función para obtener acceso a Firestore (la base de datos principal del proyecto)
import { getFirestore }   from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

// Importa la función para obtener el servicio de autenticación de usuarios de Firebase
import { getAuth }        from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";

/**
 * Objeto con las credenciales y parámetros del proyecto Firebase.
 * Estos valores son generados automáticamente por la consola de Firebase
 * y son únicos para este proyecto ("eventos-ayuntamiento").
 */
const firebaseConfig = {
  apiKey:            "AIzaSyCt9VYQN-M6wl7174y-XCHwmAs9TNAQYVg", // Clave pública que identifica el proyecto ante los servidores de Google
  authDomain:        "eventos-ayuntamiento.firebaseapp.com",       // Dominio usado para redirigir al usuario durante el inicio de sesión
  databaseURL:       "https://eventos-ayuntamiento-default-rtdb.europe-west1.firebasedatabase.app", // URL de la Realtime Database (alojada en Europa)
  projectId:         "eventos-ayuntamiento",                       // Identificador único del proyecto dentro de Firebase
  storageBucket:     "eventos-ayuntamiento.firebasestorage.app",   // Nombre del bucket para subir y almacenar archivos (imágenes, etc.)
  messagingSenderId: "375769854696",                               // ID usado por Firebase Cloud Messaging para enviar notificaciones push
  appId:             "1:375769854696:web:f6e13c750a99fc66f24f5d",  // Identificador único de esta aplicación web dentro del proyecto
  measurementId:     "G-NV58CQT7BT"                               // ID de seguimiento para Google Analytics 4
};

// Inicializa la aplicación Firebase con la configuración definida arriba;
// devuelve la instancia principal de la app que usan los demás servicios
const app       = initializeApp(firebaseConfig);

// Crea la instancia de Analytics vinculada a esta app; registra eventos de uso automáticamente
const analytics = getAnalytics(app);

// Crea la instancia de Firestore (base de datos NoSQL); es la que se usa en app.js y admin.js
const db        = getFirestore(app);

// Crea la instancia de Auth; actualmente no se usa en la interfaz pero está disponible para futuras funciones de login
const auth      = getAuth(app);

// Exporta las cuatro instancias para que otros archivos puedan importarlas con "import { db } from './firebase-config.js'"
export { app, analytics, db, auth };
