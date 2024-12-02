import sys
import time

def main(profile_name):
    # Beispiel für einen Scraper-Vorgang (simuliert durch sleep)
    print(f"Starte das Scraping für das Profil: {profile_name}")
    time.sleep(30)  # Simuliert die Dauer des Scrapers
    print("Scraping abgeschlossen")

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Bitte geben Sie den Profilnamen als Argument an.")
        sys.exit(1)

    profile_name = sys.argv[1]
    main(profile_name)
