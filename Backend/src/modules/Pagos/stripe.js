import Stripe from 'stripe';
import dotenv from 'dotenv';

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY); // asegúrate de tener STRIPE_SECRET_KEY en .env
export default stripe;
