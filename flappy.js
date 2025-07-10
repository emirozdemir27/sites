const canvas=document.getElementById("gameCanvas")
const ctx = canvas.getContext("2d")
const jumpStrength = -3;
//kontrol değişkenleri
let gameOver=false
let gamestart=false

//kuş
let birdX =50
let birdY =200
let birdWidth =30
let birdHeight =30
let birdImg = new Image()
birdImg.src = "images/bird.png" 

//fizik
let gravity = 0.07
let velocity = 0

//borular
let pipes = []
let pipeWidth=50
let pipeGap=150
let pipeSpeed=2
let pipeFrequency=90
let frameCount=0
let score=0

function updateGame(){
    if (gameOver) {
        
        ctx.fillStyle = "red";
        ctx.font = "30px 'Press Start 2P";
        ctx.fillText("game over",159,300);

        return;
    }
    ctx.clearRect(0,0,canvas.width,canvas.height);

    if (gamestart) {
        velocity += gravity;
        birdY +=velocity;

            handlePipes();//boru oluşturmaca

        if (birdY+birdHeight >canvas.height) {
            birdY = canvas.height - birdHeight;
            velocity = 0;
            gameOver = true;
        }
    }
    

    ctx.drawImage(birdImg, birdX, birdY, birdWidth, birdHeight);
   

    requestAnimationFrame(updateGame);
    
    ctx.font = "25px 'Press Start 2P'";
    ctx.fillStyle = "white";
    ctx.fillText("SKOR: " + score, 10, 40);
    
}

function handlePipes(){
    frameCount++;

    //pipe oluşturma
    if (frameCount % pipeFrequency == 0) {
        let topHeight = Math.floor(Math.random()*(canvas.height-pipeGap-100))+20;

        let bottomY = topHeight + pipeGap;

        pipes.push({
            x: canvas.width,
            top: topHeight,
            bottom: bottomY,
            scored: false
        });
    }

    for (let i = 0; i < pipes.length; i++) {
        let pipe = pipes[i];
        pipe.x -= pipeSpeed;
        
        ctx.fillStyle = "green";
        ctx.fillRect(pipe.x, 0, pipeWidth, pipe.top); // Üst boru (yukarıdan aşağı)
        ctx.fillRect(pipe.x, pipe.bottom, pipeWidth, canvas.height - pipe.bottom); // Alt boru (aşağıdan yukarı)
        

        if (birdX < pipe.x+pipeWidth && birdX+birdWidth > pipe.x && (birdY < pipe.top || birdY + birdHeight > pipe.bottom)) {
            gameOver = true;
        }
        if (!pipe.scored && pipe.x + pipeWidth < birdX) {
            score++;
            pipe.scored=true;
        }    
    }
}


function jump(){
    if (!gamestart) {
        gamestart=true;
    }
    if (gameOver) {
        
    }



    if (velocity > jumpStrength) {
        velocity = jumpStrength;
    }
}

updateGame();