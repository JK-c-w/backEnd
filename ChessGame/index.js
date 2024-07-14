const express=require('express');
const socket=require('socket.io');
const http=require('http')
const path=require('path');
// create a express_server 
const app=express();
// create a http_server based on express_server
const server=http.createServer(app);
// contect the socket with express_Server
const io=socket(server);
// set chess.js
const {Chess}=require('chess.js');
// chess object have all the logic
const chess=new Chess();
const player={};
let currentPlayer="w";

app.set('view engine','ejs');
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,'public')))

app.get('/',function(req,res){
    res.render('index',{title:chess});
})

//   Connection Establishment
io.on("connection",function(unq){
    console.log("connected");
    // Role Assign To Players
    if(!player.white) {
        player.white=unq.id;
        // console.log("White")
        unq.emit("color","w",currentPlayer);}
    else if(!player.black) {
        player.black=unq.id;
        // console.log("Black");
        unq.emit("color","b",currentPlayer);}
    else {
        unq.emit("spectators");
    }    
    // Validation Of Move 
    unq.on("move",(move)=>{
        if (chess.isCheckmate() || chess.isDraw()) {
            io.emit("winner",winner,currentPlayer);

        }
        else if(chess.isCheck()){
            console.log("checkmate");
            unq.emit("Danger",move);
        }
       else{
        try{
        // Checking the Right Player Move    
        if(chess.turn()==="w" && player.white!=unq.id) return;
        if(chess.turn()==="b" && player.black!=unq.id) return;
        
        // Check Right Move of Right Player
        let result=chess.move(move);
        if(result){
            // Right Move
            currentPlayer=chess.turn();
            // console.log("Right move");
            io.emit("move",move,currentPlayer);
            io.emit("Board",chess.fen());
            // console.log("changeBorde");
        }
        else{
            //Wrong Move
            console.log("Invalid move")
            unq.emit("wrong Move",move);
        }
        } catch(err){
            // Error Handling
            console.log(err)
            unq.emit("Invalid move",move);
            // console.log(err);
        }
    }
    })
    // Diconnection 
    unq.on("disconnect",function(){
        if(unq.id===player.white){
            console.log("disconnection white");
            delete player.white ;}
        else if( unq.id===player.black){
            console.log("disconnection black");
         delete player.black;
        }
    })
   

})


server.listen(3000);