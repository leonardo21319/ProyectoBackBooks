import multer from "multer";
import path from "path";
import fs from "fs";

const __dirname = path.resolve();

// Ruta absoluta al directorio de portadas
const storagePath = path.join(__dirname, "/uploads/portadas");

fs.mkdirSync(storagePath, { recursive: true });

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, storagePath);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, uniqueSuffix + path.extname(file.originalname));
    },
  }),
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );

    if (mimetype && extname) return cb(null, true);
    cb(new Error("El archivo debe ser una imagen válida (JPEG, PNG, GIF)"));
  },
});

export default upload;
