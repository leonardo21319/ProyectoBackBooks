//Librerias
import express from "express";
import path from "path";
import cors from "cors";
import testConnection from "./src/config/test.js";
import indexRutas from "./src/modules/login/LoginRoutes.js";
import IntercambioRutas from "./src/modules/Intercambio/LibroRoutes.js";

const app = express();

//Configuraciones
const puerto = process.env.PORT || 3000;

//Middleware para archivos estáticos

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//Middleware para la autenticación
app.use(
  cors({
    origin: "*",
    allowedHeaders: "Content-Type,Authorization",
    methods: "GET,POST,DELETE,PUT,OPTIONS",
  })
);
//Importacion de rutas
const rutas = [
  { path: "/auth", route: indexRutas },
  { path: "/intercambio", route: IntercambioRutas },
];
rutas.forEach(({ path, route }) => {
  app.use(path, route);
});

app.listen(puerto, "0.0.0.0", () => {
  console.log(`Servidor corriendo en http://localhost:${puerto}`);
});

testConnection();
