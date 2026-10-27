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
import { linksApi } from "./api.js";

let links = [];

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

function renderLinks() {
  const list = document.querySelector(".links-list");
  if (!list) return;

  list.textContent = "";

  links.forEach((item) => {
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.href = item.url;
    a.textContent = item.title;
    a.target = "_blank";
    a.rel = "noopener noreferrer";

    const deleteBtn = document.createElement("button");
    deleteBtn.type = "button";
    deleteBtn.className = "links-delete-btn";
    deleteBtn.textContent = "Usuń";
    deleteBtn.dataset.id = item.id;

    li.append(a, deleteBtn);
    list.append(li);
  });
}

async function loadLinks() {
  const errorElement = document.querySelector(".links-error");
  try {
    links = await linksApi.getAll();
    renderLinks();
  } catch (err) {
    if (errorElement) errorElement.textContent = err.message;
  }
}

async function handleDeleteLink(event) {
  const deleteBtn = event.target.closest(".links-delete-btn");
  if (!deleteBtn) return;

  const linkId = deleteBtn.dataset.id;
  const errorElement = document.querySelector(".links-error");

  try {
    await linksApi.delete(linkId);
    links = links.filter((l) => l.id !== Number(linkId));
    renderLinks();
  } catch (err) {
    if (errorElement) errorElement.textContent = err.message;
  }
}

export function initLinks() {
  const panel = document.querySelector("#links");
  const list = document.querySelector(".links-list");
  const form = document.querySelector(".links-form");

  if (form) {
    form.addEventListener("submit", addLink);
  }

  if (list) {
    list.addEventListener("click", handleDeleteLink);
  }

  onLoginSuccess(() => {
    if (panel) panel.classList.remove("hidden");
    loadLinks();
  });

  onLogoutSuccess(() => {
    if (panel) panel.classList.add("hidden");
    links = [];
    if (list) list.textContent = "";
  });
}

async function addLink(event) {
  event.preventDefault();

  const urlInput = document.querySelector("#url");
  const aliasInput = document.querySelector("#alias");
  const errorElement = document.querySelector(".links-error");

  const url = sanitizeUrl(urlInput.value);
  const alias = aliasInput.value;

  const isUrlValid = ![null, undefined].includes(url);
  const isAliasValid = alias.replace(/\s/g, "").length >= 3;

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

  try {
    const created = await linksApi.create({ title: alias.trim(), url });
    links.push(created);
    renderLinks();
    event.target.reset();
  } catch (err) {
    errorElement.textContent = err.message;
  }
}
