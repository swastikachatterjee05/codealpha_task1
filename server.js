const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

let users = [];
let orders = [];
const products = [
  { 
    id: 1, 
    name: "Wireless Headphones", 
    price: 2999, 
    description: "High quality noise-canceling headphones.", 
    image: "/images/headphones.jpg" 
  },
  { 
    id: 2, 
    name: "Smart Watch", 
    price: 1499, 
    description: "Fitness tracker with heart rate monitor.", 
    image: "/images/smartwatch.jpg" 
  },
  { 
    id: 3, 
    name: "Gaming Mouse", 
    price: 1499, 
    description: "Ergonomic RGB gaming mouse.", 
    image: "/images/mouse.jpg" 
  },
  { 
    id: 4, 
    name: "Mechanical Keyboard", 
    price: 8999, 
    description: "Tactile mechanical switches with backlit keys.", 
    image: "/images/keyboard.jpg" 
  },
  { 
    id: 5, 
    name: "4K Gaming Monitor", 
    price: 11999, 
    description: "27-inch 144Hz UHD IPS display.", 
    image: "/images/monitor.jpg" 
  },
  { 
    id: 6, 
    name: "Bluetooth Speaker", 
    price: 6500, 
    description: "Portable waterproof speaker with deep bass.", 
    image: "/images/speaker.jpg" 
  },

  { 
    id: 7, 
    name: "1080p HD Webcam", 
    price: 3500, 
    description: "Full HD webcam with noise-reducing mic.", 
    image: "/images/webcam.jpg" 
  },
  
  { 
    id: 8, 
    name: "Fast Power Bank", 
    price: 2799, 
    description: "20,000mAh portable charger with quick charge.", 
    image: "/images/powerbank.jpg"
  }

];

app.post('/api/register', (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }
  
  const existingUser = users.find(u => u.email === email);
  if (existingUser) return res.status(400).json({ error: "User already exists" });

  const newUser = { id: users.length + 1, username, email, password };
  users.push(newUser);
  res.status(201).json({ message: "Registration successful! You can now login.", user: { username: newUser.username, email: newUser.email } });
});

app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email && u.password === password);
  
  if (!user) return res.status(401).json({ error: "Invalid email or password" });
  res.json({ message: "Login successful", user: { username: user.username, email: user.email } });
});

app.get('/api/products', (req, res) => {
  res.json(products);
});

app.get('/api/products/:id', (req, res) => {
  const product = products.find(p => p.id === parseInt(req.params.id));
  if (!product) return res.status(404).json({ error: "Product not found" });
  res.json(product);
});

app.post('/api/checkout', (req, res) => {
  const { items, totalAmount, userEmail } = req.body;
  if (!items || items.length === 0) return res.status(400).json({ error: "Cart is empty" });
  const newOrder = {
    id: orders.length + 1,
    userEmail: userEmail || "Guest",
    items,
    totalAmount,
    date: new Date().toISOString()
  };
  orders.push(newOrder);
  res.status(201).json({ message: "Order placed successfully!", orderId: newOrder.id });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:3000`);
});