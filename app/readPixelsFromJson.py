import os
import json
from PIL import Image
from collections import defaultdict

# Name des Profilordners für die Eingabedateien
if len(sys.argv) < 2:
    print("Profilname fehlt!")
    sys.exit(1)

profile_name = sys.argv[1]


# Verzeichnis des aktuellen Skripts ermitteln
current_dir = os.path.dirname(os.path.abspath(__file__))

# Verzeichnis der Bilder basierend auf dem Speicherort des Skripts festlegen
images_dir = os.path.join(current_dir, 'static', 'images', 'elbenwald_Pics')

# JSON-Dateipfad für die Liste der Bilddateien
json_file_path = os.path.join(current_dir, f"{profile_name}_images.json")

# Ausgabe-Pfad für die Farbanalyse in static/js
output_dir = os.path.join(current_dir, 'static', 'js')
if not os.path.exists(output_dir):
    os.makedirs(output_dir)

# Ergebnis-Dictionary für Farbanalysen
color_data = {}

def load_image_files(json_file_path):
    """Lädt eine Liste von Bilddateien aus einer JSON-Datei."""
    try:
        with open(json_file_path, 'r') as file:
            files = json.load(file)
        print("Dateien aus JSON geladen:", files)
        return files
    except (FileNotFoundError, json.JSONDecodeError) as e:
        print("Fehler beim Laden der JSON-Datei:", e)
        return []

def process_image(file_path):
    """Verarbeitet ein Bild und zählt die Farben der Pixel."""
    try:
        with Image.open(file_path) as img:
            img = img.resize((200, 200))  # Optionales Resizing des Bildes
            img = img.convert("RGB")  # Bild in RGB umwandeln

            pixels = img.getdata()
            color_counts = defaultdict(int)

            for pixel in pixels:
                hex_color = "#{:02x}{:02x}{:02x}".format(pixel[0], pixel[1], pixel[2])
                color_counts[hex_color] += 1

            color_data[file_path] = merge_similar_colors(color_counts)
            print(f"Farbanalyse für {file_path}: {color_data[file_path]}")

    except Exception as e:
        print(f"Fehler beim Verarbeiten der Datei {file_path}: {e}")

def merge_similar_colors(colors, threshold=30):
    """Merges colors that are similar within a certain threshold."""
    merged_colors = {}

    for color, count in colors.items():
        r1, g1, b1 = hex_to_rgb(color)
        found = False

        for merged_color in merged_colors:
            r2, g2, b2 = hex_to_rgb(merged_color)
            if (abs(r1 - r2) < threshold) and (abs(g1 - g2) < threshold) and (abs(b1 - b2) < threshold):
                merged_colors[merged_color] += count
                found = True
                break

        if not found:
            merged_colors[color] = count

    return merged_colors

def hex_to_rgb(hex_color):
    """Konvertiert eine hexadezimale Farbe in RGB."""
    hex_color = hex_color.lstrip('#')
    return int(hex_color[0:2], 16), int(hex_color[2:4], 16), int(hex_color[4:6], 16)

def save_color_data_to_file(color_data, profile_name):
    """Speichert die Farbanalyse in einer JSON-Datei im static/js-Verzeichnis."""
    output_path = os.path.join(output_dir, f"{profile_name}_color_data.json")
    try:
        with open(output_path, 'w', encoding='utf-8') as file:
            json.dump(color_data, file, indent=2, ensure_ascii=False)
        print(f"Daten erfolgreich in {output_path} gespeichert.")
    except IOError as e:
        print(f"Fehler beim Speichern der Datei {output_path}: {e}")

def process_images(files):
    """Verarbeitet alle Bilder in der angegebenen Liste."""
    for file_path in files:
        full_path = os.path.join(images_dir, file_path)
        print(f"Verarbeite Datei: {full_path}")
        process_image(full_path)
    save_color_data_to_file(color_data, profile_name)

if __name__ == "__main__":
    files = load_image_files(json_file_path)
    if files:
        process_images(files)