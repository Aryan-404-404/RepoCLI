import { execSync } from "node:child_process";

export function executeShell(command: string): string {
    try {
        const output = execSync(command, { encoding: 'utf-8', stdio: 'pipe' })
        return output;
    } catch (err: any) {
        return `Command Failed: ${err.message}\nStderr: ${err.stderr?.toString()}`
    }
}

export const executeShellDeclaration = {
    type: "function",
    function: {
        name: "executeShell",
        description: "Use this to run scripts, OR to create or write files using terminal commands.",
        parameters: {
            type: "object",
            properties: {
                command: {
                    type: "string",
                    description: "The valid shell command to execute",
                },
            },
            required: ["command"],
        },
    },
}