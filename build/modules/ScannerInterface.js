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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScannerInterface = void 0;
const input_event_1 = __importDefault(require("input-event"));
const events_1 = require("events");
const keys = require('../maps/keys.json');
const input = new input_event_1.default('/dev/input/event0');
const keyboard = new input_event_1.default.Keyboard(input);
class ScannerInterface extends events_1.EventEmitter {
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
        return __awaiter(this, void 0, void 0, function* () {
            const uuid = this.sequence.join("");
            return uuid;
        });
    }
}
exports.ScannerInterface = ScannerInterface;
