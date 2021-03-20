import { Wristband } from '../interfaces/Wristband';
import sqlite3 from 'sqlite3';
import { EventEmitter } from 'events';
import path from 'path';

const DATABASE_PATH = path.join(__dirname, "../", "database.sqlite3");

export class Database extends EventEmitter {
    private raw?: sqlite3.Database;

    constructor() {
        super();
    }

    async rewrite(uuid: string, reverse?: boolean): Promise<void> {
        await this.getWristband(uuid);

        return new Promise(resolve => {
            this.raw?.all(`
                UPDATE serials
                SET rewrites = rewrites + ?
                WHERE uuid = ?
            `, [reverse ? -1 : 1, uuid], () => resolve());
        })
    }

    async getWristband(uuid: string): Promise<Wristband> {
        const data = await this.serialFromDatabase(uuid);
        if (!!data) return data;

        return new Promise(resolve => {
            this.raw?.all(`
                INSERT INTO serials
                (uuid) VALUES (?)
            `, [uuid], () => {
                resolve(this.serialFromDatabase(uuid));
            })
        })
    }

    serialFromDatabase(uuid: string): Promise<Wristband> {
        return new Promise<Wristband>((resolve, reject) => {
            this.raw?.all(`
                SELECT * FROM serials
                WHERE uuid = ?
            `, [uuid], (_, [res]) => {
                resolve(res);
            })
        })
    }

    initialize(): Promise<void> {
        return new Promise(resolve => {
            this.raw?.run(`
                CREATE TABLE IF NOT EXISTS
                serials (
                    uuid TEXT,
                    rewrites INTEGER DEFAULT 0
                )
            `, () => resolve());
        })
    }

    connect(): Promise<void> {
        return new Promise((resolve, reject) => {
            this.raw = new sqlite3.Database(DATABASE_PATH, err => {
                if (!err) {
                    this.initialize().then(() => {
                        this.emit('ready');
                        resolve();
                    })
                    return;
                }
                this.emit('error', err);
                reject(err);
            })
        })
    }

}