# TUI Setup Guide

## Overview

The `ranger-cli config` command provides an interactive TUI (Text User Interface) for configuring your CLI settings.

## Interactive Setup

Simply run:

```bash
ranger-cli config
```

You'll be prompted to enter:

1. **API Base URL** - The base URL of the Ranger Guard API
   - Default: (none)
   - Example: `http://api.huyouxia.cn`

2. **Access Token** - Your JWT access token
   - Default: (none)
   - Example: `eyJhbGciOiJIUzI1NiJ9...`

## Non-Interactive Configuration

If you prefer command-line flags:

```bash
# Set API base
ranger-cli config set-api-base http://api.huyouxia.cn

# Set token
ranger-cli config set-token eyJhbGciOiJIUzI1NiJ9...
```

## Config File Location

Configuration is stored at:

```
~/.config/ranger-guard-cli/config.json
```

Example content:

```json
{
  "apiBase": "http://api.huyouxia.cn",
  "token": "eyJhbGciOiJIUzI1NiJ9..."
}
```

## Getting Your Token

### From the Web App

1. Log in to the Ranger Guard web application
2. Open browser developer tools (F12)
3. Go to Network tab
4. Find any API request
5. Copy the `Authorization` header value (after "Bearer ")

### From the Mobile App

1. Log in to the Ranger Guard WeChat mini-program
2. The token is stored in the app's session
3. Use the web app method to extract it

## TUI Implementation

The TUI uses simple stdin/stdout prompts. For future enhancement, consider using a library like:

- **inquirer**: Popular Node.js prompt library (ported to Deno)
- **prompts**: Lightweight Deno-compatible library
- **dialog**: Deno TUI dialog library

Current implementation is minimal:

```typescript
// cli/lib/prompt.ts
export function prompt(message: string): Promise<string> {
  return new Promise((resolve) => {
    Deno.stdout.writeSync(new TextEncoder().encode(message + " "));
    const buf = new Uint8Array(1024);
    const n = Deno.stdin.readSync(buf);
    resolve(n === null ? "" : new TextDecoder().decode(buf.subarray(0, n)).trim());
  });
}
```

## Security Notes

- **Token Storage**: The token is stored in plain text in `config.json`. Ensure proper file permissions:
  ```bash
  chmod 600 ~/.config/ranger-guard-cli/config.json
  ```
- **Don't commit**: Never commit `config.json` to version control
- **Token refresh**: Tokens may expire. Re-run `ranger-cli config set-token` if you get 401 errors

## Troubleshooting

### TUI prompts not showing

Ensure you're running in a terminal, not piped mode:

```bash
# Won't work (piped)
echo "" | ranger-cli config

# Works (interactive)
ranger-cli config
```

### Config file corrupted

Delete the config file and reconfigure:

```bash
rm ~/.config/ranger-guard-cli/config.json
ranger-cli config
```
