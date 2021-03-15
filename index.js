//0 = empty
//1 = apple
//2 = burger
//3 = black hole
//4 = rock
//5+ = snake
var intervalGame;  
var length;
var score;
var highestScore=0;
var flagInGame;
var matrix = [];
const board = document.getElementById("board");
var headLocation = {
    row: null,
    col: null
};
var burgerLocation = {
    row: null,
    col: null
};
var sadFlag;
var burgerFlag;
var rowDirection;
var colDirection;
var blackHoleLocation=[null,null,null,null];
var idxBlackHole;
var direction;
function initMatrix(matrix)
{
    for(var i=0; i<10; i++) {
    matrix[i] = [];
        for(var j=0; j<10; j++) {
        matrix[i][j] = 0;
        }
    }
    matrix[0][0]=7;
    matrix[0][1]=6;
    matrix[0][2]=5;    
    random(matrix,1);
    var values=random(matrix,3);
    blackHoleLocation[0]=values[0];
    blackHoleLocation[1]=values[1];
    values=random(matrix,3);
    blackHoleLocation[2]=values[0];
    blackHoleLocation[3]=values[1];
}
function random(matrix,type)
{
    var flag=false;
    var row;
    var col;
    while(flag==false)
    {
    row=Math.floor(Math.random() * 10); 
    col=Math.floor(Math.random() * 10); 
        if(matrix[row][col]==0)
        {
            flag=true;
            matrix[row][col]=type;
        }
    }
    return [row,col];
}
function burgerMove(matrix)
{
    var row;
    var col;
    if(matrix[4][4]==0)
    {
        matrix[4][4]=2;
        row=4;
        col=4;
    }
    else if(matrix[4][5]==0)
    {
        matrix[4][5]=2;
        row=4;
        col=5;
    }
    else if(matrix[5][4]==0)
    {
        matrix[5][4]=2;
        row=5;
        col=4;
    }
    else if(matrix[5][5]==0)
    {
        matrix[5][5]=2;
        row=5;
        col=5;
    }
    else
    {
        var values=random(matrix,2);
        row=values[0];
        col=values[1];
    }
    if(burgerFlag==false)
    {
        burgerFlag=true;
    }
    else{
        matrix[burgerLocation.row][burgerLocation.col]=0;
    }
burgerLocation.row=row;
burgerLocation.col=col;
}
function move()
{
    headLocation.row+=rowDirection;
    headLocation.col+=colDirection;

    if( (headLocation.row==10)||(headLocation.col==10)||(headLocation.row==-1)||(headLocation.col==-1)||(matrix[headLocation.row][headLocation.col])>3)
    {
        gameOver()
    }
    else if(matrix[headLocation.row][headLocation.col]==0)
    {
     snakeMove(true);
    if(burgerFlag==true)
    {
        burgerMove(matrix);
    }
    }
    else if(matrix[headLocation.row][headLocation.col]==1)
    {
        eat();        
    }
    else if(matrix[headLocation.row][headLocation.col]==2)
    {
        eatBurger();        
    }
    else if(matrix[headLocation.row][headLocation.col]==3)
    {
        blackHole();        
    }
}
function blackHole()
{
    var swooshAudio = new Audio("sounds/swoosh.mp3");
    swooshAudio.play();
    if(headLocation.row==blackHoleLocation[0]&&headLocation.col==blackHoleLocation[1])
    {
        idxBlackHole=0;
        headLocation.row=blackHoleLocation[2];
        headLocation.col=blackHoleLocation[3];
    }
    else if(headLocation.row==blackHoleLocation[2]&&headLocation.col==blackHoleLocation[3])
    {
        idxBlackHole=2;
        headLocation.row=blackHoleLocation[0];
        headLocation.col=blackHoleLocation[1];
    }
  move();

}
function snakeMove(flag)
{
    
    matrix[headLocation.row][headLocation.col]=5;
    var row=headLocation.row;
    var col=headLocation.col;
    var node=5;
    for(var i=0; i<length; i++)
    {
        if((col+1<10)&&matrix[row][col+1]==node)
        {
            col+=1;
            matrix[row][col]+=1;
        }
        else if((col-1<10)&&matrix[row][col-1]==node)
        {
            col-=1;
            matrix[row][col]+=1;

        }
        else if((row+1<10)&&matrix[row+1][col]==node)
        {

            row+=1;
            matrix[row][col]+=1;
        }
        else if(matrix[row-1][col]==node)
        {
            row-=1;
            matrix[row][col]+=1;
        }
        else
        {
                row=blackHoleLocation[ idxBlackHole];
                col=blackHoleLocation[ idxBlackHole+1];
                node-=1;
                i-=1;
        }
        node+=1;
    }
    if(flag)
    {
        matrix[row][col]=0;
    } 
}
function eat()
{
    var munchAudio = new Audio("sounds/munch.mp3");
    munchAudio.play();
    if(length%6==0)
    {
    var appearenceAudio = new Audio("sounds/appearence.mp3");
    appearenceAudio.play();
    burgerMove(matrix);
    }
    else
    {
        random(matrix,1);
    }
    
        snakeMove(false);
        length+=1;
        if(length%4==0)
        {
            random(matrix,4);
        }
    score+=length*10;
    if(score>highestScore)
    {
        highestScore=score;
    }
}
function eatBurger()
{
    var yummyAudio = new Audio("sounds/yummy.mp3");
    yummyAudio.play();
    burgerFlag=false;
    burgerLocation.row=null;
    burgerLocation.col=null;
    random(matrix,1);
   
      snakeMove(false);
      length+=1;
      if(length%4==0)
      {
          random(matrix,4);
      }
    score+=3000;
    if(score>highestScore)
    {
        highestScore=score;
    }
}
function action(key)
 {
     if(key=="Enter" || key==" ")
     {
         if(document.getElementById("btnStart").disabled==false)
         startGame();
     }
    if(flagInGame)
    {
        if(key=="ArrowRight")
    {
        if(direction!="ArrowLeft")
        {
        rowDirection=0;
        colDirection=1;
        direction="ArrowRight";
        }
    }
    else if(key=="ArrowLeft")
    {
        if(direction!="ArrowRight")
        {
        rowDirection=0;
        colDirection=-1;
        direction="ArrowLeft";
        }
    }
    else if(key=="ArrowUp")
    {
        if(direction!="ArrowDown")
        {
        rowDirection=-1;
        colDirection=0;
        direction="ArrowUp";
        }
    }
    else if(key=="ArrowDown")
    {
        if(direction!="ArrowUp")
        {
        rowDirection=1;
        colDirection=0;
        direction="ArrowDown";
        }
    }
}
}
function restartGame()
{
    length=3;
    score=0;
    direction="ArrowRight";
    rowDirection=0;
    colDirection=1;
    flagInGame=true;
    sadFlag=true;
    burgerFlag=false;
    burgerLocation.row=null;
    burgerLocation.col=null;
    headLocation.row=0;
    headLocation.col=2;
    blackHoleLocation=[null,null,null,null];
    idxBlackHole=null;
    initMatrix(matrix);
    document.getElementById("gameOver").innerHTML=' ';
    board.style.opacity="1";
}
function gameOver()
{
    var sadAudio = new Audio("sounds/sadTrombone.mp3");
    document.getElementById("gameOver").innerHTML='Game Over!!to restart please press enter/space or button ';
    board.style.opacity="0.5";
    if(sadFlag)
    {
    sadAudio.play();
    sadFlag=false;
    }
    flagInGame=false;
    document.getElementById("btnStart").disabled = false;
    clearInterval(intervalGame);
}
function randerBoard(rows, cols) {
    board.innerHTML = '';
    board.style.setProperty('--grid-rows', rows);
    board.style.setProperty('--grid-cols', cols);
    for (var i = 0; i < rows; i++) {
    for(var j = 0; j < cols; j++) {
      let cell = document.createElement("div");
      if(matrix[i][j]==0)
            {
                board.appendChild(cell).className ="cell";
            }
            else if(matrix[i][j]==1)
            {
                board.appendChild(cell).className ="food";
            }
            else if(matrix[i][j]==2)
            {
                board.appendChild(cell).className ="burger";
            }
            else if(matrix[i][j]==3)
            {
                board.appendChild(cell).className ="blackHole";
            }
            else if(matrix[i][j]==4)
            {
                board.appendChild(cell).className ="rock";
            }
            else if(matrix[i][j]==5)
            {
                board.appendChild(cell).className ="snakeFace";
            }
            else{
                board.appendChild(cell).className ="snake";
            }
    }
  }
}
function difficulty()
{
    var interval;
    if(document.getElementById("Beginner").checked ==true)
    {
        interval=3500;
    }
    else if(document.getElementById("Advanced").checked ==true)
    {
        interval=2500;
    }
    else if(document.getElementById("Expert").checked ==true)
    {
        interval=1500;
    }
    return interval;
}
function gameLoop()
{
        move();
        randerBoard(10,10);
        document.getElementById("score").innerHTML=score;
        document.getElementById("highestscore").innerHTML=highestScore;
}
function startGame()
{
   document.getElementById("btnStart").disabled=true;
   var intervalTime=difficulty();
   restartGame();
   randerBoard(10, 10);
   intervalGame=setInterval(gameLoop, intervalTime/10);
}
addEventListener("keydown", function(event)
{
    action(event.key);
});
document.getElementById("btnStart").addEventListener("click",startGame);
document.getElementById("Beginner").checked =true;
restartGame();
randerBoard(10, 10);

