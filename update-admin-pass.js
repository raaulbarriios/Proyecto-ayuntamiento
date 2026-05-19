const admin = require('firebase-admin');

// Intentar cargar el archivo de credenciales
let serviceAccount;
try {
    serviceAccount = require('./service-account.json');
} catch (e) {
    console.error("ERROR: No se encontró el archivo 'service-account.json' en el directorio raíz.");
    console.error("Por favor, descarga la clave privada de tu cuenta de servicio desde la consola de Firebase:");
    console.error("Configuración del proyecto -> Cuentas de servicio -> Generar nueva clave privada.");
    console.error("Guarda el archivo como 'service-account.json' en este directorio y vuelve a ejecutar el script.");
    process.exit(1);
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

async function updateAdminPassword() {
  const email = 'administrador@gmail.com';
  const newPassword = '123456789';

  try {
    // Intentar buscar el usuario por email
    let userRecord;
    try {
      userRecord = await admin.auth().getUserByEmail(email);
      console.log(`Usuario ${email} encontrado con UID: ${userRecord.uid}`);
      
      // Actualizar contraseña
      await admin.auth().updateUser(userRecord.uid, {
        password: newPassword
      });
      console.log(`Contraseña para ${email} actualizada exitosamente a: ${newPassword}`);
    } catch (error) {
      if (error.code === 'auth/user-not-found') {
        console.log(`El usuario ${email} no existe. Creándolo...`);
        // Crear usuario administrador
        userRecord = await admin.auth().createUser({
          email: email,
          password: newPassword,
          emailVerified: true
        });
        console.log(`Usuario administrador creado con UID: ${userRecord.uid} y contraseña: ${newPassword}`);
      } else {
        throw error;
      }
    }
  } catch (err) {
    console.error("Error al actualizar la contraseña del administrador:", err);
  }
}

updateAdminPassword();
