import History from '../interfaces/History';
import InputEvent from 'input-event';
import { EventEmitter } from 'events';

const keys = require('../maps/keys.json');
const input = new InputEvent('/dev/input/event0');
const keyboard = new InputEvent.Keyboard(input);

export class ScannerInterface extends EventEmitter {
    private sequence: string[] = [];
    private history: History = {
        last: undefined,
        count: 0
    }

    constructor() {
        super();

        keyboard.on('keypress', ({ code }: any) => {
            const key: string = keys[code].substr(4);

            if (key == "SLASH") 
                return this.process();

            if (key == "SEMICOLON") 
                return this.sequence = [];

            if (key.length == 1)
                this.sequence.push(key.toLowerCase());
            
        });
    }

    process(): void {
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
            
            this.emit("scan", uuid);
            
            clearTimeout(timeout);
        }
    }
}