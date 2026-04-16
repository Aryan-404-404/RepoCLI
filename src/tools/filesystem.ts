import * as fs from 'fs'
import * as path from 'path'

export function readFile(filePath: string): string {
    try {
        return fs.readFileSync(path.resolve(filePath), "utf-8");        // .resolve() converts the filepath that matches your OS (as windows have back slash and mac/linux uses forward slash)
    } catch (error) {
        return `Error reading file: ${error}`;
    }
}

export function listFiles(dirPath: string): string {
    try {
        const files = fs.readdirSync(path.resolve(dirPath));
        return files.join("\n");
    } catch (error) {
        return `Error listing files: ${error}`;
    }
}

export function writeFile(filePath: string, content: string): string {
    try {
        const files = fs.writeFileSync(path.resolve(filePath), content, "utf-8")
        return `Successfully wrote to file: ${filePath}`;
    } catch (err: any) {
        return `Error writing file: ${err.message}`
    }
}

export function deleteFile(filePath: string): string {
    try {
        const files = fs.unlinkSync(path.resolve(filePath))
        return `Successfully deleted the file: ${filePath}`;
    } catch (err: any) {
        return `Error deleting file: ${err.message}`
    }
}