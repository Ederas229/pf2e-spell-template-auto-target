Hooks.on('createMeasuredTemplate', async function(templateDoc){

    templateDoc.object.draw();
    templateDoc.object.refresh();

    game.user.updateTokenTargets(findContained(templateDoc));

});

/**
 * Returns the tokenDocument ids that are contained within a templateDocument.
 *
 */
 export function findContained(templateDoc) {
    const { size } = templateDoc.parent.grid;
    const { x: tempx, y: tempy, object } = templateDoc;
    const tokenDocs = templateDoc.parent.tokens;
    const contained = new Set();

    for (const tokenDoc of tokenDocs) {
      const { width, height, x: tokx, y: toky } = tokenDoc;
      const startX = width >= 1 ? 0.50 : width / 2;
      const startY = height >= 1 ? 0.50 : height / 2;
      for (let x = startX; x < width; x++) {
        for (let y = startY; y < width; y++) {
          const curr = {
            x: tokx + x * size - tempx,
            y: toky + y * size - tempy
          };
          const contains = object.shape.contains(curr.x, curr.y);
          if (contains) {
            if (returnDistance(templateDoc, tokenDoc) <= templateDoc.distance){
              contained.add(tokenDoc.id);
            }
            continue;
          }
        }
      }
    }
    return [...contained];
  }

function returnDistance(template, token){
  let distance = tokenDistance(template, token);
  return Math.ceil(distance)+5;
  /*
    Total Distance between two tokens.
  */
  function tokenDistance(token1, token2)
  {
    if(!token1 || !token2) return;
    let distance = measureDistancePF2(token1, token2);
    return distance.distance;
  }
  
  
  function distanceMeasure(p0,p1){
    const gs = canvas.dimensions.size;
          const ray = new Ray(p0, p1);
          // How many squares do we travel across to get there? If 2.3, we should count that as 3 instead of 2; hence, Math.ceil
          const nx = (Math.abs(ray.dx / gs));
          const ny = (Math.abs(ray.dy / gs));
  
          // Get the number of straight and diagonal moves
          const nDiagonal = Math.min(nx, ny);
          const nStraight = Math.abs(ny - nx);
  
          // Diagonals in PF pretty much count as 1.5 times a straight
          var distance2 = Math.floor(nDiagonal * 1.5 + nStraight);
    return {distance:distance2, squares:(Math.floor(nDiagonal+nStraight))}
  }
  
  //Account for token size.
  function measureDistancePF2(p0, p1){
        const gs = canvas.dimensions.size;

        let Cp0x = p0.x;
        let Cp0y = p0.y;
        p1 = p1.object;
        let Cp1x = (Math.floor(p1.hitArea.width/gs) >= 1|| Math.floor(p1.hitArea.height/gs) >= 1) ? p1.center.x : 100*Math.floor(p1.x/100)+50;
        let Cp1y = (Math.floor(p1.hitArea.width/gs) >= 1|| Math.floor(p1.hitArea.height/gs) >= 1) ? p1.center.y : 100*Math.floor(p1.y/100)+50;
      const prelimDistance =  distanceMeasure({x:Cp0x,y:Cp0y},{x:Cp1x,y:Cp1y});
      let distance = prelimDistance.distance;
    if(p0 === p1){distance = {distance:0, squares:0};
      }else {
          const diffX0 = Cp0x - Cp1x
          const diffY0 = Cp0y - Cp1y
          const diffX01 = Cp1x - Cp0x
          const diffY01 = Cp1y - Cp0y
          const testF = distanceMeasure({x:Cp0x,y:Cp0y},{x:Cp1x-(Math.sign(diffX01)*((p1.hitArea.width/2)-gs/2)),y:Cp1y-(Math.sign(diffY01)*((p1.hitArea.height/2)-gs/2))})
          distance = testF
        };
  
      //Finalize things
      const distanceOnGrid = {distance:distance.distance * canvas.dimensions.distance, squares:distance.squares};
          return distanceOnGrid;
      }
}