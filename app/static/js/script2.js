const fs = require('fs');
const path = require('path');
const { createCanvas, loadImage } = require('canvas');

// Der Pfad zum Ordner, den du durchsuchen möchtest
const directoryPath = path.join(__dirname, '../../../scraperPics');

// Hauptfunktion für die Farbanalyse
async function analyzeColors() {
    try {
        // Lese alle Dateien im Verzeichnis
        const files = fs.readdirSync(directoryPath).filter(file => {
            // Nur Bilddateien (z. B. .jpg, .png)
            return /\.(jpg|jpeg|png|gif)$/i.test(file);
        });

        const colorData = {};

        for (const file of files) {
            const filePath = path.join(directoryPath, file);
            const img = await loadImage(filePath);

            const canvas = createCanvas(200, 200);
            const ctx = canvas.getContext('2d');
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
        }

        // Ergebnisse als JSON ausgeben
        console.log(JSON.stringify(colorData, null, 2));
    } catch (error) {
        console.error('Fehler bei der Analyse der Farben:', error);
    }
}

// Hilfsfunktion: Farben zusammenfassen
function mergeSimilarColors(colors) {
    const mergedColors = {};
    const threshold = 30; // Unterschiedsschwelle

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

// Hilfsfunktion: Hex-Farbcode in RGB umwandeln
function hexToRgb(hex) {
    const bigint = parseInt(hex.slice(1), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return [r, g, b];
}

// Start der Farbanalyse
analyzeColors();
