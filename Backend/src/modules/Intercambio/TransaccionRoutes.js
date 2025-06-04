import express from 'express';
import{RegistrarTransaccionControlador} from '../Intercambio/TransaccionController.js'

const router= express.Router();

router.post('/registrartransaccion', RegistrarTransaccionControlador);
export default router;