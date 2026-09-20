const API_URL = 'http://localhost:3000';
let cart = [];
let currentUser = null;

// Initialize product loading on DOM Content Loaded
document.addEventListener('DOMContentLoaded', () => {
  fetchProducts();
});

// View Switcher & Navigation Handler
function showSection(sectionId) {
  const sections = ['products-section', 'cart-section', 'login-section', 'register-section', 'details-section'];
  sections.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      if (id === sectionId) {
        el.classList.remove('hidden');
      } else {
        el.classList.add('hidden');
      }
    }
  });
}

// Fetch Product Catalog from Express Backend
async function fetchProducts() {
  try {
    const res = await fetch(`${API_URL}/api/products`);
    const products = await res.json();
    const container = document.getElementById('product-list');
    if (!container) return;

    container.innerHTML = products.map(p => `
      <div class="card">
        <div>
          <img src="${p.image}" alt="${p.name}">
          <h3>${p.name}</h3>
          <p class="price">₹${p.price.toLocaleString('en-IN')}</p>
        </div>
        <div class="button-group">
          <button class="btn-secondary" onclick="viewProduct(${p.id})">Details</button>
          <button class="btn-primary" onclick="addToCart(${p.id}, '${p.name.replace(/'/g, "\\'")}', ${p.price}, '${p.image}')">Add to Cart</button>
        </div>
      </div>
    `).join('');
  } catch (err) {
    console.error("Error fetching products:", err);
  }
}

// Dedicated Product Details View
async function viewProduct(id) {
  try {
    const res = await fetch(`${API_URL}/api/products`);
    const products = await res.json();
    const product = products.find(p => p.id === id);

    if (!product) return;

    const container = document.getElementById('product-details-container');
    container.innerHTML = `
      <div class="product-details-card">
        <div class="details-image-container">
          <img src="${product.image}" alt="${product.name}">
        </div>
        <div class="details-info">
          <h2>${product.name}</h2>
          <p class="price">₹${product.price.toLocaleString('en-IN')}</p>
          <p class="description">${product.description}</p>
          <button class="btn-primary" onclick="addToCart(${product.id}, '${product.name.replace(/'/g, "\\'")}', ${product.price}, '${product.image}')">
            Add to Cart
          </button>
        </div>
      </div>
    `;

    showSection('details-section');
  } catch (err) {
    console.error("Error fetching product details:", err);
  }
}

// Shopping Cart Logic
function addToCart(id, name, price, image) {
  cart.push({ id, name, price, image });
  renderCart();
  alert(`${name} added to cart!`);
}

function renderCart() {
  const cartCountEl = document.getElementById('cart-count');
  const cartList = document.getElementById('cart-items');
  const cartTotalEl = document.getElementById('cart-total');

  if (cartCountEl) cartCountEl.innerText = cart.length;
  if (!cartList) return;

  if (cart.length === 0) {
    cartList.innerHTML = "<p>Your cart is empty.</p>";
    if (cartTotalEl) cartTotalEl.innerText = "0.00";
    return;
  }

  const total = cart.reduce((sum, item) => sum + item.price, 0);

  cartList.innerHTML = cart.map((item, index) => `
    <div class="cart-item">
      <img src="${item.image}" alt="${item.name}" class="cart-item-img">
      <div class="cart-item-details">
        <h4>${item.name}</h4>
        <p class="cart-item-price">₹${item.price.toLocaleString('en-IN')}</p>
      </div>
      <button class="remove-btn" onclick="removeFromCart(${index})">Remove</button>
    </div>
  `).join('');

  if (cartTotalEl) cartTotalEl.innerText = total.toLocaleString('en-IN');
}

function removeFromCart(index) {
  cart.splice(index, 1);
  renderCart();
}

// Authentication Logic
async function handleRegister() {
  const username = document.getElementById('reg-username').value.trim();
  const email = document.getElementById('reg-email').value.trim();
  const password = document.getElementById('reg-password').value.trim();
  const msgEl = document.getElementById('reg-msg');

  if (!username || !email || !password) {
    if (msgEl) {
      msgEl.innerText = "Please fill in all fields.";
      msgEl.style.color = "red";
    }
    return;
  }

  try {
    const res = await fetch(`${API_URL}/api/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password })
    });

    const data = await res.json();
    if (res.ok) {
      msgEl.innerText = "Registration successful! Redirecting to login...";
      msgEl.style.color = "green";
      document.getElementById('register-form').reset();
      setTimeout(() => {
        msgEl.innerText = "";
        showSection('login-section');
      }, 1200);
    } else {
      msgEl.innerText = data.error || "Registration failed.";
      msgEl.style.color = "red";
    }
  } catch (err) {
    console.error("Register Error:", err);
  }
}

async function handleLogin() {
  const email = document.getElementById('login-email').value.trim();
  const password = document.getElementById('login-password').value.trim();
  const msgEl = document.getElementById('login-msg');

  if (!email || !password) {
    if (msgEl) {
      msgEl.innerText = "Please enter both email and password.";
      msgEl.style.color = "red";
    }
    return;
  }

  try {
    const res = await fetch(`${API_URL}/api/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();
    if (res.ok) {
      currentUser = data.user;
      const firstInitial = currentUser.username ? currentUser.username.charAt(0).toUpperCase() : 'U';
      const authLinks = document.getElementById('auth-links');
      if (authLinks) {
        authLinks.innerHTML = `<div class="user-avatar" title="${currentUser.username}">${firstInitial}</div>`;
      }
      document.getElementById('login-form').reset();
      showSection('products-section');
    } else {
      msgEl.innerText = data.error || "Login failed.";
      msgEl.style.color = "red";
    }
  } catch (err) {
    console.error("Login Error:", err);
  }
}