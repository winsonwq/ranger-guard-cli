#!/usr/bin/env node

import { config } from "./commands/config.js";
import { admin } from "./commands/admin.js";
import { controller } from "./commands/controller.js";
import { mentor } from "./commands/mentor.js";

const COMMANDS = {
  config,
  admin,
  controller,
  mentor,
};

function printUsage() {
  console.log(`ranger-cli - Ranger Guard CLI

Usage: ranger-cli <command> [options]

Commands:
  config      Configure API base and token (interactive TUI)
  admin       Admin operations (accounts, companies, staff, vehicles, etc.)
  controller  Controller operations (activities, class groups, vehicles, etc.)
  mentor      Mentor operations (sign-in, checkpoints, reports, etc.)

Examples:
  ranger-cli config set-api-base http://8.156.83.69:8888/rg
  ranger-cli config set-token <your-token>
  ranger-cli config show
  ranger-cli admin accounts list
  ranger-cli admin accounts create --username 张三 --phone 138xxx --role role-admin
  ranger-cli controller activities search --status 0
  ranger-cli mentor sign create --member-id xxx --activity-id xxx

For help on a specific command:
  ranger-cli <command> --help
`);
}

async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    printUsage();
    process.exit(0);
  }

  const [cmd, ...rest] = args;

  if (cmd === "--help" || cmd === "-h") {
    printUsage();
    process.exit(0);
  }

  const command = COMMANDS[cmd];
  if (!command) {
    console.error(`Unknown command: ${cmd}`);
    printUsage();
    process.exit(1);
  }

  try {
    await command.execute(rest);
  } catch (err) {
    console.error("Error:", err.message);
    process.exit(1);
  }
}

main();
