const path = require("path");
require("dotenv").config({ path: path.resolve(process.cwd(), ".env.local") });

const { query } = require("../data/db");
const { uuid } = require("uuidv4");

console.log(process.argv);

(async () => {
  if (process.argv.length < 3) {
    console.log("usage: invite_user.js <name>");
  }

  const name = process.argv[2].toLowerCase().trim();
  const invite_token = uuid();

  const sql = `
    INSERT INTO users(name, invite_token) 
    VALUES($1, $2)
    ON CONFLICT (name) DO
        UPDATE SET invite_token = $2, auth_token = NULL;`;

  const res = await query(sql, [name, invite_token]);
  console.log(res);
  console.log(invite_token);
})();
