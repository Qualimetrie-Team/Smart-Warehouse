const request = require('supertest');
const express = require('express');

const app = express();
app.use(express.json());

app.post('/api/stock-alert', (req, res) => {
  const { stock, isPerishable, isLocal, period, threshold } = req.body;

  let status = "OK";
  let delay = 15;
  let orderQuantity = 0;

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
    }
  }

  if (period === "Noel") {
    orderQuantity = orderQuantity * 1.30;
  }

  res.json({ status, delay, orderQuantity });
});

describe("Stock Alert API", () => {

  test("stock = 0 => CRITIQUE", async () => {
    const res = await request(app)
      .post('/api/stock-alert')
      .send({ stock: 0, threshold: 10 });

    expect(res.body.status).toBe("CRITIQUE");
  });

  test("stock faible => À COMMANDER", async () => {
    const res = await request(app)
      .post('/api/stock-alert')
      .send({ stock: 5, threshold: 10, isLocal: true });

    expect(res.body.status).toBe("À COMMANDER");
  });

  test("Noel augmente quantité", async () => {
    const res = await request(app)
      .post('/api/stock-alert')
      .send({ stock: 5, threshold: 10, period: "Noel", isLocal: true });

    expect(res.body.orderQuantity).toBeGreaterThan(0);
  });

});