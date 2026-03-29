# ranger-controller CLI 调用方式

本文件描述 ranger-controller 技能包的 CLI 调用方式，供 Agent 使用。

## CLI 命令结构

```
ranger-cli controller <resource> <action> [options]
```

## 快速索引

| 操作 | CLI 命令 |
|------|----------|
| 搜索研学活动 | `ranger-cli controller activities search [--search <kw>] [--status <status>] [--start-date <date>]` |
| 获取活动详情 | `ranger-cli controller activities get --id <id>` |
| 获取活动全部成员 | `ranger-cli controller activities members` |
| 获取按角色分类的成员 | `ranger-cli controller activities roled-members --activity-id <id>` |
| 确认活动开始 | `ranger-cli controller activities confirm-start` |
| 确认活动结束 | `ranger-cli controller activities confirm-end` |
| 复制研学活动 | `ranger-cli controller activities copy --id <id>` |
| 搜索班级分组 | `ranger-cli controller class-groups search --activity-id <id> [--search <kw>]` |
| 获取班级分组详情 | `ranger-cli controller class-groups get --id <id>` |
| 导出班级学生名单 | `ranger-cli controller class-groups export-members --activity-id <id>` |
| 获取签到统计 | `ranger-cli controller class-groups sign-statistics` |
| 导出签到数据 | `ranger-cli controller class-groups export-sign` |
| 获取车辆班级总览 | `ranger-cli controller vehicles overview` |
| 分页查询分车分组 | `ranger-cli controller vehicles list --activity-id <id> [--name <kw>]` |
| 分配成员到车组 | `ranger-cli controller vehicles assign --member-ids <ids> --team-group-id <tgid> --activity-id <aid> --class-group-id <cgid>` |
| 移除分车成员 | `ranger-cli controller vehicles unassign --member-ids <ids> --team-group-id <tgid> --activity-id <aid> --class-group-id <cgid>` |
| 标记请假 | `ranger-cli controller vehicles mark-leave --member-id <id> --activity-id <id> [--leave-type <type>]` |
| 标记未缴费 | `ranger-cli controller vehicles mark-unpaid --member-id <id> --activity-id <id> [--unpaid-type <type>]` |
| 导出行车信息 | `ranger-cli controller vehicles export --activity-id <id>` |
| 获取司机信息 | `ranger-cli controller vehicles drivers` |
| 查询活动日程 | `ranger-cli controller days list --activity-id <id>` |
| 获取班级与打卡信息 | `ranger-cli controller days class-checkpoint` |
| 导出行程图片 | `ranger-cli controller days export-images --activity-id <id> [--class-group-id <cgid>]` |
| 创建报备 | `ranger-cli controller reports create --activity-id <aid> --staff-id <sid> [--class-group-id <cgid>] [--report-type <type>] [--content <content>]` |
| 分页查询报备 | `ranger-cli controller reports list [--activity-id <id>] [--is-handled <handled>]` |
| 总控帮他人签到 | `ranger-cli controller sign manager-sign --sign-records <json>` |
| 签到并分车 | `ranger-cli controller sign sign-and-assign --member-id <mid> --team-group-id <tgid> --activity-id <aid> --class-group-id <cgid>` |
| 获取活动统计摘要 | `ranger-cli controller stats summary --activity-id <id>` |
| 生成AI报告 | `ranger-cli controller reports generate --activity-id <id>` |
| 保存报告历史 | `ranger-cli controller reports save-history --activity-id <id> --content <content>` |
| 导出报告Word | `ranger-cli controller reports export-word --report-id <id>` |
| 导出报告PDF | `ranger-cli controller reports export-pdf --report-id <id>` |

## JSON 模式

复杂参数可使用 JSON 传入：

```bash
ranger-cli controller vehicles assign --json '{
  "memberIds": ["mid1", "mid2"],
  "teamGroupId": "tg123",
  "activityId": "act123",
  "classGroupId": "cg123"
}'
```

## Help

```bash
ranger-cli controller --help
ranger-cli controller activities search --help
ranger-cli controller vehicles assign --help
```

## 状态码

- status=0: 待开始
- status=1: 已开始
- status=2: 已结束

## 注意事项

- 所有命令需要先配置 token
- 批量操作（memberIds）使用逗号分隔或 JSON 数组格式
- 导出类操作返回的是 OSS 下载链接
