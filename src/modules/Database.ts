import { Wristband } from '../interfaces/Wristband';
import sqlite3, { Database as SQLite3Database, Statement } from 'better-sqlite3';
import { EventEmitter } from 'events';
import path from 'path';

const DATABASE_PATH = path.join(__dirname, "../", "database.sqlite3");

export class Database extends EventEmitter {
    private raw?: SQLite3Database = new sqlite3(DATABASE_PATH);;

    constructor() {
        super();
    }

    rewrite(uuid: string, reverse?: boolean): void {
        const statement: Statement | undefined = this.raw?.prepare(
            `UPDATE serials
            SET rewrites = rewrites + ?
            WHERE uuid = ?`
        )

        statement?.run(reverse ? -1 : 1, uuid);
    }

    getWristband(uuid: string): Wristband {
        const data = this.serialFromDatabase(uuid);
        if (!!data) return data;

        const statement: Statement | undefined = this.raw?.prepare(`
            INSERT INTO serials
            (uuid) VALUES (?)
        `);

        statement?.run();
        return this.serialFromDatabase(uuid);
    }

    serialFromDatabase(uuid: string): Wristband {
        const statement: Statement | undefined = this.raw?.prepare(`
            SELECT * FROM serials
            WHERE uuid = ?
        `)

        const wristband: Wristband = [] = statement?.get(uuid);
        return wristband;
    }

    initialize(): Database {
        this.raw?.exec(`
            CREATE TABLE IF NOT EXISTS
            serials (
                uuid TEXT,
                rewrites INTEGER DEFAULT 0
            )
        `);

        return this;
    }

}