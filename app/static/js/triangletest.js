function drawTrianglesForHashtag(rectX, rectY, rectWidth, rectHeight, colors, surfaceAreas, shapes) {

    let goldenRatio = 0.618;
    let sides = ["top", "right", "bottom", "left"];
  
    // Berechne die Hauptachsen des Fibonacci-Rasters
    let x1 = rectX + rectWidth * goldenRatio;       // Vertikale Linie 1 BLAU
    let x2 = rectX + rectWidth * (1 - goldenRatio); // Vertikale Linie 2 ROT
    let y1 = rectY + rectHeight * goldenRatio;      // Horizontale Linie 3 LILA
    let y2 = rectY + rectHeight * (1 - goldenRatio);// Horizontale Linie 4 GRÜN
  
    // Zählt die Anzahl der gezeichneten Dreiecke auf den Fibonacci-Achsen
   
    for (let i = 0; i < shapes.length; i++) {
        if (shapes[i] === "triangle") {
            console.log(`Shape: ${shapes[i]}`);
            console.log(`A: ${surfaceAreas[i]}`);
            console.log(`Color: ${colors[i]}`);
            let area = surfaceAreas[i];
            let colorTri = colors[i];

            let side = random(sides);

            const index = sides.indexOf(side);
            
            console.log(`Nach dem Entfernen: ${sides}`);

            if (sides.length > 0) {
            // Zeichne das Dreieck auf den Fibonacci-Achsen
                let pointA = getRandomPointA(rectX, rectY, rectWidth, rectHeight, side);
                // fill(0, 0, 255); // RGB-Werte für Blau (R=0, G=0, B=255)
                // noStroke();      // Kein Rand um den Punkt (optional)
                // ellipse(pointA.x, pointA.y, 5, 5); // kleiner Kreis mit Radius 5

                let pointB = getRandomPointB(side, x1, x2, rectX, rectY, rectWidth, rectHeight, y1, y2);
                // fill(0, 255, 0); // RGB-Werte für Blau (R=0, G=0, B=255)
                // noStroke();      // Kein Rand um den Punkt (optional)
                // ellipse(pointB.x, pointB.y, 5, 5); // kleiner Kreis mit Radius 5
  
                let pointC = getPointC(pointA, pointB, area, rectX, rectY, rectWidth, rectHeight);
                // fill(255, 0, 0); // RGB-Werte für Blau (R=0, G=0, B=255)
                // noStroke();      // Kein Rand um den Punkt (optional)
                // ellipse(pointC.x, pointC.y, 5, 5); // kleiner Kreis mit Radius 5

                fill(colorTri); // Farbe des Dreiecks
                noStroke();
                triangle(pointA.x, pointA.y, pointB.x, pointB.y, pointC.x, pointC.y);

                if (index > -1) {
                    sides.splice(index, 1); // Entfernt das Element an der Stelle `index`
                }
            } else {
                drawRandomTriangle(rectX, rectY, rectWidth, rectHeight, area, colorTri)
            }
        }
    }
}

function getRandomPointA(rectX, rectY, rectWidth, rectHeight, side) {
    let point = {};
    
    if (side === "top") {
      point.x = random(rectX, rectX + rectWidth);
      point.y = rectY;
    } else if (side === "right") {
      point.x = rectX + rectWidth;
      point.y = random(rectY, rectY + rectHeight);
    } else if (side === "bottom") {
      point.x = random(rectX, rectX + rectWidth);
      point.y = rectY + rectHeight;
    } else if (side === "left") {
      point.x = rectX;
      point.y = random(rectY, rectY + rectHeight);
    }
    
    return point;
}

function getRandomPointB(side, x1, x2, rectX, rectY, rectWidth, rectHeight, y1, y2) {
    let point = {};
    console.log(`${side}, ${x1}, ${x2}, ${rectX}, ${rectY}, ${rectWidth}, ${rectHeight}, ${y1}, ${y2}`);
    // Vertikale Linie 1: x1, rectY bis x1, rectY + rectHeight
    if (side === "right") {
        let y_c = random(rectY, rectY + rectHeight);  // Zufälliger y-Wert
        point.x = x1;
        point.y = y_c;
        console.log(`X: ${point.x}`);
        console.log(`Y: ${point.y}`);
    }
    
    // Vertikale Linie 2: x2, rectY bis x2, rectY + rectHeight
    else if (side === "left") {
        let y_c = random(rectY, rectY + rectHeight);  // Zufälliger y-Wert
        point.x = x2;
        point.y = y_c;
        console.log(`X: ${point.x}`);
        console.log(`Y: ${point.y}`);
    }
  
    // Horizontale Linie 3: rectX, y1 bis rectX + rectWidth, y1
    else if (side === "bottom") {
        let x_c = random(rectX, rectX + rectWidth);  // Zufälliger x-Wert
        point.x = x_c;
        point.y = y1;
        console.log(`X: ${point.x}`);
        console.log(`Y: ${point.y}`);
    }
  
    // Horizontale Linie 4: rectX, y2 bis rectX + rectWidth, y2
    else if (side === "top") {
        let x_c = random(rectX, rectX + rectWidth);
        point.x = x_c;
        point.y = y2;  
        console.log(`X: ${point.x}`);
        console.log(`Y: ${point.y}`);
    }
  
    return point;
}

function getPointC(pointA, pointB, targetArea, rectX, rectY, rectWidth, rectHeight) {
    // Berechne den Abstand zwischen Punkt A und Punkt B
    let dx = pointB.x - pointA.x;
    let dy = pointB.y - pointA.y;
    let AB = Math.sqrt(dx * dx + dy * dy);  // Abstand AB

    // Berechne die Höhe des Dreiecks basierend auf der Fläche
    let height = (2 * targetArea) / AB;  // Höhe = Fläche / Basis

    // Berechne einen zufälligen Winkel für den dritten Punkt (z.B. senkrecht zur Linie AB)
    let angle = Math.atan2(dy, dx) + Math.PI / 2;  // 90° Drehung

    let x = pointA.x + height * Math.cos(angle);
    let y = pointA.y + height * Math.sin(angle);
    // Berechne den x- und y-Wert des dritten Punkts entlang des Abstands 'height'
    let pointC = {
        x: Math.max(rectX, Math.min(x, rectX + rectWidth)),
        y: Math.max(rectY, Math.min(y, rectY + rectHeight))
    };

    return pointC;
}

function drawRandomTriangle(rectX, rectY, rectWidth, rectHeight, surfaceArea, color) {
    let area;
    let x1, y1, x2, y2, x3, y3;
  
    // Wiederhole, bis ein Dreieck mit der gewünschten Fläche gefunden wurde
    do {
        // Zufällige Punkte innerhalb des Rechtecks für die Dreieck-Eckpunkte
        x1 = Math.random() * rectWidth + rectX;
        y1 = Math.random() * rectHeight + rectY;
        x2 = Math.random() * rectWidth + rectX;
        y2 = Math.random() * rectHeight + rectY;
        x3 = Math.random() * rectWidth + rectX;
        y3 = Math.random() * rectHeight + rectY;
  
        // Berechne die Fläche des Dreiecks mit der Formel: |(x1(y2 − y3) + x2(y3 − y1) + x3(y1 − y2)) / 2|
        area = Math.abs((x1 * (y2 - y3) + x2 * (y3 - y1) + x3 * (y1 - y2)) / 2);
    } while (Math.abs(area - surfaceArea) > 1); // Schleife, bis die Fläche nahe genug ist
  
    // Zeichne das Dreieck
    fill(color); // Setzt die Farbe des Dreiecks
    noStroke();
    triangle(x1, y1, x2, y2, x3, y3);
}

  
