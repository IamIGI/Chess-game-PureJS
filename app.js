const gameBoard = document.querySelector('#gameboard');
const playerDisplay = document.querySelector('#player');
const infoDisplay = document.querySelector('#info-display');
const width = 8; //there are 8 square in row
let playerGo = 'black';
playerDisplay.textContent = 'black';

const startPieces = [
  rook,
  knight,
  bishop,
  queen,
  king,
  bishop,
  knight,
  rook,
  pawn,
  pawn,
  pawn,
  pawn,
  pawn,
  pawn,
  pawn,
  pawn,
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  pawn,
  pawn,
  pawn,
  pawn,
  pawn,
  pawn,
  pawn,
  pawn,
  rook,
  knight,
  bishop,
  queen,
  king,
  bishop,
  knight,
  rook,
];

function colorBoard(square, i) {
  const row = Math.floor((63 - i) / 8) + 1;
  if (row % 2 === 0) {
    square.classList.add(i % 2 === 0 ? 'beige' : 'brown');
  } else {
    square.classList.add(i % 2 === 0 ? 'brown' : 'beige');
  }

  if (i <= 15) {
    square.firstChild.firstChild.classList.add('black');
  }

  if (i >= 48) {
    square.firstChild.firstChild.classList.add('white');
  }
}

function createBoard() {
  startPieces.forEach((startPiece, i) => {
    const square = document.createElement('div');
    square.classList.add('square');
    square.innerHTML = startPiece;
    // if square has a first child
    square.firstChild && square.firstChild.setAttribute('draggable', true);

    square.setAttribute('square-id', i.toString());

    colorBoard(square, i);
    gameBoard.append(square);
  });
}

createBoard();

const allSquares = document.querySelectorAll('.square');

allSquares.forEach((square) => {
  square.addEventListener('dragstart', dragStart);
  square.addEventListener('dragover', dragOver);
  square.addEventListener('drop', dragDrop);
});

let startPositionId;
let draggedElement;

function dragStart(e) {
  startPositionId = e.target.parentNode.getAttribute('square-id');
  draggedElement = e.target;
}

function dragOver(e) {
  e.preventDefault();
}

function dragDrop(e) {
  e.stopPropagation();

  // console.log(draggedElement);
  // console.log(draggedElement.firstChild);

  const correctPlayerGo =
    draggedElement.firstChild.classList.contains(playerGo);
  const takenPiece = e.target.classList.contains('piece');
  const valid = checkIfValid(e.target);
  const opponentPlayerGo = playerGo === 'white' ? 'black' : 'white';
  const takenPieceByOpponent =
    e.target.firstChild?.classList.contains(opponentPlayerGo);

  // correctPlayer move black piece
  // console.log(correctPlayerGo);
  if (correctPlayerGo) {
    if (takenPieceByOpponent && valid) {
      e.target.parentNode.append(draggedElement);
      e.target.remove(); // remove old piece
      changePlayer();
      return;
    }

    if (takenPiece && !takenPieceByOpponent) {
      infoDisplay.textContent = 'you cannot go here!';
      setTimeout(() => (infoDisplay.textContent = ''), 2000);
      return;
    }

    if (valid) {
      e.target.append(draggedElement);
      changePlayer();
      return;
    }
  }
}

function changePlayer() {
  if (playerGo === 'black') {
    playerGo = 'white';
    reverseIds();
    playerDisplay.textContent = 'white';
  } else {
    revertIds();
    playerGo = 'black';
    playerDisplay.textContent = 'black';
  }
}

function reverseIds() {
  const allSquares = document.querySelectorAll('.square');
  allSquares.forEach((square, i) => {
    square.setAttribute('square-id', width * width - 1 - i);
  });
}

function revertIds() {
  const allSquares = document.querySelectorAll('.square');
  allSquares.forEach((square, i) => {
    square.setAttribute('square-id', i);
  });
}

function checkIfValid(target) {
  const targetId =
    Number(target.getAttribute('square-id')) ||
    Number(target.parentNode.getAttribute('square-id'));

  const startId = Number(startPositionId);
  const piece = draggedElement.id;
  // console.log('targetId', targetId);
  // console.log('startId', startId);
  // console.log('piece', piece);

  console.log(target.classList[0]);

  switch (piece) {
    case 'pawn':
      const starterRow = [8, 9, 10, 11, 12, 13, 14, 15];

      //pawn moves forward
      if (
        (starterRow.includes(startId) && startId + width * 2 === targetId) ||
        (startId + width === targetId && target.classList[0] === 'square')
      ) {
        console.log('here');
        return true;
      }

      //pawn moves diagonally (need opponent on square to do it)
      if (
        (startId + width - 1 === targetId && target.classList[0] === 'piece') ||
        (startId + width + 1 === targetId && target.classList[0] === 'piece')
      ) {
        return true;
      }
      break;

    default:
      break;
  }
}
