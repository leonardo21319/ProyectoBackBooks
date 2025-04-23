import express from 'express';
import { 
    RegistroControlador
    
 } from './LoginController.js';

const router = express.Router();

router.post('/registro',RegistroControlador);

export default router;