# 界面类型规范

记录各类界面的角色、实装状态和结构约定。

区分标注：
- ✅ 已在 test0.3 实装并验证
- 🔲 Figma 有设计稿但还没实装
- ❓ 方向未定

---

## ⚠️ AI 操作原则

状态机逻辑不明确时必须先找用户确认，不得擅自推断。  
详见 `state_machine.md`。

---

## 1. 主界面 / world 视图 ✅

**角色**：app 默认落点，地图皮肤优先，控件轻量存在。

**已验证结构**：
- 地图 canvas 全屏渲染
- 底部 nav-overlay + nav-btn（淡显，展开后高亮）
- 头像按钮（右上，点击展开导航）
- 时间轴滑块（底部，nav-open 时隐藏）
- utility 按钮（nav-open 时隐藏）

**默认落点**：进入 app → world（nav-closed）

---

## 2. 个人界面 / radius 视图 ✅

**角色**：个人地图视图。与 world 视图完全一致，额外增加一个「記録」按钮。

**实装原则（已验证）**：
- radius = world 的直接复用，不单独重建视觉层
- 只新增 `.personal-records-btn`（nav-open 时同样隐藏）
- nav-overlay 复用 world 的位置，不设视图专属值（见 state_machine.md）

**默认落点**：记录保存后 → radius（nav-closed）

---

## 3. 采样流程 / sense 视图 ✅（基础版）

**角色**：从主界面进入采样、完成呼吸、进入感知词选择、写入记录的连续过程。

**已实装**：长按 → 录制 → 情绪词选择 → 保存/放弃  
**已更新**：Figma 02–11 状态帧已合并进同一个 `sense` 视图，以素材层 + `data-sense-stage` 驱动

**导航栏**：sense 视图下 footer-nav 和头像整体隐藏。
**地图操作**：sense 视图下底图可见但不可拖拽 / 缩放。

**Figma 状态帧实装规则（2026-05-19）**：
- 11 个 Sense Figma frame 统一实装为一个 `sense` 视图的多阶段状态，不新增独立页面
- 接触层显影 / 雾面扩散 / 长按开始 / 长按结束等 frame 作为动画关键帧
- 情绪选择 08 / 09 是正式词选落点，词团位置和大小按 Figma 坐标实现
- 记录完成 11 是正式收束落点，显示安静核心和「記録されました」
- 旧的 CSS 渐变雾层 / breath-ring / sense-core 已移除，视觉完全由 Figma 拆分素材层承担
- Sense 背景必须由 Figma 灰雾遮罩层接管；地图只保留低对比轮廓，不显示旧提示文字或旧词选文字
- Sense prototype 的背景层按 Figma 坐标复刻：`Background / 背景层` 使用导出的地图图像，`上滑遮罩` 使用 917×1338 blur 黑色层，`底部功能遮罩` 和 `下拉遮罩` 使用本地 SVG 资产
- Sense 文案不是占位文字，必须还原：04 的长按提示、08/09 的提示句和三组词均按 Figma 坐标显示
- 采样中的核心变化不是线性缩放：按 4s 缓慢膨胀、2s 轻微浮动、4s 缓慢收缩消失的气球式曲线实现
- 词选圆团不应每次固定，位置和大小围绕 Figma 基准点随机化，并保留中心小圆残影

---

## 4. 记录页 / records 视图 ✅

**角色**：个人记录统计，从 radius 视图进入，返回 radius。

**实装结构**：page-view（半透明毛玻璃遮罩）+ 返回按钮 + 内容区

---

## 5. 设置页 / settings 视图 ✅（结构完成）

**角色**：低频系统选项，文字型信息页。从 radius 进入，返回 radius。

**实装结构**：page-view + 返回按钮 + 滚动内容区

---

## 6. 个人资料页 / profile 视图 ✅（静态版）

**角色**：头像详情页。nav-open 时点击头像进入，返回进来之前的视图（world 或 radius）。

**已实装**：
- 半透明遮罩下保留地图轮廓，但地图不可操作
- 大头像（234×234，圆形）+ 姓名 + 地区件数
- 今の傾向（动态填充 top 3 感知词）
- 最近の記録（动态填充）
- 底部设置 / 分享按钮
- 返回按钮（< プロフィール 整体可点击）
- pointer-events:auto 需显式设置（.view.active 不自动开启）

**待做**：中间帧动效（Feature / 04 大头像出现）

---

## 7. 分享页 / share 视图 🔲（Figma 初稿）

**角色**：从个人资料页的分享按钮进入，生成一张可外发的个人感知摘要。

**Figma 位置**：`05_Record Visualizations` → `Feature States / 三个功能` → `Share / 01 共有`

**结构约定**：
- `System / Status Bar`
- `Background / 背景层`
- `Overlay / 切换遮罩`
- `Header / 返回按钮`
- `Content / 分享主体`
  - `Header / 头部`
  - `Preview / 共有カード`
  - `Section / 共有する内容`
  - `Section / 共有先`

**设计原则**：
- 共享的是「个人感知摘要」，不是社交动态卡片
- 视觉参考个人界面和记录数据界面：暗地图、轻文字、低对比预览、细分割线
- 文本页面遮罩统一使用 `Overlay / 切换遮罩` 的 `Transition Mask / 01 暗遮罩落点`，不额外叠 `Overlay / 页面遮罩`
- 分享预览可以作为一个被框定的输出物存在，但页面本身不做卡片堆叠
- 可见文案保持日文；内部图层名保持中英语义结构
- 当前入口、最终用途和外发格式仍待确认，因此标为 Figma 初稿

---

## 页面 pointer-events 注意事项（已验证）

`.view.active` 不自动设置 `pointer-events:auto`。  
page-view（records/settings）和 profile view 都需要显式加：
```css
#view-profile.active,
#view-records.active,
#view-settings.active { pointer-events:auto; }
```
