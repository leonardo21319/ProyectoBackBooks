import stripe from './stripe.js';

export const crearSesionPago = async (req, res) => {
  const { precio, nombreProducto } = req.body;

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'mxn',
          product_data: {
            name: nombreProducto,
          },
          unit_amount: precio * 100, // en centavos
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: 'http://localhost:4200/success',
      cancel_url: 'http://localhost:4200/cancel',
    });

    res.json({ id: session.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
