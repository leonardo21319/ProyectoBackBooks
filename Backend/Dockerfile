
FROM node:18

# Establecer el directorio de trabajo en el contenedor
WORKDIR /usr/src/app

# Copiar los archivos package.json y package-lock.json
COPY package*.json ./

# Instalar dependencias de Node.js
RUN npm install

# Copiar todo el código fuente al contenedor
COPY . .

# Exponer el puerto 3000 (el puerto que usas en tu aplicación)
EXPOSE 3000

# Comando para ejecutar la aplicación
CMD ["npm", "run", "dev"]
