document.addEventListener("DOMContentLoaded", () => {
  const productsContainer = document.querySelector(".products-container");
  const productsPerPage = 12; // 3 rows * 4 products per row
  let currentPage = 1;
  let products = [];

  const renderProducts = () => {
    productsContainer.innerHTML = "";
    const start = (currentPage - 1) * productsPerPage;
    const end = start + productsPerPage;
    const paginatedProducts = products.slice(start, end);

    paginatedProducts.forEach((product) => {
      const productCard = document.createElement("div");
      productCard.classList.add("product-card");

      productCard.innerHTML = `
        <img src="${product.imageUrl}" alt="${product.productName}" />
        <h3>${product.productName}</h3>
        <p class="price">Price: $${product.price}</p>
        <p class="stock">Stock: ${product.stock}</p>
      `;

      // Ensure consistent styles for dynamically created cards
      productCard.style.background = "var(--background-alt)";
      productCard.style.border = "1px solid var(--secondary-color)";
      productCard.style.borderRadius = "10px";
      productCard.style.boxShadow = "var(--box-shadow)";
      productCard.style.padding = "20px";
      productCard.style.textAlign = "center";
      productCard.style.width = "100%";
      productCard.style.maxWidth = "300px";

      productsContainer.appendChild(productCard);
    });
  };

  const renderPagination = () => {
    const paginationContainer = document.querySelector(".pagination");
    paginationContainer.innerHTML = "";
    const totalPages = Math.ceil(products.length / productsPerPage);

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

  fetch("db.json")
    .then((response) => response.json())
    .then((data) => {
      products = data.products.filter(
        (product) => product.status === "approved"
      );
      renderProducts();
      renderPagination();
    })
    .catch((error) => console.error("Error fetching products:", error));
});
