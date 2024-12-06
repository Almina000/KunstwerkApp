function calculateSurfaceArea(rectWidth, rectHeight, topHashtags,  totalTopCount) {

    let surfaceAreas = [];
    let surfaceTotal = rectHeight * rectWidth;

    topHashtags.forEach((tag, index) => {
        let percentTag = tag.count / totalTopCount; //% pro Tag
        let surfaceTag = percentTag * surfaceTotal * 0.4; // A pro Tag
        surfaceAreas.push(surfaceTag);
      });

    console.log("Surface Areas Array:", surfaceAreas);
    return surfaceAreas;

}