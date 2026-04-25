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

export function searchFiles(directory: string, query: string): string {
    let results: string[] = [];

    // The DFS helper function to traverse the file tree
    function searchRecursively(currentPath: string) {
        let entries;
        try {
            // Read the current directory contents
            entries = fs.readdirSync(currentPath, { withFileTypes: true });
        } catch (error: any) {
            return; // Silently skip folders we don't have permission to read
        }

        for (const entry of entries) {
            const fullPath = path.join(currentPath, entry.name);

            if (entry.isDirectory()) {
                if (!['node_modules', '.git', 'dist', 'build'].includes(entry.name)) {
                    searchRecursively(fullPath);
                }
            } else {
                if (entry.name.includes(query)) {
                    results.push(`${fullPath} (filename match)`);
                }
                // It's a file. Open it and look for the query.
                try {
                    const content = fs.readFileSync(fullPath, 'utf-8');
                    const lines = content.split('\n');

                    lines.forEach((line: string, index: number) => {
                        if (line.includes(query)) {
                            // Format: src/app.ts:42 -> // TODO: fix this
                            results.push(`${fullPath}:${index + 1} -> ${line.trim()}`);
                        }
                    });
                } catch (error) {
                    // Silently skip binary files (like images/PDFs) that crash utf-8
                }
            }
        }
    }

    try {
        // Kick off the traversal
        searchRecursively(directory);

        if (results.length === 0) return `No matches found for '${query}' in directory '${directory}'.`;

        // Safety limit to protect your LLM token context window
        if (results.length > 50) {
            return `Found ${results.length} matches. Showing first 50:\n` + results.slice(0, 50).join('\n');
        }

        return `Found ${results.length} matches:\n` + results.join('\n');
    } catch (error: any) {
        return `Error searching files: ${error.message}`;
    }
}


// Exporting function declarations
export const readFileDeclaration = {
    type: "function",
    function: {
        name: "readFile",
        description: "Read the contents of a file at an exact path. IMPORTANT: Only call this tool if you already know the exact correct path from a previous listFiles or searchFiles call. Never guess a path.",
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

export const searchFilesDeclaration = {
    type: "function",
    function: {
        name: "searchFiles",
        description: "Search for files by name or content across the project. ALWAYS call this first when you need to find a file and don't know its exact path. Also use this to search for a specific string or keyword across all files in a directory — returns file paths and line numbers of matches. Always ignores node_modules and .git.",
        parameters: {
            type: "object",
            properties: {
                directory: {
                    type: "string",
                    description: "The directory to search in. Use '.' for the current project root."
                },
                query: {
                    type: "string",
                    description: "The exact string or filename to search for (e.g., 'TODO', 'console.log', or 'filesystem.ts')."
                }
            },
            required: ["directory", "query"]
        }
    }
};