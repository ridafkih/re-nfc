import InputEvent from 'input-event';
import { EventEmitter } from 'events';

const input = new InputEvent('/dev/input/event0');
const keyboard = new InputEvent.Keyboard(input);

export class ScannerInterface extends EventEmitter {
    constructor() {
        super();
    }
}