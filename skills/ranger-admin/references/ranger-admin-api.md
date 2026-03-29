# ranger-admin — 计调技能包

**适用角色:** 计调（role-admin）、总控（role-controller）、研学导师（role-mentor）、安全助手（role-assistant）

计调是系统最高权限角色，token 为计调时可调用所有角色的接口。
每个 operation 的 `requires_role` 列出了所有可调用的角色（实际以 token 真实角色为准）。

---

## 环境配置

```bash
RANGER_API_BASE=http://8.156.83.69:8888/rg
RANGER_ACCESS_TOKEN=your-jwt-token
```

所有 API 调用需要在 header 中携带 `Authorization: Bearer {RANGER_ACCESS_TOKEN}`

---

## 计调专属操作

以下操作仅为计调所有，不在 controller / mentor skill 中定义。

### 账号管理

#### 创建账号

创建一个新的系统账号。

```yaml
operation:
  name: "创建账号"
  description: |
    创建一个新的系统账号。
    账号类型（type）：0=admin，1=staff，2=member，3=司机
    角色（role）：role-admin / role-controller / role-mentor / role-assistant / role-driver / role-parent
  api:
    method: POST
    path: "/rg/accounts"
  params:
    - name: username
      type: string
      required: true
      desc: 用户名
    - name: phone
      type: string
      required: true
      desc: 手机号
    - name: role
      type: string
      required: true
      desc: 角色代码，如 role-controller
    - name: type
      type: string
      required: false
      desc: 账号类型，0=admin，1=staff，2=member，3=司机
    - name: companyId
      type: string
      required: false
      desc: 公司ID
  requires_role:
    - role-admin
    - role-controller
    - role-mentor
    - role-assistant
    - role-controller
    - role-mentor
    - role-assistant
  example: "新建一个总控账号，用户名张三，手机号138xxx"
```

---

#### 分页查询账号

分页查询系统账号列表，支持按用户名或手机号搜索。

```yaml
operation:
  name: "分页查询账号"
  description: |
    分页查询系统账号列表，支持按用户名或手机号关键词搜索。
  api:
    method: GET
    path: "/rg/accounts/getAccountsByPageAndCondition"
  params:
    - name: search
      type: string
      required: false
      desc: 关键词搜索（匹配用户名或手机号）
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
    - role-admin
    - role-controller
    - role-mentor
    - role-assistant
  example: "查一下所有账号"
```

---

#### 更新账号

更新指定账号的信息。

```yaml
operation:
  name: "更新账号"
  description: |
    根据账号ID更新账号信息，包括角色、手机号、关联公司等。
  api:
    method: PUT
    path: "/rg/accounts/{id}"
  params:
    - name: id
      type: string
      required: true
      desc: 账号ID
    - name: role
      type: string
      required: false
      desc: 角色代码
    - name: phone
      type: string
      required: false
      desc: 手机号
    - name: companyId
      type: string
      required: false
      desc: 公司ID
  requires_role:
    - role-admin
    - role-controller
    - role-mentor
    - role-assistant
  example: "把张三的账号角色改为总控"
```

---

#### 删除账号

删除指定账号。

```yaml
operation:
  name: "删除账号"
  description: |
    根据账号ID删除指定账号。
  api:
    method: DELETE
    path: "/rg/accounts/{id}"
  params:
    - name: id
      type: string
      required: true
      desc: 账号ID
  requires_role:
    - role-admin
    - role-controller
    - role-mentor
    - role-assistant
  example: "删除这个账号"
```

---

### 公司管理

#### 创建公司

创建新的公司/机构。

```yaml
operation:
  name: "创建公司"
  description: |
    创建一个新的公司/机构。
  api:
    method: POST
    path: "/rg/companies"
  params:
    - name: name
      type: string
      required: true
      desc: 公司名称
    - name: address
      type: string
      required: false
      desc: 公司地址
  requires_role:
    - role-admin
    - role-controller
    - role-mentor
    - role-assistant
  example: "新建一个公司"
```

---

#### 查询公司列表

查询所有公司信息。

```yaml
operation:
  name: "查询公司列表"
  description: |
    查询系统中所有公司/机构的信息列表。
  api:
    method: GET
    path: "/rg/companies"
  params: []
  requires_role:
    - role-admin
    - role-controller
    - role-mentor
    - role-assistant
  example: "有哪些公司"
```

---

#### 更新公司

更新指定公司的信息。

```yaml
operation:
  name: "更新公司"
  description: |
    根据公司ID更新公司信息。
  api:
    method: PUT
    path: "/rg/companies"
  params:
    - name: id
      type: string
      required: true
      desc: 公司ID
    - name: name
      type: string
      required: false
      desc: 公司名称
    - name: address
      type: string
      required: false
      desc: 公司地址
  requires_role:
    - role-admin
    - role-controller
    - role-mentor
    - role-assistant
  example: "更新这个公司的信息"
```

---

#### 删除公司

删除指定公司。

```yaml
operation:
  name: "删除公司"
  description: |
    根据公司ID删除指定公司。
  api:
    method: DELETE
    path: "/rg/companies/{id}"
  params:
    - name: id
      type: string
      required: true
      desc: 公司ID
  requires_role:
    - role-admin
    - role-controller
    - role-mentor
    - role-assistant
  example: "删除这个公司"
```

---

### 员工管理

#### 分页查询员工

分页查询员工列表，支持按姓名、手机号、身份证号搜索，按角色类型筛选。

```yaml
operation:
  name: "分页查询员工"
  description: |
    分页查询员工列表，支持：
    - 关键词搜索（姓名、手机号、身份证号）
    - 按角色类型筛选（roleType）
    角色类型包括：导师(mentor)、助教(security)、司机(driver)等。
  api:
    method: GET
    path: "/rg/staffs/getStaffsByPageAndCondition"
  params:
    - name: search
      type: string
      required: false
      desc: 关键词搜索（姓名/手机号/身份证号模糊匹配）
    - name: roleType
      type: string
      required: false
      desc: 角色类型筛选
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
    - role-admin
    - role-controller
    - role-mentor
    - role-assistant
  example: "查一下所有导师"
```

---

#### 创建员工

新增一条员工记录。

```yaml
operation:
  name: "创建员工"
  description: |
    新增并保存员工信息到系统。
  api:
    method: POST
    path: "/rg/staffs"
  params:
    - name: name
      type: string
      required: true
      desc: 员工姓名
    - name: phone
      type: string
      required: false
      desc: 手机号
    - name: idCard
      type: string
      required: false
      desc: 身份证号
    - name: roleType
      type: string
      required: false
      desc: 角色类型
  requires_role:
    - role-admin
    - role-controller
    - role-mentor
    - role-assistant
  example: "添加一个新员工"
```

---

#### 更新员工

更新指定员工的信息。

```yaml
operation:
  name: "更新员工"
  description: |
    根据员工ID更新员工信息。
  api:
    method: PUT
    path: "/rg/staffs/{id}"
  params:
    - name: id
      type: string
      required: true
      desc: 员工ID
    - name: name
      type: string
      required: false
      desc: 员工姓名
    - name: phone
      type: string
      required: false
      desc: 手机号
    - name: roleType
      type: string
      required: false
      desc: 角色类型
  requires_role:
    - role-admin
    - role-controller
    - role-mentor
    - role-assistant
  example: "更新这个员工的信息"
```

---

#### 删除员工

删除指定员工。

```yaml
operation:
  name: "删除员工"
  description: |
    根据员工ID删除指定员工。
  api:
    method: DELETE
    path: "/rg/staffs/{id}"
  params:
    - name: id
      type: string
      required: true
      desc: 员工ID
  requires_role:
    - role-admin
    - role-controller
    - role-mentor
    - role-assistant
  example: "删除这个员工"
```

---

#### Excel 批量导入员工

上传 Excel 文件批量导入员工信息。

```yaml
operation:
  name: "Excel批量导入员工"
  description: |
    上传 Excel 文件批量导入员工信息。
    Excel 应包含：姓名、手机号、身份证号等字段。
  api:
    method: POST
    path: "/rg/staffs/excel/import"
  params:
    - name: file
      type: file
      required: true
      desc: Excel文件（multipart/form-data）
  requires_role:
    - role-admin
    - role-controller
    - role-mentor
    - role-assistant
  example: "从Excel批量导入员工"
```

---

#### 简化批量导入员工

只需填写姓名、手机号、身份证号三个字段的 Excel 批量导入。

```yaml
operation:
  name: "简化批量导入员工"
  description: |
    只需填写姓名、手机号、身份证号三个字段的Excel批量导入。
    格式更简单，适合快速导入。
  api:
    method: POST
    path: "/rg/staffs/simple-import"
  params:
    - name: file
      type: file
      required: true
      desc: Excel文件（multipart/form-data）
  requires_role:
    - role-admin
    - role-controller
    - role-mentor
    - role-assistant
  example: "简化模式导入员工"
```

---

### 车辆管理

#### 分页查询车辆

分页查询车辆列表，支持按车牌号、车辆类型、载客量、司机搜索。

```yaml
operation:
  name: "分页查询车辆"
  description: |
    分页查询车辆列表，支持多条件过滤。
  api:
    method: GET
    path: "/rg/vehicles/page"
  params:
    - name: vehicleNumber
      type: string
      required: false
      desc: 车牌号
    - name: vehicleType
      type: string
      required: false
      desc: 车辆类型
    - name: capacity
      type: number
      required: false
      desc: 载客量
    - name: driver
      type: string
      required: false
      desc: 司机姓名
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
    - role-admin
    - role-controller
    - role-mentor
    - role-assistant
  example: "查一下所有车辆"
```

---

#### 创建车辆

新增车辆信息。

```yaml
operation:
  name: "创建车辆"
  description: |
    创建并保存新的车辆信息。
  api:
    method: POST
    path: "/rg/vehicles"
  params:
    - name: vehicleNumber
      type: string
      required: true
      desc: 车牌号
    - name: vehicleType
      type: string
      required: false
      desc: 车辆类型
    - name: capacity
      type: number
      required: false
      desc: 载客量
    - name: driverName
      type: string
      required: false
      desc: 司机姓名
    - name: driverPhone
      type: string
      required: false
      desc: 司机电话
  requires_role:
    - role-admin
    - role-controller
    - role-mentor
    - role-assistant
  example: "添加一辆新车"
```

---

#### 更新车辆

更新指定车辆的信息。

```yaml
operation:
  name: "更新车辆"
  description: |
    根据车辆ID更新车辆信息。
  api:
    method: PUT
    path: "/rg/vehicles/{id}"
  params:
    - name: id
      type: string
      required: true
      desc: 车辆ID
    - name: vehicleNumber
      type: string
      required: false
      desc: 车牌号
    - name: vehicleType
      type: string
      required: false
      desc: 车辆类型
    - name: capacity
      type: number
      required: false
      desc: 载客量
  requires_role:
    - role-admin
    - role-controller
    - role-mentor
    - role-assistant
  example: "更新这辆车的信息"
```

---

#### 删除车辆

删除指定车辆。

```yaml
operation:
  name: "删除车辆"
  description: |
    根据车辆ID删除指定车辆。
  api:
    method: DELETE
    path: "/rg/vehicles/{id}"
  params:
    - name: id
      type: string
      required: true
      desc: 车辆ID
  requires_role:
    - role-admin
    - role-controller
    - role-mentor
    - role-assistant
  example: "删除这辆车"
```

---

#### Excel 批量导入车辆

上传 Excel 文件批量导入车辆信息。

```yaml
operation:
  name: "Excel批量导入车辆"
  description: |
    上传 Excel 文件批量导入车辆信息。
    Excel 应包含：车牌号、车辆类型、载客量、司机姓名、司机电话等字段。
  api:
    method: POST
    path: "/rg/vehicles/excel/import"
  params:
    - name: file
      type: file
      required: true
      desc: Excel文件（multipart/form-data）
  requires_role:
    - role-admin
    - role-controller
    - role-mentor
    - role-assistant
  example: "从Excel批量导入车辆"
```

---

### 权限管理

#### 查询权限列表

查询系统中所有权限定义。

```yaml
operation:
  name: "查询权限列表"
  description: |
    查询系统中所有的权限定义列表。
  api:
    method: GET
    path: "/rg/permissions"
  params: []
  requires_role:
    - role-admin
    - role-controller
    - role-mentor
    - role-assistant
  example: "有哪些权限"
```

---

#### 创建权限

创建一个新的权限定义。

```yaml
operation:
  name: "创建权限"
  description: |
    创建一个新的权限定义。
  api:
    method: POST
    path: "/rg/permissions"
  params:
    - name: name
      type: string
      required: true
      desc: 权限名称
    - name: code
      type: string
      required: true
      desc: 权限代码
    - name: description
      type: string
      required: false
      desc: 权限描述
  requires_role:
    - role-admin
    - role-controller
    - role-mentor
    - role-assistant
  example: "新建一个权限"
```

---

#### 更新权限

更新指定权限的定义。

```yaml
operation:
  name: "更新权限"
  description: |
    根据权限ID更新权限定义。
  api:
    method: PUT
    path: "/rg/permissions/{id}"
  params:
    - name: id
      type: string
      required: true
      desc: 权限ID
    - name: name
      type: string
      required: false
      desc: 权限名称
    - name: description
      type: string
      required: false
      desc: 权限描述
  requires_role:
    - role-admin
    - role-controller
    - role-mentor
    - role-assistant
  example: "更新这个权限"
```

---

#### 删除权限

删除指定权限。

```yaml
operation:
  name: "删除权限"
  description: |
    根据权限ID删除指定权限。
  api:
    method: DELETE
    path: "/rg/permissions/{id}"
  params:
    - name: id
      type: string
      required: true
      desc: 权限ID
  requires_role:
    - role-admin
    - role-controller
    - role-mentor
    - role-assistant
  example: "删除这个权限"
```

---

### 组织机构管理

#### 创建组织机构

创建一个新的组织机构（如学校、教育集团等）。

```yaml
operation:
  name: "创建组织机构"
  description: |
    创建一个新的组织机构。
  api:
    method: POST
    path: "/rg/organizations"
  params:
    - name: name
      type: string
      required: true
      desc: 组织机构名称
    - name: parentId
      type: string
      required: false
      desc: 上级机构ID（支持树形结构）
  requires_role:
    - role-admin
    - role-controller
    - role-mentor
    - role-assistant
  example: "添加一个新的学校"
```

---

#### 分页查询组织机构

分页查询组织机构列表，支持按名称搜索。

```yaml
operation:
  name: "分页查询组织机构"
  description: |
    分页查询组织机构列表，支持按名称关键词搜索。
  api:
    method: GET
    path: "/rg/organizations/getOrganizationsByPageAndCondition"
  params:
    - name: search
      type: string
      required: false
      desc: 名称关键词搜索
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
    - role-admin
    - role-controller
    - role-mentor
    - role-assistant
  example: "查一下所有组织"
```

---

#### 更新组织机构

更新指定组织机构的信息。

```yaml
operation:
  name: "更新组织机构"
  description: |
    根据组织机构ID更新信息。
  api:
    method: PUT
    path: "/rg/organizations/{id}"
  params:
    - name: id
      type: string
      required: true
      desc: 组织机构ID
    - name: name
      type: string
      required: false
      desc: 组织机构名称
  requires_role:
    - role-admin
    - role-controller
    - role-mentor
    - role-assistant
  example: "更新这个组织的信息"
```

---

#### 删除组织机构

删除指定组织机构。

```yaml
operation:
  name: "删除组织机构"
  description: |
    根据组织机构ID删除指定组织。
  api:
    method: DELETE
    path: "/rg/organizations/{id}"
  params:
    - name: id
      type: string
      required: true
      desc: 组织机构ID
  requires_role:
    - role-admin
    - role-controller
    - role-mentor
    - role-assistant
  example: "删除这个组织"
```

---

### 机构班级管理

#### 创建机构班级

在指定组织下创建一个班级。

```yaml
operation:
  name: "创建机构班级"
  description: |
    在指定组织下创建一个班级。
  api:
    method: POST
    path: "/rg/organizationClasses"
  params:
    - name: name
      type: string
      required: true
      desc: 班级名称，如"高一1班"
    - name: orgId
      type: string
      required: true
      desc: 所属组织机构ID
  requires_role:
    - role-admin
    - role-controller
    - role-mentor
    - role-assistant
  example: "在XX学校下新建一个班级"
```

---

#### 查询机构班级列表

查询指定组织下的所有班级。

```yaml
operation:
  name: "查询机构班级列表"
  description: |
    根据组织ID查询该组织下的所有班级列表。
  api:
    method: GET
    path: "/rg/organizationClasses/org/{orgId}"
  params:
    - name: orgId
      type: string
      required: true
      desc: 组织机构ID
  requires_role:
    - role-admin
    - role-controller
    - role-mentor
    - role-assistant
  example: "这个学校有哪些班"
```

---

#### 更新机构班级

更新指定班级的信息。

```yaml
operation:
  name: "更新机构班级"
  description: |
    根据班级ID更新班级信息。
  api:
    method: PUT
    path: "/rg/organizationClasses"
  params:
    - name: id
      type: string
      required: true
      desc: 班级ID
    - name: name
      type: string
      required: false
      desc: 班级名称
  requires_role:
    - role-admin
    - role-controller
    - role-mentor
    - role-assistant
  example: "更新这个班级"
```

---

#### 删除机构班级

删除指定班级。

```yaml
operation:
  name: "删除机构班级"
  description: |
    根据班级ID删除指定班级。
  api:
    method: DELETE
    path: "/rg/organizationClasses/{id}"
  params:
    - name: id
      type: string
      required: true
      desc: 班级ID
  requires_role:
    - role-admin
    - role-controller
    - role-mentor
    - role-assistant
  example: "删除这个班级"
```

---

### 基础数据管理

#### 查询基础分类列表

按分类类型查询基础数据分类列表。

```yaml
operation:
  name: "查询基础分类列表"
  description: |
    按分类类型查询基础数据分类列表。
    分类类型：
    - STUDY_ACTIVITY_THEME_TYPE：学习活动主题类型
    - STUDY_ACTIVITY_PARTICIPATION_TYPE：学习活动参与类型
    - STUDY_ACTIVITY_PARTICIPATION_SCHOOL_TYPE：学习活动参与学校类型
  api:
    method: GET
    path: "/rg/categoryBases/listByType"
  params:
    - name: categoryType
      type: string
      required: true
      desc: 分类类型代码
  requires_role:
    - role-admin
    - role-controller
    - role-mentor
    - role-assistant
  example: "查询活动主题类型有哪些"
```

---

#### 创建基础分类

创建一条基础数据分类。

```yaml
operation:
  name: "创建基础分类"
  description: |
    创建一个新的基础数据分类。
  api:
    method: POST
    path: "/rg/categoryBases"
  params:
    - name: name
      type: string
      required: true
      desc: 分类名称
    - name: categoryType
      type: string
      required: true
      desc: 分类类型代码
    - name: parentId
      type: string
      required: false
      desc: 上级分类ID（支持树形）
  requires_role:
    - role-admin
    - role-controller
    - role-mentor
    - role-assistant
  example: "添加一个新的活动主题类型"
```

---

#### 更新基础分类

更新指定基础分类。

```yaml
operation:
  name: "更新基础分类"
  description: |
    根据分类ID更新基础分类信息。
  api:
    method: PUT
    path: "/rg/categoryBases/{categoryId}"
  params:
    - name: categoryId
      type: string
      required: true
      desc: 分类ID
    - name: name
      type: string
      required: false
      desc: 分类名称
  requires_role:
    - role-admin
    - role-controller
    - role-mentor
    - role-assistant
  example: "更新这个分类"
```

---

#### 删除基础分类

删除指定基础分类。

```yaml
operation:
  name: "删除基础分类"
  description: |
    根据分类ID删除指定基础分类。
  api:
    method: DELETE
    path: "/rg/categoryBases/{categoryId}"
  params:
    - name: categoryId
      type: string
      required: true
      desc: 分类ID
  requires_role:
    - role-admin
    - role-controller
    - role-mentor
    - role-assistant
  example: "删除这个分类"
```

---

## 操作指南：如何调用

计调拥有所有权限，可以调用 ranger-controller 和 ranger-mentor 的全部 operation。

在对话中，AI 会根据用户描述选择合适的 operation，构建 HTTP 请求：

```
GET {RANGER_API_BASE}/accounts/getAccountsByPageAndCondition?pageNum=1&pageSize=10
Authorization: Bearer {RANGER_ACCESS_TOKEN}
```

AI 负责：
1. 理解用户意图，选择正确的 operation
2. 从对话中提取参数值
3. 调用 API
4. 将 JSON 响应转换为自然语言回复
5. 根据 `requires_role` 判断用户是否有权限（计调拥有所有权限）
