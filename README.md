# Gea UI Engineering Skill (`gea-ui-engineering`)

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Compatible with Antigravity](https://img.shields.io/badge/Antigravity-Compatible-green.svg)](#installation)
[![Compatible with Claude Code](https://img.shields.io/badge/Claude%20Code-Compatible-orange.svg)](#installation)
[![Gea Framework](https://img.shields.io/badge/Gea-dashersw%2Fgea-purple.svg)](https://github.com/dashersw/gea)

An expert-grade AI Agent Skill for building, refactoring, debugging, and optimizing ultra-light reactive web applications with **[Gea](https://github.com/dashersw/gea)** (`@geajs/core` ecosystem).

Compatible with **Google Antigravity IDE**, **Claude Code**, **Cursor**, **Codex**, and other AI coding assistants supporting the open Skill specification (`SKILL.md`).

---

## What is Gea?

**[Gea](https://github.com/dashersw/gea)** is a compiler-first, ultra-lightweight reactive UI framework for the browser, created by [Armağan Amcalar](https://github.com/dashersw) ([@dashersw](https://github.com/dashersw)). Unlike heavy virtual-DOM or runtime-heavy frameworks, Gea leverages:
- **Compile-time JSX**: Surgical DOM updates without virtual-DOM overhead.
- **Proxy-based Stores**: Clean, reactive state classes with native getters and observation.
- **Direct DOM Ownership**: Deterministic component lifecycles and micro-bundle sizes.
- **Vite-Native Pipeline**: Powered by `@geajs/vite-plugin`.

---

## Skill Capabilities

When loaded by your AI assistant, this skill empowers the agent to:
- **Architecture & Setup**: Scaffold and configure new Gea projects using Vite and TypeScript.
- **Reactivity & State**: Design clean, minimal stores and observer patterns without leaking subscriptions.
- **Syntax Enforcement**: Ensure idiomatic Gea JSX conventions (e.g. `class` over `className`, lowercase events like `click`/`input` instead of `onClick`).
- **SSR & Hydration**: Handle server-rendered HTML and client-side hydration with `@geajs/ssr`.
- **Motion & Animations**: Implement smooth, 60fps CSS keyframes and rAF-driven animations without layout thrashing.
- **Headless UI & Routing**: Integrate accessible dialogs (Zag.js), mobile-first patterns, and lightweight routers.
- **Performance Auditing**: Diagnose bundle bloat, unnecessary re-renders, and memory leaks.

---

## Repository Structure

```text
gea-ui-engineering-skill/
├── SKILL.md                          # Main skill definition (YAML frontmatter + instructions)
├── gea-ui-engineering.skill          # Packaged zip archive for instant import
├── references/
│   ├── api-reference.md              # Complete Gea API guide and syntax rules
│   ├── performance-and-animation.md  # Motion guidelines, rAF loops, DOM performance
│   └── recipes-and-diagnostics.md    # Common recipes, troubleshooting, hydration fixes
└── templates/
    ├── minimal-starter/              # Fully configured Vite + TS + Gea starter app
    ├── mobile-starter/               # Mobile view template with touch-friendly layout
    ├── router-starter/               # Client-side routing implementation example
    └── zag-ui-dialog/                # Accessible headless dialog integration
```

---

## Installation

### 🚀 Easiest Method: Ask Your AI Coding Agent (Recommended)

Simply share this repository link with your AI coding assistant (Google Antigravity, Claude Code, Cursor, Codex, etc.) and prompt it:

> *"Please install the Gea skill from https://github.com/cumhur/gea-ui-engineering-skill onto my environment."*

Your agent will automatically clone or download the skill into the appropriate directory (`~/.gemini/config/skills/`, `~/.claude/skills/`, or `.agents/skills/`) and configure it for immediate use.

---

### 🛠️ Manual Installation Options

If you prefer to install it manually in your environment:

#### 1. Google Antigravity IDE

* **Global Installation (Available across all projects):**
  ```bash
  git clone https://github.com/cumhur/gea-ui-engineering-skill.git ~/.gemini/config/skills/gea-ui-engineering
  ```

* **Project-Local Installation (Specific project only):**
  ```bash
  git clone https://github.com/cumhur/gea-ui-engineering-skill.git .agents/skills/gea-ui-engineering
  ```

#### 2. Claude Code

* **Global Installation:**
  ```bash
  git clone https://github.com/cumhur/gea-ui-engineering-skill.git ~/.claude/skills/gea-ui-engineering
  ```

#### 3. Direct Zip Download (.skill)

You can also download the pre-packaged archive directly from the repository:
* [gea-ui-engineering.skill](gea-ui-engineering.skill) (Extract into your agent's skills directory)

---

## Quick Start with the Minimal Starter

The `templates/minimal-starter` directory contains a ready-to-run Gea web application:

```bash
# Copy the minimal template to your project
cp -r templates/minimal-starter my-gea-app
cd my-gea-app

# Install dependencies and start the dev server
npm install
npm run dev
```

---

## Acknowledgements & Credits

* **Gea Creator**: [Armağan Amcalar](https://github.com/dashersw) ([@dashersw](https://github.com/dashersw))
* **Original Repository**: [dashersw/gea](https://github.com/dashersw/gea)

This skill is a community tool crafted to help AI agents generate idiomatic, high-performance code following Gea's design philosophy and architecture.

---

## License

* **License**: [MIT](LICENSE) (only SKILL license, Not GEA)
