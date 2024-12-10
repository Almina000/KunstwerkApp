function drawRectanglesForHashtag(rectX, rectY, rectWidth, rectHeight, colors, surfaceAreas, shapes){
    
    console.log('RechteckeFunktion innen');
    console.log("Formen:", shapes);
    let goldenRatio = 0.618;
    let sides = ["top", "right", "bottom", "left"];
  
    // Berechne die Hauptachsen des Fibonacci-Rasters
    let blueLine = rectX + rectWidth * goldenRatio;       // Vertikale Linie 1 BLAU
    let redLine = rectX + rectWidth * (1 - goldenRatio); // Vertikale Linie 2 ROT
    let lilaLine = rectY + rectHeight * goldenRatio;      // Horizontale Linie 3 LILA
    let greenLine = rectY + rectHeight * (1 - goldenRatio);// Horizontale Linie 4 GRÜN

    // Punktdefinitionen für die Linien/Schnittstellen
    const pointTopBlue = { x: blueLine, y: rectY }; 
    const pointBottomBlue = { x: blueLine, y: rectY + rectHeight };

    const pointTopRed = { x: redLine, y: rectY }; 
    const pointBottomRed = { x: redLine, y: rectY + rectHeight };

    const pointLeftLila = { x: rectX, y: lilaLine }; 
    const pointRightLila = { x: rectX + rectWidth, y: lilaLine };

    const pointLeftGreen = { x: rectX, y: greenLine }; 
    const pointRightGreen = { x: rectX + rectWidth, y: greenLine };
    
    // Einfärben der Schnittpunkte als Ellipsen
    // fill(0, 0, 255); // Blau für den oberen Punkt der blauen Linie
    // ellipse(pointTopBlue.x, pointTopBlue.y, 30, 30); // Punkt oben (Blaue Linie)

    // fill(0, 0, 255); // Blau für den unteren Punkt der blauen Linie
    // ellipse(pointBottomBlue.x, pointBottomBlue.y, 30, 30); // Punkt unten (Blaue Linie)

    // fill(255, 0, 0); // Rot für den oberen Punkt der roten Linie
    // ellipse(pointTopRed.x, pointTopRed.y, 30, 30); // Punkt oben (Rote Linie)

    // fill(255, 0, 0); // Rot für den unteren Punkt der roten Linie
    // ellipse(pointBottomRed.x, pointBottomRed.y, 30, 30); // Punkt unten (Rote Linie)

    // fill(138, 43, 226); // Lila für den linken Punkt der lila Linie
    // ellipse(pointLeftLila.x, pointLeftLila.y, 30, 30); // Punkt links (Lila Linie)

    // fill(138, 43, 226); // Lila für den rechten Punkt der lila Linie
    // ellipse(pointRightLila.x, pointRightLila.y, 30, 30); // Punkt rechts (Lila Linie)

    // fill(0, 255, 0); // Grün für den linken Punkt der grünen Linie
    // ellipse(pointLeftGreen.x, pointLeftGreen.y, 30, 30); // Punkt links (Grüne Linie)

    // fill(0, 255, 0); // Grün für den rechten Punkt der grünen Linie
    // ellipse(pointRightGreen.x, pointRightGreen.y, 30, 30); // Punkt rechts (Grüne Linie)

    let deltaHorizontal = rectWidth * 0.15; // 10% der Breite für horizontale Linien
    let deltaVertical = rectHeight * 0.15;   // 10% der Höhe für vertikale Linien


    for (let i = 0; i < shapes.length; i++) {
        if (shapes[i] === "rectangle") {

            console.log("Aktuelle Form:", shapes[i]);
            console.log("Farbe:", colors[i]);
            console.log("Fläche:", surfaceAreas[i]);
           

            let area = surfaceAreas[i];
            let color = colors[i];

            let side = random(sides);
            console.log("Seite:", side);
            if (side === "top") {
                drawRectangleTop(deltaVertical, rectX, rectY, rectWidth, rectHeight, pointLeftGreen, pointRightGreen, area, color);
            } else if (side === "right") {
                drawRectangleRight(deltaHorizontal, rectX, rectY, rectWidth, rectHeight, pointTopBlue, pointBottomBlue, area, color);
            } else if (side === "bottom") {
                drawRectangleBottom(deltaVertical, rectX, rectY, rectWidth, rectHeight, pointLeftLila, pointRightLila, area, color);
            } else if (side === "left") {
                drawRectangleLeft(deltaHorizontal, rectX, rectY, rectWidth, rectHeight, pointTopRed, pointBottomRed, area, color);
            }
            
            
        }
    
    }

}


function drawRectangleRight(deltaHorizontal, rectX, rectY, rectWidth, rectHeight, pointTopBlue, pointBottomBlue, area, color) {

    const randomTopBlue = getRandomPointOnHorizontalLine(pointTopBlue, rectX, rectX + rectWidth, deltaHorizontal);
    const randomBottomBlue = getRandomPointOnHorizontalLine(pointBottomBlue, rectX, rectX + rectWidth, deltaHorizontal);

    let height = Math.abs(rectY + rectHeight - rectY);

    // Berechnung des Abstands zwischen parallelen Linien
    let distance = area / height;
  
    // Berechnung der rechten Punkte
    let topRightX = randomTopBlue.x + distance;
    let bottomRightX = randomBottomBlue.x + distance;
    
    // Validierung: Punkte müssen innerhalb des Rechtecks bleiben
    if (topRightX > rectX + rectWidth || bottomRightX > rectX + rectWidth || distance < 0) {
        console.warn("Ungültige Konfiguration der Punkte. Passen Sie die Fläche oder die Zufallswerte an.", {
            randomTopBlue, randomBottomBlue, topRightX, bottomRightX, area, distance
    });
        return;
    }
    
    fill(color);
    beginShape();
    vertex(randomTopBlue.x, rectY);                     // Top-left point
    vertex(topRightX, rectY);                   // Top-right point
    vertex(bottomRightX, rectY + rectHeight);   // Bottom-right point
    vertex(randomBottomBlue.x, rectY + rectHeight);    // Bottom-left point
    endShape(CLOSE);
  
    // Berechnung der tatsächlichen Fläche (zum Vergleich)
    let calculatedArea = distance * height;
  
    // Vergleich und Debugging
    console.log("Ziel-Fläche:", area);
    console.log("Berechnete Fläche:", calculatedArea);

}

function drawRectangleLeft(deltaHorizontal, rectX, rectY, rectWidth, rectHeight, pointTopRed, pointBottomRed, area, color) {
    // Zufällige Punkte auf der horizontalen Linie für die rote Linie
    const randomTopRed = getRandomPointOnHorizontalLine(pointTopRed, rectX, rectX + rectWidth, deltaHorizontal);
    const randomBottomRed = getRandomPointOnHorizontalLine(pointBottomRed, rectX, rectX + rectWidth, deltaHorizontal);

    let height = Math.abs(rectY + rectHeight - rectY);

    // Berechnung des Abstands zwischen parallelen Linien
    let distance = area / height;

    // Berechnung der linken Punkte
    let topLeftX = randomTopRed.x - distance;
    let bottomLeftX = randomBottomRed.x - distance;
    
    // Validierung: Punkte müssen innerhalb des Rechtecks bleiben
    if (topLeftX < rectX || bottomLeftX < rectX || distance < 0) {
        console.warn("Ungültige Konfiguration der Punkte. Passen Sie die Fläche oder die Zufallswerte an.", {
            randomTopRed, randomBottomRed, area, distance
        });
        return;
    }
    
    // Rechteck zeichnen
    fill(color);
    beginShape();
    vertex(topLeftX, rectY);                 // Top-left point
    vertex(randomTopRed.x, rectY);          // Top-right point
    vertex(randomBottomRed.x, rectY + rectHeight); // Bottom-right point
    vertex(bottomLeftX, rectY + rectHeight);   // Bottom-left point
    endShape(CLOSE);
  
    // Berechnung der tatsächlichen Fläche (zum Vergleich)
    let calculatedArea = distance * height;
  
    // Vergleich und Debugging
    console.log("Ziel-Fläche:", area);
    console.log("Berechnete Fläche:", calculatedArea);
}

function drawRectangleTop(deltaVertical, rectX, rectY, rectWidth, rectHeight, pointLeftGreen, pointRightGreen, area, color) {
    // Zufällige Punkte auf der vertikalen Linie für die grüne Linie
    const randomLeftGreen = getRandomPointOnVerticalLine(pointLeftGreen, rectY, rectY + rectHeight, deltaVertical);
    const randomRightGreen = getRandomPointOnVerticalLine(pointRightGreen, rectY, rectY + rectHeight, deltaVertical);

    let width = Math.abs(rectX + rectWidth - rectX);

    // Berechnung des Abstands zwischen parallelen Linien
    let distance = area / width;

    // Berechnung der oberen Punkte
    let topYGreen = randomLeftGreen.y - distance;
    let bottomYGreen = randomRightGreen.y - distance;
    
    // Validierung: Punkte müssen innerhalb des Rechtecks bleiben
    if (topYGreen < rectY || bottomYGreen < rectY || distance < 0) {
        console.warn("Ungültige Konfiguration der Punkte. Passen Sie die Fläche oder die Zufallswerte an.", {
            randomLeftGreen, randomRightGreen, area, distance
        });
        return;
    }

    
    // Rechteck zeichnen
    fill(color);
    beginShape();
    //vertex(rectX, randomLeftGreen);                // Top-left point
    //vertex(rectX + rectWidth, topYGreen);    // Top-right point
    //vertex(rectX + rectWidth, bottomYGreen); // Bottom-right point
    //vertex(rectX, randomRightGreen);             // Bottom-left point
   
   //oben links
    vertex(randomLeftGreen.x, topYGreen);

    // Oben-rechts (zufälliger Punkt randomRightGreen)
    vertex(randomRightGreen.x, bottomYGreen);
    
    // Unten-rechts (berechneter Punkt basierend auf randomRightGreen)
   
    vertex(randomRightGreen.x, randomRightGreen.y);
    
    // Unten-links (zufälliger Punkt randomLeftGreen)
    vertex(randomLeftGreen.x, randomLeftGreen.y);

    endShape(CLOSE);
  
    // Berechnung der tatsächlichen Fläche (zum Vergleich)
    let calculatedArea = distance * width;
  
    // Vergleich und Debugging
    console.log("Ziel-Fläche:", area);
    console.log("Berechnete Fläche:", calculatedArea);
}

function drawRectangleBottom(deltaVertical, rectX, rectY, rectWidth, rectHeight, pointLeftLila, pointRightLila, area, color) {
    // Zufällige Punkte auf der vertikalen Linie für die lila Linie
    const randomLeftLila = getRandomPointOnVerticalLine(pointLeftLila, rectY, rectY + rectHeight, deltaVertical);
    const randomRightLila = getRandomPointOnVerticalLine(pointRightLila, rectY, rectY + rectHeight, deltaVertical);

    let width = Math.abs(rectX + rectWidth - rectX);

    // Berechnung des Abstands zwischen parallelen Linien
    let distance = area / width;

    // Berechnung der unteren Punkte
    let bottomYlila = randomLeftLila.y + distance;
    let topYlila = randomRightLila.y + distance;
    
    // Validierung: Punkte müssen innerhalb des Rechtecks bleiben
    if (bottomYlila > rectY + rectHeight || topYlila > rectY + rectHeight || distance < 0) {
        console.warn("Ungültige Konfiguration der Punkte. Passen Sie die Fläche oder die Zufallswerte an.", {
            randomLeftLila, randomRightLila, bottomYlila, topYlila, area, distance
        });
        return;
    }
    
    // Rechteck zeichnen
    fill(color);
    beginShape();
      // Unten links (Zufälliger Punkt randomLeftLila)
      vertex(randomLeftLila.x, randomLeftLila.y);

      // Unten rechts (Berechneter Punkt basierend auf randomRightLila)
      vertex(randomRightLila.x, randomRightLila.y);
  
      // Oben rechts (Berechneter Punkt basierend auf topYlila)
      vertex(randomRightLila.x, topYlila);
  
      // Oben links (Berechneter Punkt basierend auf topYlila)
      vertex(randomLeftLila.x, bottomYlila);

    endShape(CLOSE);
  
    // Berechnung der tatsächlichen Fläche (zum Vergleich)
    let calculatedArea = distance * width;
  
    // Vergleich und Debugging
    console.log("Ziel-Fläche:", area);
    console.log("Berechnete Fläche:", calculatedArea);
}

function getRandomPointOnHorizontalLine(point, minX, maxX, pointDistance) {
    // Berechne einen zufälligen Versatz für den Punkt entlang der x-Achse
    let randomX;
    do {
        randomX = random(point.x - pointDistance, point.x + pointDistance);
    } while (randomX < minX || randomX > maxX); // Neu generieren, falls ungültig
    
    return {
        x: randomX,
        y: point.y // bleibt auf der gleichen Höhe
    };
}

// Zufällige Punkte auf der vertikalen Linie (in der Nähe der Schnittstelle)
function getRandomPointOnVerticalLine(point, minY, maxY, pointDistance) {
    // Berechne einen zufälligen Versatz für den Punkt entlang der y-Achse
    let randomY;
    do {
        randomY = random(point.y - pointDistance, point.y + pointDistance);
    } while (randomY < minY || randomY > maxY); // Neu generieren, falls ungültig

    return {
        x: point.x, // bleibt auf derselben vertikalen Position
        y: randomY
    };
}

function getValidRandomPoint(minX, maxX, delta) {
    let point;
    do {
        point = getRandomPointOnHorizontalLine(0, minX, maxX, delta); // Annahme: getRandomPointOnHorizontalLine funktioniert wie beschrieben.
    } while (point < minX || point > maxX);
    return point;
}

