import { Storage } from './modules/Storage';

const storage = new Storage();

function shiftSerialNumber(
    serialNumber: string,
    passes: number = 1
): string {
    if (passes <= 0 || !serialNumber) 
        return serialNumber;

    const body = serialNumber.substr(0, serialNumber.length - 2);
    const tail = serialNumber.substr(-2);

    const nybbles: string[] = [...body];
    
    const rotatedHead: string = nybbles.map(nybble => {
        const nudged = (parseInt(nybble, 16) + passes) % 16;
        return nudged.toString(16);
    }).join("");

    return rotatedHead + tail;
}