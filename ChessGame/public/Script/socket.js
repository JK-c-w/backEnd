
const socket=io();
const chess=new Chess();
let  PlayerColor;
const turn=document.querySelector(".turn");
const boardElement=document.querySelector(".board");
const topText=document.querySelector(".Top h2");
const lowText=document.querySelector('.Low h2');
const topBox=document.querySelector('.Top .box');
const lowBox=document.querySelector('.Low .box');
let tl=gsap.timeline();
const mark=document.querySelector(".mark");
socket.on("color",(color,currentPlayer)=>{
    PlayerColor=color;
    turn.innerText=(currentPlayer==="w")?"White":"Black"
    // console.log(PlayerColor);
    if(PlayerColor==="b"){
        boardElement.classList.add("flipped");
        topText.innerHTML="Player1:";
        console.log(topText.innerText);
        topBox.style.backgroundColor="white";
        lowText.innerText="Player2:";
        lowBox.style.backgroundColor="black";
    }
    DisplayBoard();
})
socket.on("Board",function(fen){
    // console.log("changeBord");
    chess.load(fen);
    DisplayBoard();
})
socket.on("move",(move,currentPlayer)=>{
    chess.move(move);
    // console.log(currentPlayer)
    turn.innerText=(currentPlayer==="w")?"White":"Black"
    DisplayBoard();
})

socket.on("Invalid move",(move)=>{
    // console.log("inva");
    mark.innerHTML="Invalid Move !"
    invalidMove();
})
socket.on("winner ",(winner,cuurentplayer)=>{
     console.log("winner",cuurentplayer);
})
socket.on("Danger",(move)=>{
    console.log("Dan");
     mark.innerHTML="Danger!"
     invalidMove();
})

const DisplayBoard=()=>{
  const board= chess.board();
  boardElement.innerHTML=" ";
//    console.log(board);

  board.forEach((row,rowIndex) => {
     row.forEach((sq,sqIndex)=>{
        const sqElement=document.createElement("div");
        sqElement.classList.add("square",(rowIndex+sqIndex)%2==0?"light":"Dark");
        sqElement.dataset.row=rowIndex;
        sqElement.dataset.col=sqIndex;

        if(sq){
            const PieceElement=document.createElement("div");
            PieceElement.classList.add("piece",(sq.color==="w"?"white":"black"));
            PieceElement.innerText=getUniCode(sq);
            //  console.log(sq.color=== PlayerColor);
            PieceElement.draggable=PlayerColor === sq.color;
            PieceElement.addEventListener("dragstart",(e)=>{
                if(PieceElement.draggable){
                     PieceElement.classList.add("drag");
                    draggedPiece=PieceElement;
                    sourceSqaure={
                        row:rowIndex,
                        col:sqIndex,
                    }
                    e.dataTransfer.setData('text/plan',"");
                    console.log("Dragstart");
                }

            })
            PieceElement.addEventListener("dragend",()=>{
                draggedPiece=null;
                sourceSqaure=null
            })
            sqElement.appendChild(PieceElement); 
        } 
        sqElement.addEventListener("dragover",(e)=>{
            e.preventDefault();
        })
        sqElement.addEventListener("drop",(e)=>{
            console.log("drop hogya");
            e.preventDefault();
            if(draggedPiece){
                const targetSquare={
                    row:parseInt(sqElement.dataset.row),
                    col:parseInt(sqElement.dataset.col)
                }
                HandleMove(sourceSqaure,targetSquare);
            }
        });
        boardElement.appendChild(sqElement);
     })
  });
};
const getUniCode=(piece)=>{
    const code={
        k:"♔",
        q:"♕",
        r:"♖",
        b:"♗",
        p:"♙",
        n:"♘",
        K:"♚",
        Q:"♛",
        R:"♜",
        B:"♝",
        P:"♟",
        N:"♞"
    }
    return code[piece.type] || "";
}

const HandleMove=(source,target)=>{
    console.log("Handle");
 let move={
    from:`${String.fromCharCode(97+source.col)}`+`${String(8-source.row)}`,
    to:`${String.fromCharCode(97+target.col)}`+`${String(8-target.row)}`,
    promotion:'q',
 }
 console.log(move.from,move.to);
  socket.emit("move",move);
}

function invalidMove(){
tl.to('.invalid',{
    x:'550px',
    duration:1
})
tl.to('.invalid .line',{
    x:'0%',
    duration:1.4
})
tl.to('.invalid',{
    x:'950px',
    duration:1
})
tl.to('.invalid .line',{
    x:'100%',
    duration:1.4
})
}

DisplayBoard();