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
  const initialTheme = localStorage.getItem("theme");
  if(initialTheme === "dark" && !document.querySelector("body").classList.contains("dark"))
    document.querySelector("body").classList.add("dark");
}

export function toggleTheme() {
  const isDark = document.body.classList.toggle("dark");
  localStorage.setItem("theme", isDark ? "dark" : "light");
}