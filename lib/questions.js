import fs from 'fs';
import path from 'path';

const postsDirectory = process.cwd();

export function getQuestions() {
    const fullPath = path.join(postsDirectory, 'fragen.txt');
    const content = fs.readFileSync(fullPath, 'utf8');
    const base64 = decodeURIComponent(Buffer.from(content, 'base64'));
    return JSON.parse(base64);
}