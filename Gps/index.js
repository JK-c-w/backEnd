const express=require('express');
const http=require('http');
const path = require('path');
const Socket  = require('socket.io');
const app=express();
const server=http.createServer(app);
const io=Socket(server);

app.set("view engine",'ejs');
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,"public")));

app.get('/',(req,res)=>{
   res.render('index',{title:"GPS"});
})
io.on("connection",(unq)=>{
    console.log("Connected");
    unq.on("send-location",(data)=>{
        console.log("recibed");
        unq.emit("recived location",{id:unq.id,...data});
    })
})
io.on("disconnection",(unq)=>{
    console.log("disconnection");
    io.emit("user-disconnected",(unq.id))
})

server.listen(3000);
