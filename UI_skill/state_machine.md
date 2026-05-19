# 状态机规范

这个文件记录 World Skin 当前的交互状态机，供 AI 实装和排查问题时参考。

---

## ⚠️ AI 操作原则

**状态机逻辑不明确时，必须停下来问用户，不得擅自推断实现。**

状态机是全局交互的骨架，改错比不改更难恢复。遇到以下情况一律先确认：
- 不确定某个触发点切换到哪个视图
- 不确定某个状态下哪些元素可操作
- 不确定展开/收起的触发条件
- 不确定某个视图的默认落点

---

## 状态编码方式（代码层）

| 状态维度 | 代码中的表达 |
|---|---|
| 当前视图 | `app.dataset.view`（值：`world` / `sense` / `radius` / `profile` / `records` / `settings`） |
| 导航展开 | `app.classList.contains("nav-open")` |
| 感知阶段 | `app.dataset.senseStage`（值：`idle` / `contact` / `diffusion` / `ready` / `recording` / `release` / `selecting` / `complete`） |
| 地图就绪 | `app.classList.contains("map-ready")` |

CSS 选择器跟随这些状态变化：
```css
#app[data-view="world"] ...
#app.nav-open ...
#app[data-sense-stage="ready"] ...
```

---

## 当前状态机

### 主状态：视图（data-view）

```
world（默认落点）
  ↕ nav-open 展开/收起
sense
radius（个人默认落点）
records（全屏，从 radius 进入）
settings（全屏，从 radius 进入）
profile（全屏，从 world / radius 的头像进入）
```

### 子状态：导航展开（nav-open）

仅在 `world` 和 `radius` 视图下有效。
`sense` / `profile` / `records` / `settings` 视图下导航栏整体隐藏，nav-open 无效。

---

## 完整转换表

### world 视图

| 当前状态 | 触发操作 | 结果状态 |
|---|---|---|
| world（nav-closed） | 点击底部遮罩 | world + nav-open |
| world（nav-closed） | 点击头像按钮 | world + nav-open |
| world（nav-open） | 点击「地図」nav 按钮 | world + nav-open |
| world（nav-open） | 点击「記録」nav 按钮 | sense（nav-closed） |
| world（nav-open） | 点击「個人」nav 按钮 | radius + nav-open |
| world（nav-open） | 点击空白区域 / 遮罩 | world（nav-closed） |
| world（任意） | 拖拽地图 | 地图平移，视图不变 |
| world（任意） | 拖动时间轴 | 时间偏移变化，视图不变 |

### sense 视图

| 当前状态 | 触发操作 | 结果状态 |
|---|---|---|
| sense（idle→ready） | 长按圆圈 | sense（recording） |
| sense（recording） | 松手 | sense + recordModal 弹出 |
| recordModal | 点击「記録する」 | radius（nav-closed），记录写入 |
| recordModal | 点击「破棄」 | sense，modal 关闭 |

### radius 视图

| 当前状态 | 触发操作 | 结果状态 |
|---|---|---|
| radius（nav-closed） | 点击底部遮罩 | radius + nav-open |
| radius（nav-closed） | 点击头像按钮 | radius + nav-open |
| radius（nav-open） | 点击「個人」nav 按钮 | radius + nav-open |
| radius（nav-open） | 点击「地図」nav 按钮 | world + nav-open |
| radius（nav-open） | 点击「記録」nav 按钮 | sense（nav-closed） |
| radius（任意） | 点击「記録」小按钮 | records |

### records / settings 视图

| 当前状态 | 触发操作 | 结果状态 |
|---|---|---|
| records | 点击返回按钮 | radius |
| settings | 点击返回按钮 | radius |

---

## 默认落点规则

- **进入 app** → `world`（nav-closed）
- **记录保存后** → `radius`（nav-closed）
- **records / settings 返回** → `radius`（nav-closed）
- **nav 按钮切换视图（world ↔ radius）** → 保留 `nav-open` 状态，不自动收起
- **切换到 sense / records / settings** → 自动清除 `nav-open`
- **点击空白 / 遮罩** → 清除 `nav-open`

---

## 可操作范围（各状态下）

### world（nav-closed）
- ✅ 地图拖拽 / 缩放
- ✅ 时间轴滑块
- ✅ 底部遮罩（触发展开）
- ✅ 头像按钮（触发展开）
- ✅ explore / my_location 工具按钮
- ✅ nav 按钮（淡显，可点击）
- ❌ nav 按钮高亮（仅 nav-open 时高亮）

### radius（nav-closed）
与 world（nav-closed）完全一致，额外增加：
- ✅ 「記録」小按钮（进入 records 视图）

world 和 radius 的 nav-closed 操作范围相同：地图、时间轴、遮罩、头像、工具按钮、淡显 nav 按钮均可用。

### world / radius（nav-open）
- ✅ nav 按钮（地図 / 記録 / 個人，高亮）
- ✅ 底部遮罩（点击收起）
- ✅ 空白区域（点击收起）
- ❌ 时间轴（隐藏）
- ❌ explore / my_location 工具按钮（隐藏）
- ❌ 「記録」小按钮（隐藏，radius 专属）
- ❌ 地图交互（footer-nav 全屏遮挡）

### sense
- ✅ 长按圆圈（采样）
- ❌ nav 按钮（导航栏隐藏）
- ❌ 头像（导航栏隐藏）
- ❌ 地图交互（底图可通过遮罩看到轮廓，但不可拖拽 / 缩放）

### profile / records / settings
- ✅ 当前页面内容操作
- ❌ 地图交互（底图可通过半透明遮罩看到轮廓，但不可拖拽 / 缩放）

---

## 实装注意事项

### switchView 的 nav-open 保留规则
nav 按钮切换视图（world ↔ radius）时保留 nav-open，其余情况清除：
```javascript
function switchView(view, keepNavOpen = false) {
  if (!keepNavOpen || view === "sense" || view === "records" || view === "settings") {
    app.classList.remove("nav-open");
  }
  ...
}
// nav 按钮调用时传 true
navBtns.forEach(btn => btn.addEventListener("click", () => switchView(btn.dataset.target, true)));
```
- 记录保存后 / 返回按钮 / 程序启动 → 不传 keepNavOpen，自动关闭
- 切换到 sense / records / settings → 强制关闭，不受 keepNavOpen 影响

### nav-open 时 footer-nav 全屏拦截点击
```css
#app.nav-open .footer-nav { pointer-events:auto; }
```
目的：点击 nav 按钮以外的任意位置都能收起导航。

### nav-overlay：radius 直接复用 world 的位置，不单独覆盖
radius 的 nav-overlay 不设视图专属位置，与 world 完全一致（`left:-102px; bottom:-95px; opacity:0.50`）。

**原因**：如果给 radius 设不同的 `bottom`，开关导航时 `bottom` 会在两个值之间瞬间跳变（transition 只覆盖 transform，不覆盖 bottom/left），导致动画不一致。直接复用 world 位置，只用 `transform:translateY(-40px)` 做动画，两个视图完全一致。

### z-index 被高层容器拦截 pointer-events
footer-nav 是全屏 `position:absolute; inset:0; z-index:8`，其子元素 nav-overlay 有 `pointer-events:auto`。
任何 z-index 低于 8 的元素（如 time-axis z-index:6）都会被 nav-overlay 区域拦截，导致无法拖动。

**做法**：需要保持可交互的元素（time-axis 等）z-index 必须高于 footer-nav：
```css
.time-axis { z-index:9; } /* 高于 footer-nav 的 z-index:8 */
```

### nav-overlay 位置（world / radius 统一）
`left:-102px; bottom:-95px; opacity:0.50`。radius 不单独覆盖，见上条。
