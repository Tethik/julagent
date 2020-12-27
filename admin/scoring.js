const path = require("path");
require("dotenv").config({ path: path.resolve(process.cwd(), ".env.local") });

const { query } = require("../data/db");
const { uuid } = require("uuidv4");

function score(diff) {
  return diff / (60 * 60 * 1000);
}

const scoring = async () => {
  let sql = `SELECT claims_counted_until FROM scoring`;

  let result = await query(sql);
  const claims_counted_until = result.rowCount > 0 ? result.rows[0].claims_counted_until : new Date("2020-12-20");
  console.log(claims_counted_until);

  const now = new Date(Date.now());
  const diff = now - claims_counted_until;
  console.log(diff);

  // tally claims

  // get state at the time of claims_counted_until, i.e. who had claims before last checkpoint?
  sql = `
  SELECT z.id, c.user_id, c.created_at, z.value
  FROM zones z
  LEFT JOIN (
    SELECT * 
    FROM claims 
    WHERE id IN 
        ( SELECT c2.id FROM
        (
            SELECT MAX(id) as id, zone_id as zone_id 
            FROM claims 
            WHERE created_at <= $1 GROUP BY zone_id
        ) as c2)
    ) c ON z.id = c.zone_id
  WHERE z.live = true
  `;
  result = await query(sql, [claims_counted_until]);
  console.log(result.rows);

  const state = new Map();
  const userScores = new Map();
  // Assume that score was tallied up till checkpoint time to avoid counting double.
  result.rows.forEach((r) => state.set(r.id, { user_id: r.user_id, created_at: claims_counted_until, value: r.value }));

  console.log(state);

  sql = `SELECT * FROM claims WHERE created_at > $1 ORDER BY id ASC`;
  result = await query(sql, [claims_counted_until]);

  console.log();
  console.log("tallying..");
  result.rows.forEach((r) => {
    const prev = state.get(r.zone_id);
    console.log(prev);
    if (prev && prev.user_id) {
      const diff = r.created_at - prev.created_at;
      const s = userScores.get(prev.user_id) || 0;
      const add = score(diff) * prev.value;
      userScores.set(prev.user_id, s + add);
      console.log(prev.user_id, diff, add);
    }
    state.set(r.zone_id, { ...state.get(r.zone_id), ...r });
  });

  // score up current claims until now
  state.forEach((prev) => {
    if (prev && prev.user_id) {
      const diff = now - prev.created_at;
      const s = userScores.get(prev.user_id) || 0;
      const add = score(diff) * prev.value;
      userScores.set(prev.user_id, s + add);
      console.log(prev.user_id, diff, add);
    }
  });

  console.log();
  console.log(userScores);
  console.log();

  // update user scores and saved date
  try {
    const prms = [];
    userScores.forEach((score, user_id) =>
      prms.push(async () => {
        const sql = `UPDATE users SET score = score + $2 WHERE id = $1`;
        return query(sql, [user_id, score]);
      })
    );

    await Promise.all(prms.map((p) => p()));

    sql = "UPDATE scoring SET claims_counted_until = $1";
    await query(sql, [now]);
  } catch (e) {
    console.error(e);
  }
};

// scoring();
// setInterval(scoring, 1000 * 60 * 5);
