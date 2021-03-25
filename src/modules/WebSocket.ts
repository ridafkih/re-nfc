import { EventEmitter } from 'events';

import express from 'express';
import http, { createServer } from "http";
import { Server } from "socket.io";

export class WebSocket extends EventEmitter {
    
    public app: any = express();
    public server: http.Server = createServer(this.app);
    public io: Server = new Server(this.server, {
        pingInterval: 2500,
        pingTimeout: 7500
    });

    constructor() {
        super();
    }

    functionName() {
        this.app.get('')
    }
    
    public startServer(): void {
        this.server.listen(80, () => this.emit("ready"))
    }

}