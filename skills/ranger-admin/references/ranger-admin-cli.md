# ranger-admin CLI 调用方式

本文件描述 ranger-admin 技能包的 CLI 调用方式，供 Agent 使用。

## CLI 命令结构

```
ranger-cli admin <resource> <action> [options]
```

## 快速索引

| 操作 | CLI 命令 |
|------|----------|
| 创建账号 | `ranger-cli admin accounts create --username <name> --phone <phone> --role <role>` |
| 查询账号列表 | `ranger-cli admin accounts list` |
| 查询账号详情 | `ranger-cli admin accounts get --id <id>` |
| 更新账号 | `ranger-cli admin accounts update --id <id> [--role <role>] [--phone <phone>]` |
| 删除账号 | `ranger-cli admin accounts delete --id <id>` |
| 创建公司 | `ranger-cli admin companies create --name <name> [--address <addr>]` |
| 查询公司列表 | `ranger-cli admin companies list` |
| 更新公司 | `ranger-cli admin companies update --id <id> [--name <name>] [--address <addr>]` |
| 删除公司 | `ranger-cli admin companies delete --id <id>` |
| 查询员工列表 | `ranger-cli admin staffs list [--search <kw>] [--role-type <type>]` |
| 创建员工 | `ranger-cli admin staffs create --name <name> [--phone <phone>] [--id-card <card>]` |
| 更新员工 | `ranger-cli admin staffs update --id <id> [--name <name>] [--phone <phone>]` |
| 删除员工 | `ranger-cli admin staffs delete --id <id>` |
| 查询车辆列表 | `ranger-cli admin vehicles list` |
| 创建车辆 | `ranger-cli admin vehicles create --vehicle-number <num> [--vehicle-type <type>] [--capacity <cap>]` |
| 更新车辆 | `ranger-cli admin vehicles update --id <id> [--vehicle-number <num>] [--capacity <cap>]` |
| 删除车辆 | `ranger-cli admin vehicles delete --id <id>` |
| 查询权限列表 | `ranger-cli admin permissions list` |
| 创建权限 | `ranger-cli admin permissions create --name <name> --code <code> [--description <desc>]` |
| 更新权限 | `ranger-cli admin permissions update --id <id> [--name <name>] [--description <desc>]` |
| 删除权限 | `ranger-cli admin permissions delete --id <id>` |
| 查询组织列表 | `ranger-cli admin organizations list [--search <kw>]` |
| 创建组织 | `ranger-cli admin organizations create --name <name> [--parent-id <pid>]` |
| 更新组织 | `ranger-cli admin organizations update --id <id> [--name <name>]` |
| 删除组织 | `ranger-cli admin organizations delete --id <id>` |
| 查询班级列表 | `ranger-cli admin org-classes list --org-id <orgId>` |
| 创建班级 | `ranger-cli admin org-classes create --name <name> --org-id <orgId>` |
| 更新班级 | `ranger-cli admin org-classes update --id <id> [--name <name>]` |
| 删除班级 | `ranger-cli admin org-classes delete --id <id>` |
| 查询分类列表 | `ranger-cli admin categories list --category-type <type>` |
| 创建分类 | `ranger-cli admin categories create --name <name> --category-type <type> [--parent-id <pid>]` |
| 更新分类 | `ranger-cli admin categories update --category-id <id> [--name <name>]` |
| 删除分类 | `ranger-cli admin categories delete --category-id <id>` |

## JSON 模式

复杂参数可使用 JSON 传入：

```bash
ranger-cli admin accounts create --json '{
  "username": "张三",
  "phone": "13800138000",
  "role": "role-admin"
}'
```

## Help

```bash
ranger-cli admin --help              # 显示所有资源操作
ranger-cli admin accounts create --help  # 显示单个操作详情
```

## 角色说明

- role-admin: 计调（最高权限）
- role-controller: 总控
- role-mentor: 研学导师
- role-assistant: 安全助手

## 注意事项

- 所有命令需要先配置 token：`ranger-cli config set-api-base <url>` 和 `ranger-cli config set-token <token>`
- 使用 `--json` 时，JSON 字符串中的参数优先于命令行参数
- CLI 输出的 JSON 格式与 API 返回的 data 字段一致
