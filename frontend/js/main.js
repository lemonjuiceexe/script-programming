// js/main.js
/**
 * Główny punkt wejścia aplikacji (Laboratorium 02).
 * Odpowiada za import i inicjalizację poszczególnych modułów po załadowaniu drzewa DOM.
 */

import { initTheme } from "./theme.js";
import { initCalendar } from "./calendar.js";
import { initWeather } from "./weather.js";
import { initLinks } from "./links.js";
import { initAuth } from "./auth.js";

function app() {
  initTheme();
  initCalendar();
  initWeather("krakow");
  initLinks();
  initAuth();
}

app();
