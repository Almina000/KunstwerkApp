let points = [];
let delaunay, voronoi;

const x = 20; // Anzahl der Top-Hashtags
let topHashtags = elbenwald_hashtagData
  .sort((a, b) => b.count - a.count)
  .slice(0, x); // Wähle die Top 10 Hashtags
let maxCount = Math.max(...topHashtags.map(hashtag => hashtag.count));
let minCount = Math.min(...topHashtags.map(hashtag => hashtag.count));

function setup() {
  createCanvas(600, 600);
  for (let i = 0; i < topHashtags.length; i++) {
    let x = random(width);
    let y = random(height);
    points.push(createVector(x, y));
  }

  delaunay = calculateDelaunay(points);
  voronoi = delaunay.voronoi([0, 0, width, height]);
}

function draw() {
  background(255);

  // Zeige die Punkte, skaliert nach `count`
  for (let i = 0; i < points.length; i++) {
    let hashtag = topHashtags[i];
    let weight = map(hashtag.count, minCount, maxCount, 20, 100); // Größere Gewichtung
    fill(map(weight, 5, 50, 50, 200), 100, 200, 150); // Farbgebung basierend auf Gewicht
    noStroke();
    ellipse(points[i].x, points[i].y, weight, weight);
  }

  // Zeichne die Voronoi-Zellen
  let polygons = voronoi.cellPolygons();
  let cells = Array.from(polygons);

  for (let poly of cells) {
    stroke(0);
    strokeWeight(1);
    noFill();
    beginShape();
    for (let i = 0; i < poly.length; i++) {
      vertex(poly[i][0], poly[i][1]);
    }
    endShape();
  }

  let centroids = [];
  for (let poly of cells) {
    let area = 0;
    let centroid = createVector(0, 0);
    for (let i = 0; i < poly.length; i++) {
      let v0 = poly[i];
      let v1 = poly[(i + 1) % poly.length];
      let crossValue = v0[0] * v1[1] - v1[0] * v0[1];
      area += crossValue;
      centroid.x += (v0[0] + v1[0]) * crossValue;
      centroid.y += (v0[1] + v1[1]) * crossValue;
    }
    area /= 2;
    centroid.div(6 * area);
    centroids.push(centroid);
  }

  // Verschiebe Punkte stärker basierend auf `count`
  for (let i = 0; i < points.length; i++) {
    let hashtag = topHashtags[i];
    let weight = map(hashtag.count, minCount, maxCount, 1, 5); // Gewichtung erhöht
    points[i].lerp(centroids[i], weight * 0.1); // Mehr Bewegung Richtung Schwerpunkt
  }

  // Aktualisiere Voronoi-Diagramm
  delaunay = calculateDelaunay(points);
  voronoi = delaunay.voronoi([0, 0, width, height]);
}

// Berechnung des Delaunay-Diagramms
function calculateDelaunay(points) {
  let pointsArray = [];
  for (let v of points) {
    pointsArray.push(v.x, v.y);
  }
  return new d3.Delaunay(pointsArray);
}
