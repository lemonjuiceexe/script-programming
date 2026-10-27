# Specyfikacja Wymagań: Laboratorium 02 (JavaScript, DOM i Zewnętrzne API)

**Przedmiot:** Programowanie Skryptowe  
**Kierunek:** Cyberbezpieczeństwo, Semestr III  
**Czas realizacji:** 90 minut (zajęcia) + praca domowa  
**Forma pracy:** Indywidualna  
**Efekt końcowy:** Rozbudowa statycznej strony osobistej z Laboratorium 01 o dynamiczną logikę w czystym JavaScript (ES6): modułową architekturę, przełącznik motywu z zachowaniem preferencji, kartkę z kalendarza, asynchroniczny widget meteorologiczny oraz interaktywny rejestr odnośników.

---

## 1. Ograniczenia Architektoniczne i Stos Technologiczny

### 1.1. Dopuszczalny stos technologiczny
* **Środowisko i standard języka:** Nowoczesny Vanilla JavaScript (standard ECMAScript 2020+).
* **Architektura kodu:** Dedykowane, natywne moduły ES6 (`import` / `export`) z głównym punktem wejścia `js/main.js` dołączanym z atrybutem `type="module"`.
* **Zasada Zero External JS Libraries:** Obowiązuje zakaz importowania zewnętrznych bibliotek i frameworków JS (brak jQuery, Axios, lodash, React itp.). Cała logika opiera się wyłącznie na natywnych Web APIs przeglądarki (DOM API, Fetch API, Storage API, Intl).

### 1.2. Wymagana struktura katalogów i plików
Projekt stanowi bezpośrednią kontynuację repozytorium z Laboratorium 01 (wzbogacenie istniejącej strony o logikę JavaScript):
```text
lab02/
├── index.html        # Zaktualizowana strona z Lab 01
├── style.css         # Zaktualizowany arkusz stylów z Lab 01 (reguły motywu ciemnego body.dark)
├── js/               # Moduły ES6
│   ├── main.js       # Główny punkt wejścia aplikacji (inicjalizacja modułów)
│   ├── theme.js      # Moduł motywu (Dark/Light) i zachowania preferencji
│   ├── calendar.js   # Moduł kartki z kalendarza (data systemowa w języku polskim)
│   ├── weather.js    # Moduł pobierania i prezentacji danych synoptycznych IMGW
│   └── links.js      # Moduł rejestru odnośników (formularz, lista, usuwanie)
└── assets/           # Zasoby statyczne z Lab 01 (ikony SVG, zdjęcia)
```

---

## 2. Wymagania Funkcjonalne (User Stories) i Kryteria Akceptacji (AC)

### US-1: Wybór motywu kolorystycznego
* **User Story:** Jako użytkownik chcę mieć możliwość przełączania motywu kolorystycznego strony między jasnym a ciemnym, aby wygodnie przeglądać stronę w różnych warunkach oświetleniowych, a moje preferencje pozostały zachowane przy kolejnych wizytach.
* **Kryteria Akceptacji (AC):**
  - [ ] Dostępna kontrolka (przycisk) umożliwia przełączanie motywu kolorystycznego całej witryny między jasnym a ciemnym.
  - [ ] Po odświeżeniu strony lub ponownym otwarciu witryny wybrany wcześniej motyw pozostaje aktywny i jest aplikowany natychmiast, bez konieczności ponownego klikania.

### US-2: Dynamiczna kartka z kalendarza
* **User Story:** Jako odwiedzający chcę zobaczyć na stronie aktualną datę z dniem tygodnia sformatowaną w języku polskim, aby uzyskać bieżący kontekst czasowy.
* **Kryteria Akceptacji (AC):**
  - [ ] W dedykowanym kafelku kalendarza wyświetlana jest bieżąca data systemowa z pełną nazwą dnia tygodnia i miesiąca w języku polskim.
  - [ ] Prezentowany tekst zachowuje poprawną polską gramatykę oraz czytelne formatowanie wielkości liter.

### US-3: Widget aktualnej pogody
* **User Story:** Jako użytkownik chcę widzieć w dedykowanym kafelku aktualne dane meteorologiczne dla wybranego miasta, aby znać bieżącą temperaturę i panujące warunki atmosferyczne.
* **Kryteria Akceptacji (AC):**
  - [ ] W dedykowanym kafelku pogody prezentowane są aktualne dane meteorologiczne: co najmniej nazwa stacji, temperatura, ciśnienie atmosferyczne oraz prędkość wiatru.
  - [ ] Na czas pobierania danych w kafelku wyświetlany jest czytelny stan ładowania (*loading state*).
  - [ ] W przypadku problemów z siecią lub niedostępności usługi w kafelku pojawia się estetyczny komunikat błędu (bez użycia blokujących okienek przeglądarki).

### US-4: Formularz dodawania odnośników
* **User Story:** Jako użytkownik chcę dodawać odnośniki wraz z ich czytelnymi nazwami za pomocą formularza z walidacją, aby katalogować przydatne strony pod zrozumiałymi etykietami i uniknąć zapisania błędnych adresów.
* **Kryteria Akceptacji (AC):**
  - [ ] Dostępny jest formularz zawierający pole czytelnej nazwy zasobu, pole adresu URL oraz przycisk dodawania.
  - [ ] Wprowadzane dane podlegają walidacji: nazwa musi mieć co najmniej 3 znaki (bez spacji), a adres URL musi być poprawnym adresem internetowym (protokoły `http:` lub `https:`).
  - [ ] W przypadku podania niepoprawnych danych wyświetlany jest czytelny komunikat błędu, a błędne pole otrzymuje wizualne wyróżnienie.
  - [ ] Po pomyślnym dodaniu pozycji formularz jest automatycznie czyszczony, a ewentualne komunikaty błędów znikają.

### US-5: Zarządzanie rejestrem odnośników i trwałość wpisów
* **User Story:** Jako użytkownik chcę przeglądać dodane odnośniki, otwierać je w nowej karcie, usuwać niepotrzebne pozycje oraz mieć pewność, że moje linki nie znikną po odświeżeniu witryny.
* **Kryteria Akceptacji (AC):**
  - [ ] Każdy wpis na liście zawiera klikalny odnośnik otwierający docelowy adres w nowej karcie oraz przycisk usuwania, którego użycie usuwa daną pozycję z widoku.
  - [ ] Rejestr odnośników zachowuje aktualny stan między sesjami – po ponownym otwarciu lub odświeżeniu witryny lista prezentuje aktualne wpisy, a usunięte pozycje nie powracają.

---

## 3. Globalna Definicja Ukończenia (Definition of Done – DoD)

Projekt uznaje się za ukończony i gotowy do oceny inżynierskiej, gdy spełnione są wszystkie poniższe kryteria:

* [ ] **Weryfikacja Funkcjonalna:** Wszystkie historyjki użytkownika (US-1 do US-5) spełniają swoje indywidualne Kryteria Akceptacji (AC).
* [ ] **Czystość i Architektura Modułowa ES6:**
  * Logika aplikacji jest ściśle podzielona na dedykowane moduły ES6 (`theme.js`, `calendar.js`, `weather.js`, `links.js`) z jawną wymianą zależności za pomocą `import` i `export`.
  * Główny plik `js/main.js` pełni rolę punktu wejścia i odpowiada wyłącznie za import oraz inicjalizację modułów (brak logiki biznesowej w pliku głównym).
* [ ] **Bezpieczeństwo Frontendu (Zero-XSS & Bezpieczne Linki):**
  * Całkowity zakaz `innerHTML` i `outerHTML` – elementy DOM tworzone są wyłącznie bezpiecznymi metodami (`createElement`, `textContent`, `append`).
  * Walidacja odnośników dopuszcza wyłącznie protokoły `http:` i `https:` (blokada `javascript:` i `data:`), a generowane linki z `target="_blank"` posiadają zabezpieczenie `rel="noopener noreferrer"`.
* [ ] **Obsługa Błędów i Odporność Asynchroniczna:**
  * W zapytaniach `fetch()` sprawdzana jest flaga `response.ok`.
  * Wszystkie wywołania asynchroniczne i operacje na `JSON.parse()` zabezpieczono blokami `try...catch`.
  * W kodzie nie używa się blokujących wywołań interfejsu takich jak `alert()`, `confirm()` czy `prompt()` – komunikaty prezentowane są w strukturze HTML.
* [ ] **Wydajność i Event Handling:**
  * Zdarzenie usuwania linków obsługiwane jest poprzez delegację zdarzeń na nadrzędnym kontenerze listy, a nie przez rejestrację niezależnych listenerów w pętli.
* [ ] **Struktura Projektu i Spójność:** Zachowano wymaganą strukturę katalogów (`index.html`, `style.css`, `js/`, `assets/`). Konsola przeglądarki (DevTools) jest wolna od błędów wykonania JavaScriptu i ostrzeżeń o braku zasobów.

---

## 4. Wytyczne Realizacji

### 4.1. Zawartość i użycie startera (`lab02_starter.zip`)
Zadanie stanowi bezpośrednią rozbudowę witryny z **Laboratorium 1**. Do dyspozycji studentów przygotowano paczkę startową `lab02_starter.zip` zawierającą katalog `js/` z czystym szkieletem architektonicznym:
* `js/main.js` – szkielet punktu wejścia importujący i inicjalizujący moduły,
* `js/theme.js`, `js/calendar.js`, `js/weather.js` – działające zaślepki funkcyjne,
* `js/links.js` – szkielet rejestru odnośników wraz z gotową, bezpieczną funkcją walidacji i sanityzacji adresów `sanitizeUrl()`.

> [!NOTE]
> **Instrukcja startowa:** Rozpakuj archiwum i skopiuj katalog `js/` bezpośrednio do swojego projektu z Laboratorium 1. Starter dostarcza wyłącznie architekturę JavaScript – nie narzuca selektorów DOM ani stylów CSS, pozostawiając pełną swobodę integracji z kodem HTML/CSS powstałym w czasie Laboratorium 1.

---

### 4.2. Wytyczne implementacji krok po kroku

1. **Architektura punktu wejścia (`js/main.js`):**
   * Plik `main.js` pełni rolę **Orkiestratora** aplikacji – importuje funkcje startowe poszczególnych modułów (`initTheme`, `initCalendar`, `initWeather`, `initLinks`) i wywołuje je po sparsowaniu dokumentu HTML (skrypty z atrybutem `type="module"` działają z zachowaniem semantyki `defer`, więc drzewo DOM jest od razu dostępne bez konieczności rejestrowania zdarzenia `DOMContentLoaded`). W pliku głównym nie umieszczaj bezpośredniej logiki biznesowej, zapytań sieciowych ani listenerów zdarzeń.
   * W sekcji `<head>` pliku `index.html` dołącz główny skrypt z atrybutem `type="module"`:
     ```html
     <script type="module" src="js/main.js"></script>
     ```

2. **Podział odpowiedzialności modułów (`js/`):**
   * **`theme.js`:** Przełączanie klasy motywu na elemencie `document.body` z zachowaniem preferencji użytkownika.
   * **`calendar.js`:** Pobranie bieżącej daty systemowej i osadzenie jej w dedykowanym slocie `#calendar-box` ze sformatowaniem treści w języku polskim.
   * **`weather.js`:** Asynchroniczna komunikacja z API IMGW, obsługa stanów interfejsu (ładowanie / błąd) oraz osadzenie danych w slocie `#weather-box`.
   * **`links.js`:** Powiązanie formularza z dynamiczną listą wpisów w dedykowanym panelu bocznym oraz wykorzystanie dostarczonej w starterze funkcji `sanitizeUrl()` do walidacji i zabezpieczenia adresów (ochrona przed DOM XSS).

3. **Pomocnicze informacje o API Pogody IMGW:**
   * Adres endpointu: `https://danepubliczne.imgw.pl/api/data/synop/station/krakow` (lub `warszawa`, `wroclaw`, `gdansk`).
   * Kluczowe pola w zwracanym obiekcie JSON:
     * `stacja` (np. `"Kraków"`),
     * `temperatura` (np. `"12.4"`),
     * `cisnienie` (np. `"1024.2"`),
     * `predkosc_wiatru` (np. `"3"`),
     * `wilgotnosc_wzgledna` (np. `"78.5"`).

4. **Wskazówka: Stylizowanie trybu ciemnego w CSS (Synergia z Lab 01):**
   * Do przełączania motywu na poziomie dokumentu wykorzystaj natywne API `.classList` na elemencie `document.body`.
   * **Warto pamiętać (Rola spacji w selektorach CSS):**
     * **Brak spacji (`body.dark`, `.btn.active`):** wskazuje ten sam, pojedynczy element (znacznik `<body>` posiadający jednocześnie klasę `dark`).
     * **Spacja (`body.dark .card`):** spacja jest operatorem potomka – stylizuje element `.card` leżący wewnątrz ciemnego `<body>`.

---

## 5. Zadanie Domowe

Dokończenie i dopracowanie implementacji projektu tak, aby spełniała 100% wymagań **Definition of Done (DoD)** i stanowiła stabilną bazę pod integrację z backendem na Laboratorium 03.

---

## 6. Zadanie Dodatkowe / Opcjonalne (Bonus)

Dla studentów, którzy zrealizują komplet wymagań podstawowych i chcą rozbudować projekt:
* **Zegar czasu UTC i znacznik Unix Epoch (Telemetria czasu):**
  * Rozbudowa modułu `js/calendar.js` o dynamiczny zegar aktualizowany w czasie rzeczywistym co 1 sekundę za pomocą funkcji `setInterval()`.
  * Prezentacja bieżącego czasu w standardzie **UTC** (np. `18:45:12 UTC`) oraz znacznika czasu epoki Uniksa (**Unix Epoch timestamp** w sekundach, np. `Epoch: 1729017912`).
  * Wyświetlenie danych w estetycznej formie pod datą w kafelku `#calendar-box` bez migotania interfejsu.
* **Funkcja weryfikacji domeny w sieci („Sprawdź URL”):**
  * Uzupełnienie formularza o asynchroniczny przycisk „Sprawdź URL”, który przed dodaniem wpisu wykonuje test sieciowy DNS/TCP w trybie `no-cors` z ograniczeniem czasu odpowiedzi (`signal: AbortSignal.timeout(3000)`).
  * Prezentacja wyniku testu bezpośrednio w interfejsie graficznym (np. etykieta: *„✔ Domena osiągalna”* lub *„✖ Brak odpowiedzi hosta”*).
* **Bezpieczne potwierdzenie usunięcia odnośnika (Non-blocking Confirmation):**
  * Rozbudowa modułu `js/links.js` o mechanizm potwierdzania chęci usunięcia wpisu bez użycia blokującego wywołania `confirm()`.
  * Do wyboru jeden z dwóch wzorców inżynierskich:
    1. *Mechanizm In-Place (dwuklik):* Pierwsze kliknięcie przycisku zmienia jego etykietę i styl na „Na pewno?” (z automatycznym powrotem do stanu pierwotnego po 3 sekundach bezczynności), a dopiero drugie kliknięcie usuwa pozycję.
    2. *Natywny modal HTML5 `<dialog>`:* Wyświetlenie ostylowanego okna modalnego (`dialog.showModal()`) z pytaniem potwierdzającym i przyciskami „Usuń” oraz „Anuluj”, z obsługą zamykania klawiszem ESC.

