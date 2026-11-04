# Instalacja VirtualBoxa i Linuksa (Ubuntu) z Vagrant na Windows 11 – instrukcja krok po kroku

> [!NOTE]
> **Cel procedury:**  
> Niniejsza instrukcja przeznaczona jest dla studentów pracujących na laptopach z systemem **Windows 11**. Pozwala na szybkie uruchomienie powtarzalnej maszyny wirtualnej z systemem Linux (Ubuntu 22.04 LTS) do:
> 1. Samodzielnego wykonywania zadań domowych i ćwiczeń ze skryptów Bash w domu.
> 2. Przyszłych laboratoriów i projektów (np. laboratorium **miniSIEM**), gdzie maszyna ta posłuży jako kontrolowane źródło generowania zdarzeń, logów systemowych (`syslog`, `auth.log`) i metryk. 

## 1. Zainstaluj VirtualBox
- Pobierz z: https://www.virtualbox.org/wiki/Downloads
- Zainstaluj z domyślnymi ustawieniami.

## 2. Zainstaluj Vagrant
- Pobierz z: https://www.vagrantup.com/downloads
- Zainstaluj z domyślnymi ustawieniami.
- Sprawdź w terminalu (PowerShell):
  ```powershell
  vagrant --version
  ```
  *(oczekiwana wersja np. `Vagrant 2.4.x`)*

---

## 🔹 Krok 1: Utwórz katalog projektu
1. Utwórz folder projektu oraz folder na pliki współdzielone:
   ```powershell
   mkdir C:\Users\<mój_user>\vagrant-lab
   mkdir C:\Users\<mój_user>\vagrant-lab\shared_files
   ```
2. Otwórz wiersz polecenia `cmd` lub `PowerShell` w katalogu projektu:
   ```powershell
   cd C:\Users\<mój_user>\vagrant-lab
   ```
3. Zainicjalizuj projekt:
   ```powershell
   vagrant init ubuntu/jammy64
   ```

---

## 🔹 Krok 2: Edytuj plik Vagrantfile
Zamień zawartość wygenerowanego pliku `Vagrantfile` na:

```ruby
# Ustawienie wersji konfiguracji Vagranta (wersja 2 to standard dla VirtualBoxa)
Vagrant.configure("2") do |config|
  # Określenie obrazu systemu operacyjnego (boxa) - Ubuntu 22.04 LTS
  config.vm.box = "ubuntu/jammy64"

  # Nazwa hosta maszyny wirtualnej (przydatna w sieci lokalnej lub do identyfikacji)
  config.vm.hostname = "shell-lab"

  # Konfiguracja sieci prywatnej - maszyna dostaje adres IP z DHCP (opcjonalnie)
  # config.vm.network "private_network", type: "dhcp"

  # Konfiguracja dostawcy maszyn wirtualnych - w tym przypadku VirtualBox
  config.vm.provider "virtualbox" do |vb|
    # Przydzielenie 2048 MB pamięci RAM do maszyny
    vb.memory = "2048"
    # Przydzielenie 2 rdzeni procesora
    vb.cpus = 2
  end

  # Wyłączenie domyślnego montowania całego katalogu projektu jako /vagrant
  config.vm.synced_folder ".", "/vagrant", disabled: true

  # Udostępnienie dedykowanego folderu do maszyny wirtualnej
  # Katalog shared ma typ vboxsf (VirtualBox Shared Folders) co powoduje, że
  # wszystkie pliki mają sztywne uprawnienia (np. chmod 777) i należą do użytkownika i grupy vagrant.
  # UWAGA: W folderze współdzielonym nie można zmienić uprawnień ani właściciela przez chmod/chown!
  config.vm.synced_folder "./shared_files", "/home/vagrant/shared"

  # Provisioning - automatyczne uruchomienie skryptu shellowego po utworzeniu maszyny
  config.vm.provision "shell", path: "provision.sh"
  # lub:
  # config.vm.provision "shell", path: "provision.sh", run: "always"

# Zakończenie bloku konfiguracji
end
```

> [!WARNING]
> ### ⚠️ Krytyczna zasada: Uprawnienia plików (`chmod`) a folder współdzielony (`vboxsf`)
> 
> Folder `./shared_files` z Windowsa jest montowany w maszynie jako `/home/vagrant/shared` przy użyciu sterownika **VirtualBox Shared Folders (`vboxsf`)**.
> - **Ograniczenie techniczne:** Sterownik `vboxsf` narzuca sztywne uprawnienia (zazwyczaj `777` lub `770`). Wewnątrz `/home/vagrant/shared` polecenia zmiany uprawnień i właściciela (**`chmod`**, **`chown`**) **NIE DZIAŁAJĄ** (zwracają błąd lub są ignorowane przez system plików).
> - **Gdzie pisać skrypty i robić zadania:** Wszelkie zadania domowe, skrypty laboratoryjne oraz ćwiczenia z uprawnień (np. `chmod 640`, `chmod +x`, odbieranie uprawnień) wykonuj **WYŁĄCZNIE w linuksowym katalogu domowym** (np. `/home/vagrant/` lub `~/lab`), który znajduje się na natywnej linuksowej partycji `ext4`.
> - **Do czego służy `shared_files`:** Folderu współdzielonego używaj wyłącznie jako „mostka” do wymiany plików (np. skopiowanie gotowego raportu CSV lub logu na Windowsa).

---

## 🔹 Krok 3: Stwórz plik provision.sh (aprowizacja / provisioning)
W tym samym katalogu (`C:\Users\<mój_user>\vagrant-lab`) stwórz plik `provision.sh`:

```bash
#!/bin/bash
apt update && apt upgrade -y

# Podstawowe narzędzia
apt install -y curl wget git vim net-tools htop unzip whois

# Bash i narzędzia tekstowe
apt install -y gawk sed grep logrotate

# Ustawienie strefy czasowej na Warszawę
timedatectl set-timezone Europe/Warsaw

# Powitanie
echo "Witaj w laboratorium!" > /home/vagrant/intro.txt
```

---

## 🔹 Krok 4: Uruchom maszynę wirtualną
Z wiersza poleceń `cmd` lub `PowerShell`, będąc w katalogu projektu (`C:\Users\<mój_user>\vagrant-lab`), wpisz:
```powershell
vagrant up
```
To polecenie:
- Pobierze obraz Ubuntu 22.04 (jednorazowo),
- Utworzy maszynę w VirtualBox,
- Skonfiguruje zasoby i foldery współdzielone,
- Wykona provisioning (`provision.sh`).

---

## 🔹 Krok 5: Połącz się z maszyną
Po zakończeniu `vagrant up` wpisz:
```powershell
vagrant ssh
```
Teraz jesteś wewnątrz Linuksa, gotowy do pracy:
```bash
vagrant@shell-lab:~$ cat intro.txt
Witaj w laboratorium!
```

### Wychodzenie z sesji SSH:
```bash
exit   # wychodzimy z sesji SSH z powrotem do Windowsa
```

### Połączenie z maszyną bezpośrednio poprzez ssh (opcja alternatywna bez `vagrant ssh`):
Wpisz w konsoli `cmd` lub `PowerShell`:
```powershell
ssh -i "C:/Users/<mój_user>/vagrant-lab/.vagrant/machines/default/virtualbox/private_key" vagrant@127.0.0.1 -p 2222
```
📌 **Uwaga:** użyj pełnej ścieżki do swojego pliku `private_key` (zwróć uwagę na ukryty katalog `.vagrant`).

---

## Podstawowe polecenia Vagrant

### 1. `vagrant up`
▶️ **Opis:** Uruchamia maszynę wirtualną.
- Jeśli maszyna nie istnieje – tworzy ją, pobiera system (box), ustawia konfigurację i uruchamia `provision.sh`.
- Jeśli maszyna już istnieje – po prostu ją uruchamia.
- Sprawdza stan maszyny i synchronizuje katalogi.
📌 *Typowe użycie:* start środowiska pracy na początku laboratorium.

### 2. `vagrant halt`
⏹️ **Opis:** Wyłącza maszynę wirtualną „normalnie”, czyli tak, jakbyśmy kliknęli „Shut Down” w systemie operacyjnym.
- Zatrzymuje maszynę w sposób kontrolowany i bezpieczny.
- Maszyna nadal istnieje na dysku i można ją później błyskawicznie uruchomić przez `vagrant up`.
📌 *Typowe użycie:* zakończenie pracy na dany dzień.

### 3. `vagrant reload` lub `vagrant reload --provision`
🔁 **Opis:** Restart maszyny wirtualnej z ponownym wczytaniem konfiguracji z pliku `Vagrantfile`.
- Używane, gdy zmieniono konfigurację sprzętową (np. RAM, CPU, sieć, foldery współdzielone) i trzeba ją zastosować.
- Sam `vagrant reload` nie wykonuje ponownie skryptu `provision.sh`, chyba że dodasz flagę `--provision`.
📌 *Typowe użycie:* gdy zmienisz `Vagrantfile` i/lub `provision.sh` i chcesz, by maszyna to uwzględniła.

### 4. `vagrant destroy -f`
💣 **Opis:** Trwale usuwa maszynę wirtualną bez pytania o potwierdzenie.
- Usuwa maszynę z VirtualBoxa i zwalnia zajmowane miejsce na dysku.
- Czyści katalog `.vagrant/` zawierający dane o stanie maszyny.
- **Nie usuwa** plików Twojego projektu (`Vagrantfile`, `provision.sh`, folderu `shared_files`) ani pobranych wcześniej bazowych boxów.
📌 *Typowe użycie:* gdy chcesz zacząć konfigurację całkowicie od nowa lub przetestować czyste wdrożenie.

### 5. `vagrant provision`
⚙️ **Opis:** Wymusza ponowne wykonanie skryptu provisioningowego (np. `provision.sh`) na już istniejącej i uruchomionej maszynie.
- Nie tworzy nowej maszyny i nie restartuje jej.
- Nie uruchamia maszyny, jeśli jest wyłączona (musi działać).
- Wykonuje wszystkie zdefiniowane akcje `config.vm.provision` w `Vagrantfile`.
📌 *Typowe użycie:*
- Gdy zmieniłeś `provision.sh` (np. dopisałeś nowe pakiety `apt`) i chcesz zastosować zmiany bez niszczenia maszyny.
- Gdy chcesz „doładować” nowe pakiety, konfigurację lub pliki do działającego systemu.
- Podczas wielokrotnego testowania skryptów startowych.

---

## Ustawienie VS Code do pracy przez SSH

### 1. Zainstaluj rozszerzenie "Remote - SSH" w VS Code
1. Otwórz VS Code.
2. Przejdź do zakładki Rozszerzenia / Extensions (`Ctrl+Shift+X`).
3. Wpisz: `Remote - SSH` → kliknij **Install** (wydawcą jest Microsoft).

### 🔹 2. Sprawdź dane połączenia SSH z maszyną Vagrant
W katalogu projektu (`C:\Users\<mój_user>\vagrant-lab`), gdzie masz plik `Vagrantfile`, uruchom terminal (`PowerShell`) i wpisz:
```powershell
vagrant ssh-config
```
Otrzymasz parametry połączenia zbliżone do poniższych:
```text
Host default
  HostName 127.0.0.1
  User vagrant
  Port 2222
  UserKnownHostsFile /dev/null
  StrictHostKeyChecking no
  PasswordAuthentication no
  IdentityFile C:/Users/<mój_user>/vagrant-lab/.vagrant/machines/default/virtualbox/private_key
  IdentitiesOnly yes
  LogLevel FATAL
```

### 🔹 3. Skonfiguruj plik config SSH w systemie Windows
1. Otwórz plik: `C:\Users\<mój_user>\.ssh\config` (jeśli plik lub katalog nie istnieje – utwórz go).
2. Wklej do niego konfigurację:
   ```sshconfig
   Host vagrant-vm
     HostName 127.0.0.1
     User vagrant
     Port 2222
     IdentityFile C:\Users\<mój_user>\vagrant-lab\.vagrant\machines\default\virtualbox\private_key
     StrictHostKeyChecking no
     UserKnownHostsFile /dev/null
   ```
📌 **Uwaga:** Użyj rzeczywistej, pełnej ścieżki do pliku `private_key` (pamiętaj o kropce w `.vagrant`!).

### 🔹 4. Połącz się przez VS Code
1. W VS Code otwórz Paletę Poleceń: `Ctrl+Shift+P`.
2. Wpisz i wybierz: `Remote-SSH: Connect to Host...`.
3. Wybierz z listy skonfigurowanego hosta: `vagrant-vm`.
📌 *Pierwsze połączenie może zająć 1–2 minuty – VS Code automatycznie pobierze i zainstaluje mały agent serwerowy wewnątrz Linuksa.*

### 🔹 5. Otwórz folder projektu na maszynie wirtualnej
Po nawiązaniu połączenia (w lewym dolnym rogu VS Code pojawi się niebieski wskaźnik `SSH: vagrant-vm`):
- Wybierz **File -> Open Folder...** i wskaż `/home/vagrant` (np. utwórz w nim podkatalog `/home/vagrant/lab` na swoje zadania domowe).
- 📌 **Ważne:** Nie ustawiaj jako głównego folderu roboczego katalogu `/home/vagrant/shared` – tworzone tam pliki nie pozwolą na wykonywanie poleceń `chmod` ani nadawanie praw wykonywalności (`+x`)!
- Możesz teraz wygodnie edytować pliki linuksowe, tworzyć skrypty `.sh` oraz otwierać zintegrowany terminal (`Ctrl+\``), który działa bezpośrednio w systemie Ubuntu!

### 🔹 6. Logowanie bezpośrednie z terminala po skonfigurowaniu SSH config
Gdy masz zdefiniowany wpis w `C:\Users\<mój_user>\.ssh\config`, nie musisz już wpisywać długiego polecenia z parametrami `-i` oraz `-p 2222`. Wystarczy w PowerShell/CMD wpisać:
```powershell
ssh vagrant-vm
```
lub (wersja bez wpisu w pliku config):
```powershell
ssh -i "C:/Users/<mój_user>/vagrant-lab/.vagrant/machines/default/virtualbox/private_key" vagrant@127.0.0.1 -p 2222
```
