# CLI Usage Guide

## Overview

`ranger-cli` is a Deno-based CLI tool for interacting with the Ranger Guard API. It supports admin, controller, and mentor operations.

## Installation

### Option 1: Run from Source

```bash
deno run --allow-net --allow-read --allow-write --allow-env \
  ~/.openclaw/workspace/ranger-guard-cli/cli/ranger_cli.ts <command>
```

### Option 2: Install as Executable

```bash
deno install --allow-net --allow-read --allow-write --allow-env \
  -n ranger-cli \
  ~/.openclaw/workspace/ranger-guard-cli/cli/ranger_cli.ts
```

## Configuration

Before using the CLI, configure your API base URL and access token:

```bash
# Set API base URL
ranger-cli config set-api-base http://api.huyouxia.cn

# Set access token
ranger-cli config set-token <your-jwt-token>

# Show current config
ranger-cli config show

# Interactive setup (TUI)
ranger-cli config
```

## Commands

### Config Command

Manage CLI configuration.

```bash
ranger-cli config set-api-base <url>   # Set API base URL
ranger-cli config set-token <token>     # Set access token
ranger-cli config show                   # Show current config
ranger-cli config                       # Interactive TUI setup
```

### Admin Command

Perform admin operations (accounts, companies, staff, vehicles, etc.).

```bash
ranger-cli admin <resource> <action> [options]

# Examples:
ranger-cli admin accounts list
ranger-cli admin accounts create --username 张三 --phone 138xxx --role role-admin
ranger-cli admin companies list
ranger-cli admin vehicles create --vehicle-number 京A12345 --capacity 45
```

Resources: accounts, companies, staffs, vehicles, permissions, organizations, org-classes, categories

### Controller Command

Perform controller operations (activities, class groups, vehicles, etc.).

```bash
ranger-cli controller <resource> <action> [options]

# Examples:
ranger-cli controller activities search --status 0
ranger-cli controller vehicles overview
ranger-cli controller class-groups sign-statistics
```

Resources: activities, class-groups, vehicles, days, reports, sign, stats

### Mentor Command

Perform mentor operations (my class, sign-in, checkpoints, etc.).

```bash
ranger-cli mentor <resource> <action> [options]

# Examples:
ranger-cli mentor activities list
ranger-cli mentor class my --activity-id xxx
ranger-cli mentor sign create --member-id xxx --activity-id xxx
ranger-cli mentor checkpoint create --day-manager-id xxx --activity-id xxx --record-content "安全到达"
```

Resources: activities, class, vehicle, car, sign, checkpoint, days, reports, report

## Options

### Common Options

| Option | Description |
|--------|-------------|
| `--json <json>` | Pass parameters as JSON string |
| `--help`, `-h` | Show help for command |
| `--<param> <value>` | Set parameter by name |

### JSON Mode

For complex parameters or parameters containing special characters:

```bash
ranger-cli admin accounts create --json '{
  "username": "张三",
  "phone": "13800138000",
  "role": "role-admin"
}'
```

## Help System

```bash
ranger-cli --help                    # General help
ranger-cli config --help             # Config command help
ranger-cli admin --help              # Admin command help
ranger-cli admin accounts --help     # Admin subcommand help
ranger-cli admin accounts create --help  # Operation help
```

## Output Format

All commands output JSON to stdout on success. The JSON is the `data` field from the API response.

Error messages are printed to stderr with exit code 1.

## Exit Codes

- 0: Success
- 1: Error (invalid arguments, API error, etc.)

## Examples

### Complete Workflow

```bash
# 1. Setup
ranger-cli config set-api-base http://api.huyouxia.cn
ranger-cli config set-token eyJhbGciOiJIUzI1NiJ9...

# 2. Check config
ranger-cli config show

# 3. Search for activities
ranger-cli controller activities search --status 0

# 4. Get activity details
ranger-cli controller activities get --id act123

# 5. Check vehicle overview
ranger-cli controller vehicles overview

# 6. Sign in a member
ranger-cli mentor sign create --member-id mem456 --activity-id act123
```

## Troubleshooting

### "Config not found"

Run `ranger-cli config` to set up your API base and token.

### "HTTP Error: 401"

Your token is invalid or expired. Re-authenticate and update your token:

```bash
ranger-cli config set-token <new-token>
```

### "HTTP Error: 403"

Your role doesn't have permission for this operation. Check your role and ensure you're using the correct command prefix (admin/controller/mentor).

### "Invalid JSON"

Check your JSON syntax. Use single quotes around the JSON string:

```bash
# Wrong
ranger-cli admin accounts create --json {"username": "张三"}

# Correct
ranger-cli admin accounts create --json '{"username": "张三"}'
```
