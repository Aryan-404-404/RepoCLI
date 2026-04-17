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

// Exporting function declarations
export const readFileDeclaration = {
    type: "function",
    function: {
        name: "readFile",
        description: "Read the contents of a file",
        parameters: {
            type: "object",
            properties: {
                path: {
                    type: "string",
                    description: "The file path to read",
                },
            },
            required: ["path"],
        },
    },
}

export const listFilesDeclaration = {
    type: "function",
    function: {
        name: "listFiles",
        description: "List all files in a directory",
        parameters: {
            type: "object",
            properties: {
                path: {
                    type: "string",
                    description: "The directory path to list",
                },
            },
            required: ["path"],
        },
    },
}

export const writeFileDeclaration = {
    type: "function",
    function: {
        name: "writeFile",
        description: "Write content to a file. Use this to create new files or overwrite existing ones with code or text.",
        parameters: {
            type: "object",
            properties: {
                path: {
                    type: "string",
                    description: "The path of the file to write to (e.g., src/app.tsx)",
                },
                content: {
                    type: "string",
                    description: "The exact multiline string, code, or text to write inside the file",
                }
            },
            required: ["path", "content"],
        },
    },
}

export const deleteFileDeclaration = {
    type: "function",
    function: {
        name: "deleteFile",
        description: "Delete a file from the file system. Use this to remove files when requested.",
        parameters: {
            type: "object",
            properties: {
                path: {
                    type: "string",
                    description: "The path of the file to delete (e.g., src/Haha.ts)",
                },
            },
            required: ["path"],
        },
    },
}