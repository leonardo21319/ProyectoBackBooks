// Importa el pool de la configuración de la base de datos
import pool from './configDB.js';  

// Función para probar la conexión a la base de datos
async function testConnection() {
  try {
    const client = await pool.connect();
    console.log("Conexión exitosa a la base de datos!");
    client.release();  // Liberar la conexión cuando ya no se necesita
  } catch (err) {
    console.error("Error de conexión:", err);
  }
}

// Exportar la función para usarla en otros archivos
export default testConnection;
