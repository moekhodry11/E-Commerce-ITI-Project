const toggleSwitch = document.querySelector('input[type="checkbox"]');
<<<<<<< HEAD
const nav = document.getElementById('nav');
const toggleIcon = document.getElementById('toggle-icon');
const image1 = document.getElementById('image1');
const image2 = document.getElementById('image2');
const image3 = document.getElementById('image3');
const textBox = document.getElementById('text-box');
=======
const nav = document.getElementById("nav");
const toggleIcon = document.getElementById("toggle-icon");
const image1 = document.getElementById("image1");
const image2 = document.getElementById("image2");
const image3 = document.getElementById("image3");
const textBox = document.getElementById("text-box");

const themeSwitch = document.querySelector(".theme-switch input");
const toggleText = document.querySelector(".toggle-text");
>>>>>>> 8ff0d38 (adding login and register)

// Dark or Light Images
function imageMode(color) {
  image1.src = `assets/images/undraw_proud_coder_${color}.svg`;
  image2.src = `assets/images/undraw_feeling_proud_${color}.svg`;
  image3.src = `assets/images/undraw_conceptual_idea_${color}.svg`;
}

// Dark Mode Styles
function darkMode() {
<<<<<<< HEAD
  nav.style.backgroundColor = 'rgb(0 0 0 / 50%)';
  textBox.style.backgroundColor = 'rgb(255 255 255 / 50%)';
  toggleIcon.children[0].textContent = 'Dark Mode';
  toggleIcon.children[1].classList.replace('fa-sun', 'fa-moon');
  imageMode('dark');
=======
  nav.style.backgroundColor = "rgb(0 0 0 / 50%)";
  textBox.style.backgroundColor = "rgb(255 255 255 / 50%)";
  toggleIcon.children[0].textContent = "Dark Mode";
  toggleIcon.children[1].classList.replace("fa-sun", "fa-moon");
  imageMode("dark");
>>>>>>> 8ff0d38 (adding login and register)
}

// Light Mode Styles
function lightMode() {
<<<<<<< HEAD
  nav.style.backgroundColor = 'rgb(255 255 255 / 50%)';
  textBox.style.backgroundColor = 'rgb(0 0 0 / 50%)';
  toggleIcon.children[0].textContent = 'Light Mode';
  toggleIcon.children[1].classList.replace('fa-moon', 'fa-sun');
  imageMode('light');
=======
  nav.style.backgroundColor = "rgb(255 255 255 / 50%)";
  textBox.style.backgroundColor = "rgb(0 0 0 / 50%)";
  toggleIcon.children[0].textContent = "Light Mode";
  toggleIcon.children[1].classList.replace("fa-moon", "fa-sun");
  imageMode("light");
>>>>>>> 8ff0d38 (adding login and register)
}

// Switch Theme Dynamically
function switchTheme(event) {
  if (event.target.checked) {
<<<<<<< HEAD
    document.documentElement.setAttribute('data-theme', 'dark');
    localStorage.setItem('theme', 'dark');
    darkMode();
  } else {
    document.documentElement.setAttribute('data-theme', 'light');
    localStorage.setItem('theme', 'light');
=======
    document.documentElement.setAttribute("data-theme", "dark");
    localStorage.setItem("theme", "dark");
    darkMode();
  } else {
    document.documentElement.setAttribute("data-theme", "light");
    localStorage.setItem("theme", "light");
>>>>>>> 8ff0d38 (adding login and register)
    lightMode();
  }
}

// Event Listener
<<<<<<< HEAD
toggleSwitch.addEventListener('change', switchTheme);

// Check Local Storage For Theme
const currentTheme = localStorage.getItem('theme');
if (currentTheme) {
  document.documentElement.setAttribute('data-theme', currentTheme);

  if (currentTheme === 'dark') {
    toggleSwitch.checked = true;
    darkMode();
  }
}
=======
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
  }
}
>>>>>>> 8ff0d38 (adding login and register)
