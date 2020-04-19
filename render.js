const STROKE_COLOR = '#666666';

const COLOR_MAP = {
  [EMPTY]: '#CCCCCC',
  [WALL]: '#222222',
  [BABY]: '#6666CC',
  [BABY_WON]: '#66CC66',
  [DANGER]: '#CC6666',
  [BABY_LOST]: '#CC0000',
  [JUNK]: '#663300',
}

const IMAGE_SOURCES = {
  [BABY]: 'baby',
}

function draw() {
  if (titleOpen) {
    return;
  }
  context.strokeStyle = STROKE_COLOR;

  for (let x = 0; x < gameWidth; x++) {
    for (let y = 0; y < gameHeight; y++) {
      drawOneThing(state[x][y], x, y);
    }
  }
}

function drawOneThing(thing, x, y) {
  if (thing in IMAGE_SOURCES) {
    const image = document.getElementById(IMAGE_SOURCES[thing]);
    // console.log('image', image);
    context.drawImage(image, x * cellSize, y * cellSize, cellSize, cellSize);
    // context.strokeRect(x * cellSize, y * cellSize, cellSize, cellSize);
    // context.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
  } else {
    context.strokeStyle = STROKE_COLOR;
    context.fillStyle = COLOR_MAP[thing];

    context.strokeRect(x * cellSize, y * cellSize, cellSize, cellSize);
    context.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
  }
}
