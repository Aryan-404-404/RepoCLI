# repocli 🤖

RepoCLI is a terminal agent that reads your entire codebase, finds and fixes bugs and raises issues with a single command.


## Features
- Agent reads and understands your entire codebase to find bugs.
- It can raise Github issues and can read a Github issue and fix it.
- It can perform file operations like read, write, delete or create directories.
- Runs shell commands directly (ex. git add . , npm install <anything>).
- For destrutive commands like *deleteFile* and Shell commands like *rm -rf* it asks again for confirmation. 

## Installation & Setup

### Option 1 — Install from npm (Recommended)

```bash
npm install -g @aryan-404-404/repocli
```

### Option 2 — Clone for Development

```bash
git clone https://github.com/Aryan-404-404/repocli
cd repocli
npm install
npm run build
repocli "your command"
```

### Environment Variables

repocli requires a Groq API key to run. GitHub token is optional but required for GitHub features.

**Get your free Groq API key:** https://console.groq.com

```bash
# Mac/Linux
export GROQ_API_KEY="your_key_here"
export GITHUB_TOKEN="your_token_here"  # optional

# Windows PowerShell
$env:GROQ_API_KEY="your_key_here"
$env:GITHUB_TOKEN="your_token_here"  # optional
```

## Usage Examples

### Read and understand a file
```bash
repocli "read the file called agent.ts and explain what it does"
```
![agent.ts explanation](https://github.com/user-attachments/assets/2aeace1b-9ec6-4083-913a-3947c92e42f1)

---

### Find all TODOs in your project
```bash
repocli "find all TODO comments in this project"
```
![TODO search](https://github.com/user-attachments/assets/e0de7cca-2c8f-44b8-9729-14596415d733)

---

### Create a GitHub issue
```bash
repocli "create a github issue in repo 'repocli' owned by 'Aryan-404-404' about adding streaming support for tool call results"
```
![GitHub issue created](https://github.com/user-attachments/assets/5c3cbd2f-fe3c-492d-9283-aea74698bfc1)
![GitHub issue on repo](https://github.com/user-attachments/assets/13ea42ef-4a6f-4ed5-9061-56a53523ca0e)


### Shell + reasoning:
```bash
repocli "run git log --oneline -5 and summarize what has been worked on recently"
```
<img width="1594" height="216" alt="image" src="https://github.com/user-attachments/assets/fddfdbea-b88e-4952-ad1e-c3bba581eada" />


## Tech Stack

- **Node.js** — Runtime environment that executes the CLI tool
- **TypeScript** — Adds static typing to catch errors at compile time
- **Groq SDK (Llama 3.3 70B)** — AI brain of the agent, handles reasoning and tool call decisions
- **Octokit** — GitHub REST API client for creating and reading issues
- **Commander** — Parses CLI arguments and handles command structure
- **Chalk** — Adds colors to terminal output
- **Ora** — Spinner and loading animations in the terminal
- **Inquirer** — Interactive confirmation prompts for destructive actions
  
## Project Structure
```
src/
│   agent.ts        — Core agent loop, tool dispatcher, and Groq integration
│   index.ts        — CLI entry point, Commander setup, interactive mode
│
└───tools/
        filesystem.ts   — File operations (read, write, delete, search, list)
        github.ts       — GitHub API tools (create, read, list issues)
        shell.ts        — Shell command execution with safety guardrails
```

## Author

## Author

**Aryan**
- GitHub: [@Aryan-404-404](https://github.com/Aryan-404-404)
- npm: [@aryan-404-404/repocli](https://www.npmjs.com/package/@aryan-404-404/repocli)
- LinkedIn: [linkedin.com/aryan](https://www.linkedin.com/in/aryan-599443271/)
