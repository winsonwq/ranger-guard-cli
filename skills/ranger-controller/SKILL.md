---
name: ranger-controller
description: 总控（Controller）技能包，管理 ranger-guard 研学活动的全程协调，包括活动管理、班级分组、车辆分配、人员统筹、签到统计和统计报表。当用户需要搜索活动、管理班级分组、分配车辆、查看签到数据、导出报表等操作时触发。
---

# ranger-controller — 总控技能包

总控负责研学活动的全程协调，可以管理所有班级分组、车辆分配、人员统筹和统计报表。

## 调用方式

本技能支持两种调用方式：
- **API 调用**：直接通过 HTTP 请求调用后端 API
- **CLI 调用**：通过 `ranger-cli` 命令行工具调用

### API 调用

详见 [ranger-controller-api.md](references/ranger-controller-api.md)

### CLI 调用

详见 [ranger-controller-cli.md](references/ranger-controller-cli.md)

## 操作索引

| 操作 | 说明 |
|------|------|
| activities.search | 搜索研学活动 |
| activities.get | 获取活动详情 |
| activities.members | 获取活动全部成员 |
| activities.roled-members | 获取按角色分类的成员 |
| activities.confirm-start | 确认活动开始 |
| activities.confirm-end | 确认活动结束 |
| activities.copy | 复制研学活动 |
| class-groups.search | 搜索班级分组 |
| class-groups.get | 获取班级分组详情 |
| class-groups.export-members | 导出班级学生名单 |
| class-groups.sign-statistics | 获取签到统计数据 |
| class-groups.export-sign | 导出签到数据 |
| vehicles.overview | 获取车辆和班级总览 |
| vehicles.list | 分页查询分车分组 |
| vehicles.assign | 分配成员到车组 |
| vehicles.unassign | 移除分车成员 |
| vehicles.mark-leave | 标记请假 |
| vehicles.mark-unpaid | 标记未缴费 |
| vehicles.export | 导出行车信息 |
| vehicles.drivers | 获取司机信息 |
| days.list | 查询活动日程列表 |
| days.class-checkpoint | 获取班级与打卡信息 |
| days.export-images | 导出行程图片 |
| reports.create | 创建报备 |
| reports.list | 分页查询报备列表 |
| sign.manager-sign | 总控帮他人签到 |
| sign.sign-and-assign | 签到并分车 |
| stats.summary | 获取活动统计摘要 |
| reports.generate | 生成活动AI报告 |
| reports.save-history | 保存报告历史 |
| reports.export-word | 导出报告为Word |
| reports.export-pdf | 导出报告为PDF |
