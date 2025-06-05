const { Pool } = require("pg"); // postgresql
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "postgres",
  password: "naim100200",
  port: 5432,
});
module.exports = pool;
