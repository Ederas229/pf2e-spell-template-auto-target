Hooks.on('createMeasuredTemplate', async function(templateDoc){

  if (originType(templateDoc) == 'spell'){

    templateDoc.object.draw();
    templateDoc.object.refresh();
    game.user.updateTokenTargets(findContained(templateDoc));
  }

});


function findContained(templateDoc){

  const { size } = templateDoc.parent.grid;
  const highlight = canvas.grid.highlightLayers[templateDoc.object.highlightId];
  const tokenDocs = templateDoc.parent.tokens;
  const contained = new Set();

  highlight.positions.forEach(element => {
    for(const tokenDoc of tokenDocs){
      const { width, height, x: tokx, y: toky } = tokenDoc;
      const startX = width >= 1 ? 0.50 : width / 2;
      const startY = height >= 1 ? 0.50 : height / 2;
      
      for (let x = startX; x < width; x++) {
        let contains = false;
        for (let y = startY; y < width; y++) {
          const curr = {
            x: tokx + x * size  ,
            y: toky + y * size 
          };

          const elementSplit = element.split('.');
          const tokenGridPos = canvas.grid.grid.getGridPositionFromPixels(curr.x, curr.y);
          const elementGridPos = canvas.grid.grid.getGridPositionFromPixels(elementSplit[0], elementSplit[1]);

          contains = (tokenGridPos[0] == elementGridPos[0] && tokenGridPos[1] == elementGridPos[1])

          if (contains){
            contained.add(tokenDoc.id);
            break;
          } 
        }
        if (contains){
          break;
        }
      }
      
    }
  });

  return [...contained];
}

function originType(templateDoc){
  let orig = templateDoc.getFlag('pf2e', 'origin');
  return (orig ? orig.type : false);
}
