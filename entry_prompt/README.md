# ZiWound Data Entry — Country Registry

Each country has its own self-contained folder under `entry_prompt/<CODE>/`.  
**Each assignee only edits files within their own country folder** — zero git merge conflicts.

## Country Assignments

| Code | Country | Assignee | Status | Folder |
|------|---------|----------|--------|--------|
| LB | Lebanon | _assigned_ | 🆕 Not started | `entry_prompt/LB/` |
| HR | Croatia | _assigned_ | 🔄 In progress | `entry_prompt/HR/` |
| US | United States | _assigned_ | ⏸️ Paused (half-finished) | `entry_prompt/US/` |

## How to Start a Session

Give your AI agent the starting prompt from `entry_prompt/<CODE>/START.md`.  
The agent then follows this chain within its own folder:

```
START.md → CONTINUE.md → TODO.md → DATA_ENTRY.md
```

It updates `CONTINUE.md`, `TODO.md`, and `RESULT.md` after every microstep — all within its own folder.

## Adding a New Country

1. Copy `entry_prompt/TEMPLATE/` → `entry_prompt/<CODE>/`
2. Fill in the template variables (`{country_name}`, `{country_code}`, `{country_oid}`, target list)
3. Add one row to the table above
4. Done — the assignee now has an isolated workspace

## Rules

- **Never edit files outside your own country folder**
- The root `entry_prompt/README.md` and `entry_prompt/TODO.md` are static — set up once by an admin
- No shared `CONTINUE.md` — each country tracks its own position independently

## ⚠️ Character Encoding Rule (ALL countries)

Non-ASCII content (Persian, Arabic, Chinese, Cyrillic, etc.) **will corrupt** into mojibake if encoding is mishandled. Every country's DATA_ENTRY.md must include encoding guidance. The critical rule:

> **Always use `json.dumps(payload, ensure_ascii=False)` when sending API payloads.**  
> Omitting `ensure_ascii=False` is the #1 cause of data corruption in this project.
