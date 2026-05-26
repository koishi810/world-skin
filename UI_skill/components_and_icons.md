# 组件与图标

记录已验证的控件实装方式。

---

## 返回按钮

- Figma 复用位置：`01_Components` → `Icon / 可复用元素` → `Reusable / 页面控件` → `Button / 返回`
- 实装为「图标 + 文字」在同一个 `<button>` 里
- 整体都可点击，不只是图标区域
- 位置：`left:18px; top:51px`（profile 视图），使用 Figma 实际值
- 图标用 Material Icons `chevron_left`，18px
- component 子层：`返回01`、`返回标题01`

```html
<button class="pv-back" id="profileBack" type="button">
  <span class="material-icons">chevron_left</span>
  <span class="pv-title">プロフィール</span>
</button>
```

**注意**：不要把按钮放在绝对定位的包裹 div 里再对子元素做绝对定位——子元素的 top/left 会相对包裹 div 计算，不是相对 frame，位置会错。

---

## 底部导航（nav-btn）

- Figma 复用位置：`01_Components` → `Icon / 可复用元素` → `Reusable / 页面控件`
- 复用组件：
  - `Nav Button / World / Closed`
  - `Nav Button / World / Expanded Unselected`
  - `Nav Button / World / Open`
  - `Nav Button / Sense / Closed`
  - `Nav Button / Sense / Expanded Unselected`
  - `Nav Button / Sense / Open`
  - `Nav Button / Profile / Closed`
  - `Nav Button / Profile / Expanded Unselected`
  - `Nav Button / Profile / Open`
- 三个圆圈按钮，使用 SVG 图标
- 9 个 `Nav Button / ...` 外层统一为 `34×34` Frame 容器；不要混用 Group 和 Frame
- `Closed`：收起态，低透明，作为未展开时的轻量按钮
- `Expanded Unselected`：展开未选中态，沿用 closed 图形，opacity `100`
- `Open`：展开选中态，使用选中图形，opacity `100`
- 使用 `pointer-events:none` 默认，nav-open 时开启
- 位置从 Figma 值换算（frame 高 852px 换算 bottom）

## 底部导航组合

- Figma 复用位置：`01_Components` → `Icon / 可复用元素` → `Components / Controls`
- 组合占位：
  - `Nav / 底部导航 / Closed`
  - `Nav / 底部导航 / Expanded Unselected`
  - `Nav / 底部导航 / Open`
- 控件归档组命名：`Nav / 底部导航按钮组`
- 用于记录「三个导航按钮作为一个整体」的展开 / 收起关系
- 当前是结构占位，不替代单个 `Nav Button / ...` 图标组件
- 后续正式化时应把 avatar、overlay、utility、timeline 的显隐关系一并纳入组合态

## nav-overlay（底部遮罩）

- world 和 radius 复用同一位置：`left:-102px; bottom:-95px; opacity:0.50`
- **不给 radius 设单独位置**——两个视图分别设不同 bottom 值，nav-open 时 transition 只覆盖 transform，切换时会跳位
- nav-open 时统一 `transform:translateY(-40px)`

## 头像按钮（avatar-btn）

- 默认：`background:rgba(217,217,217,.20)`（半透明圆圈）
- nav-open 时：`background:rgba(217,217,217,.90)`（高亮）
- transition 同时包含 background 和 opacity
- nav-closed 时点击 → 开启 nav-open
- nav-open 时点击 → 进入 profile 视图

## utility 按钮

- Figma 复用位置：`01_Components` → `Icon / 可复用元素` → `Reusable / 页面控件`
- `Button / 地图工具 / 重置方向`：`40×40` 透明点击区，Material Icons `explore`，图标 `20×20`
- `Button / 地图工具 / 重新定位`：`40×40` 透明点击区，Material Icons `my_location`，图标 `20×20`
- `Button / 记录 / 新建记录`：`40×40` 透明点击区，内部 `新建记录01` 图标 `15×15` 居中
- 默认隐藏（`opacity:0; pointer-events:none`）
- world / radius 视图下显示
- nav-open 时强制隐藏（`!important`）

## 时间轴（time-axis）

- `z-index:9`——必须高于 footer-nav（z-index:8），否则被 nav-overlay 拦截无法拖动
- nav-open 时隐藏（`opacity:0; pointer-events:none`）

## 大头像（profile 视图）

- 234×234px，`border-radius:9999px; overflow:hidden`
- 内部 `<img>` 填满：`width:100%; height:100%; object-fit:cover`
- 素材从 `assets/figma/profile-avatar-large.png`

## 头像组件

- Figma 位置：`01_Components` → `Icon / 可复用元素` → `Reusable / 头像组件`
- 大头像 component：`Avatar / 大头像`，尺寸 `234×234`
- 小头像 component：`Avatar / 小头像`，尺寸 `50×50`
- 地图头像框 component：`Avatar / 地图头像框`，尺寸 `43×43`，用于地图主界面的半透明头像占位
- 地图头像框弱显示例：`Avatar / 地图头像框 / 20%`，尺寸同为 `43×43`，用于设计页里低优先级 / 未激活头像状态
- 头像旁个人标识：`Icon / 头像 / 个人标识`，尺寸 `22×22`，Material Icons `person`
- 大头像图钉线：`Line / 头像图钉线`，尺寸 `11×7`，内部线段 `11×0`、`strokeWeight:7`
- component 外层不设置 Fill、Stroke、Effects，只负责复用边界
- 头像本体用 Ellipse 裁切图片或占位色，子图层命名为 `大头像01`、`小头像01`、`地图头像框01`
- 头像辅助元素也单独做 component，不塞进头像本体；子图层命名为 `个人标识01`、`头像图钉线01`

## 设置列表行

- Figma 位置：`01_Components` → `Icon / 可复用元素` → `Reusable / 页面控件` → `Row / 设置项`
- 尺寸 `345×54`
- 结构：`设置项图标01`、`设置项标题01`、`设置项说明01`、`设置项分割线01`
- 用于设置页中 `icon + title + meta + divider` 的稳定行结构

## 资料信息项

- Figma 位置：`01_Components` → `Reusable / 信息结构` → `Section / 资料信息项`
- 尺寸 `345×88`
- 结构：`资料信息标题01`、`资料信息内容01`、`资料信息说明01`、`资料信息分割线01`
- 用于个人资料页的「当前倾向」「最近记录」这类信息模块

## 信息结构组件

- Figma 位置：`01_Components` → `Reusable / 信息结构`
- 归档版式统一使用 `Typography / 字体系统（待确认）` 的说明 panel 结构：左侧 component 名，中间规则说明，右侧真实样例
- 已建立：
  - `Row / 设置项`
  - `Row / 分享选项`
  - `Section / 资料信息项`
  - `Header / 页面标题组`
  - `Divider / 信息分割线`
  - `Toggle / 分享开关 / On`
  - `Toggle / 分享开关 / Off`
- 留给设计确认：
  - `TODO / Records 信息卡（待整理）`
  - `TODO / Profile 统计块（待整理）`
- 这些组件服务文字型页面，不要画成独立卡片风格；优先保持暗色背景上的轻量信息层级

## 图标使用

- 优先 Material Icons（已引入 CDN）
- 图标服务功能识别，不抢页面主导权
- 地图主界面不用边缘清晰的卡片化按钮
- 纯图标 component 使用固定透明容器，不画可见方形底；容器只负责对齐、点击热区和复用尺寸

## 设置界面图标

- Figma 位置：`01_Components` → `Icon / 可复用元素` → `Panel / 设置界面图标`
- 每个图标做成独立 component：`Icon / 设置 / 语义`
- component 容器为 `36×36` 透明 Frame/Component，不设置 Fill、Stroke、Effects
- 图标主体保留 Material Icons 字符，不重新画路径
- 图标主体尺寸为 `18×18`，在容器中居中
- 说明版式按 `Typography / 字体系统（待确认）` 的 panel 结构：左侧 component 名，中间规则说明，右侧直接放样例
- 子图层无法继续语义拆分时继承父级语义并编号，例如 `地图明暗01`
- 来源以 `05_Record Visualizations` → `Settings / FULL` 为准

## 头像组件归档

- Figma 位置：`01_Components` → `Icon / 可复用元素` → `Panel / 头像组件`
- 说明版式按 `Typography / 字体系统（待确认）` 的 panel 结构：左侧 component 名，中间规则说明，右侧直接放样例
- 头像本体、头像框、个人标识、头像图钉线分开记录；不要为了视觉组合把辅助元素塞回头像本体

## 分享界面图标

- Figma 位置：`01_Components` → `Icon / 可复用元素` → `Panel / 分享界面元素`
- 每个图标做成独立 component：`Icon / 分享 / 语义`
- component 容器为 `36×36` 透明 Frame/Component，不设置 Fill、Stroke、Effects
- 图标主体保留 Material Icons 字符，不重新画路径
- 图标主体尺寸为 `18×18`，在容器中居中
- 说明版式按 `Typography / 字体系统（待确认）` 的 panel 结构：左侧 component 名，中间规则说明，右侧直接放样例
- 已整理：
  - `Icon / 分享 / 分享入口`
  - `Icon / 分享 / 链接`
  - `Icon / 分享 / 图片`
  - `Icon / 分享 / 地图范围`
  - `Icon / 分享 / 感觉分布`
  - `Icon / 分享 / 时间层`
- 来源以 `05_Record Visualizations` → `Share / 01 共有` 为准
- 底部分享操作只用 icon，不加按钮框；点击热区由代码或外层容器处理

## 分享选项行

- Figma 位置：`01_Components` → `Reusable / 信息结构`
- `Row / 分享选项` 尺寸 `345×74`
- 结构：`分享选项图标01`、`分享选项标题01`、`分享选项说明01`、`分享选项开关轨道01`、`分享选项开关滑块01`、`分享选项分割线01`
- 用于分享页 `Section / 共有する内容` 的三条设置行
- 文字页节奏沿用 UI_skill：section 标题到第一条主内容约 `20px`，说明文字结束到分割线约 `20–26px`
- 已建立独立开关 component：
  - `Toggle / 分享开关 / On`
  - `Toggle / 分享开关 / Off`
- 开关属于分享选项行的控件，不要画成大按钮；行本身也不加卡片底

## Sense 可复用部件

- Figma 位置：`01_Components` → `Sense / 可复用部件（待确认）`
- 已建立结构入口：
  - `Sense Part / 长按核心`
  - `Sense Part / 呼气雾`
  - `Sense Part / 情绪选择项 249`
  - `Sense Part / 情绪选择项 332`
  - `Sense Part / 引导文案组`
- 留给设计确认：
  - `TODO / Sense 圆形质感母版`
  - `TODO / Sense 词团随机规则`
- 当前这些是复用抽象入口，不是最终视觉母版。圆、雾、词团的渐变质感仍以你后续确认的 Figma 视觉为准。

## Sense 文案层

- Figma 位置：
  - `01_Components` → `Sense / 记录动画` → 每个 `Sense Flow / ...` frame 内
  - `05_Record Visualizations` → `sense修正` → 每个确定的 Sense 画面 frame 内
- 每个画面内部建立顶层 frame：`Copy / 文案层`
- `Hint / 主文案`、`Hint / 辅助文案`、`Hint / 情绪标签 ...` 从原来的 `Contact / 接触层` 或 `Hint / 引导文案` 中拉出，放到 `Copy / 文案层`
- `Copy / 文案层` 本身透明、无 fill、无 stroke，只负责让文案和视觉动效层分离
- 不收 `测试用途：...` 这类备注，不移动 `Status / ...` 状态栏文字
- 后续修改 Sense UI 文案时，优先改各画面顶层 `Copy / 文案层`，不要在动效圆、雾、核心层里找文字
