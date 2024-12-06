import os
import json
import numpy as np
from PIL import Image
from collections import defaultdict
from colormath.color_objects import sRGBColor, LabColor
from colormath.color_diff import delta_e_cie2000
from colormath.color_conversions import convert_color

# Import necessary modules
from colormath.color_diff import delta_e_cie2000 as original_delta_e

# Monkey patch für delta_e_cie2000
def patched_delta_e_cie2000(color1, color2, *args, **kwargs):
    # Verwende direkt die original delta_e_cie2000 Funktion
    original_result = original_delta_e(color1, color2, *args, **kwargs)
    return np.asarray(original_result).item()

# Ersetze die alte Funktion durch die gepatchte
delta_e_cie2000 = patched_delta_e_cie2000


def resize_images(input_folder, size=(200, 200)):
    """Resizes all images in a folder to the given size."""
    resized_images = []
    for filename in os.listdir(input_folder):
        if filename.lower().endswith(('png', 'jpg', 'jpeg', 'bmp', 'gif')):
            img_path = os.path.join(input_folder, filename)
            with Image.open(img_path) as img:
                img = img.resize(size, Image.LANCZOS)  # Ersetzt ANTIALIAS durch LANCZOS
                resized_images.append(img)
    return resized_images

def extract_colors(image):
    """Extracts the colors from an image as hex values."""
    pixels = list(image.getdata())
    hex_colors = ["#{:02x}{:02x}{:02x}".format(r, g, b) for r, g, b in pixels]
    return hex_colors

def group_similar_colors(hex_colors, threshold=10):
    """Groups similar colors using the CIEDE2000 color difference algorithm."""
    color_counts = defaultdict(int)
    for color in hex_colors:
        color_counts[color] += 1

    lab_colors = {}
    for hex_color in color_counts:
        r, g, b = tuple(int(hex_color[i:i+2], 16) for i in (1, 3, 5))
        rgb = sRGBColor(r / 255, g / 255, b / 255)
        lab = convert_color(rgb, LabColor)
        lab_colors[hex_color] = lab

    grouped_colors = {}
    for color1, lab1 in lab_colors.items():
        if color1 in grouped_colors:
            continue

        grouped_colors[color1] = color_counts[color1]
        for color2, lab2 in lab_colors.items():
            if color1 != color2 and color2 not in grouped_colors:
                if delta_e_cie2000(lab1, lab2) < threshold:
                    grouped_colors[color1] += color_counts[color2]
                    grouped_colors[color2] = 0

    return {color: count for color, count in grouped_colors.items() if count > 0}

def save_to_json(data, output_file):
    """Saves the color data to a JSON file."""
    formatted_data = [
        {"color": color, "count": count}
        for color, count in data.items()
    ]
    with open(output_file, 'w') as f:
        json.dump(formatted_data, f, indent=2)

def main():
    profilename = "elbenwald"
    base_path = os.getcwd()
    #input_folder = "path/to/your/images"  # Replace with the path to your folder
    input_base_path = os.path.join(base_path, 'static', 'images')
    input_path = os.path.join(input_base_path, f"{profilename}_Pics")
    #output_file = "output.json"
    # Dynamischer Speicherpfad
    output_base_path = os.path.join(base_path, 'static', 'js')
    output_path = os.path.join(output_base_path, f"{profilename}_color_counts.json")

    resized_images = resize_images(input_path)
    all_colors = []
    for image in resized_images:
        all_colors.extend(extract_colors(image))

    grouped_colors = group_similar_colors(all_colors)
    save_to_json(grouped_colors, output_path)
    print(f"Color data saved to {output_path}")

if __name__ == "__main__":
    main()