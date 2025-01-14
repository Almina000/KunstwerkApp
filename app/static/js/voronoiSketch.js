let seedPoints = [];
let delaunay;

//const num = 10; // Anzahl der Top-Hashtags, die betrachtet werden sollen
let topHashtags = elbenwald_hashtagData
  .sort((a, b) => b.count - a.count)
  //.slice(0, num); // Wähle die Top `num` Hashtags
let maxCount = Math.max(...topHashtags.map(hashtag => hashtag.count));
// Die Anzahl der Punkte entspricht der Anzahl der Top-Hashtags
console.log("topHashtags.length:", topHashtags.length);


function setup() {
  createCanvas(400, 400);

  for (let i = 0; i < topHashtags.length; i++) {
    seedPoints[i] = createVector(random(width), random(height));
  }

  // Berechne die Delaunay-Triangulation
  delaunay = calculateDelaunay(seedPoints);
  noLoop();
}

function draw() {
  background(255);

  // Definiere die Farbpalette
  //const colorPalette = ['#003B46', '#07575B', '#66A5AD', '#C4DFE6'];
  //const colorPalette = ['#375E97', '#FB6542', '#FFBB00', '#3F681C'];
  const colorPalette = ['#98DBC6', '#5BC8AC', '#E6D72A', '#F18D9E'];

  let voronoi = delaunay.voronoi([0, 0, width, height]);
  let polygons = voronoi.cellPolygons();
  for (let poly of polygons){
    console.log(poly);
    beginShape();
    for (let i = 0; i < poly.length; i++){
      let randomColor = colorPalette[int(random(colorPalette.length))];
      stroke(0);
      strokeWeight(2);
      vertex(poly[i][0], poly[i][1]);
      fill(randomColor);
    }
    endShape();
    
  }

  //noLoop();

}


function calculateDelaunay(points) {
  let pointsArray = [];
  
 
  for (let v of points) {
    pointsArray.push(v.x, v.y);
  }
  return new d3.Delaunay(pointsArray);
}
