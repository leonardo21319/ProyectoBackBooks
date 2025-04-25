import express from 'express';
import{RegistrarLibrosControlador} from '../Intercambio/LibroController.js'

const router= express.Router();

router.post('/cargarlibros', RegistrarLibrosControlador);
export default router;