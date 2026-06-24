import { Pool }  from "../../node_modules/@types/pg";

const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "gos_db",
    port: 5432,
    password: process.env.DB_PASSWORD
}).connect().then(()=>{console.log("connected with database")})
.catch((error)=> console.log(error));


export default pool;