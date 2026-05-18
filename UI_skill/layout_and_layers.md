# 图层与版面结构

## 核心原则

图层结构要尽量反映**界面真实的行为方式**，而不只是看起来长什么样。

- 固定不动的控件，要和可滚动内容分开。
- 一个页面里的大区域，要按语义分组。
- 同类页面或同一页面的不同状态，要尽量使用同一套图层结构。
- 不要让大量文字、图标、分割线长期散落在最外层。

## 推荐页面结构

普通页面优先整理成：

- `Background / 背景层`
- `Overlay / ...`（如果需要）
- `Header / ...`
- `Content / ...`

长页面或可滚动页面优先整理成：

- `Header / 返回按钮`
- `Content / ...主体`
- 在主体内容内部继续按语义分 section

## 分组规则

### 1. 顶部导航

如果页面左上角有返回入口：

- 返回图标和对应文字要放在同一组里。
- 如果它在滚动时需要固定，就不要把它放进主内容组里。

例：

- `Header / 返回按钮`
  - `Settings / Back Icon`
  - `Settings / Eyebrow`

### 2. 页面头部内容

头像、标题、说明文字等页面头部信息，应该单独成组。

例：

- `Header / 头部`
  - 头像
  - 标题
  - 辅助说明
  - 相关小图标

### 3. 页面主体内容

如果一整块内容会一起移动、一起被复制或一起做滚动处理，就应该再包一层主体组。

例：

- `Content / 设置主体`

主体内部再按语义拆分：

- `Section / 表示`
- `Section / 记录`
- `Section / 通知`

每个 section 内可以包含：

- 分区标题
- 行项目图标
- 行项目标题
- 行项目说明
- 分割线

### 4. 分割线

- 分割线要放进它所属的 section 里。
- 不要把分割线长期散放在页面最外层。
- 分割线的位置要服务于文字节奏，不只是“有一条线”。

### 5. 状态栏

所有手机界面 Frame 顶部统一加入状态栏，用于标识真实设备 viewport。

状态栏作为系统层处理，不属于页面内容本身。

推荐命名：

- `System / Status Bar`

状态栏应独立于 `Header / ...` 和 `Content / ...`，不要放进滚动内容组，也不要参与页面主体的 mask 或滚动过渡。

推荐结构：

- `System / Status Bar`
- `Background / 背景层`
- `Overlay / ...`
- `Header / ...`
- `Content / ...`

如果页面存在滚动或动画状态，状态栏默认保持固定，不随内容移动。

状态栏样式应在同一项目中保持一致：

- 当前项目统一按 `iPhone 16` 设备模板处理
- 高度：`59px`
- 中央保留 `Dynamic Island`
- 时间、信号、Wi-Fi、电池颜色统一
- 暗色界面默认使用白色状态栏
- 不同页面不要随意改变状态栏位置、尺寸或图标风格

## 当前主界面的标准结构

目前主界面认可的结构是：

- `Background / 背景层`
- `Overlay / 底部功能遮罩`
- `功能模块`
  - `Button / 地图`
  - `Button / 记录`
  - `Button / 个人`
- `Avatar / 头像框`
- `Timeline / 时间轴`
- `Controls / 地图工具`
- `Overlay / 下拉遮罩`
- `System / Status Bar`

主界面以地图皮肤为主，不默认额外堆叠强卡片化控件。

## 当前 Feature 详情展开页的标准结构

目前个人详情展开页认可的结构是：

- `Background / 背景层`
- `Profile / 雾化区域`
- `Overlay / 下拉遮罩`
- `Overlay / 切换遮罩`
- `Content / 个人资料主体`
  - `Profile / Hero`
  - `Header / 头部`
  - `Section / 当前倾向`
  - `Section / 最近记录`
  - `Actions / 底部操作`
- `Header / 返回按钮`
- `System / Status Bar`

其中中间帧可以为了原型补间临时补透明占位层，但正式结构以展开后的完整状态为准。

## 当前 Personal 页的标准结构

### 个人地图态

- `Background / 背景层`
- `Overlay / 底部功能遮罩`
- `功能模块`
- `Avatar / 头像框`
- `Timeline / 时间轴`
- `Overlay / 下拉遮罩`
- `System / Status Bar`

### 个人记录页

- `Background / 背景层`
- `Overlay / 切换遮罩`
- `Content / 记录可视化`
  - `Header / 头部`
  - `Section / 概要`
  - `Section / 时间层`
  - `Section / 感觉分布`
- `System / Status Bar`

## 当前设置页的标准结构

目前设置页认可的结构是：

- `Background / 背景层`
- `Overlay / 切换遮罩`
- `Header / 返回按钮`
- `Content / 设置主体`
  - `Header / 头部`
  - `Section / 表示`
  - `Section / 记录`
  - `Section / 通知`

后续继续修改设置页时，默认沿用这套结构，除非交互逻辑本身发生变化。
