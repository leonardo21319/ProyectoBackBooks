// ============================================
// 📁 ACTUALIZAR: Frontend/frontend/src/environments/environment.ts
// ============================================

export const environment = {
  production: true, // ✨ CAMBIAR A TRUE para Render
  apiUrl: 'https://proyectobackend-4r99.onrender.com', // ✨ TU URL DE RENDER
  
  // Configuraciones de producción
  enableLogging: true, // Mantener en true para debugging inicial
  debugMode: false, // Cambiar a false en producción
  
  // Configuraciones de la aplicación
  appName: 'BookStore',
  version: '1.0.0',
  
  // Límites y configuraciones
  maxFileSize: 5 * 1024 * 1024, // 5MB
  allowedImageTypes: ['image/jpeg', 'image/png', 'image/webp'],
  
  // Configuraciones de cache
  cacheTimeout: 300000, // 5 minutos para producción
  
  // Configuraciones de paginación
  defaultPageSize: 12,
  maxPageSize: 50,
  
  // Timeouts para requests (más largo para Render)
  requestTimeout: 30000, // 30 segundos para conexiones lentas
  
  // URLs de endpoints específicos
  endpoints: {
    auth: '/auth',
    intercambio: '/intercambio',
    usuarios: '/usuarios'
  }
};