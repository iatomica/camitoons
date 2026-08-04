import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Client } = pg;

// Arguments parsing
const args = process.argv.slice(2);
const isProd = args.includes('--prod');
const isLocal = args.includes('--local');

if (!isProd && !isLocal) {
    console.error("❌ Error: Debes especificar el destino: --local o --prod");
    console.log("Uso:\n  node clean_unused_db_assets.js --local\n  node clean_unused_db_assets.js --prod");
    process.exit(1);
}

const LOCAL_URL = process.env.DATABASE_URL || 'postgres://postgres:Chimichurri1234!@localhost:5432/camitoons_db';
const PROD_URL = process.env.PROD_DATABASE_URL;

const connectionString = isProd ? PROD_URL : LOCAL_URL;

if (!connectionString) {
    console.error(`❌ Error: La URL de conexión para ${isProd ? 'PROD' : 'LOCAL'} no está configurada.`);
    process.exit(1);
}

const targetAssets = [
  'Imagenes/personajes/arbol de vinculos/Abuela Elsa .webp',
  'Imagenes/personajes/arbol de vinculos/Abuelo angel.webp',
  'Imagenes/personajes/arbol de vinculos/amigos-pares.webp',
  'Imagenes/personajes/arbol de vinculos/anana.webp',
  'Imagenes/personajes/arbol de vinculos/hermana.webp',
  'Imagenes/personajes/arbol de vinculos/hermano.webp',
  'Imagenes/personajes/arbol de vinculos/jazmin.webp',
  'Imagenes/personajes/arbol de vinculos/luna.webp',
  'Imagenes/personajes/arbol de vinculos/mama.webp',
  'Imagenes/personajes/arbol de vinculos/marcos.webp',
  'Imagenes/personajes/arbol de vinculos/papa.webp',
  'Imagenes/personajes/arbol de vinculos/prima.webp',
  'cuentos/Portadas Cuentos Web/Portada Luna sueña que viaja.webp' // decomposed unicode duplicate
];

async function main() {
    console.log(`🧹 Iniciando limpieza de imágenes obsoletas en ${isProd ? 'PRODUCCIÓN' : 'LOCAL'}...`);
    console.log(`Conexión: ${connectionString.replace(/:[^:@]+@/, ':****@')}`);

    const client = new Client({ connectionString });
    await client.connect();

    try {
        // First check count of targets existing in DB
        const checkRes = await client.query(
            "SELECT COUNT(*)::integer AS count FROM camitoons_media_assets WHERE asset_path = ANY($1)",
            [targetAssets]
        );
        const countBefore = checkRes.rows[0].count;
        console.log(`🔍 Encontrados ${countBefore} de ${targetAssets.length} assets obsoletos en la base de datos.`);

        if (countBefore === 0) {
            console.log("✨ No hay ningún asset obsoleto para limpiar. ¡La base de datos ya está limpia!");
            return;
        }

        // Perform deletion
        const deleteRes = await client.query(
            "DELETE FROM camitoons_media_assets WHERE asset_path = ANY($1)",
            [targetAssets]
        );

        console.log(`🗑️ Eliminados con éxito ${deleteRes.rowCount} registros obsoletos de la base de datos.`);

        // Verification query
        const countRes = await client.query("SELECT COUNT(*)::integer AS count FROM camitoons_media_assets");
        console.log(`📊 Cantidad total de registros restantes en DB: ${countRes.rows[0].count}`);

    } catch (e) {
        console.error("❌ Falló el script de limpieza:", e.message);
    } finally {
        await client.end();
    }
}

main().catch(console.error);
