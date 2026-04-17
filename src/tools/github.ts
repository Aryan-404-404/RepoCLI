import { Octokit } from "octokit";

const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN
})

export async function getGithubIssue(owner: string, repo: string, issue_num: number) {
    try {
        const response = await octokit.rest.issues.get({
            owner: owner,
            repo: repo,
            issue_number: issue_num
        })
        return JSON.stringify({
            title: response.data.title,
            state: response.data.state,
            body: response.data.body,
            url: response.data.html_url
        })
    } catch (error: any) {
        return `Error fetching issue: ${error.message}`;
    }
}

export async function listOpenIssues(owner: string, repo: string){
    try {
        const response = await octokit.rest.issues.listForRepo({
            owner: owner,
            repo: repo,
            state: 'open',
            per_page: 10
        })
        const issues = response.data.map((issue: {number: Number; title: string})=>({
            number: issue.number,
            title: issue.title
        }))
        return JSON.stringify(issues)
    } catch (error: any) {
        return `Error fetching issues: ${error.message}`;
    }
}

export async function createIssue(owner: string, repo: string, title: string, body: string){
    try {
        const response = await octokit.rest.issues.create({
            owner: owner,
            repo: repo,
            titile: title,
            body: body || "",
        })
        return `Success! Created issue #${response.data.number}. URL: ${response.data.html_url}`;
    } catch (error: any) {
        return `Error creating issue: ${error.message}`;
    }
}

// Schemas

export const getGithubIssueDeclaration = {
    type: "function",
    function: {
        name: "getGithubIssue",
        description: "Fetches the details of a specific GitHub issue from a repository. Use this to read bug reports, feature requests, or user feedback.",
        parameters: {
            type: "object",
            properties: {
                owner: {
                    type: "string",
                    description: "The owner of the repository (e.g., 'Aryan-404' or your username)"
                },
                repo: {
                    type: "string",
                    description: "The name of the repository (e.g., 'react' or 'repocli')"
                },
                issueNumber: {
                    type: "integer",
                    description: "The ID number of the issue to fetch"
                }
            },
            required: ["owner", "repo", "issueNumber"]
        }
    }
}

export const listOpenIssuesDeclaration = {
    type: "function",
    function: {
        name: "listOpenIssues",
        description: "List all open issues for a specific GitHub repository. Returns an array of issue numbers and titles. To read the full details of a specific issue, use the getGitHubIssue tool with the provided number.",
        parameters: {
            type: "object",
            properties: {
                owner: {
                    type: "string",
                    description: "The owner of the repository (e.g., 'facebook')"
                },
                repo: {
                    type: "string",
                    description: "The name of the repository (e.g., 'react')"
                }
            },
            required: ["owner", "repo"]
        }
    }
};

export const createIssueDeclaration = {
    type: "function",
    function: {
        name: "createIssue",
        description: "Creates a new issue in a GitHub repository. Use this to report bugs, create TODOs, or open tickets.",
        parameters: {
            type: "object",
            properties: {
                owner: { type: "string", description: "Repository owner (e.g., 'facebook')" },
                repo: { type: "string", description: "Repository name (e.g., 'react')" },
                title: { type: "string", description: "The title of the issue" },
                body: { type: "string", description: "The detailed description or context of the issue" }
            },
            required: ["owner", "repo", "title"]
        }
    }
};