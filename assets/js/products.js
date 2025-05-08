document.addEventListener("DOMContentLoaded", () => {
  const productsContainer = document.querySelector(".products-container");
  const searchInput = document.getElementById("search-input");
  const searchButton = document.getElementById("search-button");
  const productsPerPage = 12; // 3 rows * 4 products per row
  let currentPage = 1;
  let products = [];
  let filteredProducts = [];

  const updateCartCount = () => {
    const cartCountElement = document.getElementById("cart-count");
    const cartItems = JSON.parse(localStorage.getItem("cart")) || [];
    const totalCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    cartCountElement.textContent = totalCount;
    cartCountElement.style.display = totalCount > 0 ? "inline-block" : "none";
  };

  const searchProducts = () => {
    const searchTerm = searchInput.value.trim().toLowerCase();
    if (searchTerm === "") {
      filteredProducts = [...products];
    } else {
      filteredProducts = products.filter(product => 
        product.productName.toLowerCase().includes(searchTerm)
      );
    }
    currentPage = 1; // Reset to first page when searching
    renderProducts();
    renderPagination();
  };

  const renderProducts = () => {
    productsContainer.innerHTML = "";
    const start = (currentPage - 1) * productsPerPage;
    const end = start + productsPerPage;
    const paginatedProducts = filteredProducts.slice(start, end);
    
    if (paginatedProducts.length === 0) {
      const noResults = document.createElement("div");
      noResults.classList.add("no-results");
      noResults.textContent = "No products found matching your search.";
      productsContainer.appendChild(noResults);
      return;
    }

    const cartItems = JSON.parse(localStorage.getItem("cart")) || [];

    paginatedProducts.forEach((product) => {
      const productCard = document.createElement("div");
      productCard.classList.add("product-card");

      productCard.innerHTML = `
        <img src="${product.imageUrl}" alt="${product.productName}" />
        <h3>${product.productName}</h3>
        <p class="price">Price: $${product.price}</p>
        <p class="stock">Stock: ${product.stock}</p>
        <div class="cart-actions">
          <button class="add-to-cart-btn">Add to Cart</button>
        </div>
      `;

      const cartActions = productCard.querySelector(".cart-actions");
      const addToCartButton = cartActions.querySelector(".add-to-cart-btn");

      const updateCartActions = () => {
        const cartItems = JSON.parse(localStorage.getItem("cart")) || [];
        const cartItem = cartItems.find((item) => item.id === product.id);

        if (cartItem) {
          cartActions.innerHTML = `
            <button class="decrease-btn"><i class="fas ${
              cartItem.quantity > 1 ? "fa-minus" : "fa-trash"
            }"></i></button>
            <span class="quantity">${cartItem.quantity}</span>
            <button class="increase-btn"><i class="fas fa-plus"></i></button>
          `;

          const quantitySpan = cartActions.querySelector(".quantity");
          const decreaseButton = cartActions.querySelector(".decrease-btn");
          const increaseButton = cartActions.querySelector(".increase-btn");

          let quantity = cartItem.quantity;

          increaseButton.addEventListener("click", () => {
            quantity++;
            quantitySpan.textContent = quantity;

            cartItem.quantity = quantity;
            localStorage.setItem("cart", JSON.stringify(cartItems));
            updateCartCount();
            decreaseButton.innerHTML = `<i class="fas fa-minus"></i>`;
          });

          decreaseButton.addEventListener("click", () => {
            if (quantity > 1) {
              quantity--;
              quantitySpan.textContent = quantity;
              cartItem.quantity = quantity;
              localStorage.setItem("cart", JSON.stringify(cartItems));
              updateCartCount();
              if (quantity === 1) {
                decreaseButton.innerHTML = `<i class="fas fa-trash"></i>`;
              }
            } else {
              const index = cartItems.findIndex(
                (item) => item.id === product.id
              );
              if (index !== -1) cartItems.splice(index, 1);
              localStorage.setItem("cart", JSON.stringify(cartItems));
              updateCartCount();
              cartActions.innerHTML = `
                <button class="add-to-cart-btn">Add to Cart</button>
              `;
              cartActions
                .querySelector(".add-to-cart-btn")
                .addEventListener("click", () => {
                  addToCart();
                });
            }
          });
        } else {
          cartActions.innerHTML = `
            <button class="add-to-cart-btn">Add to Cart</button>
          `;
          cartActions
            .querySelector(".add-to-cart-btn")
            .addEventListener("click", () => {
              addToCart();
            });
        }
      };

      const addToCart = () => {
        const cartItems = JSON.parse(localStorage.getItem("cart")) || [];
        const existingItem = cartItems.find((item) => item.id === product.id);

        if (existingItem) {
          existingItem.quantity++;
        } else {
          cartItems.push({ id: product.id, quantity: 1 });
        }

        localStorage.setItem("cart", JSON.stringify(cartItems));
        updateCartCount();
        updateCartActions();
      };

      updateCartActions();
      productsContainer.appendChild(productCard);
    });
  };

  const renderPagination = () => {
    const paginationContainer = document.querySelector(".pagination");
    paginationContainer.innerHTML = "";
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

    // Previous Button
    const prevButton = document.createElement("button");
    prevButton.textContent = "Previous";
    prevButton.classList.add("page-btn");
    prevButton.disabled = currentPage === 1;
    prevButton.addEventListener("click", () => {
      if (currentPage > 1) {
        currentPage--;
        renderProducts();
        renderPagination();
      }
    });
    paginationContainer.appendChild(prevButton);

    // Page Buttons
    for (let i = 1; i <= totalPages; i++) {
      const pageButton = document.createElement("button");
      pageButton.textContent = i;
      pageButton.classList.add("page-btn");
      if (i === currentPage) pageButton.classList.add("active");

      pageButton.addEventListener("click", () => {
        currentPage = i;
        renderProducts();
        renderPagination();
      });

      paginationContainer.appendChild(pageButton);
    }

    // Next Button
    const nextButton = document.createElement("button");
    nextButton.textContent = "Next";
    nextButton.classList.add("page-btn");
    nextButton.disabled = currentPage === totalPages;
    nextButton.addEventListener("click", () => {
      if (currentPage < totalPages) {
        currentPage++;
        renderProducts();
        renderPagination();
      }
    });
    paginationContainer.appendChild(nextButton);
  };

  // Add event listeners for search
  searchButton.addEventListener("click", searchProducts);
  searchInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      searchProducts();
    }
  });

  fetch("db.json")
    .then((response) => response.json())
    .then((data) => {
      products = data.products.filter(
        (product) => product.status === "approved"
      );
      filteredProducts = [...products]; // Initialize filtered products with all products
      renderProducts();
      renderPagination();
    })
    .catch((error) => console.error("Error fetching products:", error));

  updateCartCount();
});
