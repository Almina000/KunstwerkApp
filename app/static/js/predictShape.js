function predictShape(number, triangles, circles, rectangles) {

    let shapes = [];
    
    if (triangles === number){
        for (let i = 0; i < number; i++){
            shapes.push("triangle");
        }
        console.log(`Dreiecke: ${triangles}, Kreise: ${circles}, Rechtecke: ${rectangles}`);
        return shapes;
    }
    else if (circles === number){
        for (let i = 0; i < number; i++){
            shapes.push("circle");
        }
        console.log(`Dreiecke: ${triangles}, Kreise: ${circles}, Rechtecke: ${rectangles}`);
        return shapes;
    }
    else if (rectangles === number){
        for (let i = 0; i < number; i++){
            shapes.push("rectangle");
        }
        console.log(`Shapes: ${shapes}`);
        return shapes;
    }


    let shapesSorted = [];
    // Erstelle ein temporäres Array mit den erforderlichen Formen
    for (let i = 0; i < rectangles; i++) {
        shapesSorted.push("rectangle");
    }
    for (let i = 0; i < circles; i++) {
        shapesSorted.push("circle");
    }
    for (let i = 0; i < triangles; i++) {
        shapesSorted.push("triangle");
    }
    console.log(`Shapes: ${shapesSorted}`);
      
    // Mische das Array zufällig, um die Formen zufällig anzuordnen
    while (shapes.length < number) {
        // Wähle einen zufälligen Index aus dem shapes Array
        let randomIndex = floor(random(shapesSorted.length));
        // Füge das ausgewählte Element zum shapesArray hinzu und entferne es aus shapes
        shapes.push(shapesSorted[randomIndex]);
        shapesSorted.splice(randomIndex, 1);
    }
    console.log(`Shapes: ${shapes}`);
    return shapes;

}