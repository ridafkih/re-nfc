import { Wristband } from '../interfaces/Wristband';
import { EventEmitter } from 'events';
import path from 'path';

import { Low, JSONFile } from 'lowdb';

type DBSchema = {
    wristbands: Wristband[];
}

const DATABASE_PATH = path.join("./", "database.json");
const adapter = new JSONFile<DBSchema>(DATABASE_PATH);

export class Database extends EventEmitter {
    private raw: Low<DBSchema> = new Low(adapter);

    constructor() {
        super();
    }

    rewrite(uuid: string, reverse?: boolean): void {
        const { data } = this.raw;
        const entry: Wristband = this.getWristband(uuid);

        if (!entry)
            data?.wristbands.push(entry);
        else entry.rewrites += (reverse ? -1 : 1);

        this.raw.write();
    }

    getWristband(uuid: string): Wristband {
        const { data } = this.raw;

        const index: number | undefined = data?.wristbands.findIndex(wristband => wristband.uuid === uuid);
        const access: number = typeof index === 'undefined' ? -1 : index;
        const entry: Wristband = data?.wristbands[access] || { uuid, rewrites: 0 };

        if (index === -1) {
            data?.wristbands.push(entry);
            this.raw.write();
        }

        return entry;
    }

    async initialize(): Promise<Database> {
        await this.raw.read();
        this.raw.data ||= { wristbands: [] };
        this.emit("ready");
        return this;
    }

}