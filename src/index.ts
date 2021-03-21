import { Wristband } from './interfaces/Wristband';
import { Database } from './modules/Database';
import { NFCScanner } from './modules/NFCScanner';
import { WebSocket } from './modules/WebSocket';

const database = new Database();
const websocket = new WebSocket();

database.on('ready', handleDatabase);

database.connect().then(console.log).catch(console.error);

function handleDatabase() {
    websocket.startServer();
    websocket.on('ready', handleWebSocket);
    
    console.log("database >> started");
}

function handleWebSocket() {
    const scanner = new NFCScanner();

    scanner.on('scan', async (serialNumber: string, isOverThreshold: boolean) => {
        if (isOverThreshold) await database.rewrite(serialNumber);
        const { uuid, rewrites }: Wristband = await database.getWristband(serialNumber);
        websocket.io.emit('scan', shiftSerialNumber(uuid, rewrites));
    })

    console.log("io & express server >> online");
}

function shiftSerialNumber(
    serialNumber: string,
    rewrites: number = 1
): string {
    if (rewrites <= 0 || !serialNumber) 
        return serialNumber;

    const body = serialNumber.substr(0, serialNumber.length - 2);
    const tail = serialNumber.substr(-2);

    const nybbles: string[] = [...body];
    
    const rotatedHead: string = nybbles.map(nybble => {
        const nudged = (parseInt(nybble, 16) + rewrites) % 16;
        return nudged.toString(16);
    }).join("");

    return rotatedHead + tail;
}