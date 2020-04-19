const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');

const TOTAL_HEIGHT = canvas.getBoundingClientRect().height;
const TOTAL_WIDTH = canvas.getBoundingClientRect().width;

let cellSize = 1;

const EMPTY         = 0;
const WALL          = 1;
const DANGER        = 2;
const BABY_LEFT     = 3;
const BABY_RIGHT    = 4;
const BABY_LOST     = 5;
const JUNK          = 6;
const NOTHING       = 7;
const BABY_FLOATING = 8;

function posToInt(pos) {
  return pos.x * gameHeight + pos.y;
}

function neighborPositions(pos) {
  return [[1, 0], [-1, 0], [0, 1], [0, -1]].map(([dx, dy]) => ({x: dx + pos.x, y: dy + pos.y})).filter(inBounds);
}

function inBounds(pos) {
  return pos.x >= 0 && pos.x < gameWidth && pos.y >= 0 && pos.y < gameHeight;
}

function getThing(pos) {
  if (!inBounds(pos)) {
    return WALL;
  }
  return state[pos.x][pos.y];
}

function setSizing(size) {
  gameWidth = size;
  gameHeight = size;
  cellSize = TOTAL_WIDTH / (gameWidth + 1);

  for (let x = 0; x < gameWidth; x++) {
    state[x] = [];
    for (let y = 0; y < gameHeight; y++) {
      state[x][y] = EMPTY;
    }
  }
}