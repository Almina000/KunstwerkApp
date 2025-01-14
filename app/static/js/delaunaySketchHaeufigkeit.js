let seedPoints = [];
let delaunay;

const profileName = JSON.parse(localStorage.getItem("profileName"));
console.log("Profilname von Flask:", profileName);  // Profilname in der Konsole ausgeben

const dataName = JSON.parse(localStorage.getItem("dataName"));
console.log("Dataname von Flask:", dataName);  // Dataname in der Konsole ausgeben

// Farbpalette aus localStorage abrufen
const storedPalette = localStorage.getItem('selectedColorPalette');
let colorPalette = [];
if (storedPalette) {
    colorPalette = JSON.parse(storedPalette);
    console.log('Gespeicherte Farbpalette:', colorPalette);
} else {
    console.error('Keine Farbpalette im localStorage gefunden.');
    // Eine Standardpalette verwenden, falls keine gespeichert ist
    colorPalette = ['#003B46', '#07575B', '#66A5AD', '#C4DFE6'];
}

const mode = "häufigkeit";

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
} else if (profileName == "google") {
    topHashtags = google_hashtagData;
} else if (profileName == "kulturcafezett9") {
    topHashtags = kulturcafezett9_hashtagData;
} else if (profileName == "cinecittamultiplexkino") {
    topHashtags = cinecittamultiplexkino_hashtagData;
}

topHashtags = topHashtags
    .sort((a, b) => b.count - a.count);

let maxCount = Math.max(...topHashtags.map(hashtag => hashtag.count));
console.log("topHashtags.length:", topHashtags.length);

function setup() {
    createCanvas(400, 400);

    if (mode === 'random') {
        for (let i = 0; i < topHashtags.length; i++) {
            seedPoints[i] = createVector(random(width), random(height));
        }
    } else if (mode === 'häufigkeit') {
        for (let i = 0; i < topHashtags.length; i++) {
            let x = random(width); 
            let y = map(topHashtags[i].count, 0, maxCount, height, 0);
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

    // Zeichne die Dreiecke mit Farben aus der Farbpalette
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
