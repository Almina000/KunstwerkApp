const fs = require('fs');
const path = require('path');

// Der Pfad zum Ordner, den du durchsuchen möchtest
const directoryPath = path.join(__dirname, '../images/soko_tierschutzPics_new');
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
      const relativePath = 'static/images/soko_tierschutzPics_new/' + file;
      imagePaths.push(relativePath);
    }
  });

   // Den Pfad zu images.json relativ zu __dirname festlegen
   const outputFilePath = path.join(__dirname, 'images.json');
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
