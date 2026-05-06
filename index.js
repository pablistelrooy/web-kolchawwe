const express = require('express');
const cors = require('cors');
const { MercadoPagoConfig, Preference } = require('mercadopago');

const app = express();
app.use(cors()); // Permite que tu HTML se comunique con este servidor
app.use(express.json());

// Configura Mercado Pago con tu Access Token
// Usamos process.env para no exponer tu llave secreta en GitHub
const client = new MercadoPagoConfig({ 
    accessToken: process.env.MP_ACCESS_TOKEN 
});

app.post("/create_preference", async (req, res) => {
    try {
        const preference = new Preference(client);
        const result = await preference.create({
            body: {
                items: [
                    {
                        title: req.body.title || "Producto Genérico",
                        quantity: Number(req.body.quantity) || 1,
                        unit_price: Number(req.body.price) || 1000,
                        currency_id: "CLP"
                    }
                ],
                back_urls: {
                    success: "https://tupagina.com/exito", // Cambia esto por tu URL real
                    failure: "https://tupagina.com/error",
                    pending: "https://tupagina.com/pendiente"
                },
                auto_return: "approved",
            }
        });

        res.json({ id: result.id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al crear la preferencia" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});