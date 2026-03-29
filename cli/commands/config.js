import { loadConfig, saveConfig } from "../lib/config.js";
import readline from "readline";

const config = {
  async execute(args) {
    if (args.length === 0) {
      await runTUI();
      return;
    }

    const [action, ...rest] = args;

    switch (action) {
      case "set-api-base": {
        const apiBase = rest.join(" ");
        if (!apiBase) {
          console.error("Usage: ranger-cli config set-api-base <url>");
          process.exit(1);
        }
        await updateConfig({ apiBase });
        console.log("API base set.");
        break;
      }
      case "set-token": {
        const token = rest.join(" ");
        if (!token) {
          console.error("Usage: ranger-cli config set-token <token>");
          process.exit(1);
        }
        await updateConfig({ token });
        console.log("Token set.");
        break;
      }
      case "show": {
        const cfg = loadConfig();
        if (!cfg) {
          console.log("No config found.");
        } else {
          console.log(`API Base: ${cfg.apiBase}`);
          console.log(`Token: ${cfg.token ? cfg.token.slice(0, 20) + "..." : "(not set)"}`);
        }
        break;
      }
      case "--help":
      case "-h":
        console.log(`ranger-cli config - Configure CLI settings

Usage:
  ranger-cli config              # Interactive TUI setup
  ranger-cli config set-api-base <url>   # Set API base URL
  ranger-cli config set-token <token>    # Set access token
  ranger-cli config show                 # Show current config
  ranger-cli config --help              # Show this help
`);
        break;
      default:
        console.error(`Unknown action: ${action}`);
        console.error("Use 'ranger-cli config --help' for usage.");
        process.exit(1);
    }
  },
};

async function updateConfig(partial) {
  const current = loadConfig() || { apiBase: "", token: "" };
  saveConfig({ ...current, ...partial });
}

function prompt(question) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise((resolve) => {
    rl.question(question + " ", (answer) => {
      rl.close();
      resolve(answer);
    });
  });
}

async function runTUI() {
  console.log("=== Ranger Guard CLI Setup ===\n");

  const current = loadConfig();

  const apiBase = await prompt(
    `API Base URL${current?.apiBase ? ` [${current.apiBase}]` : ""}:`
  );
  const token = await prompt(
    `Access Token${current?.token ? ` [${current.token.slice(0, 20)}...]` : ""}:`
  );

  const cfg = {
    apiBase: apiBase || current?.apiBase || "",
    token: token || current?.token || "",
  };

  if (!cfg.apiBase || !cfg.token) {
    console.error("\nError: Both API base and token are required.");
    process.exit(1);
  }

  saveConfig(cfg);
  console.log("\nConfig saved successfully.");
}

export { config };
