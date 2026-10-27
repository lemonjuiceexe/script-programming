// js/theme.js
/**
 * Moduł motywu (Dark / Light Mode).
 * 
 * Odpowiedzialność:
 * - Reakcja na kliknięcie kontrolki motywu w interfejsie
 * - Przełączanie klasy motywu (np. 'dark') na elemencie <body>
 * - Trwały zapis i odczyt preferencji użytkownika w localStorage
 */

export function initTheme() {
  document.querySelector(".theme-button").addEventListener("click", toggleTheme);
  // TODO: Zaimplementuj obsługę motywu i trwałość w localStorage
  const initialTheme = localStorage.getItem("theme");
  document.querySelector("body").classList.toggle("dark", initialTheme === "dark");
}

export function toggleTheme(){
  document.querySelector("body").classList.toggle("dark");
  localStorage.setItem("theme", localStorage.getItem("theme") === "light" ? "dark" : "light");
}
