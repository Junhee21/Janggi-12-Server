const express = require('express');
const cors = require('cors');
const port = 8000;
const app = express();

app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));
app.use(cors());
app.use('/static', express.static('public')); 
app.get("/", (req, res) => {
  console.log('---');
  res.json({ message: "Welcome to our application." });
});


// api
const db = require("./models");
const Room = db.Room;

app.post("/createJanggi12Room", async (req, res) => {
  await Room.create({
    title: req.body.title,
    player1: req.body.socketId
  })
  .then (room => {
    return (res.json({id: room.id}));
  })
})

app.get("/getJanggi12Rooms", async(req, res) => {
  const rooms = await Room.findAll();
  return (res.json({rooms: rooms}));
})

app.post("/enterJanggi12Room", async(req, res) => {
  const room = await Room.findOne({
    where: { id: req.body.roomId}
  });
  if (room.player2) {
    return (res.json({success: false}));
  } else {
    await Room.update({
      player2: req.body.socketId
    },{
      where: { id: req.body.roomId}
    })
    return (res.json({success: true}))
  }
})

// socket io
const server = app.listen(port, () => {
  console.log(`Server up and running on port ${port}.`)
});

const io = require('socket.io')(server, {
  cors: {
    origin: ["http://localhost:3000"],
    allowedHeaders: ["my-custom-header"],
    credentials: true
  }
});

io.on('connection', (socket) => {
  console.log('----- user connected -----');

  socket.on("player2Enter", (obj) => {
    io.to(obj.receiver).emit("player2Enter", {
      enter: true,
      player2: obj.sender
    });
  })

  socket.on("chat", (obj) => {
    io.to(obj.receiver).emit("chat", {
      msg: obj.msg
    })
  })

  socket.on("ready", (obj) => {
    io.to(obj.receiver).emit("ready", {
      ready: obj.ready
    })
  })

  socket.on("allReady", (obj) => {
    io.to(obj.receiver).emit("allReady", {
      allReady: obj.allReady
    })
  })

  socket.on("janggi12", (obj) => {
    io.to(obj.receiver).emit("janggi12", {
      pieces: obj.pieces,
      pows: obj.pows
    })
  })

  socket.on("result", (obj) => {
    io.to(obj.receiver).emit("result", {
      result: obj.result * -1
    })
  })

  socket.on("otherNickname", (obj) => {
    io.to(obj.receiver).emit("otherNickname", {
      nickname: obj.nickname
    })
  })
});