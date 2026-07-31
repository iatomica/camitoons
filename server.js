import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import pg from 'pg';
import fs from 'fs';
import multer from 'multer';
import sharp from 'sharp';
import dotenv from 'dotenv';

dotenv.config();

// Ensure uploads directory exists
const uploadsDir = path.resolve('uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
const upload = multer({ dest: 'uploads/' });

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

async function initDbSchemaAndSeeds(pool) {
  // Discarded blocks and pages site builder schemas
}

async function initDbPool() {
  for (const connStr of candidateDbUrls) {
    try {
      const p = new pg.Pool({ connectionString: connStr, connectionTimeoutMillis: 3000, ssl: false });
      const testRes = await p.query('SELECT COUNT(*) FROM camitoons_media_assets');
      console.log(`✅ Connected to PostgreSQL via: ${connStr.replace(/:[^:@]+@/, ':****@')} (${testRes.rows[0].count} assets in DB)`);
      activePool = p;
      await initDbSchemaAndSeeds(p);
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

const LEGACY_IMAGE_MAPPINGS = {
  // memotest images
  'gemini_generated_image_9l46tk9l46tk9l46s.webp': 'Imagenes/memotest/Gemini_Generated_Image_9l46tk9l46tk9l46s.webp',
  'gemini_generated_image_bugsgubugsgubugss.webp': 'Imagenes/memotest/Gemini_Generated_Image_bugsgubugsgubugss.webp',
  'gemini_generated_image_dyn7gqdyn7gqdyn7s.webp': 'Imagenes/memotest/Gemini_Generated_Image_dyn7gqdyn7gqdyn7s.webp',
  'gemini_generated_image_e7erqfe7erqfe7ers.webp': 'Imagenes/memotest/Gemini_Generated_Image_e7erqfe7erqfe7ers.webp',
  'gemini_generated_image_fsmgzqfsmgzqfsmgs.webp': 'Imagenes/memotest/Gemini_Generated_Image_fsmgzqfsmgs.webp',
  'gemini_generated_image_kploabkploabkplos.webp': 'Imagenes/memotest/Gemini_Generated_Image_kploabkploabkplos.webp',
  'gemini_generated_image_qajnlkqajnlkqajns.webp': 'Imagenes/memotest/Gemini_Generated_Image_qajnlkqajnlkqajns.webp',
  'gemini_generated_image_vfm0ayvfm0ayvfm0s.webp': 'Imagenes/memotest/Gemini_Generated_Image_vfm0ayvfm0ayvfm0s.webp',
  'gemini_generated_image_xej6k2xej6k2xej6s.webp': 'Imagenes/memotest/Gemini_Generated_Image_xej6k2xej6k2xej6s.webp',
  'baldes.webp': 'Imagenes/memotest/baldes.webp',
  'guitarra.webp': 'Imagenes/memotest/guitarra.webp',
  'torta.webp': 'Imagenes/memotest/torta.webp',

  // escondidas
  '7.webp': 'Imagenes/escondidas/los panaderos.webp',
  '8.webp': 'Imagenes/escondidas/Los cinco patitos.webp',
  '9.webp': 'Imagenes/escondidas/La odontologa.webp',
  '10.webp': 'Imagenes/escondidas/la escuela.webp',
  '11.webp': 'Imagenes/escondidas/la amiga de luna.webp',
  'gemini_generated_image_3d4nt3d4nt3d4nt3.webp': 'Imagenes/escondidas/el abuelo.webp',
  'gemini_generated_image_4c9e3a4c9e3a4c9e.webp': 'Imagenes/escondidas/ananá.webp',
  'gemini_generated_image_a6s1cla6s1cla6s1.webp': 'Imagenes/escondidas/el sapo.webp',
  'gemini_generated_image_x3f56dx3f56dx3f5.webp': 'Imagenes/escondidas/el gato marcos.webp',
  'gemini_generated_image_vg7e41vg7e41vg7e(1).webp': 'Imagenes/escondidas/el parque y los perros .webp',
  'gemini_generated_image_vg7e41vg7e41vg7e (1).webp': 'Imagenes/escondidas/el parque y los perros .webp',
  'gemini_generated_image_jalv2jjalv2jjalv.webp': 'Imagenes/escondidas/el hermanito .webp',
  'gemini_generated_image_xhjz0exhjz0exhjz.webp': 'Imagenes/escondidas/el elefante oculto.webp',
  'gemini_generated_image_z8tdo0z8tdo0z8td.webp': 'Imagenes/escondidas/Luna y el tren.webp',
  'gemini_generated_image_gm3p7agm3p7agm3p.webp': 'Imagenes/escondidas/la hermana de luna .jpeg',
  'la hermana de luna.jpeg': 'Imagenes/escondidas/la hermana de luna .jpeg',

  // diferencias
  'gemini_generated_image_v2n0dyv2n0dyv2n0.webp': 'Imagenes/diferencias/arbolito original.webp',
  'u6114657252_llena_--ar_21_--v_7_fc37f6b4-6d57-4612-832e-5562e122551d_0.webp': 'Imagenes/diferencias/arbolito diferencias.webp',
  'gemini_generated_image_gugjf7gugjf7gugj.webp': 'Imagenes/diferencias/botas original.webp',
  'u6114657252_rellename_lo_que_falta_v7_--ar_21_--v_7_93538528-6dad-4a10-9406-d37ded71d684_2.webp': 'Imagenes/diferencias/botas diferencias.webp',
  'gemini_generated_image_bu1rnebu1rnebu1r.webp': 'Imagenes/diferencias/exploradores original.webp',
  'gemini_generated_image_sr0a7psr0a7psr0a.webp': 'Imagenes/diferencias/exploradores diferencias.webp',
  'gemini_generated_image_tev7aitev7aitev7.webp': 'Imagenes/diferencias/jardin original.webp',
  'u6114657252_jardin_de_infantes_--ar_21_--v_7_9e563149-b39f-44bf-9059-9c6c65a17136_0.webp': 'Imagenes/diferencias/jardin Diferencias.webp',
  '1-.webp': 'Imagenes/diferencias/Caballos original.webp',
  'gemini_generated_image_z0mkehz0mkehz0mk.webp': 'Imagenes/diferencias/Caballos diferencias.webp',
  '6.webp': 'Imagenes/diferencias/lunaysupapa original.webp',
  'gemini_generated_image_uaf3vvuaf3vvuaf3.webp': 'Imagenes/diferencias/lunaysupapa Diferencias.webp',
  '0108.webp': 'Imagenes/diferencias/playa original.webp',
  'gemini_generated_image_wn8u1rwn8u1rwn8u.webp': 'Imagenes/diferencias/playa Diferencias.webp',
  '12(2).webp': 'Imagenes/diferencias/bloques original.webp',
  'gemini_generated_image_jy9rvcjy9rvcjy9r(1).webp': 'Imagenes/diferencias/bloques diferencias.webp',
  'gemini_generated_image_jy9rvcjy9rvcjy9r (1).webp': 'Imagenes/diferencias/bloques diferencias.webp',

  // General luna images
  'camitoons-1500-x-450-px.webp': 'Imagenes/CamiToonsLogo.webp',
  'luna-y-los-sonidos-.webp': 'Imagenes/rompecabezas/10.jpeg',
  'luna-portada-web.jpeg': 'Imagenes/personajes/luna-portada-web.jpeg',
  'abuela-elsa.webp': 'Imagenes/personajes/arbol de vinculos/Abuela Elsa .webp',
  'abuelo-angel.webp': 'Imagenes/personajes/arbol de vinculos/Abuelo angel.webp',
  'hermana.webp': 'Imagenes/personajes/arbol de vinculos/hermana.webp',
  'hermano.webp': 'Imagenes/personajes/arbol de vinculos/hermano.webp',
  'mama.webp': 'Imagenes/personajes/arbol de vinculos/mama.webp',
  'papa.webp': 'Imagenes/personajes/arbol de vinculos/papa.webp',
  'jazmin.webp': 'Imagenes/personajes/arbol de vinculos/jazmin.webp',
  'amigos-pares.webp': 'Imagenes/personajes/arbol de vinculos/amigos-pares.webp',
  'luna-central.webp': 'Imagenes/personajes/arbol de vinculos/luna.webp',
  'anana.webp': 'Imagenes/personajes/arbol de vinculos/anana.webp',
  'marcos.webp': 'Imagenes/personajes/arbol de vinculos/marcos.webp',
  'prima.webp': 'Imagenes/personajes/arbol de vinculos/prima.webp',
  'cami_author_photo.webp': 'Imagenes/cami autora.webp',

  // puzzle/rompecabezas mapping
  'diseno-sin-titulo-1.webp': 'Imagenes/rompecabezas/1.jpeg',
  'diseno-sin-titulo-2.webp': 'Imagenes/rompecabezas/2.jpeg',
  'diseno-sin-titulo-3.webp': 'Imagenes/rompecabezas/4.jpeg',
  'diseno-sin-titulo-4.webp': 'Imagenes/rompecabezas/5.jpeg',
  'diseno-sin-titulo-5.webp': 'Imagenes/rompecabezas/6.jpeg',
  'diseno-sin-titulo-6.webp': 'Imagenes/rompecabezas/8.jpeg',
  'diseno-sin-titulo-7.webp': 'Imagenes/rompecabezas/9.jpeg'
};

// Caching DB assets
let dbAssetsCache = null;
let lastCacheUpdate = 0;
const CACHE_TTL = 300000; // 5 minutes

async function getDbAssets(pool) {
  const now = Date.now();
  if (dbAssetsCache && (now - lastCacheUpdate < CACHE_TTL)) {
    return dbAssetsCache;
  }
  try {
    const res = await pool.query('SELECT id, asset_path, content_type FROM camitoons_media_assets');
    dbAssetsCache = res.rows;
    lastCacheUpdate = now;
    return dbAssetsCache;
  } catch (err) {
    console.error('Error fetching assets for cache:', err);
    return dbAssetsCache || [];
  }
}

function normalizeForMatch(str) {
  if (!str) return '';
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // remove accents
    .replace(/^(colorear|portada|cuento|listo|falta)\b/gi, '')
    .replace(/[^a-z0-9]/g, '');
}

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

    // 1. Try explicit translation from mappings
    const normalizedRequestedFileName = fileName.toLowerCase();
    if (LEGACY_IMAGE_MAPPINGS[normalizedRequestedFileName]) {
      const dbPath = LEGACY_IMAGE_MAPPINGS[normalizedRequestedFileName];
      const result = await activePool.query('SELECT content_type, data_base64 FROM camitoons_media_assets WHERE asset_path = $1', [dbPath]);
      if (result.rows.length > 0) {
        const { content_type, data_base64 } = result.rows[0];
        const imageBuffer = Buffer.from(data_base64, 'base64');
        res.setHeader('Content-Type', content_type);
        res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
        res.setHeader('Content-Length', imageBuffer.length);
        return res.status(200).send(imageBuffer);
      }
    }

    // 2. Try direct query by path or ending filename in PostgreSQL
    const query = `
      SELECT content_type, data_base64 FROM camitoons_media_assets 
      WHERE asset_path = $1 
         OR asset_path ILIKE $1 
         OR asset_path ILIKE '%' || $2 
         OR REPLACE(asset_path, '-', '') ILIKE '%' || $3 
      ORDER BY 
        CASE 
          WHEN asset_path = $1 THEN 1
          WHEN asset_path ILIKE $1 THEN 2
          WHEN asset_path ILIKE '%' || $2 THEN 3
          ELSE 4
        END
      LIMIT 1
    `;
    const result = await activePool.query(query, [cleanPath, fileName, cleanFileName]);

    if (result.rows.length > 0) {
      const { content_type, data_base64 } = result.rows[0];
      const imageBuffer = Buffer.from(data_base64, 'base64');
      res.setHeader('Content-Type', content_type);
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
      res.setHeader('Content-Length', imageBuffer.length);
      return res.status(200).send(imageBuffer);
    }

    // 3. Fallback to cache and smart normalized match (resilient matching)
    const allAssets = await getDbAssets(activePool);
    const normRequestedFileName = normalizeForMatch(fileName);
    
    // Check if it's a cover request from catalog preview
    const isCatalogPreview = cleanPath.includes('/catalog/') || cleanPath.includes('/TERMINADOS/');
    let matchedAsset = null;

    if (isCatalogPreview) {
      // Find the folder name in cleanPath (e.g. "1 luna y los sonidos-")
      const parts = cleanPath.split('/');
      const bookFolder = parts.find(p => p.toLowerCase().includes('luna') || p.toLowerCase().includes('cambio') || p.toLowerCase().includes('arbol'));
      if (bookFolder) {
        const normFolder = normalizeForMatch(bookFolder);
        // Find DB cover image that matches bookFolder name
        matchedAsset = allAssets.find(asset => {
          if (!asset.asset_path.startsWith('cuentos/Portadas Cuentos Web')) return false;
          const normDbPath = normalizeForMatch(path.basename(asset.asset_path));
          return normDbPath.includes(normFolder) || normFolder.includes(normDbPath);
        });
      }
    }

    // General smart lookup if not matched yet
    if (!matchedAsset && normRequestedFileName) {
      matchedAsset = allAssets.find(asset => {
        const normDbFileName = normalizeForMatch(path.basename(asset.asset_path));
        return normDbFileName === normRequestedFileName || 
               normDbFileName.includes(normRequestedFileName) || 
               normRequestedFileName.includes(normDbFileName);
      });
    }

    if (matchedAsset) {
      const fullRes = await activePool.query('SELECT content_type, data_base64 FROM camitoons_media_assets WHERE id = $1', [matchedAsset.id]);
      if (fullRes.rows.length > 0) {
        const { content_type, data_base64 } = fullRes.rows[0];
        const imageBuffer = Buffer.from(data_base64, 'base64');
        res.setHeader('Content-Type', content_type);
        res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
        res.setHeader('Content-Length', imageBuffer.length);
        return res.status(200).send(imageBuffer);
      }
    }

    // If all fail, let express handle it/next
    return next();
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

// --- ADMIN AUTH & MANAGEMENT API ENDPOINTS ---

// Helper middleware to verify admin token
function requireAdmin(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader || authHeader !== 'Bearer admin-token') {
    return res.status(401).json({ error: 'Unauthorized: admin access required' });
  }
  next();
}

// 1. Auth routes
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  if (username === 'admin' && password === 'admin') {
    return res.status(200).json({ success: true, token: 'admin-token' });
  }
  return res.status(401).json({ success: false, error: 'Credenciales incorrectas' });
});

app.get('/api/auth/check', (req, res) => {
  const authHeader = req.headers['authorization'];
  if (authHeader === 'Bearer admin-token') {
    return res.status(200).json({ authenticated: true });
  }
  return res.status(401).json({ authenticated: false });
});

// 2. Books CRUD endpoints (PostgreSQL-connected)
app.get('/api/books', async (req, res) => {
  const pool = activePool || await initDbPool();
  if (!pool) {
    return res.status(500).json({ error: 'Database connection unavailable' });
  }
  try {
    const authHeader = req.headers['authorization'];
    const isAdmin = authHeader === 'Bearer admin-token';

    let query = 'SELECT * FROM camitoons_books ORDER BY created_at DESC';
    if (!isAdmin) {
      // Non-admins can only see published or coming_soon books, hidden books are excluded
      query = "SELECT * FROM camitoons_books WHERE status IN ('published', 'coming_soon') ORDER BY created_at DESC";
    }

    const result = await pool.query(query);

    // Map column names from snake_case to camelCase
    const books = result.rows.map(row => ({
      id: row.id,
      folderName: row.folder_name,
      title: row.title,
      displayTitle: row.display_title,
      recommendedAge: row.recommended_age,
      coverImage: row.cover_image,
      pdfUrl: row.pdf_url,
      pdfFileName: row.pdf_file_name,
      intro: row.intro,
      objective: row.objective,
      summary: row.summary,
      fullFundamentacion: row.full_fundamentacion,
      coloringSvgs: row.coloring_svgs || [],
      status: row.status || 'published'
    }));

    return res.status(200).json(books);
  } catch (err) {
    console.error('Error fetching books:', err);
    return res.status(500).json({ error: 'Error fetching books from database' });
  }
});

app.post('/api/books', requireAdmin, async (req, res) => {
  const pool = activePool || await initDbPool();
  if (!pool) return res.status(500).json({ error: 'Database connection unavailable' });

  const {
    id, folderName, title, displayTitle, recommendedAge,
    coverImage, pdfUrl, pdfFileName, intro, objective,
    summary, fullFundamentacion, coloringSvgs, status
  } = req.body;

  if (!id || !title || !displayTitle) {
    return res.status(400).json({ error: 'id, title y displayTitle son campos requeridos' });
  }

  try {
    await pool.query(`
      INSERT INTO camitoons_books (
        id, folder_name, title, display_title, recommended_age,
        cover_image, pdf_url, pdf_file_name, intro, objective,
        summary, full_fundamentacion, coloring_svgs, status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
    `, [
      id, folderName || '', title, displayTitle, recommendedAge || '',
      coverImage || '', pdfUrl || '', pdfFileName || '', intro || '',
      objective || '', summary || '', fullFundamentacion || '',
      coloringSvgs || [], status || 'published'
    ]);
    return res.status(201).json({ success: true, message: 'Cuento creado con éxito' });
  } catch (err) {
    console.error('Error creating book:', err);
    return res.status(500).json({ error: err.message || 'Error creating book in database' });
  }
});

app.put('/api/books/:id', requireAdmin, async (req, res) => {
  const pool = activePool || await initDbPool();
  if (!pool) return res.status(500).json({ error: 'Database connection unavailable' });

  const { id } = req.params;
  const {
    folderName, title, displayTitle, recommendedAge,
    coverImage, pdfUrl, pdfFileName, intro, objective,
    summary, fullFundamentacion, coloringSvgs, status
  } = req.body;

  try {
    const result = await pool.query(`
      UPDATE camitoons_books SET
        folder_name = $1,
        title = $2,
        display_title = $3,
        recommended_age = $4,
        cover_image = $5,
        pdf_url = $6,
        pdf_file_name = $7,
        intro = $8,
        objective = $9,
        summary = $10,
        full_fundamentacion = $11,
        coloring_svgs = $12,
        status = $13
      WHERE id = $14
      RETURNING id
    `, [
      folderName || '', title, displayTitle, recommendedAge || '',
      coverImage || '', pdfUrl || '', pdfFileName || '', intro || '',
      objective || '', summary || '', fullFundamentacion || '',
      coloringSvgs || [], status || 'published', id
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Cuento no encontrado' });
    }
    return res.status(200).json({ success: true, message: 'Cuento actualizado con éxito' });
  } catch (err) {
    console.error('Error updating book:', err);
    return res.status(500).json({ error: 'Error updating book in database' });
  }
});

app.delete('/api/books/:id', requireAdmin, async (req, res) => {
  const pool = activePool || await initDbPool();
  if (!pool) return res.status(500).json({ error: 'Database connection unavailable' });

  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM camitoons_books WHERE id = $1 RETURNING id', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Cuento no encontrado' });
    }
    return res.status(200).json({ success: true, message: 'Cuento eliminado con éxito' });
  } catch (err) {
    console.error('Error deleting book:', err);
    return res.status(500).json({ error: 'Error deleting book from database' });
  }
});

// 3. Media file upload & automated optimization endpoint
app.post('/api/admin/upload-file', requireAdmin, upload.single('file'), async (req, res) => {
  const pool = activePool || await initDbPool();
  if (!pool) {
    if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    return res.status(500).json({ error: 'Database connection unavailable' });
  }

  if (!req.file) {
    return res.status(400).json({ error: 'No se subió ningún archivo' });
  }

  const fileType = req.body.type || 'cover'; // 'cover' | 'pdf' | 'svg'
  const tempPath = req.file.path;
  const originalName = req.file.originalname;

  try {
    let finalBuffer;
    let contentType;
    let dbAssetPath;
    let extension;

    const baseCleanName = originalName.replace(/\.[^/.]+$/, "").replace(/[^a-zA-Z0-9]/g, "_");
    const uniqueId = `${Date.now()}_${Math.floor(Math.random() * 1000)}`;

    if (fileType === 'cover') {
      // Image optimization with Sharp
      console.log(`🖼️ Optimizing uploaded cover image: ${originalName}`);
      finalBuffer = await sharp(tempPath)
        .resize(800, null, { withoutEnlargement: true, fit: 'inside' })
        .webp({ quality: 80 })
        .toBuffer();
      
      contentType = 'image/webp';
      extension = 'webp';
      dbAssetPath = `Imagenes/catalog/upload_${uniqueId}_${baseCleanName}.webp`;
    } else if (fileType === 'pdf') {
      // PDF processing
      console.log(`📄 Storing PDF file: ${originalName}`);
      finalBuffer = fs.readFileSync(tempPath);
      contentType = 'application/pdf';
      extension = 'pdf';
      dbAssetPath = `pdf/upload_${uniqueId}_${originalName.replace(/[^a-zA-Z0-9.]/g, "_")}`;
    } else if (fileType === 'svg') {
      // SVG processing
      console.log(`🎨 Storing SVG file: ${originalName}`);
      finalBuffer = fs.readFileSync(tempPath);
      contentType = 'image/svg+xml';
      extension = 'svg';
      dbAssetPath = `colorear/upload_${uniqueId}_${originalName.replace(/[^a-zA-Z0-9.]/g, "_")}`;
    } else {
      throw new Error('Tipo de archivo no soportado para la carga');
    }

    // Convert optimized buffer to base64
    const base64Data = finalBuffer.toString('base64');

    // Save to PostgreSQL media table
    await pool.query(`
      INSERT INTO camitoons_media_assets (asset_path, asset_type, content_type, data_base64, size_bytes)
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (asset_path) DO UPDATE SET
        data_base64 = EXCLUDED.data_base64,
        size_bytes = EXCLUDED.size_bytes
    `, [dbAssetPath, extension, contentType, base64Data, finalBuffer.length]);

    // Cleanup local disk file immediately
    fs.unlinkSync(tempPath);

    // Return the dynamic route URL pointing to this asset
    const assetUrl = `/api/media/${dbAssetPath}`;
    console.log(`✅ Asset saved successfully to DB path: ${dbAssetPath} (${(finalBuffer.length / 1024).toFixed(2)} KB)`);

    return res.status(200).json({
      success: true,
      url: assetUrl,
      fileName: originalName,
      sizeBytes: finalBuffer.length
    });
  } catch (err) {
    console.error('Error during file upload and optimization:', err);
    if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
    return res.status(500).json({ error: err.message || 'Error processing file' });
  }
});

// 4. Media management endpoints
app.get('/api/admin/media', requireAdmin, async (req, res) => {
  const pool = activePool || await initDbPool();
  if (!pool) return res.status(500).json({ error: 'Database connection unavailable' });

  try {
    const result = await pool.query('SELECT id, asset_path, content_type, size_bytes, created_at FROM camitoons_media_assets ORDER BY created_at DESC');
    const mediaList = result.rows.map(row => ({
      id: row.id,
      assetPath: row.asset_path,
      contentType: row.content_type,
      sizeBytes: row.size_bytes,
      createdAt: row.created_at
    }));
    return res.status(200).json(mediaList);
  } catch (err) {
    console.error('Error getting media list:', err);
    return res.status(500).json({ error: 'Error reading media database' });
  }
});

app.delete('/api/admin/media/:id', requireAdmin, async (req, res) => {
  const pool = activePool || await initDbPool();
  if (!pool) return res.status(500).json({ error: 'Database connection unavailable' });

  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM camitoons_media_assets WHERE id = $1 RETURNING asset_path', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Multimedia no encontrado' });
    }
    return res.status(200).json({ success: true, message: 'Multimedia eliminado con éxito de la DB' });
  } catch (err) {
    console.error('Error deleting media:', err);
    return res.status(500).json({ error: 'Error deleting media from database' });
  }
});

// Intercept all media asset routes
app.get('/api/media/*', handleMediaRequest);
app.get('/pdf/*', handleMediaRequest);
app.get('/colorear/*', handleMediaRequest);
app.get('/cuentos/*', handleMediaRequest);
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
