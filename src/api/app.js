const express = require('express');

const app = express();
app.use(express.json());

let purchases = [];

// Create - POST /purchases
app.post('/purchases', (req, res) => {
  const { productId, quantity } = req.body;
  // Assuming productId and quantity are provided in the request body
  const product = products.find((prod) => prod.id === productId);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  if (product.quantity < quantity) {
    return res.status(400).json({ error: 'Not enough quantity in stock' });
  }
  // Assuming customer and other details are handled elsewhere, just adding purchase for simplicity
  purchases.push({ productId, quantity });
  // Assuming the purchase is successful, reducing the quantity of the product
  product.quantity -= quantity;
  res.status(201).json({ message: 'Purchase created successfully' });
});

// Read - GET /products
app.get('/products', (req, res) => {
  res.json(products);
});

// Update - PUT /purchases/{id}
app.put('/purchases/:id', (req, res) => {
  const purchaseId = parseInt(req.params.id);
  const { productId, quantity } = req.body;
  const purchase = purchases.find((purchase) => purchase.id === purchaseId);
  if (!purchase) {
    return res.status(404).json({ error: 'Purchase not found' });
  }
  // Assuming productId and quantity are provided in the request body to update the purchase
  purchase.productId = productId;
  purchase.quantity = quantity;
  res.json({ message: 'Purchase updated successfully' });
});

// Delete - DELETE /purchases/{id}
app.delete('/purchases/:id', (req, res) => {
  const purchaseId = parseInt(req.params.id);
  const index = purchases.findIndex((purchase) => purchase.id === purchaseId);
  if (index === -1) {
    return res.status(404).json({ error: 'Purchase not found' });
  }
  purchases.splice(index, 1);
  res.json({ message: 'Purchase deleted successfully' });
});
