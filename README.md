# Claude Code

This repository contains my notes and learnings on `claude-code`, an agentic coding assistant that runs in your terminal.

Claude Code is an agentic coding environment. Unlike a chatbot that answers questions and waits, Claude Code can read your files, run commands, make changes, and autonomously work through problems while you watch, redirect, or step away entirely.

See [docs/installations.md](docs/installations.md) for the recommended tools and setup used throughout this course.

## First steps

### Authentication

After installing `claude-code`, launch it and log in:

```bash
claude
/login   # opens a browser window to authenticate your account
```

### Choosing a model

Once authenticated, list the available models with:

```bash
/model
```

This opens a menu to pick which model to use:

```
  1. Default (recommended)  Sonnet 5 · Efficient for routine tasks
  2. Sonnet                 Sonnet 5 · Efficient for routine tasks
  3. Fable                  Fable 5 · Most capable for your hardest and longest-running tasks · Requires usage credits
  4. Opus                   Opus 4.8 · Best for everyday, complex tasks · ~2× usage vs Sonnet
  5. Haiku                  Haiku 4.5 · Fastest for quick answers
  6. Opus Plan Mode         Use Opus in plan mode, Sonnet otherwise
```

You can also jump straight to a specific model, e.g. to use Opus for planning and Sonnet for everything else:

```bash
/model opusplan
```

### Other useful commands

| Command    | Description                        |
| ---------- | ---------------------------------- |
| `/usage`   | Check usage and stats              |
| `/clear`   | Clear the current context          |
| `/ide`     | Connect Claude Code to your editor |
| `/context` | Check what's in the context        |
| `/rewind`  | Revert changes made by claude.     |

## Skills

Skills = packaged instructions, load on demand, extend agent capability without bloat context.

Agent see skill name + one-line description upfront. Match task, invoke, full instructions load then. Skip otherwise — save tokens.

Use case: repo-specific workflow, checklist, domain knowledge, tool wrapper. Package once, reuse many session.

Contrast subagent: skill = instructions injected into current thread. Subagent = separate context, own tools, results return compressed.

## Claude Code File

Use the command `/init` to init a new `CLAUDE.md` file with codebase documentation. **This file is included in the context window**. Ideally, it should be small.

With `#` we can save some memories in claude. Memory files live somewhere else, outside the project (`Usually /Users/username/.claude`). There we can find memories classified by project with a `MEMORY.md` file.

Example:

```bash
# always answer in English
```

## Multi Modal Input

We can paste images inside the terminal and, we can combine it with text. (we can also send entire files of different types to add more context for claude to work with).

```bash
[Image #1] use this image as one of the asteroids variant
```

## Use of GIT

Claude can use GIT from our terminal (It has full access to it as it can see .git directory inside the project). It may be better to use plan mode to explore git history changes.
To work on new features it's recommended to work in a different branch.

### Important Notes

- Always clear the context when finishing a task. This is really important to avoid consuming more tokens than necessary. (Use `/clear` command).
- Rename session and compact them for later review (`/rename [name]` `/resume [name]`).
- Prioritize CLI over MCPs.
- Install language plugins.
- Use `hooks` and `skills` to reduce the context.
- Delegate tasks to `subagents`.
- When using `/clear` we lost context and we are unble to use `/rewind`.

### Useful Resources

- Cost Usage: [Anthropic Recommendations](https://code.claude.com/docs/en/costs)
- Reusable Skills: [Skills.sh](https://www.skills.sh/)
- Using local ollama models: [Guide](https://gist.github.com/Klerith/afaf750d5172a648fe262cd12b4cd7d8)
- The agent loop: [Site](https://ccunpacked.dev/#agent-loop)
