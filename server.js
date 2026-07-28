import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import pg from 'pg';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Increase payload limit for batch upload API
app.use(express.json({ limit: '50mb' }));

// PostgreSQL Candidate URLs (handles Coolify internal container, Docker host, and public IP)
const candidateDbUrls = [
  process.env.DATABASE_URL,
  "postgres://postgres:mYQoWBeCvX69JpRRf6RlOaOHihERjeQsUVxdqnLZflDZOL0G3UAr7s2LfNmT9Uje@qwwow8wwowks0k0go0wk8sg8:5432/postgres",
  "postgres://postgres:mYQoWBeCvX69JpRRf6RlOaOHihERjeQsUVxdqnLZflDZOL0G3UAr7s2LfNmT9Uje@host.docker.internal:25432/postgres",
  "postgres://postgres:mYQoWBeCvX69JpRRf6RlOaOHihERjeQsUVxdqnLZflDZOL0G3UAr7s2LfNmT9Uje@172.17.0.1:25432/postgres",
  "postgres://postgres:mYQoWBeCvX69JpRRf6RlOaOHihERjeQsUVxdqnLZflDZOL0G3UAr7s2LfNmT9Uje@91.107.212.235:25432/postgres"
].filter(Boolean);

let activePool = null;

async function initDbPool() {
  for (const connStr of candidateDbUrls) {
    try {
      const p = new pg.Pool({ connectionString: connStr, connectionTimeoutMillis: 3000, ssl: false });
      const testRes = await p.query('SELECT COUNT(*) FROM camitoons_media_assets');
      console.log(`✅ Connected to PostgreSQL via: ${connStr.replace(/:[^:@]+@/, ':****@')} (${testRes.rows[0].count} assets in DB)`);
      activePool = p;
      return p;
    } catch (err) {
      console.log(`⚠️ Connection attempt failed for ${connStr.replace(/:[^:@]+@/, ':****@')}: ${err.message}`);
    }
  }
  console.error("❌ Failed to connect to any PostgreSQL instance!");
  return null;
}

// Initial DB connection attempt
initDbPool();

/**
 * Universal Resilient Media Asset Handler.
 * Intercepts requests for PDFs, SVGs, and Images and streams them directly from PostgreSQL.
 */
async function handleMediaRequest(req, res, next) {
  try {
    if (!activePool) {
      await initDbPool();
    }
    if (!activePool) {
      return next();
    }

    const rawPath = req.path;
    let decodedPath = decodeURIComponent(rawPath);

    // Normalize path by stripping common prefixes
    let cleanPath = decodedPath
      .replace(/^\/api\/media\//i, '')
      .replace(/^\/webmedia\//i, '')
      .replace(/^.*\/webmedia\//i, '')
      .replace(/^\/src\/assets\//i, '')
      .replace(/^\/+/, '');

    const fileName = path.basename(cleanPath);
    const cleanFileName = fileName.replace(/^[-_\s]+/, '').trim();

    // Query database for asset matching cleanPath or fileName
    const query = `
      SELECT content_type, data_base64 FROM camitoons_media_assets 
      WHERE asset_path = $1 
         OR asset_path ILIKE $1 
         OR asset_path ILIKE '%' || $2 
         OR REPLACE(asset_path, '-', '') ILIKE '%' || $3 
      LIMIT 1
    `;

    const result = await activePool.query(query, [cleanPath, fileName, cleanFileName]);

    if (result.rows.length === 0) {
      return next();
    }

    const { content_type, data_base64 } = result.rows[0];
    const imageBuffer = Buffer.from(data_base64, 'base64');

    res.setHeader('Content-Type', content_type);
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    res.setHeader('Content-Length', imageBuffer.length);
    return res.status(200).send(imageBuffer);
  } catch (err) {
    console.error('Error serving media asset from DB:', err);
    return next();
  }
}

// Secure Batch Upload API for populating media assets into PostgreSQL
app.post('/api/upload-batch', async (req, res) => {
  const authHeader = req.headers['x-admin-key'];
  if (authHeader !== 'camitoons-secret-key-2026') {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { items } = req.body;
  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Invalid items array' });
  }

  const pool = activePool || await initDbPool();
  if (!pool) {
    return res.status(500).json({ error: 'Database connection unavailable' });
  }

  let inserted = 0;
  for (const item of items) {
    try {
      await pool.query(`
        INSERT INTO camitoons_media_assets (asset_path, asset_type, content_type, data_base64, size_bytes)
        VALUES ($1, $2, $3, $4, $5)
        ON CONFLICT (asset_path) DO UPDATE SET
          data_base64 = EXCLUDED.data_base64,
          size_bytes = EXCLUDED.size_bytes
      `, [item.relPath, item.ext, item.contentType, item.base64Data, item.sizeBytes]);
      inserted++;
    } catch (err) {
      console.error(`Error inserting ${item.relPath}:`, err.message);
    }
  }

  return res.status(200).json({ success: true, count: inserted });
});

// Intercept all media asset routes
app.get('/api/media/*', handleMediaRequest);
app.get('/pdf/*', handleMediaRequest);
app.get('/colorear/*', handleMediaRequest);
app.get('/images/*', handleMediaRequest);
app.get('/assets/images/*', handleMediaRequest);
app.get('*.webp', handleMediaRequest);
app.get('*.jpeg', handleMediaRequest);
app.get('*.jpg', handleMediaRequest);
app.get('*.png', handleMediaRequest);
app.get('*.pdf', handleMediaRequest);
app.get('*.svg', handleMediaRequest);

// Healthcheck Endpoint
app.get('/health', async (req, res) => {
  try {
    const p = activePool || await initDbPool();
    if (!p) {
      return res.status(200).json({ status: 'ok', service: 'CamiToons Web App', dbConnected: false });
    }
    const dbTest = await p.query('SELECT COUNT(*) FROM camitoons_media_assets');
    res.status(200).json({ 
      status: 'ok', 
      service: 'CamiToons Web App & Media API',
      dbConnected: true,
      totalMediaAssets: parseInt(dbTest.rows[0].count, 10) 
    });
  } catch (err) {
    res.status(200).json({ 
      status: 'ok', 
      service: 'CamiToons Web App',
      dbConnected: false,
      error: err.message 
    });
  }
});

// Serve Static Frontend Bundle from dist
const distPath = path.join(__dirname, 'dist');
app.use(express.static(distPath, {
  maxAge: '1d',
  etag: true
}));

// SPA Fallback for React Router
app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 CamiToons Web Server running on http://0.0.0.0:${PORT}`);
});
