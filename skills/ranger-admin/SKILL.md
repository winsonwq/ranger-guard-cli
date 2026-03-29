---
name: ranger-admin
description: 计调（Admin）技能包，管理 ranger-guard 系统的账号、公司、员工、车辆、权限、组织机构等基础数据。当用户需要创建账号、查询公司、管理员工车辆、执行权限配置等操作时触发。
---

# ranger-admin — 计调技能包

计调是系统最高权限角色，token 为计调时可调用所有角色的接口。

## 调用方式

本技能支持两种调用方式：
- **API 调用**：直接通过 HTTP 请求调用后端 API
- **CLI 调用**：通过 `ranger-cli` 命令行工具调用

### API 调用

详见 [ranger-admin-api.md](references/ranger-admin-api.md)

### CLI 调用

详见 [ranger-admin-cli.md](references/ranger-admin-cli.md)

## 操作索引

| 操作 | 说明 |
|------|------|
| accounts.create | 创建账号 |
| accounts.list | 分页查询账号 |
| accounts.get | 获取账号详情 |
| accounts.update | 更新账号 |
| accounts.delete | 删除账号 |
| companies.create | 创建公司 |
| companies.list | 查询公司列表 |
| companies.update | 更新公司 |
| companies.delete | 删除公司 |
| staffs.list | 分页查询员工 |
| staffs.create | 创建员工 |
| staffs.update | 更新员工 |
| staffs.delete | 删除员工 |
| vehicles.list | 分页查询车辆 |
| vehicles.create | 创建车辆 |
| vehicles.update | 更新车辆 |
| vehicles.delete | 删除车辆 |
| permissions.list | 查询权限列表 |
| permissions.create | 创建权限 |
| permissions.update | 更新权限 |
| permissions.delete | 删除权限 |
| organizations.list | 分页查询组织机构 |
| organizations.create | 创建组织机构 |
| organizations.update | 更新组织机构 |
| organizations.delete | 删除组织机构 |
| org-classes.list | 查询机构班级列表 |
| org-classes.create | 创建机构班级 |
| org-classes.update | 更新机构班级 |
| org-classes.delete | 删除机构班级 |
| categories.list | 查询基础分类列表 |
| categories.create | 创建基础分类 |
| categories.update | 更新基础分类 |
| categories.delete | 删除基础分类 |

## 角色代码

- `role-admin`: 计调
- `role-controller`: 总控
- `role-mentor`: 研学导师
- `role-assistant`: 安全助手
