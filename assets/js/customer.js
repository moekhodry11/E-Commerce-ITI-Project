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