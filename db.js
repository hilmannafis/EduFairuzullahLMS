const sql = require("mssql");

const config = {
  user: "nafis-system-server-admin",
  password: "Insyirah03",
  server: "nafis-system-server.database.windows.net",
  database: "nafisproject1",
  options: {
    encrypt: true,
    trustServerCertificate: false
  }
};

const pool = new sql.ConnectionPool(config);
const poolConnect = pool.connect();

module.exports = { sql, pool, poolConnect };


