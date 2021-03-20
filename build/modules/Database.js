"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Database = void 0;
const sqlite3_1 = __importDefault(require("sqlite3"));
const events_1 = require("events");
const path_1 = __importDefault(require("path"));
const DATABASE_PATH = path_1.default.join(__dirname, "../", "database.sqlite3");
class Database extends events_1.EventEmitter {
    constructor() {
        super();
    }
    rewrite(uuid, reverse) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.getWristband(uuid);
            return new Promise(resolve => {
                var _a;
                (_a = this.raw) === null || _a === void 0 ? void 0 : _a.all(`
                UPDATE serials
                SET rewrites = rewrites + ?
                WHERE uuid = ?
            `, [reverse ? -1 : 1, uuid], () => resolve());
            });
        });
    }
    getWristband(uuid) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.serialFromDatabase(uuid);
            if (!!data)
                return data;
            return new Promise(resolve => {
                var _a;
                (_a = this.raw) === null || _a === void 0 ? void 0 : _a.all(`
                INSERT INTO serials
                (uuid) VALUES (?)
            `, [uuid], () => {
                    resolve(this.serialFromDatabase(uuid));
                });
            });
        });
    }
    serialFromDatabase(uuid) {
        return new Promise((resolve, reject) => {
            var _a;
            (_a = this.raw) === null || _a === void 0 ? void 0 : _a.all(`
                SELECT * FROM serials
                WHERE uuid = ?
            `, [uuid], (_, [res]) => {
                resolve(res);
            });
        });
    }
    initialize() {
        return new Promise(resolve => {
            var _a;
            (_a = this.raw) === null || _a === void 0 ? void 0 : _a.run(`
                CREATE TABLE IF NOT EXISTS
                serials (
                    uuid TEXT,
                    rewrites INTEGER DEFAULT 0
                )
            `, () => resolve());
        });
    }
    connect() {
        return new Promise((resolve, reject) => {
            this.raw = new sqlite3_1.default.Database(DATABASE_PATH, err => {
                if (!err) {
                    this.initialize().then(() => {
                        this.emit('ready');
                        resolve();
                    });
                    return;
                }
                this.emit('error', err);
                reject(err);
            });
        });
    }
}
exports.Database = Database;
