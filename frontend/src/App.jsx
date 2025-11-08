import { useState } from 'react';
import { Button, Card, CardContent, Typography, Grid, TextField, IconButton, Divider, Box, Stack } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import products from './products';

function App() {
  const [cart, setCart] = useState([]);
  const [query, setQuery] = useState('');
  const [quantities, setQuantities] = useState({});

  const setProductQty = (productId, qty) => {
    const value = Math.max(1, Number(qty) || 1);
    setQuantities((prev) => ({ ...prev, [productId]: value }));
  };

  const addToCart = (product) => {
    const qty = quantities[product.id] || 1;
    setCart((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.id === product.id ? { ...i, quantity: i.quantity + qty } : i
        );
      }
      return [...prev, { id: product.id, name: product.name, price: product.price, quantity: qty }];
    });
  };

  const removeFromCart = (productId) => {
    setCart((prev) => prev.filter((i) => i.id !== productId));
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const filteredProducts = products.filter((p) => {
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      (p.category && p.category.toLowerCase().includes(q)) ||
      (p.sku && p.sku.toLowerCase().includes(q))
    );
  });

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto">
        <Typography variant="h4" className="text-center mb-6 text-blue-600">
          Offline POS Demo
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Search products (name, category, SKU)"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                </Stack>
                <Grid container spacing={2}>
                  {filteredProducts.map((product) => (
                    <Grid item xs={12} sm={6} key={product.id}>
                      <Card variant="outlined">
                        <CardContent>
                          <Typography variant="h6">{product.name}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            {product.category} • {product.sku}
                          </Typography>
                          <Typography variant="body1" sx={{ my: 1 }}>
                            ${product.price.toFixed(2)}
                          </Typography>
                          <Stack direction="row" spacing={1} alignItems="center">
                            <TextField
                              type="number"
                              size="small"
                              label="Qty"
                              inputProps={{ min: 1 }}
                              value={quantities[product.id] || 1}
                              onChange={(e) => setProductQty(product.id, e.target.value)}
                              sx={{ width: 100 }}
                            />
                            <Button variant="contained" onClick={() => addToCart(product)}>
                              Add
                            </Button>
                          </Stack>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6">Cart</Typography>
                <Divider sx={{ my: 1 }} />
                {cart.length === 0 ? (
                  <Typography variant="body2">Your cart is empty.</Typography>
                ) : (
                  <Stack spacing={1}>
                    {cart.map((item) => (
                      <Box key={item.id} display="flex" alignItems="center" justifyContent="space-between">
                        <Box>
                          <Typography variant="body1">{item.name}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {item.quantity} × ${item.price.toFixed(2)} = ${(item.price * item.quantity).toFixed(2)}
                          </Typography>
                        </Box>
                        <IconButton aria-label="remove" onClick={() => removeFromCart(item.id)}>
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    ))}
                  </Stack>
                )}
                <Divider sx={{ my: 1 }} />
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Typography variant="h6">Total</Typography>
                  <Typography variant="h6">${calculateTotal().toFixed(2)}</Typography>
                </Box>
                <Button fullWidth variant="contained" sx={{ mt: 2 }} disabled={cart.length === 0}>
                  Place Order
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

      </div>
    </div>
  );
}

export default App;