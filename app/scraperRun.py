from selenium import webdriver
from selenium.common import TimeoutException
from selenium.webdriver.firefox.service import Service as FirefoxService
from selenium.webdriver.firefox.options import Options
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By
from selenium.webdriver.support.wait import WebDriverWait
import pandas as pd
from datetime import datetime
import locale

from collections import Counter
import ast

import time

import os
import wget
import json

import sys
import threading


# Erhalte den Profilnamen aus den Argumenten
if len(sys.argv) < 2:
    print("Profilname fehlt!")
    sys.exit(1)

profilename = sys.argv[1]

# Setze den Pfad zum geckodriver
geckodriver_path = 'C:/Users/rebec/OneDrive/Desktop/Dateien/FirefoxDriver/geckodriver.exe'
firefox_path = 'C:/Program Files/Mozilla Firefox/firefox.exe'
# Pfade zu Firefox und Geckodriver aus Umgebungsvariablen lesen
#geckodriver_path = os.getenv('GECKODRIVER_PATH', 'C:/Users/rebec/OneDrive/Desktop/Dateien/FirefoxDriver/geckodriver.exe')
#firefox_path = os.getenv('FIREFOX_BINARY_PATH', 'C:/Program Files/Mozilla Firefox/firefox.exe')



# Initialisiere die Optionen für Firefox und setze den Pfad zur Binary
options = Options()
options.binary_location = firefox_path

# Initialisiere den Service
service = FirefoxService(executable_path=geckodriver_path)

# Initialisiere den Firefox WebDriver mit dem korrekten Pfad zum geckodriver
driver = webdriver.Firefox(service=service, options=options)

# Öffne Instagram
driver.get("https://www.instagram.com/")

#Cookies akzeptieren
accept_cookie = WebDriverWait(driver, 10).until(EC.element_to_be_clickable((By.XPATH, "//button[contains(text(), 'Alle Cookies erlauben')]"))).click()

#Log In
username = WebDriverWait(driver, 10).until(EC.element_to_be_clickable((By.CSS_SELECTOR, "input[name='username']")))
password = WebDriverWait(driver, 10).until(EC.element_to_be_clickable((By.CSS_SELECTOR, "input[name='password']")))

username.clear()
password.clear()
username.send_keys("data.kunstwerk")
password.send_keys("dataKunstwerk123!")

# Warte, bis der Einloggen-Button sichtbar ist
log_in = WebDriverWait(driver, 10).until(
    EC.presence_of_element_located((By.CSS_SELECTOR, "button[type='submit']"))
)

# Scrolle zum Button
driver.execute_script("arguments[0].scrollIntoView(true);", log_in)

# Warte einen Moment, um sicherzustellen, dass das Scrollen abgeschlossen ist
time.sleep(1)

# Klicke auf den Button
driver.execute_script("arguments[0].click();", log_in)

# Zwei Pop ups
#decline_safe = WebDriverWait(driver, 10).until(EC.element_to_be_clickable((By.XPATH, "//div[contains(text(), 'Jetzt nicht')]"))).click()
#decline_alert = WebDriverWait(driver, 10).until(EC.element_to_be_clickable((By.XPATH, "//button[contains(text(), 'Jetzt nicht')]"))).click()

try:
    # Überprüfe, ob das Popup-Element innerhalb der Wartezeit verfügbar ist
    decline_safe = WebDriverWait(driver, 10).until(
        EC.element_to_be_clickable((By.XPATH, "//div[contains(text(), 'Jetzt nicht')]"))
    )
    decline_safe.click()  # Klicke nur, wenn das Element gefunden wurde
except TimeoutException:
    print("Das Popup mit 'Jetzt nicht' ist nicht erschienen, daher wird der Button nicht geklickt.")


try:
    # Überprüfe, ob das Popup-Element innerhalb der Wartezeit verfügbar ist
    decline_alert = WebDriverWait(driver, 10).until(
        EC.element_to_be_clickable((By.XPATH, "//button[contains(text(), 'Jetzt nicht')]"))
    )
    decline_alert.click()  # Klicke nur, wenn das Element gefunden wurde
except TimeoutException:
    print("Das Popup ist nicht erschienen, daher wird der Button nicht geklickt.")



#Zu Profil navigieren
#decline_safe = WebDriverWait(driver, 10).until(EC.element_to_be_clickable((By.XPATH, "//span[contains(text(), 'Suche')]"))).click()

#searched_name = WebDriverWait(driver, 10).until(EC.element_to_be_clickable((By.CSS_SELECTOR, "input[placeholder='Suchen']")))
#searched_name.clear()

#searched_name.send_keys("google")

# # Extrahiere den Profilnamen aus der Anfrage
# data = request.get_json()
# profilename = data.get('profilename')

# # Überprüfen, ob der Profilname übergeben wurde
# if not profilename:
#     return jsonify({"error": "Profilname fehlt"}), 400
    

driver.get(f"https://www.instagram.com/{profilename}/")


def scroll_and_collect_images(image_urls, path):
    images = driver.find_elements(By.TAG_NAME, 'img')
    new_image_urls = [image.get_attribute('src') for image in images if image.get_attribute('src') not in image_urls]

    for image_url in new_image_urls:
        try:
            counter = len(image_urls)
            save_as = os.path.join(path, f"{profilename}_{counter}.jpg")
            wget.download(image_url, save_as)
            image_urls.append(image_url)
        except Exception as e:
            print(f"Fehler beim Herunterladen des Bildes {image_url}: {e}")
    return image_urls


def scroll_page(scroll_count):
    for _ in range(scroll_count):
        driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
        time.sleep(2)


# Variable für die Anzahl der Scrollvorgänge
initial_scroll_count = 3
additional_scroll_count = 2
repeat_count = 0  # Anzahl der Wiederholungen des Scrollen-Daten-Auslesen-Zyklus

# Initiales Scrollen
scroll_page(initial_scroll_count)

# Finde und speichere Bilder
image_urls = []
# path = os.path.join(os.getcwd(), f"{profilename}Pics_new")
path = os.path.join(os.getcwd(), 'app', 'static', 'images', f"{profilename}_Pics")
if not os.path.exists(path):
    os.mkdir(path)
image_urls = scroll_and_collect_images(image_urls, path)

all_hashtags = []
post_dates = []
post_urls = []


def extract_post_data():
    post_links = driver.find_elements(By.XPATH, "//a[contains(@href, '/p/') or contains(@href, '/reel/')]")
    for link in post_links:
        post_url = link.get_attribute('href')
        if post_url not in post_urls:
            post_urls.append(post_url)
            try:
                driver.execute_script("arguments[0].click();", link)
                time.sleep(1.5)
                post_date = driver.find_element(By.XPATH, "//time").get_attribute('title')
                post_dates.append(post_date)
                hashtags = driver.find_elements(By.XPATH, "//h1//a[contains(@href, '/explore/tags/')]")
                post_hashtags = [hashtag.text for hashtag in hashtags]
                all_hashtags.append(post_hashtags)
                driver.back()
                time.sleep(1.5)
            except Exception as e:
                print(f"Fehler beim Abrufen des Datums: {e}")
                post_dates.append('Datum nicht gefunden')


extract_post_data()

# Wiederholtes Scrollen, Daten auslesen und Bilder speichern
for _ in range(repeat_count):
    scroll_page(additional_scroll_count)
    image_urls = scroll_and_collect_images(image_urls, path)
    extract_post_data()

# Schließe den WebDriver
driver.quit()

# Speichere die Daten in CSV-Dateien
df_dates = pd.DataFrame({'Post URL': post_urls, 'Post Date': post_dates})
df_dates.to_csv(f'{profilename}_date_data.csv', index=False)

df_hashtags = pd.DataFrame({'Post URL': post_urls, 'Hashtags': all_hashtags})
df_hashtags.to_csv(f'{profilename}_hashtag_data.csv', index=False)

print("Daten erfolgreich gespeichert!")

###########################################################################################################
#Transform Date Data:
# Setze die Lokalisierung auf Deutsch
try:
    locale.setlocale(locale.LC_TIME, 'de_DE.UTF-8')  # Für Linux/Mac
except locale.Error:
    try:
        locale.setlocale(locale.LC_TIME, 'de_DE')  # Für Windows -> deu
    except locale.Error:
        print("Die deutsche Lokalisierung ist auf diesem System nicht verfügbar.")
        exit()

print(locale.getlocale(locale.LC_TIME))
# Daten laden

base_path = os.getcwd()
file_path = os.path.join(base_path, f'{profilename}_date_data.csv')
print(file_path)

try:
    df_dates = pd.read_csv(file_path)
except FileNotFoundError:
    print(f'{profilename}_date_data.csv wurde nicht gefunden {file_path}')
    exit()

    
# Funktion zur Bestimmung der Woche im Monat
def week_of_month(date):
    first_day = date.replace(day=1)
    dom = date.day
    adjusted_dom = dom + first_day.weekday()
    return (adjusted_dom - 1) // 7 + 1


# Konvertiere das Datum und aggregiere die Daten
month_counts = {}
week_counts = {}

for _, row in df_dates.iterrows():
    try:
        # Datum parsen
        post_date = datetime.strptime(row['Post Date'], '%d. %B %Y')  # Format anpassen für deutsche Monatsnamen

        # Monat bestimmen (ohne Jahr)
        month = post_date.strftime('%B')
        if month not in month_counts:
            month_counts[month] = 0
        month_counts[month] += 1

        # Woche bestimmen (ohne Monat und Jahr)
        week = week_of_month(post_date)
        week_key = f"W{week}"
        if week_key not in week_counts:
            week_counts[week_key] = 0
        week_counts[week_key] += 1

    except Exception as e:
        print(f"Fehler beim Verarbeiten des Datums '{row['Post Date']}': {e}")

# Dynamischer Speicherpfad
base_path = os.path.join(os.getcwd(), 'app', 'static', 'js')

# Sicherstellen, dass der Ordner existiert
os.makedirs(base_path, exist_ok=True)

# Monatsdaten speichern
monthly_output_path = os.path.join(base_path, f"{profilename}_monthly_counts.json")
with open(monthly_output_path, 'w', encoding='utf-8') as f:
    json.dump({"monthly_counts": [{"month": month, "count": count} for month, count in month_counts.items()]}, f,
              ensure_ascii=False, indent=4)

print(f"Daten für Monate erfolgreich in '{monthly_output_path}' gespeichert!")

# Wochendaten speichern
weekly_output_path = os.path.join(base_path, f"{profilename}_weekly_counts.json")
with open(weekly_output_path, 'w', encoding='utf-8') as f:
    json.dump({"weekly_counts": [{"week": week, "count": count} for week, count in week_counts.items()]}, f,
              ensure_ascii=False, indent=4)

print(f"Daten für Wochen erfolgreich in '{weekly_output_path}' gespeichert!")

###########################################################################################################################################
# Transform Hashtag Data:

#df_hashtags = pd.read_csv('C:/Users/rebec/OneDrive/Desktop/Dateien/Medieninformtik/BA/SeleniumScraper/instagram_post_hashtags.csv')
base_path = os.getcwd()
file_path = os.path.join(base_path, f'{profilename}_hashtag_data.csv')
print(file_path)

try:
    df_hashtags = pd.read_csv(file_path)
except FileNotFoundError:
    print(f'{profilename}_hashtag_data.csv wurde nicht gefunden')
    exit()

# Alle Hashtags zu einer Liste zusammenfügen und zählen
all_hashtags = []
for hashtags in df_hashtags['Hashtags']:
    try:
        hashtags_list = ast.literal_eval(hashtags)  # Konvertiert String-Listen in tatsächliche Listen
        all_hashtags.extend(hashtags_list)
    except (ValueError, SyntaxError):
        continue

# Häufigkeit der Hashtags berechnen
hashtag_counts = Counter(all_hashtags)

# Daten im JavaScript-Format vorbereiten
hashtag_data = [{"hashtag": tag, "count": count} for tag, count in hashtag_counts.items()]


# Dynamischer Speicherpfad
base_path = os.path.join(os.getcwd(), 'app', 'static', 'js')
# Sicherstellen, dass der Ordner existiert
os.makedirs(base_path, exist_ok=True)
hashtag_output_path = os.path.join(base_path, f"{profilename}_hashtags_counts.json")
# Daten in `data.js` speichern
with open(hashtag_output_path, "w", encoding="utf-8") as js_file:
    js_file.write("const hashtagData = ")
    js_file.write(json.dumps(hashtag_data, indent=2))
    js_file.write(";")

print(f"{profilename}_hashtags_counts.json wurde erfolgreich erstellt und die Hashtag-Daten wurden gespeichert!")


