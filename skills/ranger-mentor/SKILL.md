---
name: ranger-mentor
description: 研学导师/助教/安全员（Mentor）技能包，管理所分配班级/车组的日常操作，包括分车操作、签到、checkpoint打卡、日程查看和异常报备。当用户需要为学生签到、进行checkpoint打卡、查看班级日程、标记请假等操作时触发。
---

# ranger-mentor — 研学导师/助教/安全员技能包

研学导师/助教/安全员负责所分配班级/车组的日常管理，包括分车操作、签到、checkpoint 打卡、日程查看和异常报备。

## 调用方式

本技能支持两种调用方式：
- **API 调用**：直接通过 HTTP 请求调用后端 API
- **CLI 调用**：通过 `ranger-cli` 命令行工具调用

### API 调用

详见 [ranger-mentor-api.md](references/ranger-mentor-api.md)

### CLI 调用

详见 [ranger-mentor-cli.md](references/ranger-mentor-cli.md)

## 操作索引

| 操作 | 说明 |
|------|------|
| activities.list | 获取我的活动 |
| activities.get | 获取活动详情 |
| class.my | 获取我负责的班级 |
| class.schedule | 获取班级日程与打卡记录 |
| vehicle.my | 获取我负责的车组 |
| car.assign | 分配成员到车组 |
| car.unassign | 移除分车成员 |
| car.mark-leave | 标记请假 |
| car.mark-unpaid | 标记未缴费 |
| sign.create | 签到 |
| sign.list | 查看签到记录 |
| sign.stats | 查看签到统计 |
| checkpoint.create | 新增打卡记录 |
| checkpoint.list | 查询日程打卡记录 |
| checkpoint.my | 查询我的打卡记录 |
| checkpoint.update | 更新打卡记录 |
| days.list | 查询班级日程列表 |
| reports.my | 查看我的报告列表 |
| reports.export-word | 导出报告为Word |
| report.create | 创建报备 |
| report.list | 查询我的报备 |

## 权限说明

- 研学导师（role-mentor）只能操作自己负责的班级/车组
- 安全助手（role-assistant）权限同研学导师
- 总控（role-controller）和计调（role-admin）拥有所有权限
