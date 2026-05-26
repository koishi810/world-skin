# 命名规范

Figma 图层命名习惯。

---

## 原则

名称表达语义，不表达外观。帮助后续判断：这是哪一层、属于哪个区域、承担什么功能。

---

## 推荐格式

`英文类别 / 中文语义`

```
Header / 返回按钮
Header / 头部
Content / 设置主体
Section / 最近记录
Actions / 底部操作
System / Status Bar
Background / 背景层
Overlay / 底部功能遮罩
```

## 避免

```
Group 1
Rectangle 2
Layer 5
```

临时阶段可先用，页面方向确定后应及时整理。

---

## 特殊约定

- **01 组件表格**：`01_Components` 顶层 section 内统一使用 `table > row > Row-head / cell > item`。这些结构名保持英文小写，不翻译成中文，方便快速识别表格层级
- **返回按钮**：即使看起来像标题，也命名为 `Header / 返回按钮`，不要用 `Header / 标题`
- **无法语义区分的子图层**：不要强行猜测功能名。继承父级语义名并加两位编号，例如 `Nav Button / Sense Open` 下的多个 Vector 命名为 `SenseOpen01`、`SenseOpen02`、`SenseOpen03`
- **SVG 导入空壳组**：如果 `Mask Group / ...`、`Icon Paths / ...` 这类组没有真实 mask（子节点 `isMask=false`），不要保留，直接展平成父级下的 Vector。只有确实承担裁切、状态切换或语义分组时才保留组
- **过渡帧**：在 Frame 底部外侧加小文字备注说明用途，不要把「中间帧」写进图层名
- **测试用 Frame**：在 Frame 底部外侧加 `测试用途：...` 备注，不进入 UI 画面内部
