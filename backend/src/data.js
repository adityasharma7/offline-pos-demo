// Simple in-memory data store
const categories = ['Beverages', 'Bakery', 'Snacks', 'Dairy', 'Produce', 'Household', 'Personal Care'];
const totalProducts = 1500;
const products = Array.from({ length: totalProducts }, (_, idx) => {
  const id = idx + 1;
  const category = categories[id % categories.length];
  const code = category.slice(0, 3).toUpperCase();
  const price = Number((1 + (id % 200) * 0.1).toFixed(2));
  return {
    id,
    name: `${category} Item ${id}`,
    price,
    category,
    sku: `${code}-${String(id).padStart(4, '0')}`
  };
});

// Initial inventory quantities per product id
const inventory = Object.fromEntries(
  products.map((p) => [p.id, 10 + (p.id % 90)])
);

module.exports = {
  products,
  inventory
};
