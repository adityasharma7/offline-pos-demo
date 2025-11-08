const express = require('express');
const cors = require('cors');
const { products, inventory } = require('./data');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/api/products', (req, res) => {
  res.json(products);
});

app.get('/api/inventory', (req, res) => {
  res.json(inventory);
});

app.post('/api/orders', (req, res) => {
  const { items } = req.body; // [{ id, quantity }]

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Invalid items payload' });
  }

  // Validate items exist and stock is sufficient
  const errors = [];
  for (const { id, quantity } of items) {
    const product = products.find(p => p.id === id);
    if (!product) {
      errors.push({ id, message: 'Product not found' });
      continue;
    }
    const available = inventory[id] ?? 0;
    if (quantity <= 0 || !Number.isFinite(quantity)) {
      errors.push({ id, message: 'Invalid quantity' });
      continue;
    }
    if (available < quantity) {
      errors.push({ id, message: `Insufficient stock: have ${available}, need ${quantity}` });
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({ error: 'Stock validation failed', details: errors });
  }

  // All good: decrement inventory and compute total
  let total = 0;
  const lineItems = items.map(({ id, quantity }) => {
    const product = products.find(p => p.id === id);
    inventory[id] -= quantity;
    const lineTotal = product.price * quantity;
    total += lineTotal;
    return { id, name: product.name, price: product.price, quantity, lineTotal };
  });

  const orderId = `ord_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

  res.status(201).json({
    orderId,
    items: lineItems,
    total
  });
});

app.listen(PORT, () => {
  console.log(`API server listening on http://localhost:${PORT}`);
});
