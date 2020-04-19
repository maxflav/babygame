const levels = [level1, level2, level3, level4, level5, level6];
// const levels = [level1, level4, level6, level5];
// const levels = [level0];

const numLevels = levels.length;

function loadLevel(level) {
  topMessage = null;
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
  setSizing(7);
  showMessage(["Some spots", "are muddy", "and can't", "support", "a gate!"], [WALL, JUNK, WALL]);

  setSizing(7);

  baby.x = 1;
  baby.y = 5;

  for (let x = 0; x < 7; x++) {
    for (let y = 0; y < 7; y++) {
      if ((x + y) % 2 == 0) {
        state[x][y] = EMPTY;
      } else {
        state[x][y] = JUNK;
      }
    }
  }

  state[3][3] = DANGER;
}

function level4() {
  setSizing(9);

  baby.x = (gameHeight - 1) / 2;
  baby.y = (gameWidth - 1) / 2;

  for (let x = 0; x < gameHeight; x++) {
    for (let y = 0; y < gameWidth; y++) {
      if ((x + y) % 2 == 0) {
        if (x == 0 || y == 0 || x == gameHeight - 1 || y == gameWidth - 1) {
          state[x][y] = DANGER;
        } else {
          state[x][y] = EMPTY;
        }
      } else {
        state[x][y] = JUNK;
      }
    }
  }

  // state[3][3] = DANGER;
}

function level5() {
  setSizing(11);

  baby.x = 5;
  baby.y = 5;

  for (let i = 0; i < 11; i++) {
    state[i][5] = JUNK;
    state[i][0] = JUNK;

    state[i][10] = DANGER;
  }

  for (let i = 5; i < 11; i++) {
    if (i >= 5) {
      state[5][i] = JUNK;
      state[0][i] = DANGER;
      state[10][i] = DANGER;
    }
  }

  for (let i = 0; i < 5; i++) {
    state[0][i] = JUNK;
    state[1][i] = JUNK;
    state[9][i] = JUNK;
    state[10][i] = JUNK;
  }

  state[5][1] = DANGER;
  state[5][10] = DANGER;
}

function level6() {
  setSizing(10);

  baby.x = 4;
  baby.y = 4;

  for (let x = 0; x < gameWidth; x++) {
      state[x][0] = DANGER;
      state[x][gameHeight-1] = DANGER;
  }
  for (let y = 0; y < gameHeight; y++) {
      state[0][y] = DANGER;
      state[gameWidth-2][y] = DANGER;
  }
  state[4][0] = EMPTY;

  for (let y = 0; y < gameHeight; y++) {
    state[gameWidth-1][y] = NOTHING;
  }
}
