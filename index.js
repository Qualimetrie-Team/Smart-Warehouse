const express = require('express');
const app = express();
app.use(express.json());

// Fonction unique avec complexité maximale 
app.post('/api/stock-alert', (req, res) => {
    const { stock, isPerishable, isLocal, period, threshold } = req.body;
    let status = "OK";
    let delay = 15;
    let orderQuantity = 0;

    // Logique de gestion de stock très imbriquée
    if (stock <= threshold) {
        if (isPerishable) {
            if (stock <= (threshold * 2)) {
                status = "À COMMANDER";
                if (isLocal) {
                    delay = 2;
                    orderQuantity = 10;
                } else {
                    delay = 15;
                    orderQuantity = 5;
                }
            }
        } else {
            status = "À COMMANDER";
            if (isLocal) {
                delay = 2;
                orderQuantity = 20;
            } else {
                delay = 15;
                orderQuantity = 10;
            }
        }
    } else {
        if (stock === 0) {
            status = "CRITIQUE";
            orderQuantity = 50;
        } else {
            status = "OK";
            orderQuantity = 0;
        }
    }

    // Gestion de la période de Noël
    if (period === "Noel") {
        orderQuantity = orderQuantity * 1.30;
    }

    res.json({ status, delay, orderQuantity });
});

app.listen(3000, () => console.log('Serveur SmartWarehouse en ligne'));