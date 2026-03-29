import { getConfig } from "../lib/config.js";
import { apiCall } from "../lib/client.js";

const OPS = {
  // My Activities
  "activities.list": { desc: "Get my activities", path: "/rg/study_activities/getActivitiesByRole", method: "GET", params: [] },
  "activities.get": { desc: "Get activity detail", path: "/rg/study_activities/{id}", method: "GET", params: ["id"] },
  // My Classes
  "class.my": { desc: "Get my class", path: "/rg/classGroups/role/{activityId}", method: "GET", params: ["activityId"] },
  "class.schedule": { desc: "Get class schedule", path: "/rg/classGroups/{classGroupId}/schedule", method: "GET", params: ["classGroupId"] },
  // My Vehicle
  "vehicle.my": { desc: "Get my vehicle", path: "/rg/team_groups/my-team-group", method: "GET", params: [] },
  // Car Assignment
  "car.assign": { desc: "Assign members", path: "/rg/team_groups/separateCars", method: "POST", params: ["memberIds", "teamGroupId", "activityId", "classGroupId"] },
  "car.unassign": { desc: "Unassign members", path: "/rg/team_groups/removeCarPeople", method: "POST", params: ["memberIds", "teamGroupId", "activityId", "classGroupId"] },
  "car.mark-leave": { desc: "Mark leave", path: "/rg/team_groups/markLeave", method: "POST", params: ["memberId", "leaveType", "activityId"] },
  "car.mark-unpaid": { desc: "Mark unpaid", path: "/rg/team_groups/markUnpaid", method: "POST", params: ["memberId", "unpaidType", "activityId"] },
  // Sign
  "sign.create": { desc: "Sign in", path: "/rg/sign_records", method: "POST", params: ["memberId", "activityId", "signType", "signLocation"] },
  "sign.list": { desc: "List sign records", path: "/rg/sign_records/activity/{activityId}", method: "GET", params: ["activityId"] },
  "sign.stats": { desc: "Sign statistics", path: "/rg/classGroups/signStatistics", method: "GET", params: [] },
  // Checkpoint
  "checkpoint.create": { desc: "Create checkpoint", path: "/rg/checkpoint_records", method: "POST", params: ["dayManagerId", "activityId", "teamGroupId", "classGroupId", "recordContent", "checkpointFiles", "isAbnormal", "abnormalDescription", "location"] },
  "checkpoint.list": { desc: "List checkpoints", path: "/rg/checkpoint_records/by/day_manager/{dayManagerId}", method: "GET", params: ["dayManagerId"] },
  "checkpoint.my": { desc: "Get my checkpoint", path: "/rg/checkpoint_records/findByDayManagerIdAndUserId/{dayManagerId}", method: "GET", params: ["dayManagerId"] },
  "checkpoint.update": { desc: "Update checkpoint", path: "/rg/checkpoint_records/{id}", method: "PUT", params: ["id", "recordContent", "checkpointFiles", "isAbnormal", "abnormalDescription"] },
  // Day Schedule
  "days.list": { desc: "List days", path: "/rg/day_managers/getDayManagersByTeamIdAndDayManagerId", method: "GET", params: ["activityId", "classGroupId", "includeFiles"] },
  // Reports
  "reports.my": { desc: "My reports", path: "/rg/activity-reports/my-reports", method: "GET", params: [] },
  "reports.export-word": { desc: "Export Word", path: "/rg/activity-reports/{reportId}/export/word", method: "GET", params: ["reportId"] },
  "report.create": { desc: "Create report", path: "/rg/api/reports", method: "POST", params: ["activityId", "staffId", "classGroupId", "reportType", "content"] },
  "report.list": { desc: "List reports", path: "/rg/api/reports/list", method: "GET", params: ["activityId"] },
};

export const mentor = {
  async execute(args) {
    if (args.length === 0 || args[0] === "--help" || args[0] === "-h") {
      return printHelp();
    }

    const [resource, action, ...rest] = args;
    const opKey = `${resource}.${action}`;
    const opDef = OPS[opKey];

    if (!opDef) {
      console.error(`Unknown operation: ${resource} ${action || ""}`);
      return printHelp();
    }

    const params = parseArgs(rest, opDef.params);

    let path = opDef.path;
    for (const [key, value] of Object.entries(params)) {
      if (path.includes(`{${key}}`)) {
        path = path.replace(`{${key}}`, value);
        delete params[key];
      }
    }

    const config = getConfig();
    const data = await apiCall(config, opDef.method, path, params);
    console.log(JSON.stringify(data, null, 2));
  },
};

function parseArgs(args, paramDefs) {
  const params = {};
  let i = 0;
  while (i < args.length) {
    const arg = args[i];
    if (arg === "--help" || arg === "-h") {
      params._help = true;
      i++;
      continue;
    }
    if (arg === "--json") {
      i++;
      if (i < args.length) {
        try {
          Object.assign(params, JSON.parse(args[i]));
        } catch {
          console.error("Invalid JSON:", args[i]);
          process.exit(1);
        }
      }
      i++;
      continue;
    }
    if (arg.startsWith("--")) {
      const key = arg.slice(2);
      i++;
      if (i < args.length && !args[i].startsWith("--")) {
        params[key] = args[i];
      }
      i++;
      continue;
    }
    const requiredParams = paramDefs.filter(p => !p.endsWith("?"));
    for (const p of requiredParams) {
      if (params[p] === undefined && arg) {
        params[p] = arg;
        break;
      }
    }
    i++;
  }
  return params;
}

function printHelp() {
  console.log(`ranger-cli mentor - Mentor operations

Usage: ranger-cli mentor <resource> <action> [options]

Resources & Actions:
  activities   list|get
  class        my|schedule
  vehicle      my
  car          assign|unassign|mark-leave|mark-unpaid
  sign         create|list|stats
  checkpoint   create|list|my|update
  days         list
  reports      my|export-word
  report       create|list

Options:
  --json <json>   Pass parameters as JSON string
  --<param> <value>  Set parameter by name
  --help, -h      Show this help

Examples:
  ranger-cli mentor activities list
  ranger-cli mentor class my --activity-id xxx
  ranger-cli mentor sign create --member-id xxx --activity-id xxx
  ranger-cli mentor checkpoint create --day-manager-id xxx --activity-id xxx --record-content "安全到达"
`);
}
