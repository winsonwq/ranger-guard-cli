# ranger-controller — 总控技能包

**适用角色:** 总控（role-controller）、计调（role-admin）

总控负责研学活动的全程协调，可以管理所有班级分组、车辆分配、人员统筹和统计报表。

---

## 环境配置

```bash
RANGER_API_BASE=http://8.156.83.69:8888/rg
RANGER_ACCESS_TOKEN=your-jwt-token
```

所有 API 调用需要在 header 中携带 `Authorization: Bearer {RANGER_ACCESS_TOKEN}`

---

## 活动管理

### 搜索研学活动

根据关键词、主题类型、活动状态、时间范围搜索研学活动列表，支持分页。

```yaml
operation:
  name: "搜索研学活动"
  description: |
    根据关键词、主题类型、活动状态、时间范围搜索研学活动列表，支持分页。
    适合回答"有哪些活动"、"某个主题的活动有哪些"、"某段时间有哪些活动"等问题。
  api:
    method: GET
    path: "/rg/study_activities/getActivitiesByPageAndCondition"
  params:
    - name: search
      type: string
      required: false
      desc: 关键词搜索（匹配活动名称、主题等）
    - name: activityTheme
      type: string
      required: false
      desc: 活动主题类型
    - name: status
      type: string
      required: false
      desc: 活动状态，"0"=待开始，"1"=已开始，"2"=已结束
    - name: startDate
      type: string (ISO date)
      required: false
      desc: 开始时间下限，格式 2026-03-01
    - name: endTime
      type: string (ISO date)
      required: false
      desc: 结束时间上限，格式 2026-04-01
    - name: page
      type: number
      required: false
      default: 1
      desc: 页码
    - name: size
      type: number
      required: false
      default: 10
      desc: 每页数量
  requires_role:
    - role-controller
    - role-admin
  example: "帮我搜索状态为待开始的所有活动"
```

**返回字段说明:**

| 字段 | 类型 | 说明 |
|------|------|------|
| records | array | 活动列表 |
| records[].id | string | 活动 ID |
| records[].activityTheme | string | 活动主题 |
| records[].themeType | string | 主题类型 code |
| records[].themeTypeName | string | 主题类型名称 |
| records[].address | string | 活动地址 |
| records[].startTime | string | 开始时间 |
| records[].endTime | string | 结束时间 |
| records[].status | string | 状态：0=待开始，1=已开始，2=已结束 |
| records[].activityCode | string | 6位活动码 |
| total | number | 总记录数 |
| page | number | 当前页 |
| totalPages | number | 总页数 |

**自然语言响应示例:**

> 共找到 3 个"待开始"的活动：
>
> 1. **科技探索** — 4月10日 08:00~17:00，北京科技馆（状态：待开始，活动码：A1B2C3）
> 2. **历史文化之旅** — 4月15日 08:30~16:30，故宫博物院（状态：待开始，活动码：D4E5F6）

---

### 获取活动详情

根据活动 ID 获取活动详细信息，包括关联的日程管理。

```yaml
operation:
  name: "获取活动详情"
  description: |
    根据活动ID获取活动的完整信息，包括时间、地点、状态、关联的日程管理信息等。
  api:
    method: GET
    path: "/rg/study_activities/{id}"
  params:
    - name: id
      type: string
      required: true
      desc: 活动ID
  requires_role:
    - role-controller
    - role-admin
  example: "帮我查一下 ID 为 xxx 的活动详情"
```

---

### 获取活动全部成员（含司机）

获取指定活动下的所有参与成员，包括司机。

```yaml
operation:
  name: "获取活动全部成员"
  description: |
    获取指定活动下的所有参与成员（含司机），返回成员姓名、类型、手机号等信息。
    注意：此接口返回包含司机，getActivityMember 接口会过滤掉司机。
  api:
    method: GET
    path: "/rg/study_activities/getActivityMemberAll"
  params: []
  requires_role:
    - role-controller
    - role-admin
  example: "这个活动有哪些人参加"
```

---

### 获取按角色分类的活动成员

根据活动ID获取按角色分类的成员列表。

```yaml
operation:
  name: "获取按角色分类的成员"
  description: |
    获取指定活动下按角色（学生/导师/助教/司机等）分类的成员列表。
    返回每个角色的成员明细。
  api:
    method: GET
    path: "/rg/study_activities/{activityId}/roled-members"
  params:
    - name: activityId
      type: string
      required: true
      desc: 活动ID
  requires_role:
    - role-controller
    - role-admin
  example: "这个活动的老师和学生各有几人"
```

---

### 确认活动开始

将活动状态从"待开始"变更为"已开始"。

```yaml
operation:
  name: "确认活动开始"
  description: |
    将当前活动状态从"待开始"(0)变更为"已开始"(1)。
    通常在活动出发时调用。
  api:
    method: POST
    path: "/rg/study_activities/confirmActivity"
  params: []
  requires_role:
    - role-controller
    - role-admin
  example: "确认活动开始"
```

---

### 确认活动结束

将活动状态变更为"已结束"。

```yaml
operation:
  name: "确认活动结束"
  description: |
    将当前活动状态从"已开始"(1)变更为"已结束"(2)。
    通常在活动完成返程后调用。
  api:
    method: POST
    path: "/rg/study_activities/confirmActivityEnd"
  params: []
  requires_role:
    - role-controller
    - role-admin
  example: "确认活动结束"
```

---

### 复制研学活动（模板新建）

以当前活动的基础信息、日程信息为模板，创建一个新活动（不包含人员信息）。

```yaml
operation:
  name: "复制研学活动"
  description: |
    复制一个已有活动作为模板，创建新活动。
    新活动继承原活动的活动主题、地址、日程安排等，但人员清空。
    适合创建周期性或重复性活动。
  api:
    method: POST
    path: "/rg/study_activities/{id}/copy"
  params:
    - name: id
      type: string
      required: true
      desc: 被复制的原活动ID
  requires_role:
    - role-controller
    - role-admin
  example: "以这个活动为模板新建一个下周的同名活动"
```

---

## 班级分组管理

### 搜索班级分组

根据活动ID分页查询班级分组列表，支持按名称搜索。

```yaml
operation:
  name: "搜索班级分组"
  description: |
    根据活动ID分页查询该活动下的所有班级分组，支持按班级名称关键词搜索。
    返回每个班级的人数、已分配人数、导师、安全员等信息。
  api:
    method: GET
    path: "/rg/classGroups/getClassGroupsAndPage"
  params:
    - name: activityId
      type: string
      required: true
      desc: 活动ID
    - name: search
      type: string
      required: false
      desc: 班级名称关键词（模糊匹配）
    - name: pageNum
      type: number
      required: false
      default: 1
      desc: 页码
    - name: pageSize
      type: number
      required: false
      default: 10
      desc: 每页数量
  requires_role:
    - role-controller
    - role-admin
  example: "这个活动下有哪些班级"
```

**返回字段:**

| 字段 | 类型 | 说明 |
|------|------|------|
| records[].id | string | 班级分组ID |
| records[].classGroupName | string | 班级名称 |
| records[].totalMembers | int | 班级总人数 |
| records[].distributedNum | int | 已分配（已分车）人数 |
| records[].undistributedNum | int | 未分配人数 |
| records[].mentorName | string | 研学导师姓名 |
| records[].securityName | string | 助教/安全员姓名 |

---

### 获取班级分组详情

根据班级分组ID获取详细信息，包括已分配的车组列表和未分配成员列表。

```yaml
operation:
  name: "获取班级分组详情"
  description: |
    根据班级分组ID获取该班级分组的完整信息。
    包括：班级基本信息、已分配的车组列表、未分配成员列表、导师/安全员信息。
  api:
    method: GET
    path: "/rg/classGroups/{id}"
  params:
    - name: id
      type: string
      required: true
      desc: 班级分组ID
  requires_role:
    - role-controller
    - role-admin
  example: "帮我看一下这个班级的详细情况"
```

---

### 获取班级学员名单（导出）

导出指定活动下所有班级的学生名单Excel，每个班级一个Sheet。返回OSS下载链接。

```yaml
operation:
  name: "导出班级学生名单"
  description: |
    根据活动ID导出所有班级的学生名单Excel，每个班级一个Sheet。
    Sheet包含：姓名、性别、年龄、身份证号、手机号、紧急联系人、紧急联系人电话、人员类型。
    最后一行显示该班级总人数。
  api:
    method: GET
    path: "/rg/classGroups/members/export"
  params:
    - name: activityId
      type: string
      required: true
      desc: 活动ID
  requires_role:
    - role-controller
    - role-admin
  example: "导出这个活动的所有班级学生名单"
```

**响应:** 返回 OSS 下载链接（Excel文件）

---

### 获取签到统计数据

获取当前活动下的签到统计数据，包括总人数、各类型人数、已签到/未签到/请假/未缴费人数。

```yaml
operation:
  name: "获取签到统计数据"
  description: |
    返回当前活动下的签到统计数据：
    - 总人数、各类型人数（学生/导师/助教/班主任/副班老师/随车老师/家长/司机）
    - 已签到人数（signType=1）
    - 未签到人数
    - 请假人数（leaveType=1）
    - 未缴费人数（unpaidType=1）
    - 新增学生人数（isAdded=1）
    注意：是否异常请查看成员的 exceptionType/signRemark，与签到状态独立。
  api:
    method: GET
    path: "/rg/classGroups/signStatistics"
  params: []
  requires_role:
    - role-controller
    - role-admin
  example: "这个活动现在签到情况怎么样"
```

**返回字段:**

| 字段 | 类型 | 说明 |
|------|------|------|
| totalCount | int | 总人数 |
| studentCount | int | 学生人数 |
| mentorCount | int | 研学导师人数 |
| securityCount | int | 助教人数 |
| signedCount | int | 已签到总人数 |
| unsignedCount | int | 未签到总人数 |
| leaveStudentCount | int | 请假学生人数 |
| unpaidStudentCount | int | 未缴费学生人数 |
| addedStudentCount | int | 新增学生人数 |

**自然语言响应示例:**

> 签到统计：
> - 总人数：50人
> - 学生：42人（已签到38人，未签到4人，请假2人）
> - 研学导师：4人（已签到4人）
> - 助教：4人（已签到3人，未签到1人）

---

### 导出签到数据

将当前活动签到页面的成员数据导出为带格式的Excel文件，返回OSS下载链接。

```yaml
operation:
  name: "导出签到数据"
  description: |
    将当前活动签到页面的成员数据导出为带格式的Excel文件，上传至OSS，返回下载链接。
    包含所有成员及其签到状态。
  api:
    method: GET
    path: "/rg/classGroups/signStatistics/export"
  params: []
  requires_role:
    - role-controller
    - role-admin
  example: "导出这个活动的签到数据"
```

---

## 分车分组管理

### 获取车辆和班级总览

总控查看当前活动的所有车辆和班级分配情况总览。

```yaml
operation:
  name: "获取车辆和班级总览"
  description: |
    返回当前活动的车辆分组和班级分组总览。
    - carTeamGroupVOList: 所有车辆列表（含车牌号、司机、已上/未坐座位数、成员列表）
    - classGroupVOList: 所有班级列表（含已分配/未分配人数、导师、安全员）
    可以据此判断哪些班级还没分车、哪些车还有空座。
  api:
    method: GET
    path: "/rg/team_groups/getTeamGroupsController"
  params: []
  requires_role:
    - role-controller
    - role-admin
  example: "帮我看看每辆车的上座情况和每个班级的分配情况"
```

---

### 分页查询分车分组

按条件分页查询分车分组列表，可按名称/导师/安全员过滤。

```yaml
operation:
  name: "分页查询分车分组"
  description: |
    按条件分页查询分车分组列表。
    支持按车组名称关键词、导师ID、安全员ID、活动ID进行过滤。
  api:
    method: GET
    path: "/rg/team_groups/getTeamGroupsByConditionAndPage"
  params:
    - name: activityId
      type: string
      required: true
      desc: 活动ID
    - name: name
      type: string
      required: false
      desc: 车组名称关键词
    - name: mentorId
      type: string
      required: false
      desc: 研学导师ID
    - name: securityId
      type: string
      required: false
      desc: 安全员ID
    - name: search
      type: string
      required: false
      desc: 通用关键词搜索
    - name: pageNum
      type: number
      required: false
      default: 1
      desc: 页码
    - name: pageSize
      type: number
      required: false
      default: 10
      desc: 每页数量
  requires_role:
    - role-controller
    - role-admin
  example: "查一下活动ID为xxx的所有分车情况"
```

---

### 分配成员到车组

将成员分配到指定车组。

```yaml
operation:
  name: "分配成员到车组"
  description: |
    将成员（学生/老师等）分配到指定的车组。
    必传 memberIds（成员ID列表）和 teamGroupId（车组ID）。
    注意事项：
    - 已请假学生(leaveType=1)无法分车，会返回错误
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
    - role-controller
    - role-admin
  example: "把张三和李四分到1号车"
```

**请求体示例:**

```json
{
  "memberIds": ["member_id_1", "member_id_2"],
  "teamGroupId": "team_group_id",
  "activityId": "activity_id",
  "classGroupId": "class_group_id"
}
```

---

### 移除分车成员

将成员从已分配的车组中移除（重新变为未分车状态）。

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
    - role-controller
    - role-admin
  example: "李四还没缴费"
```

---

### 导出行车信息

根据活动ID导出所有车辆信息Excel，包含车牌号、司机、载客量、已坐人数等。

```yaml
operation:
  name: "导出行车信息"
  description: |
    根据活动ID导出所有车辆信息Excel。
    包含：车牌号、车辆类型、载客量、司机姓名/电话/身份证号、已坐人数、未坐座位数、
    研学导师、安全员、关联的班级分组名称。
    最后一行显示汇总：合计载客量、已坐人数、未坐人数。
  api:
    method: GET
    path: "/rg/team_groups/export"
  params:
    - name: activityId
      type: string
      required: true
      desc: 活动ID
  requires_role:
    - role-controller
    - role-admin
  example: "导出这个活动的车辆信息表"
```

**响应:** 返回 OSS 下载链接（Excel文件）

---

### 获取司机信息

获取当前活动下所有司机及其所驾驶车辆的信息。

```yaml
operation:
  name: "获取司机信息"
  description: |
    获取当前活动下所有司机及其所驾驶车辆的信息。
    返回车辆信息、司机信息、乘客列表。
  api:
    method: GET
    path: "/rg/team_groups/getTeamGroupByActivityId"
  params: []
  requires_role:
    - role-controller
    - role-admin
  example: "这次活动有几个司机，都分配了哪些车"
```

---

## 日程管理

### 查询活动日程列表

根据活动ID查询该活动下的所有日程。

```yaml
operation:
  name: "查询活动日程列表"
  description: |
    根据活动ID查询该活动下的所有日程。
    返回每个日程的基本信息（时间、内容、类型等）。
  api:
    method: GET
    path: "/rg/day_managers/activity/{activityId}"
  params:
    - name: activityId
      type: string
      required: true
      desc: 活动ID
  requires_role:
    - role-controller
    - role-admin
  example: "这个活动有哪些日程安排"
```

---

### 获取班级与打卡信息

根据活动ID获取班级与打卡（checkpoint）信息。

```yaml
operation:
  name: "获取班级与打卡信息"
  description: |
    根据活动ID获取该活动下所有班级及其对应的打卡记录信息。
    返回每个班级关联的 checkpoint 打卡情况。
  api:
    method: GET
    path: "/rg/team_groups/getClassAndCheckpointInfoByActivityId"
  params: []
  requires_role:
    - role-controller
    - role-admin
  example: "各班级的打卡情况怎么样"
```

---

### 导出行程图片

将活动行程中的照片打包为ZIP导出到OSS，返回下载链接。

```yaml
operation:
  name: "导出行程图片"
  description: |
    将活动行程中的照片打包为ZIP压缩包并上传到OSS，返回下载链接。
    可指定班级分组ID导出特定班级的照片，或不指定导出全部。
  api:
    method: GET
    path: "/rg/day_managers/downloadImages/export"
  params:
    - name: activityId
      type: string
      required: true
      desc: 活动ID
    - name: classGroupId
      type: string
      required: false
      desc: 班级分组ID（不传则导出全部）
  requires_role:
    - role-controller
    - role-admin
  example: "把这次活动的行程照片导出来"
```

---

## 统计与报告

### 获取活动统计摘要

获取指定活动的统计摘要数据。

```yaml
operation:
  name: "获取活动统计摘要"
  description: |
    获取指定活动的统计摘要，包括活动数量、各状态分布等。
  api:
    method: GET
    path: "/rg/statistics/activities/{activityId}/summary"
  params:
    - name: activityId
      type: string
      required: true
      desc: 活动ID
  requires_role:
    - role-controller
    - role-admin
  example: "这次活动的统计数据是什么样的"
```

---

### 生成活动AI报告

基于活动数据生成活动报告，支持流式响应和对话式修改。

```yaml
operation:
  name: "生成活动AI报告"
  description: |
    基于活动数据（成员、签到、班级、车辆等信息）生成活动报告。
    使用流式响应（SSE），AI一边生成一边输出。
    生成后可继续对话修改报告内容。
  api:
    method: POST
    path: "/rg/activity-reports/generate"
  params:
    - name: activityId
      type: string
      required: true
      desc: 活动ID
    - name: stream
      type: boolean
      required: false
      default: true
      desc: 是否使用流式响应（必须为true）
  requires_role:
    - role-controller
    - role-admin
  example: "生成这次活动的报告"
```

**注意：** 此接口返回 SSE 流式数据，AI 应边接收边输出给用户。

---

### 保存报告历史

保存当前报告内容和对话历史。

```yaml
operation:
  name: "保存报告历史"
  description: |
    将报告内容和对话历史保存到服务器，下次可通过 loadHistory 加载继续编辑。
  api:
    method: POST
    path: "/rg/activity-reports/{activityId}/save-history"
  params:
    - name: activityId
      type: string
      required: true
      desc: 活动ID
    - name: content
      type: string
      required: true
      desc: 报告正文内容
    - name: chatHistory
      type: array
      required: false
      desc: 对话历史，格式 [{role: "user"|"assistant", content: "...", timestamp: "..."}]
  requires_role:
    - role-controller
    - role-admin
  example: "保存报告"
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
    - role-controller
    - role-admin
  example: "把这份报告导出为Word"
```

---

### 导出报告为PDF

将活动报告导出为PDF文件下载。

```yaml
operation:
  name: "导出报告为PDF"
  description: |
    将指定报告导出为PDF文件并返回下载。
  api:
    method: GET
    path: "/rg/activity-reports/{reportId}/export/pdf"
  params:
    - name: reportId
      type: string
      required: true
      desc: 报告ID
  requires_role:
    - role-controller
    - role-admin
  example: "把这份报告导出为PDF"
```

---

## 报备管理

### 创建报备

创建一个异常或紧急报备。

```yaml
operation:
  name: "创建报备"
  description: |
    创建一个报备记录，用于活动中的异常情况上报。
    报备类型包括：异常报备、紧急报备等。
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
      desc: 报备类型
    - name: content
      type: string
      required: false
      desc: 报备内容
  requires_role:
    - role-controller
    - role-admin
  example: "创建一条报备：3号车轮胎漏气需要维修"
```

---

### 分页查询报备列表

分页查询报备记录，支持按活动、员工、班级、状态过滤。

```yaml
operation:
  name: "分页查询报备列表"
  description: |
    分页查询报备记录列表，支持多条件过滤。
    可按活动ID、员工ID、班级ID、报备类型、处理状态进行筛选。
    isHandled: "0"=未处理，"1"=已处理
  api:
    method: GET
    path: "/rg/api/reports/getReportByPageAndCondition"
  params:
    - name: activityId
      type: string
      required: false
      desc: 活动ID
    - name: staffId
      type: string
      required: false
      desc: 员工ID
    - name: classGroupId
      type: string
      required: false
      desc: 班级分组ID
    - name: search
      type: string
      required: false
      desc: 关键词搜索
    - name: reportType
      type: string
      required: false
      desc: 报备类型
    - name: isHandled
      type: string
      required: false
      desc: 处理状态，"0"=未处理，"1"=已处理
    - name: page
      type: number
      required: false
      default: 1
      desc: 页码
    - name: size
      type: number
      required: false
      default: 10
      desc: 每页数量
  requires_role:
    - role-controller
    - role-admin
  example: "查一下有哪些未处理的报备"
```

---

## 签到管理

### 总控帮他人签到

总控代替老师/助教/司机进行签到。

```yaml
operation:
  name: "总控帮他人签到"
  description: |
    总控代替老师、助教或司机进行签到操作。
    传入签到记录列表，包含成员ID和签到状态。
  api:
    method: POST
    path: "/rg/sign_records/managerSign"
  params:
    - name: signRecords
      type: array
      required: true
      desc: 签到记录列表，每个包含 memberId、status 等
  requires_role:
    - role-controller
    - role-admin
  example: "帮张三和李四签到"
```

---

### 签到并分车

成员签到的同时自动完成分车分配。

```yaml
operation:
  name: "签到并分车"
  description: |
    在签到时同时完成分车分配。
    适用于签到时就知道成员上哪辆车的场景。
  api:
    method: POST
    path: "/rg/sign_records/signAndSeparateCar"
  params:
    - name: memberId
      type: string
      required: true
      desc: 成员ID
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
    - name: signType
      type: string
      required: false
      desc: 签到状态
  requires_role:
    - role-controller
    - role-admin
  example: "王五签到并分到2号车"
```

---

## 操作指南：如何调用

在对话中，AI 会根据用户描述选择合适的 operation，构建 HTTP 请求：

```
GET {RANGER_API_BASE}/study_activities/getActivitiesByPageAndCondition?status=0&page=1&size=10
Authorization: Bearer {RANGER_ACCESS_TOKEN}
```

AI 负责：
1. 理解用户意图，选择正确的 operation
2. 从对话中提取参数值
3. 调用 API
4. 将 JSON 响应转换为自然语言回复
5. 根据 `requires_role` 判断用户是否有权限执行该操作
