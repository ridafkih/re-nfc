import { EventEmitter } from 'events';

import express from 'express';
import http, { createServer } from "http";
import { Server } from "socket.io";

export class WebSocket extends EventEmitter {
    
    app = express();
    server: http.Server = createServer(this.app);
    io: Server = new Server(this.server, {
        pingInterval: 5000,
        pingTimeout: 10000
    });

    constructor() {
        super();
    }
    
    startServer() {
        this.server.listen(5001, () => this.emit("ready"))
    }

}