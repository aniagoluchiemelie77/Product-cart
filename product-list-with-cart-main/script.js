'use strict';
const products = [
    {
      id: 1,
      name: "Waffle with Berries",
      description: "Waffle",
      price: 6.5,
      image: "assets/images/image-waffle-tablet.jpg",
      thumbnail: "assets/images/image-waffle-thumbnail.jpg"
    },
    {
      id: 2,
      name: "Vanilla Bean Crème Brûlée",
      description: "Crème Brûlée",
      price: 7.0,
      image: "assets/images/image-creme-brulee-desktop.jpg",
      thumbnail: "assets/images/image-creme-brulee-thumbnail.jpg"
    },{
      id: 3,
      name: "Macaron Mix of Five",
      description: "Macaron",
      price: 8.0,
      image: "assets/images/image-macaron-desktop.jpg",
      thumbnail: "assets/images/image-macaron-thumbnail.jpg"
    },{
      id: 4,
      name: "Classic Tiramisu",
      description: "Tiramisu",
      price: 5.5,
      image: "assets/images/image-tiramisu-desktop.jpg",
      thumbnail: "assets/images/image-tiramisu-thumbnail.jpg"
    },{
      id: 5,
      name: "Pistachio Baklava",
      description: "Baklava",
      price: 4.0,
      image: "assets/images/image-baklava-desktop.jpg",
      thumbnail: "assets/images/image-baklava-thumbnail.jpg"
    },{
      id: 6,
      name: "Lemon Meringue Pie",
      description: "Pie",
      price: 5.0,
      image: "assets/images/image-meringue-desktop.jpg",
      thumbnail: "assets/images/image-meringue-thumbnail.jpg"
    },{
      id: 7,
      name: "Red Velvet Cake",
      description: "Cake",
      price: 4.5,
      image: "assets/images/image-cake-desktop.jpg",
      thumbnail: "assets/images/image-cake-thumbnail.jpg"
    },{
      id: 8,
      name: "Salted Caramel Brownie",
      description: "Brownie",
      price: 4.5,
      image: "assets/images/image-brownie-desktop.jpg",
      thumbnail: "assets/images/image-brownie-thumbnail.jpg"
    },{
      id: 9,
      name: "Vanilla Panna Cotta",
      description: "Panna Cotta",
      price: 6.5,
      image: "assets/images/image-panna-cotta-desktop.jpg",
      thumbnail: "assets/images/image-panna-cotta-thumbnail.jpg"
    }
  ];
  let cart = [];
  function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existing = cart.find(item => item.id === productId);

    if (existing) {
      existing.quantity++;
    } else {
      cart.push({ ...product, quantity: 1 });
    }

    toggleCartControls(productId, true);
    updateCartUI();
  }

  function updateQuantity(productId, change) {
    const item = cart.find(i => i.id === productId);
    if (!item) return;

    item.quantity += change;
    if (item.quantity <= 0) {
      cart = cart.filter(i => i.id !== productId);
      toggleCartControls(productId, false);
    } else {
      updateCartQuantityDisplay(productId, item.quantity);
    }

    updateCartUI();
  }

  function updateCartQuantityDisplay(productId, quantity) {
    const section = [...document.querySelectorAll(".body-left_container_div")].find(div => {
      const name = div.querySelector(".not_cart_p h2")?.textContent.trim();
      const product = products.find(p => p.id === productId);
      return product && product.name === name;
    });
    if (section) {
      section.querySelector(".otherp span").textContent = quantity;
    }
  }

  function toggleCartControls(productId, inCart) {
    const section = [...document.querySelectorAll(".body-left_container_div")].find(div => {
      const name = div.querySelector(".not_cart_p h2")?.textContent.trim();
      const product = products.find(p => p.id === productId);
      return product && product.name === name;
    });
    if (section) {
      const button = section.querySelector("button");
      const otherp = section.querySelector(".otherp");
      if (inCart) {
        button.style.display = "none";
        otherp.style.display = "inline-flex";
        otherp.querySelector("span").textContent = 1;
      } else {
        button.style.display = "inline-flex";
        otherp.style.display = "none";
      }
    }
  }

  function calculateTotal() {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }

 function updateCartUI() {
  const empty = document.querySelector(".body-right_imgdiv");
  const filled = document.querySelector(".body-right_active");
  const countEl = document.querySelector(".body-right_header span");

  // Clear cart UI and reset counters
  filled.innerHTML = "";
  let total = 0;

  if (cart.length === 0) {
    empty.style.display = "flex";
    filled.style.display = "none";
    countEl.textContent = "0";
    return;
  }

  empty.style.display = "none";
  filled.style.display = "flex";
  countEl.textContent = cart.length;

  // Add each cart item block
  cart.forEach(item => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;
    filled.innerHTML += `
      <div class="body-right_active_subdiv">
        <div>
          <h4 class="body-right_order_header">${item.name}</h4>
          <p class="body-right_p">
            <span class="body-right_p_s1">${item.quantity}x</span>
            <span class="body-right_p_s2">@$${item.price.toFixed(2)}</span>
            <span class="body-right_p_s3">$${itemTotal.toFixed(2)}</span>
          </p>
        </div>
        <div class="body-right_closebtn">
          <img src="assets/images/icon-remove-item.svg" onclick="updateQuantity(${item.id}, -1)" />
        </div>
      </div>
    `;
  });

  // Add order total section
  filled.innerHTML += `
    <div class="body-right_active_confirmdiv">
      <p class="body-right_p">Order Total</p>
      <h1>$${total.toFixed(2)}</h1>
    </div>
    <div class="body-right_active_subdiv2">
      <img src="assets/images/icon-carbon-neutral.svg" />
      <p class="body-right_p">This is a <span>carbon-neutral</span> delivery</p>
    </div>
    <div class="btn-div confirm-btn-div">
      <button id="confirmOrderBtn">Confirm Order</button>
    </div>
  `;

  // Re-attach Confirm Order button listener
  document.getElementById("confirmOrderBtn")?.addEventListener("click", showPopup);
}


  function showPopup() {
    const popup = document.querySelector(".popup");
    const popupBody = document.querySelector(".popup_body");
    const summary = document.querySelector(".order-summary");

    popupBody.innerHTML = "";
    popupBody.appendChild(summary);

    cart.forEach(item => {
      popupBody.insertBefore(createPopupItem(item), summary);
    });

    summary.querySelector("h1").textContent = `$${calculateTotal().toFixed(2)}`;
    popup.style.display = "flex";
  }

  function createPopupItem(item) {
    const div = document.createElement("div");
    div.className = "popup_body_subdiv";
    div.innerHTML = `
      <div class="firstsubdiv">
        <img src="${item.thumbnail}" alt="${item.description}" />
        <div class="firstsubdiv_div">
          <h4>${item.name}</h4>
          <p><span class="span1">${item.quantity}x</span><span class="span2">@$${item.price.toFixed(2)}</span></p>
        </div>
      </div>
      <p class="firstsubdiv_p">$${(item.price * item.quantity).toFixed(2)}</p>
    `;
    return div;
  }

  function resetOrder() {
    cart.forEach(item => toggleCartControls(item.id, false));
    cart = [];
    updateCartUI();
    document.querySelector(".popup").style.display = "none";
  }

  function setupQuantityButtons() {
    document.querySelectorAll(".cart_p").forEach(p => {
      const plus = p.querySelector(".fa-plus");
      const minus = p.querySelector(".fa-minus");

      plus?.addEventListener("click", () => {
        const name = p.closest(".body-left_container_div").querySelector(".not_cart_p h2").textContent.trim();
        const product = products.find(p => p.name === name);
        if (product) updateQuantity(product.id, 1);
      });

      minus?.addEventListener("click", () => {
        const name = p.closest(".body-left_container_div").querySelector(".not_cart_p h2").textContent.trim();
        const product = products.find(p => p.name === name);
        if (product) updateQuantity(product.id, -1);
      });
    });
  }

  window.onload = () => {
    document.querySelectorAll(".fa-cart-plus").forEach((icon, index) => {
      icon.parentElement.addEventListener("click", () => {
        const product = products[index];
        if (product) addToCart(product.id);
      });
    });

    document.getElementById("confirmOrderBtn")?.addEventListener("click", showPopup);
    document.querySelector(".popup .btn-div button")?.addEventListener("click", resetOrder);

    setupQuantityButtons();
    updateCartUI();
  };