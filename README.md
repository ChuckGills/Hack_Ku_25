# Git Guru
Git Guru is your sidekick for seamless PR management. It lets you easily view pull requests, auto-format and lint code ,summarize commit history using the Gemini API—all from your terminal.

---

##  Inspiration

Managing pull requests from the command line can be tedious, especially when juggling code reviews, formatting standards, and commit history. We wanted a CLI tool that simplifies this workflow, integrates AI for better context, and enhances productivity without leaving the terminal. Thus, **Git Guru** was born—a fast, smart, and minimal PR assistant.

---

##  What it does

**Git Guru** is a CLI interface that streamlines GitHub pull request management. It lets users:

- View and interact with pull requests directly in the terminal.
- Automatically format and lint code to meet best practices.
- Summarize commit messages using the Gemini API for quick insights.
- Seamlessly integrate with GitHub CLI to perform advanced PR operations like reviewing, merging, and commenting.

---

## How we built it
- **Electron**  Used for frontend UI/UX
- Built using **Python** for CLI logic and API integration.
- Integrated **GitHub CLI (`gh`)** commands using subprocess calls.
- Used the **Gemini API** for generating commit summaries via natural language.
- Leveraged **linters/formatters** like `black`, `eslint`, and `prettier` depending on language context.
- Organized the tool as a modular CLI with extensible commands and subcommands.

---



---

##  Accomplishments that we're proud of

- Created a cohesive CLI experience that feels smooth and intuitive.
- Successfully integrated multiple tools (GitHub CLI, Gemini API, linters) into one seamless workflow.
- Made reviewing PRs and understanding commit history significantly faster.

---

##  What we learned

- How to design CLI tools that play nicely with existing developer workflows.
- How to work with the Gemini API for natural language summarization.
- The importance of modular design for future feature expansion.

---

## What's next for Git Guru


- Explore integrating with Slack or Discord for PR notifications and summaries.

This web site is using `markedjs/marked`.
