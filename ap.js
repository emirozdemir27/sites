const gameSize=10;
const mineCount=15;

const game=document.getElementById("game");

let board=[];

let firstClickDone=false
let gameOver=false


function createBoard(){
    board=[];
   
    for(let i=0;i<gameSize*gameSize;i++){
        const cell=document.createElement("div");
        cell.classList.add("cell");
        cell.dataset.index=i;
        cell.addEventListener("click",handleClick);
        game.appendChild(cell);

            board.push({
                element: cell,
                isMine: false,
                isRevealed: false,
                adjacentMines:0
            });
    
    }
    
}


function placeMines(indexToAvoid){
    let minesPlaced=0;

    while(minesPlaced<mineCount){
        const index=Math.floor(Math.random()*board.length);
        
        if(!board[index].isMine && !isInSafeZone(indexToAvoid, index)){
            board[index].isMine=true;
            minesPlaced++;
        }
    }
}
function isInSafeZone(clickedIndex, indexToCheck) {
  const cx = clickedIndex % gameSize;
  const cy = Math.floor(clickedIndex / gameSize);
  const tx = indexToCheck % gameSize;
  const ty = Math.floor(indexToCheck / gameSize);

  return Math.abs(cx - tx) <= 1 && Math.abs(cy - ty) <= 1;
}



function calculateAdjacents() {
  for (let i = 0; i < board.length; i++) {
    const x = i % gameSize;
    const y = Math.floor(i / gameSize);

    let count = 0;

    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        if (dx === 0 && dy === 0) continue;

        const nx = x + dx;
        const ny = y + dy;

        if (nx >= 0 && nx < gameSize && ny >= 0 && ny < gameSize) {
          const ni = ny * gameSize + nx;
          if (board[ni].isMine) count++;
        }
      }
    }

    board[i].adjacentMines = count;
  }
}

function revealCell(index) {
  const stack = [index];

  while (stack.length > 0) {
    const current = stack.pop();
    const cell = board[current];

    if (cell.isRevealed || cell.isMine) continue;

    cell.isRevealed = true;
    cell.element.classList.add("revealed");

    if (cell.adjacentMines > 0) {
      cell.element.textContent = cell.adjacentMines;
    } else {
      const x = current % gameSize;
      const y = Math.floor(current / gameSize);

      for (let dx = -1; dx <= 1; dx++) {
        for (let dy = -1; dy <= 1; dy++) {
          if (dx === 0 && dy === 0) continue;

          const nx = x + dx;
          const ny = y + dy;

          if (nx >= 0 && nx < gameSize && ny >= 0 && ny < gameSize) {
            const ni = ny * gameSize + nx;
            const neighbor = board[ni];

            // Eğer komşu hücre daha önce açılmamışsa ve bu hücre boşsa stack'e ekle
            if (!neighbor.isRevealed && !neighbor.isMine) {
              // Sadece 0 ise zinciri genişlet
              if (neighbor.adjacentMines === 0) {
                stack.push(ni);
              } else {
                // sayı olan komşular da gösterilsin ama zinciri ilerletmesin
                neighbor.isRevealed = true;
                neighbor.element.classList.add("revealed");
                neighbor.element.textContent = neighbor.adjacentMines;
              }
            }
          }
        }
      }
    }
  }
}

function revealAllMine(){
    for (let i = 0; i < board.length; i++) {
        const cell = board[i];
        
        if (cell.isMine && !cell.isRevealed) {
            cell.element.textContent = "💣"
            cell.element.classList.add("revealed","bomb");
        }
        
    }
}

function handleClick(e) {
  if(gameOver)return;
    const index = parseInt(e.target.dataset.index);

  if (!firstClickDone) {
    placeMines(index);           // ilk tıklanan karede mayın olmasın
    calculateAdjacents();
    firstClickDone = true;
  }

  const cell = board[index];

  if (cell.isRevealed) return;

  if (cell.isMine) {
    cell.element.textContent = "💣";
    cell.element.classList.add("revealed","bomb");
    revealAllMine()
    gameOver=true;
    alert("BOOM! Kaybettin.");

  } else {
    revealCell(index);
  }
}


createBoard();