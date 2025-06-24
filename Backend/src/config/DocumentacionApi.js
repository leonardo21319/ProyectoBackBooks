import swaggerUi from "swagger-ui-express";
import swaggerJsDoc from "swagger-jsdoc";
import fs from "fs";
import { fileURLToPath } from "url";
import path from "path";

// Obtener el nombre y directorio del archivo actual
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const packageJson = JSON.parse(
  fs.readFileSync(path.join(__dirname, "../../package.json"), "utf-8")
);
const version = packageJson.version;
// Configuración de Swagger
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API de Intercambio de Libros",
      version: version, // Usando la versión extraída de package.json
      description:
        "API para gestionar el intercambio de libros entre usuarios.",
    },
    servers: [
      {
        url: "http://localhost:3000", // URL del servidor
      },
    ],
  },
  apis: [path.join(__dirname, "../../src/**/*.js")], // Ruta para buscar las anotaciones
};

// Generar la documentación de la API
const swaggerDocs = swaggerJsDoc(swaggerOptions);

// Middleware para servir la documentación Swagger
const DocumentacionApi = (app) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
};

export default DocumentacionApi;
