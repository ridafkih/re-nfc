function shiftSerialNumber(
    serialNumber: string,
    passes: number = 1
): string {
    if (passes <= 0 || !serialNumber) 
        return serialNumber;

    const head = serialNumber.substr(0, serialNumber.length - 2);
    const tail = serialNumber.substr(-2);

    const nybbles: string[] = [...head];
    const rotated: string[] = nybbles.map(nybble => {
        const nudged = (parseInt(nybble, 16) + passes) % 16;
        return nudged.toString(16);
    })

    return 
}