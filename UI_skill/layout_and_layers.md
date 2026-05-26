# 图层与版面结构

Figma 文件的图层组织方式。测试版中验证有效的结构记录在此。

---

## 核心原则

图层结构应反映**界面真实的行为方式**，不只是视觉外观。

- 固定控件与可滚动内容分开
- 大区域按语义分组
- 同类页面保持同一套图层结构
- 文字、图标、分割线不要长期散放在最外层

---

## 推荐页面结构

**普通页面**：
```
System / Status Bar
Background / 背景层
Overlay / ...（如需要）
Header / ...
Content / ...
```

**可滚动长页面**：
```
Header / 返回按钮（固定，不进滚动组）
Content / 主体（内部按 Section 继续拆）
```

---

## 分组规则

### 01 组件归档 Table
- `01_Components` 的每个顶层 section 直接子层统一只保留一个 `table`
- `table` 下面只放 `row`
- 每个 `row` 内固定结构：
  ```
  Row-head
  cell
    item
  ```
- `Row-head` 放组件名和简短说明
- `cell` 放状态、变体或样例；真实组件必须放在 `item` 内
- 同一类组件的不同状态横向放在同一行的多个 `cell` 中；不要另起自由散放的 panel
- 旧的说明 panel 可以作为 `item` 临时放入 cell，但之后应逐步拆成更小的 component / state 样例
- 这个结构优先保证组件库可扫描和可维护，不承担正式页面设计

### 返回按钮
- 返回图标 + 文字放同一组，命名 `Header / 返回按钮`
- 不放进滚动内容里
- 实装时整个按钮区域都应可点击（不只是图标）

### 页面头部
- 头像、标题、辅助说明单独成组：`Header / 头部`

### 页面主体
- 内容整块打包：`Content / 设置主体`
- 内部按语义拆 section：`Section / 表示`、`Section / 记录`

### 分割线
- 放进它所属的 section，不散放在最外层

### 状态栏
- 统一用 `System / Status Bar`，独立于所有内容
- 高度 59px，iPhone 16 模板，暗色界面白色状态栏
- 不参与滚动、mask 或过渡动效

---

## 各视图已验证结构

### world / radius（地图视图）
同一套结构，radius 只多一个「記録」按钮：
```
canvas（地图，全局渲染）
nav-overlay（底部渐变遮罩）
nav-btn × 3（导航圆圈）
avatar-btn（右上头像）
time-axis（时间轴）
utility（工具按钮组）
personal-records-btn（仅 radius）
topbar（System / Status Bar）
```

### profile 视图
```
pv-bg-oval（径向渐变背景层）
pv-bg-bottom-glow（底部光晕）
pv-bg-right-gradient（右侧渐变）
pv-back（返回按钮，整体可点）
pv-avatar（大头像圆圈）
pv-name / pv-subtitle
pv-divider × 3
各 section 内容
pv-action-btn × 2（设置/分享）
```

### records / settings 视图
```
page-view（半透明毛玻璃背景）
page-back（返回按钮）
page-content（滚动内容区）
```

### share 视图
```
System / Status Bar
Background / 背景层
Overlay / 切换遮罩
Header / 返回按钮
Content / 分享主体
  Header / 头部
  Preview / 共有カード
  Section / 共有する内容
  Section / 共有先
```

share 属于 profile 后续进入的全屏文字/信息页。文本页面遮罩统一使用 `Overlay / 切换遮罩` 的 `Transition Mask / 01 暗遮罩落点`，不额外叠页面遮罩。结构上靠近 records/settings，但因为有外发预览，允许保留一个 `Preview / 共有カード` 作为输出物预览；不要把整页继续包成 panel/card。
