import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import pg from 'pg';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// PostgreSQL Connection Pool
const dbUrl = process.env.DATABASE_URL || "postgres://postgres:mYQoWBeCvX69JpRRf6RlOaOHihERjeQsUVxdqnLZflDZOL0G3UAr7s2LfNmT9Uje@91.107.212.235:25432/postgres";
const pool = new pg.Pool({
  connectionString: dbUrl,
  ssl: process.env.NODE_ENV === 'production' && !dbUrl.includes('localhost') && !dbUrl.includes('91.107.212.235') ? { rejectUnauthorized: false } : false
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle PostgreSQL client', err);
});

// Dynamic Media Asset Endpoint from camitoons-db PostgreSQL
app.get('/api/media/*', async (req, res) => {
  try {
    const requestedPath = decodeURIComponent(req.params[0]).replace(/^\/+/, '');
    
    const result = await pool.query(
      'SELECT content_type, data_base64 FROM camitoons_media_assets WHERE asset_path = $1 OR asset_path ILIKE $1 LIMIT 1',
      [requestedPath]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Media asset not found', path: requestedPath });
    }

    const { content_type, data_base64 } = result.rows[0];
    const imageBuffer = Buffer.from(data_base64, 'base64');

    res.setHeader('Content-Type', content_type);
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    res.setHeader('Content-Length', imageBuffer.length);
    res.status(200).send(imageBuffer);
  } catch (err) {
    console.error('Error serving media asset:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Healthcheck Endpoint for Coolify
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', service: 'CamiToons Web App & Media API' });
});

// Serve Static Frontend Assets from dist
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
