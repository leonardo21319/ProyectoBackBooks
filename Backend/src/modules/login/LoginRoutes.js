import express from 'express';
import { 
    LoginControlador,
    RegistroControlador,
    LogoutControlador    
 } from './LoginController.js';

const router = express.Router();

router.post('/registro',RegistroControlador);
router.post('/login', LoginControlador);
router.post('/cerrarSesion');
export default router;