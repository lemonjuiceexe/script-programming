# Specyfikacja Wymagań: Laboratorium 03 (FastAPI, SQLAlchemy i Bezpieczeństwo REST API)

**Przedmiot:** Programowanie Skryptowe  
**Kierunek:** Cyberbezpieczeństwo, Semestr III  
**Czas realizacji:** 90 minut (zajęcia) + praca domowa  
**Forma pracy:** Indywidualna  
**Efekt końcowy:** Rozbudowa witryny osobistej o nowoczesny backend REST API w oparciu o FastAPI, relacyjną bazę danych SQLite z mapowaniem ORM (SQLAlchemy 2.0), walidację schematów (Pydantic v2) oraz twardą ochronę przed podatnością BOLA/IDOR.

---

## 1. Ograniczenia Architektoniczne i Stos Technologiczny

### 1.1. Dopuszczalny stos technologiczny
* **Środowisko uruchomieniowe:** Python 3.10+ (zalecany Python 3.11 lub nowszy).
* **Framework backendowy:** **FastAPI** z serwerem **Uvicorn**.
* **Walidacja schematów:** **Pydantic v2**.
* **Baza danych (ORM):** **SQLAlchemy 2.0** z lokalnym silnikiem relacyjnym **SQLite**.
* **Moduł tożsamości (starter-kit):** Bezpieczne tokeny **JWT** oraz haszowanie haseł **bcrypt**.
* **Frontend:** Czysty JavaScript (**Vanilla JS**, moduły ES6) rozwijany na bazie Laboratorium 02, z komunikacją opartą na natywnym **Fetch API** (bez zewnętrznych frameworków i bibliotek).

### 1.2. Wymagana struktura katalogów i repozytorium
Projekt stanowi kontynuację architektury z poprzednich zajęć (model *Brownfield*). Student nie tworzy frontendu od zera, lecz rozszerza swój działający projekt z Laboratorium 02 o warstwę serwerową oraz nowe moduły komunikacji:

```text
lab03/
├── backend/                   # Kompletny serwer FastAPI
│   ├── run.py                 # Punkt uruchomieniowy serwera Uvicorn (port 8000)
│   ├── requirements.txt       # Lista zależności Python
│   ├── .env.example           # Wzorzec konfiguracji zmiennych środowiskowych
│   └── app/
│       ├── __init__.py        
│       ├── database.py        # Silnik SQLite, fabryka SessionLocal, DeclarativeBase
│       ├── dependencies.py    # Wstrzykiwanie sesji (get_db) oraz tożsamości (get_current_user)
│       ├── main.py            # Instancja FastAPI, CORS i rejestracja routerów
│       ├── core/
│       │   ├── __init__.py
│       │   ├── config.py      # Zmienne środowiskowe i CORS_ORIGINS
│       │   └── security.py    # Haszowanie haseł bcrypt i podpisywanie tokenów JWT
│       ├── models/
│       │   ├── __init__.py    
│       │   ├── user.py        # Model User (gotowy ze startera)
│       │   └── link.py        # 🛠️ Model Link (do implementacji: definicja pól i relacji)
│       ├── schemas/
│       │   ├── __init__.py    
│       │   ├── token.py       # Schematy tokenu JWT (gotowe ze startera)
│       │   ├── user.py        # Schematy użytkownika (gotowe ze startera)
│       │   └── link.py        # 🛠️ Schematy LinkCreate i LinkResponse (do implementacji)
│       └── routers/
│           ├── __init__.py    
│           ├── auth.py        # Trasy logowania i rejestracji (gotowe ze startera)
│           └── links.py       # 🛠️ Router CRUD odnośników z obroną BOLA/IDOR (do implementacji)
│
└── frontend/                  # Frontend z Lab 02 + moduły integracji
    ├── index.html             # Główny plik HTML z Lab 02 (+ pasek tożsamości w nav)
    ├── style.css              # Arkusz stylów z Lab 02 (bez zmian)
    ├── auth.css               # Dedykowane style paska tożsamości i okna logowania
    └── js/
        ├── theme.js           # Moduł motywu (bez zmian z Lab 02)
        ├── calendar.js        # Moduł kalendarza (bez zmian z Lab 02)
        ├── weather.js         # Moduł pogody (bez zmian z Lab 02)
        ├── links.js           # 🛠️ Moduł odnośników (do modyfikacji: integracja z API i sesją)
        ├── main.js            # 🛠️ Punkt wejścia (do modyfikacji: wywołanie initAuth)
        ├── api.js             # 🛠️ Klient HTTP REST API (ze startera: uzupełnienie metod linksApi)
        └── auth.js            # Moduł logowania i sesji HttpOnly (gotowy ze startera)
```

---

## 2. Wymagania Funkcjonalne (User Stories) i Kryteria Akceptacji (AC)

Poniższe wymagania opisują oczekiwane zachowanie systemu z perspektywy użytkownika:

### US-1: Dostęp do Prywatnego Panelu Odnośników
* **User Story:** Jako właściciel strony chcę logować się do serwisu, aby uzyskać dostęp do swojego prywatnego panelu zarządzania linkami, ukrytego przed osobami postronnymi.
* **Kryteria Akceptacji (AC):**
  - [ ] W nawigacji witryny dostępna jest kontrolka logowania umożliwiająca uwierzytelnienie i wylogowanie.
  - [ ] Panel odnośników jest domyślnie ukryty dla niezalogowanych użytkowników.
  - [ ] Poprawne zalogowanie (oraz odświeżenie strony z aktywną sesją) odsłania panel zarządzania odnośnikami.
  - [ ] Wylogowanie ukrywa panel i natychmiast czyści prywatne dane z widoku strony.

### US-2: Zarządzanie Odnośnikami i Ochrona Danych
* **User Story:** Jako zalogowany właściciel strony chcę przeglądać, dodawać i usuwać swoje linki, aby zarządzać katalogiem trwale zapisanym na serwerze z zachowaniem poufności moich danych.
* **Kryteria Akceptacji (AC):**
  - [ ] **Odczyt:** Na liście prezentowane są wyłącznie linki należące do bieżącego użytkownika (izolacja tożsamości).
  - [ ] **Zapis i wiązanie tożsamości:** Zatwierdzenie formularza trwale zapisuje nowy link w bazie i natychmiast umieszcza go na liście; serwer automatycznie przypisuje odnośnik do tożsamości zalogowanego użytkownika (brak możliwości zapisania zasobu na cudze konto).
  - [ ] **Usuwanie i ochrona BOLA:** Usunięcie odnośnika trwale kasuje go z bazy i widoku, a próba usunięcia cudzego zasobu jest bezwzględnie blokowana przez serwer (błąd `403 Forbidden`).

### US-3: Odporność na Niedostępność Usługi
* **User Story:** Jako użytkownik chcę być informowany o problemach z łącznością, aby wiedzieć, czy serwer API jest w danej chwili dostępny.
* **Kryteria Akceptacji (AC):**
  - [ ] W przypadku problemów z siecią lub braku połączenia z backendem (np. wyłączony serwer) aplikacja prezentuje w interfejsie czytelny komunikat o błędzie komunikacji z API (bez blokowania konsoli nieobsłużonymi wyjątkami).

---

## 3. Globalna Definicja Ukończenia (Definition of Done – DoD)

Projekt uznaje się za ukończony i gotowy do oceny, gdy spełnia 100% poniższych kryteriów inżynierskich:

* [ ] **Zgodność Funkcjonalna:** Wszystkie historyjki użytkownika (US-1 do US-3) zostały zrealizowane i działają poprawnie w interfejsie.
* [ ] **Architektura Backendowa (FastAPI + SQLAlchemy 2.0):**
  * Zaimplementowano model relacyjny odnośnika oraz schematy walidacyjne Pydantic (z poprawną walidacją adresu URL).
  * Trasy API wydzielono do modułowego routera (`routers/links.py`) zarejestrowanego w aplikacji.
* [ ] **Bezpieczeństwo Aplikacji i Danych (AppSec):**
  * **Ochrona przed BOLA / IDOR (OWASP API Top 1):** Próba dodania lub usunięcia odnośnika nienależącego do zalogowanego użytkownika jest bezwzględnie blokowana kodem błędu `403 Forbidden`.
  * **Wymuszone wiązanie tożsamości:** Identyfikator właściciela w żądaniu tworzenia zasobu jest pobierany bezpośrednio ze zweryfikowanego tokena sesji (brak możliwości podszycia się w payloadzie JSON).
* [ ] **Integracja Frontendu z REST API:**
  * Magazyn `localStorage` został całkowicie zastąpiony asynchroniczną komunikacją z serwerem, zabezpieczoną przed błędami sieciowymi (`try...catch`).
  * Zaimplementowano pełną obsługę cyklu życia sesji: pobieranie danych po zalogowaniu oraz fizyczne usuwanie elementów z drzewa DOM i ukrycie panelu po wylogowaniu.
* [ ] **Stabilność i Środowisko:**
  * Serwer uruchamia się bezbłędnie (`python run.py`), a trasy są w pełni widoczne i przetestowane w Swagger UI (`/docs`).
  * Konsola przeglądarki (DevTools) pozostaje wolna od błędów wykonania JavaScriptu podczas pracy z aplikacją.

---

## 4. Wytyczne Realizacji

### 4.1. Zawartość i użycie starter-kitu (`lab03/starter/`)
Katalog startowy `lab03/starter/` został przygotowany z zachowaniem **Zasady Ciągłości (Brownfield)** i **braku kolizji z kodem studenta**. 
Starter **nie zawiera** plików `index.html`, `style.css` ani istniejących modułów `theme.js`, `calendar.js`, `weather.js`, dzięki czemu ich skopiowanie **nie nadpisze** pracy wykonanej podczas Laboratorium 01 i 02.

**Zawartość katalogu startera:**
1. **`backend/`:** Kompletny serwer FastAPI z gotowym i przetestowanym modułem tożsamości (IAM: haszowanie bcrypt w `security.py`, modele `models/user.py`, schematy `schemas/user.py`, `schemas/token.py` oraz trasy `routers/auth.py`). Student skupia się wyłącznie na implementacji logiki odnośników (`link.py`) i ochronie przed BOLA.
2. **`frontend/` (Nowe moduły dla warstwy klienta):**
   * **`js/api.js`:** Gotowy, centralny klient HTTP ze wsparciem dla nagłówka `Authorization: Bearer` oraz ciasteczek sesyjnych `HttpOnly` (`credentials: "include"`).
   * **`js/auth.js`:** Gotowy moduł obsługi logowania, wylogowania, sesji HttpOnly oraz automatycznego montowania okna dialogowego w drzewie DOM (`initAuth`, `onLoginSuccess`, `onLogoutSuccess`).
   * **`auth.css`:** Dedykowany arkusz stylów dla paska tożsamości i okna logowania, który wystarczy dołączyć w `<head>` jako `<link rel="stylesheet" href="auth.css">`.

**Instrukcja integracji startera z Twoim projektem:**
1. **Wydzielenie katalogu frontendu:** W swoim dotychczasowym projekcie z Laboratorium 02 utwórz katalog `frontend/` i przenieś do niego wszystkie swoje dotychczasowe pliki i foldery (`index.html`, `style.css`, katalog `js/` oraz `assets/`).
2. **Dodanie i przygotowanie środowiska backendu:** Z katalogu `lab03/starter/` skopiuj cały folder `backend/` i umieść go w głównym katalogu swojego projektu (obok nowo utworzonego `frontend/`). Następnie utwórz i aktywuj wirtualne środowisko Pythona oraz zainstaluj wymagane pakiety:
   ```bash
   cd backend
   python -m venv .venv

   # Aktywacja środowiska:
   # Windows (PowerShell / CMD):
   .venv\Scripts\activate
   # Linux / macOS:
   # source .venv/bin/activate

   # Instalacja zależności oraz start serwera:
   pip install -r requirements.txt
   python run.py
   ```
3. **Dodanie nowych modułów klienta:** Z katalogu `lab03/starter/frontend/` skopiuj:
   * pliki `js/api.js` oraz `js/auth.js` bezpośrednio do swojego folderu `frontend/js/`,
   * plik `auth.css` do folderu `frontend/` i dołącz go w sekcji `<head>` pliku `index.html` (`<link rel="stylesheet" href="auth.css">`).
4. **Modyfikacja pliku HTML:** W pliku `index.html` dołącz styl `auth.css` w sekcji `<head>` oraz wklej pasek tożsamości `#userSession` do nawigacji `<nav>` (patrz Rozdział 4.3).
5. **Podłączenie tożsamości w punkcie wejścia:** W swoim pliku `frontend/js/main.js` zaimportuj i wywołaj `initAuth()` (obok dotychczasowych funkcji modułów motywu, pogody, kalendarza i odnośników).
6. **Przełączenie rejestru odnośników na REST API:** W pliku `frontend/js/api.js` uzupełnij metody klienta `linksApi`, a w `frontend/js/links.js` zastąp operacje na `localStorage` asynchronicznymi wywołaniami API oraz zarejestruj reakcję na logowanie (patrz Rozdział 4.2).

---

### 4.2. Zakres prac implementacyjnych i wytyczne architektoniczne

Projekt demonstracyjny z wykładu (`lab03/wyklad/NaWyklad/ToDoWithBackend/`) stanowi bezpośredni punkt odniesienia dla architektury poniższych komponentów.

#### 1. Warstwa danych i walidacji (Backend)
* **Model relacyjny (`models/link.py`):** Zdefiniuj model odnośnika `Link` w tabeli `links`. Każdy wpis przechowuje: tytuł (`title`), docelowy adres URL (`url`), znacznik czasu utworzenia (`created_at`) oraz klucz obcy wskazujący na właściciela (`owner_id`), powiązany relacją z modelem użytkownika.
* **Schematy Pydantic (`schemas/link.py`):** Zbuduj schemat wejściowy (`LinkCreate`) walidujący nazwę (min. 3 znaki) oraz format adresu URL, a także schemat wyjściowy (`LinkResponse`) umożliwiający serializację danych z bazy.

#### 2. Endpointy REST API i ochrona zasobów (Backend)
* **Trasy REST API (`routers/links.py`):** Zaimplementuj operacje:
  * `GET /api/links` – pobranie listy odnośników należących do bieżącego użytkownika.
  * `POST /api/links` – utworzenie nowego odnośnika z automatycznym przypisaniem tożsamości właściciela z tokena sesji.
  * `DELETE /api/links/{link_id}` – usunięcie odnośnika.
* **Obrona przed BOLA/IDOR (OWASP API Top 1):** W operacji usuwania zweryfikuj prawo własności zasobu. Próba skasowania odnośnika nienależącego do bieżącego użytkownika musi zostać zablokowana kodem błędu `403 Forbidden`.

#### 3. Klient sieciowy i interfejs użytkownika (Frontend)
* **Klient API (`frontend/js/api.js`):** W obiekcie `linksApi` uzupełnij metody komunikacji sieciowej (`getAll`, `create`, `delete`), wzorując się na kliencie z projektu wykładowego.
* **Integracja modułu odnośników (`frontend/js/links.js`):**
  * Zastąp operacje na `localStorage` asynchronicznymi zapytaniami do serwera (z obsługą błędów w blokach `try...catch`).
  * **Obsługa sesji i widoczności panelu:**
    * Przed zalogowaniem panel zarządzania odnośnikami powinien być ukryty (klasa `.hidden` z arkusza `auth.css`).
    * Zarejestruj słuchaczy zdarzeń wyeksportowanych z modułu `auth.js`:
      * **`onLoginSuccess`:** Odsłoń panel odnośników (usuń klasę `.hidden`), pobierz dane z serwera (`linksApi.getAll()`) i wyrenderuj je na liście.
      * **`onLogoutSuccess`:** Opróżnij listę odnośników z drzewa DOM (ochrona przed podejrzeniem prywatnych danych w DevTools po wylogowaniu) oraz ponownie ukryj panel (dodaj klasę `.hidden`).

---

### 4.3. Wzorcowa integracja w pliku `index.html`

W swoim pliku `index.html` wprowadź dwie modyfikacje:

#### 1. Dołączenie arkusza stylów w sekcji `<head>`:
Dołącz arkusz stylów modułu logowania `auth.css` ze startera (obok swojego dotychczasowego `style.css`):
```html
  <!-- Dedykowane style okna logowania i paska tożsamości ze startera -->
  <link rel="stylesheet" href="auth.css">
```

#### 2. Wklejenie paska tożsamości do nawigacji (`<nav>`):
Wklej poniższy krótki fragment paska tożsamości do swojego znacznika `<nav>`:
```html
<!-- Pasek tożsamości użytkownika w nawigacji (<nav>) -->
<div id="userSession" class="user-session">
  <button id="loginBtn" type="button">Zaloguj się</button>
  
  <div id="userInfo" class="user-info hidden">
    <span>Zalogowany: <strong id="loggedUsername">--</strong></span>
    <button id="logoutBtn" type="button">Wyloguj</button>
  </div>
</div>
```

* **Działanie:**
  * Kliknięcie `#loginBtn` otwiera okno logowania.
  * Po poprawnym zalogowaniu `#loginBtn` zostaje ukryty, w `#loggedUsername` pojawia się login użytkownika, a kontener `#userInfo` staje się widoczny.
  * Kliknięcie `#logoutBtn` wylogowuje użytkownika, czyści sesję HttpOnly i przywraca stan początkowy.

> [!NOTE]
> **Brak konieczności dodawania kodu modala w HTML:** Okno modalne logowania (`<dialog id="authDialog">`) jest wstrzykiwane do drzewa DOM w 100% automatycznie przez moduł `auth.js` podczas uruchomienia `initAuth()`. Nie musisz kopiować ani dopisywać żadnego dodatkowego znacznika dialogu do pliku `index.html`.

---

### 4.4. Sugerowane scenariusze weryfikacji i testowania

Przed oddaniem projektu zweryfikuj poprawność rozwiązania w dwóch środowiskach:

1. **Weryfikacja podatności BOLA w Swagger UI (`http://127.0.0.1:8000/docs`):**
   * Zarejestruj dwóch użytkowników (np. `userA` i `userB`).
   * Zaloguj się w Swaggerze jako `userA` i dodaj odnośnik.
   * Wyloguj się, zaloguj jako `userB` i wyślij żądanie usunięcia odnośnika utworzonego przez `userA`. Potwierdź, że serwer zablokował próbę i zwrócił kod błędu `403 Forbidden`.
2. **Weryfikacja pełnego cyklu życia w przeglądarce:**
   * Zaloguj się w interfejsie witryny – upewnij się, że panel odnośników staje się aktywny i wyświetla Twoje linki.
   * Dodaj nowy link i upewnij się, że natychmiast pojawia się na liście.
   * Odśwież stronę (F5) – potwierdź, że sesja trwa, a lista linków została bez problemu odtworzona z bazy serwera.
   * Wyloguj się – potwierdź, że lista linków została natychmiast wyczyszczona z widoku.

---

## 5. Zadanie Domowe

Dokończenie pełnej implementacji projektu zgodnie ze specyfikacją oraz kryteriami **Definition of Done (DoD)**.

