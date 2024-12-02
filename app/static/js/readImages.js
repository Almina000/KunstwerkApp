const fs = require('fs');
const path = require('path');

const profileName = process.argv[2]; // Erwartet den Profilnamen als CLI-Argument

if (!profileName) {
  console.error('Kein Profilname angegeben! Das Skript benötigt einen Profilnamen.');
  process.exit(1);
}

// Der Pfad zum Ordner, den du durchsuchen möchtest
const directoryPath = path.join(__dirname, `../images/${profileName}_Pics`);
//const directoryPath = path.join(__dirname, 'static/images/lindt_germanyPics_new');

// Funktion zum Auslesen der Bilder
function listImages(dirPath) {
  let imagePaths = [];

  // Alle Dateien und Ordner im angegebenen Verzeichnis auslesen
  const files = fs.readdirSync(dirPath);

  files.forEach(file => {
    const fullPath = path.join(dirPath, file);

    // Prüfen, ob es sich um eine Datei handelt und ob die Dateiendung ein Bild ist
    if (fs.statSync(fullPath).isFile() && isImageFile(file)) {
      // Relativen Pfad zum 'static'-Ordner erstellen
      const relativePath = `static/images/${profileName}_Pics/${file}`;
      imagePaths.push(relativePath);
    }
  });

   // Den Pfad zu images.json relativ zu __dirname festlegen
   const outputFilePath = path.join(__dirname, `${profileName}_images.json`);
   fs.writeFileSync(outputFilePath, JSON.stringify(imagePaths, null, 2), 'utf-8');
   console.log('Die Datei images.json wurde erstellt!');
}

// Funktion zur Überprüfung, ob die Datei eine Bilddatei ist
function isImageFile(filename) {
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'];
  return imageExtensions.includes(path.extname(filename).toLowerCase());
}

// Die Funktion ausführen
listImages(directoryPath);
