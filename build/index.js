"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Storage_1 = require("./modules/Storage");
const storage = new Storage_1.Storage();
function shiftSerialNumber(serialNumber, passes = 1) {
    if (passes <= 0 || !serialNumber)
        return serialNumber;
    const body = serialNumber.substr(0, serialNumber.length - 2);
    const tail = serialNumber.substr(-2);
    const nybbles = [...body];
    const rotatedHead = nybbles.map(nybble => {
        const nudged = (parseInt(nybble, 16) + passes) % 16;
        return nudged.toString(16);
    }).join("");
    return rotatedHead + tail;
}
