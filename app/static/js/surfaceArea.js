function calculateSurfaceArea(rectWidth, rectHeight, topHashtags,  totalTopCount, sizeValue) {

    let surfaceAreas = [];
    let surfaceTotal = rectHeight * rectWidth;

    topHashtags.forEach((tag, index) => {
        let percentTag = tag.count / totalTopCount; //% pro Tag
        let surfaceTag = percentTag * surfaceTotal * sizeValue; // A pro Tag
        surfaceAreas.push(surfaceTag);
      });

    console.log("Surface Areas Array:", surfaceAreas);
    return surfaceAreas;

}