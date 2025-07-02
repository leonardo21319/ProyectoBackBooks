// ============================================
// 📁 CREAR: Frontend/frontend/src/environments/environment.prod.ts
// ============================================

export const environment = {
  production: true,
  apiUrl: 'https://proyectobackend-4r99.onrender.com',
  
  // Configuraciones de producción
  enableLogging: false,
  debugMode: false,
  
  // Configuraciones de la aplicación
  appName: 'BookStore',
  version: '1.0.0',
  
  // Límites y configuraciones
  maxFileSize: 5 * 1024 * 1024, // 5MB
  allowedImageTypes: ['image/jpeg', 'image/png', 'image/webp'],
  
  // Configuraciones de cache (más largo en producción)
  cacheTimeout: 300000, // 5 minutos
  
  // Configuraciones de paginación
  defaultPageSize: 12,
  maxPageSize: 50,
  
  // Timeouts para requests
  requestTimeout: 30000, // 30 segundos para producción
  
  // URLs de endpoints específicos
  endpoints: {
    auth: '/auth',
    intercambio: '/intercambio',
    usuarios: '/usuarios'
  }
};