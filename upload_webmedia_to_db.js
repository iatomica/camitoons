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
  console.log("🚀 Starting complete migration of webmedia (images, PDFs, SVGs) to PostgreSQL...");
  const client = new Client({ connectionString, ssl: false });
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
    console.log("✅ Table 'camitoons_media_assets' verified.");

    const files = getAllFiles(mediaRootDir);
    console.log(`📁 Found ${files.length} media files in REPOS/webmedia to process...\n`);

    let uploadedCount = 0;
    let totalBytes = 0;

    for (const filePath of files) {
      const relPath = path.relative(mediaRootDir, filePath).replace(/\\/g, '/');
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

      if (uploadedCount % 10 === 0 || uploadedCount === files.length) {
        console.log(`  [${uploadedCount}/${files.length}] Uploaded: ${relPath} (${(fileData.length / 1024).toFixed(1)} KB)`);
      }
    }

    console.log(`\n🎉 WEBMEDIA MIGRATION SUCCESSFUL! Uploaded ${uploadedCount} files | Total size: ${(totalBytes / (1024 * 1024)).toFixed(2)} MB in PostgreSQL.`);
  } catch (err) {
    console.error("❌ Migration error:", err);
  } finally {
    await client.end();
  }
}

migrateWebmediaToDB();
