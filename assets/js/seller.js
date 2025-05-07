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
const addProductForm = document.getElementById("add-product-form");
if (addProductForm) {
  addProductForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const productName = document.getElementById("product-name");
    const productDescription = document.getElementById("product-description");
    const productPrice = document.getElementById("product-price");
    const productCategory = document.getElementById("product-category");
    const productImage = document.getElementById("product-image");

    let isValid = true;

    // Product Name
    if (!/^[a-zA-Z0-9 ]{3,}$/.test(productName.value.trim())) {
      setError(
        "product-name",
        "Product name must be at least 3 characters long and can only contain letters, numbers, and spaces."
      );
      isValid = false;
    } else {
      setSuccess("product-name");
    }
    
    // Product Description
    if (!/^[a-zA-Z0-9 ]{3,}$/.test(productDescription.value.trim())) {
      setError(
        "product-description",
        "Product description must be at least 3 characters long and can only contain letters, numbers, and spaces."
      );
      isValid = false;
    } else {
      setSuccess("product-description");
    }
    
    // Product Price
    if (!/^\d+(\.\d{1,2})?$/.test(productPrice.value.trim())) {
      setError("product-price", "Invalid price format.");
      isValid = false;
    } else {
      setSuccess("product-price");
    }
    
    // Product Category
    if (productCategory.value === "") {
      setError("product-category", "Please select a category.");
      isValid = false;
    } else {
      setSuccess("product-category");
    }
    
    // Product Image
    if (productImage.files.length === 0) {
      setError("product-image", "Please upload an image.");
      isValid = false;
    } else {
      setSuccess("product-image");
    }
    
    if (isValid) {
      // Submit the form or perform any other action
      alert("Product added successfully!");
    }
    }
  );
}