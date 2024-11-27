function drawCircleForHashtag(rectX, rectY, rectWidth, rectHeight, colors, surfaceAreas, shapes) {
  
    let circles = []; // Array zum Speichern der gezeichneten Kreise
    let indexCount = 0;

     // Berechne die Goldener-Schnitt-Positionen
    let goldenRatio = 0.618;
    let x1 = rectX + rectWidth * goldenRatio;
    let x2 = rectX + rectWidth * (1 - goldenRatio);
    let y1 = rectY + rectHeight * goldenRatio;
    let y2 = rectY + rectHeight * (1 - goldenRatio);

    // Definiere die vier Punkte im Goldenen Schnitt
    let goldenPoints = [
        { x: x1, y: y1 },
        { x: x2, y: y1 },
        { x: x1, y: y2 },
        { x: x2, y: y2 }
    ];

    // fill(255, 0, 0); // Rot
    // noStroke();
    // goldenPoints.forEach(point => {
    //   ellipse(point.x, point.y, 10, 10); // Zeichne kleine Kreise zur Markierung
    // });

    // Zeichne Kreise für die 10 häufigsten Hashtags
    surfaceAreas.forEach((area, index) => {
        // Prüfen, ob das aktuelle shapes-Element "circle" ist
        if (shapes[index] === "circle") {

            if (indexCount === 0){

                let radius = sqrt(surfaceAreas[0] / PI); // Radius abhängig von Häufigkeit
                let point = goldenPoints[Math.floor(random(0, goldenPoints.length))]; // Zufälligen roten Punkt auswählen

                baseColor = colors[index];
                fill(baseColor);
                noStroke();
                ellipse(point.x, point.y, radius * 2, radius * 2);
                drawTexturedCircle(point.x, point.y, radius, baseColor);

                // Speichere den größten Kreis, um spätere Überlappungsprüfung zu ermöglichen
                circles.push({ x: point.x, y: point.y, radius: radius });
                indexCount++;

            } else {
                let radius = sqrt(area / PI); // Radius abhängig von Häufigkeit
                let x, y;
                let validPosition = false;

                // Suche nach einer gültigen Position für den Kreis
                for (let attempt = 0; attempt < 100; attempt++) {
                    x = random(rectX + radius, rectX + rectWidth - radius);
                    y = random(rectY + radius, rectY + rectHeight - radius);

                    // Überprüfe die Überschneidung mit bereits gezeichneten Kreisen
                    let overlaps = false;
                    for (let circle of circles) {
                        let d = dist(x, y, circle.x, circle.y);
                        let minDistance = radius + circle.radius * 0.67; // 67% der Summe der Radien
                        if (d < minDistance) {
                            overlaps = true;
                            break;
                        }
                    }
                    // Wenn keine Überschneidung gefunden wurde, position ist gültig
                    if (!overlaps) {
                        validPosition = true;
                        break;
                    }
                }   
                // Wenn eine gültige Position gefunden wurde, zeichne den Kreis
                if (validPosition) {
                    baseColor = colors[index];
                    fill(baseColor);
                    noStroke();
                    ellipse(x, y, radius * 2, radius * 2);
                    drawTexturedCircle(x, y, radius, baseColor);
                    // Speichere die Informationen des gezeichneten Kreises
                    circles.push({ x: x, y: y, radius: radius });
                }
            }       
        }
    });
}


function drawTexturedCircle(x, y, radius, baseColor) {
    noStroke();
    let density = 10000; // Anzahl der Punkte für die Textur

    for (let i = 0; i < density; i++) {
        let validPoint = false;
        let px, py;

        // Wiederhole, bis ein Punkt gefunden wird, der innerhalb des Kreises liegt
        while (!validPoint) {
            let angle = random(TWO_PI); // Zufälliger Winkel
            let r = random(radius-2); // Zufälliger Radius innerhalb des Kreises
            px = x + r * cos(angle);
            py = y + r * sin(angle);

            // Überprüfen, ob der Punkt innerhalb des Kreises liegt
            if (dist(x, y, px, py) <= radius) { // Abstand vom Mittelpunkt prüfen
                validPoint = true;
            }
        }

        // Perlin-Noise für zusätzliche Variation
        let noiseValue = noise(px * 0.01, py * 0.01) * 0.5 + 0.5;
        let size = map(noiseValue, 0, 1, 0.1, 4); // Punktgröße basierend auf Noise

        let adjustBrightness = random(-0.05, 0.05); // Variiert Helligkeit zufällig
        let adjustedColor;
        if (adjustBrightness > 0) {
            // Heller machen (Interpolate towards white)
            adjustedColor = lerpColor(color(baseColor), color(255), adjustBrightness);
        } else {
            // Dunkler machen (Interpolate towards black)
            adjustedColor = lerpColor(color(baseColor), color(0), -adjustBrightness);
        }
        fill(adjustedColor);
        ellipse(px, py, size, size);
    }
}

function adjustColor(c, offset) {
    let h = hue(c);
    let s = saturation(c);
    let b = brightness(c);

    b = constrain(b + offset * 100, 0, 100); // Helligkeit anpassen
    return color(h, s, b);
}