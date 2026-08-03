import { execSync } from 'child_process';
import pg from 'pg';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

const { Client } = pg;

// Load environment variables from .env
dotenv.config();

const LOCAL_URL = process.env.DATABASE_URL || 'postgres://postgres:Chimichurri1234!@localhost:5432/camitoons_db';
const PROD_URL = process.env.PROD_DATABASE_URL;

// Automatically add common PostgreSQL bin paths to process.env.PATH if not already available
function setupPostgresPath() {
    const isWin = process.platform === 'win32';
    const separator = isWin ? ';' : ':';
    const pathsToAdd = [];

    if (isWin) {
        // Common installation directories for PostgreSQL on Windows
        const programFiles = process.env.ProgramFiles || 'C:\\Program Files';
        const postgresDir = path.join(programFiles, 'PostgreSQL');
        if (fs.existsSync(postgresDir)) {
            try {
                const versions = fs.readdirSync(postgresDir);
                for (const v of versions) {
                    const binPath = path.join(postgresDir, v, 'bin');
                    if (fs.existsSync(binPath)) {
                        pathsToAdd.push(binPath);
                    }
                }
            } catch (e) {
                // Ignore directory read errors
            }
        }
    } else {
        // Common installation directories for PostgreSQL / libpq on macOS and Linux
        const macCommon = [
            '/opt/homebrew/opt/libpq/bin',
            '/opt/homebrew/bin',
            '/usr/local/opt/libpq/bin',
            '/usr/local/bin'
        ];
        for (const p of macCommon) {
            if (fs.existsSync(p)) {
                pathsToAdd.push(p);
            }
        }
    }

    if (pathsToAdd.length > 0) {
        process.env.PATH = `${process.env.PATH}${separator}${pathsToAdd.join(separator)}`;
    }
}

async function run() {
    console.log("🚀 Iniciando proceso de espejado de base de datos...");

    if (!PROD_URL) {
        console.error("❌ Error: PROD_DATABASE_URL no está definida en el archivo .env");
        process.exit(1);
    }

    // Configure PATH dynamically
    setupPostgresPath();

    // 1. Check if pg_dump and psql are available in system PATH
    try {
        execSync('pg_dump --version', { stdio: 'ignore' });
        execSync('psql --version', { stdio: 'ignore' });
    } catch (err) {
        console.error("❌ Error: 'pg_dump' o 'psql' no se encuentran en la variable PATH del sistema.");
        console.error("Por favor, asegúrate de tener instalado PostgreSQL Client y que esté agregado al PATH.");
        console.error("- En Windows: Generalmente en C:\\Program Files\\PostgreSQL\\<versión>\\bin");
        console.error("- En macOS: Asegúrate de correr 'brew install libpq && brew link --force libpq'");
        process.exit(1);
    }

    // 2. Extract database name and build connection to default 'postgres' database locally
    // to perform the DROP / CREATE database operations.
    let localDbName = 'camitoons_db';
    let defaultLocalUrl = LOCAL_URL;
    try {
        const urlObj = new URL(LOCAL_URL);
        localDbName = urlObj.pathname.substring(1) || 'camitoons_db';
        urlObj.pathname = '/postgres';
        defaultLocalUrl = urlObj.toString();
    } catch (e) {
        console.warn("⚠️ No se pudo parsear el nombre de la DB de DATABASE_URL, usando 'postgres' por defecto.");
        defaultLocalUrl = LOCAL_URL.substring(0, LOCAL_URL.lastIndexOf('/')) + '/postgres';
    }

    console.log(`🔌 Conectando a Postgres Local en '${defaultLocalUrl.replace(/:[^:@]+@/, ':****@')}'...`);
    const client = new Client({ connectionString: defaultLocalUrl });

    try {
        await client.connect();

        console.log(`🔒 Cerrando conexiones activas a la base de datos '${localDbName}'...`);
        await client.query(`
            SELECT pg_terminate_backend(pg_stat_activity.pid)
            FROM pg_stat_activity
            WHERE pg_stat_activity.datname = $1 AND pid <> pg_backend_pid();
        `, [localDbName]);

        console.log(`🗑️ Borrando base de datos '${localDbName}' (si existe)...`);
        await client.query(`DROP DATABASE IF EXISTS ${localDbName};`);

        console.log(`✨ Creando nueva base de datos vacía '${localDbName}'...`);
        await client.query(`CREATE DATABASE ${localDbName};`);

        console.log("✅ Base de datos local recreada exitosamente.");
    } catch (err) {
        console.error("❌ Falló la recreación de la base de datos local:", err.message);
        process.exit(1);
    } finally {
        await client.end();
    }

    // 3. Dump production database to temporary file
    const dumpFile = path.resolve('prod_dump_temp.sql');
    console.log(`📥 Descargando respaldo (dump) de producción desde la nube...`);
    console.log(`Remoto: ${PROD_URL.replace(/:[^:@]+@/, ':****@')}`);

    try {
        // Run pg_dump
        // --no-owner avoids trying to set ownership to users that don't exist locally
        // --no-privileges avoids restoration privilege errors
        execSync(`pg_dump --no-owner --no-privileges -d "${PROD_URL}" -f "${dumpFile}"`, { stdio: 'inherit' });
        console.log("✅ Dump de producción descargado correctamente.");
    } catch (err) {
        console.error("❌ Error al ejecutar 'pg_dump' sobre producción:", err.message);
        if (fs.existsSync(dumpFile)) fs.unlinkSync(dumpFile);
        process.exit(1);
    }

    // 4. Restore dump into local database
    console.log(`📤 Restaurando esquema y datos en la base de datos local '${localDbName}'...`);
    try {
        execSync(`psql -d "${LOCAL_URL}" -f "${dumpFile}"`, { stdio: 'inherit' });
        console.log(`🎉 ¡ÉXITO! La base de datos local '${localDbName}' ha sido espejada de producción.`);
    } catch (err) {
        console.error("❌ Error al restaurar el dump en la base local con 'psql':", err.message);
        process.exit(1);
    } finally {
        // Clean up temp file
        if (fs.existsSync(dumpFile)) {
            console.log("🧹 Limpiando archivos temporales...");
            fs.unlinkSync(dumpFile);
        }
    }
}

run().catch(console.error);
