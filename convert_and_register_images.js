import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const WORKSPACE_ROOT = path.resolve(process.cwd());
const REPOS_TARGET = path.join(WORKSPACE_ROOT, 'src/assets/images/catalog');
const REGISTRY_FILE = path.join(WORKSPACE_ROOT, 'image_registry.md');

const EXCLUDE_DIRS = [
  'cuentos pdf',
  'node_modules',
  '.git',
  'dist',
  '.aistudio',
  'scratch',
  '.system_generated',
  'brain'
];

const VALID_EXTENSIONS = new Set(['.png', '.jpg', '.jpeg', '.bmp', '.tiff']);

function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

async function scanDirectory(dir, fileList = []) {
  const items = fs.readdirSync(dir, { withFileTypes: true });

  for (const item of items) {
    const fullPath = path.join(dir, item.name);
    const relPath = path.relative(WORKSPACE_ROOT, fullPath);

    if (item.isDirectory()) {
      if (EXCLUDE_DIRS.some(ex => item.name.toLowerCase() === ex.toLowerCase() || relPath.toLowerCase().includes(ex.toLowerCase()))) {
        continue;
      }
      await scanDirectory(fullPath, fileList);
    } else if (item.isFile()) {
      const ext = path.extname(item.name).toLowerCase();
      if (VALID_EXTENSIONS.has(ext)) {
        fileList.push(fullPath);
      }
    }
  }
  return fileList;
}

async function processImages() {
  console.log('Iniciando escaneo de imágenes en CamiToons...');
  const imagePaths = await scanDirectory(WORKSPACE_ROOT);
  console.log(`Se encontraron ${imagePaths.length} imágenes para procesar.`);

  const results = [];
  let totalOriginalSize = 0;
  let totalWebpSize = 0;

  for (let i = 0; i < imagePaths.length; i++) {
    const srcPath = imagePaths[i];
    const relPath = path.relative(WORKSPACE_ROOT, srcPath);
    const dirName = path.dirname(srcPath);
    const baseNameWithoutExt = path.basename(srcPath, path.extname(srcPath));
    const webpFileName = `${baseNameWithoutExt}.webp`;
    
    // Save webp in original directory
    const destWebpSameDir = path.join(dirName, webpFileName);
    
    // Save webp in REPOS assets directory preserving folder structure
    const destWebpRepos = path.join(REPOS_TARGET, relPath.replace(path.extname(relPath), '.webp'));
    fs.mkdirSync(path.dirname(destWebpRepos), { recursive: true });

    try {
      const origStats = fs.statSync(srcPath);
      const metadata = await sharp(srcPath).metadata();

      // Convert to webp
      const sharpBuffer = await sharp(srcPath)
        .webp({ quality: 82, effort: 4 })
        .toBuffer();

      // Write to original folder
      fs.writeFileSync(destWebpSameDir, sharpBuffer);
      // Write to REPOS folder
      fs.writeFileSync(destWebpRepos, sharpBuffer);

      const webpStats = fs.statSync(destWebpSameDir);
      const savings = origStats.size > 0 ? (((origStats.size - webpStats.size) / origStats.size) * 100).toFixed(1) : '0';

      totalOriginalSize += origStats.size;
      totalWebpSize += webpStats.size;

      results.push({
        num: i + 1,
        relPath,
        dir: path.dirname(relPath),
        fileName: path.basename(srcPath),
        webpName: webpFileName,
        dimensions: `${metadata.width || '?'}x${metadata.height || '?'}`,
        origSize: origStats.size,
        origSizeFormatted: formatBytes(origStats.size),
        webpSize: webpStats.size,
        webpSizeFormatted: formatBytes(webpStats.size),
        savings: `${savings}%`,
        destSameDir: destWebpSameDir,
        destRepos: destWebpRepos
      });

      console.log(`[${i + 1}/${imagePaths.length}] Procesada: ${relPath} (${formatBytes(origStats.size)} -> ${formatBytes(webpStats.size)}, -${savings}%)`);
    } catch (err) {
      console.error(`Error procesando ${relPath}:`, err.message);
    }
  }

  // Generate Registry Markdown
  const overallSavings = totalOriginalSize > 0 ? (((totalOriginalSize - totalWebpSize) / totalOriginalSize) * 100).toFixed(1) : '0';

  let mdContent = `# Registro Oficial de Imágenes - CamiToons

> [!NOTE]
> Este documento registra todas las imágenes encontradas en el espacio de trabajo **CamiToons** (excluyendo \`cuentos pdf\`), su conversión optimizada a formato **.webp** y su incorporación al proyecto local **REPOS**.

## 📊 Resumen Ejecutivo
- **Total de Imágenes Procesadas:** ${results.length}
- **Tamaño Total Original:** ${formatBytes(totalOriginalSize)}
- **Tamaño Total WebP:** ${formatBytes(totalWebpSize)}
- **Ahorro Total de Espacio:** **${overallSavings}%** (${formatBytes(totalOriginalSize - totalWebpSize)} ahorrados)

---

## 📁 Registro Detallado de Imágenes por Carpeta

`;

  // Group by directory
  const groups = {};
  for (const item of results) {
    if (!groups[item.dir]) groups[item.dir] = [];
    groups[item.dir].push(item);
  }

  for (const [folder, items] of Object.entries(groups)) {
    mdContent += `### 📂 \`${folder}\` (${items.length} imágenes)\n\n`;
    mdContent += `| # | Ruta Relativa | Archivo Original | Ruta WebP en REPOS | Dimensiones | Tamaño Original | Tamaño WebP | Ahorro |\n`;
    mdContent += `|---|---|---|---|---|---|---|---|\n`;
    for (const img of items) {
      const relWebpRepos = path.relative(WORKSPACE_ROOT, img.destRepos);
      mdContent += `| ${img.num} | \`${img.relPath}\` | \`${img.fileName}\` | \`${relWebpRepos}\` | ${img.dimensions} | ${img.origSizeFormatted} | ${img.webpSizeFormatted} | **-${img.savings}** |\n`;
    }
    mdContent += `\n`;
  }

  fs.writeFileSync(REGISTRY_FILE, mdContent);
  console.log(`\n¡Registro completado y guardado en ${REGISTRY_FILE}!`);
}

processImages().catch(console.error);
