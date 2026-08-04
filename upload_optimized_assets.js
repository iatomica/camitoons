import pg from 'pg';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

// Arguments parsing
const args = process.argv.slice(2);
const isProd = args.includes('--prod');
const isLocal = args.includes('--local');

if (!isProd && !isLocal) {
    console.error("❌ Error: Debes especificar el destino: --local o --prod");
    console.log("Uso:\n  node upload_optimized_assets.js --local\n  node upload_optimized_assets.js --prod");
    process.exit(1);
}

const LOCAL_URL = process.env.DATABASE_URL || 'postgres://postgres:Chimichurri1234!@localhost:5432/camitoons_db';
const PROD_URL = process.env.PROD_DATABASE_URL;

const connectionString = isProd ? PROD_URL : LOCAL_URL;

if (!connectionString) {
    console.error(`❌ Error: La URL de conexión para ${isProd ? 'PROD' : 'LOCAL'} no está configurada.`);
    process.exit(1);
}

const multimediaDir = 'c:/Users/Luiti/Desktop/IAtomica/repositories/camitoons-multimedia/optimized';

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

// Recursively traverse directory
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

async function upload() {
    console.log(`🚀 Iniciando carga concurrente de assets optimizados en ${isProd ? 'PRODUCCIÓN' : 'LOCAL'}...`);
    console.log(`Conexión: ${connectionString.replace(/:[^:@]+@/, ':****@')}`);
    console.log(`Directorio de origen: ${multimediaDir}`);

    if (!fs.existsSync(multimediaDir)) {
        console.error(`❌ Error: El directorio de origen no existe: ${multimediaDir}`);
        process.exit(1);
    }

    const pool = new Pool({ connectionString, max: 20 });

    try {
        // Ensure table exists
        await pool.query(`
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

        const files = getAllFiles(multimediaDir);
        console.log(`📁 Encontrados ${files.length} archivos para procesar.`);

        let uploadedCount = 0;
        let totalBytes = 0;
        const queue = [...files];
        const concurrency = 20;

        async function worker() {
            while (queue.length > 0) {
                const filePath = queue.shift();
                if (!filePath) break;

                let relPath = path.relative(multimediaDir, filePath).replace(/\\/g, '/');
                
                // Special mapping for root-level files in optimized folder
                if (!relPath.startsWith('Imagenes/') && !relPath.startsWith('cuentos/') && !relPath.startsWith('colorear/')) {
                    relPath = `Imagenes/${relPath}`;
                }

                try {
                    const fileData = fs.readFileSync(filePath);
                    const base64Data = fileData.toString('base64');
                    const contentType = getMimeType(filePath);
                    const ext = path.extname(filePath).toLowerCase().replace('.', '');

                    await pool.query(`
                      INSERT INTO camitoons_media_assets (asset_path, asset_type, content_type, data_base64, size_bytes)
                      VALUES ($1, $2, $3, $4, $5)
                      ON CONFLICT (asset_path) DO UPDATE SET
                        data_base64 = EXCLUDED.data_base64,
                        size_bytes = EXCLUDED.size_bytes
                    `, [relPath, ext, contentType, base64Data, fileData.length]);

                    uploadedCount++;
                    totalBytes += fileData.length;
                    console.log(`  [${uploadedCount}/${files.length}] Subido: "${relPath}" (${(fileData.length / 1024).toFixed(1)} KB)`);
                } catch (err) {
                    console.error(`❌ Error al subir ${relPath}:`, err.message);
                }
            }
        }

        // Run worker pool
        await Promise.all(Array.from({ length: concurrency }).map(worker));

        console.log(`\n🎉 PROCESO COMPLETADO EN ${isProd ? 'PRODUCCIÓN' : 'LOCAL'}!`);
        console.log(`- Subidos con éxito: ${uploadedCount} de ${files.length} archivos`);
        console.log(`- Peso total: ${(totalBytes / (1024 * 1024)).toFixed(2)} MB`);

    } catch (e) {
        console.error("❌ Falló el script:", e.message);
    } finally {
        await pool.end();
    }
}

upload().catch(console.error);
