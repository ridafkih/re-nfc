import History from '../interfaces/History';
import InputEvent from 'input-event';
import { EventEmitter } from 'events';

const keys = require('../../keys.json');
export class NFCScanner extends EventEmitter {
    private input: any = new InputEvent('/dev/input/event0');
    private keyboard: any = new InputEvent.Keyboard(this.input);

    private sequence: string[] = [];
    private history: History = {
        last: undefined,
        count: 0
    }

    constructor() {
        super();

        this.keyboard.on('keypress', ({ code }: any) => {
            const key: string = keys[code].substr(4);

            if (key == "SLASH") 
                return this.process();

            if (key == "SEMICOLON") 
                return this.sequence = [];

            if (key.length == 1)
                this.sequence.push(key.toLowerCase());
            
        });
    }

    private process(): void {
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

        if (count == 5) {
            this.history.last = undefined;
            this.history.count = 0;
            clearTimeout(timeout);
        }

        this.emit("scan", uuid, count >= 5);
    }
}