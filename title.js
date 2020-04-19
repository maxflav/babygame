const SKIP_TITLE = false;

let titlePage = 0;
let returnToGame = false;

const TITLE_PAGES = [
  ['Where did', 'this baby', 'come from?'],
  ['Oh no!', 'It\'s going', 'toward that', 'broken glass!'],
  ['Click to place',  'gates.', 'Keep it safe.', 'Keep it alive.'],
];

const TITLE_SCENES = [
  [BABY],
  [DANGER, EMPTY, EMPTY, EMPTY, BABY],
  [DANGER, EMPTY, WALL, EMPTY, BABY_WON],
]

const WIN_MESSAGE = ["You win!"];
const WIN_SCENE = [BABY_WON];

function showTitleScreen() {
  titlePage = 0;
  titleOpen = true;
  returnToGame = false;
  won = false;
  setSizing(6);

  drawTitle();

  if (SKIP_TITLE) startGame();
}

function drawTitle() {
  context.fillStyle = '#99ccff';
  context.fillRect(0, 0, TOTAL_WIDTH, TOTAL_HEIGHT);

  context.fillStyle = '#ffffff';
  context.font = '96px sans-serif';
  context.textAlign = 'center';
  context.textBaseline = 'middle';

  drawTextLines(TITLE_PAGES[titlePage]);
  drawScene(TITLE_SCENES[titlePage]);
}

function drawTextLines(lines) {
  let lineHeight = 96;
  let totalLineHeight = (lines.length - 1) * lineHeight;
  let x = TOTAL_WIDTH / 2;
  let y = (TOTAL_HEIGHT - cellSize) / 2 - totalLineHeight / 2;

  for (let line of lines) {
    context.fillText(line, x, y);
    y += lineHeight;
  }
}

function drawScene(scene) {
  let totalSceneWidth = scene.length;
  let x = gameWidth / 2 - totalSceneWidth / 2;
  let y = gameHeight - 1;
  for (let thing of scene) {
    drawOneThing(EMPTY, x, y);
    if (thing != EMPTY) drawOneThing(thing, x, y);
    x++;
  }
}

function titleOnClick(clickEvent) {
  if (!titleOpen || won) {
    return;
  }

  clickEvent.stopPropagation();
  if (returnToGame) {
    titleOpen = false;
    topMessage = null;
    draw();
    return false;
  }

  titlePage += 1;
  if (titlePage >= TITLE_PAGES.length) {
    startGame();
  } else {
    drawTitle();
  }

  return false;
}

function showWinScreen() {
  won = true;
  setSizing(6);
  titleOpen = true;
  context.fillStyle = '#99ccff';
  context.fillRect(0, 0, TOTAL_WIDTH, TOTAL_HEIGHT);

  context.fillStyle = '#ffffff';
  context.font = '96px sans-serif';
  context.textAlign = 'center';
  context.textBaseline = 'middle';

  drawTextLines(WIN_MESSAGE);
  drawScene(WIN_SCENE);
}

function showMessage(messageLines, scene) {
  titleOpen = true;
  won = false;
  returnToGame = true;

  context.fillStyle = '#99ccff';
  context.fillRect(0, 0, TOTAL_WIDTH, TOTAL_HEIGHT);

  context.fillStyle = '#ffffff';
  context.font = '96px sans-serif';
  context.textAlign = 'center';
  context.textBaseline = 'middle';

  drawTextLines(messageLines);
  if (scene) drawScene(scene);
}