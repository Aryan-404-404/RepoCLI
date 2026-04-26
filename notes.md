# Agent Architecture: Native FS vs. Shell Execution

### 1. Native File System (`fs` module)
- **Role:** The Librarian.
- **Mechanism:** Direct JavaScript API calls to the Operating System's file layer.
- **Capabilities:** Extremely fast at reading, writing, and listing files.
- **Limitation:** Cannot "run" programs. It can only look at and modify static data on the disk.

### 2. Shell Execution (`child_process.execSync`)
- **Role:** The Operator.
- **Mechanism:** Spawns a sub-shell (terminal instance) to execute external binaries.
- **Capabilities:** Can run any command available in the terminal (e.g., `git`, `npm`, `tsc`, `python`).
- **Necessity:** Required for tasks Node.js cannot do natively, such as managing version control or installing packages.

### 3. Why `execSync` over `exec`?
- **The Step-by-Step Rule:** AI Agents function in a reasoning loop. Using synchronous execution forces the Node.js process to wait for the command to finish. 
- **Result:** This ensures the "Brain" receives the full command output before it decides what to do next, preventing the agent from "tripping over itself" by moving to the next step while a command is still running in the background.





Delta.content
2. delta.content — here's exactly what it is:
Without streaming, Groq sends you the complete message:
json{ "message": { "content": "A terminal AI agent is..." } }
With streaming, Groq sends many small chunks over time. Each chunk has a delta — meaning "the new piece that just arrived":
jsonchunk 1: { "delta": { "content": "A" } }
chunk 2: { "delta": { "content": " terminal" } }
chunk 3: { "delta": { "content": " AI" } }
chunk 4: { "delta": { "content": "" } }  ← empty, stream ending

Whole flow of the app
npx @aryan-404-404/repocli "list files"
        ↓
npx downloads the package from npm
        ↓
reads package.json → finds bin field
        ↓
bin says: "repocli" command → run ./dist/index.js
        ↓
OS reads first line of dist/index.js → #!/usr/bin/env node
        ↓
OS uses Node to execute dist/index.js
        ↓
Commander parses "list files"
        ↓
agent runs