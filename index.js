const express = require('express');
const app = express();
app.use(express.json());

/* ================= LOGIQUE MÉTIER ================= */

function getAlertThreshold(threshold, isPerishable) {
    return isPerishable ? threshold * 2 : threshold;
}

function getDeliveryDelay(isLocal) {
    return isLocal ? 2 : 15;
}

function getOrderQuantity(isLocal, period) {
    let quantity = isLocal ? 10 : 5;
    if (period === "Noel") quantity *= 1.3;
    return quantity;
}

function checkStock(data) {
    const { stock, threshold, isPerishable, isLocal, period } = data;

    const finalThreshold = getAlertThreshold(threshold, isPerishable);

    if (stock === 0) {
        return {
            status: "CRITIQUE",
            delay: getDeliveryDelay(isLocal),
            orderQuantity: 50
        };
    }

    if (stock <= finalThreshold) {
        return {
            status: "À COMMANDER",
            delay: getDeliveryDelay(isLocal),
            orderQuantity: getOrderQuantity(isLocal, period)
        };
    }

    return {
        status: "OK",
        delay: getDeliveryDelay(isLocal),
        orderQuantity: 0
    };
}

/* ================= ROUTE API ================= */

app.post('/api/stock-alert', (req, res) => {
    res.json(checkStock(req.body));
});

/* ================= EXPORT IMPORTANT ================= */

module.exports = app;
module.exports = { app, checkStock };