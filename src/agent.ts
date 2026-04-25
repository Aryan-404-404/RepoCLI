import Groq from "groq-sdk";
import { readFile, listFiles, writeFile, deleteFile, searchFiles, readFileDeclaration, writeFileDeclaration, deleteFileDeclaration, listFilesDeclaration, searchFilesDeclaration } from "./tools/filesystem"
import { executeShell, executeShellDeclaration } from "./tools/shell";
import chalk from "chalk";
import dotenv from 'dotenv'
import { getGithubIssue, listOpenIssues, createIssue, getGithubIssueDeclaration, listOpenIssuesDeclaration, createIssueDeclaration } from "./tools/github";
dotenv.config();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const tools: Groq.Chat.ChatCompletionTool[] = [
    readFileDeclaration,
    listFilesDeclaration,
    writeFileDeclaration,
    deleteFileDeclaration,
    executeShellDeclaration,
    getGithubIssueDeclaration,
    listOpenIssuesDeclaration,
    createIssueDeclaration,
    searchFilesDeclaration
]

type Message = Groq.Chat.ChatCompletionMessageParam

export async function runAgent(prompt: string): Promise<void> {
    const messages: Message[] = [
        {
            role: "system",
            content: `You are repocli, a dynamic and strictly confined Terminal AI Agent. 
            
            SAFETY & EXECUTION RULES:
            1. You ONLY have access to the specific tools provided to you in the tool schema. 
            2. NEVER execute shell commands or use tools to perform mass deletions (like 'rm -rf', 'del /s', or deleting entire source directories). 
            3. If asked to do something dangerous, destructive, or outside your toolset, you must politely refuse.
            4. IMPORTANT: Take things step-by-step. Call ONLY ONE tool at a time. Wait for the result before deciding your next action.
            5. TOOL FAILURES (KILL SWITCH): If a tool returns an error string (e.g., authentication failed, rate limited, file not found), DO NOT retry the tool. You must immediately stop, report the exact error back to the user, and wait for their instructions.
            
            PROJECT NAVIGATION:
            1. The current working directory is the project root. 
            2. Do NOT assume a specific folder structure (like src/). 
            3. Your first step for any task should be to list the files in the root directory ('.') to understand the project's unique structure. 
            4. Always use relative paths. Do NOT add a leading slash (/) to paths.

            TOOL FAILURES (RECOVERY):
            1. If readFile fails because a file is not found, DO NOT give up.
            2. Instead, immediately call searchFiles with the filename as the query on the '.' directory to locate it.
            3. Then use the correct path from the search results to call readFile again.
            4. Never tell the user a file doesn't exist without first searching for it.
            
            COMMUNICATION:
            When you have the final answer, simply reply with plain text.`
        },
        {
            role: "user",
            content: prompt
        }
    ]

    const maxRetries = 3;
    let retries = 0;
    while (true) {
        try {
            const response = await groq.chat.completions.create({
                model: "llama-3.3-70b-versatile",
                messages,
                tools,
                tool_choice: "auto",
                parallel_tool_calls: false,
                max_tokens: 1024,
                temperature: 0
            })

            const choice = response.choices[0];
            retries = 0;

            if (choice.finish_reason == "tool_calls") {
                const toolCalls = choice.message.tool_calls!;
                messages.push(choice.message)

                for (const toolCall of toolCalls) {
                    const args = JSON.parse(toolCall.function.arguments);
                    let result = ""

                    if (toolCall.function.name == 'readFile') {
                        result = readFile(args.path);
                    }
                    else if (toolCall.function.name == 'listFiles') {
                        result = listFiles(args.path)
                    }
                    else if (toolCall.function.name == 'writeFile') {
                        result = writeFile(args.path, args.content)
                    }
                    else if (toolCall.function.name == 'deleteFile') {
                        result = deleteFile(args.path);
                    }
                    else if (toolCall.function.name == 'executeShell') {
                        result = executeShell(args.command)
                    }
                    else if (toolCall.function.name == 'getGithubIssue') {
                        result = await getGithubIssue(args.owner, args.repo, args.issueNumber)
                    }
                    else if (toolCall.function.name == 'listOpenIssues') {
                        result = await listOpenIssues(args.owner, args.repo)
                    }
                    else if (toolCall.function.name == 'createIssue') {
                        result = await createIssue(args.owner, args.repo, args.title, args.body)
                    }
                    else if (toolCall.function.name === 'searchFiles') {
                        result = await searchFiles(args.directory, args.query);
                    }
                    // console.log(`\n[DEBUG] Tool returned:`, result);

                    messages.push({
                        role: "tool",
                        tool_call_id: toolCall.id,
                        content: result
                    })
                }
            }
            else {
                console.log(chalk.cyan("\n🤖 Agent:"), chalk.whiteBright(choice.message.content));
                break;
            }
        } catch (err: any) {
            if (err?.status == 400 && retries < maxRetries) {
                retries++;
                console.log(chalk.yellow(`\n⚠️ Tool call failed, retrying... (${retries}/${maxRetries})`));
                continue;
            }
            throw err
        }
    }
}
// TODO: Refactor the execution loop to handle streaming responses later