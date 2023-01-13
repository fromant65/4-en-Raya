const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const path = require("path");
const app = express();
const sessions = require("express-session");
const PORT = 3500;
const oneDay = 1000 * 60 * 60 * 24;
const sessionOptions = {
  secret: "1234",
  saveUninitialized: true,
  cookie: { maxAge: oneDay },
  resave: false,
};

//Middleware
app.use(sessions(sessionOptions));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "/public")));

//Routes
app.use("/", require("./routes/root"));

const httpServer = createServer(app);
const io = new Server(httpServer, {
  /* options */
});

let players = [];

io.on("connection", (socket) => {
  let boards = [];
  socket.emit("conn", { id: socket.id });
  //socket.broadcast.emit("get-board");

  socket.on("conn", ({ id }) => {
    if (players.length <= 1) {
      players.push(id);
      console.log(players);
    }
    //io.emit("get-board");
    io.emit("get-board");
  });

  socket.on("board", ({ board }) => {
    console.log("board received: ", board, socket.id);
    if (players.includes(socket.id) && board?.length) {
      boards.push({ board });
    }

    if (boards.length) {
      console.log(
        "boards exists: ",
        boards,
        boards[0]?.board,
        boards[1]?.board
      );
      let board1 = boards[0]?.board?.length || 0;
      let board2 = boards[1]?.board?.length || 0;
      console.log(board1, board2);
      io.emit("new-board", {
        board: board1 > board2 ? boards[0]?.board : boards[1]?.board,
      });
      //boards = [];
      //console.log(boards);
    }
  });

  socket.on("move", ({ fila, columna, id, turno }) => {
    //console.log(fila, columna, id, turno, players[turno]);
    if (turno === players.indexOf(id)) {
      socket.broadcast.emit("move", { fila, columna });
      socket.emit("valid-movement", { fila, columna });
    }
  });

  socket.on("disconnect", () => {
    console.log(socket.id);
    if (players[0] === socket.id) {
      players[0] = players[1];
      players.pop();
      boards = [];
    } else {
      players.pop();
      boards = [];
    }
    //console.log(players);
  });
});

httpServer.listen(PORT, () => console.log(`Server running on port ${PORT}`));
