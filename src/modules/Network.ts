import express from 'express';
import { createServer } from "http";
import { Server, Socket } from "socket.io";

const app = express();

const httpServer = createServer(app);
const io = new Server(httpServer);

io.on("connection", (socket: Socket) => {
    
});

httpServer.listen(80);