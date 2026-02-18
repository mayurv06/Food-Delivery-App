const STORAGE_KEYS = {
  USER: "fd_current_user",
  USERS: "fd_users",
  CART: "fd_cart",
  ORDERS: "fd_orders"
};

const DELIVERY_FEE = 2.99;

const foodItems = [
  {
    id: "f1",
    name: "Margherita Pizza",
    description: "Classic delight with fresh mozzarella and basil.",
    category: "Pizza",
    price: 9.99,
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1604382355076-af4b0eb60143?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "f2",
    name: "Farmhouse Pizza",
    description: "Loaded with veggies, cheese, and special sauce.",
    category: "Pizza",
    price: 11.49,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1593504049359-74330189a345?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "f3",
    name: "Cheese Burger",
    description: "Juicy grilled patty with cheddar and lettuce.",
    category: "Burgers",
    price: 8.5,
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "f4",
    name: "Crispy Chicken Burger",
    description: "Crunchy chicken fillet with spicy mayo.",
    category: "Burgers",
    price: 9.2,
    rating: 4.4,
    image: "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "f5",
    name: "Paneer Butter Masala",
    description: "Creamy Indian curry with paneer cubes.",
    category: "Indian",
    price: 10.75,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "f7",
    name: "Hakka Noodles",
    description: "Stir-fried noodles with fresh vegetables.",
    category: "Chinese",
    price: 8.99,
    rating: 4.3,
    image: "https://images.unsplash.com/photo-1617093727343-374698b1b08d?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "f10",
    name: "Strawberry Sundae",
    description: "Ice cream loaded with strawberry sauce.",
    category: "Desserts",
    price: 5.5,
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "f11",
    name: "Mojito",
    description: "Refreshing mint lime cooler.",
    category: "Drinks",
    price: 3.75,
    rating: 4.4,
    image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "f12",
    name: "Cold Coffee",
    description: "Smooth and creamy chilled coffee.",
    category: "Drinks",
    price: 4.25,
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=800&q=80"
  }
];

const getData = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

const setData = (key, value) => localStorage.setItem(key, JSON.stringify(value));

const showToast = (message, type = "default") => {
  const toast = document.getElementById("toast");
  if (!toast) return;
  toast.textContent = message;
  toast.style.background = type === "success" ? "#1faa59" : type === "error" ? "#d32f2f" : "#1f1f1f";
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2200);
};

const formatCurrency = (val) => `$${val.toFixed(2)}`;

const getCurrentUser = () => getData(STORAGE_KEYS.USER, null);

function initAuthActionBtn() {
  const btn = document.getElementById("authActionBtn");
  if (!btn) return;
  const user = getCurrentUser();
  if (user) {
    btn.textContent = "Logout";
    btn.href = "#";
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      localStorage.removeItem(STORAGE_KEYS.USER);
      showToast("Logged out successfully", "success");
      setTimeout(() => (window.location.href = "login.html"), 600);
    });
  }
}

function initNav() {
  const menuToggle = document.getElementById("menuToggle");
  const nav = document.getElementById("navMenu");
  if (!menuToggle || !nav) return;
  menuToggle.addEventListener("click", () => nav.classList.toggle("open"));

  document.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", () => {
      document.querySelectorAll(".nav-link").forEach((l) => l.classList.remove("active"));
      link.classList.add("active");
      nav.classList.remove("open");
    });
  });
}

function initMenu() {
  const grid = document.getElementById("foodGrid");
  const searchInput = document.getElementById("searchInput");
  const chipWrap = document.getElementById("categoryFilters");
  if (!grid || !searchInput || !chipWrap) return;

  let category = "All";
  let query = "";

  const render = () => {
    const filtered = foodItems.filter((item) => {
      const categoryMatch = category === "All" || item.category === category;
      const queryMatch = item.name.toLowerCase().includes(query) || item.description.toLowerCase().includes(query);
      return categoryMatch && queryMatch;
    });

    if (!filtered.length) {
      grid.innerHTML = '<p class="empty">No dishes found. Try a different keyword.</p>';
      return;
    }

    grid.innerHTML = filtered
      .map(
        (item) => `
        <article class="food-card card">
          <div class="food-image-wrap">
            <img src="${item.image}" alt="${item.name}" />
          </div>
          <div class="food-card-content">
            <div class="food-meta">
              <h3 class="food-name">${item.name}</h3>
              <span class="food-rating">Rating: ${item.rating}/5</span>
            </div>
            <p class="food-desc">${item.description}</p>
            <div class="food-footer">
              <span class="food-price">${formatCurrency(item.price)}</span>
              <button class="btn btn-primary" data-add="${item.id}">Add to Cart</button>
            </div>
          </div>
        </article>
      `
      )
      .join("");
  };

  searchInput.addEventListener("input", (e) => {
    query = e.target.value.toLowerCase().trim();
    render();
  });

  chipWrap.addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-category]");
    if (!btn) return;
    category = btn.dataset.category;
    chipWrap.querySelectorAll("button").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    render();
  });

  grid.addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-add]");
    if (!btn) return;
    addToCart(btn.dataset.add);
  });

  render();
}

function addToCart(itemId) {
  const item = foodItems.find((f) => f.id === itemId);
  if (!item) return;
  const cart = getData(STORAGE_KEYS.CART, []);
  const existing = cart.find((c) => c.id === itemId);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...item, quantity: 1 });
  }
  setData(STORAGE_KEYS.CART, cart);
  renderCart();
  showToast(`${item.name} added to cart`, "success");
}

function renderCart() {
  const cartWrap = document.getElementById("cartItems");
  const subtotalEl = document.getElementById("subtotalValue");
  const totalEl = document.getElementById("totalValue");
  const deliveryEl = document.getElementById("deliveryFeeValue");
  if (!cartWrap || !subtotalEl || !totalEl || !deliveryEl) return;

  const cart = getData(STORAGE_KEYS.CART, []);
  if (!cart.length) {
    cartWrap.innerHTML = '<p class="empty">Your cart is empty. Add delicious food from the menu.</p>';
  } else {
    cartWrap.innerHTML = cart
      .map(
        (item) => `
      <article class="cart-item card">
        <img src="${item.image}" alt="${item.name}" />
        <div>
          <h4>${item.name}</h4>
          <p>${formatCurrency(item.price)} each</p>
          <div class="quantity-controls">
            <button class="qty-btn" data-dec="${item.id}">-</button>
            <strong>${item.quantity}</strong>
            <button class="qty-btn" data-inc="${item.id}">+</button>
          </div>
        </div>
        <div>
          <p><strong>${formatCurrency(item.price * item.quantity)}</strong></p>
          <button class="remove-btn" data-remove="${item.id}">Remove</button>
        </div>
      </article>
    `
      )
      .join("");
  }

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const total = subtotal > 0 ? subtotal + DELIVERY_FEE : 0;

  subtotalEl.textContent = formatCurrency(subtotal);
  deliveryEl.textContent = subtotal > 0 ? formatCurrency(DELIVERY_FEE) : formatCurrency(0);
  totalEl.textContent = formatCurrency(total);

  cartWrap.onclick = (e) => {
    const dec = e.target.closest("[data-dec]");
    const inc = e.target.closest("[data-inc]");
    const remove = e.target.closest("[data-remove]");

    if (dec) updateQuantity(dec.dataset.dec, -1);
    if (inc) updateQuantity(inc.dataset.inc, 1);
    if (remove) removeFromCart(remove.dataset.remove);
  };

  renderCheckoutSummary();
}

function updateQuantity(itemId, diff) {
  const cart = getData(STORAGE_KEYS.CART, []);
  const item = cart.find((c) => c.id === itemId);
  if (!item) return;
  item.quantity += diff;
  const updated = cart.filter((c) => c.quantity > 0);
  setData(STORAGE_KEYS.CART, updated);
  renderCart();
}

function removeFromCart(itemId) {
  const cart = getData(STORAGE_KEYS.CART, []);
  const updated = cart.filter((item) => item.id !== itemId);
  setData(STORAGE_KEYS.CART, updated);
  renderCart();
  showToast("Item removed", "error");
}

function initCheckout() {
  const checkoutBtn = document.getElementById("checkoutBtn");
  const modal = document.getElementById("checkoutModal");
  const closeModalBtn = document.getElementById("closeModalBtn");
  const closeBackdrop = document.getElementById("closeModalBackdrop");
  const form = document.getElementById("checkoutForm");
  if (!checkoutBtn || !modal || !closeModalBtn || !closeBackdrop || !form) return;

  const closeModal = () => {
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
  };

  checkoutBtn.addEventListener("click", () => {
    const cart = getData(STORAGE_KEYS.CART, []);
    if (!cart.length) {
      showToast("Your cart is empty", "error");
      return;
    }
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
  });

  closeModalBtn.addEventListener("click", closeModal);
  closeBackdrop.addEventListener("click", closeModal);

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const cart = getData(STORAGE_KEYS.CART, []);
    if (!cart.length) {
      showToast("Your cart is empty", "error");
      closeModal();
      return;
    }

    const address = document.getElementById("addressInput").value.trim();
    const payment = form.querySelector("input[name='payment']:checked")?.value || "COD";

    if (address.length < 10) {
      showToast("Please enter a complete address", "error");
      return;
    }

    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const total = subtotal + DELIVERY_FEE;

    const orders = getData(STORAGE_KEYS.ORDERS, []);
    orders.unshift({
      id: `ORD-${Date.now()}`,
      items: cart,
      address,
      payment,
      total,
      createdAt: new Date().toLocaleString()
    });

    setData(STORAGE_KEYS.ORDERS, orders);
    setData(STORAGE_KEYS.CART, []);

    form.reset();
    closeModal();
    renderCart();
    renderOrders();
    showToast("Order placed successfully!", "success");
  });
}

function renderCheckoutSummary() {
  const summary = document.getElementById("checkoutSummary");
  if (!summary) return;
  const cart = getData(STORAGE_KEYS.CART, []);
  if (!cart.length) {
    summary.innerHTML = "<p>No items in cart.</p>";
    return;
  }
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const total = subtotal + DELIVERY_FEE;
  summary.innerHTML = `
    <p><strong>Items:</strong> ${cart.reduce((sum, i) => sum + i.quantity, 0)}</p>
    <p><strong>Subtotal:</strong> ${formatCurrency(subtotal)}</p>
    <p><strong>Delivery:</strong> ${formatCurrency(DELIVERY_FEE)}</p>
    <p><strong>Total:</strong> ${formatCurrency(total)}</p>
  `;
}

function renderOrders() {
  const ordersList = document.getElementById("ordersList");
  if (!ordersList) return;
  const orders = getData(STORAGE_KEYS.ORDERS, []);
  if (!orders.length) {
    ordersList.innerHTML = '<p class="empty">No orders yet. Place your first order now.</p>';
    return;
  }

  ordersList.innerHTML = orders
    .map(
      (order) => `
      <article class="order-item card">
        <div class="order-top">
          <h4>${order.id}</h4>
          <strong>${formatCurrency(order.total)}</strong>
        </div>
        <p class="order-meta">${order.createdAt} | ${order.payment}</p>
        <p class="order-meta">${order.items.length} item(s)</p>
      </article>
    `
    )
    .join("");
}

function renderProfile() {
  const profileCard = document.getElementById("profileCard");
  if (!profileCard) return;
  const user = getCurrentUser();

  if (!user) {
    profileCard.innerHTML = `
      <p class="empty">You are not logged in.</p>
      <a class="btn btn-primary" href="login.html" style="margin-top: 0.8rem;">Login Now</a>
    `;
    return;
  }

  profileCard.innerHTML = `
    <div class="profile-row"><span>Name</span><strong>${user.name || "Foodie User"}</strong></div>
    <div class="profile-row"><span>Email</span><strong>${user.email}</strong></div>
    <div class="profile-row"><span>Member Since</span><strong>${user.memberSince || "Today"}</strong></div>
    <div class="profile-row"><span>Status</span><strong style="color:#1faa59;">Active</strong></div>
  `;
}

function initSignupPage() {
  const form = document.getElementById("signupForm");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("signupName").value.trim();
    const email = document.getElementById("signupEmail").value.trim().toLowerCase();
    const password = document.getElementById("signupPassword").value;
    const confirm = document.getElementById("signupConfirmPassword").value;

    const errors = {
      signupNameError: name.length < 2 ? "Enter your full name" : "",
      signupEmailError: !/^\S+@\S+\.\S+$/.test(email) ? "Enter a valid email" : "",
      signupPasswordError: password.length < 6 ? "Minimum 6 characters required" : "",
      signupConfirmPasswordError: confirm !== password ? "Passwords do not match" : ""
    };

    Object.entries(errors).forEach(([id, text]) => {
      const el = document.getElementById(id);
      if (el) el.textContent = text;
    });

    if (Object.values(errors).some(Boolean)) return;

    const users = getData(STORAGE_KEYS.USERS, []);
    if (users.some((u) => u.email === email)) {
      showToast("Email already registered. Please login.", "error");
      return;
    }

    const newUser = {
      name,
      email,
      password,
      memberSince: new Date().toLocaleDateString()
    };

    users.push(newUser);
    setData(STORAGE_KEYS.USERS, users);
    setData(STORAGE_KEYS.USER, { name: newUser.name, email: newUser.email, memberSince: newUser.memberSince });

    showToast("Signup successful! Redirecting...", "success");
    setTimeout(() => (window.location.href = "index.html"), 900);
  });
}

function initLoginPage() {
  const form = document.getElementById("loginForm");
  if (!form) return;

  const forgotLink = document.getElementById("forgotPasswordLink");
  if (forgotLink) {
    forgotLink.addEventListener("click", (e) => {
      e.preventDefault();
      showToast("Please contact support@foodieexpress.com", "error");
    });
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const email = document.getElementById("loginEmail").value.trim().toLowerCase();
    const password = document.getElementById("loginPassword").value;

    const emailError = !/^\S+@\S+\.\S+$/.test(email) ? "Enter a valid email" : "";
    const passError = password.length < 6 ? "Password must be at least 6 characters" : "";

    document.getElementById("loginEmailError").textContent = emailError;
    document.getElementById("loginPasswordError").textContent = passError;

    if (emailError || passError) return;

    const users = getData(STORAGE_KEYS.USERS, []);
    const match = users.find((u) => u.email === email && u.password === password);
    if (!match) {
      showToast("Invalid credentials", "error");
      return;
    }

    setData(STORAGE_KEYS.USER, { name: match.name, email: match.email, memberSince: match.memberSince });
    showToast("Login successful", "success");
    setTimeout(() => (window.location.href = "index.html"), 700);
  });
}

function initAppPage() {
  initAuthActionBtn();
  initNav();
  initMenu();
  renderCart();
  initCheckout();
  renderOrders();
  renderProfile();
}

document.addEventListener("DOMContentLoaded", () => {
  initSignupPage();
  initLoginPage();
  initAppPage();
});
