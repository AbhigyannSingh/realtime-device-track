const express = require("express");
const socketio = require("socket.io");
const http = require("http");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const port = 8000;

app.set("view engine", "ejs");
app.set(express.static(path.join(__dirname,"public")));
app.use(express.static('public'))


io.on("connection", function (socket){
    console.log("connected");
    socket.on("send-location", function(data){
        io.emit("received-location", {
            i: socket.id,...data,
        })
    })

    socket.on("disconnect", function(){
        io.emit("user-disconnected", socket.id)
    })
    
    
})


app.get("/", function (req, res){
    res.render("index")
})

server.listen(port, ()=>{
    console.log(`Server is running on port ${port}`)
})