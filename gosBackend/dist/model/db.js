"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("../../node_modules/@types/pg");
const pool = new pg_1.Pool({
    user: "postgres",
    host: "localhost",
    database: "gos_db",
    port: 5432,
    password: process.env.DB_PASSWORD
});
exports.default = pool;
