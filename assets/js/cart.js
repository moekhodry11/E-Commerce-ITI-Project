document.addEventListener('DOMContentLoaded', () => {
  const cartItemsContainer = document.getElementById('cart-items');
  const subtotalElement = document.getElementById('subtotal-value');
  const checkoutBtn = document.getElementById('checkout-btn');
  const clearCartBtn = document.getElementById('clear-cart-btn');
  const emptyCartMessage = document.getElementById('empty-cart');
  const cartSummary = document.querySelector('.cart-summary');
  
  let cartItems = JSON.parse(localStorage.getItem('cart')) || [];
  let products = [];
  
  // Fetch products from db.json
  const fetchProducts = async () => {
    try {
      const response = await fetch('../db.json');
      const data = await response.json();
      return data.products;
    } catch (error) {
      console.error('Error fetching products:', error);
      return [];
    }
  };
  
  // Update cart count in nav
  const updateCartCount = () => {
    const cartCountElement = document.getElementById("cart-count");
    if (cartCountElement) {
      const totalCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
      cartCountElement.textContent = totalCount;
      cartCountElement.style.display = totalCount > 0 ? "inline-block" : "none";
    }
  };
  
  // Calculate subtotal
  const calculateSubtotal = () => {
    const subtotal = cartItems.reduce((total, item) => {
      const product = products.find(p => p.id === item.id);
      return total + (product ? product.price * item.quantity : 0);
    }, 0);
    
    subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
    return subtotal;
  };
  
  // Render cart items
  const renderCartItems = () => {
    if (cartItems.length === 0) {
      cartItemsContainer.style.display = 'none';
      cartSummary.style.display = 'none';
      emptyCartMessage.style.display = 'block';
      return;
    }
    
    emptyCartMessage.style.display = 'none';
    cartItemsContainer.style.display = 'block';
    cartSummary.style.display = 'block';
    
    cartItemsContainer.innerHTML = '';
    
    cartItems.forEach(item => {
      const product = products.find(p => p.id === item.id);
      if (product) {
        const cartItemElement = document.createElement('div');
        cartItemElement.classList.add('cart-item');
        
        cartItemElement.innerHTML = `
          <img src="${product.imageUrl}" alt="${product.productName}">
          <div class="item-details">
            <div class="item-name">${product.productName}</div>
            <div class="item-price">$${product.price.toFixed(2)}</div>
            <div class="item-quantity">
              <button class="quantity-btn decrease-btn" data-id="${product.id}">
                <i class="fas fa-minus"></i>
              </button>
              <span class="quantity-value">${item.quantity}</span>
              <button class="quantity-btn increase-btn" data-id="${product.id}">
                <i class="fas fa-plus"></i>
              </button>
            </div>
          </div>
          <button class="remove-btn" data-id="${product.id}">
            <i class="fas fa-trash"></i>
          </button>
          <div class="item-total">$${(product.price * item.quantity).toFixed(2)}</div>
        `;
        
        cartItemsContainer.appendChild(cartItemElement);
      }
    });
    
    // Add event listeners for quantity buttons and remove buttons
    document.querySelectorAll('.increase-btn').forEach(btn => {
      btn.addEventListener('click', () => increaseQuantity(btn.dataset.id));
    });
    
    document.querySelectorAll('.decrease-btn').forEach(btn => {
      btn.addEventListener('click', () => decreaseQuantity(btn.dataset.id));
    });
    
    document.querySelectorAll('.remove-btn').forEach(btn => {
      btn.addEventListener('click', () => removeItem(btn.dataset.id));
    });
    
    calculateSubtotal();
  };
  
  // Increase item quantity
  const increaseQuantity = (productId) => {
    const itemIndex = cartItems.findIndex(item => item.id === productId);
    if (itemIndex !== -1) {
      cartItems[itemIndex].quantity++;
      saveCart();
      renderCartItems();
    }
  };
  
  // Decrease item quantity
  const decreaseQuantity = (productId) => {
    const itemIndex = cartItems.findIndex(item => item.id === productId);
    if (itemIndex !== -1) {
      if (cartItems[itemIndex].quantity > 1) {
        cartItems[itemIndex].quantity--;
      } else {
        cartItems.splice(itemIndex, 1);
      }
      saveCart();
      renderCartItems();
    }
  };
  
  // Remove item from cart
  const removeItem = (productId) => {
    cartItems = cartItems.filter(item => item.id !== productId);
    saveCart();
    renderCartItems();
  };
  
  // Save cart to localStorage
  const saveCart = () => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
    updateCartCount();
  };
  
  // Clear cart
  const clearCart = () => {
    cartItems = [];
    saveCart();
    renderCartItems();
  };
  
  // Initialize cart
  const initCart = async () => {
    products = await fetchProducts();
    renderCartItems();
    updateCartCount();
  };
  
  // Event listeners
  clearCartBtn.addEventListener('click', clearCart);
  
  checkoutBtn.addEventListener('click', () => {
    if (cartItems.length === 0) {
      alert('Your cart is empty!');
      return;
    }
    
    // Store order in localStorage for later processing
    // In a real application, this would send the order to a server
    const order = {
      id: Date.now().toString(),
      items: cartItems,
      total: calculateSubtotal(),
      date: new Date().toISOString()
    };
    
    // Save order to localStorage
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    orders.push(order);
    localStorage.setItem('orders', JSON.stringify(orders));
    
    // Clear the cart
    clearCart();
    
    alert('Thank you for your order!');
  });
  
  // Initialize cart
  initCart();
});
