function drawRectanglesForHashtag(rectX, rectY, rectWidth, rectHeight, colors, surfaceAreas, shapes){

  let goldenRatio = 0.618;
  let blueLineX = rectX + rectWidth * goldenRatio; // Vertikale Linie 1 BLAU
  let area = surfaceAreas[0]; // Ziel-Flächeninhalt des Parallelogramms

  // Zufällige Positionierung der linken Punkte nahe der blauen Linie
  let offsetRange = rectWidth * 0.05; // ±5% für Variation
  let topLeftX = blueLineX + random(-offsetRange, offsetRange);
  let bottomLeftX = blueLineX + random(-offsetRange, offsetRange);
  // Berechnung der Schnittpunkte
  const x1 = rectX + rectWidth * goldenRatio;
  const pointTop = { x: x1, y: rectY };
  const pointBottom = { x: x1, y: rectY + rectHeight };

  fill(128, 0, 128); // Lila
  noStroke();
  ellipse(topLeftX.x, topLeftX.y, 30, 30); // Punkt oben
  ellipse(bottomLeftX.x, bottomLeftX.y, 30, 30); // Punkt unten

  // Höhe des Parallelogramms: Vertikaler Abstand zwischen den linken Punkten
  let height = Math.abs(rectY + rectHeight - rectY);

  // Berechnung des Abstands zwischen parallelen Linien
  let distance = area / height;

  // Berechnung der rechten Punkte
  let topRightX = topLeftX + distance;
  let bottomRightX = bottomLeftX + distance;

  // Validierung: Punkte müssen innerhalb des Rechtecks bleiben
  if (topRightX > rectX + rectWidth || bottomRightX > rectX + rectWidth || distance < 0) {
      console.warn("Ungültige Konfiguration der Punkte. Passen Sie die Fläche oder die Zufallswerte an.", {
          topLeftX, bottomLeftX, topRightX, bottomRightX, area, distance
      });
      return;
  }

  // Zeichnen des Parallelogramms
  fill(colors[0]);
  stroke(0);
  beginShape();
  vertex(topLeftX, rectY);                     // Top-left point
  vertex(topRightX, rectY);                   // Top-right point
  vertex(bottomRightX, rectY + rectHeight);   // Bottom-right point
  vertex(bottomLeftX, rectY + rectHeight);    // Bottom-left point
  endShape(CLOSE);

  // Berechnung der tatsächlichen Fläche (zum Vergleich)
  let calculatedArea = distance * height;

  // Vergleich und Debugging
  console.log("Ziel-Fläche:", area);
  console.log("Berechnete Fläche:", calculatedArea);


}