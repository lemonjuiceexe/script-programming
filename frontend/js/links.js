// js/links.js
/**
 * Moduł dynamicznego rejestru odnośników w panelu bocznym (<aside id="linki">).
 * 
 * Odpowiedzialność:
 * - Obsługa formularza dodawania odnośnika (zdarzenie 'submit', preventDefault)
 * - Walidacja danych (minimalna długość nazwy, weryfikacja poprawności URL za pomocą sanitizeUrl)
 * - Dynamiczne renderowanie listy wpisów w DOM (Zero-XSS: createElement, textContent, append, rel="noopener noreferrer")
 * - Obsługa usuwania elementów za pomocą delegacji zdarzeń (Event Delegation z użyciem e.target.closest)
 * - Zapewnienie trwałości rejestru linków w localStorage (JSON.parse / JSON.stringify)
 */

/**
 * Pomocnicza funkcja weryfikująca i sanityzująca adres URL wprowadzony przez użytkownika:
 * - Wymaga podania pełnego adresu z bezpiecznym protokołem (http: lub https:)
 * - Odrzuca adresy niepoprawne składniowo oraz niebezpieczne pseudoprotokoły (javascript:, data:)
 * - Zwraca znormalizowany, bezpieczny ciąg URL (href) lub null w przypadku nieprawidłowego adresu
 * @param {string} urlString
 * @returns {string|null}
 */
import { onLoginSuccess, onLogoutSuccess } from "./auth.js";

function sanitizeUrl(urlString) {
  // .trim() usuwa białe znaki (spacje, tabulatory, nowe linie) z początku i końca tekstu
  const trimmed = urlString.trim();
  if (!trimmed) return null;

  try {
    // Krok 1 (Weryfikacja składni): Natywny parser new URL() wymaga absolutnego adresu ze schematem.
    // Jeśli ciąg nie posiada protokołu (np. "onet.pl") lub zawiera błędy składniowe,
    // konstruktor rzuca wyjątek TypeError: Invalid URL, który bezpiecznie przechwytujemy w bloku catch.
    const parsed = new URL(trimmed);

    // Krok 2 (Biała lista protokołów / AppSec): Parser new URL() akceptuje każdy poprawny schemat URI,
    // w tym niebezpieczne dla bezpieczeństwa DOM wektory XSS (np. "javascript:alert(1)", "data:text/html,...").
    // Dlatego bezwzględnie weryfikujemy białą listę: dopuszczamy wyłącznie protokoły "http:" oraz "https:".
    if (parsed.protocol === "http:" || parsed.protocol === "https:") {
      return parsed.href;
    }

    return null;
  } catch {
    // Przechwycenie błędu składniowego rzuconego przez new URL()
    return null;
  }
}

const STORAGE_KEY = "links";

const DEFAULT_LINKS = [
  { name: "GitHub", url: "https://github.com/lemonjuiceexe" },
  { name: "LinkedIn", url: "https://www.linkedin.com/in/franciszekniwicki/" },
  { name: "MDN Web Docs", url: "https://developer.mozilla.org/en-US/" },
];

function loadLinks() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === null) {
    return DEFAULT_LINKS;
  }
  return JSON.parse(stored);
}

function saveLinks(links) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(links));
}

let links = loadLinks();

function renderLinks() {
  const list = document.querySelector(".links-list");

  list.textContent = "";

  links.forEach((item) => {
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.href = item.url;
    a.textContent = item.name;
    a.target = "_blank";
    a.rel = "noopener noreferrer";

    const deleteBtn = document.createElement("button");
    deleteBtn.type = "button";
    deleteBtn.className = "links-delete-btn";
    deleteBtn.textContent = "Usuń";
    deleteBtn.addEventListener("click", () => deleteLink(item.name));

    li.append(a, deleteBtn);
    list.append(li);
  });
}

function deleteLink(name) {
  links = links.filter((item) => item.name !== name);
  saveLinks(links);
  renderLinks();
}

export function initLinks() {
  const panel = document.querySelector("#links");
  const list = document.querySelector(".links-list");
  const form = document.querySelector(".links-form");

  if (form) {
    form.addEventListener("submit", addLink);
  }

  onLoginSuccess(() => {
    if (panel) panel.classList.remove("hidden");
    renderLinks();
  });

  onLogoutSuccess(() => {
    if (panel) panel.classList.add("hidden");
    if (list) list.textContent = "";
  });
}

function addLink(event) {
  event.preventDefault();

  const urlInput = document.querySelector("#url");
  const aliasInput = document.querySelector("#alias");
  const errorElement = document.querySelector(".links-error");

  const url = sanitizeUrl(urlInput.value);
  const alias = aliasInput.value;

  const isUrlValid = ![null, undefined].includes(url);
  const isAliasValid = alias.trim().length >= 3;

  urlInput.classList.toggle("error", !isUrlValid);
  aliasInput.classList.toggle("error", !isAliasValid);

  if (!isUrlValid || !isAliasValid) {
    if (!isUrlValid && !isAliasValid) {
      errorElement.textContent = "Podaj poprawny URL oraz nazwę (min. 3 znaki).";
    } else if (!isUrlValid) {
      errorElement.textContent = "Podaj poprawny adres URL (http:// lub https://).";
    } else {
      errorElement.textContent = "Nazwa musi mieć co najmniej 3 znaki (bez spacji).";
    }

    return;
  }

  errorElement.textContent = "";

  links.push({ name: alias.trim(), url });
  saveLinks(links);
  renderLinks();

  event.target.reset();
}
