// Hauptfunktion für die Farbanalyse
async function analyzeColors() {
    const jsonFile = './elbenwald_images.json'; // Pfad zur JSON-Datei mit Bildpfaden !! Anpassen
    const outputElement = document.getElementById('output');

    // Lade die JSON-Datei mit Bildpfaden
    const response = await fetch(jsonFile);
    if (!response.ok) {
        outputElement.textContent = 'Fehler: JSON-Datei konnte nicht geladen werden.';
        return;
    }

    const files = await response.json(); // Bildliste aus JSON-Datei
    const colorData = {};

    for (const file of files) {
        const img = new Image();
        img.src = file; // Lade das Bild
        await new Promise(resolve => {
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                canvas.width = 200;
                canvas.height = 200;
                ctx.drawImage(img, 0, 0, 200, 200);

                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
                const colors = {};
                for (let i = 0; i < imageData.length; i += 4) {
                    const r = imageData[i];
                    const g = imageData[i + 1];
                    const b = imageData[i + 2];
                    const hex = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
                    colors[hex] = (colors[hex] || 0) + 1;
                }
                colorData[file] = mergeSimilarColors(colors);
                resolve();
            };
        });
    }

    // Ergebnisse als JSON formatieren
    const mergedColorData = mergeAllColors(colorData);
    const jsonOutput = JSON.stringify(mergedColorData, null, 2);
    outputElement.textContent = jsonOutput;
    console.log('Pixel-Farben:', jsonOutput);

    // JSON-Datei erstellen und zum Download anbieten
    downloadJson(mergedColorData, 'colorData.json');
}

// Hilfsfunktion: Farben zusammenfassen
function mergeSimilarColors(colors) {
    const mergedColors = {};
    const threshold = 100; // Unterschiedsschwelle

    for (const color in colors) {
        const [r1, g1, b1] = hexToRgb(color);
        let found = false;

        for (const mergedColor in mergedColors) {
            const [r2, g2, b2] = hexToRgb(mergedColor);
            if (Math.abs(r1 - r2) < threshold && Math.abs(g1 - g2) < threshold && Math.abs(b1 - b2) < threshold) {
                mergedColors[mergedColor] += colors[color];
                found = true;
                break;
            }
        }

        if (!found) {
            mergedColors[color] = colors[color];
        }
    }

    return mergedColors;
}

// Hilfsfunktion: Alle Farben aus mehreren Dateien zusammenführen
function mergeAllColors(colorData) {
    const finalColors = {};

    for (const file in colorData) {
        const colors = colorData[file];
        for (const color in colors) {
            finalColors[color] = (finalColors[color] || 0) + colors[color];
        }
    }

    // Umwandeln in das gewünschte Format
    const result = [];
    for (const color in finalColors) {
        result.push({
            "hashtag": color,
            "count": finalColors[color]
        });
    }

    return result;
}

// Hilfsfunktion: Hex-Farbcode in RGB umwandeln
function hexToRgb(hex) {
    const bigint = parseInt(hex.slice(1), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return [r, g, b];
}

// Funktion zum Herunterladen der JSON-Datei
function downloadJson(data, filename) {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
}

// Event-Listener für den Button
document.getElementById('analyzeButton').addEventListener('click', analyzeColors);
