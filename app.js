const state = {
  cart: [],
  searchOpen: false
};

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

function openLayer(id) {
  const el = $(id);
  if (!el) return;
  el.classList.add("open");
  el.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeLayer(id) {
  const el = $(id);
  if (!el) return;
  el.classList.remove("open");
  el.setAttribute("aria-hidden", "true");
  if (!document.querySelector(".drawer-overlay.open,.modal-overlay.open,.search-panel.open")) {
    document.body.style.overflow = "";
  }
}

function showToast(message) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove("show"), 2200);
}

function addToCart(name) {
  const existing = state.cart.find(item => item.name === name);
  if (existing) existing.quantity += 1;
  else state.cart.push({ name, quantity: 1, price: 0 });

  renderCart();
  showToast(`${name.toUpperCase()} ADDED TO YOUR BAG`);
}

function renderCart() {
  const count = state.cart.reduce((sum, item) => sum + item.quantity, 0);
  $("#cartCount").textContent = count;

  const container = $("#cartItems");
  if (!state.cart.length) {
    container.innerHTML = '<p class="empty-cart">Your bag is currently empty.</p>';
    $("#cartSubtotal").textContent = "$0";
    return;
  }

  container.innerHTML = state.cart.map((item, index) => `
    <div class="cart-row">
      <div class="cart-thumb product-${item.name.toLowerCase().replaceAll(" ", "-").replace("bundles","straight")}"></div>
      <div>
        <h4>${item.name.toUpperCase()}</h4>
        <p>Quantity: ${item.quantity}</p>
      </div>
      <button class="remove-item" data-remove="${index}">REMOVE</button>
    </div>
  `).join("");

  const total = state.cart.reduce((sum, item) => sum + item.quantity * item.price, 0);
  $("#cartSubtotal").textContent = total ? `$${total.toFixed(0)}` : "$0";
}

function setupEvents() {
  $("[data-open-menu]").addEventListener("click", () => openLayer("#mobileMenu"));
  $("[data-close-menu]").addEventListener("click", () => closeLayer("#mobileMenu"));

  $("[data-open-cart]").addEventListener("click", () => openLayer("#cartDrawer"));
  $("[data-close-cart]").addEventListener("click", () => closeLayer("#cartDrawer"));

  $("[data-open-search]").addEventListener("click", () => {
    openLayer("#searchPanel");
    setTimeout(() => $("#searchInput").focus(), 50);
  });
  $("[data-close-search]").addEventListener("click", () => closeLayer("#searchPanel"));

  $("[data-open-account]").addEventListener("click", () => openLayer("#accountModal"));
  $$("[data-close-account]").forEach(btn => btn.addEventListener("click", () => closeLayer("#accountModal")));

  // Close mobile menu after navigation.
  $$(".mobile-nav a").forEach(link => link.addEventListener("click", () => closeLayer("#mobileMenu")));

  // Product quick-add.
  $$("[data-add-product]").forEach(button => {
    button.addEventListener("click", () => {
      addToCart(button.dataset.addProduct);
      openLayer("#cartDrawer");
    });
  });

  // Remove from cart.
  $("#cartItems").addEventListener("click", (event) => {
    const button = event.target.closest("[data-remove]");
    if (!button) return;
    state.cart.splice(Number(button.dataset.remove), 1);
    renderCart();
  });

  // Search — no browser alerts/popups.
  $("#searchSubmit").addEventListener("click", runSearch);
  $("#searchInput").addEventListener("keydown", (event) => {
    if (event.key === "Enter") runSearch();
    if (event.key === "Escape") closeLayer("#searchPanel");
  });

  function runSearch() {
    const query = $("#searchInput").value.trim().toLowerCase();
    const message = $("#searchMessage");
    if (!query) {
      message.textContent = "Type something to search the collection.";
      return;
    }

    const matches = $$(".product-card").filter(card =>
      card.dataset.name.includes(query)
    );

    message.textContent = matches.length
      ? `${matches.length} product${matches.length > 1 ? "s" : ""} found.`
      : "No matching products found.";

    matches[0]?.scrollIntoView({ behavior: "smooth", block: "center" });
    if (matches.length) closeLayer("#searchPanel");
  }

  // Newsletter — replaces alerts with an inline success message.
  $("#newsletterForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const email = $("#newsletterEmail").value.trim();
    const message = $("#newsletterMessage");

    if (!email) return;

    message.textContent = "THANK YOU — YOU'RE ON THE LIST.";
    event.target.reset();
  });

  $("#checkoutButton").addEventListener("click", () => {
    const message = $("#checkoutMessage");
    if (!state.cart.length) {
      message.textContent = "Add an item to your bag before checkout.";
      return;
    }
    message.textContent = "Checkout is ready to connect to your payment system.";
  });

  // Escape closes every overlay.
  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    ["#mobileMenu", "#cartDrawer", "#searchPanel", "#accountModal"].forEach(closeLayer);
  });

  // Clicking the overlay itself closes it.
  $$(".drawer-overlay").forEach(overlay => {
    overlay.addEventListener("click", (event) => {
      if (event.target === overlay) overlay.classList.remove("open");
      if (!document.querySelector(".drawer-overlay.open,.modal-overlay.open,.search-panel.open")) {
        document.body.style.overflow = "";
      }
    });
  });

  $("#searchPanel").addEventListener("click", (event) => {
    if (event.target.id === "searchPanel") closeLayer("#searchPanel");
  });

  // Keep header compact after scrolling.
  const header = $("#siteHeader");
  window.addEventListener("scroll", () => {
    header.classList.toggle("scrolled", window.scrollY > 15);
  }, { passive: true });
}

renderCart();
setupEvents();
