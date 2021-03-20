function shiftSerialNumber(
    serialNumber: string,
    passes: number = 1
): string {
    if (passes <= 0 || !serialNumber) 
        return serialNumber;

    const nybbles: string[] = [...serialNumber];
    const rotated: string[] = nybbles.map(nybble => {
        const nudged = (parseInt(nybble, 16) + passes) % 16;
        return nudged.toString(16);
    })

    return rotated.join("");
}