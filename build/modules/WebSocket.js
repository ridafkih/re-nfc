"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebSocket = void 0;
const events_1 = require("events");
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
class WebSocket extends events_1.EventEmitter {
    constructor() {
        super();
        this.app = express_1.default();
        this.server = http_1.createServer(this.app);
        this.io = new socket_io_1.Server(this.server);
    }
    startServer() {
        this.server.listen(80, () => this.emit("ready"));
    }
}
exports.WebSocket = WebSocket;
