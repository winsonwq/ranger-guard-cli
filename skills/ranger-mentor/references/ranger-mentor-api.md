# ranger-mentor — 研学导师/助教/安全员技能包

**适用角色:** 研学导师（role-mentor）、安全助手（role-assistant）、总控（role-controller）、计调（role-admin）

研学导师/助教/安全员负责所分配班级/车组的日常管理，包括分车操作、签到、checkpoint 打卡、日程查看和异常报备。

> 总控和计调也包含此技能包的所有操作。

---

## 环境配置

```bash
RANGER_API_BASE=http://8.156.83.69:8888/rg
RANGER_ACCESS_TOKEN=your-jwt-token
```

所有 API 调用需要在 header 中携带 `Authorization: Bearer {RANGER_ACCESS_TOKEN}`

---

## 活动概览

### 获取我的活动

获取当前用户（研学导师/助教）角色对应的活动列表。

```yaml
operation:
  name: "获取我的活动"
  description: |
    获取当前登录用户作为研学导师/助教所负责的活动列表。
    返回活动基本信息（名称、时间、地点、状态等）。
  api:
    method: GET
    path: "/rg/study_activities/getActivitiesByRole"
  params: []
  requires_role:
    - role-mentor
    - role-assistant
    - role-controller
    - role-admin
  example: "我负责的活动有哪些"
```

---

### 获取活动详情

获取指定活动的详细信息。

```yaml
operation:
  name: "获取活动详情"
  description: |
    根据活动ID获取该活动的完整信息。
  api:
    method: GET
    path: "/rg/study_activities/{id}"
  params:
    - name: id
      type: string
      required: true
      desc: 活动ID
  requires_role:
    - role-mentor
    - role-assistant
    - role-controller
    - role-admin
  example: "这个活动的详细信息是什么"
```

---

## 我的班级与车组

### 获取我负责的班级

获取当前研学导师/助教在指定活动中负责的班级分组信息。

```yaml
operation:
  name: "获取我负责的班级"
  description: |
    获取当前用户作为研学导师/助教所负责的班级分组信息。
    返回班级基本信息、成员人数、已分配/未分配人数。
  api:
    method: GET
    path: "/rg/classGroups/role/{activityId}"
  params:
    - name: activityId
      type: string
      required: true
      desc: 活动ID
  requires_role:
    - role-mentor
    - role-assistant
    - role-controller
    - role-admin
  example: "我在这个活动里负责哪个班"
```

---

### 获取我负责的车组

获取当前用户作为研学导师/助教所负责的车组信息。

```yaml
operation:
  name: "获取我负责的车组"
  description: |
    获取当前登录用户作为研学导师/助教所负责的车组信息。
    返回车组名称、车牌号、司机信息、已上/未坐座位数、乘客列表。
  api:
    method: GET
    path: "/rg/team_groups/my-team-group"
  params: []
  requires_role:
    - role-mentor
    - role-assistant
    - role-controller
    - role-admin
  example: "我负责哪辆车"
```

---

### 获取班级日程与打卡记录

获取指定班级的日程打卡记录和关联的活动基本信息。

```yaml
operation:
  name: "获取班级日程与打卡记录"
  description: |
    根据班级分组ID获取该班级的所有日程打卡记录以及关联的活动信息。
    返回：班级名称、活动信息、日程打卡记录列表。
  api:
    method: GET
    path: "/rg/classGroups/{classGroupId}/schedule"
  params:
    - name: classGroupId
      type: string
      required: true
      desc: 班级分组ID
  requires_role:
    - role-mentor
    - role-assistant
    - role-controller
    - role-admin
  example: "我们班的打卡记录有哪些"
```

---

## 分车操作

### 分配成员到车组

将我负责班级/车组的成员分配到车组。

```yaml
operation:
  name: "分配成员到车组"
  description: |
    将成员（学生/老师）分配到指定的车组。
    只能操作当前用户所负责的班级/车组范围内的成员。
    - 已请假学生(leaveType=1)无法分车
    - 待分车成员须带 classGroupId
    - 车组容量不足时返回业务错误
  api:
    method: POST
    path: "/rg/team_groups/separateCars"
  params:
    - name: memberIds
      type: array[string]
      required: true
      desc: 成员ID列表
    - name: teamGroupId
      type: string
      required: true
      desc: 目标车组ID
    - name: activityId
      type: string
      required: true
      desc: 活动ID
    - name: classGroupId
      type: string
      required: true
      desc: 班级分组ID
  requires_role:
    - role-mentor
    - role-assistant
    - role-controller
    - role-admin
  example: "把张三和李四分到1号车"
```

---

### 移除分车成员

将我负责班级/车组的成员从车组中移除。

```yaml
operation:
  name: "移除分车成员"
  description: |
    将已分配的成员从车组中移除，成员恢复为未分车状态。
    适用于分错车需要调整的情况。
  api:
    method: POST
    path: "/rg/team_groups/removeCarPeople"
  params:
    - name: memberIds
      type: array[string]
      required: true
      desc: 成员ID列表
    - name: teamGroupId
      type: string
      required: true
      desc: 车组ID
    - name: activityId
      type: string
      required: true
      desc: 活动ID
    - name: classGroupId
      type: string
      required: true
      desc: 班级分组ID
  requires_role:
    - role-mentor
    - role-assistant
    - role-controller
    - role-admin
  example: "把张三从1号车移出来"
```

---

### 标记请假

标记成员的请假状态。

```yaml
operation:
  name: "标记请假"
  description: |
    标记成员请假状态。
    - leaveType=1 表示已请假
    - leaveType=0 或不传 表示未请假（清除请假状态）
    请假成员不计入正常出勤。
  api:
    method: POST
    path: "/rg/team_groups/markLeave"
  params:
    - name: memberId
      type: string
      required: true
      desc: 成员ID
    - name: leaveType
      type: string
      required: false
      default: "1"
      desc: 请假状态，"1"=已请假，"0"=未请假
    - name: activityId
      type: string
      required: true
      desc: 活动ID
  requires_role:
    - role-mentor
    - role-assistant
    - role-controller
    - role-admin
  example: "张三今天请假了"
```

---

### 标记未缴费

标记成员的缴费状态。

```yaml
operation:
  name: "标记未缴费"
  description: |
    标记成员缴费状态。
    - unpaidType=1 表示未缴费
    - unpaidType=0 或不传 表示已缴费（清除未缴费状态）
  api:
    method: POST
    path: "/rg/team_groups/markUnpaid"
  params:
    - name: memberId
      type: string
      required: true
      desc: 成员ID
    - name: unpaidType
      type: string
      required: false
      default: "1"
      desc: 缴费状态，"1"=未缴费，"0"=已缴费
    - name: activityId
      type: string
      required: true
      desc: 活动ID
  requires_role:
    - role-mentor
    - role-assistant
    - role-controller
    - role-admin
  example: "李四还没缴费"
```

---

## 签到

### 签到

为成员进行签到操作。

```yaml
operation:
  name: "签到"
  description: |
    为指定成员创建签到记录。
    传入成员ID和签到状态（signType=1 表示已签到）。
  api:
    method: POST
    path: "/rg/sign_records"
  params:
    - name: memberId
      type: string
      required: true
      desc: 成员ID
    - name: activityId
      type: string
      required: true
      desc: 活动ID
    - name: signType
      type: string
      required: false
      default: "1"
      desc: 签到状态，"1"=已签到
    - name: signLocation
      type: string
      required: false
      desc: 签到位置
  requires_role:
    - role-mentor
    - role-assistant
    - role-controller
    - role-admin
  example: "给张三签到"
```

---

### 查看签到记录

根据活动ID查询所有签到记录。

```yaml
operation:
  name: "查看签到记录"
  description: |
    查看指定活动下的所有签到记录。
  api:
    method: GET
    path: "/rg/sign_records/activity/{activityId}"
  params:
    - name: activityId
      type: string
      required: true
      desc: 活动ID
  requires_role:
    - role-mentor
    - role-assistant
    - role-controller
    - role-admin
  example: "看看这次活动的签到情况"
```

---

### 查看签到统计

获取当前活动下的签到统计数据。

```yaml
operation:
  name: "查看签到统计"
  description: |
    获取当前活动下的签到统计数据。
    返回：总人数、各类型人数、已签到/未签到/请假/未缴费人数。
  api:
    method: GET
    path: "/rg/classGroups/signStatistics"
  params: []
  requires_role:
    - role-mentor
    - role-assistant
    - role-controller
    - role-admin
  example: "我们班签到了多少人"
```

---

## Checkpoint 打卡

### 新增打卡记录

在某个日程节点进行 checkpoint 打卡。

```yaml
operation:
  name: "新增打卡记录"
  description: |
    在指定的日程节点（dayManagerId）进行 checkpoint 打卡。
    可上传打卡照片、填写打卡内容和位置信息。
    打卡可标记是否异常及异常描述。
  api:
    method: POST
    path: "/rg/checkpoint_records"
  params:
    - name: dayManagerId
      type: string
      required: true
      desc: 日程管理ID
    - name: activityId
      type: string
      required: true
      desc: 活动ID
    - name: teamGroupId
      type: string
      required: false
      desc: 车组ID
    - name: classGroupId
      type: string
      required: false
      desc: 班级分组ID
    - name: recordContent
      type: string
      required: false
      desc: 打卡内容
    - name: checkpointFiles
      type: array[string]
      required: false
      desc: 打卡照片URL列表
    - name: isAbnormal
      type: boolean
      required: false
      desc: 是否异常
    - name: abnormalDescription
      type: string
      required: false
      desc: 异常描述
    - name: location
      type: object
      required: false
      desc: 打卡位置，{latitude: number, longitude: number, address: string}
  requires_role:
    - role-mentor
    - role-assistant
    - role-controller
    - role-admin
  example: "我们在科技馆门口打个卡"
```

---

### 查询打卡记录

根据日程ID查询该日程下的所有打卡记录。

```yaml
operation:
  name: "查询日程打卡记录"
  description: |
    根据日程管理ID查询该日程下的所有打卡记录。
    返回打卡人、打卡时间、打卡内容、照片、是否异常等信息。
  api:
    method: GET
    path: "/rg/checkpoint_records/by/day_manager/{dayManagerId}"
  params:
    - name: dayManagerId
      type: string
      required: true
      desc: 日程管理ID
  requires_role:
    - role-mentor
    - role-assistant
    - role-controller
    - role-admin
  example: "这个日程的打卡记录有哪些"
```

---

### 查询我的打卡记录

根据日程ID和当前用户ID查询打卡记录。

```yaml
operation:
  name: "查询我的打卡记录"
  description: |
    根据日程管理ID和当前用户ID查询该用户在该日程的打卡记录。
  api:
    method: GET
    path: "/rg/checkpoint_records/findByDayManagerIdAndUserId/{dayManagerId}"
  params:
    - name: dayManagerId
      type: string
      required: true
      desc: 日程管理ID
  requires_role:
    - role-mentor
    - role-assistant
    - role-controller
    - role-admin
  example: "我今天在这个日程打过卡吗"
```

---

### 更新打卡记录

更新已有的打卡记录内容。

```yaml
operation:
  name: "更新打卡记录"
  description: |
    更新指定打卡记录的内容、照片或异常状态。
  api:
    method: PUT
    path: "/rg/checkpoint_records/{id}"
  params:
    - name: id
      type: string
      required: true
      desc: 打卡记录ID
    - name: recordContent
      type: string
      required: false
      desc: 打卡内容
    - name: checkpointFiles
      type: array[string]
      required: false
      desc: 打卡照片URL列表
    - name: isAbnormal
      type: boolean
      required: false
      desc: 是否异常
    - name: abnormalDescription
      type: string
      required: false
      desc: 异常描述
  requires_role:
    - role-mentor
    - role-assistant
    - role-controller
    - role-admin
  example: "补充一下打卡说明"
```

---

## 日程与照片

### 查询班级日程列表

根据班级分组ID查询该班级的日程列表。

```yaml
operation:
  name: "查询班级日程列表"
  description: |
    根据班级分组ID查询该班级关联的日程列表。
    返回每个日程的时间、内容、类型等基本信息。
  api:
    method: GET
    path: "/rg/day_managers/getDayManagersByTeamIdAndDayManagerId"
  params:
    - name: activityId
      type: string
      required: true
      desc: 活动ID
    - name: classGroupId
      type: string
      required: false
      desc: 班级分组ID（不传则返回该活动所有日程）
    - name: includeFiles
      type: boolean
      required: false
      default: true
      desc: 是否返回文件信息（照片等）
  requires_role:
    - role-mentor
    - role-assistant
    - role-controller
    - role-admin
  example: "今天有哪些日程"
```

---

## 报备

### 创建报备

创建一个异常或紧急报备。

```yaml
operation:
  name: "创建报备"
  description: |
    创建一个报备记录，用于活动中的异常情况上报（学生受伤、车辆故障、路线问题等）。
  api:
    method: POST
    path: "/rg/api/reports"
  params:
    - name: activityId
      type: string
      required: true
      desc: 活动ID
    - name: staffId
      type: string
      required: true
      desc: 报备人ID
    - name: classGroupId
      type: string
      required: false
      desc: 关联的班级分组ID
    - name: reportType
      type: string
      required: false
      desc: 报备类型（异常/紧急等）
    - name: content
      type: string
      required: false
      desc: 报备内容
  requires_role:
    - role-mentor
    - role-assistant
    - role-controller
    - role-admin
  example: "3号车轮胎漏气，需要报备"
```

---

### 查询我的报备

查询当前用户创建的报备记录。

```yaml
operation:
  name: "查询我的报备"
  description: |
    查询当前用户创建的报备记录列表。
    支持按活动ID过滤。
  api:
    method: GET
    path: "/rg/api/reports/list"
  params:
    - name: activityId
      type: string
      required: false
      desc: 活动ID（不传则返回所有）
  requires_role:
    - role-mentor
    - role-assistant
    - role-controller
    - role-admin
  example: "我提交过哪些报备"
```

---

## 报告

### 查看我的报告列表

获取当前用户创建的所有活动报告。

```yaml
operation:
  name: "查看我的报告列表"
  description: |
    获取当前用户创建的所有活动报告列表。
  api:
    method: GET
    path: "/rg/activity-reports/my-reports"
  params: []
  requires_role:
    - role-mentor
    - role-assistant
    - role-controller
    - role-admin
  example: "我生成过哪些报告"
```

---

### 导出报告为Word

将活动报告导出为Word文件下载。

```yaml
operation:
  name: "导出报告为Word"
  description: |
    将指定报告导出为Word(.docx)文件并返回下载。
  api:
    method: GET
    path: "/rg/activity-reports/{reportId}/export/word"
  params:
    - name: reportId
      type: string
      required: true
      desc: 报告ID
  requires_role:
    - role-mentor
    - role-assistant
    - role-controller
    - role-admin
  example: "把这份报告导出为Word"
```

---

## 操作指南：如何调用

在对话中，AI 会根据用户描述选择合适的 operation，构建 HTTP 请求：

```
GET {RANGER_API_BASE}/classGroups/role/{activityId}
Authorization: Bearer {RANGER_ACCESS_TOKEN}
```

AI 负责：
1. 理解用户意图，选择正确的 operation
2. 从对话中提取参数值（注意：mentor 只能操作自己负责范围内的班级/车组）
3. 调用 API
4. 将 JSON 响应转换为自然语言回复
5. 根据 `requires_role` 判断用户是否有权限执行该操作
