# ranger-mentor CLI 调用方式

本文件描述 ranger-mentor 技能包的 CLI 调用方式，供 Agent 使用。

## CLI 命令结构

```
ranger-cli mentor <resource> <action> [options]
```

## 快速索引

| 操作 | CLI 命令 |
|------|----------|
| 获取我的活动 | `ranger-cli mentor activities list` |
| 获取活动详情 | `ranger-cli mentor activities get --id <id>` |
| 获取我负责的班级 | `ranger-cli mentor class my --activity-id <id>` |
| 获取班级日程与打卡 | `ranger-cli mentor class schedule --class-group-id <id>` |
| 获取我负责的车组 | `ranger-cli mentor vehicle my` |
| 分配成员到车组 | `ranger-cli mentor car assign --member-ids <ids> --team-group-id <tgid> --activity-id <aid> --class-group-id <cgid>` |
| 移除分车成员 | `ranger-cli mentor car unassign --member-ids <ids> --team-group-id <tgid> --activity-id <aid> --class-group-id <cgid>` |
| 标记请假 | `ranger-cli mentor car mark-leave --member-id <id> --activity-id <id>` |
| 标记未缴费 | `ranger-cli mentor car mark-unpaid --member-id <id> --activity-id <id>` |
| 签到 | `ranger-cli mentor sign create --member-id <mid> --activity-id <aid>` |
| 查看签到记录 | `ranger-cli mentor sign list --activity-id <id>` |
| 查看签到统计 | `ranger-cli mentor sign stats` |
| 新增打卡记录 | `ranger-cli mentor checkpoint create --day-manager-id <id> --activity-id <aid> [--record-content <content>] [--is-abnormal]` |
| 查询日程打卡记录 | `ranger-cli mentor checkpoint list --day-manager-id <id>` |
| 查询我的打卡记录 | `ranger-cli mentor checkpoint my --day-manager-id <id>` |
| 更新打卡记录 | `ranger-cli mentor checkpoint update --id <id> [--record-content <content>] [--is-abnormal]` |
| 查询班级日程 | `ranger-cli mentor days list --activity-id <id> [--class-group-id <cgid>]` |
| 查看我的报告列表 | `ranger-cli mentor reports my` |
| 导出报告Word | `ranger-cli mentor reports export-word --report-id <id>` |
| 创建报备 | `ranger-cli mentor report create --activity-id <aid> --staff-id <sid> [--class-group-id <cgid>] [--content <content>]` |
| 查询我的报备 | `ranger-cli mentor report list [--activity-id <id>]` |

## JSON 模式

复杂参数可使用 JSON 传入：

```bash
ranger-cli mentor checkpoint create --json '{
  "dayManagerId": "dm123",
  "activityId": "act123",
  "recordContent": "安全到达",
  "isAbnormal": false
}'
```

## Help

```bash
ranger-cli mentor --help
ranger-cli mentor checkpoint create --help
```

## 研学导师/助教权限说明

- 研学导师（role-mentor）只能操作自己负责的班级/车组
- 安全助手（role-assistant）权限同研学导师
- 总控（role-controller）和计调（role-admin）拥有所有权限

## 注意事项

- 所有命令需要先配置 token
- 打卡记录可以附加照片（checkpointFiles 字段为 URL 数组）
- 位置信息使用 JSON 格式： `--json '{"location":{"latitude":39.9,"longitude":116.4,"address":"北京"}}'`
