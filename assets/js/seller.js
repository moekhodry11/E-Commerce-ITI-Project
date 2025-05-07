// Apply saved theme on page load
const savedTheme = localStorage.getItem("theme");
if (savedTheme) {
  document.documentElement.setAttribute("data-theme", savedTheme);
  const themeSwitch = document.querySelector(".theme-switch input");
  const toggleText = document.querySelector(".toggle-text");
  const toggleIcon = document.getElementById("toggle-icon");

  if (savedTheme === "dark") {
    themeSwitch.checked = true;
    document.body.classList.add("dark-mode");
    toggleText.textContent = "Dark Mode";
    toggleIcon.children[1].classList.replace("fa-sun", "fa-moon");
  } else {
    themeSwitch.checked = false;
    document.body.classList.remove("dark-mode");
    toggleText.textContent = "Light Mode";
    toggleIcon.children[1].classList.replace("fa-moon", "fa-sun");
  }
}

/* get added product form */
const addProductForm = document.querySelector(".product-form");
if (addProductForm) {
  addProductForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const productName = document.getElementById("product-name").value.trim();
    const productPrice = parseFloat(
      document.getElementById("product-price").value.trim()
    );
    const productStock = parseInt(
      document.getElementById("product-stock").value.trim()
    );
    const productDescription = document
      .getElementById("product-description")
      .value.trim();
    const productImageUrl = document
      .getElementById("product-image-url")
      .value.trim();

    // Create product object
    const newProduct = {
      productName,
      price: productPrice,
      stock: productStock,
      description: productDescription,
      imageUrl: productImageUrl,
      status: "pending", // Default status
      id: Date.now().toString(), // Generate a unique ID
    };

    try {
      // Send product data to db.json (simulated with fetch)
      const response = await fetch("http://localhost:3000/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newProduct),
      });

      if (response.ok) {
        alert("Product added successfully!");
        addProductForm.reset(); // Clear the form
      } else {
        alert("Failed to add product. Please try again.");
      }
    } catch (error) {
      console.error("Error adding product:", error);
      alert("An error occurred. Please try again.");
    }
  });
}
