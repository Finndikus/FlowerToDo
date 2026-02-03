import fs from "fs/promises";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "db");
const DATA_FILE = path.join(DATA_DIR, "tasks.json");

export async function ensureDb() {
    try {
        await fs.mkdir(DATA_DIR, { recursive: true });
        try {
            await fs.access(DATA_FILE);
        } catch {
            // Create empty file if not exists
            await fs.writeFile(DATA_FILE, JSON.stringify([], null, 2), "utf-8");
        }
    } catch (error) {
        console.error("Failed to initialize database:", error);
        throw error;
    }
}

export async function readDb() {
    await ensureDb();
    const content = await fs.readFile(DATA_FILE, "utf-8");
    return JSON.parse(content);
}

export async function writeDb(data: any) {
    await ensureDb();
    // Atomic write: write to temp file then rename
    const tmpFile = `${DATA_FILE}.tmp`;
    await fs.writeFile(tmpFile, JSON.stringify(data, null, 2), "utf-8");
    await fs.rename(tmpFile, DATA_FILE);
}
