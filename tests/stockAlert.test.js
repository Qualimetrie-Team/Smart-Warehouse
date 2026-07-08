const request = require('supertest');
const { app } = require('../index');

app.post('/api/stock-alert', (req, res) => {
  const { checkStock } = require('../index');
  const result = checkStock(req.body);
  res.json(result);
});

describe("Stock Alert API", () => {

  test("stock = 0 => CRITIQUE", async () => {
    const res = await request(app)
      .post('/api/stock-alert')
      .send({ stock: 0, threshold: 10, isLocal: true });

    expect(res.body.status).toBe("CRITIQUE");
    expect(res.body.orderQuantity).toBe(50);
  });

  test("stock faible => À COMMANDER (local)", async () => {
    const res = await request(app)
      .post('/api/stock-alert')
      .send({
        stock: 5,
        threshold: 10,
        isLocal: true,
        period: "Normal",
        isPerishable: false
      });

    expect(res.body.status).toBe("À COMMANDER");
    expect(res.body.delay).toBe(2);
    expect(res.body.orderQuantity).toBe(10);
  });

  test("stock faible => À COMMANDER (non local)", async () => {
    const res = await request(app)
      .post('/api/stock-alert')
      .send({
        stock: 5,
        threshold: 10,
        isLocal: false,
        period: "Normal",
        isPerishable: false
      });

    expect(res.body.status).toBe("À COMMANDER");
    expect(res.body.delay).toBe(15);
    expect(res.body.orderQuantity).toBe(5);
  });

  test("Noel augmente la quantité de 30%", async () => {
    const res = await request(app)
      .post('/api/stock-alert')
      .send({
        stock: 5,
        threshold: 10,
        isLocal: true,
        period: "Noel",
        isPerishable: false
      });

    expect(res.body.orderQuantity).toBeGreaterThan(10);
  });
  test("stock suffisant => OK", async () => {
    const res = await request(app)
      .post('/api/stock-alert')
      .send({
        stock: 50,
        threshold: 10,
        isLocal: true,
        period: "Normal",
        isPerishable: false
      });

    expect(res.body.status).toBe("OK");
    expect(res.body.delay).toBe(2);
    expect(res.body.orderQuantity).toBe(0);
  });

  test("produit périssable => seuil doublé", async () => {
    const res = await request(app)
      .post('/api/stock-alert')
      .send({
        stock: 15,
        threshold: 10,
        isPerishable: true,
        isLocal: true
      });

    expect(res.body.status).toBe("À COMMANDER");
  });
});