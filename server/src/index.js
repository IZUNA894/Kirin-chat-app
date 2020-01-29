const express = require("express");
const path = require("path");
const http = require("http");
const socket = require("socket.io");
const Filter= require("bad-words");

var app = express();
var publicPath= path.join(__dirname , "../","/public");
var filter = new Filter();
var server = http.createServer(app);

var io= socket(server)

app.use(express.static(publicPath),(req,res,next)=>{
  next();
});

io.on("connection",(socket)=>{
  // if new user arrives...
        //sendGreetings(socket);
        // sendJoinedbanner(socket);

  socket.on('join', function (name) {
      socket.join(name.toString());
      console.log("joined"+ name);
    });

 // when msg is recieved...
  socket.on("sendMsg",(msg,callback)=>{
    console.log("msg recieved");
    console.log(msg.val);

    if(filter.isProfane(msg.value))
    {

      //socket.emit("msgBlocked");
      callback(undefined,{error:"blocked!"});
    }
    else{
      callback("succes",undefined);
      console.log("msg recieved");
      console.log("sending msg to");
      console.log(msg.reciever);
      //io.sockets.in(msg.reciever).emit('recieveMsg', msg);

      socket.broadcast.to(msg.reciever).emit("recieveMsg",msg);
    // callback(); 
    }

  })


 // if a user leave..
  socket.on("disconnect",()=>{
    sendLeaveBanner(socket);
  });

  console.log("connection establlished");
})

server.listen(3001,()=>{
  console.log("listening on port 3001");
});


function readMsgBanner(socket)
{
  socket.emit("msgRead");
}
function sendGreetings(socket){
  socket.emit("WelcomeGreetings");
}

function sendJoinedbanner(socket)
{
  socket.broadcast.emit("joined");
}
function sendAlert(e){
  socket.broadcast.emit("alert",e);
}
function sendLeaveBanner(socket){
  socket.broadcast.emit("leave");
}
