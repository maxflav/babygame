const STROKE_COLOR = '#666666';

const COLOR_MAP = {
  [EMPTY]: '#CCCCCC',
  [BABY]: '#6666CC',
  // [BABY_WON]: '#66CC66',
  [DANGER]: '#CC6666',
  // [BABY_LOST]: '#CC0000',
  [JUNK]: '#663300',
  [NOTHING]: '#FFFFFF',
}

const IMAGE_SOURCES = {
  [WALL]: 'gate',
  [BABY]: 'baby',
  [BABY_WON]: 'baby',
  [BABY_LOST]: 'dead',
}

function draw() {
  if (titleOpen) {
    return;
  }

  context.fillStyle = '#FFFFFF';
  context.fillRect(0, 0, TOTAL_WIDTH, TOTAL_HEIGHT);

  for (let x = 0; x < gameWidth; x++) {
    for (let y = 0; y < gameHeight; y++) {
      const thing = state[x][y];
      drawOneThing(EMPTY, x, y);
      if (thing != EMPTY) drawOneThing(thing, x, y);
    }
  }

  if (lost) {
    drawOneThing(BABY_LOST, baby.x, baby.y);
  } else if (won) {
    drawOneThing(BABY_WON, baby.x, baby.y);
  } else {
    drawOneThing(BABY, baby.x, baby.y);
  }

  if (topMessage) {
    drawTopMessage(topMessage);
  } else {
    drawUndoHint();
  }
}

function drawOneThing(thing, x, y) {
  if (thing == NOTHING) {
    return;
  }

  // shift to make room for message bar at the top
  x = x + 0.5;
  y = y + 1;

  if (thing in IMAGE_SOURCES) {
    const image = document.getElementById(IMAGE_SOURCES[thing]);
    context.imageSmoothingQuality = "high";
    context.drawImage(image, x * cellSize, y * cellSize, cellSize, cellSize);
  } else {
    context.strokeStyle = STROKE_COLOR;
    context.fillStyle = COLOR_MAP[thing];

    console.log('context.strokeRect, fillRect');
    context.strokeRect(x * cellSize, y * cellSize, cellSize, cellSize);
    context.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
  }
}

function drawTopMessage(message) {
  context.fillStyle = '#000000';
  context.font = '40px sans-serif';
  context.textAlign = 'center';
  context.textBaseline = 'middle';

  context.fillText(message, TOTAL_WIDTH / 2, cellSize / 2);
}

function drawUndoHint() {
  context.fillStyle = '#000000';
  context.font = '20px sans-serif';
  context.textAlign = 'left';
  context.textBaseline = 'bottom';

  context.fillText('Z to Undo, R to Restart', 0.5 * cellSize, 0.9 * cellSize);
}