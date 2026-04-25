#!/usr/bin/env node
import { Command } from "commander";
import dotenv from 'dotenv'
import ora from "ora";      // for spinner and loading
import chalk from "chalk";  // for terminal colors
import { runAgent } from "./agent";
import readline from 'readline'

dotenv.config();

if (!process.env.GROQ_API_KEY) {
    console.log(chalk.red('\n❌ GROQ_API_KEY not found.'));
    console.log(chalk.yellow('Get your free API key at: https://console.groq.com'));
    console.log(chalk.yellow('Then set it in your terminal:'));
    console.log(chalk.white('  export GROQ_API_KEY="your_key_here"         # Mac/Linux'));
    console.log(chalk.white('  $env:GROQ_API_KEY="your_key_here"           # Windows PowerShell'));
    process.exit(1);
}

if (!process.env.GITHUB_TOKEN) {
    console.log(chalk.yellow('\n⚠️  GITHUB_TOKEN not set. GitHub features will not work.'));
    console.log(chalk.yellow('Get a token at: https://github.com/settings/tokens'));
    console.log(chalk.yellow('Then set it with:'));
    console.log(chalk.white('  export GITHUB_TOKEN="your_token_here"       # Mac/Linux'));
    console.log(chalk.white('  $env:GITHUB_TOKEN="your_token_here"         # Windows PowerShell\n'));
}

// creates a CLI object
const program = new Command();

program
    .name('repocli')
    .description("A terminal AI agent")
    .version('1.0.0')
    .argument("[prompt]", "what do you want the agent to do?")
    .action(async (prompt?: string) => {
        if (prompt) {
            const spinner = ora("Thinking...").start();
            try {
                spinner.stop();
                await runAgent(prompt);
                spinner.succeed("Agent finished executing!")
            } catch (err) {
                spinner.fail("Something went wrong!");
                console.log(chalk.red(err));
            }
            return;
        }

        console.log(chalk.cyan("\nRepoCLI Interactive Mode Initialized."));
        console.log(chalk.dim("Type your command, or type 'exit' to quit.\n"));

        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        })

        const chatLoop = () => {
            rl.question(chalk.green('❯ '), async (input) => {
                const command = input.trim();

                if (command.toLowerCase() === 'exit' || command.toLowerCase() === 'quit') {
                    console.log(chalk.yellow("Shutting down agent"));
                    rl.close();
                    return;
                }

                if (!command) {
                    chatLoop();
                    return;
                }

                const spinner = ora("Agent is working...").start();
                try {
                    spinner.stop();
                    await runAgent(command);
                    spinner.succeed("Done!");
                } catch (err: any) {
                    spinner.fail("Something went wrong!");
                    console.error(chalk.red(err.message));
                }

                console.log(""); 
                chatLoop(); 
            });
        };
        chatLoop();
    })

program.parse();    // Tells the program to actually read the argv of the prompt and then action sends GROQ prompt