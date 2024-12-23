import { rm } from 'fs/promises';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const serverDir = join(__dirname, 'server');

try {
    await rm(serverDir, { recursive: true, force: true });
    console.log('Server directory removed successfully');
} catch (err) {
    console.error('Error removing server directory:', err);
}
