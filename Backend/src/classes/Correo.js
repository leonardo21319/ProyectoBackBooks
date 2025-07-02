import sgMail from "@sendgrid/mail";
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

class Correo {
  constructor() {}
  static async mandarCorreo({ to, subject, html }) {
    const msg = {
      to,
      from: process.env.FROM_EMAIL,
      subject,
      html,
    };

    try {
      await sgMail.send(msg);
      console.log(`Correo enviado a ${to}`);
      return { success: true };
    } catch (error) {
      console.error(
        "Error al enviar el correo:",
        error.response?.body || error.message
      );
      return { success: false, error };
    }
  }

  static async correoBienvenida(usuario) {
    console.log(usuario);
    return await Correo.mandarCorreo({
      to: usuario.correoInstitucional,
      subject: "¡Bienvenido a la plataforma!",
      html: `<h1>Hola ${usuario.nombre},</h1><p>Gracias por registrarte.</p>`,
    });
  }

  static async correoRecuperacion(email, token) {
    const enlace = `https://tusitio.com/recuperar?token=${token}`;
    return await Correo.mandarCorreo({
      to: email,
      subject: "Recupera tu contraseña",
      html: `<p>Haz clic <a href="${enlace}">aquí</a> para restablecer tu contraseña.</p>`,
    });
  }
}

export default Correo;
