import { Command } from "commander";
import dotenv from 'dotenv'
import ora from "ora";      // for spinner and loading
import chalk from "chalk";  // for terminal colors
import { runAgent } from "./agent";
import readline from 'readline'

dotenv.config();
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