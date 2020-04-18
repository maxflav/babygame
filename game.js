const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');

const TOTAL_HEIGHT = 600;
const TOTAL_WIDTH = 600;

const GAME_HEIGHT = 5;
const GAME_WIDTH = 5;
const PXL_SIZE = Math.min(TOTAL_HEIGHT / GAME_HEIGHT, TOTAL_WIDTH / GAME_WIDTH);

const STROKE_COLOR = '#666666';
const EMPTY_COLOR = '#CCCCCC';
const WALL_COLOR = '#222222';
const BABY_COLOR = '#6666CC';
const WON_COLOR = '#66CC66';
const DANGER_COLOR = '#CC6666';
const DEAD_COLOR = '#CC0000';

const EMPTY = 0;
const WALL = 1;
const DANGER = 2;
const BABY = 3;

let state = [];
let baby = {};
let level = 1;
let won = false;
let lost = false;

let undoStates = [];

function initialize() {
  canvas.addEventListener('click', onClick);
  document.addEventListener('keypress', onKeypress);
  startGame();
}

function startGame() {
  for (let x = 0; x < GAME_WIDTH; x++) {
    state[x] = [];
    for (let y = 0; y < GAME_HEIGHT; y++) {
      state[x][y] = EMPTY;
    }
  }

  loadLevel(level);
  state[baby.x][baby.y] = BABY;
  won = false;
  lost = false;

  undoStates = [];

  addUndoState();
  draw();
}

function onKeypress(key_event) {
  // lol idk
  let code = key_event.key || key_event.keyIdentifier || key_event.keyCode;
  if (code == 'r' || code == 'KeyR' || code == 82 || code == 114) {
    startGame();
  } else if (code == 'u' || code == 'KeyU' || code == 85 || code == 117) {
    undo();
  }
}

function onClick(click_event) {
  if (won || lost) {
    startGame();
    return;
  }

  const bounding_rect = canvas.getBoundingClientRect();
  const click_x = event.clientX - bounding_rect.left;
  const click_y = event.clientY - bounding_rect.top;

  const x = Math.floor(click_x / PXL_SIZE);
  const y = Math.floor(click_y / PXL_SIZE);
  const pos = {x: x, y: y};

  if (!inBounds(pos) || getThing(pos) != EMPTY) {
    return;
  }

  state[x][y] = WALL;

  moveBaby();
  addUndoState();
  draw();
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
  for (let x = 0; x < GAME_WIDTH; x++) {
    copiedState[x] = [];
    for (let y = 0; y < GAME_HEIGHT; y++) {
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

function draw() {
  context.strokeStyle = STROKE_COLOR;

  for (let x = 0; x < GAME_WIDTH; x++) {
    for (let y = 0; y < GAME_HEIGHT; y++) {
      const thing = state[x][y];
      if (thing == EMPTY) context.fillStyle = EMPTY_COLOR;
      else if (thing == WALL) context.fillStyle = WALL_COLOR;
      else if (thing == DANGER) context.fillStyle = DANGER_COLOR;
      else if (thing == BABY) {
          if (won) context.fillStyle = WON_COLOR;
          else if (lost) context.fillStyle = DEAD_COLOR;
          else context.fillStyle = BABY_COLOR;
      }

      context.strokeRect(x * PXL_SIZE, y * PXL_SIZE, PXL_SIZE, PXL_SIZE);
      context.fillRect(x * PXL_SIZE, y * PXL_SIZE, PXL_SIZE, PXL_SIZE);
    }
  }
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
      for (let x = 0; x < GAME_WIDTH; x++) {
        for (let y = 0; y < GAME_HEIGHT; y++) {
          let thing =  getThing({x, y});
          if (thing != WALL && thing != DANGER) {
            continue;
          }
          const dx = neighbor.x - x;
          const dy = neighbor.y - y;
          const distance = Math.max(dx * dx + dy * dy, 1);

          if (thing == WALL) wallScore += (1.0 / distance);
          if (thing == DANGER) wallScore -= (1.0 / distance);
        }
      }

      // console.log('computed wall score', neighbor, ' = ', wallScore);
      // console.log('adding to queue', neighbor, score+wallScore+1);

      queue.push({
        path: path.concat([neighbor]),
        pos: neighbor,
        score: score + wallScore + 15,
      });
    }
  }

  if (bestSolution != null) {
    let moving = bestSolution.path[1];
    if (getThing(moving) == DANGER) {
      lost = true;
    }
    state[baby.x][baby.y] = EMPTY;
    baby = moving;
    state[baby.x][baby.y] = BABY;
  } else {
    won = true;
  }
}

function loadLevel(level) {
  // baby.x = Math.floor((GAME_WIDTH - 1) / 2);
  baby.x = GAME_WIDTH - 1;
  baby.y = GAME_HEIGHT - 1;
  // baby.x = baby.y = 2;
  // state[0][0] = DANGER;
  for (let x = 0; x < GAME_WIDTH; x++) {
      state[x][0] = DANGER;
  }
  for (let y = 0; y < GAME_HEIGHT; y++) {
      state[0][y] = DANGER;
  }
  // state[3][0] = EMPTY;

  // state[0][GAME_HEIGHT-1] = DANGER;
  // state[GAME_WIDTH-1][GAME_HEIGHT-1] = DANGER;
}
