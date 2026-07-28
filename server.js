import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import pg from 'pg';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// PostgreSQL Connection String
const dbUrl = process.env.DATABASE_URL || "postgres://postgres:mYQoWBeCvX69JpRRf6RlOaOHihERjeQsUVxdqnLZflDZOL0G3UAr7s2LfNmT9Uje@91.107.212.235:25432/postgres";

const pool = new pg.Pool({
  connectionString: dbUrl,
  ssl: false,
  connectionTimeoutMillis: 10000
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle PostgreSQL client', err);
});

/**
 * Universal Resilient Media Asset Handler.
 * Intercepts requests for PDFs, SVGs, and Images and streams them directly from PostgreSQL camitoons_media_assets.
 */
async function handleMediaRequest(req, res, next) {
  try {
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

    const result = await pool.query(query, [cleanPath, fileName, cleanFileName]);

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
    const dbTest = await pool.query('SELECT COUNT(*) FROM camitoons_media_assets');
    res.status(200).json({ 
      status: 'ok', 
      service: 'CamiToons Web App & Media API',
      dbConnected: true,
      totalMediaAssets: parseInt(dbTest.rows[0].count, 10) 
    });
  } catch (err) {
    res.status(200).json({ 
      status: 'ok', 
      service: 'CamiToons Web App & Media API',
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
  console.log(`Connected to PostgreSQL database at ${dbUrl.replace(/:[^:@]+@/, ':****@')}`);
});
