import { Command } from "commander";
import Groq from "groq-sdk";
import dotenv from 'dotenv'
import ora from "ora";      // for spinner and loading
import chalk from "chalk";  // for terminal colors
import { runAgent } from "./agent";

dotenv.config();
// creates a CLI object
const program = new Command();
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

program
    .name('repocli')
    .description("A terminal AI agent")
    .version('1.0.0')
    .argument("<prompt>", "what do you want the agent to do?")
    .action(async (prompt: string) => {
        const spinner = ora("Thinking...").start();
        try {
            await runAgent(prompt);
            spinner.succeed("Agent finished executing!")
        } catch (err) {
            spinner.fail("Something went wrong!");
            console.log(chalk.red(err));
        }

    })

program.parse();    // Tells the program to actually read the argv of the prompt and then action sends GROQ prompt