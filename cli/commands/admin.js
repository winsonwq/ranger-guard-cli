import { getConfig } from "../lib/config.js";
import { apiCall } from "../lib/client.js";

const OPS = {
  // Account Management
  "accounts.create": { desc: "Create account", path: "/rg/accounts", method: "POST", params: ["username", "phone", "role", "type", "companyId"] },
  "accounts.list": { desc: "List accounts", path: "/rg/accounts/getAccountsByPageAndCondition", method: "GET", params: ["search", "pageNum", "pageSize"] },
  "accounts.get": { desc: "Get account", path: "/rg/accounts/{id}", method: "GET", params: ["id"] },
  "accounts.update": { desc: "Update account", path: "/rg/accounts/{id}", method: "PUT", params: ["id", "role", "phone", "companyId"] },
  "accounts.delete": { desc: "Delete account", path: "/rg/accounts/{id}", method: "DELETE", params: ["id"] },
  // Company Management
  "companies.create": { desc: "Create company", path: "/rg/companies", method: "POST", params: ["name", "address"] },
  "companies.list": { desc: "List companies", path: "/rg/companies", method: "GET", params: [] },
  "companies.update": { desc: "Update company", path: "/rg/companies", method: "PUT", params: ["id", "name", "address"] },
  "companies.delete": { desc: "Delete company", path: "/rg/companies/{id}", method: "DELETE", params: ["id"] },
  // Staff Management
  "staffs.list": { desc: "List staffs", path: "/rg/staffs/getStaffsByPageAndCondition", method: "GET", params: ["search", "roleType", "pageNum", "pageSize"] },
  "staffs.create": { desc: "Create staff", path: "/rg/staffs", method: "POST", params: ["name", "phone", "idCard", "roleType"] },
  "staffs.update": { desc: "Update staff", path: "/rg/staffs/{id}", method: "PUT", params: ["id", "name", "phone", "roleType"] },
  "staffs.delete": { desc: "Delete staff", path: "/rg/staffs/{id}", method: "DELETE", params: ["id"] },
  "staffs.excel-import": { desc: "Excel import staffs", path: "/rg/staffs/excel/import", method: "POST", params: ["file"] },
  "staffs.simple-import": { desc: "Simple import staffs", path: "/rg/staffs/simple-import", method: "POST", params: ["file"] },
  // Vehicle Management
  "vehicles.list": { desc: "List vehicles", path: "/rg/vehicles/page", method: "GET", params: ["vehicleNumber", "vehicleType", "capacity", "driver", "page", "size"] },
  "vehicles.create": { desc: "Create vehicle", path: "/rg/vehicles", method: "POST", params: ["vehicleNumber", "vehicleType", "capacity", "driverName", "driverPhone"] },
  "vehicles.update": { desc: "Update vehicle", path: "/rg/vehicles/{id}", method: "PUT", params: ["id", "vehicleNumber", "vehicleType", "capacity"] },
  "vehicles.delete": { desc: "Delete vehicle", path: "/rg/vehicles/{id}", method: "DELETE", params: ["id"] },
  "vehicles.excel-import": { desc: "Excel import vehicles", path: "/rg/vehicles/excel/import", method: "POST", params: ["file"] },
  // Permission Management
  "permissions.list": { desc: "List permissions", path: "/rg/permissions", method: "GET", params: [] },
  "permissions.create": { desc: "Create permission", path: "/rg/permissions", method: "POST", params: ["name", "code", "description"] },
  "permissions.update": { desc: "Update permission", path: "/rg/permissions/{id}", method: "PUT", params: ["id", "name", "description"] },
  "permissions.delete": { desc: "Delete permission", path: "/rg/permissions/{id}", method: "DELETE", params: ["id"] },
  // Organization Management
  "organizations.list": { desc: "List organizations", path: "/rg/organizations/getOrganizationsByPageAndCondition", method: "GET", params: ["search", "pageNum", "pageSize"] },
  "organizations.create": { desc: "Create organization", path: "/rg/organizations", method: "POST", params: ["name", "parentId"] },
  "organizations.update": { desc: "Update organization", path: "/rg/organizations/{id}", method: "PUT", params: ["id", "name"] },
  "organizations.delete": { desc: "Delete organization", path: "/rg/organizations/{id}", method: "DELETE", params: ["id"] },
  // Organization Class Management
  "org-classes.list": { desc: "List org classes", path: "/rg/organizationClasses/org/{orgId}", method: "GET", params: ["orgId"] },
  "org-classes.create": { desc: "Create org class", path: "/rg/organizationClasses", method: "POST", params: ["name", "orgId"] },
  "org-classes.update": { desc: "Update org class", path: "/rg/organizationClasses", method: "PUT", params: ["id", "name"] },
  "org-classes.delete": { desc: "Delete org class", path: "/rg/organizationClasses/{id}", method: "DELETE", params: ["id"] },
  // Category Base Management
  "categories.list": { desc: "List categories", path: "/rg/categoryBases/listByType", method: "GET", params: ["categoryType"] },
  "categories.create": { desc: "Create category", path: "/rg/categoryBases", method: "POST", params: ["name", "categoryType", "parentId"] },
  "categories.update": { desc: "Update category", path: "/rg/categoryBases/{categoryId}", method: "PUT", params: ["categoryId", "name"] },
  "categories.delete": { desc: "Delete category", path: "/rg/categoryBases/{categoryId}", method: "DELETE", params: ["categoryId"] },
};

export const admin = {
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
    // Positional args
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
  console.log(`ranger-cli admin - Admin operations

Usage: ranger-cli admin <resource> <action> [options]

Resources & Actions:
  accounts        create|list|get|update|delete
  companies       create|list|update|delete
  staffs          create|list|update|delete|excel-import|simple-import
  vehicles        create|list|update|delete|excel-import
  permissions     create|list|update|delete
  organizations   create|list|update|delete
  org-classes     create|list|update|delete
  categories      create|list|update|delete

Options:
  --json <json>   Pass parameters as JSON string
  --<param> <value>  Set parameter by name
  --help, -h      Show this help

Examples:
  ranger-cli admin accounts list
  ranger-cli admin accounts create --username 张三 --phone 138xxx --role role-admin
  ranger-cli admin accounts create --json '{"username":"张三","phone":"138xxx","role":"role-admin"}'
`);
}
