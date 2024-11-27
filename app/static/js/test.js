function drawPoints(rectX, rectY, rectWidth, rectHeight) {
    let goldenRatio = 0.618;

    let blueLine = rectX + rectWidth * goldenRatio;       // Vertikale Linie 1 BLAU
    let redLine = rectX + rectWidth * (1 - goldenRatio);  // Vertikale Linie 2 ROT
    let lilaLine = rectY + rectHeight * goldenRatio;      // Horizontale Linie 3 LILA
    let greenLine = rectY + rectHeight * (1 - goldenRatio); // Horizontale Linie 4 GRÜN

    // Punktdefinitionen für die Linien
    const pointTopBlue = { x: blueLine, y: rectY }; 
    const pointBottomBlue = { x: blueLine, y: rectY + rectHeight };

    const pointTopRed = { x: redLine, y: rectY }; 
    const pointBottomRed = { x: redLine, y: rectY + rectHeight };

    const pointLeftLila = { x: rectX, y: lilaLine }; 
    const pointRightLila = { x: rectX + rectWidth, y: lilaLine };

    const pointLeftGreen = { x: rectX, y: greenLine }; 
    const pointRightGreen = { x: rectX + rectWidth, y: greenLine };

    // Einfärben und Zeichnen der festen Punkte
    fill(0, 0, 255); // Blau
    ellipse(pointTopBlue.x, pointTopBlue.y, 30, 30);
    ellipse(pointBottomBlue.x, pointBottomBlue.y, 30, 30);

    fill(255, 0, 0); // Rot
    ellipse(pointTopRed.x, pointTopRed.y, 30, 30);
    ellipse(pointBottomRed.x, pointBottomRed.y, 30, 30);

    fill(138, 43, 226); // Lila
    ellipse(pointLeftLila.x, pointLeftLila.y, 30, 30);
    ellipse(pointRightLila.x, pointRightLila.y, 30, 30);

    fill(0, 255, 0); // Grün
    ellipse(pointLeftGreen.x, pointLeftGreen.y, 30, 30);
    ellipse(pointRightGreen.x, pointRightGreen.y, 30, 30);

    let deltaHorizontal = rectWidth * 0.1; // 10% der Breite für horizontale Linien
    let deltaVertical = rectHeight * 0.1;   // 10% der Höhe für vertikale Linien

    // Erzeuge zufällige Punkte entlang der Linien
    const randomTopBlue = getRandomPointOnHorizontalLine(pointTopBlue, rectX, rectX + rectWidth, deltaHorizontal);
    const randomBottomBlue = getRandomPointOnHorizontalLine(pointBottomBlue, rectX, rectX + rectWidth, deltaHorizontal);

    const randomTopRed = getRandomPointOnHorizontalLine(pointTopRed, rectX, rectX + rectWidth, deltaHorizontal);
    const randomBottomRed = getRandomPointOnHorizontalLine(pointBottomRed, rectX, rectX + rectWidth, deltaHorizontal);

    const randomLeftLila = getRandomPointOnVerticalLine(pointLeftLila, rectY, rectY + rectHeight, deltaVertical);
    const randomRightLila = getRandomPointOnVerticalLine(pointRightLila, rectY, rectY + rectHeight, deltaVertical);

    const randomLeftGreen = getRandomPointOnVerticalLine(pointLeftGreen, rectY, rectY + rectHeight, deltaVertical);
    const randomRightGreen = getRandomPointOnVerticalLine(pointRightGreen, rectY, rectY + rectHeight, deltaVertical);

    // Einfärben und Zeichnen der zufälligen Punkte
    fill(255, 255, 0); // Gelb
    ellipse(randomTopBlue.x, randomTopBlue.y, 10, 10);
    ellipse(randomBottomBlue.x, randomBottomBlue.y, 10, 10);

    ellipse(randomTopRed.x, randomTopRed.y, 10, 10);
    ellipse(randomBottomRed.x, randomBottomRed.y, 10, 10);

    ellipse(randomLeftLila.x, randomLeftLila.y, 10, 10);
    ellipse(randomRightLila.x, randomRightLila.y, 10, 10);

    ellipse(randomLeftGreen.x, randomLeftGreen.y, 10, 10);
    ellipse(randomRightGreen.x, randomRightGreen.y, 10, 10);
}

// Hilfsfunktionen für zufällige Punkte
// Zufällige Punkte auf der horizontalen Linie (in der Nähe der Schnittstelle)
function getRandomPointOnHorizontalLine(point, minX, maxX, pointDistance) {
    // Berechne einen zufälligen Versatz für den Punkt entlang der x-Achse
    let randomX = random(point.x - pointDistance, point.x + pointDistance); 
    // Stelle sicher, dass randomX innerhalb der Grenzen von minX und maxX bleibt
    randomX = constrain(randomX, minX, maxX);

    return {
        x: randomX,  // x bleibt in der Nähe des Schnittpunkts auf der horizontalen Linie
        y: point.y    // y bleibt gleich, um auf der horizontalen Linie zu bleiben
    };
}

// Zufällige Punkte auf der vertikalen Linie (in der Nähe der Schnittstelle)
function getRandomPointOnVerticalLine(point, minY, maxY, pointDistance) {
    // Berechne einen zufälligen Versatz für den Punkt entlang der y-Achse
    let randomY = random(point.y - pointDistance, point.y + pointDistance);
    // Stelle sicher, dass randomY innerhalb der Grenzen von minY und maxY bleibt
    randomY = constrain(randomY, minY, maxY);

    return {
        x: point.x,   // x bleibt gleich, um auf der vertikalen Linie zu bleiben
        y: randomY    // y bleibt in der Nähe des Schnittpunkts auf der vertikalen Linie
    };
}