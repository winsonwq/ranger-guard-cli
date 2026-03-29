# AGENTS.md - Ranger Guard CLI

This is the home directory for Ranger Guard CLI - a Deno-based CLI tool and skill package for the Ranger Guard educational activity management system.

## About

Ranger Guard CLI provides both:
1. **CLI Tool** (`cli/`): Deno-based command-line interface for human and AI agents
2. **Skills** (`skills/`): OpenClaw skill packages for AI agent integration

## Quick Start

### CLI Setup

```bash
# Install Deno (if not already)
curl -fsSL https://deno.land/install.sh | sh

# Configure CLI
ranger-cli config set-api-base http://8.156.83.69:8888/rg
ranger-cli config set-token <your-token>

# Test
ranger-cli config show
```

### Using CLI

```bash
# Admin operations
ranger-cli admin accounts list
ranger-cli admin accounts create --username 张三 --phone 138xxx --role role-admin

# Controller operations
ranger-cli controller activities search --status 0
ranger-cli controller vehicles overview

# Mentor operations
ranger-cli mentor activities list
ranger-cli mentor sign create --member-id xxx --activity-id xxx
```

### Help

```bash
ranger-cli --help
ranger-cli config --help
ranger-cli admin --help
ranger-cli controller --help
ranger-cli mentor --help
```

## Directory Structure

```
ranger-guard-cli/
├── AGENTS.md              # This file
├── docs/                  # Human-facing documentation
│   ├── CLI_USAGE.md       # Detailed CLI usage guide
│   └── TUI_GUIDE.md       # TUI setup guide
├── skills/                # OpenClaw skill packages
│   ├── ranger-admin/      # Admin role skills
│   ├── ranger-controller/ # Controller role skills
│   └── ranger-mentor/     # Mentor role skills
└── cli/                   # Deno CLI source
    ├── ranger_cli.ts      # Main entry point
    ├── mod.ts             # Module exports
    ├── lib/                # Shared libraries
    │   ├── config.ts       # Config management
    │   ├── client.ts       # HTTP client
    │   └── prompt.ts       # TUI prompt
    └── commands/           # Command implementations
        ├── config.ts       # config command
        ├── admin.ts        # admin command
        ├── controller.ts   # controller command
        └── mentor.ts       # mentor command
```

## For AI Agents

When using this skill package:

1. **Read the relevant SKILL.md** for your role (admin/controller/mentor)
2. **CLI is the preferred interface** - use `ranger-cli` commands instead of raw HTTP calls when possible
3. **CLI outputs structured JSON** - parse the output for the data you need
4. **All operations require config** - ensure `ranger-cli config show` returns valid values before proceeding

## Development

### Running from Source

```bash
deno run --allow-net --allow-read --allow-write --allow-env cli/ranger_cli.ts <command>
```

### Adding New Operations

1. Add operation definition to the appropriate `*_OPS` constant in `cli/commands/*.ts`
2. Add CLI usage example to `references/*-cli.md`
3. Add API reference to `references/*-api.md` if not already present
4. Update the operation index in `skills/*/SKILL.md`

## Architecture Notes

### Config Storage

CLI config is stored at `~/.config/ranger-guard-cli/config.json`:

```json
{
  "apiBase": "http://8.156.83.69:8888/rg",
  "token": "your-jwt-token"
}
```

### API Client

The HTTP client automatically adds:
- `Authorization: Bearer {token}` header
- `Content-Type: application/json` header
- JSON body serialization

### Operation Definitions

Each operation in `*_OPS` follows this schema:

```typescript
{
  desc: string,      // Short description for --help
  path: string,      // API path (may contain {param} placeholders)
  method: string,    // HTTP method
  params: string[],  // Parameter names (required params first, optional marked with ?)
}
```

## Maintenance

- **CLI Source**: `cli/` directory - modify command files
- **Skills**: `skills/` directory - modify SKILL.md and reference files
- **Documentation**: `docs/` directory - human-facing docs

## Environment

- **Runtime**: Deno
- **Permissions**: `--allow-net --allow-read --allow-write --allow-env`
- **Config Location**: `~/.config/ranger-guard-cli/`
