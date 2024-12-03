import os
import locale
import pandas as pd
from datetime import datetime
import json

# Profilname für Dateinamen
profilename = "cinecittamultiplexkino"

# Übersetzung deutscher Monatsnamen in englische Monatsnamen
german_months = {
    "Januar": "January",
    "Februar": "February",
    "März": "March",
    "April": "April",
    "Mai": "May",
    "Juni": "June",
    "Juli": "July",
    "August": "August",
    "September": "September",
    "Oktober": "October",
    "November": "November",
    "Dezember": "December"
}

# Lokalisierung auf Deutsch setzen
def set_locale():
    # try:
    #     locale.setlocale(locale.LC_TIME, 'de_DE.UTF-8')  # Für Linux/Mac
    # except locale.Error:
    #     try:
    #         locale.setlocale(locale.LC_TIME, 'de_DE')  # Für Windows


    try:
        locale.setlocale(locale.LC_TIME, 'en_US.UTF-8')  # For Linux/Mac
    except locale.Error:
        try:
            locale.setlocale(locale.LC_TIME, 'en_US')  # For Windows
        except locale.Error:
            print("Die deutsche Lokalisierung ist auf diesem System nicht verfügbar.")
            exit()
    print(f"Aktuelle Lokalisierung: {locale.getlocale(locale.LC_TIME)}")

# Funktion zum Laden der CSV-Datei
def load_csv(file_path):
    try:
        return pd.read_csv(file_path)
    except FileNotFoundError:
        print(f"{file_path} wurde nicht gefunden.")
        exit()

# Funktion zur Bestimmung der Woche im Monat
def week_of_month(date):
    first_day = date.replace(day=1)
    dom = date.day
    adjusted_dom = dom + first_day.weekday()
    return (adjusted_dom - 1) // 7 + 1

# Funktion zum Normalisieren von Datumsangaben und Umwandeln deutscher Monatsnamen
def normalize_date_format(date_string):
    normalized = date_string.replace('.', '. ').replace('  ', ' ').strip()
    for de_month, en_month in german_months.items():
        if de_month in normalized:
            normalized = normalized.replace(de_month, en_month)
            break  # Beende die Schleife, wenn der Monat gefunden wurde
    return normalized

# Funktion zur Verarbeitung von Datumsangaben
def process_dates(df):
    month_counts = {}
    week_counts = {}

    for _, row in df.iterrows():
        try:
            # Datum normalisieren und parsen
            post_date_str = normalize_date_format(row['Post Date'])
            post_date = datetime.strptime(post_date_str, '%d. %B %Y')

            # Monat extrahieren
            month = post_date.strftime('%B')
            month_counts[month] = month_counts.get(month, 0) + 1

            # Woche extrahieren
            week = week_of_month(post_date)
            week_key = f"W{week}"
            week_counts[week_key] = week_counts.get(week_key, 0) + 1

        except Exception as e:
            print(f"Fehler beim Verarbeiten des Datums '{row['Post Date']}': {e}")

    return month_counts, week_counts

# Funktion zum Speichern von JSON-Daten
def save_to_json(data, output_path, key):
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump({key: [{"key": k, "count": v} for k, v in data.items()]}, f, ensure_ascii=False, indent=4)
    print(f"Daten erfolgreich in '{output_path}' gespeichert!")

def main():
    # Lokalisierung setzen
    set_locale()

    # Dateipfad zur CSV
    base_path = os.getcwd()
    file_path = os.path.join(base_path, f'{profilename}_date_data.csv')
    print(f"Dateipfad: {file_path}")

    # CSV-Datei laden
    df_dates = load_csv(file_path)

    # Daten verarbeiten
    month_counts, week_counts = process_dates(df_dates)

    # Ergebnisse speichern
    output_base_path = os.path.join(base_path, 'app', 'static', 'js')
    monthly_output_path = os.path.join(output_base_path, f"{profilename}_monthly_counts.json")
    weekly_output_path = os.path.join(output_base_path, f"{profilename}_weekly_counts.json")

    save_to_json(month_counts, monthly_output_path, "monthly_counts")
    save_to_json(week_counts, weekly_output_path, "weekly_counts")

if __name__ == "__main__":
    main()
