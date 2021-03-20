"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NFCScanner = void 0;
const input_event_1 = __importDefault(require("input-event"));
const events_1 = require("events");
const keys = require('../maps/keys.json');
const input = new input_event_1.default('/dev/input/event0');
const keyboard = new input_event_1.default.Keyboard(input);
class NFCScanner extends events_1.EventEmitter {
    constructor() {
        super();
        this.sequence = [];
        this.history = {
            last: undefined,
            count: 0
        };
        keyboard.on('keypress', ({ code }) => {
            const key = keys[code].substr(4);
            if (key == "SLASH")
                return this.process();
            if (key == "SEMICOLON")
                return this.sequence = [];
            if (key.length == 1)
                this.sequence.push(key.toLowerCase());
        });
    }
    process() {
        const { count, last } = this.history;
        const uuid = this.sequence.join("");
        const timeout = setTimeout(() => {
            if (last == uuid)
                this.history.count--;
            if (!count)
                this.history.last = undefined;
        }, 10000);
        if (last == uuid)
            this.history.count++;
        else {
            this.history.last = uuid;
            this.history.count = 1;
        }
        if (count == 10) {
            this.history.last = undefined;
            this.history.count = 0;
            clearTimeout(timeout);
        }
        this.emit("scan", uuid, count >= 10);
    }
}
exports.NFCScanner = NFCScanner;
