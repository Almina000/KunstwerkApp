// sketch.js

const shapeCounts = JSON.parse(localStorage.getItem("shapeCounts"));
if (!shapeCounts) {
  window.location.href = "index.html";
}
const { triangles, circles, rectangles } = shapeCounts;
console.log(`Dreiecke: ${triangles}, Kreise: ${circles}, Rechtecke: ${rectangles}`);

const pixelColors = JSON.parse(localStorage.getItem("pixelColors"));

if (!pixelColors) {
    console.error('Keine Pixel-Farben gefunden. Bitte analysiere die Bilder zuerst.');
} else {
    console.log('Pixel-Farben:', pixelColors);
}

const canvasWidth = 768;
const canvasHeight = 1080;

const number = triangles + circles + rectangles;
console.log(`gesamt: ${number}`);
const num = 10;

function preload() {
  customFont = loadFont('static/fonts/AbadiMT-ExtraLight.ttf');
}

function setup() {

  //Zeichne Leinwand
  createCanvas(canvasWidth, canvasHeight); 
  background(255);

  let rectWidth = canvasWidth * 0.6;
  let rectHeight = canvasHeight * 0.5;
  let rectX = (canvasWidth - rectWidth) / 2;
  let rectY = canvasHeight * 0.1;
  
  noFill();
  stroke(0);
  rect(rectX, rectY, rectWidth, rectHeight);

  // Sortiere nach 'count' und nimm die obersten 10 Hashtags
  let topHashtags = hashtagData
    .sort((a, b) => b.count - a.count)
    .slice(0, num);

  let totalTopCount = topHashtags.reduce((sum, hashtag) => sum + hashtag.count, 0);

  // Farben erstellen für jeden Hashtag, jetzt noch random
  //let colors = [];
  //for (let i = 0; i < num; i++) {
    //colors.push(color(random(100, 255), random(100, 255), random(100, 255)));
  //}
  let colors = [
    "#1E90FF",  // Blau
    "#FF4500",  // Rot-Orange
    "#FFD700",  // Gelb
    "#32CD32",  // Grün
    "#8A2BE2",  // Lila
    "#40E0D0",  // Türkis
    "#FF6347",  // Tomatenrot
    "#FF1493",  // Dunkles Pink
    "#4682B4",  // Stahlblau
    "#9370DB"   // Violett
];

  // Zeichne die Legende unter dem Rechteck
  let legendX1 = rectX; // Linker Block
  let legendX2 = rectX + rectWidth / 2 + 20; // Rechter Block
  let legendY = rectY + rectHeight + 50; // Höhe unter dem Rechteck

  textFont(customFont);
  textSize(16);
  textAlign(LEFT, CENTER);

  let leftCount = Math.ceil(number / 2); // Anzahl der Hashtags links
  let rightCount = Math.floor(number / 2); // Anzahl der Hashtags rechts
  
  // Zeichne die ersten 5 Hashtags im linken Block
  for (let index = 0; index < leftCount; index++) {
    fill(colors[index]);
    noStroke();
    //rect(legendX1, legendY + index * 30, 20, 20);
    ellipse(legendX1 + 10, legendY + index * 30 + 10, 20, 20); // Kreise statt Rechtecke

    fill(0);
    text(topHashtags[index].hashtag, legendX1 + 30, legendY + index * 30 + 10);
}

// Rechter Block
for (let index = 0; index < rightCount; index++) {
    let hashtagIndex = leftCount + index; // Index im gesamten Array
    fill(colors[hashtagIndex]);
    noStroke();
    //rect(legendX2, legendY + index * 30, 20, 20);
    ellipse(legendX2 + 10, legendY + index * 30 + 10, 20, 20); // Kreise statt Rechtecke


    fill(0);
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
 // stroke(0, 0, 255); // Blau
  //line(x1, rectY, x1, rectY + rectHeight);

// Vertikale Linie 2 (rot)
  //stroke(255, 0, 0); // Rot
  //line(x2, rectY, x2, rectY + rectHeight);

// Horizontale Linie 1 (lila)
  //stroke(128, 0, 128); // Lila
  //line(rectX, y1, rectX + rectWidth, y1);

// Horizontale Linie 2 (grün)
  //stroke(0, 255, 0); // Grün
  //line(rectX, y2, rectX + rectWidth, y2);
  ////////////////////////////////////////////////////////////////

  // Funktion aufrufen
  let shapes = predictShape(num, triangles, circles, rectangles);
  let surfaceAreas = calculateSurfaceArea(rectWidth, rectHeight, topHashtags,  totalTopCount);
  //drawPoints(rectX, rectY, rectWidth, rectHeight);
  console.log(`ShapeArray Kreis: ${shapes}`);
  drawCircleForHashtag(rectX, rectY, rectWidth, rectHeight, colors, surfaceAreas, shapes);
  console.log(`ShapeArray Dreieck: ${shapes}`);
  drawTrianglesForHashtag(rectX, rectY, rectWidth, rectHeight, colors, surfaceAreas, shapes);
  drawRectanglesForHashtag(rectX, rectY, rectWidth, rectHeight, colors, surfaceAreas, shapes);
   
}

//FUNKTIONEN
