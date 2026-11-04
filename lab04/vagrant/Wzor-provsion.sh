#!/bin/bash
apt update && apt upgrade -y

# Podstawowe narzędzia
apt install -y curl wget git vim net-tools htop unzip whois

# Bash i narzędzia tekstowe
apt install -y gawk sed grep

# Ustawienie strefy czasowej na Warszawę
timedatectl set-timezone Europe/Warsaw

# Powitanie
echo "Witaj w laboratorium!" > /home/vagrant/intro.txt


