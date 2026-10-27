// js/calendar.js
/**
 * Moduł kartki z kalendarza.
 * 
 * Odpowiedzialność:
 * - Pobranie bieżącej daty systemowej (new Date())
 * - Sformatowanie dnia tygodnia, dnia i miesiąca w języku polskim
 *   (Wskazówka: new Intl.DateTimeFormat('pl-PL', { weekday: 'long', day: 'numeric', month: 'long' }))
 * - Bezpieczne wstrzyknięcie sformatowanej treści do dedykowanego slotu DOM (Zero-XSS)
 */

export function initCalendar() {
  // TODO: Zaimplementuj pobranie daty i formatowanie w języku polskim
  const currentDate = new Date();
  const currentDateFormatted = new Intl.DateTimeFormat('pl-PL', { weekday: 'long', day: 'numeric', month: 'long' }).format(currentDate);

  document.querySelector(".calendar-content").innerText = `Mamy dziś ${currentDateFormatted}`;
}
