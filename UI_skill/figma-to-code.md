# Figma → Code 1:1 复刻流程

## 使用时机

当用户要求「1:1复刻Figma设计稿」「像素级还原」「所有间距必须对上」时，强制走此流程，不得凭感觉估值，不得自己发明任何样式。

---

## 第一步：要求用户提供的资源

在开始写任何代码之前，必须向用户索取以下内容：

### 1. 每个界面的 FigmaToCode 插件输出

**用户操作**：
1. 打开 Figma 桌面 App
2. 选中要实现的 Frame（每次一个）
3. 运行插件 **"Figma to Code (HTML, Tailwind, Flutter, SwiftUI)"**
4. 选择 **HTML** 模式
5. 复制全部输出，粘贴给 AI

**需要的界面**：先问清楚要实现哪些界面，逐一收集，不要遗漏。

### 2. 图片/SVG 资产

**用户操作**：选中 Figma 中的图片/矢量图层 → 右键 Export → 导出到本地

**AI 操作**：若已接入 Figma MCP，可用 `get_design_context` 批量下载资产 URL（需用户在 Figma 中先选中对应节点）。

---

## 第二步：解读 FigmaToCode 输出

插件输出的是 **绝对定位的 inline-style HTML**，以 Figma Frame 的宽高为坐标系。

### 关键规则

**坐标系**：所有 `left` / `top` 值以 Frame 左上角为原点（如 393×852 的手机 Frame）。

**底部元素必须转换为 `bottom` 定位**：

```
bottom = frame_height - top - element_height
```

例：Frame 高 852px，元素 `top:786px; height:35px`
→ `bottom = 852 - 786 - 35 = 31px`

这样在不同视口高度下元素始终贴底，不会被截断。

**常见元素处理**：

| FigmaToCode 输出 | 实现要点 |
|---|---|
| `backdrop-filter: blur(Xpx)` | 必须实现，这是毛玻璃效果的核心，绝对不能省略 |
| `filter: blur(Xpx)` | 模糊元素自身（区别于 backdrop-filter），同样必须实现 |
| `opacity: 0.XX` | 直接用，不要修改 |
| `box-shadow` | 直接用，不要修改 |
| `font-family: Material Icons` | 需要引入 Google Material Icons CDN |
| 没有 `background` 属性 | 说明背景是透明的，不要自己加背景色 |
| `border-radius: 9999px` | 圆形，直接用 |

### 1:1 原则

- **插件输出有的** → 必须实现，一个都不能少
- **插件输出没有的** → 绝对不能自己加（不能加背景、不能加阴影、不能加边框）
- **看不懂的元素** → 问用户，不要猜

---

## 第三步：资产文件处理

### SVG 资产的常见陷阱

从 Figma MCP 下载的资产文件，即使扩展名是 `.png`，内容可能是 SVG XML。

**验证方法**：
```bash
file your-asset.png
# 如果输出 "SVG Scalable Vector Graphics image" → 必须改扩展名
```

**修复方法**：
```bash
mv asset.png asset.svg
```

并同步更新 HTML 中所有引用路径。

### SVG 颜色变量

Figma 导出的 SVG 中常含 `var(--stroke-0, #D9D9D9)` 这类 CSS 变量。
- 作为 `<img src>` 使用时，变量不生效，使用 fallback 值（通常是灰白色）
- 这是正常的，fallback 颜色即为设计稿中的颜色

---

## 第四步：CSS 覆盖顺序注意事项

### 核心原则：基础 CSS 是草稿，移动端 shell 永远优先

本项目的基础 CSS 是随便写的草稿，不是正式设计。**当基础 CSS 与移动端 shell 冲突时，直接在 shell 里覆盖，不需要分析基础 CSS 的意图，也不需要保留兼容性。**

遇到基础 CSS 的属性泄漏：直接写覆盖规则，不要犹豫。

---

当项目存在「基础 CSS + 移动端覆盖 CSS」两层时：

**基础 CSS 的某些属性会「泄漏」到移动端**，常见：
- `opacity`：基础层对某个 view 设置了 `opacity:0.56`，移动端覆盖必须显式写 `opacity:1`
- `backdrop-filter`：基础层设了 `blur(12px)`，移动端覆盖必须显式写 `backdrop-filter: none`
- `border`：同理，必须显式 `border: 0`
- `background`：同理，必须显式 `background: transparent`
- `pointer-events`：基础层设置的会继承，需要显式覆盖

规则：**移动端覆盖层必须对每个需要重置的属性都显式写出来，不能依赖「不写就是没有」的假设。**

---

## 第五步：验证

实现完一个界面后：

1. 截图与 Figma 设计稿并排对比
2. 检查间距：用浏览器 DevTools 测量关键元素的 `left`/`top`/`bottom`，与 FigmaToCode 数值核对
3. 检查是否有多余样式（背景色、边框、阴影）未出现在 Figma 输出中
4. 检查毛玻璃效果是否生效（`backdrop-filter` 需要元素背后有内容才可见）

---

## 常见错误清单

| 错误 | 正确做法 |
|---|---|
| 自己估算间距 | 必须从 FigmaToCode 输出读取 |
| 给没有背景的元素加背景色 | 插件没有 background → 保持透明 |
| 用 `top` 定位底部元素 | 换算成 `bottom` |
| SVG 文件用 `.png` 扩展名 | 改成 `.svg` |
| 忘记覆盖基础 CSS 的 `backdrop-filter` | 显式写 `backdrop-filter: none` |
| 界面收集不完整就开始写代码 | 先收集所有界面的插件输出再动手 |
| 遇到看不懂的元素自己发明 | 问用户 |
| 发现图片/SVG缺失就直接问用户 | 先查 `assets/figma/` 和 `素材0.x/`，找到直接用 |
