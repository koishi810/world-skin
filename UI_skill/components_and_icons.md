# 组件与图标

记录已验证的控件实装方式。

---

## 返回按钮

- 实装为「图标 + 文字」在同一个 `<button>` 里
- 整体都可点击，不只是图标区域
- 位置：`left:18px; top:51px`（profile 视图），使用 Figma 实际值
- 图标用 Material Icons `chevron_left`，18px

```html
<button class="pv-back" id="profileBack" type="button">
  <span class="material-icons">chevron_left</span>
  <span class="pv-title">プロフィール</span>
</button>
```

**注意**：不要把按钮放在绝对定位的包裹 div 里再对子元素做绝对定位——子元素的 top/left 会相对包裹 div 计算，不是相对 frame，位置会错。

---

## 底部导航（nav-btn）

- 三个圆圈按钮，使用 SVG 图标
- 默认 `opacity:0.28`（淡显，可见但不突出）
- nav-open 时 `opacity:0.68`，active 时 `opacity:1`
- 使用 `pointer-events:none` 默认，nav-open 时开启
- 位置从 Figma 值换算（frame 高 852px 换算 bottom）

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

## 图标使用

- 优先 Material Icons（已引入 CDN）
- 图标服务功能识别，不抢页面主导权
- 地图主界面不用边缘清晰的卡片化按钮
