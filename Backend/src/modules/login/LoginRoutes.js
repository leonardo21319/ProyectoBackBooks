import express from 'express';
import { 
    LoginControlador,
    RegistroControlador
    
 } from './LoginController.js';

const router = express.Router();

router.post('/registro',RegistroControlador);
router.post('/login', LoginControlador);
export default router;