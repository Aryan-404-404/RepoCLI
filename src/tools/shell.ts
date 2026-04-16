import { execSync } from "node:child_process";

export function executeShell(command: string): string {
    try {
        const output = execSync(command, {encoding: 'utf-8', stdio: 'pipe'})
        return output;
    } catch (err: any) {
        return `Command Failed: ${err.message}\nStderr: ${err.stderr?.toString()}`
    }
}