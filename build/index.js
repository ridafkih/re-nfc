"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const Database_1 = require("./modules/Database");
const NFCScanner_1 = require("./modules/NFCScanner");
const WebSocket_1 = require("./modules/WebSocket");
const database = new Database_1.Database();
const websocket = new WebSocket_1.WebSocket();
database.on('ready', handleDatabase);
function handleDatabase() {
    websocket.startServer();
    websocket.on('ready', handleWebSocket);
    console.log("database >> started");
}
function handleWebSocket() {
    const scanner = new NFCScanner_1.NFCScanner();
    scanner.on('scan', (serialNumber, isOverThreshold) => __awaiter(this, void 0, void 0, function* () {
        if (isOverThreshold)
            yield database.rewrite(serialNumber);
        const { uuid, rewrites } = yield database.getWristband(serialNumber);
        websocket.io.emit('scan', shiftSerialNumber(uuid, rewrites));
    }));
    console.log("io & express server >> online");
}
function shiftSerialNumber(serialNumber, rewrites = 1) {
    if (rewrites <= 0 || !serialNumber)
        return serialNumber;
    const body = serialNumber.substr(0, serialNumber.length - 2);
    const tail = serialNumber.substr(-2);
    const nybbles = [...body];
    const rotatedHead = nybbles.map(nybble => {
        const nudged = (parseInt(nybble, 16) + rewrites) % 16;
        return nudged.toString(16);
    }).join("");
    return rotatedHead + tail;
}
