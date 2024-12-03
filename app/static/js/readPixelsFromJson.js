
// Hauptfunktion für die Farbanalyse
async function analyzeColors() {
    const profileName = process.argv[2]; // Erwartet den Profilnamen als CLI-Argument

    console.log('ProfilName readPixels', profileName);

    if (!profileName) {
      console.error('Kein Profilname angegeben! Das Skript benötigt einen Profilnamen.');
      process.exit(1);
    }

    console.log("analyzeColors() gestartet.");
    const jsonFile = `/static/js/${profileName}_images.json`; // Pfad zur JSON-Datei mit Bildpfaden
    //const outputElement = document.getElementById('output');

    // Lade die JSON-Datei mit Bildpfaden
    console.log("Vor dem Laden der Datei");
    const response = await fetch(jsonFile);
    console.log("Nach dem Laden der Datei");

    if (!response.ok) {
        //outputElement.textContent = 'Fehler: JSON-Datei konnte nicht geladen werden.';
        console.log("Fehler: JSON-Datei konnte nicht geladen werden.");
        return;
    }

    const files = await response.json(); // Bildliste aus JSON-Datei
    const colorData = {};
    console.log('clolorFiles:', files);


    for (const file of files) {
        console.log('clolorFile in for:', file);
        console.log('hallooooo:');
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
                console.log('Aktuelle Farbanalyse für Datei:', file, colorData[file]);
                resolve();
            };
        });
    }

    // const pixelData = [];
    // for (const color in colorData) {
    //     pixelData.push({ Color: color, count: colorData[color] });
    // }

    // // Erstelle den JavaScript-Code
    // const jsContent = `const pixelData = ${JSON.stringify(pixelData, null, 2)};`;

    // // Ausgabe des Codes in der Konsole (zum Kopieren)
    // console.log(jsContent);

    try {
        // Speichern der Daten im localStorage
        localStorage.setItem("pixelColors", JSON.stringify(colorData));
        const jsonOutput = JSON.stringify(colorData, null, 2);
        console.log("Pixel-Farben gespeichert:", colorData);
        console.log('keine lust mehr');
        console.log('Pixel-Farben:', jsonOutput);
    } catch (error) {
        console.error("Fehler beim Ausführen der letzten Logs:", error);
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

// Event-Listener für den Button
// document.getElementById('analyzeButton').addEventListener('click', analyzeColors);
//document.getElementById('pixelColorButton').addEventListener('click', analyzeColors);
