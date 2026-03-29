# Ranger Guard CLI

Ranger Guard 研学活动管理系统的 CLI 工具和 OpenClaw Skills。

## 功能

- **CLI 工具**：通过命令行操作 ranger-guard API，支持计调、总控、研学导师三种角色
- **OpenClaw Skills**：AI Agent 可直接调用 CLI 完成业务操作

## 安装

```bash
npm install -g
```

## 配置

```bash
# 设置 API 地址
ranger-cli config set-api-base http://api.huyouxia.cn

# 设置 Token
ranger-cli config set-token <your-jwt-token>

# 查看当前配置
ranger-cli config show

# 交互式配置
ranger-cli config
```

## 命令

### 计调 (Admin)

```bash
ranger-cli admin accounts list
ranger-cli admin accounts create --username 张三 --phone 138xxx --role role-admin
ranger-cli admin companies list
ranger-cli admin staffs list
ranger-cli admin vehicles list
```

### 总控 (Controller)

```bash
ranger-cli controller activities search --status 0
ranger-cli controller vehicles overview
ranger-cli controller class-groups sign-statistics
```

### 研学导师 (Mentor)

```bash
ranger-cli mentor activities list
ranger-cli mentor sign create --member-id xxx --activity-id xxx
ranger-cli mentor checkpoint create --day-manager-id xxx --activity-id xxx --record-content "安全到达"
```

## JSON 模式

复杂参数使用 JSON 传入：

```bash
ranger-cli admin accounts create --json '{
  "username": "张三",
  "phone": "13800138000",
  "role": "role-admin"
}'
```

## 帮助

```bash
ranger-cli --help
ranger-cli config --help
ranger-cli admin --help
ranger-cli controller --help
ranger-cli mentor --help
```

## Skills

OpenClaw Agent 通过 Skills 调用 CLI：

```
skills/
├── ranger-admin/      # 计调技能包
├── ranger-controller/ # 总控技能包
└── ranger-mentor/     # 研学导师技能包
```

每个 Skill 包含：
- `SKILL.md` — 入口文件
- `references/*-api.md` — API 调用说明
- `references/*-cli.md` — CLI 调用说明
