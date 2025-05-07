const toggleSwitch = document.querySelector('input[type="checkbox"]');
const nav = document.getElementById("nav");
const toggleIcon = document.getElementById("toggle-icon");
const image1 = document.getElementById("image1");
const image2 = document.getElementById("image2");
const image3 = document.getElementById("image3");
const textBox = document.getElementById("text-box");

const themeSwitch = document.querySelector(".theme-switch input");
const toggleText = document.querySelector(".toggle-text");

// Dark or Light Images
function imageMode(color) {
  image1.src = `assets/images/undraw_proud_coder_${color}.svg`;
  image2.src = `assets/images/undraw_feeling_proud_${color}.svg`;
  image3.src = `assets/images/undraw_conceptual_idea_${color}.svg`;
}

// Update Navbar Background Color
function updateNavbarColor(theme) {
  if (theme === "dark") {
    nav.style.backgroundColor = "rgb(0 0 0 / 50%)";
  } else {
    nav.style.backgroundColor = "rgb(255 255 255 / 50%)";
  }
}

// Dark Mode Styles
function darkMode() {
  updateNavbarColor("dark");
  textBox.style.backgroundColor = "rgb(255 255 255 / 50%)";
  toggleIcon.children[0].textContent = "Dark Mode";
  toggleIcon.children[1].classList.replace("fa-sun", "fa-moon");
  imageMode("dark");
}

// Light Mode Styles
function lightMode() {
  updateNavbarColor("light");
  textBox.style.backgroundColor = "rgb(0 0 0 / 50%)";
  toggleIcon.children[0].textContent = "Light Mode";
  toggleIcon.children[1].classList.replace("fa-moon", "fa-sun");
  imageMode("light");
}

// Switch Theme Dynamically
function switchTheme(event) {
  if (event.target.checked) {
    document.documentElement.setAttribute("data-theme", "dark");
    localStorage.setItem("theme", "dark");
    darkMode();
  } else {
    document.documentElement.setAttribute("data-theme", "light");
    localStorage.setItem("theme", "light");
    lightMode();
  }
}

// Event Listener
toggleSwitch.addEventListener("change", switchTheme);

themeSwitch.addEventListener("change", () => {
  if (themeSwitch.checked) {
    document.body.classList.add("dark-mode");
    toggleText.textContent = "Dark Mode";
    toggleIcon.children[1].classList.replace("fa-sun", "fa-moon"); // Change to moon icon
  } else {
    document.body.classList.remove("dark-mode");
    toggleText.textContent = "Light Mode";
    toggleIcon.children[1].classList.replace("fa-moon", "fa-sun"); // Change to sun icon
  }
});

// Check Local Storage For Theme
const currentTheme = localStorage.getItem("theme");
if (currentTheme) {
  document.documentElement.setAttribute("data-theme", currentTheme);

  if (currentTheme === "dark") {
    toggleSwitch.checked = true;
    darkMode();
  } else {
    lightMode();
  }
} else {
  // Default to light mode
  updateNavbarColor("light");
}
