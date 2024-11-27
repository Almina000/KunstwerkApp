let seedPoints = [];
let delaunay;


// const mode = getModeFromURL();
// // Hier kann der Modus weiterverwendet werden
// if (mode === 'random') {
//     // Logik für den "random"-Modus
// } else if (mode === 'häufigkeit') {
//     // Logik für den "häufigkeit"-Modus
// }
// console.log(`Modus: ${mode}`);

const mode = "random";

//const num = 10; // Anzahl der Top-Hashtags, die betrachtet werden sollen
let topHashtags = hashtagData
  .sort((a, b) => b.count - a.count)
  //.slice(0, num); // Wähle die Top `num` Hashtags
let maxCount = Math.max(...topHashtags.map(hashtag => hashtag.count));
// Die Anzahl der Punkte entspricht der Anzahl der Top-Hashtags
console.log("topHashtags.length:", topHashtags.length);


function setup() {
  createCanvas(400, 400);

  if (mode === 'random') {
    // Generiere zufällige Punkte
    for (let i = 0; i < topHashtags.length; i++) {
      seedPoints[i] = createVector(random(width), random(height));
    }
  } else if (mode === 'häufigkeit') {
    // Punkte basierend auf Häufigkeit verteilen
    for (let i = 0; i < topHashtags.length; i++) {
      let x = random(width); // Zufällige X-Position
      let y = map(topHashtags[i].count, 0, maxCount, height, 0); // Y basierend auf Häufigkeit
      seedPoints[i] = createVector(x, y);
    }
  }

  // Berechne die Delaunay-Triangulation
  delaunay = calculateDelaunay(seedPoints);
  noLoop();
}

function draw() {
  background(255);

  // Zeichne die Punkte
  for (let v of seedPoints) {
    stroke(0);
    strokeWeight(4);
    point(v.x, v.y);
  }

  // Definiere die Farbpalette
  const colorPalette = ['#003B46', '#07575B', '#66A5AD', '#C4DFE6'];

  // Zeichne die Dreiecke mit zufälligen Farben
  let { points, triangles } = delaunay;

  for (let i = 0; i < triangles.length; i += 3) {
    let a = 2 * triangles[i];
    let b = 2 * triangles[i + 1];
    let c = 2 * triangles[i + 2];

    // Wähle eine zufällige Farbe aus der Palette
    let randomColor = colorPalette[int(random(colorPalette.length))];

    // Zeichne das Dreieck
    fill(randomColor);
    stroke(0);
    strokeWeight(1);
    triangle(
      points[a],
      points[a + 1],
      points[b],
      points[b + 1],
      points[c],
      points[c + 1]
    );
  }
}

function getModeFromURL() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('mode') || 'random'; // Standardwert: 'random'
}

function calculateDelaunay(points) {
  let pointsArray = [];
  
 
  for (let v of points) {
    pointsArray.push(v.x, v.y);
  }
  return new d3.Delaunay(pointsArray);
}
