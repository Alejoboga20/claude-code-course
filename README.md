# Claude Code

This repository contains my learnings of `claude-code`

## First steps

After installing `claude-code` in the terminal we need to authenticate into our account using the following commands:

```bash
claude
/login # We need to open web browser and access into our account.
```

Once we are authenticated we can check the available models and select the one we want to use:

```bash
/model
```

Out of that list we can select the model we want to use for, for example, planning:

```bash
/model opusplan

    1. Default (recommended)  Sonnet 5 · Efficient for routine tasks
    2. Sonnet                 Sonnet 5 · Efficient for routine tasks
    3. Fable                  Fable 5 · Most capable for your hardest and longest-running tasks · Requires usage credits
    4. Opus                   Opus 4.8 · Best for everyday, complex tasks · ~2× usage vs Sonnet
    5. Haiku                  Haiku 4.5 · Fastest for quick answers
  ❯ 6. Opus Plan Mode ✔       Use Opus in plan mode, Sonnet otherwise
```
