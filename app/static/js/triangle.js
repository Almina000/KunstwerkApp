function drawTrianglesForHashtag(rectX, rectY, rectWidth, rectHeight, colors, surfaceAreas, shapes) {

    let goldenRatio = 0.618;
    let sides = ["top", "right", "bottom", "left"];
  
    // Berechne die Hauptachsen des Fibonacci-Rasters
    let x1 = rectX + rectWidth * goldenRatio;       // Vertikale Linie 1 BLAU
    let x2 = rectX + rectWidth * (1 - goldenRatio); // Vertikale Linie 2 ROT
    let y1 = rectY + rectHeight * goldenRatio;      // Horizontale Linie 3 LILA
    let y2 = rectY + rectHeight * (1 - goldenRatio);// Horizontale Linie 4 GRÜN
  
    // Zählt die Anzahl der gezeichneten Dreiecke auf den Fibonacci-Achsen
    let countOnFibonacciAxes = 0;
  
    for (let i = 0; i < shapes.length; i++) {
      if (shapes[i] === "triangle") {
        console.log(`Shape: ${shapes[i]}`);
        console.log(`A: ${surfaceAreas[i]}`);
        console.log(`Color: ${colors[i]}`);
        let area = surfaceAreas[i];
        let colorTri = colors[i];

        
        // Bestimme, ob das Dreieck auf den Fibonacci-Achsen oder zufällig gezeichnet werden soll
        if (countOnFibonacciAxes < 4) {
            
            let side = random(sides);
            // Zeichne das Dreieck auf den Fibonacci-Achsen
            let pointA = getRandomPointA(rectX, rectY, rectWidth, rectHeight, side);
            let pointB = getRandomPointB(side, x1, x2, rectX, rectY, rectWidth, rectHeight, y1, y2);
  
            let pointC = getPointC(pointA, pointB, area);
  
          fill(colorTri); // Farbe des Dreiecks
          noStroke();
          triangle(pointA.x, pointA.y, pointB.x, pointB.y, pointC.x, pointC.y);
  
          countOnFibonacciAxes++; // Zähle das Dreieck
        } else {
            drawRandomTriangle(rectX, rectY, rectWidth, rectHeight, surfaceArea, colorTri)
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
    let randomPoint;
  
    // Vertikale Linie 1: x1, rectY bis x1, rectY + rectHeight
    if (side === "right") {
      let y_c = random(rectY, rectY + rectHeight);  // Zufälliger y-Wert
      randomPoint = { x: x1, y: y_c };
    }
    
    // Vertikale Linie 2: x2, rectY bis x2, rectY + rectHeight
    else if (side === "left") {
      let y_c = random(rectY, rectY + rectHeight);  // Zufälliger y-Wert
      randomPoint = { x: x2, y: y_c };
    }
  
    // Horizontale Linie 3: rectX, y1 bis rectX + rectWidth, y1
    else if (side === "bottom") {
      let x_c = random(rectX, rectX + rectWidth);  // Zufälliger x-Wert
      randomPoint = { x: x_c, y: y1 };
    }
  
    // Horizontale Linie 4: rectX, y2 bis rectX + rectWidth, y2
    else if (side === "top") {
      let x_c = random(rectX, rectX + rectWidth);  // Zufälliger x-Wert
      randomPoint = { x: x_c, y: y2 };
    }
  
    return randomPoint;
  }

function getPointC(pointA, pointB, targetArea) {
    // Berechne den Abstand zwischen Punkt A und Punkt B
    let dx = pointB.x - pointA.x;
    let dy = pointB.y - pointA.y;
    let AB = Math.sqrt(dx * dx + dy * dy);  // Abstand AB

    // Berechne die Höhe des Dreiecks basierend auf der Fläche
    let height = (2 * targetArea) / AB;  // Höhe = Fläche / Basis

    // Berechne einen zufälligen Winkel für den dritten Punkt (z.B. senkrecht zur Linie AB)
    let angle = Math.atan2(dy, dx) + Math.PI / 2;  // 90° Drehung

    // Berechne den x- und y-Wert des dritten Punkts entlang des Abstands 'height'
    let pointC = {
        x: pointA.x + height * Math.cos(angle),
        y: pointA.y + height * Math.sin(angle)
    };

    return pointC;
}

function drawRandomTriangle(rectX, rectY, rectWidth, rectHeight, surfaceArea, color) {
    let area;
    let x1, y1, x2, y2, x3, y3;
  
    // Wiederhole, bis ein Dreieck mit der gewünschten Fläche gefunden wurde
    do {
      // Zufällige Punkte innerhalb des Rechtecks für die Dreieck-Eckpunkte
      x1 = random(rectX, rectX + rectWidth);
      y1 = random(rectY, rectY + rectHeight);
      x2 = random(rectX, rectX + rectWidth);
      y2 = random(rectY, rectY + rectHeight);
      x3 = random(rectX, rectX + rectWidth);
      y3 = random(rectY, rectY + rectHeight);
  
      // Berechne die Fläche des Dreiecks mit der Formel: |(x1(y2 − y3) + x2(y3 − y1) + x3(y1 − y2)) / 2|
      area = abs((x1 * (y2 - y3) + x2 * (y3 - y1) + x3 * (y1 - y2)) / 2);
    } while (abs(area - surfaceArea) > 1); // Schleife, bis die Fläche nahe genug ist
  
    // Zeichne das Dreieck
    fill(color); 
    noStroke();
    triangle(x1, y1, x2, y2, x3, y3);
  }
  
  