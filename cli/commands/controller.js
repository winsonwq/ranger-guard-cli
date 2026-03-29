import { getConfig } from "../lib/config.js";
import { apiCall } from "../lib/client.js";

const OPS = {
  // Activity Management
  "activities.search": { desc: "Search activities", path: "/rg/study_activities/getActivitiesByPageAndCondition", method: "GET", params: ["search", "activityTheme", "status", "startDate", "endTime", "page", "size"] },
  "activities.get": { desc: "Get activity detail", path: "/rg/study_activities/{id}", method: "GET", params: ["id"] },
  "activities.members": { desc: "Get all members", path: "/rg/study_activities/getActivityMemberAll", method: "GET", params: [] },
  "activities.roled-members": { desc: "Get roled members", path: "/rg/study_activities/{activityId}/roled-members", method: "GET", params: ["activityId"] },
  "activities.confirm-start": { desc: "Confirm start", path: "/rg/study_activities/confirmActivity", method: "POST", params: [] },
  "activities.confirm-end": { desc: "Confirm end", path: "/rg/study_activities/confirmActivityEnd", method: "POST", params: [] },
  "activities.copy": { desc: "Copy activity", path: "/rg/study_activities/{id}/copy", method: "POST", params: ["id"] },
  // Class Group Management
  "class-groups.search": { desc: "Search class groups", path: "/rg/classGroups/getClassGroupsAndPage", method: "GET", params: ["activityId", "search", "pageNum", "pageSize"] },
  "class-groups.get": { desc: "Get class group detail", path: "/rg/classGroups/{id}", method: "GET", params: ["id"] },
  "class-groups.export-members": { desc: "Export members", path: "/rg/classGroups/members/export", method: "GET", params: ["activityId"] },
  "class-groups.sign-statistics": { desc: "Sign statistics", path: "/rg/classGroups/signStatistics", method: "GET", params: [] },
  "class-groups.export-sign": { desc: "Export sign data", path: "/rg/classGroups/signStatistics/export", method: "GET", params: [] },
  // Team Group (Vehicle) Management
  "vehicles.overview": { desc: "Get overview", path: "/rg/team_groups/getTeamGroupsController", method: "GET", params: [] },
  "vehicles.list": { desc: "List vehicles", path: "/rg/team_groups/getTeamGroupsByConditionAndPage", method: "GET", params: ["activityId", "name", "mentorId", "securityId", "search", "pageNum", "pageSize"] },
  "vehicles.assign": { desc: "Assign members", path: "/rg/team_groups/separateCars", method: "POST", params: ["memberIds", "teamGroupId", "activityId", "classGroupId"] },
  "vehicles.unassign": { desc: "Unassign members", path: "/rg/team_groups/removeCarPeople", method: "POST", params: ["memberIds", "teamGroupId", "activityId", "classGroupId"] },
  "vehicles.mark-leave": { desc: "Mark leave", path: "/rg/team_groups/markLeave", method: "POST", params: ["memberId", "leaveType", "activityId"] },
  "vehicles.mark-unpaid": { desc: "Mark unpaid", path: "/rg/team_groups/markUnpaid", method: "POST", params: ["memberId", "unpaidType", "activityId"] },
  "vehicles.export": { desc: "Export vehicles", path: "/rg/team_groups/export", method: "GET", params: ["activityId"] },
  "vehicles.drivers": { desc: "Get drivers", path: "/rg/team_groups/getTeamGroupByActivityId", method: "GET", params: [] },
  // Day Manager
  "days.list": { desc: "List days", path: "/rg/day_managers/activity/{activityId}", method: "GET", params: ["activityId"] },
  "days.class-checkpoint": { desc: "Class checkpoint info", path: "/rg/team_groups/getClassAndCheckpointInfoByActivityId", method: "GET", params: [] },
  "days.export-images": { desc: "Export images", path: "/rg/day_managers/downloadImages/export", method: "GET", params: ["activityId", "classGroupId"] },
  // Reports
  "reports.create": { desc: "Create report", path: "/rg/api/reports", method: "POST", params: ["activityId", "staffId", "classGroupId", "reportType", "content"] },
  "reports.list": { desc: "List reports", path: "/rg/api/reports/getReportByPageAndCondition", method: "GET", params: ["activityId", "staffId", "classGroupId", "search", "reportType", "isHandled", "page", "size"] },
  // Sign Records
  "sign.manager-sign": { desc: "Manager sign", path: "/rg/sign_records/managerSign", method: "POST", params: ["signRecords"] },
  "sign.sign-and-assign": { desc: "Sign and assign", path: "/rg/sign_records/signAndSeparateCar", method: "POST", params: ["memberId", "teamGroupId", "activityId", "classGroupId", "signType"] },
  // Statistics
  "stats.summary": { desc: "Get stats summary", path: "/rg/statistics/activities/{activityId}/summary", method: "GET", params: ["activityId"] },
  // Activity Reports
  "reports.generate": { desc: "Generate AI report", path: "/rg/activity-reports/generate", method: "POST", params: ["activityId", "stream"] },
  "reports.save-history": { desc: "Save history", path: "/rg/activity-reports/{activityId}/save-history", method: "POST", params: ["activityId", "content", "chatHistory"] },
  "reports.export-word": { desc: "Export Word", path: "/rg/activity-reports/{reportId}/export/word", method: "GET", params: ["reportId"] },
  "reports.export-pdf": { desc: "Export PDF", path: "/rg/activity-reports/{reportId}/export/pdf", method: "GET", params: ["reportId"] },
};

export const controller = {
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
  console.log(`ranger-cli controller - Controller operations

Usage: ranger-cli controller <resource> <action> [options]

Resources & Actions:
  activities    search|get|members|roled-members|confirm-start|confirm-end|copy
  class-groups  search|get|export-members|sign-statistics|export-sign
  vehicles      overview|list|assign|unassign|mark-leave|mark-unpaid|export|drivers
  days          list|class-checkpoint|export-images
  reports       create|list|generate|save-history|export-word|export-pdf
  sign          manager-sign|sign-and-assign
  stats         summary

Options:
  --json <json>   Pass parameters as JSON string
  --<param> <value>  Set parameter by name
  --help, -h      Show this help

Examples:
  ranger-cli controller activities search --status 0
  ranger-cli controller vehicles overview
  ranger-cli controller class-groups sign-statistics
`);
}
