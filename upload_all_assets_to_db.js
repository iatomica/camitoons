import pg from 'pg';
import fs from 'fs';
import path from 'path';

const { Client } = pg;
const connectionString = process.env.DATABASE_URL || "postgres://postgres:mYQoWBeCvX69JpRRf6RlOaOHihERjeQsUVxdqnLZflDZOL0G3UAr7s2LfNmT9Uje@91.107.212.235:25432/postgres";

async function uploadAllAssets() {
  console.log("🚀 Initializing full migration of PDFs and SVGs to camitoons-db PostgreSQL on Coolify...");
  const client = new Client({ connectionString, ssl: false });
  await client.connect();

  try {
    // 1. Create main media assets table if not exists
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
    console.log("✅ Table 'camitoons_media_assets' ready.");

    const backupDir = '/Users/emmanuelayala/Desktop/CamiToons/REPOS/ASSETS_BACKUP';
    const pdfDir = path.join(backupDir, 'pdf');
    const colorearDir = path.join(backupDir, 'colorear');

    let uploadedCount = 0;
    let totalBytesUploaded = 0;

    // 2. Upload PDFs
    if (fs.existsSync(pdfDir)) {
      const pdfFiles = fs.readdirSync(pdfDir).filter(f => f.endsWith('.pdf'));
      console.log(`\n📚 Found ${pdfFiles.length} PDF books to migrate...`);

      for (const file of pdfFiles) {
        const filePath = path.join(pdfDir, file);
        try {
          const fileData = fs.readFileSync(filePath);
          const base64Data = fileData.toString('base64');
          const relPath = `pdf/${file}`;

          await client.query(`
            INSERT INTO camitoons_media_assets (asset_path, asset_type, content_type, data_base64, size_bytes)
            VALUES ($1, $2, $3, $4, $5)
            ON CONFLICT (asset_path) DO UPDATE SET
              data_base64 = EXCLUDED.data_base64,
              size_bytes = EXCLUDED.size_bytes
          `, [relPath, 'pdf', 'application/pdf', base64Data, fileData.length]);

          uploadedCount++;
          totalBytesUploaded += fileData.length;
          console.log(`  [PDF ${uploadedCount}/${pdfFiles.length}] Uploaded: ${file} (${(fileData.length / (1024 * 1024)).toFixed(2)} MB)`);
        } catch (fileErr) {
          console.error(`  ⚠️ Skipped ${file}: ${fileErr.message}`);
        }
      }
    }

    // 3. Upload SVG Coloring Sheets
    if (fs.existsSync(colorearDir)) {
      const folders = fs.readdirSync(colorearDir).filter(f => fs.statSync(path.join(colorearDir, f)).isDirectory());
      console.log(`\n🎨 Found ${folders.length} coloring folders to migrate...`);

      for (const folder of folders) {
        const folderPath = path.join(colorearDir, folder);
        const svgFiles = fs.readdirSync(folderPath).filter(f => f.endsWith('.svg'));

        for (const file of svgFiles) {
          const filePath = path.join(folderPath, file);
          try {
            const fileData = fs.readFileSync(filePath);
            const base64Data = fileData.toString('base64');
            const relPath = `colorear/${folder}/${file}`;

            await client.query(`
              INSERT INTO camitoons_media_assets (asset_path, asset_type, content_type, data_base64, size_bytes)
              VALUES ($1, $2, $3, $4, $5)
              ON CONFLICT (asset_path) DO UPDATE SET
                data_base64 = EXCLUDED.data_base64,
                size_bytes = EXCLUDED.size_bytes
            `, [relPath, 'colorear_svg', 'image/svg+xml', base64Data, fileData.length]);

            uploadedCount++;
            totalBytesUploaded += fileData.length;
          } catch (fileErr) {
            console.error(`  ⚠️ Skipped SVG ${folder}/${file}: ${fileErr.message}`);
          }
        }
        console.log(`  [SVG] Folder '${folder}' (${svgFiles.length} SVGs uploaded).`);
      }
    }

    console.log(`\n🎉 FULL MIGRATION COMPLETE! Total Assets: ${uploadedCount} | Total Size: ${(totalBytesUploaded / (1024 * 1024)).toFixed(2)} MB uploaded to PostgreSQL.`);
  } catch (err) {
    console.error("❌ Migration error:", err);
  } finally {
    await client.end();
  }
}

uploadAllAssets();
