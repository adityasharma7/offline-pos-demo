import { useState } from 'react';
import { Button, Card, CardContent, Typography, Grid } from '@mui/material';
import products from './products';

function App() {
  const [cart, setCart] = useState([]);

  const addToCart = (product) => {
    setCart([...cart, product]);
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price, 0);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-md mx-auto">
        <Typography variant="h4" className="text-center mb-6 text-blue-600">
          Offline POS Demo
        </Typography>

        <Grid container spacing={2}>
          {products.map((product) => (
            <Grid item xs={12} sm={6} key={product.id}>
              <Card>
                <CardContent>
                  <Typography variant="h6">{product.name}</Typography>
                  <Typography variant="body2">Price: ${product.price.toFixed(2)}</Typography>
                  <Button variant="contained" onClick={() => addToCart(product)}>
                    Add to Cart
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Card className="mt-4">
          <CardContent>
            <Typography variant="h6">Cart</Typography>
            {cart.length === 0 ? (
              <Typography variant="body2">Your cart is empty.</Typography>
            ) : (
              <ul>
                {cart.map((item, index) => (
                  <li key={index}>{item.name} - ${item.price.toFixed(2)}</li>
                ))}
              </ul>
            )}
            <Typography variant="h6">Total: ${calculateTotal().toFixed(2)}</Typography>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default App;