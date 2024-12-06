const fs = require('fs');
const path = require('path');

const profileName = process.argv[2]; // Erwartet den Profilnamen als CLI-Argument
console.log('ProfilName readPixels', profileName);

if (!profileName) {
    console.error('Kein Profilname angegeben! Das Skript benötigt einen Profilnamen.');
    process.exit(1);
}

console.log("analyzeColors() gestartet.");
const jsonFile = path.join(__dirname, `static/js/${profileName}_images.json`); // Pfad zur JSON-Datei mit Bildpfaden

console.log("Vor dem Laden der Datei");
let files;
try {
    const fileData = await fs.promises.readFile(jsonFile, 'utf8');
    files = JSON.parse(fileData); // Bildliste aus JSON-Datei
} catch (error) {
    console.error("Fehler: JSON-Datei konnte nicht geladen werden.", error);
    return;
}

const colorData = {};
console.log('clolorFiles:', files);

for (const file of files) {
    console.log('clolorFile in for:', file);
    const img = new Image();
    img.src = path.join(__dirname, file); // Lade das Bild
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
            console.log('Aktuelle Farbanalyse für Datei:', file, colorData[file]);
            resolve();
        };
    });
}

try {
    await saveColorDataToFile(colorData, profileName);
    console.log("Pixel-Farben erfolgreich gespeichert.");
} catch (error) {
    console.error("Fehler beim Speichern der Pixel-Farben:", error);
}

return colorData;


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

// Funktion zum Speichern der Farbdaten in einer Datei
async function saveColorDataToFile(colorData, profileName) {
    const filePath = path.join(__dirname, `static/js/${profileName}_color_data.json`);
    try {
        await fs.promises.writeFile(filePath, JSON.stringify(colorData, null, 2), 'utf8');
        console.log(`Daten erfolgreich in ${filePath} gespeichert.`);
    } catch (err) {
        console.error('Fehler beim Speichern der JSON-Datei:', err);
    }
}

// Starte die Analyse, wenn das Skript direkt ausgeführt wird
if (require.main === module) {
    analyzeColors().catch(err => {
        console.error("Fehler bei der Farbanalyse:", err);
        process.exit(1);
    });
}
