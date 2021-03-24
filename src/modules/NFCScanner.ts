import History from '../interfaces/History';
import { EventEmitter } from 'events';
import InputEvent from 'input-event';
import usbDetect from 'usb-detection';

usbDetect.startMonitoring();
const keys = require('../../keys.json');
export class NFCScanner extends EventEmitter {
    private input: any = this.getInputDevice();
    public keyboard: any = this.getKeyboardInstance(this.input);
    
    private sequence: string[] = [];
    private history: History = {
        last: undefined,
        count: 0
    }

    constructor() {
        super();

        if (this.keyboard)
            this.registerKeyboardListener();

        usbDetect.on('add', () => {
            this.attemptKeyboardRegistration();
        });

        usbDetect.on('remove', () => {
            this.attemptKeyboardRegistration();
        });
    }

    public attemptKeyboardRegistration() {
        this.input = this.getInputDevice();
        this.keyboard = this.getKeyboardInstance(this.input);

        if (this.keyboard)
            this.registerKeyboardListener();
        else
            this.emit('keyboard-registration-failed');
    }

    private getInputDevice() {
        try {
            return new InputEvent('/dev/input/event0')
        } catch (e) {
            return null;
        }
    }

    private getKeyboardInstance(input: any) {
        if (!input) return;
        return new InputEvent.Keyboard(input);
    }

    private registerKeyboardListener() {
        this.keyboard.on('keypress', ({ code }: any) => {
            const key: string = keys[code].substr(4);

            if (key == "SLASH") 
                return this.process();

            if (key == "SEMICOLON") 
                return this.sequence = [];

            if (key.length == 1)
                this.sequence.push(key.toLowerCase());
            
        });

        this.emit('keyboard-registered');
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

        if (this.history.count == 5) {
            this.history.last = undefined;
            this.history.count = 0;
            clearTimeout(timeout);
        }

        this.emit("scan", uuid, count >= 5);
    }
}