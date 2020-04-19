let state = [];
let baby = {};
let level = 1;
let won = false;
let lost = false;
let titleOpen = true;

let undoStates = [];

function initialize() {
  canvas.addEventListener('click', gameOnClick);
  canvas.addEventListener('click', titleOnClick);
  document.addEventListener('keypress', gameOnKeypress);
  showTitleScreen();
}

function startGame() {
  if (level > numLevels) {
    showWinScreen();
    return;
  }

  titleOpen = false;
  loadLevel(level);
  state[baby.x][baby.y] = BABY;
  won = false;
  lost = false;

  undoStates = [];

  addUndoState();
  draw();
}

// lol idk
const R_CODES = ['r', 'KeyR', 82, 114];
const U_CODES = ['u', 'KeyU', 85, 117];
const Z_CODES = ['z', 'KeyZ', 90, 122];
const SPACE_CODES = [' ', 'Space', 32];

function gameOnKeypress(keyEvent) {
  // console.log(keyEvent);

  let code = keyEvent.key || keyEvent.keyIdentifier || keyEvent.keyCode;
  if (titleOpen)  {
    if (won && (R_CODES.includes(code) || SPACE_CODES.includes(code))) {
      won = false;
      level = 1;
      showTitleScreen();
    }
    return false;
  }

  if (R_CODES.includes(code)) {
    startGame();
  } else if (Z_CODES.includes(code) || U_CODES.includes(code)) {
    undo();
  }
  return false;
}

function gameOnClick(clickEvent) {
  if (titleOpen)  {
    // startGame();
    return;
  }

  clickEvent.stopImmediatePropagation();
  if (won) {
    level++;
    startGame();
    return false;
  }

  if (lost) {
    startGame();
    return false;
  }

  const boundingRect = canvas.getBoundingClientRect();
  const clickX = event.clientX - boundingRect.left;
  const clickY = event.clientY - boundingRect.top;

  const x = Math.floor(clickX / cellSize);
  const y = Math.floor(clickY / cellSize);
  const pos = {x: x, y: y};

  if (!inBounds(pos) || getThing(pos) != EMPTY) {
    return false;
  }

  state[x][y] = WALL;

  moveBaby();
  addUndoState();
  draw();

  return false;
}

function addUndoState() {
  undoStates.push({state: stateCopy(state), baby: babyCopy(baby), won, lost});
}

function undo() {
  if (undoStates.length <= 1) {
    return;
  }

  undoStates.pop();
  const previousState = undoStates[undoStates.length - 1];
  state = stateCopy(previousState.state);
  baby = babyCopy(previousState.baby);
  won = previousState.won;
  lost = previousState.lost;

  draw();
}

function stateCopy(stateToCopy) {
  const copiedState = [];
  for (let x = 0; x < gameWidth; x++) {
    copiedState[x] = [];
    for (let y = 0; y < gameHeight; y++) {
      copiedState[x][y] =  stateToCopy[x][y];
    }
  }
  return copiedState;
}

function babyCopy(babyState) {
  let babyCopy = null;
  if (babyState != null)  {
    babyCopy = {x: babyState.x, y: babyState.y};
  }
  return babyCopy;
}

function moveBaby() {
  if (won || lost) {
    return;
  }

  // breadth-first search. keep searching until we find a solution, then keep searching until
  // we've found all solutions of the same length. pick the solution with best score.
  // score = shortest path; farthest distance from walls

  let bestSolution = null;
  let bestCount = 0;
  const queue = [];

  const startPosition = {x: baby.x, y: baby.y};
  const visited = new Set([posToInt(startPosition)]);

  queue.push({
    path: [startPosition],
    pos: startPosition,
    score: 0,
  });

  let loopCount = 0;

  while (queue.length > 0) {
    loopCount += 1;
    const {path, pos, score} = queue.shift();
    visited.add(posToInt(pos));
    // console.log(path.map(({x, y}) => (x + ',' + y)));
    // console.log(pos);
    // console.log(score);
    // console.log('---');

    // if (bestSolution != null && path.length > bestSolution.path.length) {
    //   break;
    // }

    if (getThing(pos) == DANGER) {
      // console.log(path.map(({x, y}) => (x + ',' + y)));
      // console.log(pos);
      // console.log(score);
      // console.log('---');

      if (bestSolution == null || score < bestSolution.score) {
        bestSolution = {path, score};
        bestCount = 1;
      } else if (score == bestSolution.score && Math.random() * (bestCount + 1) < 1) {
        bestSolution = {path, score};
        bestCount++;
      }

      continue;
    }

    // const neighbors = neighborPositions(pos);
    // const posScore = neighbors.filter(getWall).length;
    // const newScore = score + posScore;

    for (const neighbor of neighborPositions(pos)) {
      if (getThing(neighbor) == WALL || visited.has(posToInt(neighbor))) {
        continue;
      }

      // visited.add(posToInt(neighbor));

      let wallScore = 0;
      for (let x = 0; x < gameWidth; x++) {
        for (let y = 0; y < gameHeight; y++) {
          let thing =  getThing({x, y});
          if (thing != WALL && thing != DANGER) {
            continue;
          }
          const dx = neighbor.x - x;
          const dy = neighbor.y - y;
          const distance = Math.max(dx * dx + dy * dy, 1);

          if (thing == WALL) wallScore += (1.0 / distance);
          // if (thing == DANGER) wallScore -= (1.0 / distance);
        }
      }

      // console.log('computed wall score', neighbor, ' = ', wallScore);
      // console.log('adding to queue', neighbor, score+wallScore+1);

      queue.push({
        path: path.concat([neighbor]),
        pos: neighbor,
        score: score + wallScore + 100,
      });
    }
  }

  if (bestSolution != null) {
    state[baby.x][baby.y] = EMPTY;
    let movingTo = bestSolution.path[1];
    baby = movingTo;
    if (getThing(movingTo) == DANGER) {
      lost = true;
      state[baby.x][baby.y] = BABY_LOST;
    } else {
      state[baby.x][baby.y] = BABY;
    }
  } else {
    won = true;
    state[baby.x][baby.y] = BABY_WON;
  }
}