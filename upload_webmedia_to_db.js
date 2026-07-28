import pg from 'pg';
import fs from 'fs';
import path from 'path';

const { Client } = pg;
const connectionString = process.env.DATABASE_URL || "postgres://postgres:mYQoWBeCvX69JpRRf6RlOaOHihERjeQsUVxdqnLZflDZOL0G3UAr7s2LfNmT9Uje@91.107.212.235:25432/postgres";

const mediaRootDir = '/Users/emmanuelayala/Desktop/CamiToons/REPOS/webmedia';

function getMimeType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  switch (ext) {
    case '.webp': return 'image/webp';
    case '.jpeg':
    case '.jpg': return 'image/jpeg';
    case '.png': return 'image/png';
    case '.svg': return 'image/svg+xml';
    case '.pdf': return 'application/pdf';
    default: return 'application/octet-stream';
  }
}

function getAllFiles(dirPath, arrayOfFiles = []) {
  if (!fs.existsSync(dirPath)) return arrayOfFiles;
  const files = fs.readdirSync(dirPath);

  files.forEach(file => {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      arrayOfFiles = getAllFiles(fullPath, arrayOfFiles);
    } else {
      if (!file.startsWith('.')) {
        arrayOfFiles.push(fullPath);
      }
    }
  });

  return arrayOfFiles;
}

async function migrateWebmediaToDB() {
  console.log("🚀 Starting efficient upload of webmedia assets to PostgreSQL...");
  const client = new Client({ connectionString, ssl: false, query_timeout: 60000 });
  await client.connect();

  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS camitoons_media_assets (
        id SERIAL PRIMARY KEY,
        asset_path VARCHAR(500) UNIQUE NOT NULL,
        asset_type VARCHAR(50) NOT NULL,
        content_type VARCHAR(100) NOT NULL,
        data_base64 TEXT NOT NULL,
        size_bytes BIGINT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `);

    const existingRes = await client.query('SELECT asset_path FROM camitoons_media_assets');
    const existingPaths = new Set(existingRes.rows.map(r => r.asset_path));
    console.log(`ℹ️ Database currently has ${existingPaths.size} assets.`);

    const files = getAllFiles(mediaRootDir);
    console.log(`📁 Processing ${files.length} local files...\n`);

    let uploadedCount = 0;
    let skippedCount = 0;
    let totalBytes = 0;

    for (let i = 0; i < files.length; i++) {
      const filePath = files[i];
      const relPath = path.relative(mediaRootDir, filePath).replace(/\\/g, '/');

      if (existingPaths.has(relPath)) {
        skippedCount++;
        if (skippedCount % 50 === 0) {
          console.log(`  [${i + 1}/${files.length}] Skipped existing: ${relPath}`);
        }
        continue;
      }

      try {
        const fileData = fs.readFileSync(filePath);
        const base64Data = fileData.toString('base64');
        const contentType = getMimeType(filePath);
        const ext = path.extname(filePath).toLowerCase().replace('.', '');

        await client.query(`
          INSERT INTO camitoons_media_assets (asset_path, asset_type, content_type, data_base64, size_bytes)
          VALUES ($1, $2, $3, $4, $5)
          ON CONFLICT (asset_path) DO UPDATE SET
            data_base64 = EXCLUDED.data_base64,
            size_bytes = EXCLUDED.size_bytes
        `, [relPath, ext, contentType, base64Data, fileData.length]);

        uploadedCount++;
        totalBytes += fileData.length;
        console.log(`  [${i + 1}/${files.length}] Uploaded: ${relPath} (${(fileData.length / 1024).toFixed(1)} KB)`);
      } catch (err) {
        console.error(`❌ Error uploading ${relPath}:`, err.message);
      }
    }

    console.log(`\n🎉 MIGRATION COMPLETE! Uploaded: ${uploadedCount} | Skipped: ${skippedCount} | Total Size: ${(totalBytes / (1024 * 1024)).toFixed(2)} MB.`);
  } catch (err) {
    console.error("❌ Migration error:", err);
  } finally {
    await client.end();
  }
}

migrateWebmediaToDB();
