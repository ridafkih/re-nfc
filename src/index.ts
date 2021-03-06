import { Wristband } from './interfaces/Wristband';
import { Database } from './modules/Database';
import { NFCScanner } from './modules/NFCScanner';
import { WebSocket } from './modules/WebSocket';

new Database().initialize().then(handleDatabase);
const websocket = new WebSocket();

function handleDatabase(database: Database) {
    websocket.startServer();
    websocket.on('ready', () => handleWebSocket(database));
    console.info("SQLite3 Database Hooked");
}

function handleWebSocket(database: Database) {
    const scanner = new NFCScanner();
    
    websocket.io.on('connection', socket => {
        socket.emit('valid-input', !!scanner.keyboard);
    })

    scanner.on('keyboard-registered', () => {
        websocket.io.emit('keyboard-registered');
    })

    scanner.on('keyboard-registration-failed', () => {
        websocket.io.emit('keyboard-registration-failed');
    })

    scanner.on('scan', async (serialNumber: string) => {
        const { uuid, rewrites }: Wristband = database.getWristband(serialNumber);
        const newSerialNumber: string = shiftSerialNumber(uuid, rewrites);
        websocket.io.emit('scan', serialNumber);
        console.table({ rewrites, serialNumber, newSerialNumber });
    })

    // --== API Requests ==--

    websocket.app.get('/getWristband/:serialNumber', async (req: any, res: any) => {
        const { serialNumber } = req.params;
        const { uuid, rewrites }: Wristband = database.getWristband(serialNumber);
        const newSerialNumber: string = shiftSerialNumber(uuid, rewrites);
        res.json({ uuid, rewrites, newSerialNumber });
    });

    websocket.app.get('/rewriteWristband/:serialNumber', (req: any, res: any) => {
        const { serialNumber } = req.params;
        database.rewrite(serialNumber);
        res.sendStatus(200);
    });

    console.info("IO/Express Server Started");
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