-- Create orders table for product purchases
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY,
  product_name VARCHAR(255) NOT NULL,
  customer_name VARCHAR(255) NOT NULL,
  phone_number VARCHAR(100) NOT NULL,
  region VARCHAR(255) NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  address TEXT NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

