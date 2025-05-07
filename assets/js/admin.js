function updateNavbarColor(theme) {
  const nav = document.getElementById("nav");
  if (theme === "dark") {
    nav.style.backgroundColor = "rgb(0 0 0 / 50%)";
  } else {
    nav.style.backgroundColor = "rgb(255 255 255 / 50%)";
  }
}

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
    updateNavbarColor("dark");
  } else {
    themeSwitch.checked = false;
    document.body.classList.remove("dark-mode");
    toggleText.textContent = "Light Mode";
    toggleIcon.children[1].classList.replace("fa-moon", "fa-sun");
    updateNavbarColor("light");
  }
}

document
  .querySelector(".theme-switch input")
  ?.addEventListener("change", (event) => {
    if (event.target.checked) {
      document.documentElement.setAttribute("data-theme", "dark");
      localStorage.setItem("theme", "dark");
      document.body.classList.add("dark-mode");
      document.querySelector(".toggle-text").textContent = "Dark Mode";
      updateNavbarColor("dark");
    } else {
      document.documentElement.setAttribute("data-theme", "light");
      localStorage.setItem("theme", "light");
      document.body.classList.remove("dark-mode");
      document.querySelector(".toggle-text").textContent = "Light Mode";
      updateNavbarColor("light");
    }
  });

async function addUser(newUser) {
  try {
    const response = await fetch("http://localhost:3000/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newUser),
    });

    if (!response.ok) {
      throw new Error("Failed to add user");
    }

    await fetchUsers();
  } catch (error) {
    console.error("Error adding user:", error);
  }
}

function editUser(userId) {
  // Logic to edit an existing user
}

function deleteUser(userId) {
  // Logic to delete a user
}

async function fetchUsers() {
  try {
    const response = await fetch("../db.json");
    if (!response.ok) {
      throw new Error("Failed to fetch users");
    }
    const data = await response.json();
    const users = data.users;

    const userTableBody = document.getElementById("user-table-body");
    userTableBody.innerHTML = "";

    users.forEach((user) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${user.id}</td>
        <td>${user.username}</td>
        <td>${user.email}</td>
        <td>${user.userType}</td>
        <td>
          <button class="primary edit-user-btn" data-id="${user.id}">Edit</button>
          <button class="outline secondary delete-user-btn" data-id="${user.id}">Delete</button>
        </td>
      `;
      userTableBody.appendChild(row);
    });

    attachUserEventListeners();
  } catch (error) {
    console.error("Error fetching users:", error);
  }
}

function attachUserEventListeners() {
  document.querySelectorAll(".edit-user-btn").forEach((button) =>
    button.addEventListener("click", (e) => {
      const userId = e.target.dataset.id;
      openEditUserModal(userId);
    })
  );

  document.querySelectorAll(".delete-user-btn").forEach((button) =>
    button.addEventListener("click", async (e) => {
      const userId = e.target.dataset.id;
      await deleteUser(userId);
    })
  );
}

async function openEditUserModal(userId) {
  const modal = document.getElementById("edit-user-modal");
  const form = document.getElementById("edit-user-form");

  try {
    const response = await fetch("../db.json");
    if (!response.ok) {
      throw new Error("Failed to fetch user details");
    }
    const data = await response.json();
    const user = data.users.find((u) => u.id === userId);

    if (!user) {
      throw new Error("User not found");
    }

    document.getElementById("edit-username").value = user.username;
    document.getElementById("edit-email").value = user.email;
    document.getElementById("edit-role").value = user.userType;

    form.onsubmit = async (e) => {
      e.preventDefault();
      const updatedUser = {
        username: form.username.value,
        email: form.email.value,
        userType: form.userType.value,
      };
      await updateUser(userId, updatedUser);
      modal.style.display = "none";
      await fetchUsers();
    };
  } catch (error) {
    console.error("Error opening edit user modal:", error);
  }

  modal.style.display = "block";

  document.querySelector(".close-btn").onclick = () => {
    modal.style.display = "none";
  };

  window.onclick = (event) => {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  };
}

async function updateUser(userId, updatedUser) {
  try {
    const response = await fetch(`http://localhost:3000/users/${userId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedUser),
    });

    if (!response.ok) {
      throw new Error("Failed to update user");
    }
  } catch (error) {
    console.error("Error updating user:", error);
  }
}

async function deleteUser(userId) {
  try {
    const response = await fetch(`http://localhost:3000/users/${userId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Failed to delete user");
    }

    await fetchUsers();
  } catch (error) {
    console.error("Error deleting user:", error);
  }
}

function openAddUserModal() {
  const modal = document.getElementById("add-user-modal");
  const form = document.getElementById("add-user-form");

  form.reset();
  form.onsubmit = null;

  form.onsubmit = async (e) => {
    e.preventDefault();

    const newUser = {
      id: Date.now().toString(),
      username: form.querySelector("[name='username']").value.trim(),
      email: form.querySelector("[name='email']").value.trim(),
      password: form.querySelector("[name='password']").value.trim(),
      userType: form.querySelector("[name='userType']").value.trim(),
    };

    if (
      !newUser.username ||
      !newUser.email ||
      !newUser.password ||
      !newUser.userType
    ) {
      alert("Please fill in all fields.");
      return;
    }

    await addUser(newUser);
    modal.style.display = "none";
  };

  modal.style.display = "block";

  document.querySelector("#add-user-modal .close-btn").onclick = () => {
    modal.style.display = "none";
  };

  modal.querySelector(".modal-content").onclick = (e) => {
    e.stopPropagation();
  };

  modal.onclick = () => {
    modal.style.display = "none";
  };
}

document
  .getElementById("add-user-btn")
  ?.addEventListener("click", openAddUserModal);

document.addEventListener("DOMContentLoaded", () => {
  fetchUsers();
});

function approveProduct(productId) {
  // Logic to approve a product
}

function rejectProduct(productId) {
  // Logic to reject a product
}

function deleteProduct(productId) {
  // Logic to delete a product
}

async function fetchProducts() {
  try {
    const response = await fetch("../db.json");
    const data = await response.json();
    const products = data.products;

    const productTable = document.getElementById("product-table-body");
    const approvedProductTable = document.getElementById(
      "approved-product-table-body"
    );
    productTable.innerHTML = "";
    approvedProductTable.innerHTML = "";

    products.forEach((product) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${product.productName}</td>
        <td>${product.price}</td>
        <td>${product.stock}</td>
        <td>${product.description}</td>
        <td>
          ${
            product.status === "pending"
              ? `<button class="secondary approve-btn" data-id="${product.id}">Approve</button>
                 <button class="outline reject-btn" data-id="${product.id}">Reject</button>`
              : `<button class="primary edit-btn" data-id="${product.id}">Edit</button>
                 <button class="outline secondary delete-btn" data-id="${product.id}">Delete</button>`
          }
        </td>
      `;

      if (product.status === "pending") {
        productTable.appendChild(row);
      } else if (product.status === "approved") {
        approvedProductTable.appendChild(row);
      }
    });

    attachProductEventListeners();
  } catch (error) {
    console.error("Error fetching products:", error);
  }
}

function attachProductEventListeners() {
  document.querySelectorAll(".approve-btn").forEach((button) =>
    button.addEventListener("click", async (e) => {
      const productId = e.target.dataset.id;
      await updateProductStatus(productId, "approved");
    })
  );

  document.querySelectorAll(".reject-btn").forEach((button) =>
    button.addEventListener("click", async (e) => {
      const productId = e.target.dataset.id;
      await updateProductStatus(productId, "rejected");
    })
  );

  document.querySelectorAll(".edit-btn").forEach((button) =>
    button.addEventListener("click", async (e) => {
      const productId = e.target.dataset.id;
      await openEditModal(productId);
    })
  );

  document.querySelectorAll(".delete-btn").forEach((button) =>
    button.addEventListener("click", async (e) => {
      const productId = e.target.dataset.id;
      await deleteProduct(productId);
    })
  );
}

async function updateProductStatus(productId, status) {
  try {
    const response = await fetch(
      `http://localhost:3000/products/${productId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to update product status to ${status}`);
    }

    await fetchPendingProducts();
    await fetchApprovedProducts();
  } catch (error) {
    console.error(`Error updating product status to ${status}:`, error);
  }
}

async function deleteProduct(productId) {
  try {
    const response = await fetch(
      `http://localhost:3000/products/${productId}`,
      {
        method: "DELETE",
      }
    );
    if (!response.ok) {
      throw new Error("Failed to delete product");
    }
    await fetchPendingProducts();
    await fetchApprovedProducts();
  } catch (error) {
    console.error("Error deleting product:", error);
  }
}

async function fetchPendingProducts() {
  try {
    const response = await fetch("http://localhost:3000/products");
    if (!response.ok) {
      throw new Error("Failed to fetch products");
    }
    const products = await response.json();
    const productTable = document.getElementById("product-table-body");
    productTable.innerHTML = "";

    const pendingProducts = products.filter(
      (product) => product.status === "pending"
    );

    if (pendingProducts.length === 0) {
      productTable.innerHTML = `<tr><td colspan="5" style="text-align: center;">No pending products found.</td></tr>`;
      return;
    }

    pendingProducts.forEach((product) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${product.productName}</td>
        <td>${product.price}</td>
        <td>${product.stock}</td>
        <td>${product.description}</td>
        <td>
          <button class="secondary approve-btn" data-id="${product.id}">Approve</button>
          <button class="outline reject-btn" data-id="${product.id}">Reject</button>
        </td>
      `;
      productTable.appendChild(row);
    });

    attachPendingProductEventListeners();
  } catch (error) {
    console.error("Error fetching pending products:", error);
  }
}

function attachPendingProductEventListeners() {
  document.querySelectorAll(".approve-btn").forEach((button) =>
    button.addEventListener("click", async (e) => {
      const productId = e.target.dataset.id;
      await updateProductStatus(productId, "approved");
    })
  );
  document.querySelectorAll(".reject-btn").forEach((button) =>
    button.addEventListener("click", async (e) => {
      const productId = e.target.dataset.id;
      await updateProductStatus(productId, "rejected");
    })
  );
}

async function fetchApprovedProducts() {
  try {
    const response = await fetch("http://localhost:3000/products");
    if (!response.ok) {
      throw new Error("Failed to fetch products");
    }
    const products = await response.json();
    const approvedProductTable = document.getElementById(
      "approved-product-table-body"
    );
    approvedProductTable.innerHTML = "";

    const approvedProducts = products.filter(
      (product) => product.status === "approved"
    );

    if (approvedProducts.length === 0) {
      approvedProductTable.innerHTML = `<tr><td colspan="5" style="text-align: center;">No approved products found.</td></tr>`;
      return;
    }

    approvedProducts.forEach((product) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${product.productName}</td>
        <td>${product.price}</td>
        <td>${product.stock}</td>
        <td>${product.description}</td>
        <td>
          <button class="primary edit-btn" data-id="${product.id}">Edit</button>
          <button class="outline secondary delete-btn" data-id="${product.id}">Delete</button>
        </td>
      `;
      approvedProductTable.appendChild(row);
    });

    attachApprovedProductEventListeners();
  } catch (error) {
    console.error("Error fetching approved products:", error);
  }
}

function attachApprovedProductEventListeners() {
  document.querySelectorAll(".delete-btn").forEach((button) =>
    button.addEventListener("click", async (e) => {
      const productId = e.target.dataset.id;
      await deleteProduct(productId);
      await fetchApprovedProducts();
    })
  );
  document.querySelectorAll(".edit-btn").forEach((button) =>
    button.addEventListener("click", async (e) => {
      const productId = e.target.dataset.id;
      await openEditModal(productId);
    })
  );
}

async function openEditModal(productId) {
  const modal = document.getElementById("edit-product-modal");
  const form = document.getElementById("edit-product-form");

  try {
    const response = await fetch(`http://localhost:3000/products/${productId}`);
    if (!response.ok) {
      throw new Error("Failed to fetch product details");
    }
    const product = await response.json();

    document.getElementById("edit-product-name").value = product.productName;
    document.getElementById("edit-product-price").value = product.price;
    document.getElementById("edit-product-stock").value = product.stock;
    document.getElementById("edit-product-description").value =
      product.description;

    form.onsubmit = async (e) => {
      e.preventDefault();
      const updatedData = {
        productName: form.productName.value,
        price: parseFloat(form.price.value),
        stock: parseInt(form.stock.value, 10),
        description: form.description.value,
      };
      await updateProduct(productId, updatedData);
      modal.style.display = "none";
      await fetchApprovedProducts();
    };
  } catch (error) {
    console.error("Error opening edit modal:", error);
  }

  modal.style.display = "block";

  document.querySelector(".close-btn").onclick = () => {
    modal.style.display = "none";
  };

  window.onclick = (event) => {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  };
}

async function updateProduct(productId, updatedData) {
  try {
    const response = await fetch(
      `http://localhost:3000/products/${productId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to update product");
    }
  } catch (error) {
    console.error("Error updating product:", error);
  }
}

function updateOrderStatus(orderId, status) {
  // Logic to update order status
}

async function updateDashboardMetrics() {
  try {
    const response = await fetch("../db.json");
    if (!response.ok) {
      throw new Error("Failed to fetch dashboard data");
    }
    const data = await response.json();

    const totalUsers = data.users.length;
    const totalProducts = data.products.length;
    const totalOrders = data.orders ? data.orders.length : 0;

    document.getElementById("total-users").textContent = totalUsers;
    document.getElementById("total-products").textContent = totalProducts;
    document.getElementById("total-orders").textContent = totalOrders;
  } catch (error) {
    console.error("Error updating dashboard metrics:", error);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  updateDashboardMetrics();
  fetchProducts();
  fetchPendingProducts();
  fetchApprovedProducts();
});