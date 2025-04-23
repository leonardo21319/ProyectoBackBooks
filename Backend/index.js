//Importacion de modulos de configuraciones
import config from './configuracion/config_index.js';
//Importacion de modulos de rutas
import indexRutas from './src/modulos/autentificacion/ruta_autentificacion.js';
import cargarAlumnosRutas from './src/modulos/cargar_alumnos/ruta_cargarAlumnos.js';

//Librerias
import express from 'express';
import path from 'path';
import cors from 'cors';

const app = express();

//Configuraciones
const puerto = process.env.PORT || 3000;
const { __dirname } = config;
//Middleware para archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//Middleware para la autenticación
app.use(
    cors({
        origin: '*',
        allowedHeaders: 'Content-Type,Authorization',
        methods: 'GET,POST,DELETE,PUT,OPTIONS',
    }),
);
//Importacion de rutas
const rutas = [
    { path: '/', route: indexRutas },
    { path: '/', route: cargarAlumnosRutas },
];
rutas.forEach(({ path, route }) => {
    app.use(path, route);
});

app.listen(puerto, '0.0.0.0', () => {
    console.log(`Servidor corriendo en http://localhost:${puerto}`);
});
