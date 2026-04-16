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