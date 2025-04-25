import express from 'express';
import { 
    LoginControlador,
    RegistroControlador,
    LogoutControlador    
 } from './LoginController.js';

import VerificarUsuario from '../../middlewares/Auth.js';
const router = express.Router();

router.post('/registro',RegistroControlador);
router.post('/login', LoginControlador);
router.post('/cerrarSesion', VerificarUsuario, LogoutControlador);
export default router;

