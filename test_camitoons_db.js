import pg from 'pg';
const { Client } = pg;

const connectionString = "postgres://postgres:mYQoWBeCvX69JpRRf6RlOaOHihERjeQsUVxdqnLZflDZOL0G3UAr7s2LfNmT9Uje@91.107.212.235:25432/postgres";

async function testDatabase() {
  console.log("Connecting to camitoons-db PostgreSQL at 91.107.212.235:25432...");
  const client = new Client({ connectionString, ssl: false });
  
  try {
    await client.connect();
    console.log("✅ Successfully connected to camitoons-db PostgreSQL!");

    // 1. Query server version and time
    const res = await client.query('SELECT NOW(), version()');
    console.log("⏱️ Database Server Time:", res.rows[0].now);
    console.log("ℹ️ Server Version:", res.rows[0].version);

    // 2. Create test table
    await client.query(`
      CREATE TABLE IF NOT EXISTS camitoons_assets_test (
        id SERIAL PRIMARY KEY,
        asset_name VARCHAR(255) NOT NULL,
        asset_type VARCHAR(50) NOT NULL,
        data_preview TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log("✅ Table 'camitoons_assets_test' verified/created.");

    // 3. Perform a minimal upload test
    const insertRes = await client.query(`
      INSERT INTO camitoons_assets_test (asset_name, asset_type, data_preview)
      VALUES ($1, $2, $3)
      RETURNING *
    `, ['test_story_1.pdf', 'pdf', 'Sample PDF metadata upload test']);
    
    console.log("✅ Minimal Upload Test Successful! Inserted Record ID:", insertRes.rows[0].id);

    // 4. Retrieve and verify inserted record
    const selectRes = await client.query(`
      SELECT * FROM camitoons_assets_test WHERE id = $1
    `, [insertRes.rows[0].id]);
    
    console.log("🔍 Retrieved Record Verification:", selectRes.rows[0]);
    console.log("🎉 ALL DATABASE CONNECTION AND MINIMAL UPLOAD TESTS PASSED CLEANLY!");
  } catch (err) {
    console.error("❌ Database test failed:", err);
  } finally {
    await client.end();
  }
}

testDatabase();
