const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// const profileName = process.argv[2]; // Erwartet den Profilnamen als CLI-Argument
// console.log('ProfilName readPixels', profileName);
// console.log('fs Path:', path);
const profileName = "elbenwald";

if (!profileName) {
    console.error('Kein Profilname angegeben! Das Skript benötigt einen Profilnamen.');
    process.exit(1);
}
function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

console.log("analyzeColors() gestartet.");
const jsonFile = path.join(__dirname, `${profileName}_images.json`);

console.log("Vor dem Laden der Datei");
let files;
try {
    const fileData = fs.readFileSync(jsonFile, 'utf8');
    files = JSON.parse(fileData); // Bildliste aus JSON-Datei
    console.log('Dateien aus JSON geladen:', files);
} catch (error) {
    console.error("Fehler: JSON-Datei konnte nicht geladen werden.", error);
    process.exit(1);
}

const colorData = {};

async function processImage(filePath) {
    try {
        const imageBuffer = fs.readFileSync(filePath);
        console.log('Bild geladen, Größe:', imageBuffer.length);
        console.log('Imagebuffer::', imageBuffer);

        if (imageBuffer.length === 0) {
            console.error('Das Bild ist leer oder konnte nicht geladen werden.');
            return;
        } else {
            console.log('Bild erfolgreich geladen.');
        }

        // Verzeichnis für bearbeitete Bilder sicherstellen
        const processedImagesDir = path.join(__dirname, 'processed_images');
        if (!fs.existsSync(processedImagesDir)) {
            fs.mkdirSync(processedImagesDir);
        }

        // Verarbeite und speichere das Bild
        const outputFilePath = path.join(processedImagesDir, path.basename(filePath));
        
        // Verarbeite das Bild mit sharp und speichere es, während der Code auf das Ergebnis wartet
        await sharp(imageBuffer)
            .resize(200, 200)
            .toFile(outputFilePath);
        
        console.log('Bild gespeichert:', outputFilePath);

        await wait(10000); // Wartet 10 Sekunden (10000 Millisekunden)
    
        // Optionale Analyse des bearbeiteten Bildes, falls gewünscht
        const { data, info } = await sharp(outputFilePath)
            .raw()
            .toBuffer();

        console.log("Buffer verarbeitet:", outputFilePath);
        console.log("Data:", data);
        console.log("Bildinfo:", info);  // Gibt Aufschluss über die Bilddetails
        console.log("Data length:", data.length);

        if (data.length === 0) {
            console.error("Data array is empty!");
        }

        const colors = {};
        for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            const hex = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
            colors[hex] = (colors[hex] || 0) + 1;
        }

        colorData[filePath] = mergeSimilarColors(colors);
        console.log('Aktuelle Farbanalyse für Datei:', filePath, colorData[filePath]);
    } catch (err) {
        console.error('Fehler beim Verarbeiten der Datei:', filePath, err);
    }
}


async function processImages(files) {
    const promises = files.map(file => {
        const shortenedPath = path.resolve(__dirname, '..', '..');
        const filePath = path.join(shortenedPath, file);
        console.log('Verarbeite Datei:', filePath);
        return processImage(filePath);
    });

    await Promise.all(promises);
    saveColorDataToFile(colorData, profileName);
    console.log('!!!!!!!color Daten:', colorData);
    console.log("Pixel-Farben erfolgreich gespeichert.");
}

processImages(files).catch(console.error);

function mergeSimilarColors(colors) {
    const mergedColors = {};
    const threshold = 30;

    for (const color in colors) {
        const [r1, g1, b1] = hexToRgb(color);
        let found = false;

        for (const mergedColor in mergedColors) {
            const [r2, g2, b2] = hexToRgb(mergedColor);
            if (
                Math.abs(r1 - r2) < threshold &&
                Math.abs(g1 - g2) < threshold &&
                Math.abs(b1 - b2) < threshold
            ) {
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

function hexToRgb(hex) {
    const bigint = parseInt(hex.slice(1), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return [r, g, b];
}

function saveColorDataToFile(colorData, profileName) {
    const filePath = path.join(__dirname, `${profileName}_color_data.json`);
    try {
        fs.writeFileSync(filePath, JSON.stringify(colorData, null, 2), 'utf8');
        console.log(`Daten erfolgreich in ${filePath} gespeichert.`);
    } catch (err) {
        console.error('Fehler beim Speichern der JSON-Datei:', err);
    }
}
