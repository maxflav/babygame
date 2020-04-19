const levels = [level1, level2, level3, level4];
// const levels = [level0, level4];

const numLevels = levels.length;

function loadLevel(level) {
  levels[level - 1]();
}

function level0() {
  setSizing(2);

  baby.x = 0;
  baby.y = 1;
}

function level1() {
  setSizing(5);

  baby.x = 4;
  baby.y = 4;
  for (let x = 0; x < gameWidth; x++) {
      state[x][0] = DANGER;
  }
  for (let y = 0; y < gameHeight; y++) {
      state[0][y] = DANGER;
  }
}

function level2() {
  setSizing(11);

  baby.x = 5;
  baby.y = 5;

  for (let x = 0; x < gameWidth; x++) {
      state[x][0] = DANGER;
      state[x][gameHeight-1] = DANGER;
  }
  for (let y = 0; y < gameHeight; y++) {
      state[0][y] = DANGER;
      state[gameWidth-1][y] = DANGER;
  }
}

function level3() {
  setSizing(9);

  baby.x = 4;
  baby.y = 4;

  for (let x = 0; x < gameWidth; x++) {
      state[x][0] = DANGER;
      state[x][gameHeight-1] = DANGER;
  }
  for (let y = 0; y < gameHeight; y++) {
      state[0][y] = DANGER;
      state[gameWidth-1][y] = DANGER;
  }
  state[4][0] = EMPTY;
}

function level4() {
  setSizing(10);

  baby.x = 0;
  baby.y = 5;

  state[0][3] = DANGER;
  state[3][7] = JUNK;
  state[5][3] = DANGER;
  state[2][8] = DANGER;

  showMessage(["Some spots", "have too much", "junk, and a gate", "won't fit!"]);
}