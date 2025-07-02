// ============================================
// 📁 ACTUALIZAR: Frontend/frontend/src/main.ts
// ============================================

import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { routes } from './app/routes';
import { appConfig } from './app/app.config';
import { environment } from './environments/environments'; // ✅ Ruta correcta

// ✅ Log de inicio de aplicación
console.log('🚀', environment.appName, 'iniciando...');

// ✅ Información del environment (solo en desarrollo)
if (environment.enableLogging) {
  console.log('📋 Configuración:');
  console.log('   📡 API URL:', environment.apiUrl);
  console.log('   🔧 Environment:', environment.production ? 'PRODUCTION' : 'DEVELOPMENT');
  console.log('   📱 App:', environment.appName);
  console.log('   📊 Version:', environment.version);
  console.log('   🕐 Cache Timeout:', environment.cacheTimeout + 'ms');
  console.log('   ⏱️  Request Timeout:', environment.requestTimeout + 'ms');
}

bootstrapApplication(AppComponent, {
  providers: [provideRouter(routes), appConfig.providers],
})
.then(() => {
  console.log('✅', environment.appName, 'iniciado correctamente');
  
  // ✅ Solo en desarrollo: mostrar info adicional
  if (environment.debugMode) {
    console.log('🛠️  Modo debug activado');
    console.log('🔍 Logging habilitado:', environment.enableLogging);
    console.log('📋 Endpoints disponibles:', environment.endpoints);
  }
})
.catch((err) => {
  console.error('❌ Error al iniciar', environment.appName + ':', err);
  
  // ✅ Mostrar ayuda para debugging
  if (environment.debugMode) {
    console.log('🆘 Posibles soluciones:');
    console.log('   1. Verificar que todos los módulos estén importados');
    console.log('   2. Revisar la configuración de rutas');
    console.log('   3. Verificar la configuración de providers');
  }
});