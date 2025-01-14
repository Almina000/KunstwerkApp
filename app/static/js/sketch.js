// sketch.js
//_______________________________________________________________________________
//VARIABLEN HOLEN
const shapeCounts = JSON.parse(localStorage.getItem("shapeCounts"));
if (!shapeCounts) {
  window.location.href = "index.html";
}
const { triangles, circles, rectangles } = shapeCounts;
console.log(`Dreiecke: ${triangles}, Kreise: ${circles}, Rechtecke: ${rectangles}`);

// const pixelColors = JSON.parse(localStorage.getItem("pixelColors"));

// if (!pixelColors) {
//     console.error('Keine Pixel-Farben gefunden. Bitte analysiere die Bilder zuerst.');
// } else {
//     console.log('Pixel-Farben:', pixelColors);
// }
const filterValue = localStorage.getItem('filter');

if (filterValue === 'true') {
  console.log('Filter ist aktiviert.');
} else if (filterValue === 'false') {
  console.log('Filter ist deaktiviert.');
} else {
  console.log('Filter-Zustand ist undefiniert oder nicht gesetzt.');
}

const sizeValue = parseFloat(localStorage.getItem('size'));
console.log('Größe:', sizeValue);

// sketch.js
const profileName = JSON.parse(localStorage.getItem("profileName"));
// const profileName = document.getElementById('profileName').getAttribute('data-profile');
console.log("Profilname von Flask:", profileName);  // Profilname in der Konsole ausgeben

const dataName = JSON.parse(localStorage.getItem("dataName"));
console.log("Dataname von Flask:", dataName);  // Profilname in der Konsole ausgeben

//___________________________________________________________________________________________

const canvasWidth = 768;
const canvasHeight = 1080;

const totalShapes = triangles + circles + rectangles;
console.log(`gesamt: ${totalShapes}`);

//let num = 10; //10

function preload() {
  customFont = loadFont('static/fonts/AbadiMT-ExtraLight.ttf');
}

function setup() {

  //Zeichne Leinwand
  createCanvas(canvasWidth, canvasHeight); 
  if (document.getElementById('artwork')) {
    canvas.parent('artwork');
  } else {
    console.error("Der Container 'artwork' existiert nicht im DOM.");
  }

  background(255);
  

  let rectWidth = canvasWidth * 0.6;
  let rectHeight = canvasHeight * 0.5;
  let rectX = (canvasWidth - rectWidth) / 2;
  let rectY = canvasHeight * 0.1;
  
  // Hintergrundfarbe nur für das Rechteck
  fill('#FFFFFF'); // Hellblauer Hintergrund innerhalb des Rechtecks
  noStroke(); // Kein Rand
  rect(rectX, rectY, rectWidth, rectHeight);

  noFill();
  stroke(0);
  rect(rectX, rectY, rectWidth, rectHeight);

  let topHashtags = [];

  if (profileName === "elbenwald") {
    switch (dataName) {
      case "Hashtag":
        topHashtags = elbenwald_hashtagData;
        break;
      case "Months":
        topHashtags = elbenwald_monthlyCounts;
        break;
      case "Weeks":
        topHashtags = elbenwald_weeklyCounts;
        break;
      case "Pixel":
        topHashtags = elbenwald_PixelData;
        break;
    }
  }else if (profileName == "google"){
    topHashtags = google_hashtagData
  }else if (profileName == "kulturcafezett9"){
    topHashtags = kulturcafezett9_hashtagData
  }else if (profileName == "cinecittamultiplexkino"){
    topHashtags = cinecittamultiplexkino_hashtagData
  }
  topHashtags = topHashtags
    .sort((a, b) => b.count - a.count)  // Sortiere nach count in absteigender Reihenfolge
    .slice(0, totalShapes);  // Schneide die obersten 'num' Elemente ab
  let totalTopCount = topHashtags.reduce((sum, hashtag) => sum + hashtag.count, 0);

  // if (topHashtags.length < num){
  //   num = topHashtags.length
  // }
  // Farben erstellen für jeden Hashtag, jetzt noch random
  //let colors = [];
  //for (let i = 0; i < num; i++) {
    //colors.push(color(random(100, 255), random(100, 255), random(100, 255)));
  //}
  
  
  let colors = [];  // Initialisiere das Array colors

  if (dataName == "Pixel") {
    colors = topHashtags.map(hashtag => hashtag.hashtag);
    console.log(colors);
  } else {
    // colors = [
    //   "#1E90FF",    // Blau
    //   "#FF4500",    // Rot-Orange
    //   "#FFD700",    // Gelb
    //   "#32CD32",    // Grün
    //   "#8A2BE2",    // Lila
    //   "#40E0D0",    // Türkis
    //   "#FF6347",    // Tomatenrot
    //   "#FF1493",    // Dunkles Pink
    //   "#4682B4",    // Stahlblau
    //   "#9370DB",    // Violett
    //   "#DC143C",    // Karmesinrot
    //   "#00FA9A",    // Mittelgrün
    //   "#8B0000",    // Dunkelrot
    //   "#00CED1",    // Türkisblau
    //   "#FF8C00",    // Dunkelorange
    //   "#228B22",    // Waldgrün
    //   "#FFDAB9",    // Pfirsich
    //   "#6A5ACD",    // Schieferblau
    //   "#B22222",    // Feuerrot
    //   "#7FFF00",    // Chartreuse
    //   "#DDA0DD",    // Pflaume
    //   "#FF7F50",    // Koralle
    //   "#6495ED",    // Kornblumenblau
    //   "#B8860B",    // Dunkelgoldbraun
    //   "#3CB371",    // Mittleres Grün
    //   "#C71585",    // Mittelpurpur
    //   "#40E0D0",    // Türkis
    //   "#E9967A",    // Lachsfarben
    //   "#8B008B",    // Dunkelmagenta
    //   "#00BFFF",    // Tiefes Himmelblau
    //   "#FA8072",    // Lachrot
    //   "#FF00FF"     // Magenta
      
    // ];
    colors = [
      "#D6EAF8", // Pastell-Babyblau
      "#B3E2E5", // Pastelltürkis
      "#CBAACB", // Pastelllila
      "#FFB7C5", // Pastellpink
      "#779ECB", // Pastellstahlblau
      "#D4A4E3", // Pastellviolett
      "#FFDAC1", // Pastellpfirsich
      "#ACE5EE", // Pastelltürkisblau
      "#E6CFE3", // Pastellpflaume
      // Ergänzende Farben
      "#FFB347", // Pastellorange
      "#FDFD96", // Pastellgelb
      "#FF6961", // Pastellrot
      "#E66666", // Pastellkarmesinrot
      "#77DD77", // Pastellgrün
      "#B5EAD7", // Pastellmittelgrün
      "#C26E60", // Pastelldunkelrot
      "#D8F5A2", // Pastellchartreuse
      "#FFA07A", // Pastellkoralle
      "#B0DFFB", // Pastellkornblumenblau
      "#E8D2A3", // Pastelldunkelgoldbraun
      "#95D3A2", // Pastellmittleres Grün
      "#E2A7C9", // Pastellmittelpurpur
      "#A4DFE7", // Pastelltürkis
      "#FFC8B2", // Pastellsalmonfarben
      "#C38EC7", // Pastelldunkelmagenta
      "#89CFF0", // Pastelltiefes Himmelblau
      "#FADADD", // Pastelllachrot
      "#F2C8E6"  // Pastellmagenta
    ];
    
    // colors = [
    //   "#F5A6C8", // Sanftes, leuchtendes Pink
    //   "#A0D1D7", // Mildes Türkis
    //   "#F4C6D7", // Pastelliges Pink mit Pfirsichhauch
    //   "#7BCFD3", // Kräftiges, sanftes Türkis
    //   "#F4A8D8", // Intensiverer Pinkton
    //   "#6CC8D3", // Frisches, leuchtendes Türkis
    //   "#F7B1C6", // Warmer, weicher Pinkton
    //   "#90D4D8", // Ruhiges, blasses Türkis
    //   "#F7B7D7", // Zartes, fast Pfirsichfarbenes Pink
    //   "#63B8B2", // Tiefes, beruhigendes Türkis
    // ];
    // colors = [
    //   "#FFFFFF", // Reines Weiß
    //   "#D3D3D3", // Helles Grau
    //   "#A9A9A9", // Dunkelgrau
    //   "#FFD700", // Klassisches Gold
    //   "#F5F5F5", // Sanftes, warmes Weiß
    //   "#BEBEBE", // Mittleres Grau
    //   "#FFCC00", // Heller Goldton
    //   "#FAFAFA", // Fast Weiß mit Grauton
    //   "#808080", // Neutralgrau
    //   "#C0B200", // Gedämpfter Goldton
    // ];
    
    
    
  }
  
  // Zeichne die Legende unter dem Rechteck
  let legendX1 = rectX; // Linker Block
  let legendX2 = rectX + rectWidth / 2 + 20; // Rechter Block
  let legendY = rectY + rectHeight + 50; // Höhe unter dem Rechteck

  textFont(customFont);
  textSize(16);
  textAlign(LEFT, CENTER);

  let leftCount = Math.ceil(totalShapes / 2); // Anzahl der Hashtags links
  let rightCount = Math.floor(totalShapes / 2); // Anzahl der Hashtags rechts
  
  // Zeichne die ersten 5 Hashtags im linken Block
  for (let index = 0; index < Math.min(leftCount, topHashtags.length); index++) {
    fill(colors[index]);
    noStroke();
    ellipse(legendX1 + 10, legendY + index * 30 + 10, 20, 20); // Kreise statt Rechtecke

    fill(0); // Textfarbe schwarz
    textSize(16); // Schriftgröße anpassen, falls nötig
    textFont(customFont); // Schriftart (stelle sicher, dass customFont geladen wird)
    text(topHashtags[index].hashtag, legendX1 + 30, legendY + index * 30 + 10);
  }

  // Rechter Block
  for (let index = 0; index < Math.min(rightCount, topHashtags.length - leftCount); index++) {
    let hashtagIndex = leftCount + index; // Index im gesamten Array
    fill(colors[hashtagIndex]);
    noStroke();
    ellipse(legendX2 + 10, legendY + index * 30 + 10, 20, 20); // Kreise statt Rechtecke

    fill(0); // Textfarbe schwarz
    textSize(16); // Schriftgröße anpassen, falls nötig
    textFont(customFont); // Schriftart (stelle sicher, dass customFont geladen wird)
    text(topHashtags[hashtagIndex].hashtag, legendX2 + 30, legendY + index * 30 + 10);
  }

  ///////////////////////////////////////////////////
  //TEST Fibonacci Raster
  let goldenRatio = 0.618;
  // Berechne die Hauptachsen des Fibonacci-Rasters
  let x1 = rectX + rectWidth * goldenRatio;       // Vertikale Linie 1
  let x2 = rectX + rectWidth * (1 - goldenRatio); // Vertikale Linie 2
  let y1 = rectY + rectHeight * goldenRatio;      // Horizontale Linie 1
  let y2 = rectY + rectHeight * (1 - goldenRatio);// Horizontale Linie 2

   // Vertikale Linie 1 (blau)
  stroke(0, 0, 255); // Blau
  line(x1, rectY, x1, rectY + rectHeight);

// Vertikale Linie 2 (rot)
  stroke(255, 0, 0); // Rot
  line(x2, rectY, x2, rectY + rectHeight);

// Horizontale Linie 1 (lila)
  stroke(128, 0, 128); // Lila
  line(rectX, y1, rectX + rectWidth, y1);

// Horizontale Linie 2 (grün)
  stroke(0, 255, 0); // Grün
  line(rectX, y2, rectX + rectWidth, y2);
  ////////////////////////////////////////////////////////////////

  // Funktion aufrufen
  
  let shapes = predictShape(totalShapes, triangles, circles, rectangles);
  let surfaceAreas = calculateSurfaceArea(rectWidth, rectHeight, topHashtags, totalTopCount, sizeValue);
  //drawPoints(rectX, rectY, rectWidth, rectHeight);
  console.log(`ShapeArray Kreis: ${shapes}`);
  drawCircleForHashtag(rectX, rectY, rectWidth, rectHeight, colors, surfaceAreas, shapes, filterValue);
  console.log(`ShapeArray Dreieck: ${shapes}`);
  drawTrianglesForHashtag(rectX, rectY, rectWidth, rectHeight, colors, surfaceAreas, shapes);
  console.log('Rechtecke werden gezeichnet');
  drawRectanglesForHashtag(rectX, rectY, rectWidth, rectHeight, colors, surfaceAreas, shapes);
   
}

//FUNKTIONEN
