# TOOLS.md - Local Notes

Skills define _how_ tools work. This file is for _your_ specifics — the stuff that's unique to your setup.

## What Goes Here

Things like:

- API keys and credentials (keep secure!)
- Camera names and locations
- SSH hosts and aliases
- Preferred voices for TTS
- Speaker/room names
- Device nicknames
- Anything environment-specific

## Installed Skills & Tools

### tavily-search
- **API Key:** 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
- **Usage:** `node {baseDir}/scripts/search.mjs "query"`
- **Purpose:** AI-optimized web search

### find-skills
- **Usage:** `npx skills find <query>` to search for agent skills
- **Purpose:** Discover and install skills from https://skills.sh/

### proactive-agent
- **Purpose:** Proactive, self-improving agent architecture
- **Key Patterns:**
  - WAL Protocol: Write corrections/decisions before responding
  - Working Buffer: Log exchanges at >60% context
  - Relentless Resourcefulness: Try 10 approaches before asking

## Environment

- **System:** Windows 11 via WSL2 (Ubuntu)
- **Desktop:** C:\Users\CF\Desktop
- **Workspace:** /home/lazily/.openclaw/workspace
- **File paths:** Accessible via /mnt/c/ for Windows files

## Hooks Enabled

- **session-memory:** Saves session context to memory/ when /new is issued
- **command-logger:** Logs all command events to ~/.openclaw/logs/commands.log

## Why Separate?

Skills are shared. Your setup is yours. Keeping them apart means you can update skills without losing your notes, and share skills without leaking your infrastructure.

---

Add whatever helps you do your job. This is your cheat sheet.
