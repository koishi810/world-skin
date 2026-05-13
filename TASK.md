TASK：重做 flow｜静止 ↔ 流动 的算法与视觉逻辑

目标

重做 flow 轴的实现方式。

当前方向感表现过于生硬，容易变成风向图、轨迹图或数据可视化。新的目标是让 flow 表现为 World Skin 点阵皮肤中的“流动感”，而不是简单方向箭头。

核心逻辑：

* 不新增 flow 线。
* 不移动圆本体的网格位置。
* 不画轨迹线。
* 不拉伸整片点阵。
* 不用颜色主控 flow。
* 复用现有高度线。
* 通过高度线终点的轻微偏移、邻近点方向一致性、时间残留来表达流动。

一句话：

flow 不负责“画方向”，而负责让一片区域的高度线产生有组织的轻微偏斜，并带有时间连续感。

⸻

当前已有高度线逻辑

当前高度线位于 test0.2.html 约 line 3050 附近（历次提交后行号已更新）。

已有逻辑：

* 显示条件：cell.height > 22 && cell.strength > 0.16
* 颜色：跟圆点同色 color
* 透明度：alpha * 0.18
* 线宽：0.55
* 起点：地图表面点位 (surfaceX, surfaceY)
* 终点：圆点实际绘制位置 (x, y)
* 线长来源：heightOffset

现有高度计算：

heightOffset = cell.height * microHeightFactor * heightScale * depth

其中：

* cell.height 主要来自 strength / contrast / boundary / heightBias / senseGravity
* microHeightFactor 现在受 tension 控制微差
* heightScale 受地图 pitch 影响：约 0.36 * sin(pitch)
* depth 是屏幕纵深修正：越靠下略短 / 略弱

本次不要废弃这套高度线逻辑。
只在“终点位置”计算中加入 flow 偏移。

⸻

新的轴分工

请保持以下分工：

* 数据量 / 记录密度：控制基础透明度、显影强度、基础高度。
* spaciousness：控制平面扩散 / 收缩。
* gravity：控制浮起 / 下沉 / 高度量。
* tension：控制点阵内部明暗、高低、半径微差幅度。
* flow：控制高度线终点的偏移方向、偏移幅度、时间连续性。
* sound：控制环境激活、颗粒、起伏。
* textureModifier：控制表面材料修饰。

注意：

flow 不应再主控颜色。
flow 不应再拉伸整个点阵。
flow 不应直接改变圆的基础透明度。
flow 不应和 spaciousness / gravity / tension 的视觉主权重复。

⸻

Flow 的新定义

flow 表示静止 ↔ 流动。

静止

视觉表现：

* 高度线接近垂直。
* 终点偏移接近 0。
* 线较短或保持现有高度逻辑。
* 状态更像稳定沉积。
* 时间残留较弱。

流动

视觉表现：

* 高度线终点产生轻微斜向偏移。
* 邻近点的倾斜方向具有一定一致性。
* 偏移方向来自移动方向或聚合方向。
* 时间残留稍强。
* 画面像一片皮肤被时间轻轻带偏，而不是风向图。

⸻

视觉实现核心

现有终点大致为：

x = surfaceX

y = surfaceY - heightOffset

现在改为：

x = surfaceX + flowDx

y = surfaceY - heightOffset + flowDy

其中：

* flowDx / flowDy 是 flow 偏移。
* flowDx / flowDy 必须很小。
* 偏移必须基于高度线存在。
* 没有高度线的点，不应额外产生明显 flow 视觉噪音。

概念公式：

flowOffset = heightOffset * flowAmount * flowScale

flowVector = normalized screen-space flow direction

flowDx = flowVector.x * flowOffset

flowDy = flowVector.y * flowOffset

建议参数：

* flowScale：0.18–0.32
* flowOffsetMax：不超过 heightOffset * 0.35
* 倾斜角建议控制在 0–16°
* 极限不要超过 18°

如果 flow 太弱：

* 偏移应接近 0。
* 高度线保持接近垂直。

⸻

Flow 算法层级

真正的流动感不应只来自单个点的偏斜。请将 flow 拆成三层：

1. flow direction
    决定往哪个方向流。
2. flow coherence
    决定附近点是否朝相近方向偏移。
3. flow persistence
    决定这个流动状态是否在时间上有残留。

这三者结合，才能产生有组织的流动感。

⸻

1. flow direction：方向来源

每条记录需要有一个可用于聚合的 flow 方向。

方向来源优先级：

1. 用户记录时的移动方向
    如果 mobility 是 passing 或 slow，优先使用记录自身移动方向。
2. field 中附近记录的平均方向
    多条记录聚合后形成区域 flow direction。
3. 稳定微噪声方向
    如果记录是 still 或没有可用方向，可以使用非常弱的 seeded noise / grid hash 生成固定微偏角。
    这个微偏角只能作为 fallback，不能让画面变成随机草丛。

方向必须转换为屏幕空间。

如果方向来自经纬度移动，不要直接用 lng/lat 差值作为屏幕方向。
需要通过 map.project() 转换后再计算屏幕方向，避免地图 bearing / pitch 变化后方向错误。

方向计算原则：

* 取当前位置 lng/lat。
* 取沿 direction 稍微偏移后的 lng/lat。
* 分别使用 map.project()。
* 两个屏幕点相减。
* normalize 得到 screen direction。

⸻

2. flow coherence：方向一致性

不要让每个点只看最近一条记录。
每个 field cell 应聚合附近记录的 flow vector。

逻辑：

* 对附近记录计算 influence。
* 记录 flow direction 乘以 influence。
* 同向记录会叠加。
* 反向或混乱方向会抵消。
* 最终得到 cell.flowDir 和 cell.flowAmount。

概念：

flowX += record.flowDir.x * influence * recordFlowStrength

flowY += record.flowDir.y * influence * recordFlowStrength

weight += influence

最后：

* cell.flowDir = normalize(flowX, flowY)
* cell.flowAmount = vector length / weight

如果附近记录方向一致：

* cell.flowAmount 较高。
* 这片区域产生明显但克制的流动感。

如果附近记录方向混乱：

* flow vector 互相抵消。
* cell.flowAmount 低。
* 不要强行制造流动。

⸻

3. flow strength：记录自身流动强度

recordFlowStrength 应由多个因素组成：

* senseVector.flow
* mobility
* soundVector.turbulence
* 记录 trustScore

建议方向：

senseVector.flow：

* 静止方向：flowStrength 低。
* 中性：flowStrength 中低。
* 流动方向：flowStrength 高。

mobility boost：

* still：弱
* slow：中
* passing：强

soundVector.turbulence：

* 只做轻微加成。
* 声音起伏不能直接等于 flow。
* 声音只是环境激活的辅助。

建议范围：

* still：约 0.15–0.25
* slow：约 0.55–0.75
* passing：约 0.85–1.0
* turbulence boost：最多 +0.15

最终必须 clamp。

⸻

4. flow coherence 阈值

如果方向不够一致，不要显示明显偏斜。

建议：

* flowAmount < 0.12：几乎不偏移
* 0.12–0.42：逐渐出现偏移
* > 0.55：接近完整效果

可以使用 smoothstep 做渐进：

flowVisible = smoothstep(0.12, 0.55, flowAmount)

最终偏移：

flowOffset = heightOffset * flowVisible * flowScale

并 clamp 到：

flowOffset <= heightOffset * 0.35

⸻

5. 邻域平滑

如果每个 cell 的 flow direction 差异太大，会像杂草。

请对 flow field 做 1–2 次轻量邻域平滑：

* 平滑 flowDir
* 平滑 flowAmount
* 不要过度平滑
* 不要让全图变成同一个方向

目标：

* 局部形成连续流带。
* 不出现每个点各自乱歪。
* 保留不同区域的差异。

⸻

6. flow persistence：时间残留

flow 高的区域应该有轻微时间残留，而不是只在当前时间点突然出现。

如果当前系统已有时间轴 / hour field，请让 flow 影响时间混合窗口：

* flow 低：时间窗口较窄，更像当前时间切片。
* flow 高：时间窗口稍宽，前后时间状态残留更明显。

方向：

* 静止区域：旧记录衰减更快，状态更稳定。
* 流动区域：前后小时影响稍强，状态过渡更连续。

注意：

* 不要大改时间轴。
* 不要让 flow 覆盖现有时间权重系统。
* 只做轻微增强。
* 如果当前时间系统不便接入，可以先只在 field 聚合中增加 flow 高记录的 timeSigma / timeWeight 宽度。

⸻

7. 高度线偏移与现有高度线关系

本次只修改现有高度线和圆点终点。

请保持：

* 高度线显示条件仍然基于高度和强度。
* 高度线颜色仍然跟圆点同色。
* 高度线透明度仍然克制。
* 高度线线宽仍然克制。
* 不新增第二条线。
* 不新增 flow 专用线。

加入 flow 后：

* 起点仍然是 (surfaceX, surfaceY)。
* 终点变为 flow 偏移后的圆点绘制位置。
* 圆点绘制位置也使用同一个偏移后的终点。
* 线始终连接 surface 与 circle，不出现断裂。

⸻

8. 与 gravity 和 tension 的关系

请保持清晰分工：

gravity

控制高度量 / 浮起与下沉：

* 决定 heightOffset 的主要风格。
* 不决定方向。

tension

控制高度与明暗微差：

* 影响 microHeightFactor 或同类微差。
* 不决定整体流动方向。

flow

控制高度向量偏斜：

* 不决定高度本身。
* 不决定微差幅度。
* 只决定终点偏移方向和偏移幅度。

最终：

* gravity：线有多长 / 浮起有多少。
* tension：相邻点高度差是否释放。
* flow：线往哪边偏。

⸻

9. 与数据量和声音的关系

数据量 / 记录密度：

* 继续控制基础 alpha、strength、base height。
* 不要被 flow 覆盖。

声音轴：

* 继续控制环境激活、grain、turbulence、sharpness。
* soundVector.turbulence 可以轻微增强 flowStrength。
* 但声音起伏不能直接等于 flow。
* 嘈杂但静止的地方应该仍然可以保持稳定形态。
* 安静但流动的地方应该仍然可以有轻微时间流动感。

⸻

10. 禁止事项

不要做以下事情：

* 不要新增 flow 线。
* 不要画箭头。
* 不要画轨迹线。
* 不要画 corridor polyline。
* 不要画风向图。
* 不要点与点连线。
* 不要把圆整体随机移动。
* 不要恢复 jitter。
* 不要新增粒子动画。
* 不要用颜色主控 flow。
* 不要把点阵拉成长条。
* 不要破坏 screen-stable dot density。
* 不要让地图拖动 / 缩放失效。
* 不要让 flow 在地图旋转 / pitch 后方向错乱。
* 不要每帧重新进行 dots × records 暴力计算。

⸻

11. 性能要求

flow 计算应接入现有 field 聚合，不要新增高成本逐点计算。

要求：

* records 聚合到 field cell 时计算 flow。
* dot render 时只采样 cell.flowDir / cell.flowAmount。
* 不要每个点遍历所有 records。
* 不要每个点创建复杂对象。
* 不要每个点创建 gradient。
* 不要使用 shadowBlur。
* move 时轻量重投影。
* zoomend / moveend / time change / new record 后 debounce 重建 field。
* idle 时不持续重算。

⸻

12. 验收标准

完成后应满足：

* 静止区域高度线接近垂直。
* 流动区域高度线轻微倾斜。
* 圆点仍然稳定，不闪烁。
* 没有新增线条系统。
* 没有轨迹线、箭头、风向图感。
* 倾斜方向与记录移动方向 / 聚合方向基本一致。
* 附近点的倾斜方向具有局部一致性。
* 方向混乱的区域不会强行流动。
* 拖动时间轴时，flow 高的区域状态更连续。
* 地图旋转 / pitch 后方向仍然合理。
* 手机端性能不明显下降。
* 整体仍然像 World Skin 点阵皮肤。

⸻

13. MAP_LOG 更新要求【已完成 / 2026-05-13】

MAP_LOG 已追加 "Flow Height-Line Direction Refactor / 2026-05-13" 条目，内容已与本任务规格对齐。