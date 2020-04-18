function posToInt(pos) {
  return pos.x * GAME_HEIGHT + pos.y;
}

function neighborPositions(pos) {
  return [[1, 0], [-1, 0], [0, 1], [0, -1]].map(([dx, dy]) => ({x: dx + pos.x, y: dy + pos.y})).filter(inBounds);
}

function inBounds(pos) {
  return pos.x >= 0 && pos.x < GAME_WIDTH && pos.y >= 0 && pos.y < GAME_HEIGHT;
}

function getThing(pos) {
  if (!inBounds(pos)) {
    return WALL;
  }
  return state[pos.x][pos.y];
}
