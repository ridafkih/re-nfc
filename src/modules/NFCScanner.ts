import { EventEmitter } from 'events';
import InputEvent from 'input-event';

const keys = require('../../keys.json');

import usbDetect from 'usb-detection';
usbDetect.startMonitoring();

export class NFCScanner extends EventEmitter {
    private input: any = this.getInputDevice();
    public keyboard: any = this.getKeyboardInstance(this.input);
    
    private sequence: string[] = [];

    constructor() {
        super();

        if (this.keyboard) 
            this.registerKeyboardListener();

        usbDetect.on('add', () => this.attemptKeyboardRegistration());
        usbDetect.on('remove', () => this.attemptKeyboardRegistration());
    }

    public attemptKeyboardRegistration() {
        this.input = this.getInputDevice();
        this.keyboard = this.getKeyboardInstance(this.input);

        if (this.keyboard) {
            this.registerKeyboardListener();
        } else {
            this.emit('keyboard-registration-failed');
        }
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
            if (!keys[code]) return;
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
        const uuid = this.sequence.join("");
        this.emit("scan", uuid);
    }
}
